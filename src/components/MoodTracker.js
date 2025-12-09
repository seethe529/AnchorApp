import React, { useState, memo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { sanitizeText, validateMoodEntry } from '../utils/dataValidation';
import { trackMoodLog } from '../utils/appRating';
import { useTheme } from '../context/ThemeContext';

const MOODS = [
  { name: 'Excellent', icon: 'happy', color: '#4CAF50', value: 5 },
  { name: 'Good', icon: 'happy-outline', color: '#8BC34A', value: 4 },
  { name: 'Okay', icon: 'remove-circle-outline', color: '#FFC107', value: 3 },
  { name: 'Poor', icon: 'sad-outline', color: '#FF9800', value: 2 },
  { name: 'Terrible', icon: 'sad', color: '#F44336', value: 1 }
];

const MoodTracker = memo(({ onMoodLogged, onDetailedLogRequest }) => {
  const { theme } = useTheme();
  const [selectedMood, setSelectedMood] = useState(null);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDetailedCTA, setShowDetailedCTA] = useState(false);

  const logMood = useCallback(async () => {
    if (!selectedMood) return;
    
    setIsLoading(true);
    try {
      const now = new Date();
      const dateString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      
      const moodEntry = {
        mood: selectedMood.value,
        moodName: selectedMood.name,
        notes: sanitizeText(notes, 500),
        timestamp: now.toISOString(),
        date: dateString
      };

      // Validate before saving
      if (!validateMoodEntry(moodEntry)) {
        console.error('Invalid mood entry');
        return;
      }

      const existingLogs = await storage.getItem(STORAGE_KEYS.MOOD_LOGS) || [];
      const updatedLogs = [moodEntry, ...existingLogs];
      
      await storage.setItem(STORAGE_KEYS.MOOD_LOGS, updatedLogs);
      await trackMoodLog();
      
      console.log('🎯 [MOOD] About to show detailed CTA');
      setSelectedMood(null);
      setNotes('');
      setShowDetailedCTA(true);
      console.log('🎯 [MOOD] showDetailedCTA set to true');
      onMoodLogged && onMoodLogged(moodEntry);
    } catch (error) {
      console.error('Error logging mood:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedMood, notes, onMoodLogged]);

  console.log('🎯 [MOOD] Render - showDetailedCTA:', showDetailedCTA);
  
  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      {showDetailedCTA ? (
        <View style={styles.ctaContainer}>
          <Text style={[styles.ctaTitle, { color: theme.text }]}>✓ Mood logged</Text>
          <Text style={[styles.ctaSubtitle, { color: theme.textSecondary }]}>Want to add more emotional detail?</Text>
          <TouchableOpacity
            onPress={() => {
              setShowDetailedCTA(false);
              onDetailedLogRequest && onDetailedLogRequest();
            }}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[theme.primaryGradientTop, theme.primaryGradientBottom]}
              style={styles.detailedButton}
            >
              <Text style={styles.detailedButtonText}>Add Emotional Details</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => setShowDetailedCTA(false)}
          >
            <Text style={[styles.skipButtonText, { color: theme.textSecondary }]}>Skip</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <Text style={[styles.title, { color: theme.text }]}>How are you feeling today?</Text>
      
      <View style={styles.moodGrid}>
        {MOODS.map((mood, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.moodButton,
              selectedMood?.value === mood.value && { backgroundColor: mood.color + '20' }
            ]}
            onPress={() => setSelectedMood(mood)}
          >
            <Ionicons name={mood.icon} size={32} color={mood.color} />
            <Text style={[styles.moodText, { color: mood.color }]}>{mood.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedMood && (
        <View style={styles.notesSection}>
          <Text style={[styles.notesLabel, { color: theme.text }]}>Notes (optional):</Text>
          <TextInput
            style={[styles.notesInput, { borderColor: theme.border, backgroundColor: theme.background, color: theme.text }]}
            placeholder="What's on your mind?"
            placeholderTextColor={theme.textTertiary}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />
          
          <TouchableOpacity
            style={[styles.logButton, { backgroundColor: selectedMood.color }]}
            onPress={logMood}
            disabled={isLoading}
          >
            <Text style={styles.logButtonText}>
              {isLoading ? 'Logging...' : 'Log Mood'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
        </View>
      )}
    </View>
  );
});

export default MoodTracker;

const styles = StyleSheet.create({
  container: { padding: 20, borderRadius: 10, margin: 10 },
  title: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  moodGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  moodButton: { width: '19.5%', alignItems: 'center', padding: 6, borderRadius: 8, marginBottom: 10 },
  moodText: { fontSize: 9, marginTop: 4, textAlign: 'center', fontWeight: '600' },
  notesSection: { marginTop: 20 },
  notesLabel: { fontSize: 16, fontWeight: '500', marginBottom: 10 },
  notesInput: { borderWidth: 1, borderRadius: 8, padding: 12, minHeight: 80, textAlignVertical: 'top' },
  logButton: { marginTop: 15, padding: 15, borderRadius: 8, alignItems: 'center' },
  logButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  ctaContainer: { paddingVertical: 24 },
  ctaTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8, textAlign: 'center', alignSelf: 'center' },
  ctaSubtitle: { fontSize: 15, marginBottom: 20, textAlign: 'center', lineHeight: 22, alignSelf: 'center' },
  detailedButton: { paddingVertical: 16, borderRadius: 10, marginBottom: 10, alignItems: 'center', width: '100%' },
  detailedButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  skipButton: { padding: 12, alignSelf: 'center' },
  skipButtonText: { fontSize: 15, fontWeight: '500', textAlign: 'center' }
});