import React from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Zap, 
  Smartphone, 
  Lock, 
  Wifi, 
  Layers, 
  HelpCircle 
} from 'lucide-react';
import { ApkConfig } from '../types/apkConfig';

interface AuditReportProps {
  config: ApkConfig;
}

export const AuditReport: React.FC<AuditReportProps> = ({ config }) => {
  const isHttps = config.webUrl.startsWith('https://');

  const auditChecks = [
    {
      title: 'Compatibilidad de Interfaz Responsive Móvil',
      category: 'Diseño & Ergonomía',
      status: 'pass',
      description: 'El motor WebView configura useWideViewPort=true y deshabilita controles de zoom agresivos para que tu diseño responsive luzca exactamente igual que una app nativa.',
      impact: 'Alto'
    },
    {
      title: 'Persistencia de Sesiones, Carrito y Cookies',
      category: 'Datos & Almacenamiento',
      status: config.domStorageEnabled && config.cookiesEnabled ? 'pass' : 'warning',
      description: config.domStorageEnabled && config.cookiesEnabled
        ? 'LocalStorage, SessionStorage y CookieManager están activos. Los usuarios no perderán su sesión ni sus compras al cerrar la aplicación.'
        : 'Se recomienda mantener activos DomStorage y Cookies para no perder datos de usuario.',
      impact: 'Crítico'
    },
    {
      title: 'Navegación con Botón Atrás de Android',
      category: 'Experiencia de Usuario',
      status: config.handleBackKey ? 'pass' : 'warning',
      description: config.handleBackKey
        ? 'El controlador onBackPressedCallback intercepta la pulsación y ejecuta history.back() en la web, evitando que la app se cierre por error.'
        : 'Sin este controlador, al pulsar Atrás en Android el móvil cerrará la aplicación de golpe.',
      impact: 'Alto'
    },
    {
      title: 'Subida de Archivos y Cámara Móvil',
      category: 'Hardware & Permisos',
      status: config.allowCameraUploads ? 'pass' : 'neutral',
      description: config.allowCameraUploads
        ? 'Implementa WebChromeClient.onShowFileChooser y FileProvider seguro para permitir a la web tomar fotos y adjuntar documentos sin cierres forzados.'
        : 'Permiso desactivado. Actívalo si tu sitio web tiene formularios con carga de archivos o fotos.',
      impact: 'Medio'
    },
    {
      title: 'Aceleración Gráfica por Hardware (GPU)',
      category: 'Rendimiento',
      status: config.hardwareAcceleration ? 'pass' : 'warning',
      description: config.hardwareAcceleration
        ? 'GPU rendering activado en AndroidManifest.xml. Las animaciones CSS, menús desplegables y scrolls correrán a 60 FPS estables.'
        : 'Aceleración desactivada. Podría generar tirones en animaciones pesadas.',
      impact: 'Alto'
    },
    {
      title: 'Seguridad HTTPS y Certificados SSL',
      category: 'Seguridad de Red',
      status: isHttps ? 'pass' : 'warning',
      description: isHttps
        ? 'La URL utiliza cifrado seguro HTTPS, compatible con los requisitos de Google Play y Android 14+.'
        : 'La URL usa HTTP sin cifrar. Se ha configurado network_security_config.xml para permitirlo, pero se aconseja migrar a HTTPS.',
      impact: 'Crítico'
    },
    {
      title: 'Tolerancia a Fallos y Pérdida de Internet',
      category: 'Resiliencia Offline',
      status: config.enableOfflinePage ? 'pass' : 'neutral',
      description: config.enableOfflinePage
        ? 'Dispones de la pantalla offline.html integrada en los assets nativos de la APK con botón de auto-reconectar.'
        : 'La app mostrará la alerta estándar de Android ante pérdida de señal.',
      impact: 'Medio'
    }
  ];

  const passedCount = auditChecks.filter(c => c.status === 'pass').length;
  const score = Math.round((passedCount / auditChecks.length) * 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Top Score Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <span className="text-2xl font-extrabold text-emerald-400 font-mono">{score}%</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Auditoría de Conversión a APK
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {passedCount} de {auditChecks.length} estándares de optimización y compatibilidad aprobados.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
          <ShieldCheck className="w-4 h-4" />
          <span>Optimizada para Android 14 y 15</span>
        </div>
      </div>

      {/* Checks Grid */}
      <div className="space-y-3">
        {auditChecks.map((check, idx) => (
          <div
            key={idx}
            className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl flex items-start gap-3.5 hover:border-slate-700 transition-colors"
          >
            <div className="mt-0.5 shrink-0">
              {check.status === 'pass' && (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              )}
              {check.status === 'warning' && (
                <AlertCircle className="w-5 h-5 text-amber-400" />
              )}
              {check.status === 'neutral' && (
                <HelpCircle className="w-5 h-5 text-slate-500" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h4 className="text-xs font-bold text-slate-200">{check.title}</h4>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span>{check.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className={check.impact === 'Crítico' ? 'text-amber-400 font-semibold' : ''}>
                    Impacto {check.impact}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{check.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
