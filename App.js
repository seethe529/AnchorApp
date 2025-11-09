import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
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
import BreathingExercise from './src/components/BreathingExercise';
import SafetyPlan from './src/components/SafetyPlan';
import { setupNotifications } from './src/utils/notifications';
import { storage } from './src/utils/storage';
import ErrorBoundary from './src/components/ErrorBoundary';
import ErrorLogger from './src/utils/errorLogger';
import OfflineIndicator from './src/components/OfflineIndicator';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Tools') iconName = focused ? 'build' : 'build-outline';
          else if (route.name === 'AI Support') iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          else if (route.name === 'Crisis') iconName = focused ? 'medical' : 'medical-outline';
          else if (route.name === 'Progress') iconName = focused ? 'analytics' : 'analytics-outline';
          else if (route.name === 'Settings') iconName = focused ? 'settings' : 'settings-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2E8B57',
        tabBarInactiveTintColor: 'gray',
        headerStyle: { backgroundColor: '#2E8B57' },
        headerTintColor: 'white',
        tabBarStyle: { paddingBottom: 25, paddingTop: 5, height: 85, paddingHorizontal: 10 }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Tools" component={ToolsScreen} />
      <Tab.Screen name="AI Support" component={AIAgentScreen} />
      <Tab.Screen name="Crisis" component={CrisisScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await setupNotifications();
      await checkDisclaimer();
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E8B57" />
        <Text style={styles.loadingText}>Loading Anchor...</Text>
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
          headerStyle: { backgroundColor: '#2E8B57' },
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
          name="Safety Plan" 
          component={SafetyPlan} 
          options={{ title: 'Safety Plan', headerBackTitle: 'Back' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
});