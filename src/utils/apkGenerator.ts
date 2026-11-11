import { ApkConfig, FileItem } from '../types/apkConfig';

/**
 * Generates all production-ready Android Studio project files
 * tailored to preserve 100% of the web application's responsive behavior.
 */
export function generateAndroidProjectFiles(config: ApkConfig): FileItem[] {
  const packagePath = config.packageName.replace(/\./g, '/');
  const isKotlin = config.codeLanguage === 'kotlin';
  
  const manifestFile: FileItem = {
    name: 'AndroidManifest.xml',
    path: 'app/src/main/AndroidManifest.xml',
    language: 'xml',
    description: 'Permisos del sistema Android, intent-filters, soporte de pantalla y configuración de seguridad.',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="${config.packageName}">

    <!-- Permisos de Red Obligatorios para WebView -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
${config.allowCameraUploads ? `
    <!-- Permisos para subir fotos y usar la cámara en la web -->
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
    <uses-feature android:name="android.hardware.camera" android:required="false" />` : ''}
${config.allowGeolocation ? `
    <!-- Permisos de Ubicación / GPS -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />` : ''}
${config.allowFileDownloads ? `
    <!-- Permiso de Descarga de Archivos -->
    <uses-permission android:name="android.permission.DOWNLOAD_WITHOUT_NOTIFICATION" />` : ''}
${config.keepScreenOn ? `
    <!-- Mantener pantalla activa -->
    <uses-permission android:name="android.permission.WAKE_LOCK" />` : ''}

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.WebToApk"
        android:hardwareAccelerated="${config.hardwareAcceleration}"
        android:networkSecurityConfig="@xml/network_security_config"
        android:usesCleartextTraffic="true"
        tools:targetApi="34">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|screenLayout|smallestScreenSize|uiMode"
            android:screenOrientation="${config.orientation}"
            android:windowSoftInputMode="adjustResize">
            
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>

            <!-- Soporte para abrir enlaces web directamente dentro de la app -->
            <intent-filter android:autoVerify="true">
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="https" android:host="${getHostFromUrl(config.webUrl)}" />
            </intent-filter>
        </activity>
${config.allowCameraUploads ? `
        <!-- FileProvider para permitir capturar fotos y adjuntar archivos sin errores de URI -->
        <provider
            android:name="androidx.core.content.FileProvider"
            android:authorities="${config.packageName}.fileprovider"
            android:exported="false"
            android:grantUriPermissions="true">
            <meta-data
                android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/file_paths" />
        </provider>` : ''}
    </application>
</manifest>`
  };

  const mainActivityFile: FileItem = isKotlin ? {
    name: 'MainActivity.kt',
    path: `app/src/main/java/${packagePath}/MainActivity.kt`,
    language: 'kotlin',
    description: 'Controlador nativo en Kotlin con WebView optimizado, control de retroceso y carga de archivos.',
    content: `package ${config.packageName}

import android.annotation.SuppressLint
import android.content.ActivityNotFoundException
import android.content.Intent
import android.graphics.Bitmap
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.view.View
import android.view.WindowManager
import android.webkit.*
import android.widget.ProgressBar
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.WindowCompat
${config.pullToRefresh ? 'import androidx.swiperefreshlayout.widget.SwipeRefreshLayout\n' : ''}
class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var progressBar: ProgressBar
${config.pullToRefresh ? '    private lateinit var swipeRefresh: SwipeRefreshLayout\n' : ''}
    private var fileUploadCallback: ValueCallback<Array<Uri>>? = null
    private var backPressedTime: Long = 0

    private val fileChooserLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (fileUploadCallback == null) return@registerForActivityResult
        val results = WebChromeClient.FileChooserParams.parseResult(result.resultCode, result.data)
        fileUploadCallback?.onReceiveValue(results)
        fileUploadCallback = null
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Edge-to-Edge y barra de estado profesional
        WindowCompat.setDecorFitsSystemWindows(window, ${config.displayMode !== 'fullscreen'})
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        progressBar = findViewById(R.id.progressBar)
${config.pullToRefresh ? '        swipeRefresh = findViewById(R.id.swipeRefresh)\n' : ''}
        setupWebView()
        setupBackNavigation()

        if (isNetworkAvailable()) {
            webView.loadUrl("${config.webUrl}")
        } else {
            showOfflinePage()
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        val settings = webView.settings

        // 1. Compatibilidad Total con Tecnologías Web Modernas
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = ${config.domStorageEnabled}
        settings.databaseEnabled = ${config.databaseEnabled}
        settings.allowFileAccess = true
        settings.allowContentAccess = true
        settings.loadsImagesAutomatically = true
        settings.mediaPlaybackRequiresUserGesture = false

        // 2. Optimización de Viewport Responsive (sin zooms que rompan la UI móvil)
        settings.useWideViewPort = true
        settings.loadWithOverviewMode = true
        settings.builtInZoomControls = false
        settings.displayZoomControls = false
        settings.setSupportZoom(false)

        // 3. Caché y Aceleración
        settings.cacheMode = WebSettings.${config.cacheMode}

        // 4. Cookies Persistentes y de Sesión
        val cookieManager = CookieManager.getInstance()
        cookieManager.setAcceptCookie(${config.cookiesEnabled})
        cookieManager.setAcceptThirdPartyCookies(webView, ${config.thirdPartyCookies})

        // 5. User-Agent Móvil Puro
${config.customUserAgent ? `        settings.userAgentString = "${config.customUserAgent}"\n` : `        // Preserva el User-Agent móvil de Chrome para no recibir redirecciones desktop\n`}
        // Configuración de WebViewClient para gestionar navegación interna e intents
        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url?.toString() ?: return false

                // Interceptar esquemas nativos: WhatsApp, Teléfono, Email, Mapas
                if (url.startsWith("tel:") || url.startsWith("mailto:") || url.startsWith("whatsapp:") || url.startsWith("intent:")) {
                    try {
                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                        startActivity(intent)
                        return true
                    } catch (e: ActivityNotFoundException) {
                        Toast.makeText(this@MainActivity, "Aplicación no instalada para este enlace", Toast.LENGTH_SHORT).show()
                        return true
                    }
                }
                return false
            }

            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                progressBar.visibility = View.VISIBLE
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                progressBar.visibility = View.GONE
${config.pullToRefresh ? '                swipeRefresh.isRefreshing = false\n' : ''}
            }

            override fun onReceivedError(view: WebView?, request: WebResourceRequest?, error: WebResourceError?) {
                if (request?.isForMainFrame == true) {
                    showOfflinePage()
                }
            }
        }

        // Configuración de WebChromeClient para subida de fotos y barra de progreso
        webView.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                progressBar.progress = newProgress
            }

            override fun onShowFileChooser(
                webView: WebView?,
                filePathCallback: ValueCallback<Array<Uri>>?,
                fileChooserParams: FileChooserParams?
            ): Boolean {
                fileUploadCallback?.onReceiveValue(null)
                fileUploadCallback = filePathCallback

                val intent = fileChooserParams?.createIntent() ?: Intent(Intent.ACTION_GET_CONTENT).apply {
                    type = "*/*"
                    addCategory(Intent.CATEGORY_OPENABLE)
                }

                try {
                    fileChooserLauncher.launch(intent)
                } catch (e: Exception) {
                    fileUploadCallback = null
                    return false
                }
                return true
            }
        }
