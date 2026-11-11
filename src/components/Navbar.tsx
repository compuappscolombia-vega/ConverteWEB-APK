import React from 'react';
import { Download, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeView: 'simulator' | 'config' | 'code' | 'audit';
  setActiveView: (view: 'simulator' | 'config' | 'code' | 'audit') => void;
  onDownloadZip: () => void;
  isDownloading: boolean;
  onDownloadDirectApk: () => void;
  isDirectDownloading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  onDownloadZip,
  isDownloading,
  onDownloadDirectApk,
  isDirectDownloading
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <a 
        href="/" 
        onClick={(e) => { e.preventDefault(); setActiveView('simulator'); }}
        className="text-lg font-extrabold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2 group"
      >
        <span className="w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
          APK
        </span>
        <span className="group-hover:text-emerald-400 transition-colors">Web2APK Studio</span>
      </a>

      {/* Zone 2: Clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
        <button
          onClick={() => setActiveView('simulator')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            activeView === 'simulator' ? 'text-emerald-400 font-semibold' : ''
          }`}
        >
          Visor Móvil Real
        </button>
        <button
          onClick={() => setActiveView('config')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            activeView === 'config' ? 'text-emerald-400 font-semibold' : ''
          }`}
        >
          Configuración APK
        </button>
        <button
          onClick={() => setActiveView('code')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            activeView === 'code' ? 'text-emerald-400 font-semibold' : ''
          }`}
        >
          Código Nativo
        </button>
        <button
          onClick={() => setActiveView('audit')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            activeView === 'audit' ? 'text-emerald-400 font-semibold' : ''
          }`}
        >
          Auditoría de Rendimiento
        </button>
      </nav>

      {/* Zone 3: Primary actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onDownloadDirectApk}
          disabled={isDirectDownloading}
          className="px-3.5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{isDirectDownloading ? 'Generando...' : 'Descargar .APK Directo'}</span>
        </button>

        <button
          onClick={onDownloadZip}
          disabled={isDownloading}
          className="hidden sm:flex px-3.5 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all whitespace-nowrap shrink-0 items-center gap-1.5 border border-slate-700"
        >
          <span>Proyecto Android (.ZIP)</span>
        </button>
      </div>
    </header>
  );
};
