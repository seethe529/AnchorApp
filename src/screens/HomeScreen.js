import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MoodTracker from '../components/MoodTracker';
import DetailedMoodLog from '../components/DetailedMoodLog';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { getRandomReminder } from '../data/dailyReminders';
import { useTheme, designTokens } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../components/Card';

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme();
  const [showMoodTracker, setShowMoodTracker] = useState(false);
  const [showDetailedLog, setShowDetailedLog] = useState(false);
  const [todayMoodLogged, setTodayMoodLogged] = useState(false);
  const [recentMood, setRecentMood] = useState(null);
  const [dailyReminder, setDailyReminder] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef(null);
  const moodTrackerRef = useRef(null);

  useEffect(() => {
    checkTodayMoodLog();
    setDailyReminder(getRandomReminder());
    
    const keyboardDidShow = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const keyboardDidHide = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });
    
    return () => {
      keyboardDidShow.remove();
      keyboardDidHide.remove();
    };
  }, []);

  const checkTodayMoodLog = async () => {
    try {
      const moodLogs = await storage.getItem(STORAGE_KEYS.MOOD_LOGS) || [];
      const now = new Date();
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const todayLog = moodLogs.find(log => log.date === today);
      
      if (todayLog) {
        setTodayMoodLogged(true);
        setRecentMood(todayLog);
      } else {
        setShowMoodTracker(true);
      }
    } catch (error) {
      console.error('Error checking mood log:', error);
    }
  };

  const handleMoodLogged = (moodEntry) => {
    if (!moodEntry.skipCTA) {
      if (!todayMoodLogged) {
        // First mood log - mark as logged but DON'T set recentMood yet
        // This keeps the tracker mounted so CTA can show
        setTodayMoodLogged(true);
      } else {
        // Subsequent logs - set recentMood
        setRecentMood(moodEntry);
      }
      // Keep showMoodTracker true to show CTA
    } else {
      // User clicked Skip - now set recentMood and hide everything
      if (!recentMood && moodEntry !== true) {
        // Find the actual mood entry from storage
        storage.getItem(STORAGE_KEYS.MOOD_LOGS).then(logs => {
          const today = new Date().toISOString().split('T')[0];
          const todayLog = logs?.find(log => log.date === today.replace(/-/g, '-'));
          if (todayLog) setRecentMood(todayLog);
        });
      }
      setShowMoodTracker(false);
    }
    setShowDetailedLog(false);
  };

  const handleDetailedLogRequest = () => {
    setShowMoodTracker(false);
    setShowDetailedLog(true);
  };

  const quickActions = [
    { title: 'Quick Grounding', icon: 'leaf', action: () => navigation.navigate('Tools', { technique: 'grounding' }) },
    { title: 'Breathing Exercises', icon: 'fitness', action: () => navigation.navigate('BreathingMethods') },
    { title: 'Support Chat', icon: 'chatbubble', action: () => navigation.navigate('AI') },
    { title: 'Crisis Help', icon: 'medical', color: '#DC143C', action: () => navigation.navigate('Crisis') },
    { title: 'Safety Plan', icon: 'shield', action: () => navigation.navigate('Safety Plan') },
    { title: 'Progress', icon: 'analytics', action: () => navigation.navigate('Progress') }
  ];



  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={[theme.backgroundSecondary + '00', theme.background]}
        style={styles.gradientHeader}
      />
      <ScrollView 
        ref={scrollViewRef}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: keyboardHeight > 0 ? keyboardHeight + 120 : 120 }}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Welcome to Anchor</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Your PTSD support companion</Text>
          {todayMoodLogged && recentMood && (
            <View style={[styles.moodStatus, { backgroundColor: theme.primary + '15' }]}>
              <Ionicons name="checkmark-circle" size={18} color={theme.primary} />
              <Text style={[styles.moodStatusText, { color: theme.primary }]}>Today's mood: {recentMood.moodName}</Text>
            </View>
          )}
        </View>
      
      {showMoodTracker && !showDetailedLog && !recentMood && (
        <MoodTracker 
          onMoodLogged={handleMoodLogged} 
          onDetailedLogRequest={handleDetailedLogRequest}
        />
      )}

      {showDetailedLog && !recentMood && (
        <DetailedMoodLog 
          onMoodLogged={handleMoodLogged}
          onCancel={() => setShowDetailedLog(false)}
        />
      )}
      
        <View style={styles.quickActions}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity 
                key={index} 
                onPress={action.action}
                accessibilityLabel={action.title}
                accessibilityHint={`Navigate to ${action.title}`}
                accessibilityRole="button"
                activeOpacity={0.7}
                style={styles.actionCardWrapper}
              >
                <Card style={styles.actionCard}>
                  <View style={[styles.iconContainer, { backgroundColor: (action.color || theme.primary) + '15' }]}>
                    <Ionicons name={action.icon} size={24} color={action.color || theme.primary} />
                  </View>
                  <Text style={[styles.actionText, { color: theme.text }]}>{action.title}</Text>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.dailyTipContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Daily Reminder</Text>
          <Card variant="strong">
            <View style={styles.quoteIcon}>
              <Ionicons name="chatbox-ellipses" size={24} color={theme.primary} />
            </View>
            <Text style={[styles.tipText, { color: theme.textSecondary }]}>"{dailyReminder}"</Text>
          </Card>
        </View>

        {todayMoodLogged && (
          <View style={styles.moodButtonContainer}>
            <TouchableOpacity 
              onPress={() => {
                setShowMoodTracker(!showMoodTracker);
                if (!showMoodTracker) {
                  setTimeout(() => {
                    moodTrackerRef.current?.measureLayout(
                      scrollViewRef.current,
                      (x, y) => {
                        scrollViewRef.current?.scrollTo({ y: y - 20, animated: true });
                      }
                    );
                  }, 100);
                }
              }}
              accessibilityLabel={showMoodTracker ? 'Hide Mood Tracker' : 'Log Another Mood Entry'}
              accessibilityRole="button"
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[theme.primaryGradientTop, theme.primaryGradientBottom]}
                style={styles.moodButton}
              >
                <Text style={styles.moodButtonText}>
                  {showMoodTracker ? 'Hide Mood Tracker' : 'Log Another Mood Entry'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {showMoodTracker && todayMoodLogged && !showDetailedLog && (
          <View ref={moodTrackerRef}>
            <MoodTracker 
              onMoodLogged={handleMoodLogged} 
              onDetailedLogRequest={handleDetailedLogRequest}
            />
          </View>
        )}

        {showDetailedLog && todayMoodLogged && (
          <DetailedMoodLog 
            onMoodLogged={handleMoodLogged}
            onCancel={() => setShowDetailedLog(false)}
          />
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  gradientHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    zIndex: 0,
  },
  header: { 
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    alignItems: 'center',
  },
  title: { 
    ...designTokens.typography.h1,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: { 
    ...designTokens.typography.body,
    textAlign: 'center',
  },
  moodStatus: { 
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  moodStatusText: { 
    fontSize: 14,
    fontWeight: '600',
  },
  quickActions: { 
    paddingHorizontal: 20,
    marginTop: designTokens.spacing.section,
  },
  sectionTitle: { 
    ...designTokens.typography.h2,
    marginBottom: 16,
  },
  actionGrid: { 
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCardWrapper: {
    width: '48%',
  },
  actionCard: { 
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionText: { 
    marginTop: 4,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 14,
  },
  dailyTipContainer: {
    paddingHorizontal: 20,
    marginTop: designTokens.spacing.section,
  },
  quoteIcon: {
    marginBottom: 12,
  },
  tipText: { 
    fontSize: 16,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  moodButtonContainer: {
    paddingHorizontal: 20,
    marginTop: designTokens.spacing.section,
  },
  moodButton: { 
    paddingVertical: 16,
    borderRadius: designTokens.borderRadius.button,
    alignItems: 'center',
    ...designTokens.shadows.button,
  },
  moodButtonText: { 
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});