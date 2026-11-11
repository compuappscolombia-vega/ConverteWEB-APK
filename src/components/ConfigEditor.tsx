import React, { useState } from 'react';
import { 
  Settings, 
  Palette, 
  Cpu, 
  ShieldCheck, 
  WifiOff, 
  Code2, 
  Smartphone,
  Globe,
  Camera,
  MapPin,
  Download,
  Share2,
  RotateCcw,
  Sparkles,
  Info,
  Check
} from 'lucide-react';
import { ApkConfig } from '../types/apkConfig';
import { SAMPLE_WEBSITES } from '../utils/sampleWebsites';

interface ConfigEditorProps {
  config: ApkConfig;
  onChange: (updated: Partial<ApkConfig>) => void;
  onSelectSample: (url: string, name: string, themeColor: string) => void;
}

export const ConfigEditor: React.FC<ConfigEditorProps> = ({
  config,
  onChange,
  onSelectSample
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'webview' | 'permissions' | 'offline'>('general');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-full">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1 overflow-x-auto scrollbar-none">
        {[
          { id: 'general', label: 'General', icon: Settings },
          { id: 'appearance', label: 'Apariencia & Splash', icon: Palette },
          { id: 'webview', label: 'Motor WebView', icon: Cpu },
          { id: 'permissions', label: 'Permisos & Hardware', icon: ShieldCheck },
          { id: 'offline', label: 'Modo Offline', icon: WifiOff }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-2 px-3 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Body */}
      <div className="p-5 overflow-y-auto space-y-6 flex-1">
        {/* TAB 1: GENERAL */}
        {activeTab === 'general' && (
          <div className="space-y-5">
            {/* Quick URL presets */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Plantillas y Ejemplos de Sitios Web Responsive:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SAMPLE_WEBSITES.map((site) => (
                  <button
                    key={site.id}
                    onClick={() => onSelectSample(site.url, site.name, site.themeColor)}
                    className="p-3 bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 rounded-xl text-left transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">
                        {site.name}
                      </span>
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: site.themeColor }} />
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-1 line-clamp-1">{site.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Target URL */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                URL del Sitio Web a convertir en APK <span className="text-emerald-400">*</span>
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="url"
                  value={config.webUrl}
                  onChange={(e) => onChange({ webUrl: e.target.value })}
                  placeholder="https://mi-sitio-web-responsive.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Puede ser cualquier web responsive (e-commerce, dashboard, blog, app web). Se conservará exactamente como se ve en el navegador móvil.
              </p>
            </div>

            {/* App Name & Package Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Nombre de la Aplicación <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  value={config.appName}
                  onChange={(e) => {
                    const newName = e.target.value;
                    const cleanPkg = newName.toLowerCase().replace(/[^a-z0-9]/g, '');
                    onChange({ 
                      appName: newName,
                      packageName: `com.${cleanPkg || 'app'}.app`
                    });
                  }}
                  placeholder="Mi Aplicación"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Package Name (Android ID) <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  value={config.packageName}
                  onChange={(e) => onChange({ packageName: e.target.value })}
                  placeholder="com.miempresa.miapp"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 font-mono placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Version & Code Language */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Versión (VersionName)
                </label>
                <input
                  type="text"
                  value={config.versionName}
                  onChange={(e) => onChange({ versionName: e.target.value })}
                  placeholder="1.0.0"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Código (VersionCode)
                </label>
                <input
                  type="number"
                  value={config.versionCode}
                  onChange={(e) => onChange({ versionCode: parseInt(e.target.value) || 1 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Lenguaje Android
                </label>
                <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-1">
                  <button
                    onClick={() => onChange({ codeLanguage: 'java' })}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      config.codeLanguage === 'java'
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Java
                  </button>
                  <button
                    onClick={() => onChange({ codeLanguage: 'kotlin' })}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      config.codeLanguage === 'kotlin'
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Kotlin
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: APARIENCIA */}
        {activeTab === 'appearance' && (
          <div className="space-y-5">
            {/* Color Palette */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Personalización de Colores del Sistema
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-[11px] text-slate-400 block mb-1.5">Color Primario / Fondo</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.themeColor}
                      onChange={(e) => onChange({ themeColor: e.target.value, statusBarColor: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={config.themeColor}
                      onChange={(e) => onChange({ themeColor: e.target.value, statusBarColor: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200 font-mono"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-[11px] text-slate-400 block mb-1.5">Barra de Estado (Top)</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.statusBarColor}
                      onChange={(e) => onChange({ statusBarColor: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={config.statusBarColor}
                      onChange={(e) => onChange({ statusBarColor: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200 font-mono"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-[11px] text-slate-400 block mb-1.5">Barra Inferior (Nav)</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.navBarColor}
                      onChange={(e) => onChange({ navBarColor: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={config.navBarColor}
                      onChange={(e) => onChange({ navBarColor: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Orientation & Display mode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Orientación de Pantalla
                </label>
                <select
                  value={config.orientation}
                  onChange={(e) => onChange({ orientation: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="portrait">Vertical Fijo (Recomendado para apps)</option>
                  <option value="sensor">Rotación Automática (Sensor)</option>
                  <option value="landscape">Horizontal Fijo (Juegos / Videos)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Modo de Pantalla
                </label>
                <select
                  value={config.displayMode}
                  onChange={(e) => onChange({ displayMode: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="standalone">Estándar App (Barra de estado visible)</option>
                  <option value="fullscreen">Pantalla Completa Inmersiva (Sin barra)</option>
                </select>
              </div>
            </div>

            {/* Splash Screen configuration */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Pantalla de Inicio (Splash Screen)</h4>
                  <p className="text-[11px] text-slate-400">
                    Muestra el logotipo de tu marca mientras carga el sitio web por primera vez.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={config.showSplashScreen}
                  onChange={(e) => onChange({ showSplashScreen: e.target.checked })}
                  className="w-4 h-4 accent-emerald-500 cursor-pointer"
                />
              </div>

              {config.showSplashScreen && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-900">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Duración (ms)</label>
                    <input
                      type="number"
                      step="500"
                      min="500"
                      max="5000"
                      value={config.splashDuration}
                      onChange={(e) => onChange({ splashDuration: parseInt(e.target.value) || 1500 })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Texto de Carga</label>
                    <input
                      type="text"
                      value={config.splashText}
                      onChange={(e) => onChange({ splashText: e.target.value })}
                      placeholder="Cargando aplicación..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: WEBVIEW & OPTIMIZACIONES */}
        {activeTab === 'webview' && (
          <div className="space-y-4">
            <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 rounded-xl flex items-start gap-2.5 text-xs text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Garantía de Cero Pérdida de Funciones:</strong> Estos ajustes activan el almacenamiento persistente de cookies, local storage y aceleración de hardware para que tus carritos de compra, filtros y pasarelas funcionen a la perfección.
              </span>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  key: 'domStorageEnabled',
                  title: 'Almacenamiento Local (DOM Storage & LocalStorage)',
                  desc: 'Permite guardar estados, tokens de sesión y productos en el carrito de compras sin que se borren al cerrar la app.'
                },
                {
                  key: 'databaseEnabled',
                  title: 'Bases de Datos Web (IndexedDB / WebSQL)',
                  desc: 'Habilita bases de datos en el cliente para apps modernas, PWA y caché avanzada.'
                },
                {
                  key: 'cookiesEnabled',
                  title: 'Soporte Completo de Cookies',
                  desc: 'Mantiene las sesiones de usuario abiertas entre reinicios de la aplicación.'
                },
                {
                  key: 'thirdPartyCookies',
                  title: 'Cookies de Terceros',
                  desc: 'Imprescindible para pagos con Stripe/PayPal, login con Google y widgets externos.'
                },
                {
                  key: 'hardwareAcceleration',
                  title: 'Aceleración por Hardware (GPU)',
                  desc: 'Procesa el renderizado con la tarjeta gráfica del móvil para transiciones fluidas a 60/120 FPS.'
                },
                {
                  key: 'pullToRefresh',
                  title: 'Deslizar para Actualizar (Pull-To-Refresh)',
                  desc: 'Añade el gesto nativo de tirar hacia abajo para refrescar el sitio web.'
                }
              ].map((item) => (
                <div
                  key={item.key}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">{item.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={(config as any)[item.key]}
                    onChange={(e) => onChange({ [item.key]: e.target.checked } as any)}
                    className="w-4 h-4 accent-emerald-500 cursor-pointer shrink-0"
                  />
                </div>
              ))}
            </div>

            {/* Cache Policy */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Estrategia de Caché de Android
              </label>
              <select
                value={config.cacheMode}
                onChange={(e) => onChange({ cacheMode: e.target.value as any })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="LOAD_DEFAULT">LOAD_DEFAULT (Equilibrado: usa red y caché estándar)</option>
                <option value="LOAD_CACHE_ELSE_NETWORK">LOAD_CACHE_ELSE_NETWORK (Ultra rápido: prioriza caché si existe)</option>
                <option value="LOAD_NO_CACHE">LOAD_NO_CACHE (Siempre pide datos frescos al servidor)</option>
              </select>
            </div>
          </div>
        )}

        {/* TAB 4: PERMISOS & HARDWARE */}
        {activeTab === 'permissions' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">
              Activa únicamente los permisos que tu sitio web requiera para mantener la APK ligera y confiable.
            </p>

            <div className="space-y-2.5">
              {[
                {
                  key: 'allowCameraUploads',
                  icon: Camera,
                  title: 'Cámara y Subida de Archivos',
                  desc: 'Permite a los usuarios tomar fotos o subir documentos mediante inputs <input type="file"> con FileProvider nativo.'
                },
                {
                  key: 'allowGeolocation',
                  icon: MapPin,
                  title: 'Geolocalización / GPS',
                  desc: 'Habilita navigator.geolocation para calcular rutas, tiendas cercanas o ubicación de entrega.'
                },
                {
                  key: 'allowFileDownloads',
                  icon: Download,
                  title: 'Gestor de Descargas (DownloadManager)',
                  desc: 'Permite descargar archivos PDF, facturas o imágenes a la carpeta Descargas del móvil.'
                },
                {
                  key: 'allowExternalIntents',
                  icon: Share2,
                  title: 'Enlaces Externos (WhatsApp, Teléfono, Mapas)',
                  desc: 'Abre automáticamente enlaces whatsapp://, tel:123, mailto: y mapas en las aplicaciones nativas del móvil en vez de dar error.'
                },
                {
                  key: 'handleBackKey',
                  icon: RotateCcw,
                  title: 'Botón Atrás Físico de Android (Smart History)',
                  desc: 'Navega hacia atrás en el historial de la web (history.back) en lugar de cerrar la aplicación inesperadamente.'
                },
                {
                  key: 'confirmExitOnDoubleBack',
                  icon: Info,
                  title: 'Confirmar Salida con Doble Pulsación',
                  desc: 'Muestra un aviso flotante "Pulsa atrás otra vez para salir" para evitar salir por accidente.'
                }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.key}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 text-emerald-400 mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-200">{item.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={(config as any)[item.key]}
                      onChange={(e) => onChange({ [item.key]: e.target.checked } as any)}
                      className="w-4 h-4 accent-emerald-500 cursor-pointer shrink-0"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: MODO OFFLINE */}
        {activeTab === 'offline' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <div>
                <h4 className="text-xs font-bold text-slate-200">Activar Pantalla Offline Elegante</h4>
                <p className="text-[11px] text-slate-400">
                  Evita que aparezca el dinosaurio o mensaje feo de error de Google cuando el usuario se queda sin señal de internet.
                </p>
              </div>
              <input
                type="checkbox"
                checked={config.enableOfflinePage}
                onChange={(e) => onChange({ enableOfflinePage: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 cursor-pointer"
              />
            </div>

            {config.enableOfflinePage && (
              <div className="space-y-3 p-4 bg-slate-950 border border-slate-800 rounded-xl">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Título de la Pantalla Sin Conexión
                  </label>
                  <input
                    type="text"
                    value={config.offlineTitle}
                    onChange={(e) => onChange({ offlineTitle: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Mensaje de Explicación
                  </label>
                  <textarea
                    rows={2}
                    value={config.offlineMessage}
                    onChange={(e) => onChange({ offlineMessage: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Texto del Botón de Reintento
                  </label>
                  <input
                    type="text"
                    value={config.offlineRetryText}
                    onChange={(e) => onChange({ offlineRetryText: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
