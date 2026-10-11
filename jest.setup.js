// Mock React Native Platform
const mockPlatform = {
  OS: 'ios',
  select: jest.fn((obj) => obj.ios || obj.default),
};

// Lightweight React Native mock. Each stub mirrors the real component's
// accessibility-relevant defaults so accessibility tests check real behavior.
jest.mock('react-native', () => {
  const React = require('react');
  const remover = () => ({ remove: jest.fn() });
  const animation = () => ({ start: jest.fn(), stop: jest.fn() });

  class AnimatedValue {
    constructor(value) { this._value = value; }
    setValue(value) { this._value = value; }
    interpolate() { return this; }
    stopAnimation() {}
  }

  return {
    // Modal only renders its children when visible, like the real component,
    // so open/cancel tests stay meaningful.
    Modal: ({ visible, children }) => (visible ? children : null),
    Platform: mockPlatform,
    AppState: {
      addEventListener: jest.fn(remover),
    },
    StyleSheet: {
      create: (styles) => styles,
      flatten: (styles) => styles,
      absoluteFill: {},
    },
    View: 'View',
    Text: 'Text',
    ScrollView: 'ScrollView',
    // Real TouchableOpacity is accessible unless accessible={false}.
    TouchableOpacity: (props) =>
      React.createElement('TouchableOpacity', { ...props, accessible: props.accessible !== false }),
    TouchableWithoutFeedback: 'TouchableWithoutFeedback',
    // Real Switch defaults its role to "switch".
    Switch: (props) =>
      React.createElement('Switch', { accessibilityRole: 'switch', ...props }),
    TextInput: 'TextInput',
    ActivityIndicator: 'ActivityIndicator',
    KeyboardAvoidingView: 'KeyboardAvoidingView',
    // Render every item so screens built on FlatList (e.g. Breathing) are testable.
    FlatList: React.forwardRef(({ data = [], renderItem, keyExtractor }, _ref) =>
      React.createElement(
        'FlatList',
        null,
        data.map((item, index) =>
          React.createElement(
            React.Fragment,
            { key: keyExtractor ? keyExtractor(item, index) : String(index) },
            renderItem({ item, index })
          )
        )
      )
    ),
    Animated: {
      View: 'Animated.View',
      Value: AnimatedValue,
      timing: jest.fn(animation),
      spring: jest.fn(animation),
    },
    Keyboard: {
      addListener: jest.fn(remover),
      dismiss: jest.fn(),
    },
    AccessibilityInfo: {
      announceForAccessibility: jest.fn(),
      isReduceMotionEnabled: jest.fn(() => Promise.resolve(false)),
      isReduceTransparencyEnabled: jest.fn(() => Promise.resolve(false)),
      addEventListener: jest.fn(remover),
    },
    Share: {
      share: jest.fn(() => Promise.resolve()),
    },
    Dimensions: {
      get: jest.fn(() => ({ width: 375, height: 667 })),
    },
    Linking: {
      openURL: jest.fn(() => Promise.resolve()),
    },
    Alert: {
      alert: jest.fn(),
      // iOS-only API used by SafetyPlan for quick text entry.
      prompt: jest.fn(),
    },
  };
});

// Export for test manipulation
global.mockPlatform = mockPlatform;

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
  cancelAllScheduledNotificationsAsync: jest.fn(() => Promise.resolve()),
  getAllScheduledNotificationsAsync: jest.fn(() => Promise.resolve([])),
  getPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'undetermined' })),
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  setNotificationChannelAsync: jest.fn(() => Promise.resolve()),
  AndroidImportance: { MAX: 4, HIGH: 3 },
  AndroidNotificationPriority: { HIGH: 'high', MAX: 'max', DEFAULT: 'default' },
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

// Mock export-related native modules used by SettingsScreen (PDF/JSON export).
jest.mock('expo-print', () => ({
  printToFileAsync: jest.fn(() => Promise.resolve({ uri: 'file:///mock.pdf' })),
}));
jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn(() => Promise.resolve(true)),
  shareAsync: jest.fn(() => Promise.resolve()),
}));
jest.mock('expo-file-system/next', () => ({
  File: jest.fn().mockImplementation(() => ({
    exists: false,
    create: jest.fn(),
    write: jest.fn(),
    delete: jest.fn(),
    uri: 'file:///mock.json',
  })),
  Paths: { cache: 'file:///cache/', document: 'file:///document/' },
}));

// Mock expo-device (native module; imported by src/services/openai.js, so any
// test that renders the AI screen needs it).
jest.mock('expo-device', () => ({
  modelName: 'iPhone',
  osVersion: '17.0',
}));

// Mock @react-navigation/elements (useHeaderHeight / HeaderHeightContext pull
// in native view-manager code that isn't available in the Jest environment).
jest.mock('@react-navigation/elements', () => {
  const React = require('react');
  return {
    HeaderHeightContext: React.createContext(undefined),
    useHeaderHeight: () => 0,
  };
});

// Mock SafeAreaContext
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
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

// Mock expo-constants
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      openaiApiKey: 'test-api-key',
    },
  },
}));

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

// Mock react-native-chart-kit
jest.mock('react-native-chart-kit', () => ({
  LineChart: 'LineChart',
  BarChart: 'BarChart',
}));
