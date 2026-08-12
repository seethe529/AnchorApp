import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Share, Platform, Linking, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import { File, Paths } from 'expo-file-system/next';
import * as Sharing from 'expo-sharing';
import WheelPicker from '../components/WheelPicker';
import { storage, secureStorage, STORAGE_KEYS } from '../utils/storage';
import { requestPermissions, scheduleMoodReminder, scheduleBreathingReminder, cancelMoodReminder, cancelBreathingReminder, debugListScheduled, exportScheduledNotifications } from '../utils/notifications';
import Constants from 'expo-constants';
import { useTheme, designTokens } from '../context/ThemeContext';
import Card from '../components/Card';

const APP_VERSION = Constants.expoConfig?.version || '1.0.0';

// App icon as base64 for PDF export (120x120px)
const LOGO_BASE64 = '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';

export default function SettingsScreen({ navigation }) {
  const { theme, isDark, toggleTheme } = useTheme();
  const [preferences, setPreferences] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
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
      const aiMessageCount = await storage.getItem(STORAGE_KEYS.AI_MESSAGE_COUNT) || 0;

      // Filter by date range if specified
      const cutoffDate = daysBack ? new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000) : null;
      
      const filteredMoodLogs = cutoffDate 
        ? moodLogs.filter(log => new Date(log.timestamp || log.date) >= cutoffDate)
        : moodLogs;
      
      const filteredTechniqueUsage = cutoffDate
        ? techniqueUsage.filter(usage => new Date(usage.timestamp || usage.date) >= cutoffDate)
        : techniqueUsage;
      
      const exportDate = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
      });
      const totalMoodLogs = filteredMoodLogs.length;
      const averageMood = totalMoodLogs > 0 
        ? (filteredMoodLogs.reduce((sum, log) => sum + log.mood, 0) / totalMoodLogs).toFixed(1)
        : 'N/A';

      const dateRangeLabel = daysBack 
        ? `Last ${daysBack <= 7 ? '7 days' : daysBack <= 30 ? '30 days' : '3 months'}`
        : 'All time';

      // Deduplicate techniques
      const ratedEntries = filteredTechniqueUsage.filter(u => u.effectiveness);
      const unratedEntries = filteredTechniqueUsage.filter(u => !u.effectiveness);
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

      const sortedLogs = [...filteredMoodLogs].sort((a, b) => 
        new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date)
      );
      const sortedTechniques = [...dedupedTechniques].sort((a, b) => 
        new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date)
      );

      // Build HTML for PDF
      const html = `
        <html>
          <head>
            <meta charset="utf-8" />
            <style>
              body {
                font-family: -apple-system, Helvetica Neue, sans-serif;
                padding: 40px 32px;
                color: #1a1a1a;
                line-height: 1.5;
              }
              .header {
                text-align: center;
                border-bottom: 3px solid #2E8B57;
                padding-bottom: 20px;
                margin-bottom: 24px;
              }
              .header h1 {
                color: #2E8B57;
                font-size: 26px;
                margin: 0 0 4px 0;
              }
              .header .subtitle {
                color: #666;
                font-size: 14px;
                margin: 4px 0;
              }
              .disclaimer {
                background: #f8f8f8;
                border-left: 4px solid #ccc;
                padding: 12px 16px;
                font-size: 12px;
                color: #666;
                margin-bottom: 24px;
                border-radius: 4px;
              }
              .section {
                margin-bottom: 28px;
              }
              .section h2 {
                color: #2E8B57;
                font-size: 18px;
                border-bottom: 1px solid #e0e0e0;
                padding-bottom: 8px;
                margin-bottom: 16px;
              }
              .summary-grid {
                display: flex;
                flex-wrap: wrap;
                gap: 12px;
              }
              .summary-item {
                background: #f0faf4;
                border-radius: 8px;
                padding: 14px 18px;
                flex: 1;
                min-width: 140px;
              }
              .summary-item .label {
                font-size: 12px;
                color: #666;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              }
              .summary-item .value {
                font-size: 22px;
                font-weight: 600;
                color: #2E8B57;
                margin-top: 4px;
              }
              .entry {
                padding: 10px 0;
                border-bottom: 1px solid #f0f0f0;
              }
              .entry:last-child {
                border-bottom: none;
              }
              .entry .date {
                font-size: 12px;
                color: #888;
              }
              .entry .content {
                font-size: 15px;
                margin-top: 2px;
              }
              .entry .notes {
                font-size: 13px;
                color: #666;
                font-style: italic;
                margin-top: 4px;
              }
              .entry .effectiveness {
                display: inline-block;
                background: #e8f5e9;
                color: #2E8B57;
                font-size: 12px;
                padding: 2px 8px;
                border-radius: 10px;
                margin-left: 8px;
              }
              .footer {
                margin-top: 32px;
                padding-top: 16px;
                border-top: 2px solid #2E8B57;
                text-align: center;
                font-size: 12px;
                color: #888;
              }
              .empty-state {
                text-align: center;
                padding: 24px;
                color: #888;
                font-style: italic;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <img src="data:image/png;base64,${LOGO_BASE64}" width="60" height="60" style="border-radius: 12px; margin-bottom: 8px;" />
              <h1>Anchor</h1>
              <div class="subtitle">Your Progress Report</div>
              <div class="subtitle">${exportDate} · ${dateRangeLabel}</div>
            </div>

            <div class="disclaimer">
              This report contains self-reported data from a wellness app. 
              It is not a clinical or medical record. Mood scores are subjective 
              and for personal tracking purposes only.
            </div>

            <div class="section">
              <h2>Summary</h2>
              ${totalMoodLogs === 0 && dedupedTechniques.length === 0 ? `
                <div class="empty-state">No data recorded for this time period.</div>
              ` : `
                <div class="summary-grid">
                  <div class="summary-item">
                    <div class="label">Mood Entries</div>
                    <div class="value">${totalMoodLogs}</div>
                  </div>
                  <div class="summary-item">
                    <div class="label">Techniques Used</div>
                    <div class="value">${dedupedTechniques.length}</div>
                  </div>
                  <div class="summary-item">
                    <div class="label">Avg Mood</div>
                    <div class="value">${averageMood}/5</div>
                  </div>
                  <div class="summary-item">
                    <div class="label">Messages Sent (all time)</div>
                    <div class="value">${aiMessageCount}</div>
                  </div>
                </div>
              `}
            </div>

            ${sortedLogs.length > 0 ? `
              <div class="section">
                <h2>Mood History</h2>
                ${sortedLogs.map(log => {
                  const date = new Date(log.timestamp || log.date).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  });
                  const mood = log.moodName || `${log.mood}/5`;
                  return `
                    <div class="entry">
                      <div class="date">${date}</div>
                      <div class="content">${mood}</div>
                      ${log.notes ? `<div class="notes">${log.notes}</div>` : ''}
                    </div>
                  `;
                }).join('')}
              </div>
            ` : ''}

            ${sortedTechniques.length > 0 ? `
              <div class="section">
                <h2>Techniques Used</h2>
                ${sortedTechniques.map(usage => {
                  const date = new Date(usage.timestamp || usage.date).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  });
                  const effectivenessTag = usage.effectiveness 
                    ? `<span class="effectiveness">${usage.effectiveness}/5</span>` 
                    : '';
                  return `
                    <div class="entry">
                      <div class="date">${date}</div>
                      <div class="content">${usage.technique}${effectivenessTag}</div>
                    </div>
                  `;
                }).join('')}
              </div>
            ` : ''}

            <div class="footer">
              Generated by Anchor · v${APP_VERSION}<br/>
              Share with your therapist or healthcare provider to support your treatment.
            </div>
          </body>
        </html>
      `;

      if (Platform.OS === 'web') {
        // Web: Download as HTML file
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `anchor-progress-report-${new Date().toISOString().split('T')[0]}.html`;
        link.click();
        Alert.alert('Success', 'Report exported successfully');
      } else {
        // Mobile: Generate PDF and share with a readable filename
        const { uri } = await Print.printToFileAsync({ html });
        
        // Rename to a friendly filename
        const friendlyName = `Anchor Progress Report ${new Date().toISOString().split('T')[0]}.pdf`;
        const destination = new File(Paths.cache, friendlyName);
        if (destination.exists) {
          destination.delete();
        }
        const source = new File(uri);
        source.move(destination);

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(destination.uri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Share Your Progress Report',
            UTI: 'com.adobe.pdf',
          });
        } else {
          Alert.alert('Export Complete', 'Your report has been saved.');
        }
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
            if (Platform.OS === 'ios') {
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
            } else {
              setShowExportModal(true);
            }
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

        <TouchableOpacity
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
        </TouchableOpacity>
        {/* TESTING ONLY — remove or re-comment this button before shipping to production */}

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

      {/* Android Export Date Range Modal */}
      {Platform.OS !== 'ios' && (
        <Modal
          visible={showExportModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowExportModal(false)}
        >
          <TouchableOpacity 
            style={styles.exportModalOverlay} 
            activeOpacity={1} 
            onPress={() => setShowExportModal(false)}
          >
            <View style={[styles.exportModalContent, { backgroundColor: theme.card }]}>
              <Text style={[styles.exportModalTitle, { color: theme.text }]}>
                Export Progress Report
              </Text>
              <Text style={[styles.exportModalSubtitle, { color: theme.textSecondary }]}>
                Choose a date range for your report:
              </Text>

              <TouchableOpacity
                style={[styles.exportModalOption, { borderColor: theme.border || '#e0e0e0' }]}
                onPress={() => { setShowExportModal(false); exportData(7); }}
                accessibilityRole="button"
                accessibilityLabel="Export last 7 days"
              >
                <Text style={[styles.exportModalOptionText, { color: theme.primary }]}>Last 7 Days</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.exportModalOption, { borderColor: theme.border || '#e0e0e0' }]}
                onPress={() => { setShowExportModal(false); exportData(30); }}
                accessibilityRole="button"
                accessibilityLabel="Export last 30 days"
              >
                <Text style={[styles.exportModalOptionText, { color: theme.primary }]}>Last 30 Days</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.exportModalOption, { borderColor: theme.border || '#e0e0e0' }]}
                onPress={() => { setShowExportModal(false); exportData(90); }}
                accessibilityRole="button"
                accessibilityLabel="Export last 3 months"
              >
                <Text style={[styles.exportModalOptionText, { color: theme.primary }]}>Last 3 Months</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.exportModalOption, { borderColor: theme.border || '#e0e0e0' }]}
                onPress={() => { setShowExportModal(false); exportData(null); }}
                accessibilityRole="button"
                accessibilityLabel="Export all time"
              >
                <Text style={[styles.exportModalOptionText, { color: theme.primary }]}>All Time</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.exportModalCancel}
                onPress={() => setShowExportModal(false)}
                accessibilityRole="button"
                accessibilityLabel="Cancel export"
              >
                <Text style={[styles.exportModalCancelText, { color: theme.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
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
  exportModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  exportModalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  exportModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  exportModalSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  exportModalOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  exportModalOptionText: {
    fontSize: 17,
    fontWeight: '600',
  },
  exportModalCancel: {
    paddingVertical: 16,
    marginTop: 8,
    alignItems: 'center',
  },
  exportModalCancelText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
