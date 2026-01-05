import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { storage } from '../utils/storage';
import { useTheme, designTokens } from '../context/ThemeContext';
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

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
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
        <View style={styles.bulletList}>
          <Text style={[styles.bulletPoint, { color: theme.textSecondary }]}>• A substitute for professional medical advice</Text>
          <Text style={[styles.bulletPoint, { color: theme.textSecondary }]}>• A replacement for therapy or counseling</Text>
          <Text style={[styles.bulletPoint, { color: theme.textSecondary }]}>• Monitored by healthcare professionals</Text>
          <Text style={[styles.bulletPoint, { color: theme.textSecondary }]}>• An emergency service</Text>
        </View>

        <Card variant="strong" style={styles.crisisCard}>
          <Text style={styles.crisisTitle}>🚨 If You're In Crisis:</Text>
          <View style={styles.crisisList}>
            <Text style={[styles.crisisText, { color: theme.text }]}>• National Suicide Prevention Lifeline: 988</Text>
            <Text style={[styles.crisisText, { color: theme.text }]}>• Crisis Text Line: Text HOME to 741741</Text>
            <Text style={[styles.crisisText, { color: theme.text }]}>• Veterans Crisis Line: 1-800-273-8255</Text>
            <Text style={[styles.crisisText, { color: theme.text }]}>• Emergency Services: 911</Text>
          </View>
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
            size={28} 
            color={theme.primary}
            style={styles.checkboxIcon}
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
  header: { 
    padding: 28, 
    alignItems: 'center', 
    ...designTokens.shadows.card
  },
  title: { 
    ...designTokens.typography.h1,
    marginTop: 12
  },
  content: { flex: 1 },
  contentContainer: { 
    padding: 20, 
    paddingBottom: 40 
  },
  warningCard: { 
    marginBottom: 20,
    backgroundColor: 'rgba(220, 20, 60, 0.08)'
  },
  warningHeader: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  warningTitle: { 
    fontSize: 17, 
    fontWeight: '600', 
    color: '#DC143C', 
    marginLeft: 10 
  },
  text: { 
    fontSize: 15, 
    lineHeight: 22, 
    marginBottom: 16 
  },
  boldText: { 
    fontSize: 16, 
    fontWeight: '600', 
    marginBottom: 10, 
    marginTop: 8 
  },
  bulletList: { 
    marginBottom: 16, 
    paddingLeft: 4 
  },
  bulletPoint: { 
    fontSize: 15, 
    lineHeight: 22, 
    marginBottom: 6,
    paddingLeft: 8
  },
  crisisCard: { 
    marginVertical: 20,
    backgroundColor: 'rgba(220, 20, 60, 0.08)'
  },
  crisisTitle: { 
    fontSize: 17, 
    fontWeight: '600', 
    color: '#DC143C', 
    marginBottom: 12 
  },
  crisisList: { 
    paddingLeft: 4 
  },
  crisisText: { 
    fontSize: 15, 
    lineHeight: 22, 
    marginBottom: 8,
    paddingLeft: 8
  },
  checkbox: { 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    marginTop: 24, 
    marginBottom: 32, 
    paddingHorizontal: 4 
  },
  checkboxIcon: { 
    marginTop: 2 
  },
  checkboxText: { 
    fontSize: 15, 
    lineHeight: 22, 
    marginLeft: 12, 
    flex: 1 
  },
  buttonContainer: { 
    padding: 20, 
    paddingTop: 12,
    paddingBottom: 24
  }
});
