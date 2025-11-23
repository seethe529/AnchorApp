import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, AppState } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './src/screens/HomeScreen';
import ToolsScreen from './src/screens/ToolsScreen';
import AIAgentScreen from './src/screens/AIAgentScreen';
import CrisisScreen from './src/screens/CrisisScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import DisclaimerScreen from './src/screens/DisclaimerScreen';
import ResourcesScreen from './src/screens/ResourcesScreen';
import BreathingExercise from './src/components/BreathingExercise';
import BreathingScreen from './src/screens/BreathingScreen';
import SafetyPlan from './src/components/SafetyPlan';

import { scheduleBreathingReminder, scheduleMoodReminder } from './src/utils/notifications';
import { storage } from './src/utils/storage';
import ErrorBoundary from './src/components/ErrorBoundary';
import ErrorLogger from './src/utils/errorLogger';
import OfflineIndicator from './src/components/OfflineIndicator';
import { ThemeProvider, useTheme, designTokens } from './src/context/ThemeContext';
import { BlurView } from 'expo-blur';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  const { theme, isDark } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          // Use filled icons for bold appearance
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Tools') iconName = 'build';
          else if (route.name === 'AI') iconName = 'chatbubbles';
          else if (route.name === 'Crisis') iconName = 'medical';
          else if (route.name === 'Progress') iconName = 'analytics';
          else if (route.name === 'Settings') iconName = 'settings';
          return <Ionicons name={iconName} size={27} color={color} />;
        },
        tabBarActiveTintColor: isDark ? '#4ADE80' : '#2E845D',
        tabBarInactiveTintColor: isDark ? '#6B7280' : '#94A3B8',
        headerStyle: { backgroundColor: theme.primary },
        headerTintColor: 'white',
        tabBarStyle: { 
          position: 'absolute',
          paddingBottom: 24,
          paddingTop: 8,
          height: 75,
          paddingHorizontal: 8,
          backgroundColor: isDark ? '#0F1115' : '#FFFFFF',
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '600',
        },
        tabBarLabelPosition: 'below-icon',
        tabBarIconStyle: {
          marginTop: 0,
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Tools" component={ToolsScreen} />
      <Tab.Screen name="AI" component={AIAgentScreen} options={{ tabBarLabel: 'AI', title: 'Support Chat' }} />
      <Tab.Screen name="Crisis" component={CrisisScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function AppContent() {
  const { theme } = useTheme();
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeApp();
    
    // Hourly check for date change to reset notifications
    const timer = setInterval(async () => {
      const now = new Date();
      const last = await storage.getItem("last_reset") || 0;

      if (now.getDate() !== last) {
        console.log('🌙 [APP] Date changed, resetting notifications');
        await scheduleBreathingReminder();
        await scheduleMoodReminder();
        await storage.setItem("last_reset", now.getDate());
      }
    }, 3600000); // every hour

    return () => clearInterval(timer);
  }, []);

  const initializeApp = async () => {
    try {
      await checkDisclaimer();
      
      // Initialize last_reset if not set
      const lastReset = await storage.getItem("last_reset");
      if (!lastReset) {
        await storage.setItem("last_reset", new Date().getDate());
      }
    } catch (error) {
      ErrorLogger.log(error, 'App initialization');
    } finally {
      setIsLoading(false);
    }
  };

  const checkDisclaimer = async () => {
    try {
      const accepted = await storage.getItem('disclaimer_accepted');
      setDisclaimerAccepted(accepted === true);
    } catch (error) {
      ErrorLogger.logStorageError(error, 'checkDisclaimer');
      setDisclaimerAccepted(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading Anchor...</Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
    <SafeAreaProvider>
    <OfflineIndicator />
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: theme.primary },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      >
        {!disclaimerAccepted && (
          <Stack.Screen 
            name="Disclaimer" 
            component={DisclaimerScreen} 
            options={{ headerShown: false }}
          />
        )}
        <Stack.Screen 
          name="MainApp" 
          component={MainTabs} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Breathing" 
          component={BreathingExercise} 
          options={{ title: 'Breathing Exercise', headerBackTitle: 'Back' }}
        />
        <Stack.Screen 
          name="BreathingMethods" 
          component={BreathingScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Safety Plan" 
          component={SafetyPlan} 
          options={{ title: 'Safety Plan', headerBackTitle: 'Back' }}
        />
        <Stack.Screen 
          name="Resources" 
          component={ResourcesScreen} 
          options={{ title: 'Resources & Citations', headerBackTitle: 'Back' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
  },
});