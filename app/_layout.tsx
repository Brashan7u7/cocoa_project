import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FlowProvider } from '../src/presentation/context/FlowContext';
import '../global.css';

export default function RootLayout() {
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
