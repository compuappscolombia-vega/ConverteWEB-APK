import { SampleWebSite } from '../types/apkConfig';

export const SAMPLE_WEBSITES: SampleWebSite[] = [
  {
    id: 'ecommerce',
    name: 'Tienda Móvil Express',
    category: 'E-Commerce Responsive',
    url: 'https://demo-tienda.ejemplo.app',
    themeColor: '#0f172a',
    description: 'Catálogo de productos con carrito interactivo, búsqueda instantánea y pasarela de pago móvil.',
    iconName: 'ShoppingBag',
    demoType: 'ecommerce'
  },
  {
    id: 'delivery',
    name: 'Sabor Ya! Delivery',
    category: 'Food & Delivery',
    url: 'https://demo-delivery.ejemplo.app',
    themeColor: '#ea580c',
    description: 'Carta de platos gourmet con tracking en vivo de repartidor, geolocalización y pedidos.',
    iconName: 'UtensilsCrossed',
    demoType: 'delivery'
  },
  {
    id: 'dashboard',
    name: 'FinanzApp Móvil',
    category: 'Fintech & Dashboard',
    url: 'https://demo-fintech.ejemplo.app',
    themeColor: '#059669',
    description: 'Gestión de ingresos, transferencias rápidas, gráficos de balance y alertas en tiempo real.',
    iconName: 'Wallet',
    demoType: 'dashboard'
  },
  {
    id: 'custom',
    name: 'Mi Sitio Web Personal / Empresa',
    category: 'URL Propia',
    url: 'https://example.com',
    themeColor: '#3b82f6',
    description: 'Introduce la URL de tu página web responsive para visualizarla y compilarla en APK.',
    iconName: 'Globe',
    demoType: 'ecommerce'
  }
];
