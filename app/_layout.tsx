import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeProvider, useThemeProvider } from '@/hooks/useTheme';

export default function RootLayout() {
  useFrameworkReady();
  const themeData = useThemeProvider();

  return (
    <ThemeProvider value={themeData}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={themeData.isDarkMode ? "light" : "dark"} />
    </ThemeProvider>
  );
}