${config.pullToRefresh ? `
        // Pull-to-refresh nativo
        swipeRefresh.setOnRefreshListener {
            webView.reload()
        }
        swipeRefresh.setColorSchemeResources(R.color.primaryColor)` : ''}
    }

    private fun setupBackNavigation() {
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack()
                } else {
${config.confirmExitOnDoubleBack ? `
                    if (backPressedTime + 2000 > System.currentTimeMillis()) {
                        finish()
                    } else {
                        Toast.makeText(this@MainActivity, "Pulsa atrás otra vez para salir", Toast.LENGTH_SHORT).show()
                        backPressedTime = System.currentTimeMillis()
                    }` : `
                    finish()`}
                }
            }
        })
    }

    private fun showOfflinePage() {
${config.enableOfflinePage ? `        webView.loadUrl("file:///android_asset/offline.html")` : `        Toast.makeText(this, "Sin conexión a internet", Toast.LENGTH_LONG).show()`}
    }

    private fun isNetworkAvailable(): Boolean {
        val cm = getSystemService(CONNECTIVITY_SERVICE) as ConnectivityManager
        val network = cm.activeNetwork ?: return false
        val capabilities = cm.getNetworkCapabilities(network) ?: return false
        return capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
    }
}
`
  } : {
    name: 'MainActivity.java',
    path: `app/src/main/java/${packagePath}/MainActivity.java`,
    language: 'java',
    description: 'Controlador nativo en Java con WebChromeClient, WebViewClient, FileProvider y soporte para botón Atrás.',
    content: `package ${config.packageName};

