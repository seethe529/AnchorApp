import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { secureStorage, STORAGE_KEYS } from '../utils/storage';
import { useTheme } from '../context/ThemeContext';

export default function SafetyPlan() {
  const { theme } = useTheme();
  const isFocused = useIsFocused();
  const [plan, setPlan] = useState({
    warningSigns: '',
    copingStrategies: '',
    socialContacts: '',
    professionalContacts: '',
    environmentSafety: '',
    reasonsToLive: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isFocused) {
      loadSafetyPlan();
    }
  }, [isFocused]);

  const loadSafetyPlan = async () => {
    try {
      const savedPlan = await secureStorage.getItem(STORAGE_KEYS.SAFETY_PLAN);
      if (savedPlan) {
        setPlan(savedPlan);
      }
    } catch (error) {
      console.error('Error loading safety plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSafetyPlan = async () => {
    try {
      await secureStorage.setItem(STORAGE_KEYS.SAFETY_PLAN, plan);
      setIsEditing(false);
      Alert.alert('Success', 'Safety plan saved successfully');
    } catch (error) {
      console.error('Error saving safety plan:', error);
      Alert.alert('Error', 'Failed to save safety plan');
    }
  };

  const sections = [
    { key: 'warningSigns', title: 'Warning Signs', icon: 'warning', placeholder: 'List your personal warning signs...' },
    { key: 'copingStrategies', title: 'Coping Strategies', icon: 'fitness', placeholder: 'List strategies that help you cope...' },
    { key: 'socialContacts', title: 'Social Support', icon: 'people', placeholder: 'List trusted friends and family...' },
    { key: 'professionalContacts', title: 'Professional Contacts', icon: 'medical', placeholder: 'List therapists, doctors, crisis lines...' },
    { key: 'environmentSafety', title: 'Environment Safety', icon: 'shield', placeholder: 'Steps to make environment safer...' },
    { key: 'reasonsToLive', title: 'Reasons for Living', icon: 'heart', placeholder: 'What makes life worth living...' }
  ];

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Loading safety plan...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <Text style={[styles.title, { color: theme.primary }]}>Personal Safety Plan</Text>
        <TouchableOpacity
          style={[styles.editButton, { backgroundColor: theme.primary }]}
          onPress={() => isEditing ? saveSafetyPlan() : setIsEditing(true)}
          accessibilityLabel={isEditing ? 'Save safety plan' : 'Edit safety plan'}
          accessibilityHint={isEditing ? 'Saves your changes to the safety plan' : 'Allows you to edit your safety plan'}
          accessibilityRole="button"
        >
          <Ionicons name={isEditing ? 'checkmark' : 'create'} size={24} color="white" />
        </TouchableOpacity>
      </View>

      {sections.map((section) => (
        <View key={section.key} style={[styles.section, { backgroundColor: theme.card }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name={section.icon} size={24} color={theme.primary} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{section.title}</Text>
          </View>
          
          {isEditing ? (
            <TextInput
              style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.background }]}
              placeholder={section.placeholder}
              placeholderTextColor={theme.textTertiary}
              value={plan[section.key]}
              onChangeText={(text) => setPlan(prev => ({ ...prev, [section.key]: text }))}
              multiline
              numberOfLines={4}
              accessibilityLabel={`${section.title} input`}
              accessibilityHint={section.placeholder}
            />
          ) : (
            <Text style={[styles.content, { color: theme.textSecondary }]} accessible={true} accessibilityLabel={`${section.title}: ${plan[section.key] || 'No content added yet'}`}>
              {plan[section.key] || 'Tap edit to add content'}
            </Text>
          )}
        </View>
      ))}

      <View style={[styles.emergencySection, { backgroundColor: 'rgba(46, 139, 87, 0.15)' }]}>
        <Text style={[styles.emergencyTitle, { color: theme.primary }]}>Emergency Contacts</Text>
        <TouchableOpacity 
          style={[styles.emergencyButton, { backgroundColor: theme.primary }]}
          accessibilityLabel="National Suicide Prevention Lifeline, 988"
          accessibilityHint="Call for immediate crisis support"
          accessibilityRole="button"
        >
          <Text style={styles.emergencyText}>National Suicide Prevention Lifeline: 988</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.emergencyButton, { backgroundColor: theme.primary }]}
          accessibilityLabel="Crisis Text Line, Text HOME to 741741"
          accessibilityHint="Send a text message for crisis support"
          accessibilityRole="button"
        >
          <Text style={styles.emergencyText}>Crisis Text Line: Text HOME to 741741</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.emergencyButton, { backgroundColor: theme.primary }]}
          accessibilityLabel="Veterans Crisis Line, 1-800-273-8255"
          accessibilityHint="Call for veteran-specific crisis support"
          accessibilityRole="button"
        >
          <Text style={styles.emergencyText}>Veterans Crisis Line: 1-800-273-8255</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  editButton: { padding: 10, borderRadius: 20 },
  section: { margin: 10, padding: 15, borderRadius: 10 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, minHeight: 80, textAlignVertical: 'top' },
  content: { fontSize: 16, lineHeight: 24 },
  emergencySection: { margin: 10, padding: 15, borderRadius: 10 },
  emergencyTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  emergencyButton: { padding: 12, borderRadius: 8, marginBottom: 8 },
  emergencyText: { color: 'white', fontSize: 16, textAlign: 'center' }
});