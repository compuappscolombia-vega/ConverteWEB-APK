import React, { useState, useEffect, useRef } from 'react';
import { 
  Wifi, 
  Battery, 
  RotateCcw, 
  ArrowLeft, 
  ArrowRight, 
  Smartphone, 
  Share2, 
  ExternalLink,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Search,
  ShoppingBag,
  Heart,
  Plus,
  Minus,
  Check
} from 'lucide-react';
import { ApkConfig, SampleWebSite } from '../types/apkConfig';
import { SAMPLE_WEBSITES } from '../utils/sampleWebsites';

interface PhoneSimulatorProps {
  config: ApkConfig;
  onUpdateConfig: (newConfig: Partial<ApkConfig>) => void;
  activeDemo: string;
  setActiveDemo: (demoId: string) => void;
}

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({
  config,
  onUpdateConfig,
  activeDemo,
  setActiveDemo
}) => {
  const [deviceModel, setDeviceModel] = useState<'pixel' | 'galaxy' | 'compact'>('pixel');
  const [isSimulatingOffline, setIsSimulatingOffline] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isShowingSplash, setIsShowingSplash] = useState(false);
  const [historyStack, setHistoryStack] = useState<string[]>(['/']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [cartCount, setCartCount] = useState(2);
  const [currentTime, setCurrentTime] = useState('09:41');
  const [activeTab, setActiveTab] = useState<'home' | 'categories' | 'cart' | 'profile'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'demo' | 'live-url'>('demo');
  const [urlInput, setUrlInput] = useState(config.webUrl);

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

  // Handle URL changes
  useEffect(() => {
    setUrlInput(config.webUrl);
  }, [config.webUrl]);

  // Simulate pull to refresh
  const triggerRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 900);
  };

  // Simulate Splash Screen
  const triggerSplash = () => {
    setIsShowingSplash(true);
    setTimeout(() => {
      setIsShowingSplash(false);
    }, config.splashDuration || 1800);
  };

  // Simulate Android Hardware Back button
  const handleHardwareBack = () => {
    if (activeTab !== 'home') {
      setActiveTab('home');
      return;
    }
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
    } else {
      // Simulate double tap back to exit toast
      showExitNotice();
    }
  };

  const [exitNoticeVisible, setExitNoticeVisible] = useState(false);
  const showExitNotice = () => {
    setExitNoticeVisible(true);
    setTimeout(() => setExitNoticeVisible(false), 2000);
  };

  // Sample Products for the Responsive E-Commerce Demo
  const [products] = useState([
    {
      id: 1,
      name: 'Sneakers Velocity Pro X',
      category: 'Calzado Deportivo',
      price: 89.99,
      rating: 4.8,
      color: 'Slate Black',
      imageBg: 'from-blue-600 to-indigo-800'
    },
    {
      id: 2,
      name: 'Auriculares Wireless Active',
      category: 'Audio & Gadgets',
      price: 54.50,
      rating: 4.9,
      color: 'Matte Grey',
      imageBg: 'from-amber-500 to-orange-700'
    },
    {
      id: 3,
      name: 'Smartwatch Titan Series 9',
      category: 'Wearables',
      price: 129.00,
      rating: 4.7,
      color: 'Midnight Blue',
      imageBg: 'from-emerald-600 to-teal-800'
    },
    {
      id: 4,
      name: 'Mochila Urbana Resistente',
      category: 'Accesorios',
      price: 42.00,
      rating: 4.6,
      color: 'Carbon',
      imageBg: 'from-purple-600 to-pink-700'
    }
  ]);

  return (
    <div className="flex flex-col items-center">
      {/* Top simulator toolbar */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between gap-2 px-1 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-slate-300">Dispositivo:</span>
          <button
            onClick={() => setDeviceModel('pixel')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              deviceModel === 'pixel'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-slate-800 hover:text-slate-200'
            }`}
          >
            Pixel 8 Pro
          </button>
          <button
            onClick={() => setDeviceModel('galaxy')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              deviceModel === 'galaxy'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-slate-800 hover:text-slate-200'
            }`}
          >
            Galaxy S24
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={triggerSplash}
            title="Previsualizar Splash Screen nativo"
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Splash</span>
          </button>

          <button
            onClick={() => setIsSimulatingOffline(!isSimulatingOffline)}
            title="Simular pérdida de internet para ver offline.html"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
              isSimulatingOffline
                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            <Wifi className={`w-3.5 h-3.5 ${isSimulatingOffline ? 'text-red-400' : 'text-slate-400'}`} />
            <span>{isSimulatingOffline ? 'Sin Red' : 'Online'}</span>
          </button>
        </div>
      </div>

      {/* Mode Selector (Interactive Mobile Demo vs Live URL) */}
      <div className="w-full max-w-md mb-3 flex items-center justify-between p-1 bg-slate-900 border border-slate-800 rounded-xl">
        <button
          onClick={() => setViewMode('demo')}
          className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-all text-center ${
            viewMode === 'demo'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          📱 Demo Responsive Interactiva
        </button>
        <button
          onClick={() => setViewMode('live-url')}
          className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-all text-center ${
            viewMode === 'live-url'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🌐 Probar URL En Vivo
        </button>
      </div>

      {/* Simulator Frame */}
      <div 
        className={`relative w-[360px] h-[720px] bg-slate-900 border-[10px] ${
          deviceModel === 'galaxy' 
            ? 'rounded-[38px] border-slate-700 shadow-2xl shadow-black/80' 
            : 'rounded-[46px] border-slate-800 shadow-2xl shadow-emerald-950/20'
        } overflow-hidden flex flex-col`}
      >
        {/* Dynamic Status Bar */}
        <div 
          className="w-full h-8 px-6 flex items-center justify-between text-[11px] font-semibold shrink-0 select-none z-30 transition-colors"
          style={{ 
            backgroundColor: config.statusBarColor || config.themeColor || '#0f172a',
            color: config.isDarkStatusBar ? '#ffffff' : '#0f172a'
          }}
        >
          <span>{currentTime}</span>

          {/* Punch-hole Camera */}
          <div className="w-3.5 h-3.5 rounded-full bg-black border border-slate-800 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px]">5G</span>
            <Wifi className={`w-3.5 h-3.5 ${isSimulatingOffline ? 'opacity-30' : 'opacity-90'}`} />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] font-mono">98%</span>
              <Battery className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Pull to refresh visual bar */}
        {isRefreshing && (
          <div className="w-full bg-emerald-500/10 border-b border-emerald-500/30 py-1.5 flex items-center justify-center gap-2 text-xs text-emerald-400 animate-pulse z-40">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            <span>Actualizando WebView...</span>
          </div>
        )}

        {/* Viewport Content Area */}
        <div className="relative flex-1 bg-slate-950 overflow-y-auto overflow-x-hidden flex flex-col">
          {/* Splash screen simulation */}
          {isShowingSplash ? (
            <div 
              className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 text-center animate-fadeIn"
              style={{ backgroundColor: config.splashBgColor || config.themeColor }}
            >
              <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-4 shadow-xl">
                <Smartphone className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">{config.appName}</h2>
              <p className="text-xs text-white/70 mt-1">{config.splashText || 'Iniciando aplicación nativa...'}</p>
              <div className="mt-8 flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-white/80 animate-ping"></span>
                <span className="w-2 h-2 rounded-full bg-white/60"></span>
                <span className="w-2 h-2 rounded-full bg-white/40"></span>
              </div>
            </div>
          ) : isSimulatingOffline ? (
            /* Offline fallback page simulation */
            <div 
              className="flex-1 flex flex-col items-center justify-center p-6 text-center"
              style={{ backgroundColor: config.themeColor }}
            >
              <div className="w-16 h-16 rounded-full bg-white/10 border border-white/15 flex items-center justify-center mb-4 text-white">
                <Wifi className="w-8 h-8 opacity-40" />
              </div>
              <h2 className="text-lg font-bold text-white mb-2">{config.offlineTitle}</h2>
              <p className="text-xs text-white/70 leading-relaxed mb-6 max-w-[260px]">
                {config.offlineMessage}
              </p>
              <button
                onClick={() => {
                  setIsRefreshing(true);
                  setTimeout(() => {
                    setIsRefreshing(false);
                    setIsSimulatingOffline(false);
                  }, 700);
                }}
                className="w-full max-w-[220px] py-2.5 px-4 bg-white text-slate-950 text-xs font-semibold rounded-xl shadow-lg active:scale-95 transition-transform"
              >
                {config.offlineRetryText}
              </button>
            </div>
          ) : viewMode === 'live-url' ? (
            /* Direct URL iframe preview with fallback reassurance */
            <div className="flex-1 flex flex-col h-full bg-slate-900">
              <div className="p-2 border-b border-slate-800 bg-slate-900/90 flex items-center gap-1.5">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onUpdateConfig({ webUrl: urlInput });
                    }
                  }}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  placeholder="https://tu-sitio.com"
                />
                <button
                  onClick={() => onUpdateConfig({ webUrl: urlInput })}
                  className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-medium text-xs rounded-lg transition-colors"
                >
                  Ir
                </button>
              </div>

              <div className="relative flex-1">
                <iframe
                  src={config.webUrl}
                  title="Live Web Preview"
                  className="w-full h-full border-0 bg-white"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              </div>

              <div className="p-2.5 bg-slate-900/95 border-t border-slate-800 text-[11px] text-slate-400">
                <div className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Garantía WebView:</strong> Si este sitio web bloquea iframes en navegadores por seguridad (X-Frame-Options), ten la total certeza de que <strong>en la APK Android se abrirá al 100%</strong> como app nativa sin bloqueos.
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Full interactive responsive web application */
            <div className="flex-1 flex flex-col justify-between h-full bg-slate-950 text-slate-100">
              {/* App Internal Header */}
              <div 
                className="px-4 py-3 border-b border-slate-800/80 flex items-center justify-between shrink-0"
                style={{ backgroundColor: config.themeColor }}
              >
                <div>
                  <h1 className="text-sm font-bold tracking-tight text-white">{config.appName}</h1>
                  <span className="text-[10px] text-white/70 block leading-none mt-0.5">Versión Móvil Optimizada</span>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={triggerRefresh}
                    title="Recargar página"
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setActiveTab('cart')}
                    className="relative p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-[9px] font-bold text-slate-950 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Scrollable Viewport Body */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
                {activeTab === 'home' && (
                  <>
                    {/* Search bar */}
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Buscar en la web app..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {/* Responsive Banner Card */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-800 p-4 text-white shadow-lg">
                      <div className="relative z-10">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-200">
                          100% Responsive Nativo
                        </span>
                        <h2 className="text-base font-bold mt-1 leading-snug">
                          Tus botones, compras y sesiones funcionan idéntico a una app.
                        </h2>
                        <button 
                          onClick={() => setCartCount(c => c + 1)}
                          className="mt-3 px-3 py-1.5 bg-white text-slate-950 font-semibold text-xs rounded-lg shadow-sm hover:bg-slate-100 transition-colors"
                        >
                          Probar Acción Dinámica
                        </button>
                      </div>
                    </div>

                    {/* Category horizontal scroll */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-semibold text-slate-300">Colecciones</h3>
                        <span className="text-[10px] text-emerald-400 font-medium">Ver todo</span>
                      </div>
                      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                        {['Destacados', 'Ofertas', 'Novedades', 'Tendencias', 'Populares'].map((tag, idx) => (
                          <button
                            key={tag}
                            className={`px-3 py-1 text-xs rounded-lg whitespace-nowrap transition-colors ${
                              idx === 0
                                ? 'bg-emerald-500 text-slate-950 font-semibold'
                                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Product grid */}
                    <div className="grid grid-cols-2 gap-2.5">
                      {products.map(prod => (
                        <div
                          key={prod.id}
                          className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-2.5 flex flex-col justify-between hover:border-slate-700 transition-all"
                        >
                          <div className={`w-full h-24 rounded-lg bg-gradient-to-br ${prod.imageBg} flex items-center justify-center mb-2 shadow-inner relative`}>
                            <ShoppingBag className="w-8 h-8 text-white/80" />
                            <span className="absolute bottom-1 right-1 text-[9px] px-1.5 py-0.5 rounded bg-black/40 text-white backdrop-blur-xs">
                              ⭐ {prod.rating}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-500 block truncate">{prod.category}</span>
                            <h4 className="text-xs font-semibold text-slate-200 line-clamp-1">{prod.name}</h4>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs font-bold text-emerald-400 font-mono">${prod.price.toFixed(2)}</span>
                              <button
                                onClick={() => setCartCount(c => c + 1)}
                                className="w-6 h-6 rounded-md bg-emerald-500 text-slate-950 flex items-center justify-center hover:bg-emerald-400 transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {activeTab === 'categories' && (
                  <div className="space-y-2.5">
                    <h3 className="text-xs font-bold text-slate-200">Explorar Departamentos</h3>
                    {['Calzado Deportivo', 'Ropa & Moda', 'Accesorios Urbanos', 'Gadgets & Audio', 'Hogar y Oficina'].map((cat, i) => (
                      <div key={i} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-200">{cat}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'cart' && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-200">Carrito de Compra ({cartCount})</h3>
                    {cartCount > 0 ? (
                      <div className="space-y-2">
                        <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                          <div>
                            <p className="text-xs font-semibold text-slate-200">Sneakers Velocity Pro</p>
                            <p className="text-[10px] text-slate-400 font-mono">$89.99</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => setCartCount(Math.max(0, cartCount - 1))}
                              className="w-5 h-5 rounded bg-slate-800 flex items-center justify-center text-slate-300"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold">{cartCount}</span>
                            <button 
                              onClick={() => setCartCount(c => c + 1)}
                              className="w-5 h-5 rounded bg-slate-800 flex items-center justify-center text-slate-300"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-center">
                          <p className="text-[11px] text-emerald-300 font-medium">LocalStorage y Cookies activos</p>
                          <p className="text-[10px] text-emerald-400/80 mt-0.5">Tus datos nunca se pierden al salir de la app.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 text-center text-slate-500">
                        <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-40" />
                        <p className="text-xs">El carrito está vacío</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'profile' && (
                  <div className="space-y-3">
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                        JD
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-200">Juan Desarrollador</h4>
                        <span className="text-[10px] text-slate-400">Sesión persistente en APK</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      {['Mis Pedidos', 'Direcciones de Envío', 'Métodos de Pago', 'Notificaciones Push', 'Seguridad & Biometría'].map((item, i) => (
                        <div key={i} className="p-2.5 bg-slate-900/60 border border-slate-800/60 rounded-xl flex items-center justify-between text-xs text-slate-300">
                          <span>{item}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Tab Bar (Navigation Anchor) */}
              <div 
                className="w-full h-14 border-t border-slate-800/80 bg-slate-900/95 backdrop-blur-md px-4 grid grid-cols-4 items-center shrink-0 z-20"
                style={{ backgroundColor: config.navBarColor || '#0f172a' }}
              >
                {[
                  { id: 'home', label: 'Inicio', icon: Smartphone },
                  { id: 'categories', label: 'Secciones', icon: Sliders },
                  { id: 'cart', label: 'Carrito', icon: ShoppingBag },
                  { id: 'profile', label: 'Perfil', icon: Heart }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className="flex flex-col items-center justify-center py-1 transition-colors group"
                    >
                      <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                      <span className={`text-[10px] font-medium mt-0.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Double-back exit notice banner */}
        {exitNoticeVisible && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 border border-slate-700 text-slate-200 px-3.5 py-1.5 rounded-full text-[11px] shadow-lg animate-bounce">
            Pulsa Atrás otra vez para salir
          </div>
        )}

        {/* Bottom Hardware Android Navigation Area */}
        <div 
          className="w-full h-8 flex items-center justify-around px-8 shrink-0 select-none z-30 transition-colors"
          style={{ backgroundColor: config.navBarColor || '#0f172a' }}
        >
          {/* Back button */}
          <button 
            onClick={handleHardwareBack}
            title="Botón Atrás de Android (Navega el historial web sin cerrar la app)"
            className="p-1 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          {/* Home button / Gesture Pill */}
          <button 
            onClick={() => setActiveTab('home')}
            title="Botón Inicio"
            className="w-20 h-1 rounded-full bg-slate-500/70 hover:bg-slate-300 transition-colors"
          />
          {/* Recent Apps */}
          <button 
            onClick={triggerRefresh}
            title="Recargar página"
            className="p-1 text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Simulator helper description */}
      <div className="w-full max-w-md mt-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Emulador de WebView Nativo Activo</span>
        </span>
        <button
          onClick={handleHardwareBack}
          className="text-xs text-emerald-400 hover:underline font-medium flex items-center gap-1"
        >
          <span>Probar botón Atrás</span>
        </button>
      </div>
    </div>
  );
};
