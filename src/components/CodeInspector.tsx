import React, { useState } from 'react';
import { 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  FolderTree, 
  Sparkles,
  ShieldCheck,
  Terminal,
  HelpCircle
} from 'lucide-react';
import { ApkConfig, FileItem } from '../types/apkConfig';
import { generateAndroidProjectFiles } from '../utils/apkGenerator';

interface CodeInspectorProps {
  config: ApkConfig;
  onDownloadZip: () => void;
  isDownloading: boolean;
  onOpenGuide: () => void;
}

export const CodeInspector: React.FC<CodeInspectorProps> = ({
  config,
  onDownloadZip,
  isDownloading,
  onOpenGuide
}) => {
  const files = generateAndroidProjectFiles(config);
  const [selectedFileIndex, setSelectedFileIndex] = useState(1); // default to MainActivity
  const [copied, setCopied] = useState(false);

  const currentFile = files[selectedFileIndex] || files[0];

  const handleCopy = () => {
    if (!currentFile) return;
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-full">
      {/* Inspector Header */}
      <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderTree className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold text-slate-200">
            Archivos del Proyecto Android Nativo ({files.length} archivos generados)
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenGuide}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>¿Cómo Compilar el APK?</span>
          </button>

          <button
            onClick={onDownloadZip}
            disabled={isDownloading}
            className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{isDownloading ? 'Generando ZIP...' : 'Descargar Proyecto (.ZIP)'}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left File List */}
        <div className="w-64 border-r border-slate-800 bg-slate-950/40 p-2 overflow-y-auto space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 px-2 py-1 block">
            Estructura del Proyecto
          </span>
          {files.map((file, idx) => {
            const isSelected = idx === selectedFileIndex;
            return (
              <button
                key={file.path}
                onClick={() => setSelectedFileIndex(idx)}
                className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center gap-2 transition-all group ${
                  isSelected
                    ? 'bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span className="truncate">{file.name}</span>
              </button>
            );
          })}
        </div>

        {/* Right Code Content Viewport */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
          {/* File description sub-bar */}
          <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="font-mono text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
                {currentFile.path}
              </span>
              <span className="text-slate-500 hidden sm:inline">|</span>
              <span className="text-slate-400 text-[11px] hidden sm:inline truncate max-w-sm">
                {currentFile.description}
              </span>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-slate-400" />
                  <span>Copiar Código</span>
                </>
              )}
            </button>
          </div>

          {/* Syntax viewer */}
          <div className="flex-1 overflow-auto p-4 font-mono text-[12px] leading-relaxed text-slate-300">
            <pre className="whitespace-pre">
              <code>{currentFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
