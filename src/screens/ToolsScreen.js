import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { dbtCbtTechniques } from '../data/techniques';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { Platform } from 'react-native';

let Haptics;
if (Platform.OS !== 'web') {
  Haptics = require('expo-haptics');
}

export default function ToolsScreen() {
  const [selectedCategory, setSelectedCategory] = useState('grounding');
  const [selectedTechnique, setSelectedTechnique] = useState(null);

  const categories = Object.keys(dbtCbtTechniques);

  const logTechniqueUsage = async (technique, effectiveness = null) => {
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
  };

  const renderTechnique = (technique) => (
    <TouchableOpacity 
      key={technique.name} 
      style={styles.techniqueCard}
      onPress={() => {
        setSelectedTechnique(technique);
        logTechniqueUsage(technique);
      }}
      accessibilityLabel={technique.name}
      accessibilityHint={`View details and instructions for ${technique.name}`}
      accessibilityRole="button"
    >
      <View style={styles.techniqueHeader}>
        <Text style={styles.techniqueName}>{technique.name}</Text>
        <Ionicons name="chevron-forward" size={20} color="#2E8B57" />
      </View>
      <Text style={styles.techniqueDescription}>{technique.description}</Text>
      <View style={styles.keywordTags}>
        {technique.keywords.slice(0, 3).map((keyword, index) => (
          <View key={index} style={styles.keywordTag}>
            <Text style={styles.keywordText}>{keyword}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  if (selectedTechnique) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => setSelectedTechnique(null)} 
            style={styles.backButton}
            accessibilityLabel="Back to techniques list"
            accessibilityHint="Returns to the list of techniques"
            accessibilityRole="button"
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.techniqueTitle}>{selectedTechnique.name}</Text>
        </View>
        
        <View style={styles.feedbackBar}>
          <Text style={styles.feedbackQuestion}>Was this helpful?</Text>
          <View style={styles.feedbackButtons}>
            <TouchableOpacity 
              style={styles.feedbackButton}
              onPress={() => {
                logTechniqueUsage(selectedTechnique, 5);
                setSelectedTechnique(null);
              }}
              accessibilityLabel="Technique helped"
              accessibilityRole="button"
            >
              <Text style={styles.feedbackEmoji}>✅</Text>
              <Text style={styles.feedbackText}>Helped</Text>
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
              <Text style={styles.feedbackEmoji}>➖</Text>
              <Text style={styles.feedbackText}>Somewhat</Text>
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
              <Text style={styles.feedbackEmoji}>❌</Text>
              <Text style={styles.feedbackText}>Not much</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <ScrollView style={styles.content}>
          <Text style={styles.fullDescription}>{selectedTechnique.description}</Text>
          
          {selectedTechnique.example && (
            <View style={styles.exampleBox}>
              <Text style={styles.exampleTitle}>💡 Example:</Text>
              <Text style={styles.exampleText}>{selectedTechnique.example}</Text>
            </View>
          )}
          
          {selectedTechnique.name === '5-4-3-2-1 Technique' && (
            <View style={styles.stepByStep}>
              <Text style={styles.stepTitle}>Step by Step:</Text>
              <Text style={styles.step}>1. Name 5 things you can SEE</Text>
              <Text style={styles.step}>2. Name 4 things you can HEAR</Text>
              <Text style={styles.step}>3. Name 3 things you can TOUCH</Text>
              <Text style={styles.step}>4. Name 2 things you can SMELL</Text>
              <Text style={styles.step}>5. Name 1 thing you can TASTE</Text>
            </View>
          )}
          
          {selectedTechnique.name === 'Box Breathing' && (
            <View style={styles.stepByStep}>
              <Text style={styles.stepTitle}>Instructions:</Text>
              <Text style={styles.step}>1. Breathe in for 4 counts</Text>
              <Text style={styles.step}>2. Hold your breath for 4 counts</Text>
              <Text style={styles.step}>3. Breathe out for 4 counts</Text>
              <Text style={styles.step}>4. Hold empty for 4 counts</Text>
              <Text style={styles.step}>5. Repeat 4-8 times</Text>
            </View>
          )}
          
          {selectedTechnique.name === 'TIPP' && (
            <View style={styles.stepByStep}>
              <Text style={styles.stepTitle}>TIPP Technique:</Text>
              <Text style={styles.step}>T - Temperature: Use cold water on face/hands</Text>
              <Text style={styles.step}>I - Intense Exercise: 10 minutes of vigorous activity</Text>
              <Text style={styles.step}>P - Paced Breathing: Slow, deep breaths</Text>
              <Text style={styles.step}>P - Paired Muscle Relaxation: Tense and release</Text>
            </View>
          )}
          
          {selectedTechnique.name === 'DEAR MAN' && (
            <View style={styles.stepByStep}>
              <Text style={styles.stepTitle}>DEAR MAN Steps:</Text>
              <Text style={styles.step}>D - Describe the situation</Text>
              <Text style={styles.step}>E - Express your feelings</Text>
              <Text style={styles.step}>A - Assert your needs</Text>
              <Text style={styles.step}>R - Reinforce benefits</Text>
              <Text style={styles.step}>M - Mindful (stay focused)</Text>
              <Text style={styles.step}>A - Appear confident</Text>
              <Text style={styles.step}>N - Negotiate when possible</Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal style={styles.categoryTabs} showsHorizontalScrollIndicator={false}>
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryTab, selectedCategory === category && styles.activeTab]}
            onPress={() => setSelectedCategory(category)}
            accessibilityLabel={`${category.replace('_', ' ')} category`}
            accessibilityHint={`Show ${category.replace('_', ' ')} techniques`}
            accessibilityRole="button"
            accessibilityState={{ selected: selectedCategory === category }}
          >
            <Text style={[styles.categoryText, selectedCategory === category && styles.activeTabText]}>
              {category.replace('_', ' ').toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.techniquesList}>
        {dbtCbtTechniques[selectedCategory].map(renderTechnique)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  categoryTabs: { backgroundColor: 'white', paddingVertical: 15 },
  categoryTab: { paddingHorizontal: 20, paddingVertical: 10, marginHorizontal: 5, borderRadius: 20, backgroundColor: '#E0E0E0' },
  activeTab: { backgroundColor: '#2E8B57' },
  categoryText: { fontSize: 12, fontWeight: 'bold', color: '#666' },
  activeTabText: { color: 'white' },
  techniquesList: { flex: 1, padding: 15 },
  techniqueCard: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 10, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.22, shadowRadius: 2.22 },
  techniqueHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  techniqueName: { fontSize: 18, fontWeight: 'bold', color: '#2E8B57', flex: 1 },
  techniqueDescription: { fontSize: 14, color: '#666', marginBottom: 10 },
  keywordTags: { flexDirection: 'row', flexWrap: 'wrap' },
  keywordTag: { backgroundColor: '#E8F5E8', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginRight: 6, marginBottom: 4 },
  keywordText: { fontSize: 12, color: '#2E8B57', fontWeight: '500' },
  header: { backgroundColor: 'white', padding: 20, flexDirection: 'row', alignItems: 'center' },
  backButton: { marginRight: 15 },
  backButtonText: { fontSize: 16, color: '#2E8B57' },
  techniqueTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  content: { flex: 1, padding: 20 },
  fullDescription: { fontSize: 16, lineHeight: 24, marginBottom: 20, color: '#333' },
  exampleBox: { backgroundColor: '#F0F8F0', padding: 15, borderRadius: 10, marginBottom: 20, borderLeftWidth: 4, borderLeftColor: '#2E8B57' },
  exampleTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#2E8B57' },
  exampleText: { fontSize: 14, lineHeight: 22, color: '#333', fontStyle: 'italic' },
  stepByStep: { backgroundColor: 'white', padding: 15, borderRadius: 10 },
  stepTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#2E8B57' },
  step: { fontSize: 16, marginBottom: 10, paddingLeft: 10, color: '#333' },
  feedbackBar: { backgroundColor: '#F0F8F0', padding: 15, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  feedbackQuestion: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 10, textAlign: 'center' },
  feedbackButtons: { flexDirection: 'row', justifyContent: 'space-around' },
  feedbackButton: { alignItems: 'center', padding: 10 },
  feedbackEmoji: { fontSize: 32, marginBottom: 5 },
  feedbackText: { fontSize: 14, color: '#666', fontWeight: '500' }
});