import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MoodTracker from '../components/MoodTracker';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { getRandomReminder } from '../data/dailyReminders';
import { useTheme } from '../context/ThemeContext';

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
    <ScrollView 
      ref={scrollViewRef}
      style={[styles.container, { backgroundColor: theme.background }]} 
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: keyboardHeight > 0 ? keyboardHeight + 20 : 20 }}
    >
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <Text style={[styles.title, { color: theme.primary }]}>Welcome to Anchor</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Your PTSD support companion</Text>
        {todayMoodLogged && recentMood && (
          <View style={[styles.moodStatus, { backgroundColor: theme.primary + '20' }]}>
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
              style={[styles.actionCard, { backgroundColor: theme.card }]} 
              onPress={action.action}
              accessibilityLabel={action.title}
              accessibilityHint={`Navigate to ${action.title}`}
              accessibilityRole="button"
            >
              <Ionicons name={action.icon} size={32} color={action.color || theme.primary} />
              <Text style={[styles.actionText, { color: theme.text }]}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[styles.dailyTip, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Daily Reminder</Text>
        <Text style={[styles.tipText, { color: theme.textSecondary }]}>"{dailyReminder}"</Text>
      </View>

      {todayMoodLogged && (
        <TouchableOpacity 
          style={[styles.moodButton, { backgroundColor: theme.primary }]}
          onPress={() => setShowMoodTracker(!showMoodTracker)}
          accessibilityLabel={showMoodTracker ? 'Hide Mood Tracker' : 'Log Another Mood Entry'}
          accessibilityHint={showMoodTracker ? 'Hides the mood tracking form' : 'Opens mood tracking form to log your current mood'}
          accessibilityRole="button"
        >
          <Text style={styles.moodButtonText}>
            {showMoodTracker ? 'Hide Mood Tracker' : 'Log Another Mood Entry'}
          </Text>
        </TouchableOpacity>
      )}

      {showMoodTracker && todayMoodLogged && (
        <MoodTracker onMoodLogged={handleMoodLogged} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 5 },
  subtitle: { fontSize: 16 },
  moodStatus: { marginTop: 10, padding: 8, borderRadius: 15 },
  moodStatusText: { fontSize: 14, fontWeight: '500' },
  quickActions: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  actionCard: { width: '48%', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  actionText: { marginTop: 8, fontSize: 12, fontWeight: '500', textAlign: 'center', numberOfLines: 2 },
  dailyTip: { padding: 20, margin: 20, borderRadius: 10 },
  tipText: { fontSize: 16, lineHeight: 24, fontStyle: 'italic' },
  moodButton: { margin: 20, padding: 15, borderRadius: 10, alignItems: 'center' },
  moodButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});