import android.annotation.SuppressLint;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.ConnectivityManager;
import android.net.NetworkCapabilities;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.webkit.CookieManager;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.activity.OnBackPressedCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.WindowCompat;
${config.pullToRefresh ? 'import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;\n' : ''}
public class MainActivity extends AppCompatActivity {

    private WebView webView;
    private ProgressBar progressBar;
${config.pullToRefresh ? '    private SwipeRefreshLayout swipeRefresh;\n' : ''}
    private ValueCallback<Uri[]> fileUploadCallback;
    private long backPressedTime = 0;

    private final ActivityResultLauncher<Intent> fileChooserLauncher = registerForActivityResult(
        new ActivityResultContracts.StartActivityForResult(),
        result -> {
            if (fileUploadCallback == null) return;
            Uri[] results = WebChromeClient.FileChooserParams.parseResult(result.getResultCode(), result.getData());
            fileUploadCallback.onReceiveValue(results);
            fileUploadCallback = null;
        }
    );

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WindowCompat.setDecorFitsSystemWindows(getWindow(), ${config.displayMode !== 'fullscreen'});
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webView);
        progressBar = findViewById(R.id.progressBar);
${config.pullToRefresh ? '        swipeRefresh = findViewById(R.id.swipeRefresh);\n' : ''}
        setupWebView();
        setupBackNavigation();

        if (isNetworkAvailable()) {
            webView.loadUrl("${config.webUrl}");
        } else {
            showOfflinePage();
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void setupWebView() {
        WebSettings settings = webView.getSettings();

        // 1. Motor Web y Almacenamiento Local (LocalStorage / SessionStorage / IndexedDB)
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(${config.domStorageEnabled});
        settings.setDatabaseEnabled(${config.databaseEnabled});
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setLoadsImagesAutomatically(true);
        settings.setMediaPlaybackRequiresUserGesture(false);

        // 2. Optimización Responsive Móvil (sin zooms que alteren el diseño)
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setSupportZoom(false);

        // 3. Caché de alto rendimiento
        settings.setCacheMode(WebSettings.${config.cacheMode});

        // 4. Gestión de Cookies y Sesiones Persistentes
        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.setAcceptCookie(${config.cookiesEnabled});
        cookieManager.setAcceptThirdPartyCookies(webView, ${config.thirdPartyCookies});

        // 5. Configuración de User Agent
${config.customUserAgent ? `        settings.setUserAgentString("${config.customUserAgent}");\n` : `        // Preserva el User-Agent móvil para respetar el diseño responsive original\n`}
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();

                // Manejo de enlaces externos: WhatsApp, llamadas tel:, correos mailto:, etc.
                if (url.startsWith("tel:") || url.startsWith("mailto:") || url.startsWith("whatsapp:") || url.startsWith("intent:")) {
                    try {
                        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                        startActivity(intent);
                        return true;
                    } catch (ActivityNotFoundException e) {
                        Toast.makeText(MainActivity.this, "No hay aplicación compatible instalada", Toast.LENGTH_SHORT).show();
                        return true;
                    }
                }
                return false;
            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                progressBar.setVisibility(View.VISIBLE);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                progressBar.setVisibility(View.GONE);
${config.pullToRefresh ? '                if (swipeRefresh != null) swipeRefresh.setRefreshing(false);\n' : ''}
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request.isForMainFrame()) {
                    showOfflinePage();
                }
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                progressBar.setProgress(newProgress);
            }

            @Override
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, FileChooserParams fileChooserParams) {
                if (fileUploadCallback != null) {
                    fileUploadCallback.onReceiveValue(null);
                }
                fileUploadCallback = filePathCallback;

                Intent intent = fileChooserParams.createIntent();
                try {
                    fileChooserLauncher.launch(intent);
                } catch (Exception e) {
                    fileUploadCallback = null;
                    return false;
                }
                return true;
            }
        });
