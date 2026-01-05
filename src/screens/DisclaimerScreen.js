import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { storage } from '../utils/storage';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/Button';
import Card from '../components/Card';

export default function DisclaimerScreen({ navigation }) {
  const { theme } = useTheme();
  const [accepted, setAccepted] = useState(false);

  const handleAccept = async () => {
    await storage.setItem('disclaimer_accepted', true);
    const onboardingCompleted = await storage.getItem('onboarding_completed');
    console.log('📋 [DISCLAIMER] Onboarding completed:', onboardingCompleted);
    if (onboardingCompleted) {
      console.log('✅ [DISCLAIMER] Navigating to MainApp');
      navigation.replace('MainApp');
    } else {
      console.log('🎯 [DISCLAIMER] Navigating to Onboarding');
      navigation.replace('Onboarding');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'bottom']}>
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <Ionicons name="shield-checkmark" size={60} color={theme.primary} />
        <Text style={[styles.title, { color: theme.text }]}>Important Notice</Text>
      </View>

      <ScrollView style={styles.content}>
        <Card variant="strong" style={styles.warningCard}>
          <View style={styles.warningHeader}>
            <Ionicons name="warning" size={24} color="#DC143C" />
            <Text style={styles.warningTitle}>Medical Disclaimer</Text>
          </View>
        </Card>

        <Text style={[styles.text, { color: theme.text }]}>
          Anchor is a self-help tool designed to provide educational information and support for individuals with PTSD and trauma-related conditions.
        </Text>

        <Text style={[styles.boldText, { color: theme.text }]}>This app is NOT:</Text>
        <Text style={[styles.bulletPoint, { color: theme.textSecondary }]}>• A substitute for professional medical advice</Text>
        <Text style={[styles.bulletPoint, { color: theme.textSecondary }]}>• A replacement for therapy or counseling</Text>
        <Text style={[styles.bulletPoint, { color: theme.textSecondary }]}>• Monitored by healthcare professionals</Text>
        <Text style={[styles.bulletPoint, { color: theme.textSecondary }]}>• An emergency service</Text>

        <Card variant="strong" style={styles.crisisCard}>
          <Text style={styles.crisisTitle}>🚨 If You're In Crisis:</Text>
          <Text style={[styles.crisisText, { color: theme.text }]}>• National Suicide Prevention Lifeline: 988</Text>
          <Text style={[styles.crisisText, { color: theme.text }]}>• Crisis Text Line: Text HOME to 741741</Text>
          <Text style={[styles.crisisText, { color: theme.text }]}>• Veterans Crisis Line: 1-800-273-8255</Text>
          <Text style={[styles.crisisText, { color: theme.text }]}>• Emergency Services: 911</Text>
        </Card>

        <Text style={[styles.text, { color: theme.text }]}>
          By using this app, you acknowledge that you understand these limitations and agree to seek professional help when needed.
        </Text>

        <TouchableOpacity 
          style={styles.checkbox}
          onPress={() => setAccepted(!accepted)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: accepted }}
          accessibilityLabel="I understand and agree to the terms"
        >
          <Ionicons 
            name={accepted ? "checkbox" : "square-outline"} 
            size={24} 
            color={theme.primary} 
          />
          <Text style={[styles.checkboxText, { color: theme.text }]}>
            I understand and agree to the terms above
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button 
          title="Continue to App"
          onPress={handleAccept}
          disabled={!accepted}
          variant="primary"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 30, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 15 },
  content: { flex: 1, padding: 20 },
  warningCard: { marginBottom: 20 },
  warningHeader: { flexDirection: 'row', alignItems: 'center' },
  warningTitle: { fontSize: 18, fontWeight: 'bold', color: '#DC143C', marginLeft: 10 },
  text: { fontSize: 16, lineHeight: 24, marginBottom: 15 },
  boldText: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, marginTop: 10 },
  bulletPoint: { fontSize: 16, lineHeight: 24, marginLeft: 10, marginBottom: 5 },
  crisisCard: { marginVertical: 20 },
  crisisTitle: { fontSize: 16, fontWeight: 'bold', color: '#DC143C', marginBottom: 10 },
  crisisText: { fontSize: 14, marginBottom: 5 },
  checkbox: { flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 20 },
  checkboxText: { fontSize: 16, marginLeft: 10, flex: 1 },
  buttonContainer: { padding: 20 }
});
