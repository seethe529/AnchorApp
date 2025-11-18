import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage, STORAGE_KEYS } from '../utils/storage';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const lightTheme = {
  background: '#F5F5F5',
  card: '#FFFFFF',
  text: '#333333',
  textSecondary: '#666666',
  textTertiary: '#999999',
  border: '#E0E0E0',
  primary: '#2E8B57',
  error: '#F44336',
  shadow: '#000000',
};

export const darkTheme = {
  background: '#1C1C1E',
  card: '#2C2C2E',
  text: '#FFFFFF',
  textSecondary: '#ABABAB',
  textTertiary: '#636366',
  border: '#38383A',
  primary: '#2E8B57',
  error: '#F44336',
  shadow: '#000000',
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
