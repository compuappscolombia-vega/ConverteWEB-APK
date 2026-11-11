import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Helper to solve InfinityFree slowAES challenge if present
async function fetchWithAntiBotBypass(targetUrl: string, mobileUserAgent: string): Promise<{ html: string; status: number }> {
  const headers = {
    'User-Agent': mobileUserAgent,
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
  };

  const initialRes = await fetch(targetUrl, { headers });
  const initialText = await initialRes.text();

  // Check if it's the InfinityFree / iFastNet aes.js challenge
  if (initialText.includes('/aes.js') && initialText.includes('slowAES')) {
    try {
      const urlObj = new URL(targetUrl);
      const aesUrl = `${urlObj.origin}/aes.js`;
      const aesJs = await fetch(aesUrl, { headers }).then(r => r.text());

      const regex = /toNumbers\(["\x27]([a-f0-9]+)["\x27]\)/g;
      const matches = [...initialText.matchAll(regex)];
      if (matches.length >= 3) {
        const hexA = matches[0][1];
        const hexB = matches[1][1];
        const hexC = matches[2][1];

        // Decrypt using slowAES
        const decryptRunner = new Function(`
          ${aesJs}
          function toNumbers(d){var e=[];d.replace(/(..)/g,function(d){e.push(parseInt(d,16))});return e}
          function toHex(){for(var d=[],d=1==arguments.length&&arguments[0].constructor==Array?arguments[0]:arguments,e="",f=0;f<d.length;f++)e+=(16>d[f]?"0":"")+d[f].toString(16);return e.toLowerCase()}
          var a=toNumbers("${hexA}"),b=toNumbers("${hexB}"),c=toNumbers("${hexC}");
          return toHex(slowAES.decrypt(c,2,a,b));
        `);
        const cookieVal = decryptRunner();

        // Fetch verified page with the __test cookie
        const verifiedRes = await fetch(`${targetUrl}${targetUrl.includes('?') ? '&' : '?'}i=1`, {
          headers: {
            ...headers,
            'Cookie': `__test=${cookieVal}`
          }
        });
        const verifiedHtml = await verifiedRes.text();
        return { html: verifiedHtml, status: verifiedRes.status };
      }
    } catch (e) {
      console.error('Error solving slowAES challenge:', e);
    }
  }

  return { html: initialText, status: initialRes.status };
}

// Proxy endpoint that removes X-Frame-Options and bypasses iframe blockers
app.get('/api/proxy', async (req: Request, res: Response) => {
  const targetUrl = req.query.url as string;
  if (!targetUrl) {
    return res.status(400).send('URL requerida');
  }

  try {
    const validUrl = targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`;
    const mobileUA = 'Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36';

    const { html } = await fetchWithAntiBotBypass(validUrl, mobileUA);

    // Inject <base href="..."> so all relative links, CSS, images, and JS load cleanly from the original host
    const urlObj = new URL(validUrl);
    const baseTag = `<base href="${urlObj.origin}${urlObj.pathname.endsWith('/') ? urlObj.pathname : urlObj.pathname + '/'}">`;
    
    // Inject mobile viewport and frame permission overrides
    let modifiedHtml = html;
    if (modifiedHtml.includes('<head>')) {
      modifiedHtml = modifiedHtml.replace('<head>', `<head>${baseTag}`);
    } else if (modifiedHtml.includes('<head ')) {
      modifiedHtml = modifiedHtml.replace(/<head[^>]*>/, `$&${baseTag}`);
    } else {
      modifiedHtml = `${baseTag}${modifiedHtml}`;
    }

    // Set permissive frame headers so it loads seamlessly in the app
    res.removeHeader('X-Frame-Options');
    res.removeHeader('Content-Security-Policy');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(modifiedHtml);
  } catch (err: any) {
    console.error('Proxy error:', err);
    res.status(500).send(`Error al cargar sitio web: ${err.message}`);
  }
});

// Endpoint to inspect and auto-extract metadata from target site (title, theme color, icons)
app.get('/api/inspect-site', async (req: Request, res: Response) => {
  const targetUrl = req.query.url as string;
  if (!targetUrl) {
    return res.status(400).json({ error: 'URL requerida' });
  }

  try {
    const validUrl = targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`;
    const mobileUA = 'Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36';
    const { html } = await fetchWithAntiBotBypass(validUrl, mobileUA);

    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : 'Mi Aplicación';

    const themeColorMatch = html.match(/<meta[^>]*name=["']theme-color["'][^>]*content=["']([^"']+)["']/i);
    const themeColor = themeColorMatch ? themeColorMatch[1] : '#0f172a';

    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    const description = descMatch ? descMatch[1] : '';

    res.json({
      title,
      themeColor,
      description,
      url: validUrl,
      success: true
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Web2APK Server running on port ${PORT}`);
  });
}

startServer();
