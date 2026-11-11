/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { PhoneSimulator } from './components/PhoneSimulator';
import { ConfigEditor } from './components/ConfigEditor';
import { CodeInspector } from './components/CodeInspector';
import { AuditReport } from './components/AuditReport';
import { BuildGuideModal } from './components/BuildGuideModal';
import { ApkConfig } from './types/apkConfig';
import { downloadAndroidProjectZip } from './utils/zipExporter';
import { 
  ShieldCheck, 
  Sparkles, 
  Download, 
  HelpCircle, 
  CheckCircle2, 
  Smartphone,
  Cpu,
  Layers,
  FileCode,
  Sliders,
  Flame,
  ArrowRight
} from 'lucide-react';

const INITIAL_CONFIG: ApkConfig = {
  appName: 'Mi Tienda Móvil',
  packageName: 'com.mitienda.app',
  webUrl: 'https://demo-tienda.ejemplo.app',
  versionName: '1.0.0',
  versionCode: 1,
  themeColor: '#0f172a',
  statusBarColor: '#0f172a',
  navBarColor: '#0f172a',
  isDarkStatusBar: true,
  orientation: 'portrait',
  displayMode: 'standalone',

  pullToRefresh: true,
  hardwareAcceleration: true,
  domStorageEnabled: true,
  databaseEnabled: true,
  cookiesEnabled: true,
  thirdPartyCookies: true,
  cacheMode: 'LOAD_DEFAULT',

  allowCameraUploads: true,
  allowGeolocation: true,
  allowFileDownloads: true,
  allowExternalIntents: true,
  keepScreenOn: false,

  handleBackKey: true,
  confirmExitOnDoubleBack: true,
  customUserAgent: '',
  appendCustomUserAgent: false,

  showSplashScreen: true,
  splashDuration: 1800,
  splashBgColor: '#0f172a',
  splashText: 'Iniciando aplicación nativa...',
  splashIcon: '',

  enableOfflinePage: true,
  offlineTitle: 'Sin conexión a Internet',
  offlineMessage: 'No se pudo conectar con el sitio web. Revisa tu señal Wi-Fi o datos móviles y vuelve a intentarlo.',
  offlineRetryText: 'Reintentar Conexión',

  codeLanguage: 'java'
};

export default function App() {
  const [config, setConfig] = useState<ApkConfig>(INITIAL_CONFIG);
  const [activeView, setActiveView] = useState<'simulator' | 'config' | 'code' | 'audit'>('simulator');
  const [activeDemo, setActiveDemo] = useState<string>('ecommerce');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdateConfig = (newSettings: Partial<ApkConfig>) => {
    setConfig(prev => ({ ...prev, ...newSettings }));
  };

  const handleSelectSample = (url: string, name: string, themeColor: string) => {
    const cleanPkg = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    setConfig(prev => ({
      ...prev,
      webUrl: url,
      appName: name,
      packageName: `com.${cleanPkg || 'app'}.app`,
      themeColor: themeColor,
      statusBarColor: themeColor,
      navBarColor: themeColor
    }));
    showToast(`Plantilla cargada: ${name}`);
  };

  const handleDownloadZip = async () => {
    try {
      setIsDownloading(true);
      await downloadAndroidProjectZip(config);
      showToast('¡Proyecto Android descargado con éxito!');
    } catch (error) {
      console.error(error);
      showToast('Error al generar el archivo ZIP');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Bar following contract */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        onDownloadZip={handleDownloadZip}
        isDownloading={isDownloading}
      />

      {/* Hero Notification & Architecture Banner */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-semibold text-white">Motor Web2APK Pro:</span>
            <span>Mantiene el 100% de tu web responsive sin alterar scripts, carritos, sesiones ni estilos.</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Ver Guía de Compilación Gratuita</span>
            </button>
            <span className="hidden sm:inline text-slate-600">·</span>
            <span className="font-mono text-slate-400">TargetSDK 34 (Android 14/15)</span>
          </div>
        </div>
      </div>

      {/* Main Workspace Grid (Desktop 1440px baseline) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Mobile Phone Simulator */}
        <section className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-bold text-slate-200">
                Previsualización en Vivo de la APK
              </h2>
            </div>
            <span className="text-[11px] text-slate-500">
              Interactivo táctil
            </span>
          </div>

          <PhoneSimulator
            config={config}
            onUpdateConfig={handleUpdateConfig}
            activeDemo={activeDemo}
            setActiveDemo={setActiveDemo}
          />
        </section>

        {/* Right Column: Multi-tab studio console */}
        <section className="lg:col-span-7 flex flex-col gap-5">
          {/* View switcher tabs for workspace */}
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveView('config')}
                className={`flex items-center gap-1.5 py-1.5 px-3.5 text-xs font-semibold rounded-xl transition-all ${
                  activeView === 'config' || activeView === 'simulator'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                <span>Configuración APK</span>
              </button>

              <button
                onClick={() => setActiveView('code')}
                className={`flex items-center gap-1.5 py-1.5 px-3.5 text-xs font-semibold rounded-xl transition-all ${
                  activeView === 'code'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                <span>Código Fuente ({config.codeLanguage.toUpperCase()})</span>
              </button>

              <button
                onClick={() => setActiveView('audit')}
                className={`flex items-center gap-1.5 py-1.5 px-3.5 text-xs font-semibold rounded-xl transition-all ${
                  activeView === 'audit'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Auditoría de Rendimiento</span>
              </button>
            </div>

            <button
              onClick={() => setIsGuideOpen(true)}
              className="text-xs text-slate-400 hover:text-white px-3 py-1 flex items-center gap-1 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Instrucciones</span>
            </button>
          </div>

          {/* Active View Container */}
          <div className="min-h-[580px]">
            {(activeView === 'config' || activeView === 'simulator') && (
              <ConfigEditor
                config={config}
                onChange={handleUpdateConfig}
                onSelectSample={handleSelectSample}
              />
            )}

            {activeView === 'code' && (
              <CodeInspector
                config={config}
                onDownloadZip={handleDownloadZip}
                isDownloading={isDownloading}
                onOpenGuide={() => setIsGuideOpen(true)}
              />
            )}

            {activeView === 'audit' && (
              <AuditReport config={config} />
            )}
          </div>

          {/* Feature Guarantee & Trust Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-slate-200">Sin Bloqueos X-Frame</h4>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                En el WebView nativo de Android los headers de bloqueo no aplican; tu web se abre con privilegios de app.
              </p>
            </div>

            <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-slate-200">60 FPS Hardware GPU</h4>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Renderizado acelerado por hardware para que scrolls, carruseles y menús respondan con total suavidad.
              </p>
            </div>

            <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-slate-200">100% Código Propio</h4>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Código fuente transparente sin librerías dudosas, listo para compilar en Android Studio o GitHub.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Toast Notice */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/50 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-medium animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Build Guide Modal */}
      <BuildGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        config={config}
      />
    </div>
  );
}
