import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Share, Platform, Linking, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { File, Paths } from 'expo-file-system/next';
import * as Sharing from 'expo-sharing';
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
  const [tempHour, setTempHour] = useState(20);
  const [showIntervalPicker, setShowIntervalPicker] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState(90);
  const [tempInterval, setTempInterval] = useState(90);

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
        // Load saved interval or default to 90 minutes
        if (savedPreferences.breathingInterval) {
          setSelectedInterval(savedPreferences.breathingInterval);
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
        await scheduleBreathingReminder(selectedInterval);
      } else {
        await cancelBreathingReminder();
      }
    }
  };

  const handleTimeSave = async () => {
    setSelectedHour(tempHour);
    const timeString = `${tempHour}:00`;
    const newPreferences = { ...preferences, moodReminderTime: timeString };
    await savePreferences(newPreferences);
    
    setShowTimePicker(false);
    
    // Reschedule in background after modal closes
    if (preferences.notifications && preferences.moodReminders) {
      setTimeout(async () => {
        await cancelMoodReminder();
        await scheduleMoodReminder({ hour: tempHour, minute: 0 });
      }, 100);
    }
  };

  const formatTime = (hour) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHours = hour % 12 || 12;
    return `${displayHours}:00 ${ampm}`;
  };

  const handleIntervalSave = async () => {
    setSelectedInterval(tempInterval);
    const newPreferences = { ...preferences, breathingInterval: tempInterval };
    await savePreferences(newPreferences);
    
    setShowIntervalPicker(false);
    
    // Reschedule in background after modal closes
    if (preferences.notifications && preferences.breathingReminders) {
      setTimeout(async () => {
        await cancelBreathingReminder();
        await scheduleBreathingReminder(tempInterval);
      }, 100);
    }
  };

  const formatInterval = (minutes) => {
    if (minutes >= 60) {
      const hours = minutes / 60;
      return hours === 1 ? '1 hour' : `${hours} hours`;
    }
    return `${minutes} minutes`;
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

  const exportData = async (daysBack = null) => {
    try {
      // Gather all user data
      const moodLogs = await storage.getItem(STORAGE_KEYS.MOOD_LOGS) || [];
      const techniqueUsage = await storage.getItem(STORAGE_KEYS.TECHNIQUE_USAGE) || [];
      const userPreferences = await storage.getItem(STORAGE_KEYS.USER_PREFERENCES) || {};
      const conversationHistory = await storage.getItem('conversation_history') || [];

      // Filter by date range if specified
      const cutoffDate = daysBack ? new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000) : null;
      
      const filteredMoodLogs = cutoffDate 
        ? moodLogs.filter(log => new Date(log.timestamp || log.date) >= cutoffDate)
        : moodLogs;
      
      const filteredTechniqueUsage = cutoffDate
        ? techniqueUsage.filter(usage => new Date(usage.timestamp || usage.date) >= cutoffDate)
        : techniqueUsage;
      
      // Build a human-readable text report
      const exportDate = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
      });
      const totalMoodLogs = filteredMoodLogs.length;
      const averageMood = totalMoodLogs > 0 
        ? (filteredMoodLogs.reduce((sum, log) => sum + log.mood, 0) / totalMoodLogs).toFixed(1)
        : 'N/A';

      let report = '';
      report += '═══════════════════════════════════════════\n';
      report += '       ANCHOR - Your Progress Report\n';
      report += '═══════════════════════════════════════════\n\n';
      report += `Exported: ${exportDate}\n`;
      report += `App Version: ${APP_VERSION}\n`;
      if (daysBack) {
        report += `Date Range: Last ${daysBack <= 7 ? '7 days' : daysBack <= 30 ? '30 days' : '3 months'}\n`;
      } else {
        report += 'Date Range: All time\n';
      }
      report += '\n';
      report += 'NOTICE: This report contains self-reported\n';
      report += 'data from a wellness app. It is not a\n';
      report += 'clinical or medical record. Mood scores\n';
      report += 'are subjective and for personal tracking\n';
      report += 'purposes only.\n\n';

      // Summary
      report += '───────────────────────────────────────────\n';
      report += ' SUMMARY\n';
      report += '───────────────────────────────────────────\n\n';

      if (totalMoodLogs === 0 && filteredTechniqueUsage.length === 0) {
        report += '  No data recorded yet. Start logging your\n';
        report += '  mood and using techniques to see your\n';
        report += '  progress here.\n\n';
      } else {
        const ratedCount = filteredTechniqueUsage.filter(u => u.effectiveness).length;
        const unratedCount = filteredTechniqueUsage.filter(u => !u.effectiveness).length;
        const uniqueSessions = ratedCount + filteredTechniqueUsage.filter(u => !u.effectiveness).filter(unrated => 
          !filteredTechniqueUsage.some(rated => 
            rated.effectiveness && rated.technique === unrated.technique &&
            Math.abs(new Date(rated.timestamp) - new Date(unrated.timestamp)) < 5 * 60 * 1000
          )
        ).length;
        report += `  Total Mood Entries:      ${totalMoodLogs}\n`;
        report += `  Techniques Used:         ${uniqueSessions}\n`;
        report += `  Average Mood Score:      ${averageMood}/5\n`;
        report += `  AI Conversations:        ${conversationHistory.length}\n\n`;
      }

      // Mood Log History
      if (totalMoodLogs > 0) {
        report += '───────────────────────────────────────────\n';
        report += ' MOOD HISTORY\n';
        report += '───────────────────────────────────────────\n\n';
        
        const sortedLogs = [...filteredMoodLogs].sort((a, b) => 
          new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date)
        );

        sortedLogs.forEach(log => {
          const date = new Date(log.timestamp || log.date).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
          });
          const mood = log.moodName || `${log.mood}/5`;
          report += `  ${date}  —  ${mood}`;
          if (log.notes) {
            report += `\n    Notes: ${log.notes}`;
          }
          report += '\n';
        });
        report += '\n';
      }

      // Technique Usage — deduplicate by showing rated entries when available,
      // falling back to unrated entries for techniques used without a rating
      const ratedEntries = filteredTechniqueUsage.filter(u => u.effectiveness);
      const unratedEntries = filteredTechniqueUsage.filter(u => !u.effectiveness);
      
      // Keep unrated entries only if there's no matching rated entry at the same timestamp (within 5 min)
      const dedupedTechniques = [...ratedEntries];
      unratedEntries.forEach(unrated => {
        const hasMatchingRated = ratedEntries.some(rated => 
          rated.technique === unrated.technique &&
          Math.abs(new Date(rated.timestamp) - new Date(unrated.timestamp)) < 5 * 60 * 1000
        );
        if (!hasMatchingRated) {
          dedupedTechniques.push(unrated);
        }
      });

      if (dedupedTechniques.length > 0) {
        report += '───────────────────────────────────────────\n';
        report += ' TECHNIQUES USED\n';
        report += '───────────────────────────────────────────\n\n';
        
        const sortedTechniques = [...dedupedTechniques].sort((a, b) => 
          new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date)
        );

        sortedTechniques.forEach(usage => {
          const date = new Date(usage.timestamp || usage.date).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
          });
          const effectiveness = usage.effectiveness 
            ? ` (effectiveness: ${usage.effectiveness}/5)` 
            : '';
          report += `  ${date}  —  ${usage.technique}${effectiveness}\n`;
        });
        report += '\n';
      }

      report += '───────────────────────────────────────────\n';
      report += ' This report was generated by the Anchor app.\n';
      report += ' Share it with your therapist or healthcare\n';
      report += ' provider to support your treatment.\n';
      report += '───────────────────────────────────────────\n';

      if (Platform.OS === 'web') {
        // Web: Download as file
        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `anchor-progress-report-${new Date().toISOString().split('T')[0]}.txt`;
        link.click();
        Alert.alert('Success', 'Report exported successfully');
      } else {
        // Mobile: Write to temp file and share
        const fileName = `Anchor Progress Report ${new Date().toISOString().split('T')[0]}.txt`;
        const file = new File(Paths.cache, fileName);
        
        file.create();
        file.write(report);

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(file.uri, {
            mimeType: 'text/plain',
            dialogTitle: 'Share Your Progress Report',
            UTI: 'public.plain-text',
          });
        } else {
          Alert.alert(
            'Export Saved',
            `Your report has been saved. File size: ${(report.length / 1024).toFixed(1)} KB`,
          );
        }

        // Clean up temp file after a delay to ensure share completes
        setTimeout(() => {
          try {
            if (file.exists) {
              file.delete();
            }
          } catch (cleanupError) {
            // Non-critical — cache will be cleared eventually
          }
        }, 60000);
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
        { key: 'breathingReminders', title: 'Breathing Reminders', subtitle: `Every ${formatInterval(selectedInterval)}` }
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
      <Text 
        style={[styles.title, { color: theme.primary }]}
        accessibilityRole="header"
        accessibilityLevel={1}
      >
        Settings
      </Text>
      
      {settingSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={[styles.section, { backgroundColor: theme.card }]}>
          <Text 
            style={[styles.sectionTitle, { color: theme.text }]}
            accessibilityRole="header"
            accessibilityLevel={2}
          >
            {section.title}
          </Text>
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
                    setTempHour(selectedHour);
                    setShowTimePicker(true);
                  }}
                  accessibilityLabel="Change mood reminder time"
                  accessibilityRole="button"
                >
                  <Ionicons name="time-outline" size={20} color={theme.primary} style={{ marginRight: 12 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.settingTitle, { color: theme.text }]}>Mood Check-in Time</Text>
                    <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>Currently set to {formatTime(selectedHour)}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={theme.textTertiary} />
                </TouchableOpacity>
              )}
              {item.key === 'breathingReminders' && preferences.breathingReminders && (
                <TouchableOpacity 
                  style={styles.timePickerButton}
                  onPress={() => {
                    setTempInterval(selectedInterval);
                    setShowIntervalPicker(true);
                  }}
                  accessibilityLabel="Change breathing reminder interval"
                  accessibilityRole="button"
                >
                  <Ionicons name="timer-outline" size={20} color={theme.primary} style={{ marginRight: 12 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.settingTitle, { color: theme.text }]}>Breathing Interval</Text>
                    <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>Currently set to {formatInterval(selectedInterval)}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={theme.textTertiary} />
                </TouchableOpacity>
              )}
            </React.Fragment>
          ))}
          {section.title === 'Notifications' && Platform.OS === 'android' && (
            <View 
              style={styles.androidNotice}
              accessible={true}
              accessibilityRole="text"
              accessibilityLabel="Android tip: For reliable notifications, disable battery optimization for Anchor in Android Settings, Apps, Anchor, Battery, Unrestricted."
            >
              <Ionicons name="information-circle" size={20} color={theme.primary} accessible={false} />
              <Text style={[styles.androidNoticeText, { color: theme.textSecondary }]} accessible={false}>
                For reliable notifications, disable battery optimization for Anchor in Android Settings → Apps → Anchor → Battery → Unrestricted.
              </Text>
            </View>
          )}
        </View>
      ))}

      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text 
          style={[styles.sectionTitle, { color: theme.text }]}
          accessibilityRole="header"
          accessibilityLevel={2}
        >
          Data Management
        </Text>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => {
            Alert.alert(
              'Export Progress Report',
              'Choose a date range for your report:',
              [
                { text: 'Last 7 Days', onPress: () => exportData(7) },
                { text: 'Last 30 Days', onPress: () => exportData(30) },
                { text: 'Last 3 Months', onPress: () => exportData(90) },
                { text: 'All Time', onPress: () => exportData(null) },
                { text: 'Cancel', style: 'cancel' },
              ]
            );
          }}
          accessibilityLabel="Export Progress Report"
          accessibilityHint="Share a readable progress report with your healthcare provider"
          accessibilityRole="button"
        >
          <Ionicons name="download" size={24} color={theme.primary} />
          <View style={styles.actionInfo}>
            <Text style={[styles.actionTitle, { color: theme.text }]}>Export Progress Report</Text>
            <Text style={[styles.actionSubtitle, { color: theme.textSecondary }]}>Share with healthcare provider</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={theme.textTertiary} />
        </TouchableOpacity>

        {/* <TouchableOpacity 
          style={styles.actionButton} 
          onPress={exportNotifications}
          accessibilityLabel="Export Notifications"
          accessibilityHint="View scheduled notification details"
          accessibilityRole="button"
        >
          <Ionicons name="notifications-outline" size={24} color={theme.primary} />
          <View style={styles.actionInfo}>
            <Text style={[styles.actionTitle, { color: theme.text }]}>Export Notifications</Text>
            <Text style={[styles.actionSubtitle, { color: theme.textSecondary }]}>View scheduled reminders</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={theme.textTertiary} />
        </TouchableOpacity> */}

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
        <Text 
          style={[styles.sectionTitle, { color: theme.text }]}
          accessibilityRole="header"
          accessibilityLevel={2}
        >
          Information
        </Text>
        
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
        <Text 
          style={[styles.sectionTitle, { color: theme.text }]}
          accessibilityRole="header"
          accessibilityLevel={2}
        >
          About
        </Text>
        <View 
          style={styles.infoItem}
          accessible={true}
          accessibilityRole="text"
          accessibilityLabel="Version: {APP_VERSION}"
        >
          <Text style={[styles.infoLabel, { color: theme.textSecondary }]} accessible={false}>Version:</Text>
          <Text style={[styles.infoValue, { color: theme.text }]} accessible={false}>{APP_VERSION}</Text>
        </View>
        <View 
          style={styles.infoItem}
          accessible={true}
          accessibilityRole="text"
          accessibilityLabel={`Platform: ${Platform.OS === 'ios' ? 'iOS' : Platform.OS === 'android' ? 'Android' : 'Web'}`}
        >
          <Text style={[styles.infoLabel, { color: theme.textSecondary }]} accessible={false}>Platform:</Text>
          <Text style={[styles.infoValue, { color: theme.text }]} accessible={false}>{Platform.OS === 'ios' ? 'iOS' : Platform.OS === 'android' ? 'Android' : 'Web'}</Text>
        </View>
        <Text 
          style={[styles.disclaimer, { color: theme.textTertiary }]}
          accessible={true}
          accessibilityRole="text"
        >
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
                <TouchableOpacity 
                  onPress={() => setShowTimePicker(false)}
                  accessibilityLabel="Cancel time selection"
                  accessibilityRole="button"
                >
                  <Text style={[styles.modalCancel, { color: theme.textSecondary }]}>Cancel</Text>
                </TouchableOpacity>
                <Text 
                  style={[styles.modalTitle, { color: theme.text }]}
                  accessibilityRole="header"
                >
                  Select Time
                </Text>
                <TouchableOpacity 
                  onPress={handleTimeSave}
                  accessibilityLabel="Save selected time"
                  accessibilityRole="button"
                >
                  <Text style={[styles.modalDone, { color: theme.primary }]}>Done</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.pickerRow}>
                <WheelPicker
                  items={Array.from({ length: 24 }, (_, i) => ({
                    label: `${i % 12 || 12} ${i >= 12 ? 'PM' : 'AM'}`,
                    value: i
                  }))}
                  selectedValue={tempHour}
                  onValueChange={setTempHour}
                  style={styles.picker}
                  theme={theme}
                />
              </View>
            </View>
          </View>
        </Modal>
      )}
      
      {showIntervalPicker && (
        <Modal
          visible={showIntervalPicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowIntervalPicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
              <View style={styles.modalHeader}>
                <TouchableOpacity 
                  onPress={() => setShowIntervalPicker(false)}
                  accessibilityLabel="Cancel interval selection"
                  accessibilityRole="button"
                >
                  <Text style={[styles.modalCancel, { color: theme.textSecondary }]}>Cancel</Text>
                </TouchableOpacity>
                <Text 
                  style={[styles.modalTitle, { color: theme.text }]}
                  accessibilityRole="header"
                >
                  Select Interval
                </Text>
                <TouchableOpacity 
                  onPress={handleIntervalSave}
                  accessibilityLabel="Save selected interval"
                  accessibilityRole="button"
                >
                  <Text style={[styles.modalDone, { color: theme.primary }]}>Done</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.pickerRow}>
                <WheelPicker
                  items={[
                    { label: '90 minutes', value: 90 },
                    { label: '120 minutes', value: 120 },
                    { label: '180 minutes', value: 180 },
                    { label: '240 minutes', value: 240 }
                  ]}
                  selectedValue={tempInterval}
                  onValueChange={setTempInterval}
                  style={styles.picker}
                  theme={theme}
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
    paddingVertical: 20,
  },
  picker: {
    width: '100%',
    height: 200,
  },
});
