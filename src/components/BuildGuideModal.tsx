import React, { useState } from 'react';
import { 
  X, 
  Terminal, 
  Cloud, 
  Laptop, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { ApkConfig } from '../types/apkConfig';

interface BuildGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ApkConfig;
}

export const BuildGuideModal: React.FC<BuildGuideModalProps> = ({
  isOpen,
  onClose,
  config
}) => {
  const [activeTab, setActiveTab] = useState<'cloud' | 'local' | 'playstore'>('cloud');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-sm font-bold text-slate-100">
                Guía de Compilación del APK ({config.appName})
              </h2>
              <span className="text-[11px] text-slate-400">
                Cómo obtener el archivo .apk instalable en tu teléfono
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Method selector tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 p-2 gap-2">
          <button
            onClick={() => setActiveTab('cloud')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'cloud'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Cloud className="w-4 h-4" />
            <span>1. Nube con GitHub (Sin Instalar Nada)</span>
          </button>

          <button
            onClick={() => setActiveTab('local')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'local'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>2. Android Studio (En tu PC)</span>
          </button>

          <button
            onClick={() => setActiveTab('playstore')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'playstore'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>3. Firmar / Google Play</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs text-slate-300">
          {activeTab === 'cloud' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-300">
                <p className="font-semibold text-xs mb-1">
                  🌟 El método más rápido y 100% confiable:
                </p>
                <p className="text-[11px] text-emerald-300/90 leading-relaxed">
                  No necesitas instalar gigabytes de SDK ni Android Studio. El archivo <code>.github/workflows/build-apk.yml</code> que genera nuestro sistema compila el APK en los servidores seguros y oficiales de GitHub de forma totalmente gratuita.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">1</span>
                  <div>
                    <h4 className="font-bold text-slate-100">Descarga y descomprime el archivo ZIP</h4>
                    <p className="text-slate-400 mt-0.5">
                      Haz clic en el botón <strong>"Descargar Proyecto (.ZIP)"</strong> en la barra superior.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">2</span>
                  <div>
                    <h4 className="font-bold text-slate-100">Sube la carpeta a un repositorio en GitHub</h4>
                    <p className="text-slate-400 mt-0.5">
                      Crea un nuevo repositorio en GitHub (puede ser privado o público) y sube todos los archivos del proyecto.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">3</span>
                  <div>
                    <h4 className="font-bold text-slate-100">Espera 2 minutos y descarga el APK</h4>
                    <p className="text-slate-400 mt-0.5">
                      Entra a la pestaña <strong>Actions</strong> de tu repositorio de GitHub. Verás la tarea ejecutándose. Al terminar, descarga tu archivo <code>.apk</code> en la sección <strong>Artifacts</strong> e instálalo directamente en cualquier teléfono Android.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'local' && (
            <div className="space-y-4">
              <p className="text-slate-400">
                Si prefieres compilar y depurar en tu propia computadora con Android Studio:
              </p>

              <div className="space-y-3">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <h4 className="font-bold text-slate-100 mb-1">Paso 1: Abrir el proyecto</h4>
                  <p className="text-slate-400">
                    Abre Android Studio, selecciona <strong>File &gt; Open</strong> y selecciona la carpeta descomprimida.
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <h4 className="font-bold text-slate-100 mb-1">Paso 2: Compilar el APK instalable</h4>
                  <p className="text-slate-400 mb-2">
                    En el menú superior de Android Studio, haz clic en:
                  </p>
                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg font-mono text-[11px] text-emerald-400 flex items-center justify-between">
                    <span>Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</span>
                  </div>
                  <p className="text-slate-400 mt-2">
                    En segundos aparecerá una ventana en la esquina inferior derecha con el enlace <code>locate</code> para abrir el archivo <code>app-debug.apk</code>.
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <h4 className="font-bold text-slate-100 mb-1">Paso 3: Probar en tu teléfono por terminal (opcional)</h4>
                  <div className="relative">
                    <pre className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg font-mono text-[11px] text-slate-300">
                      <code>./gradlew assembleDebug</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'playstore' && (
            <div className="space-y-4">
              <p className="text-slate-400">
                Para publicar tu aplicación en la <strong>Google Play Store</strong> o distribuirla oficialmente:
              </p>

              <div className="space-y-3">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <h4 className="font-bold text-slate-100 mb-1">1. Generar clave de firma (Keystore)</h4>
                  <p className="text-slate-400">
                    En Android Studio, dirígete a:
                  </p>
                  <p className="font-mono text-emerald-400 mt-1">
                    Build &gt; Generate Signed Bundle / APK...
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <h4 className="font-bold text-slate-100 mb-1">2. Elegir formato</h4>
                  <p className="text-slate-400">
                    - Elige <strong>Android App Bundle (.aab)</strong> si la vas a subir a Google Play Console (requerido por Google).
                    <br />
                    - Elige <strong>APK</strong> si la vas a distribuir por tu cuenta (WhatsApp, correo o descarga web).
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <h4 className="font-bold text-slate-100 mb-1">3. Seleccionar Release</h4>
                  <p className="text-slate-400">
                    Marca la casilla <strong>Release</strong> y haz clic en <strong>Finish</strong>. ¡Tu aplicación estará 100% optimizada y firmada criptográficamente!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
          >
            Entendido, cerrar guía
          </button>
        </div>
      </div>
    </div>
  );
};
