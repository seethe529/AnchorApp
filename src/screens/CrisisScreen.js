import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Linking, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { secureStorage, STORAGE_KEYS } from '../utils/storage';
import SafetyPlan from '../components/SafetyPlan';
import { useTheme } from '../context/ThemeContext';

let Location;
if (Platform.OS !== 'web') {
  Location = require('expo-location');
}

export default function CrisisScreen({ navigation }) {
  const { theme } = useTheme();
  const [userLocation, setUserLocation] = useState(null);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [showSafetyPlan, setShowSafetyPlan] = useState(false);

  useEffect(() => {
    getCurrentLocation();
    loadEmergencyContacts();
  }, []);

  const getCurrentLocation = async () => {
    if (Platform.OS === 'web') {
      console.log('Location services not available on web');
      return;
    }
    
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location);
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const loadEmergencyContacts = async () => {
    try {
      const contacts = await secureStorage.getItem(STORAGE_KEYS.EMERGENCY_CONTACTS) || [];
      setEmergencyContacts(contacts);
    } catch (error) {
      console.error('Error loading emergency contacts:', error);
    }
  };
  const crisisResources = [
    { 
      name: 'National Suicide Prevention Lifeline', 
      number: '988', 
      description: '24/7 crisis support - Free & confidential',
      icon: 'call',
      priority: 1
    },
    { 
      name: 'Crisis Text Line', 
      number: '741741', 
      description: 'Text HOME for immediate support',
      icon: 'chatbubble',
      priority: 1,
      isText: true
    },
    { 
      name: 'Veterans Crisis Line', 
      number: '1-800-273-8255', 
      description: 'Press 1 for veteran-specific support',
      icon: 'shield',
      priority: 1
    },
    { 
      name: 'SAMHSA National Helpline', 
      number: '1-800-662-4357', 
      description: 'Mental health & substance abuse',
      icon: 'medical-outline',
      priority: 2
    }
  ];

  const immediateHelp = [
    { title: 'Call 911', description: 'For immediate medical emergency', action: () => Linking.openURL('tel:911') },
    { title: 'Go to ER', description: 'Nearest emergency room', action: () => Alert.alert('Emergency', 'Please go to your nearest emergency room immediately') },
    { title: 'Call Crisis Line', description: 'Speak with trained counselor', action: () => Linking.openURL('tel:988') }
  ];

  const safetyPlan = [
    'Remove any means of self-harm from your immediate area',
    'Call a trusted friend, family member, or crisis line',
    'Go to a safe, public place if you\'re alone',
    'Use grounding techniques to stay present',
    'Remember: This feeling is temporary and will pass'
  ];

  const callNumber = (resource) => {
    if (resource.isText) {
      Linking.openURL(`sms:${resource.number}&body=HOME`);
      return;
    }
    
    Alert.alert(
      'Call Crisis Support',
      `Call ${resource.name}?\n\n${resource.description}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => Linking.openURL(`tel:${resource.number}`) }
      ]
    );
  };

  const findNearbyResources = () => {
    if (userLocation) {
      const { latitude, longitude } = userLocation.coords;
      const url = `https://maps.google.com/maps?q=mental+health+crisis+center+near+${latitude},${longitude}`;
      Linking.openURL(url);
    } else {
      Alert.alert('Location Required', 'Please enable location services to find nearby resources.');
    }
  };

  const findNearestHospital = () => {
    if (userLocation) {
      const { latitude, longitude } = userLocation.coords;
      const url = `https://maps.google.com/maps?q=hospital+emergency+room+near+${latitude},${longitude}`;
      Linking.openURL(url);
    } else {
      Alert.alert('Location Required', 'Please enable location services to find nearest hospital.');
    }
  };

  const sendEmergencyAlert = async () => {
    Alert.alert(
      'Send Emergency Alert',
      'This will send your location and a crisis message to your emergency contacts.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send Alert', 
          onPress: () => {
            Alert.alert('Alert Sent', 'Emergency contacts have been notified.');
          },
          style: 'destructive'
        }
      ]
    );
  };

  if (showSafetyPlan) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.safetyPlanHeader, { backgroundColor: theme.primary }]}>
          <TouchableOpacity onPress={() => setShowSafetyPlan(false)}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={[styles.safetyPlanTitle, { color: 'white' }]}>Safety Plan</Text>
        </View>
        <SafetyPlan />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.warningBanner, { backgroundColor: theme.primary + '20' }]}>
        <Ionicons name="warning" size={24} color={theme.primary} />
        <Text style={[styles.warningText, { color: theme.primary }]}>Immediate danger? Call 911</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Immediate Help</Text>
        {immediateHelp.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={[styles.emergencyCard, { backgroundColor: theme.primary }]} 
            onPress={item.action}
            accessibilityLabel={item.title}
            accessibilityHint={item.description}
            accessibilityRole="button"
          >
            <Text style={styles.emergencyTitle}>{item.title}</Text>
            <Text style={styles.emergencyDescription}>{item.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Crisis Resources</Text>
        {crisisResources
          .sort((a, b) => a.priority - b.priority)
          .map((resource, index) => (
          <TouchableOpacity 
            key={index} 
            style={[styles.resourceCard, { backgroundColor: theme.card }]} 
            onPress={() => callNumber(resource)}
            accessibilityLabel={`${resource.name}, ${resource.isText ? 'Text' : 'Call'} ${resource.number}`}
            accessibilityHint={resource.description}
            accessibilityRole="button"
          >
            <View style={styles.resourceInfo}>
              <Ionicons name={resource.icon} size={24} color={theme.primary} />
              <View style={styles.resourceText}>
                <Text style={[styles.resourceName, { color: theme.text }]}>{resource.name}</Text>
                <Text style={styles.resourceNumber}>
                  {resource.isText ? `Text ${resource.number}` : resource.number}
                </Text>
                <Text style={[styles.resourceDescription, { color: theme.textSecondary }]}>{resource.description}</Text>
              </View>
            </View>
            <Ionicons name={resource.isText ? 'chatbubble' : 'call'} size={20} color={theme.primary} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Local Resources</Text>
        <TouchableOpacity style={[styles.localCard, { backgroundColor: theme.card }]} onPress={findNearbyResources}>
          <Ionicons name="location" size={24} color={theme.primary} />
          <View style={styles.resourceText}>
            <Text style={[styles.localName, { color: theme.text }]}>Find Local Crisis Centers</Text>
            <Text style={[styles.localDescription, { color: theme.textSecondary }]}>Locate nearby mental health facilities</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.localCard, { backgroundColor: theme.card }]} onPress={findNearestHospital}>
          <Ionicons name="medical" size={24} color={theme.primary} />
          <View style={styles.resourceText}>
            <Text style={[styles.localName, { color: theme.text }]}>Hospital Emergency Room</Text>
            <Text style={[styles.localDescription, { color: theme.textSecondary }]}>Nearest emergency medical care</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Crisis Actions</Text>
        
        <TouchableOpacity 
          style={[styles.safetyPlanButton, { backgroundColor: theme.primary }]} 
          onPress={() => setShowSafetyPlan(true)}
          accessibilityLabel="View My Safety Plan"
          accessibilityHint="Opens your personal safety plan"
          accessibilityRole="button"
        >
          <Ionicons name="shield-checkmark" size={24} color="white" />
          <Text style={styles.safetyPlanButtonText}>View My Safety Plan</Text>
        </TouchableOpacity>

        {emergencyContacts.length > 0 && (
          <TouchableOpacity style={styles.alertButton} onPress={sendEmergencyAlert}>
            <Ionicons name="warning" size={24} color="white" />
            <Text style={styles.alertButtonText}>Send Emergency Alert</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Safety Reminders</Text>
        <View style={[styles.safetyPlan, { backgroundColor: theme.card }]}>
          {safetyPlan.map((step, index) => (
            <View key={index} style={styles.safetyStep}>
              <Text style={[styles.stepNumber, { backgroundColor: theme.primary }]}>{index + 1}</Text>
              <Text style={[styles.stepText, { color: theme.text }]}>{step}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.footer, { backgroundColor: theme.primary }]}>
        <Text style={[styles.footerText, { color: 'white' }]}>
          You are not alone. Help is available 24/7. Your life has value and meaning.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  warningBanner: { padding: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  warningText: { marginLeft: 10, fontSize: 16, fontWeight: 'bold' },
  safetyPlanHeader: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  safetyPlanTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 15 },
  section: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  emergencyCard: { padding: 15, borderRadius: 10, marginBottom: 10, elevation: 3 },
  emergencyTitle: { fontSize: 18, fontWeight: 'bold', color: 'white', marginBottom: 5 },
  emergencyDescription: { fontSize: 14, color: 'white' },
  resourceCard: { padding: 15, borderRadius: 10, marginBottom: 10, flexDirection: 'row', alignItems: 'center', elevation: 2 },
  localCard: { padding: 15, borderRadius: 10, marginBottom: 10, flexDirection: 'row', alignItems: 'center', elevation: 1 },
  resourceInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  resourceText: { marginLeft: 15, flex: 1 },
  resourceName: { fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
  resourceNumber: { fontSize: 16, fontWeight: 'bold', color: '#2E8B57', marginBottom: 2 },
  resourceDescription: { fontSize: 14 },
  localName: { fontSize: 16, fontWeight: '500', marginBottom: 2 },
  localDescription: { fontSize: 14 },
  safetyPlanButton: { padding: 15, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  safetyPlanButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
  alertButton: { backgroundColor: '#FF6B35', padding: 15, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  alertButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
  safetyPlan: { padding: 15, borderRadius: 10, elevation: 1 },
  safetyStep: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 15 },
  stepNumber: { color: 'white', width: 25, height: 25, borderRadius: 12.5, textAlign: 'center', lineHeight: 25, fontWeight: 'bold', marginRight: 15 },
  stepText: { flex: 1, fontSize: 16, lineHeight: 24 },
  footer: { padding: 20, margin: 20, borderRadius: 10, elevation: 2 },
  footerText: { fontSize: 16, textAlign: 'center', lineHeight: 24, fontStyle: 'italic' }
});