${config.pullToRefresh ? `
        swipeRefresh.setOnRefreshListener(() -> webView.reload());
        swipeRefresh.setColorSchemeResources(R.color.primaryColor);` : ''}
    }

    private void setupBackNavigation() {
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack();
                } else {
${config.confirmExitOnDoubleBack ? `
                    if (backPressedTime + 2000 > System.currentTimeMillis()) {
                        finish();
                    } else {
                        Toast.makeText(MainActivity.this, "Pulsa atrás otra vez para salir", Toast.LENGTH_SHORT).show();
                        backPressedTime = System.currentTimeMillis();
                    }` : `
                    finish();`}
                }
            }
        });
    }

    private void showOfflinePage() {
${config.enableOfflinePage ? `        webView.loadUrl("file:///android_asset/offline.html");` : `        Toast.makeText(this, "Sin conexión a internet", Toast.LENGTH_LONG).show();`}
    }

    private boolean isNetworkAvailable() {
        ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        if (cm == null) return false;
        android.net.Network network = cm.getActiveNetwork();
        if (network == null) return false;
        NetworkCapabilities capabilities = cm.getNetworkCapabilities(network);
        return capabilities != null && capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET);
    }
}
`
  };

  const activityLayout: FileItem = {
    name: 'activity_main.xml',
    path: 'app/src/main/res/layout/activity_main.xml',
    language: 'xml',
    description: 'Layout nativo XML con ProgressBar de carga y SwipeRefreshLayout opcional.',
    content: `<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="${config.themeColor}">

    <ProgressBar
        android:id="@+id/progressBar"
        style="?android:attr/progressBarStyleHorizontal"
        android:layout_width="match_parent"
        android:layout_height="3dp"
        android:layout_alignParentTop="true"
        android:max="100"
        android:indeterminate="false"
        android:progressDrawable="@drawable/custom_progress"
        android:visibility="gone"
        android:elevation="4dp" />
${config.pullToRefresh ? `
    <androidx.swiperefreshlayout.widget.SwipeRefreshLayout
        android:id="@+id/swipeRefresh"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:layout_below="@id/progressBar">

        <WebView
            android:id="@+id/webView"
            android:layout_width="match_parent"
            android:layout_height="match_parent" />
    </androidx.swiperefreshlayout.widget.SwipeRefreshLayout>` : `
    <WebView
        android:id="@+id/webView"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:layout_below="@id/progressBar" />`}
</RelativeLayout>`
  };

  const appBuildGradle: FileItem = {
    name: 'build.gradle (Module: app)',
    path: 'app/build.gradle',
    language: 'groovy',
    description: 'Configuración Gradle del módulo, targetSdk 34, dependencias WebKit y AndroidX.',
    content: `plugins {
    id 'com.android.application'
${isKotlin ? "    id 'org.jetbrains.kotlin.android'\n" : ''}}

android {
    namespace '${config.packageName}'
    compileSdk 34

    defaultConfig {
        applicationId "${config.packageName}"
        minSdk 24
        targetSdk 34
        versionCode ${config.versionCode}
        versionName "${config.versionName}"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }
${isKotlin ? `    kotlinOptions {
        jvmTarget = '17'
    }\n` : ''}}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.11.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.1.4'
    implementation 'androidx.webkit:webkit:1.10.0'
${config.pullToRefresh ? "    implementation 'androidx.swiperefreshlayout:swiperefreshlayout:1.1.0'\n" : ''}
    implementation 'androidx.core:core-ktx:1.12.0'
}`
  };

  const rootBuildGradle: FileItem = {
    name: 'build.gradle (Project)',
    path: 'build.gradle',
    language: 'groovy',
    description: 'Repositorios Maven Central y Google y plugins principales de Gradle.',
    content: `buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.3.0'
${isKotlin ? "        classpath 'org.jetbrains.kotlin:kotlin-gradle-plugin:1.9.22'\n" : ''}
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}`
  };

  const settingsGradle: FileItem = {
    name: 'settings.gradle',
    path: 'settings.gradle',
    language: 'groovy',
    description: 'Inclusión del módulo :app y nombre del proyecto.',
    content: `rootProject.name = "${config.appName.replace(/[^a-zA-Z0-9]/g, '')}"
include ':app'
`
  };

  const networkSecurityConfig: FileItem = {
    name: 'network_security_config.xml',
    path: 'app/src/main/res/xml/network_security_config.xml',
    language: 'xml',
    description: 'Configuración de seguridad para permitir HTTPS y subdominios.',
    content: `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true">
        <trust-anchors>
            <certificates src="system" />
            <certificates src="user" />
        </trust-anchors>
    </base-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">${getHostFromUrl(config.webUrl)}</domain>
    </domain-config>
