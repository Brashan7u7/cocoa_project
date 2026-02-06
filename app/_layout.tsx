import { useState, useEffect, useCallback } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { FlowProvider } from '../src/presentation/context/FlowContext';
import SplashScreen from '../src/presentation/components/SplashScreen';
import '../global.css';

// Evitar que el splash nativo se oculte automáticamente
ExpoSplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Aquí puedes cargar recursos, fuentes, etc.
        // Por ahora solo ocultamos el splash nativo
        await ExpoSplashScreen.hideAsync();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  if (!appIsReady) {
    return null;
  }

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <FlowProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#F9FAFB' },
        }}
      />
    </FlowProvider>
  );
}
