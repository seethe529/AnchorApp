import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage, STORAGE_KEYS } from '../utils/storage';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const lightTheme = {
  // Backgrounds — a soft grey canvas so white cards separate cleanly
  // (iOS 26 grouped-list style: separation from surface color, soft shadows).
  background: '#F4F6F8',
  backgroundSecondary: '#FFFFFF',
  card: '#FFFFFF',
  
  // Text
  text: '#1A1D21',
  textSecondary: '#6B7075',
  textTertiary: '#A3A8AE',
  
  // Accents
  primary: '#2E845D',
  primaryPressed: '#266F4D',
  primaryGradientTop: '#3FAF7F',
  primaryGradientBottom: '#2E845D',
  
  // UI Elements
  border: '#E6E6E6',
  error: '#DC3545',
  
  // Shadows
  shadow: 'rgba(0, 0, 0, 0.08)',
  shadowStrong: 'rgba(0, 0, 0, 0.12)',
  
  // Tab Bar
  tabBarBackground: 'rgba(255, 255, 255, 0.85)',
  tabBarBlur: true,
};

export const darkTheme = {
  // Backgrounds
  background: '#111418',
  backgroundSecondary: '#1A1D21',
  card: '#1A1D21',
  
  // Text
  text: '#E6E6E6',
  textSecondary: '#A3A8AE',
  textTertiary: '#6B7075',
  
  // Accents
  primary: '#3FAF7F',
  primaryPressed: '#2E845D',
  primaryGradientTop: '#3FAF7F',
  primaryGradientBottom: '#2E845D',
  
  // UI Elements
  border: '#2C2F33',
  error: '#E74C3C',
  
  // Shadows
  shadow: 'rgba(0, 0, 0, 0.3)',
  shadowStrong: 'rgba(0, 0, 0, 0.5)',
  
  // Tab Bar
  tabBarBackground: 'rgba(20, 20, 20, 0.75)',
  tabBarBlur: true,
};

// Design tokens
export const designTokens = {
  // Typography
  typography: {
    h1: { fontSize: 30, fontWeight: '700', letterSpacing: 0.3 },
    h2: { fontSize: 20, fontWeight: '600', letterSpacing: 0.2 },
    body: { fontSize: 16, fontWeight: '400' },
    caption: { fontSize: 13, fontWeight: '400' },
  },
  
  // Border Radius (iOS 26: softer, roomier corners)
  borderRadius: {
    button: 20,
    card: 22,
    cardLarge: 26,
    input: 16,
  },
  
  // Spacing
  spacing: {
    section: 32,
    cardPadding: 22,
    cardMargin: 16,
  },
  
  // Shadows — iOS 26: soft, diffuse, low-opacity depth (not hard drop shadows)
  shadows: {
    card: {
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.06,
      shadowRadius: 16,
      elevation: 2,
    },
    cardStrong: {
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.09,
      shadowRadius: 24,
      elevation: 4,
    },
    button: {
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 3,
    },
  },
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const preferences = await storage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      if (preferences?.darkMode) {
        setIsDark(true);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async () => {
    try {
      const newValue = !isDark;
      setIsDark(newValue);
      
      const preferences = await storage.getItem(STORAGE_KEYS.USER_PREFERENCES) || {};
      preferences.darkMode = newValue;
      await storage.setItem(STORAGE_KEYS.USER_PREFERENCES, preferences);
    } catch (error) {
      console.error('Error toggling theme:', error);
    }
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};
