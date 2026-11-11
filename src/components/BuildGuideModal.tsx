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
  const [activeTab, setActiveTab] = useState<'cloud' | 'local' | 'playstore' | 'emulators'>('emulators');
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
                Guía de Compilación y Emuladores Reales ({config.appName})
              </h2>
              <span className="text-[11px] text-slate-400">
                Instalación en teléfonos y emuladores Android reales con Play Store
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
        <div className="flex border-b border-slate-800 bg-slate-950/40 p-2 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('emulators')}
            className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'emulators'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>Emuladores Android Reales (Play Store)</span>
          </button>

          <button
            onClick={() => setActiveTab('cloud')}
            className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'cloud'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Cloud className="w-4 h-4" />
            <span>Compilar en la Nube (GitHub)</span>
          </button>

          <button
            onClick={() => setActiveTab('local')}
            className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'local'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Android Studio Local</span>
          </button>

          <button
            onClick={() => setActiveTab('playstore')}
            className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'playstore'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Firmar APK</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs text-slate-300">
          {activeTab === 'emulators' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-amber-950/40 border border-amber-500/30 rounded-xl text-amber-200">
                <p className="font-bold text-xs mb-1">
                  ⚠️ Información Técnica Clave sobre Emuladores Reales:
                </p>
                <p className="text-[11px] text-amber-200/90 leading-relaxed">
                  Aplicaciones como <strong>WhatsApp</strong> y juegos 3D como <strong>Pokémon TCG Pocket</strong> requieren una imagen de Android real con <strong>Google Play Services</strong> y certificación <strong>Play Integrity / SafetyNet</strong> con aceleración por GPU. Un navegador web no tiene acceso al kernel KVM del procesador ni a la GPU física, por lo que estas apps no pueden correr dentro de una página web; necesitan un emulador Android real instalado en tu computadora o un teléfono físico.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="font-bold text-slate-100 flex items-center gap-2">
                      <span className="text-emerald-400 font-mono">Opción 1:</span>
                      <span>BlueStacks 5 / LDPlayer 9 (Windows & Mac)</span>
                    </h4>
                    <span className="text-[10px] bg-emerald-950/60 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                      Recomendado para Juegos
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Es el emulador más utilizado para correr juegos como <strong>Pokémon TCG Pocket</strong> y apps como <strong>WhatsApp</strong>.
                  </p>
                  <ol className="list-decimal list-inside text-slate-400 space-y-1 mt-2 text-[11px]">
                    <li>Descarga e instala <strong>BlueStacks 5</strong> (instancia Pie 64-bit o Android 11).</li>
                    <li>Abre <strong>Google Play Store</strong> oficial dentro del emulador e inicia sesión con tu cuenta de Google.</li>
                    <li>Busca e instala <strong>Pokémon TCG Pocket</strong> y <strong>WhatsApp</strong> directamente.</li>
                    <li>Para tu propia web convertida: haz clic en <strong>"Descargar .APK Directo"</strong> en esta plataforma y <strong>arrastra el archivo .apk</strong> dentro de la ventana de BlueStacks para que se instale al instante.</li>
                  </ol>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="font-bold text-slate-100 flex items-center gap-2">
                      <span className="text-emerald-400 font-mono">Opción 2:</span>
                      <span>Android Studio AVD Oficial de Google (Windows, Mac, Linux)</span>
                    </h4>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold">
                      Desarrollador Oficial
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    El emulador oficial mantenido directamente por Google con soporte completo de Google Play Store.
                  </p>
                  <ol className="list-decimal list-inside text-slate-400 space-y-1 mt-2 text-[11px]">
                    <li>Abre el <strong>Device Manager</strong> en Android Studio.</li>
                    <li>Crea un dispositivo virtual (ej. <strong>Pixel 8 Pro</strong>) y asegúrate de elegir una imagen del sistema con el icono de <strong>Google Play</strong>.</li>
                    <li>Inicia el emulador, abre la Play Store y descarga tus aplicaciones.</li>
                    <li>Instala tu APK ejecutando <code>adb install tu-app.apk</code> en la terminal o arrastrando el archivo sobre la pantalla del emulador.</li>
                  </ol>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="font-bold text-slate-100 flex items-center gap-2">
                      <span className="text-emerald-400 font-mono">Opción 3:</span>
                      <span>Waydroid / Redroid (Linux Nativo)</span>
                    </h4>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold">
                      Alto Rendimiento
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Ejecuta Android directamente sobre el kernel de Linux sin capas de emulación pesadas, ideal para servidores o PCs con Linux y soporte de GPU nativa.
                  </p>
                </div>
              </div>
            </div>
          )}

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
