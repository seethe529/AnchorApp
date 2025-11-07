import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { storage, secureStorage, STORAGE_KEYS } from '../utils/storage';
import { setupNotifications, scheduleMoodReminder, scheduleBreathingReminder } from '../utils/notifications';

export default function SettingsScreen() {
  const [preferences, setPreferences] = useState({
    darkMode: false,
    notifications: true,
    moodReminders: true,
    breathingReminders: false,
    hapticFeedback: true,
    dataSharing: false
  });

  useEffect(() => {
    loadPreferences();
    setupNotifications();
  }, []);

  const loadPreferences = async () => {
    try {
      const savedPreferences = await storage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      if (savedPreferences) {
        setPreferences(savedPreferences);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
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
    const newPreferences = { ...preferences, [key]: !preferences[key] };
    await savePreferences(newPreferences);
    
    // Handle notification scheduling
    if (key === 'moodReminders' && newPreferences.moodReminders) {
      await scheduleMoodReminder();
    }
    if (key === 'breathingReminders' && newPreferences.breathingReminders) {
      await scheduleBreathingReminder();
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

  const exportData = () => {
    Alert.alert('Export Data', 'Data export feature coming soon. This will allow you to share your progress with healthcare providers.');
  };

  const settingSections = [
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
        { key: 'darkMode', title: 'Dark Mode', subtitle: 'Use dark theme (coming soon)' },
        { key: 'hapticFeedback', title: 'Haptic Feedback', subtitle: 'Vibration for interactions' }
      ]
    },
    {
      title: 'Privacy',
      items: [
        { key: 'dataSharing', title: 'Anonymous Analytics', subtitle: 'Help improve the app' }
      ]
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      {settingSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.items.map((item, itemIndex) => (
            <View key={itemIndex} style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{item.title}</Text>
                <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
              </View>
              <Switch
                value={preferences[item.key]}
                onValueChange={() => togglePreference(item.key)}
                trackColor={{ false: '#767577', true: '#2E8B57' }}
                thumbColor={preferences[item.key] ? '#ffffff' : '#f4f3f4'}
                accessibilityLabel={`${item.title} toggle`}
                accessibilityHint={item.subtitle}
                accessibilityRole="switch"
                accessibilityState={{ checked: preferences[item.key] }}
              />
            </View>
          ))}
        </View>
      ))}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={exportData}
          accessibilityLabel="Export Data"
          accessibilityHint="Share your data with healthcare provider"
          accessibilityRole="button"
        >
          <Ionicons name="download" size={24} color="#2E8B57" />
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Export Data</Text>
            <Text style={styles.actionSubtitle}>Share with healthcare provider</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={clearAllData}
          accessibilityLabel="Clear All Data"
          accessibilityHint="Warning: Permanently deletes all your data"
          accessibilityRole="button"
        >
          <Ionicons name="trash" size={24} color="#F44336" />
          <View style={styles.actionInfo}>
            <Text style={[styles.actionTitle, { color: '#F44336' }]}>Clear All Data</Text>
            <Text style={styles.actionSubtitle}>Permanently delete all data</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Version:</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Build:</Text>
          <Text style={styles.infoValue}>Enhanced</Text>
        </View>
        <Text style={styles.disclaimer}>
          This app is not a replacement for professional mental health treatment. 
          If you're experiencing a mental health crisis, please contact emergency services immediately.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2E8B57', textAlign: 'center', marginVertical: 20 },
  section: { backgroundColor: 'white', margin: 15, padding: 15, borderRadius: 10, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  settingInfo: { flex: 1 },
  settingTitle: { fontSize: 16, fontWeight: '500', color: '#333' },
  settingSubtitle: { fontSize: 14, color: '#666', marginTop: 2 },
  actionButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  actionInfo: { flex: 1, marginLeft: 15 },
  actionTitle: { fontSize: 16, fontWeight: '500', color: '#333' },
  actionSubtitle: { fontSize: 14, color: '#666', marginTop: 2 },
  infoItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  infoLabel: { fontSize: 16, color: '#666' },
  infoValue: { fontSize: 16, fontWeight: '500', color: '#333' },
  disclaimer: { fontSize: 12, color: '#999', marginTop: 15, lineHeight: 18, fontStyle: 'italic' }
});