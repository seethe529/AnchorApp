import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Secure storage for sensitive data (fallback to AsyncStorage on web)
export const secureStorage = {
  async setItem(key, value) {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem(`secure_${key}`, JSON.stringify(value));
    } else {
      const SecureStore = require('expo-secure-store');
      await SecureStore.setItemAsync(key, JSON.stringify(value));
    }
  },
  
  async getItem(key) {
    try {
      let value;
      if (Platform.OS === 'web') {
        value = await AsyncStorage.getItem(`secure_${key}`);
      } else {
        const SecureStore = require('expo-secure-store');
        value = await SecureStore.getItemAsync(key);
      }
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('SecureStorage getItem error:', error);
      return null;
    }
  },
  
  async removeItem(key) {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem(`secure_${key}`);
    } else {
      const SecureStore = require('expo-secure-store');
      await SecureStore.deleteItemAsync(key);
    }
  }
};

// Regular storage for non-sensitive data
export const storage = {
  async setItem(key, value) {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },
  
  async getItem(key) {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },
  
  async removeItem(key) {
    await AsyncStorage.removeItem(key);
  }
};

// Storage keys
export const STORAGE_KEYS = {
  MOOD_LOGS: 'mood_logs',
  TECHNIQUE_USAGE: 'technique_usage',
  SAFETY_PLAN: 'safety_plan',
  EMERGENCY_CONTACTS: 'emergency_contacts',
  USER_PREFERENCES: 'user_preferences',
  PROGRESS_DATA: 'progress_data',
  MEDICATION_REMINDERS: 'medication_reminders'
};