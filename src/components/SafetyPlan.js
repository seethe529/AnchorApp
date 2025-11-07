import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { secureStorage, STORAGE_KEYS } from '../utils/storage';

export default function SafetyPlan() {
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
      <View style={styles.loadingContainer}>
        <Text>Loading safety plan...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Personal Safety Plan</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => isEditing ? saveSafetyPlan() : setIsEditing(true)}
        >
          <Ionicons name={isEditing ? 'checkmark' : 'create'} size={24} color="white" />
        </TouchableOpacity>
      </View>

      {sections.map((section) => (
        <View key={section.key} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name={section.icon} size={24} color="#2E8B57" />
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
          
          {isEditing ? (
            <TextInput
              style={styles.input}
              placeholder={section.placeholder}
              value={plan[section.key]}
              onChangeText={(text) => setPlan(prev => ({ ...prev, [section.key]: text }))}
              multiline
              numberOfLines={4}
            />
          ) : (
            <Text style={styles.content}>
              {plan[section.key] || 'Tap edit to add content'}
            </Text>
          )}
        </View>
      ))}

      <View style={styles.emergencySection}>
        <Text style={styles.emergencyTitle}>Emergency Contacts</Text>
        <TouchableOpacity style={styles.emergencyButton}>
          <Text style={styles.emergencyText}>National Suicide Prevention Lifeline: 988</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.emergencyButton}>
          <Text style={styles.emergencyText}>Crisis Text Line: Text HOME to 741741</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.emergencyButton}>
          <Text style={styles.emergencyText}>Veterans Crisis Line: 1-800-273-8255</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: 'white' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2E8B57' },
  editButton: { backgroundColor: '#2E8B57', padding: 10, borderRadius: 20 },
  section: { backgroundColor: 'white', margin: 10, padding: 15, borderRadius: 10 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 10, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, minHeight: 80, textAlignVertical: 'top' },
  content: { fontSize: 16, lineHeight: 24, color: '#555' },
  emergencySection: { backgroundColor: '#FFE5E5', margin: 10, padding: 15, borderRadius: 10 },
  emergencyTitle: { fontSize: 18, fontWeight: 'bold', color: '#D32F2F', marginBottom: 10 },
  emergencyButton: { backgroundColor: '#D32F2F', padding: 12, borderRadius: 8, marginBottom: 8 },
  emergencyText: { color: 'white', fontSize: 16, textAlign: 'center' }
});