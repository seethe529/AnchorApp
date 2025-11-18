import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Share, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { storage, secureStorage, STORAGE_KEYS } from '../utils/storage';
import { setupNotifications, scheduleMoodReminder, scheduleBreathingReminder, cancelMoodReminder, cancelBreathingReminder } from '../utils/notifications';
import Constants from 'expo-constants';
import { useTheme } from '../context/ThemeContext';

const APP_VERSION = Constants.expoConfig?.version || '1.0.0';

export default function SettingsScreen({ navigation }) {
  const { theme, isDark, toggleTheme } = useTheme();
  const [preferences, setPreferences] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const savedPreferences = await storage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      if (savedPreferences) {
        setPreferences(savedPreferences);
      } else {
        // Set defaults only if no saved preferences
        const defaults = {
          darkMode: false,
          notifications: true,
          moodReminders: false,
          breathingReminders: false,
          hapticFeedback: true
        };
        setPreferences(defaults);
        await storage.setItem(STORAGE_KEYS.USER_PREFERENCES, defaults);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = async (newPreferences) => {
    try {
      await storage.setItem(STORAGE_KEYS.USER_PREFERENCES, newPreferences);
      setPreferences(newPreferences);
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const togglePreference = async (key) => {
    // Dark mode toggle
    if (key === 'darkMode') {
      await toggleTheme();
      return;
    }
    
    // Master notifications toggle
    if (key === 'notifications') {
      if (!preferences.notifications) {
        // Turning ON - check permission
        const granted = await setupNotifications();
        if (!granted) {
          Alert.alert(
            'Permission Required',
            'Please enable notifications in your device settings to receive reminders.',
            [{ text: 'OK' }]
          );
          return;
        }
      } else {
        // Turning OFF - cancel all
        await cancelMoodReminder();
        await cancelBreathingReminder();
      }
    }
    
    const newPreferences = { ...preferences, [key]: !preferences[key] };
    await savePreferences(newPreferences);
    
    // Only schedule if master notifications is enabled
    if (!newPreferences.notifications) return;
    
    // Handle mood reminders
    if (key === 'moodReminders') {
      if (newPreferences.moodReminders) {
        // Small delay to prevent immediate firing
        setTimeout(async () => {
          await scheduleMoodReminder();
        }, 100);
        Alert.alert('Reminder Set', 'You\'ll receive a daily mood check-in at 8:00 PM');
      } else {
        await cancelMoodReminder();
      }
    }
    
    // Handle breathing reminders
    if (key === 'breathingReminders') {
      if (newPreferences.breathingReminders) {
        // Small delay to prevent immediate firing
        setTimeout(async () => {
          await scheduleBreathingReminder();
        }, 100);
        Alert.alert('Reminder Set', 'You\'ll receive breathing reminders every hour');
      } else {
        await cancelBreathingReminder();
      }
    }
  };

  const clearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your mood logs, progress data, safety plan, and preferences. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await storage.removeItem(STORAGE_KEYS.MOOD_LOGS);
              await storage.removeItem(STORAGE_KEYS.TECHNIQUE_USAGE);
              await storage.removeItem(STORAGE_KEYS.PROGRESS_DATA);
              await storage.removeItem(STORAGE_KEYS.USER_PREFERENCES);
              await storage.removeItem('conversation_history');
              await storage.removeItem('disclaimer_accepted');
              await secureStorage.removeItem(STORAGE_KEYS.SAFETY_PLAN);
              Alert.alert('Success', 'All data has been cleared. Please restart the app.');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          }
        }
      ]
    );
  };

  const exportData = async () => {
    try {
      // Gather all user data
      const moodLogs = await storage.getItem(STORAGE_KEYS.MOOD_LOGS) || [];
      const techniqueUsage = await storage.getItem(STORAGE_KEYS.TECHNIQUE_USAGE) || [];
      const userPreferences = await storage.getItem(STORAGE_KEYS.USER_PREFERENCES) || {};
      const conversationHistory = await storage.getItem('conversation_history') || [];
      
      const exportData = {
        exportDate: new Date().toISOString(),
        appVersion: APP_VERSION,
        data: {
          moodLogs: moodLogs.map(log => ({
            date: log.date,
            mood: log.moodName,
            value: log.mood,
            notes: log.notes || '',
            timestamp: log.timestamp
          })),
          techniqueUsage: techniqueUsage.map(usage => ({
            technique: usage.technique,
            category: usage.category,
            effectiveness: usage.effectiveness,
            date: usage.date,
            timestamp: usage.timestamp
          })),
          conversationCount: conversationHistory.length,
          preferences: userPreferences
        },
        summary: {
          totalMoodLogs: moodLogs.length,
          totalTechniquesUsed: techniqueUsage.length,
          averageMood: moodLogs.length > 0 
            ? (moodLogs.reduce((sum, log) => sum + log.mood, 0) / moodLogs.length).toFixed(2)
            : 'N/A'
        }
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      
      if (Platform.OS === 'web') {
        // Web: Download as file
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `anchor-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        Alert.alert('Success', 'Data exported successfully');
      } else {
        // Mobile: Share
        await Share.share({
          message: jsonString,
          title: 'Anchor App Data Export'
        });
      }
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Error', 'Failed to export data. Please try again.');
    }
  };

  const settingSections = [
    {
      title: 'Appearance',
      items: [
        { key: 'darkMode', title: 'Dark Mode', subtitle: 'Reduce eye strain at night' }
      ]
    },
    {
      title: 'Notifications',
      items: [
        { key: 'notifications', title: 'Enable Notifications', subtitle: 'Receive app notifications' },
        { key: 'moodReminders', title: 'Daily Mood Check-ins', subtitle: 'Remind me to log my mood' },
        { key: 'breathingReminders', title: 'Breathing Reminders', subtitle: 'Periodic breathing exercise prompts' }
      ]
    },
    {
      title: 'Experience',
      items: [
        { key: 'hapticFeedback', title: 'Haptic Feedback', subtitle: 'Vibration for interactions' }
      ]
    }
  ];

  if (isLoading || !preferences) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#666' }}>Loading settings...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.primary }]}>Settings</Text>
      
      {settingSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{section.title}</Text>
          {section.items.map((item, itemIndex) => (
            <View key={itemIndex} style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: theme.text }]}>{item.title}</Text>
                <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>{item.subtitle}</Text>
              </View>
              <Switch
                value={item.key === 'darkMode' ? isDark : preferences[item.key]}
                onValueChange={() => togglePreference(item.key)}
                trackColor={{ false: '#767577', true: '#2E8B57' }}
                thumbColor={(item.key === 'darkMode' ? isDark : preferences[item.key]) ? '#ffffff' : '#f4f3f4'}
                accessibilityLabel={`${item.title} toggle`}
                accessibilityHint={item.subtitle}
                accessibilityRole="switch"
                accessibilityState={{ checked: item.key === 'darkMode' ? isDark : preferences[item.key] }}
              />
            </View>
          ))}
        </View>
      ))}

      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Data Management</Text>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={exportData}
          accessibilityLabel="Export Data"
          accessibilityHint="Share your data with healthcare provider"
          accessibilityRole="button"
        >
          <Ionicons name="download" size={24} color={theme.primary} />
          <View style={styles.actionInfo}>
            <Text style={[styles.actionTitle, { color: theme.text }]}>Export Data</Text>
            <Text style={[styles.actionSubtitle, { color: theme.textSecondary }]}>Share with healthcare provider</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={theme.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={clearAllData}
          accessibilityLabel="Clear All Data"
          accessibilityHint="Warning: Permanently deletes all your data"
          accessibilityRole="button"
        >
          <Ionicons name="trash" size={24} color={theme.error} />
          <View style={styles.actionInfo}>
            <Text style={[styles.actionTitle, { color: theme.error }]}>Clear All Data</Text>
            <Text style={[styles.actionSubtitle, { color: theme.textSecondary }]}>Permanently delete all data</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={theme.textTertiary} />
        </TouchableOpacity>
      </View>

      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Information</Text>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => navigation.navigate('Resources')}
          accessibilityLabel="Resources & Citations"
          accessibilityHint="View medical sources and citations for techniques"
          accessibilityRole="button"
        >
          <Ionicons name="book" size={24} color={theme.primary} />
          <View style={styles.actionInfo}>
            <Text style={[styles.actionTitle, { color: theme.text }]}>Resources & Citations</Text>
            <Text style={[styles.actionSubtitle, { color: theme.textSecondary }]}>Medical sources and references</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={theme.textTertiary} />
        </TouchableOpacity>
      </View>

      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>About</Text>
        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Version:</Text>
          <Text style={[styles.infoValue, { color: theme.text }]}>{APP_VERSION}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Platform:</Text>
          <Text style={[styles.infoValue, { color: theme.text }]}>{Platform.OS === 'ios' ? 'iOS' : Platform.OS === 'android' ? 'Android' : 'Web'}</Text>
        </View>
        <Text style={[styles.disclaimer, { color: theme.textTertiary }]}>
          This app is not a replacement for professional mental health treatment. 
          If you're experiencing a mental health crisis, please contact emergency services immediately.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
  section: { margin: 15, padding: 15, borderRadius: 10, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  settingInfo: { flex: 1 },
  settingTitle: { fontSize: 16, fontWeight: '500' },
  settingSubtitle: { fontSize: 14, marginTop: 2 },
  actionButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  actionInfo: { flex: 1, marginLeft: 15 },
  actionTitle: { fontSize: 16, fontWeight: '500' },
  actionSubtitle: { fontSize: 14, marginTop: 2 },
  infoItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  infoLabel: { fontSize: 16 },
  infoValue: { fontSize: 16, fontWeight: '500' },
  disclaimer: { fontSize: 12, marginTop: 15, lineHeight: 18, fontStyle: 'italic' }
});