</network-security-config>`
  };

  const filePathsXml: FileItem = {
    name: 'file_paths.xml',
    path: 'app/src/main/res/xml/file_paths.xml',
    language: 'xml',
    description: 'Rutas seguras para FileProvider (permite adjuntar fotos y documentos).',
    content: `<?xml version="1.0" encoding="utf-8"?>
<paths xmlns:android="http://schemas.android.com/apk/res/android">
    <external-path name="my_images" path="Android/data/${config.packageName}/files/Pictures" />
    <cache-path name="cache" path="." />
    <files-path name="files" path="." />
</paths>`
  };

  const colorsXml: FileItem = {
    name: 'colors.xml',
    path: 'app/src/main/res/values/colors.xml',
    language: 'xml',
    description: 'Paleta de colores de la aplicación sincronizada con el tema web.',
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="primaryColor">${config.themeColor}</color>
    <color name="statusBarColor">${config.statusBarColor}</color>
    <color name="navBarColor">${config.navBarColor}</color>
    <color name="white">#FFFFFF</color>
    <color name="black">#000000</color>
</resources>`
  };

  const stylesXml: FileItem = {
    name: 'styles.xml',
    path: 'app/src/main/res/values/styles.xml',
    language: 'xml',
    description: 'Tema Material sin ActionBar y colores de barras de sistema.',
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.WebToApk" parent="Theme.MaterialComponents.Light.NoActionBar">
        <item name="colorPrimary">@color/primaryColor</item>
        <item name="android:statusBarColor">@color/statusBarColor</item>
        <item name="android:navigationBarColor">@color/navBarColor</item>
        <item name="android:windowLightStatusBar">${!config.isDarkStatusBar}</item>
        <item name="android:windowBackground">@color/primaryColor</item>
    </style>
</resources>`
  };

  const stringsXml: FileItem = {
    name: 'strings.xml',
    path: 'app/src/main/res/values/strings.xml',
    language: 'xml',
    description: 'Nombre de la aplicación y textos del sistema.',
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">${config.appName}</string>
</resources>`
  };

  const offlineHtml: FileItem = {
    name: 'offline.html',
    path: 'app/src/main/assets/offline.html',
    language: 'html',
    description: 'Pantalla de contingencia cuando el usuario no tiene conexión a internet.',
    content: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>${config.offlineTitle}</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: ${config.themeColor};
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 24px;
            text-align: center;
        }
        .container {
            max-width: 380px;
            width: 100%;
        }
        .icon {
            width: 72px;
            height: 72px;
            margin: 0 auto 24px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .icon svg {
            width: 36px;
            height: 36px;
            stroke: #ffffff;
            fill: none;
            stroke-width: 2;
        }
        h1 {
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 12px;
            letter-spacing: -0.02em;
        }
        p {
            font-size: 15px;
            color: rgba(255, 255, 255, 0.7);
            line-height: 1.5;
            margin-bottom: 28px;
        }
        .retry-btn {
            background: #ffffff;
            color: #0f172a;
            border: none;
            padding: 14px 28px;
            border-radius: 12px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
            transition: transform 0.15s ease, opacity 0.15s ease;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
        }
        .retry-btn:active {
            transform: scale(0.97);
            opacity: 0.9;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">
            <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
                <line x1="1" y1="1" x2="23" y2="23"></line>
                <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
                <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
                <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
                <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
                <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
                <line x1="12" y1="20" x2="12.01" y2="20"></line>
            </svg>
        </div>
        <h1>${config.offlineTitle}</h1>
        <p>${config.offlineMessage}</p>
        <button class="retry-btn" onclick="retryConnection()">${config.offlineRetryText}</button>
    </div>

    <script>
        function retryConnection() {
            window.location.href = "${config.webUrl}";
        }
        window.addEventListener('online', function() {
            retryConnection();
        });
    </script>
</body>
</html>`
  };

  const githubActionsWorkflow: FileItem = {
    name: 'build-apk.yml (GitHub Actions)',
    path: '.github/workflows/build-apk.yml',
    language: 'yaml',
    description: 'Compilación automática en la nube de GitHub: genera el archivo .APK listo para descargar sin instalar nada.',
    content: `name: Compilar APK Android Gratis

on:
  push:
    branches: [ "main" ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - name: Clonar código
      uses: actions/checkout@v4

    - name: Configurar Java 17
      uses: actions/setup-java@v4
      with:
        distribution: 'temurin'
        java-version: '17'

    - name: Dar permisos de ejecución a Gradle
      run: chmod +x gradlew || true

    - name: Compilar APK Debug
      run: |
        if [ ! -f "gradlew" ]; then
          gradle wrapper
          chmod +x gradlew
        fi
        ./gradlew assembleDebug --stacktrace

    - name: Subir APK como artefacto descargable
      uses: actions/upload-artifact@v4
      with:
        name: ${config.appName.replace(/[^a-zA-Z0-9_-]/g, '')}-debug-apk
        path: app/build/outputs/apk/debug/*.apk
        retention-days: 14`
  };

  const readmeGuide: FileItem = {
    name: 'LEEME_INSTRUCCIONES.md',
    path: 'README.md',
    language: 'markdown',
    description: 'Guía completa paso a paso en español para compilar y firmar tu APK.',
    content: `# ${config.appName} - Proyecto Android Nativo Optimizado

Este proyecto fue generado por **Web2APK Studio**. Convierte tu sitio web responsive (\`${config.webUrl}\`) en una aplicación APK nativa de Android de alto rendimiento, manteniendo el 100% de las funciones: LocalStorage, Cookies, Touch Gestures, Cámara/Subida de Archivos y botón Atrás.

---

## 🚀 Método 1: Compilar el APK Gratis en la Nube (Sin instalar nada)
Este proyecto incluye un flujo de trabajo oficial de **GitHub Actions** (\`.github/workflows/build-apk.yml\`).

1. Sube este proyecto descomprimido a un repositorio nuevo en tu cuenta de [GitHub](https://github.com).
2. Ve a la pestaña **Actions** en tu repositorio.
3. El workflow **"Compilar APK Android Gratis"** se ejecutará automáticamente.
4. En ~2 minutos, descarga tu archivo \`.apk\` directamente en la sección **Artifacts** y pruébalo en tu teléfono Android.

---

## 💻 Método 2: Abrir y Compilar en Android Studio
Si tienes Android Studio instalado en tu computadora:

1. Abre **Android Studio**.
2. Selecciona **Open** (Abrir proyecto) y elige la carpeta descomprimida.
3. Espera a que Gradle sincronice las dependencias.
4. Para probar en un emulador o tu móvil por USB, pulsa el botón verde **Run** (Play).
5. Para generar el APK instalable:
   - Ve al menú superior: **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
   - En unos segundos verás la notificación con el enlace directo al archivo \`app-debug.apk\`.

---

## 🔐 ¿Cómo crear un APK firmado para producción o Google Play Store?
En Android Studio:
1. Ve a **Build > Generate Signed Bundle / APK**.
2. Elige **APK** (para distribuir por WhatsApp/Web) o **Android App Bundle (.aab)** (para subir a Google Play).
3. Crea o selecciona tu archivo de claves \`keystore.jks\`.
4. Elige **Release** y presiona **Create**.

---

## ✨ Características Nativas Incluidas:
- **Aceleración Hardware**: Activada por GPU para transiciones a 60/120 FPS.
- **LocalStorage y Cookies**: Persistencia completa de sesiones y carritos.
- **Botón Atrás Físico de Android**: Navega en el historial web sin cerrar la app accidentalmente.
- **Manejo de Enlaces**: Abre enlaces externos de WhatsApp, Teléfono y Correo directamente en sus apps correspondientes.
- **Soporte de Cámara y Archivos**: \`WebChromeClient\` con FileChooser nativo.
- **Pantalla Sin Conexión**: \`offline.html\` integrado para pérdidas de señal.
`
  };

  return [
    manifestFile,
    mainActivityFile,
    activityLayout,
    appBuildGradle,
    rootBuildGradle,
    settingsGradle,
    networkSecurityConfig,
    filePathsXml,
    colorsXml,
    stylesXml,
    stringsXml,
    offlineHtml,
    githubActionsWorkflow,
    readmeGuide
  ];
}

function getHostFromUrl(url: string): string {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.hostname;
  } catch {
    return 'example.com';
  }
}
