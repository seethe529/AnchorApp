import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Share, Platform, Linking, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WheelPicker from '../components/WheelPicker';
import { storage, secureStorage, STORAGE_KEYS } from '../utils/storage';
import { requestPermissions, scheduleMoodReminder, scheduleBreathingReminder, cancelMoodReminder, cancelBreathingReminder, debugListScheduled, exportScheduledNotifications } from '../utils/notifications';
import Constants from 'expo-constants';
import { useTheme, designTokens } from '../context/ThemeContext';
import Card from '../components/Card';

const APP_VERSION = Constants.expoConfig?.version || '1.0.0';

export default function SettingsScreen({ navigation }) {
  const { theme, isDark, toggleTheme } = useTheme();
  const [preferences, setPreferences] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedHour, setSelectedHour] = useState(20);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const savedPreferences = await storage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      if (savedPreferences) {
        setPreferences(savedPreferences);
        // Load saved time or default to 8 PM
        if (savedPreferences.moodReminderTime) {
          const [hour] = savedPreferences.moodReminderTime.split(':').map(Number);
          setSelectedHour(hour);
        }
      } else {
        // Set defaults only if no saved preferences
        const defaults = {
          darkMode: false,
          notifications: false,
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
        const granted = await requestPermissions();
        if (!granted) {
          Alert.alert(
            'Permission Required',
            'Please enable notifications in your device settings to use reminders.',
            [{ text: 'OK' }]
          );
          return;
        }
      } else {
        await cancelMoodReminder();
        await cancelBreathingReminder();
      }
    }
    
    // Check permissions for mood/breathing reminders
    if (key === 'moodReminders' || key === 'breathingReminders') {
      if (!preferences[key]) { // Trying to turn ON
        const granted = await requestPermissions();
        if (!granted) {
          Alert.alert(
            'Notifications Required',
            'Please enable notifications first to receive reminders.',
            [{ text: 'OK' }]
          );
          return;
        }
      }
    }
    
    const newPreferences = { ...preferences, [key]: !preferences[key] };
    await savePreferences(newPreferences);
    
    if (!newPreferences.notifications) return;
    
    if (key === 'moodReminders') {
      if (newPreferences.moodReminders) {
        await scheduleMoodReminder({ hour: selectedHour, minute: 0 });
      } else {
        await cancelMoodReminder();
      }
    }
    
    if (key === 'breathingReminders') {
      if (newPreferences.breathingReminders) {
        await scheduleBreathingReminder();
      } else {
        await cancelBreathingReminder();
      }
    }
  };

  const handleTimeSave = async () => {
    const timeString = `${selectedHour}:00`;
    const newPreferences = { ...preferences, moodReminderTime: timeString };
    await savePreferences(newPreferences);
    
    if (preferences.notifications && preferences.moodReminders) {
      await cancelMoodReminder();
      await scheduleMoodReminder({ hour: selectedHour, minute: 0 });
    }
    
    setShowTimePicker(false);
  };

  const formatTime = (hour) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHours = hour % 12 || 12;
    return `${displayHours}:00 ${ampm}`;
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

  const exportNotifications = async () => {
    try {
      const notifData = await exportScheduledNotifications();
      
      if (!notifData) {
        Alert.alert('Error', 'Unable to export notifications. Platform not supported.');
        return;
      }

      const jsonString = JSON.stringify(notifData, null, 2);
      
      await Share.share({
        message: jsonString,
        title: 'Scheduled Notifications Export'
      });
    } catch (error) {
      console.error('Export notifications error:', error);
      Alert.alert('Error', 'Failed to export notifications. Please try again.');
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
        { key: 'moodReminders', title: 'Daily Mood Check-ins', subtitle: `Daily reminder at ${formatTime(selectedHour)}` },
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
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <Text style={[styles.title, { color: theme.primary }]}>Settings</Text>
      
      {settingSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{section.title}</Text>
          {section.items.map((item, itemIndex) => (
            <React.Fragment key={itemIndex}>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingTitle, { color: theme.text }]}>{item.title}</Text>
                  <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>{item.subtitle}</Text>
                </View>
                <Switch
                  value={item.key === 'darkMode' ? isDark : preferences[item.key]}
                  onValueChange={() => togglePreference(item.key)}
                  trackColor={{ false: isDark ? '#767577' : '#9CA3AF', true: theme.primary }}
                  thumbColor='#ffffff'
                  accessibilityLabel={`${item.title} toggle`}
                  accessibilityHint={item.subtitle}
                  accessibilityRole="switch"
                  accessibilityState={{ checked: item.key === 'darkMode' ? isDark : preferences[item.key] }}
                />
              </View>
              {item.key === 'moodReminders' && preferences.moodReminders && (
                <TouchableOpacity 
                  style={styles.timePickerButton}
                  onPress={() => {
                    console.log('Change Time tapped, opening picker');
                    setShowTimePicker(true);
                  }}
                  accessibilityLabel="Change mood reminder time"
                  accessibilityRole="button"
                >
                  <Ionicons name="time-outline" size={20} color={theme.primary} style={{ marginRight: 12 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.settingTitle, { color: theme.text }]}>Change Time</Text>
                    <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>Tap to select reminder time</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={theme.textTertiary} />
                </TouchableOpacity>
              )}
            </React.Fragment>
          ))}
          {section.title === 'Notifications' && Platform.OS === 'android' && (
            <View style={styles.androidNotice}>
              <Ionicons name="information-circle" size={20} color={theme.primary} />
              <Text style={[styles.androidNoticeText, { color: theme.textSecondary }]}>
                For reliable notifications, disable battery optimization for Anchor in Android Settings → Apps → Anchor → Battery → Unrestricted.
              </Text>
            </View>
          )}
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

        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => Linking.openURL('https://seethe529.github.io/AnchorApp/')}
          accessibilityLabel="Privacy Policy"
          accessibilityHint="View our privacy policy and data practices"
          accessibilityRole="button"
        >
          <Ionicons name="shield-checkmark" size={24} color={theme.primary} />
          <View style={styles.actionInfo}>
            <Text style={[styles.actionTitle, { color: theme.text }]}>Privacy Policy</Text>
            <Text style={[styles.actionSubtitle, { color: theme.textSecondary }]}>How we handle your data</Text>
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
      
      {showTimePicker && (
        <Modal
          visible={showTimePicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowTimePicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                  <Text style={[styles.modalCancel, { color: theme.textSecondary }]}>Cancel</Text>
                </TouchableOpacity>
                <Text style={[styles.modalTitle, { color: theme.text }]}>Select Time</Text>
                <TouchableOpacity onPress={handleTimeSave}>
                  <Text style={[styles.modalDone, { color: theme.primary }]}>Done</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.pickerRow}>
                <WheelPicker
                  items={Array.from({ length: 24 }, (_, i) => ({
                    label: `${i % 12 || 12} ${i >= 12 ? 'PM' : 'AM'}`,
                    value: i
                  }))}
                  selectedValue={selectedHour}
                  onValueChange={setSelectedHour}
                  style={styles.picker}
                />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  title: { 
    ...designTokens.typography.h1,
    textAlign: 'center',
    marginVertical: 24,
  },
  section: { 
    marginHorizontal: 20,
    marginBottom: designTokens.spacing.section,
    padding: designTokens.spacing.cardPadding,
    borderRadius: designTokens.borderRadius.card,
    ...designTokens.shadows.card,
  },
  sectionTitle: { 
    ...designTokens.typography.h2,
    marginBottom: 16,
  },
  settingItem: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    minHeight: 60,
  },
  settingInfo: { 
    flex: 1,
    paddingRight: 16,
  },
  settingTitle: { 
    fontSize: 16,
    fontWeight: '600',
  },
  settingSubtitle: { 
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },
  actionButton: { 
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    minHeight: 60,
  },
  actionInfo: { 
    flex: 1,
    marginLeft: 16,
  },
  actionTitle: { 
    fontSize: 16,
    fontWeight: '600',
  },
  actionSubtitle: { 
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },
  infoItem: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  infoLabel: { 
    fontSize: 16,
  },
  infoValue: { 
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimer: { 
    fontSize: 13,
    marginTop: 16,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  androidNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(46, 132, 93, 0.1)',
    borderRadius: 8,
    gap: 10,
  },
  androidNoticeText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  timePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalDone: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalCancel: {
    fontSize: 16,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  picker: {
    width: 150,
    height: 200,
  },
});
