import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MoodTracker from '../components/MoodTracker';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { getRandomReminder } from '../data/dailyReminders';

export default function HomeScreen({ navigation }) {
  const [showMoodTracker, setShowMoodTracker] = useState(false);
  const [todayMoodLogged, setTodayMoodLogged] = useState(false);
  const [recentMood, setRecentMood] = useState(null);
  const [dailyReminder, setDailyReminder] = useState('');

  useEffect(() => {
    checkTodayMoodLog();
    setDailyReminder(getRandomReminder());
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
    { title: 'Breathing Exercise', icon: 'fitness', action: () => navigation.navigate('Breathing') },
    { title: 'Talk to AI', icon: 'chatbubble', action: () => navigation.navigate('AI Support') },
    { title: 'Crisis Help', icon: 'medical', color: '#DC143C', action: () => navigation.navigate('Crisis') },
    { title: 'Safety Plan', icon: 'shield', action: () => navigation.navigate('Safety Plan') },
    { title: 'Progress', icon: 'analytics', action: () => navigation.navigate('Progress') }
  ];



  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Anchor</Text>
        <Text style={styles.subtitle}>Your PTSD support companion</Text>
        {todayMoodLogged && recentMood && (
          <View style={styles.moodStatus}>
            <Text style={styles.moodStatusText}>Today's mood: {recentMood.moodName}</Text>
          </View>
        )}
      </View>
      
      {showMoodTracker && !todayMoodLogged && (
        <MoodTracker onMoodLogged={handleMoodLogged} />
      )}
      
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.actionCard} 
              onPress={action.action}
              accessibilityLabel={action.title}
              accessibilityHint={`Navigate to ${action.title}`}
              accessibilityRole="button"
            >
              <Ionicons name={action.icon} size={32} color={action.color || '#2E8B57'} />
              <Text style={styles.actionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.dailyTip}>
        <Text style={styles.sectionTitle}>Daily Reminder</Text>
        <Text style={styles.tipText}>"{dailyReminder}"</Text>
      </View>

      {todayMoodLogged && (
        <TouchableOpacity 
          style={styles.moodButton}
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
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { padding: 20, alignItems: 'center', backgroundColor: 'white', marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2E8B57', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#666' },
  moodStatus: { marginTop: 10, padding: 8, backgroundColor: '#E8F5E8', borderRadius: 15 },
  moodStatusText: { fontSize: 14, color: '#2E8B57', fontWeight: '500' },
  quickActions: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  actionCard: { width: '31%', backgroundColor: 'white', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 15, elevation: 2 },
  actionText: { marginTop: 8, fontSize: 12, fontWeight: '500', textAlign: 'center' },
  dailyTip: { padding: 20, backgroundColor: 'white', margin: 20, borderRadius: 10 },
  tipText: { fontSize: 16, lineHeight: 24, color: '#555', fontStyle: 'italic' },
  moodButton: { backgroundColor: '#2E8B57', margin: 20, padding: 15, borderRadius: 10, alignItems: 'center' },
  moodButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});