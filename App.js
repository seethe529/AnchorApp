import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    setupNotifications();
    checkDisclaimer();
  }, []);

  const checkDisclaimer = async () => {
    const accepted = await storage.getItem('disclaimer_accepted');
    setDisclaimerAccepted(accepted === true);
  };

  if (disclaimerAccepted === null) {
    return null; // Loading
  }

  return (
    <SafeAreaProvider>
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
  );
}