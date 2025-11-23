import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MoodTracker from '../components/MoodTracker';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { getRandomReminder } from '../data/dailyReminders';
import { useTheme, designTokens } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../components/Card';

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme();
  const [showMoodTracker, setShowMoodTracker] = useState(false);
  const [todayMoodLogged, setTodayMoodLogged] = useState(false);
  const [recentMood, setRecentMood] = useState(null);
  const [dailyReminder, setDailyReminder] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef(null);

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
      const today = new Date().toDateString();
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
    setTodayMoodLogged(true);
    setRecentMood(moodEntry);
    setShowMoodTracker(false);
  };

  const quickActions = [
    { title: 'Quick Grounding', icon: 'leaf', action: () => navigation.navigate('Tools', { technique: 'grounding' }) },
    { title: 'Breathing Exercises', icon: 'fitness', action: () => navigation.navigate('BreathingMethods') },
    { title: 'Talk to AI', icon: 'chatbubble', action: () => navigation.navigate('AI Support') },
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
      
      {showMoodTracker && !todayMoodLogged && (
        <MoodTracker onMoodLogged={handleMoodLogged} />
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
              onPress={() => setShowMoodTracker(!showMoodTracker)}
              accessibilityLabel={showMoodTracker ? 'Hide Mood Tracker' : 'Log Another Mood Entry'}
              accessibilityHint={showMoodTracker ? 'Hides the mood tracking form' : 'Opens mood tracking form to log your current mood'}
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

        {showMoodTracker && todayMoodLogged && (
          <MoodTracker onMoodLogged={handleMoodLogged} />
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