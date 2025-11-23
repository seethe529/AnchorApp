import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { dbtCbtTechniques } from '../data/techniques';
import { getCitationForTechnique, formatCitation } from '../data/citations';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { trackTechniqueUsed } from '../utils/appRating';
import { Platform, Linking } from 'react-native';
import { useTheme } from '../context/ThemeContext';

let Haptics;
if (Platform.OS !== 'web') {
  Haptics = require('expo-haptics');
}

export default function ToolsScreen() {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('grounding');
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const scrollViewRef = useRef(null);

  const categories = useMemo(() => Object.keys(dbtCbtTechniques), []);

  useEffect(() => {
    if (selectedTechnique && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: false });
    }
  }, [selectedTechnique]);

  const logTechniqueUsage = useCallback(async (technique, effectiveness = null) => {
    try {
      const usage = {
        technique: technique.name,
        category: selectedCategory,
        timestamp: new Date().toISOString(),
        date: new Date().toDateString(),
        effectiveness: effectiveness
      };
      
      const existingUsage = await storage.getItem(STORAGE_KEYS.TECHNIQUE_USAGE) || [];
      await storage.setItem(STORAGE_KEYS.TECHNIQUE_USAGE, [usage, ...existingUsage]);
      
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (error) {
      console.error('Error logging technique usage:', error);
    }
  }, [selectedCategory]);

  const renderTechnique = useCallback((technique) => (
    <TouchableOpacity 
      key={technique.name} 
      style={[styles.techniqueCard, { backgroundColor: theme.card }]}
      onPress={() => {
        setSelectedTechnique(technique);
        logTechniqueUsage(technique);
      }}
      accessibilityLabel={technique.name}
      accessibilityHint={`View details and instructions for ${technique.name}`}
      accessibilityRole="button"
    >
      <View style={styles.techniqueHeader}>
        <Text style={[styles.techniqueName, { color: theme.primary }]}>{technique.name}</Text>
        <Ionicons name="chevron-forward" size={20} color={theme.primary} />
      </View>
      <Text style={[styles.techniqueDescription, { color: theme.textSecondary }]}>{technique.description}</Text>
      <View style={styles.keywordTags}>
        {technique.keywords.slice(0, 3).map((keyword, index) => (
          <View key={index} style={[styles.keywordTag, { backgroundColor: theme.primary + '20' }]}>
            <Text style={[styles.keywordText, { color: theme.primary }]}>{keyword}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  ), [logTechniqueUsage, theme]);

  const currentTechniques = useMemo(
    () => dbtCbtTechniques[selectedCategory],
    [selectedCategory]
  );

  if (selectedTechnique) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
          <TouchableOpacity 
            onPress={() => setSelectedTechnique(null)} 
            style={styles.backButton}
            accessibilityLabel="Back to techniques list"
            accessibilityHint="Returns to the list of techniques"
            accessibilityRole="button"
          >
            <Ionicons name="chevron-back" size={28} color={theme.primary} />
          </TouchableOpacity>
          <Text style={[styles.techniqueTitle, { color: theme.text }]}>{selectedTechnique.name}</Text>
          <View style={styles.backButton} />
        </View>
        
        <ScrollView ref={scrollViewRef} style={styles.content} contentContainerStyle={styles.contentContainer}>
          <Text style={[styles.fullDescription, { color: theme.text }]}>{selectedTechnique.description}</Text>
          
          {selectedTechnique.example && (
            <View style={[styles.exampleBox, { backgroundColor: theme.card, borderLeftColor: theme.primary }]}>
              <Text style={[styles.exampleTitle, { color: theme.primary }]}>💡 Example:</Text>
              <Text style={[styles.exampleText, { color: theme.text }]}>{selectedTechnique.example}</Text>
            </View>
          )}
          
          {selectedTechnique.name === '5-4-3-2-1 Technique' && (
            <View style={[styles.stepByStep, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.stepTitle, { color: theme.primary }]}>Step by Step:</Text>
              <Text style={[styles.step, { color: theme.text }]}>1. Name 5 things you can SEE</Text>
              <Text style={[styles.step, { color: theme.text }]}>2. Name 4 things you can HEAR</Text>
              <Text style={[styles.step, { color: theme.text }]}>3. Name 3 things you can TOUCH</Text>
              <Text style={[styles.step, { color: theme.text }]}>4. Name 2 things you can SMELL</Text>
              <Text style={[styles.step, { color: theme.text }]}>5. Name 1 thing you can TASTE</Text>
            </View>
          )}
          
          {selectedTechnique.name === 'Box Breathing' && (
            <View style={[styles.stepByStep, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.stepTitle, { color: theme.primary }]}>Instructions:</Text>
              <Text style={[styles.step, { color: theme.text }]}>1. Breathe in for 4 counts</Text>
              <Text style={[styles.step, { color: theme.text }]}>2. Hold your breath for 4 counts</Text>
              <Text style={[styles.step, { color: theme.text }]}>3. Breathe out for 4 counts</Text>
              <Text style={[styles.step, { color: theme.text }]}>4. Hold empty for 4 counts</Text>
              <Text style={[styles.step, { color: theme.text }]}>5. Repeat 4-8 times</Text>
            </View>
          )}
          
          {selectedTechnique.name === 'TIPP' && (
            <View style={[styles.stepByStep, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.stepTitle, { color: theme.primary }]}>TIPP Technique:</Text>
              <Text style={[styles.step, { color: theme.text }]}>T - Temperature: Use cold water on face/hands</Text>
              <Text style={[styles.step, { color: theme.text }]}>I - Intense Exercise: 10 minutes of vigorous activity</Text>
              <Text style={[styles.step, { color: theme.text }]}>P - Paced Breathing: Slow, deep breaths</Text>
              <Text style={[styles.step, { color: theme.text }]}>P - Paired Muscle Relaxation: Tense and release</Text>
            </View>
          )}
          
          {selectedTechnique.name === 'DEAR MAN' && (
            <View style={[styles.stepByStep, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.stepTitle, { color: theme.primary }]}>DEAR MAN Steps:</Text>
              <Text style={[styles.step, { color: theme.text }]}>D - Describe the situation</Text>
              <Text style={[styles.step, { color: theme.text }]}>E - Express your feelings</Text>
              <Text style={[styles.step, { color: theme.text }]}>A - Assert your needs</Text>
              <Text style={[styles.step, { color: theme.text }]}>R - Reinforce benefits</Text>
              <Text style={[styles.step, { color: theme.text }]}>M - Mindful (stay focused)</Text>
              <Text style={[styles.step, { color: theme.text }]}>A - Appear confident</Text>
              <Text style={[styles.step, { color: theme.text }]}>N - Negotiate when possible</Text>
            </View>
          )}
          
          <View style={[styles.citationBox, { backgroundColor: theme.card, borderLeftColor: theme.primary }]}>
            <Text style={[styles.citationTitle, { color: theme.primary }]}>📚 Source</Text>
            <Text style={[styles.citationText, { color: theme.textSecondary }]}>
              {formatCitation(getCitationForTechnique(selectedTechnique.name))}
            </Text>
            <TouchableOpacity 
              style={[styles.citationLink, { backgroundColor: theme.primary + '20' }]}
              onPress={() => {
                const citation = getCitationForTechnique(selectedTechnique.name);
                if (citation.url) {
                  Linking.openURL(citation.url);
                }
              }}
              accessibilityLabel="View source"
              accessibilityRole="button"
            >
              <Text style={[styles.citationLinkText, { color: theme.primary }]}>View Source</Text>
              <Ionicons name="open-outline" size={16} color={theme.primary} />
            </TouchableOpacity>
          </View>

          <View style={[styles.feedbackSection, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.feedbackQuestion, { color: theme.text }]}>Was this helpful?</Text>
            <View style={styles.feedbackButtons}>
              <TouchableOpacity 
                style={styles.feedbackButton}
                onPress={async () => {
                  await logTechniqueUsage(selectedTechnique, 5);
                  await trackTechniqueUsed();
                  setSelectedTechnique(null);
                }}
                accessibilityLabel="Technique helped"
                accessibilityRole="button"
              >
                <Ionicons name="checkmark-circle" size={32} color={theme.primary} />
                <Text style={[styles.feedbackText, { color: theme.textSecondary }]}>Helped</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.feedbackButton}
                onPress={() => {
                  logTechniqueUsage(selectedTechnique, 3);
                  setSelectedTechnique(null);
                }}
                accessibilityLabel="Technique somewhat helped"
                accessibilityRole="button"
              >
                <Ionicons name="remove-circle" size={32} color="#FFA500" />
                <Text style={[styles.feedbackText, { color: theme.textSecondary }]}>Somewhat</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.feedbackButton}
                onPress={() => {
                  logTechniqueUsage(selectedTechnique, 1);
                  setSelectedTechnique(null);
                }}
                accessibilityLabel="Technique did not help much"
                accessibilityRole="button"
              >
                <Ionicons name="close-circle" size={32} color="#DC143C" />
                <Text style={[styles.feedbackText, { color: theme.textSecondary }]}>Not much</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView horizontal style={[styles.categoryTabs, { backgroundColor: theme.card, borderBottomColor: theme.border }]} showsHorizontalScrollIndicator={false}>
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryTab, { backgroundColor: theme.background }, selectedCategory === category && { backgroundColor: theme.primary }]}
            onPress={() => setSelectedCategory(category)}
            accessibilityLabel={`${category.replace('_', ' ')} category`}
            accessibilityHint={`Show ${category.replace('_', ' ')} techniques`}
            accessibilityRole="button"
            accessibilityState={{ selected: selectedCategory === category }}
          >
            <Text style={[styles.categoryText, { color: theme.textSecondary }, selectedCategory === category && styles.activeTabText]}>
              {category.replace('_', ' ').toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.techniquesList} contentContainerStyle={{ paddingBottom: 140 }}>
        {currentTechniques.map(renderTechnique)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  categoryTabs: { paddingVertical: 14, paddingHorizontal: 12, borderBottomWidth: 1, maxHeight: 64 },
  categoryTab: { paddingHorizontal: 20, paddingVertical: 10, marginHorizontal: 6, borderRadius: 22, height: 44, justifyContent: 'center', alignItems: 'center' },
  activeTab: {},
  categoryText: { fontSize: 15, fontWeight: '700' },
  activeTabText: { color: 'white' },
  techniquesList: { flex: 1, padding: 16 },
  techniqueCard: { padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  techniqueHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  techniqueName: { fontSize: 17, fontWeight: '600', flex: 1 },
  techniqueDescription: { fontSize: 15, marginBottom: 12, lineHeight: 22 },
  keywordTags: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },
  keywordTag: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, marginRight: 6, marginBottom: 6 },
  keywordText: { fontSize: 12, fontWeight: '500' },
  header: { paddingVertical: 16, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1 },
  backButton: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  techniqueTitle: { fontSize: 20, fontWeight: '600', flex: 1, textAlign: 'center' },
  content: { flex: 1 },
  contentContainer: { padding: 20, paddingBottom: 140 },
  fullDescription: { fontSize: 16, lineHeight: 26, marginBottom: 24 },
  exampleBox: { padding: 16, borderRadius: 12, marginBottom: 24, borderLeftWidth: 4 },
  exampleTitle: { fontSize: 15, fontWeight: '600', marginBottom: 8 },
  exampleText: { fontSize: 15, lineHeight: 24, fontStyle: 'italic' },
  stepByStep: { padding: 16, borderRadius: 12, marginBottom: 24, borderWidth: 1 },
  stepTitle: { fontSize: 17, fontWeight: '600', marginBottom: 16 },
  step: { fontSize: 16, marginBottom: 12, paddingLeft: 8, lineHeight: 24 },
  feedbackSection: { padding: 20, borderRadius: 12, marginTop: 24, borderWidth: 1 },
  feedbackQuestion: { fontSize: 17, fontWeight: '600', marginBottom: 16, textAlign: 'center' },
  feedbackButtons: { flexDirection: 'row', justifyContent: 'space-around' },
  feedbackButton: { alignItems: 'center', padding: 12, minWidth: 80 },
  feedbackText: { fontSize: 13, fontWeight: '500', marginTop: 6 },
  citationBox: { padding: 16, borderRadius: 12, marginTop: 24, borderLeftWidth: 4 },
  citationTitle: { fontSize: 15, fontWeight: '600', marginBottom: 8 },
  citationText: { fontSize: 13, lineHeight: 20, marginBottom: 12 },
  citationLink: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, alignSelf: 'flex-start' },
  citationLinkText: { fontSize: 14, fontWeight: '600', marginRight: 6 }
});