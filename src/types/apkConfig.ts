export interface ApkConfig {
  appName: string;
  packageName: string;
  webUrl: string;
  versionName: string;
  versionCode: number;
  themeColor: string;
  statusBarColor: string;
  navBarColor: string;
  isDarkStatusBar: boolean;
  orientation: 'portrait' | 'landscape' | 'sensor';
  displayMode: 'standalone' | 'fullscreen' | 'immersive';
  
  // WebView & Optimization flags
  pullToRefresh: boolean;
  hardwareAcceleration: boolean;
  domStorageEnabled: boolean;
  databaseEnabled: boolean;
  cookiesEnabled: boolean;
  thirdPartyCookies: boolean;
  cacheMode: 'LOAD_DEFAULT' | 'LOAD_CACHE_ELSE_NETWORK' | 'LOAD_NO_CACHE';
  
  // Hardware & Permissions
  allowCameraUploads: boolean;
  allowGeolocation: boolean;
  allowFileDownloads: boolean;
  allowExternalIntents: boolean; // WhatsApp, Tel, Mailto, Maps
  keepScreenOn: boolean;
  
  // Navigation & User Experience
  handleBackKey: boolean;
  confirmExitOnDoubleBack: boolean;
  customUserAgent: string;
  appendCustomUserAgent: boolean;
  
  // Splash Screen
  showSplashScreen: boolean;
  splashDuration: number; // milliseconds
  splashBgColor: string;
  splashText: string;
  splashIcon: string; // SVG or data URL
  
  // Offline Resilience
  enableOfflinePage: boolean;
  offlineTitle: string;
  offlineMessage: string;
  offlineRetryText: string;

  // Language & Architecture
  codeLanguage: 'java' | 'kotlin';
}

export interface SampleWebSite {
  id: string;
  name: string;
  category: string;
  url: string;
  themeColor: string;
  description: string;
  iconName: string;
  demoType: 'ecommerce' | 'delivery' | 'dashboard' | 'social';
}

export interface FileItem {
  name: string;
  path: string;
  language: string;
  description: string;
  content: string;
}
