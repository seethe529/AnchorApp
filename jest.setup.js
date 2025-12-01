// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Mock SecureStore
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(() => Promise.resolve()),
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  deleteItemAsync: jest.fn(() => Promise.resolve()),
}));

// Mock Notifications
jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  scheduleNotificationAsync: jest.fn(() => Promise.resolve('notification-id')),
  cancelScheduledNotificationAsync: jest.fn(() => Promise.resolve()),
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
}));

// Mock Location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getCurrentPositionAsync: jest.fn(() => Promise.resolve({ coords: { latitude: 0, longitude: 0 } })),
}));

// Mock Haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
}));

// Mock Ionicons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// Mock SafeAreaContext
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

// Mock ThemeContext
jest.mock('./src/context/ThemeContext', () => {
  const React = require('react');
  
  const lightTheme = {
    background: '#F8F9FA',
    backgroundSecondary: '#FFFFFF',
    card: '#FFFFFF',
    text: '#1A1D21',
    textSecondary: '#6B7075',
    textTertiary: '#A3A8AE',
    primary: '#2E845D',
    primaryPressed: '#266F4D',
    primaryGradientTop: '#3FAF7F',
    primaryGradientBottom: '#2E845D',
    border: '#E6E6E6',
    error: '#DC3545',
    shadow: 'rgba(0, 0, 0, 0.08)',
    shadowStrong: 'rgba(0, 0, 0, 0.12)',
    tabBarBackground: 'rgba(255, 255, 255, 0.85)',
    tabBarBlur: true,
  };

  return {
    useTheme: () => ({
      theme: lightTheme,
      isDark: false,
      toggleTheme: jest.fn(),
      isLoading: false,
    }),
    ThemeProvider: ({ children }) => children,
    lightTheme,
    darkTheme: lightTheme,
    designTokens: {
      typography: {
        h1: { fontSize: 30, fontWeight: '700', letterSpacing: 0.3 },
        h2: { fontSize: 20, fontWeight: '600', letterSpacing: 0.2 },
        body: { fontSize: 16, fontWeight: '400' },
        caption: { fontSize: 13, fontWeight: '400' },
      },
      borderRadius: {
        button: 16,
        card: 18,
        cardLarge: 20,
        input: 14,
      },
      spacing: {
        section: 28,
        cardPadding: 20,
        cardMargin: 16,
      },
      shadows: {
        card: {
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 2,
        },
        cardStrong: {
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 12,
          elevation: 4,
        },
        button: {
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 3,
        },
      },
    },
  };
});
