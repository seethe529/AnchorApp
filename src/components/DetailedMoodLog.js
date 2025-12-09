import React, { useState, memo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { sanitizeText, validateMoodEntry } from '../utils/dataValidation';
import { trackMoodLog } from '../utils/appRating';
import { useTheme } from '../context/ThemeContext';
import { EmotionModel, getEmotionValence } from '../data/emotionModel';

const DetailedMoodLog = memo(({ onMoodLogged, onCancel }) => {
  const { theme } = useTheme();
  const [step, setStep] = useState(1); // 1=primary, 2=secondary, 3=tertiary
  const [selectedPrimary, setSelectedPrimary] = useState(null);
  const [selectedSecondary, setSelectedSecondary] = useState(null);
  const [selectedTertiary, setSelectedTertiary] = useState(null);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePrimarySelect = useCallback((emotion) => {
    setSelectedPrimary(emotion);
    setStep(2);
  }, []);

  const handleSecondarySelect = useCallback((secondary) => {
    setSelectedSecondary(secondary);
    setStep(3);
  }, []);

  const handleTertiarySelect = useCallback((tertiary) => {
    setSelectedTertiary(tertiary);
  }, []);

  const handleSkipTertiary = useCallback(() => {
    setSelectedTertiary(null);
    setStep(4);
  }, []);

  const handleContinueToNotes = useCallback(() => {
    setStep(4);
  }, []);

  const logDetailedMood = useCallback(async () => {
    if (!selectedPrimary || !selectedSecondary) return;
    
    setIsLoading(true);
    try {
      const now = new Date();
      const dateString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      
      const moodEntry = {
        type: 'detailed',
        primary: selectedPrimary.primary,
        primaryEmoji: selectedPrimary.emoji,
        secondary: selectedSecondary.name,
        tertiary: selectedTertiary || null,
        notes: sanitizeText(notes, 500),
        timestamp: now.toISOString(),
        date: dateString,
        valence: getEmotionValence(selectedPrimary.primary),
        mood: getEmotionValence(selectedPrimary.primary), // For compatibility with existing graphs
        moodName: selectedPrimary.primary // For compatibility
      };

      const existingLogs = await storage.getItem(STORAGE_KEYS.MOOD_LOGS) || [];
      const updatedLogs = [moodEntry, ...existingLogs];
      
      await storage.setItem(STORAGE_KEYS.MOOD_LOGS, updatedLogs);
      await trackMoodLog();
      
      onMoodLogged && onMoodLogged(moodEntry);
    } catch (error) {
      console.error('Error logging detailed mood:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedPrimary, selectedSecondary, selectedTertiary, notes, onMoodLogged]);

  const handleBack = useCallback(() => {
    if (step === 2) {
      setStep(1);
      setSelectedPrimary(null);
      setSelectedSecondary(null);
      setSelectedTertiary(null);
    } else if (step === 3) {
      setStep(2);
      setSelectedSecondary(null);
      setSelectedTertiary(null);
    } else if (step === 4) {
      setStep(3);
    }
  }, [step]);

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <View style={styles.header}>
        {step > 1 && (
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={[styles.backText, { color: theme.primary }]}>← Back</Text>
          </TouchableOpacity>
        )}
        {onCancel && (
          <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
            <Text style={[styles.cancelText, { color: theme.textSecondary }]}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Step 1: Primary Emotions */}
        {step === 1 && (
          <View>
            <Text style={[styles.title, { color: theme.text }]}>How are you feeling?</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Choose the emotion family that fits best</Text>
            
            <View style={styles.primaryGrid}>
              {EmotionModel.map((emotion, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.primaryButton, { backgroundColor: theme.background }]}
                  onPress={() => handlePrimarySelect(emotion)}
                >
                  <Text style={styles.primaryEmoji}>{emotion.emoji}</Text>
                  <Text style={[styles.primaryText, { color: theme.text }]}>{emotion.primary}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 2: Secondary Emotions */}
        {step === 2 && selectedPrimary && (
          <View>
            <Text style={[styles.title, { color: theme.text }]}>
              {selectedPrimary.emoji} {selectedPrimary.primary}
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Which feeling is most present?</Text>
            
            <View style={styles.secondaryList}>
              {selectedPrimary.secondary.map((secondary, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.secondaryButton, { backgroundColor: theme.background }]}
                  onPress={() => handleSecondarySelect(secondary)}
                >
                  <Text style={[styles.secondaryText, { color: theme.text }]}>{secondary.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 3: Tertiary Emotions (Optional) */}
        {step === 3 && selectedSecondary && (
          <View>
            <Text style={[styles.title, { color: theme.text }]}>
              {selectedPrimary.emoji} {selectedSecondary.name}
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Get more specific (optional)</Text>
            
            <View style={styles.tertiaryList}>
              {selectedSecondary.tertiary.map((tertiary, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.tertiaryButton,
                    { backgroundColor: theme.background },
                    selectedTertiary === tertiary && { backgroundColor: theme.primary + '20', borderColor: theme.primary, borderWidth: 2 }
                  ]}
                  onPress={() => handleTertiarySelect(tertiary)}
                >
                  <Text style={[styles.tertiaryText, { color: theme.text }]}>{tertiary}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.tertiaryActions}>
              <TouchableOpacity
                style={[styles.skipButton, { backgroundColor: theme.background }]}
                onPress={handleSkipTertiary}
              >
                <Text style={[styles.skipText, { color: theme.textSecondary }]}>Skip</Text>
              </TouchableOpacity>
              
              {selectedTertiary && (
                <TouchableOpacity
                  style={[styles.continueButton, { backgroundColor: theme.primary }]}
                  onPress={handleContinueToNotes}
                >
                  <Text style={styles.continueText}>Continue</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Step 4: Notes */}
        {step === 4 && (
          <View>
            <Text style={[styles.title, { color: theme.text }]}>
              {selectedPrimary.emoji} {selectedSecondary.name}
              {selectedTertiary && ` • ${selectedTertiary}`}
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Add notes (optional)</Text>
            
            <TextInput
              style={[styles.notesInput, { borderColor: theme.border, backgroundColor: theme.background, color: theme.text }]}
              placeholder="What's on your mind?"
              placeholderTextColor={theme.textTertiary}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
            />
            
            <TouchableOpacity
              style={[styles.logButton, { backgroundColor: theme.primary }]}
              onPress={logDetailedMood}
              disabled={isLoading}
            >
              <Text style={styles.logButtonText}>
                {isLoading ? 'Logging...' : 'Log Emotion'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
});

export default DetailedMoodLog;

const styles = StyleSheet.create({
  container: { padding: 20, borderRadius: 10, margin: 10, minHeight: 400 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  backButton: { padding: 8 },
  backText: { fontSize: 16, fontWeight: '600' },
  cancelButton: { padding: 8 },
  cancelText: { fontSize: 16 },
  scrollContent: { paddingBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 20 },
  primaryGrid: { gap: 12 },
  primaryButton: { padding: 16, borderRadius: 12, marginBottom: 12, alignItems: 'center' },
  primaryEmoji: { fontSize: 32, marginBottom: 8 },
  primaryText: { fontSize: 15, fontWeight: '600', textAlign: 'center' },
  secondaryList: { gap: 10 },
  secondaryButton: { padding: 16, borderRadius: 10, marginBottom: 10 },
  secondaryText: { fontSize: 16, fontWeight: '500', textAlign: 'center' },
  tertiaryList: { gap: 10, marginBottom: 20 },
  tertiaryButton: { padding: 14, borderRadius: 10, marginBottom: 10 },
  tertiaryText: { fontSize: 15, textAlign: 'center' },
  tertiaryActions: { flexDirection: 'row', gap: 10, marginTop: 10 },
  skipButton: { flex: 1, padding: 14, borderRadius: 10, alignItems: 'center' },
  skipText: { fontSize: 16, fontWeight: '500' },
  continueButton: { flex: 1, padding: 14, borderRadius: 10, alignItems: 'center' },
  continueText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  notesInput: { borderWidth: 1, borderRadius: 10, padding: 12, minHeight: 100, textAlignVertical: 'top', marginBottom: 20 },
  logButton: { padding: 16, borderRadius: 10, alignItems: 'center' },
  logButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});
