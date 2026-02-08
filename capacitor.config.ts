import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tutormaster.pro',
  appName: 'مدير الدروس',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: true,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#020617',
    },
  },
};

export default config;
