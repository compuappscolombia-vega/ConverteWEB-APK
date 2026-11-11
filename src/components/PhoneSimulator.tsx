import React, { useState, useEffect, useRef } from 'react';
import { 
  Wifi, 
  Battery, 
  ArrowLeft, 
  ArrowRight,
  RefreshCw, 
  Globe, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  Smartphone,
  Sparkles
} from 'lucide-react';
import { ApkConfig } from '../types/apkConfig';
import { downloadDirectApk } from '../utils/apkDirectBuilder';

interface PhoneSimulatorProps {
  config: ApkConfig;
  onUpdateConfig: (newConfig: Partial<ApkConfig>) => void;
  activeDemo: string;
  setActiveDemo: (demoId: string) => void;
}

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({
  config,
  onUpdateConfig,
}) => {
  const [deviceModel, setDeviceModel] = useState<'pixel' | 'galaxy'>('pixel');
  const [currentTime, setCurrentTime] = useState('12:00');
  const [urlInput, setUrlInput] = useState(config.webUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [useProxy, setUseProxy] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isDirectDownloading, setIsDirectDownloading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setUrlInput(config.webUrl);
  }, [config.webUrl]);

  // Update clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  // Compute the iframe src: either through the server proxy or direct
  const computedSrc = useProxy
    ? `/api/proxy?url=${encodeURIComponent(config.webUrl)}`
    : config.webUrl;

  const handleApplyUrl = () => {
    let target = urlInput.trim();
    if (!target) return;
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      target = `https://${target}`;
    }
    setUrlInput(target);
    setIsLoading(true);
    setLoadError(null);
    onUpdateConfig({ webUrl: target });
  };

  const handleReload = () => {
    setIsLoading(true);
    setLoadError(null);
    if (iframeRef.current) {
      iframeRef.current.src = computedSrc;
    }
  };

  const handleDownloadDirectApk = async () => {
    try {
      setIsDirectDownloading(true);
      await downloadDirectApk(config);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDirectDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Top Device Bar */}
      <div className="w-full max-w-md mb-3 flex items-center justify-between gap-2 px-1 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-300">Resolución:</span>
          <button
            onClick={() => setDeviceModel('pixel')}
            className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
              deviceModel === 'pixel'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Pixel (412x915)
          </button>
          <button
            onClick={() => setDeviceModel('galaxy')}
            className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
              deviceModel === 'galaxy'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Galaxy (360x780)
          </button>
        </div>

        <button
          onClick={handleDownloadDirectApk}
          disabled={isDirectDownloading}
          title="Descarga el archivo APK instalable generado para esta web"
          className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg shadow-md shadow-emerald-500/20 transition-all text-xs"
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{isDirectDownloading ? 'Generando...' : 'Descargar .APK Directo'}</span>
        </button>
      </div>

      {/* URL Input Bar */}
      <div className="w-full max-w-md mb-3 bg-slate-900 border border-slate-800 rounded-xl p-2 flex items-center gap-2 shadow-sm">
        <Globe className="w-4 h-4 text-emerald-400 shrink-0 ml-1" />
        <input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleApplyUrl();
          }}
          placeholder="https://tu-sitio-web.com"
          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
        />
        <button
          onClick={handleApplyUrl}
          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shrink-0"
        >
          Cargar Web
        </button>
        <a
          href={config.webUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Abrir en pestaña nueva"
          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors shrink-0"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Real Mobile Smartphone Frame */}
      <div 
        className={`relative w-[360px] h-[720px] bg-slate-950 border-[10px] ${
          deviceModel === 'galaxy' 
            ? 'rounded-[38px] border-slate-700 shadow-2xl shadow-black/80' 
            : 'rounded-[46px] border-slate-800 shadow-2xl shadow-emerald-950/20'
        } overflow-hidden flex flex-col`}
      >
        {/* Native Android Status Bar */}
        <div 
          className="w-full h-8 px-6 flex items-center justify-between text-[11px] font-semibold shrink-0 select-none z-30 transition-colors"
          style={{ 
            backgroundColor: config.statusBarColor || config.themeColor || '#0f172a',
            color: '#ffffff'
          }}
        >
          <span>{currentTime}</span>

          {/* Punch-hole Camera */}
          <div className="w-3.5 h-3.5 rounded-full bg-black border border-slate-800 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono">5G</span>
            <Wifi className="w-3.5 h-3.5 opacity-90" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] font-mono">100%</span>
              <Battery className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Real Website Viewport */}
        <div className="relative flex-1 bg-white overflow-hidden flex flex-col">
          {isLoading && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center z-20 text-white gap-2">
              <RefreshCw className="w-7 h-7 text-emerald-400 animate-spin" />
              <span className="text-xs font-semibold text-slate-300">Cargando sitio web real...</span>
            </div>
          )}

          {loadError ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-950 text-slate-300">
              <AlertCircle className="w-10 h-10 text-amber-400 mb-2" />
              <h4 className="text-sm font-bold text-white mb-1">Error al conectar con la web</h4>
              <p className="text-xs text-slate-400 max-w-[260px] mb-4">{loadError}</p>
              <button
                onClick={handleReload}
                className="px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-bold rounded-xl"
              >
                Reintentar Carga
              </button>
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              key={computedSrc}
              src={computedSrc}
              title={config.appName}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setLoadError('No se pudo cargar el sitio web en el visor.');
              }}
              className="w-full h-full border-0 bg-white"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
            />
          )}
        </div>

        {/* Bottom Hardware Android Navigation Area */}
        <div 
          className="w-full h-8 flex items-center justify-around px-8 shrink-0 select-none z-30 transition-colors bg-slate-950 border-t border-slate-900"
          style={{ backgroundColor: config.navBarColor || '#0f172a' }}
        >
          <button 
            onClick={() => {
              if (iframeRef.current && iframeRef.current.contentWindow) {
                iframeRef.current.contentWindow.history.back();
              }
            }}
            title="Atrás (history.back)"
            className="p-1 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={handleReload}
            title="Recargar página"
            className="w-20 h-1 rounded-full bg-slate-500/70 hover:bg-slate-300 transition-colors"
          />
          <button 
            onClick={handleReload}
            title="Refrescar vista"
            className="p-1 text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Real Website Status Banner */}
      <div className="w-full max-w-md mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-2 truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
          <span className="truncate">
            Sitio: <strong className="text-slate-200">{config.webUrl}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setUseProxy(!useProxy)}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
              useProxy 
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' 
                : 'bg-slate-800 text-slate-400'
            }`}
            title="El proxy resuelve cookies anti-bot y encabezados X-Frame-Options automáticamente"
          >
            Proxy {useProxy ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>
    </div>
  );
};
