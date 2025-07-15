import { useState, useEffect, createContext, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: {
    background: string;
    surface: string;
    card: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    primary: string;
    secondary: string;
    accent: string;
    border: string;
    borderLight: string;
    success: string;
    warning: string;
    error: string;
    overlay: string;
  };
}

const lightColors = {
  background: '#FAFBFC',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  primary: '#8B5CF6',
  secondary: '#3B82F6',
  accent: '#10B981',
  border: '#F1F3F4',
  borderLight: '#F9FAFB',
  success: '#16A34A',
  warning: '#F59E0B',
  error: '#EF4444',
  overlay: 'rgba(255, 255, 255, 0.95)',
};

const darkColors = {
  background: '#0F172A',
  surface: '#1E293B',
  card: '#334155',
  text: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textTertiary: '#94A3B8',
  primary: '#A78BFA',
  secondary: '#60A5FA',
  accent: '#34D399',
  border: '#475569',
  borderLight: '#64748B',
  success: '#22C55E',
  warning: '#FBBF24',
  error: '#F87171',
  overlay: 'rgba(30, 41, 59, 0.95)',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const useThemeProvider = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const colors = isDarkMode ? darkColors : lightColors;

  return {
    isDarkMode,
    toggleTheme,
    colors,
  };
};

export const ThemeProvider = ThemeContext.Provider;