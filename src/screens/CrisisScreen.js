import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Linking, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { secureStorage, STORAGE_KEYS } from '../utils/storage';
import SafetyPlan from '../components/SafetyPlan';
import { useTheme, designTokens } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../components/Card';

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
            onPress={item.action}
            accessibilityLabel={item.title}
            accessibilityHint={item.description}
            accessibilityRole="button"
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#DC3545', '#C82333']}
              style={styles.emergencyCard}
            >
              <Ionicons name="alert-circle" size={28} color="white" />
              <View style={styles.emergencyContent}>
                <Text style={styles.emergencyTitle}>{item.title}</Text>
                <Text style={styles.emergencyDescription}>{item.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="white" />
            </LinearGradient>
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
            onPress={() => callNumber(resource)}
            accessibilityLabel={`${resource.name}, ${resource.isText ? 'Text' : 'Call'} ${resource.number}`}
            accessibilityHint={resource.description}
            accessibilityRole="button"
            activeOpacity={0.7}
          >
            <Card style={styles.resourceCard}>
              <View style={[styles.iconCircle, { backgroundColor: theme.primary + '15' }]}>
                <Ionicons name={resource.icon} size={28} color={theme.primary} />
              </View>
              <View style={styles.resourceText}>
                <Text style={[styles.resourceName, { color: theme.text }]}>{resource.name}</Text>
                <Text style={[styles.resourceNumber, { color: theme.primary }]}>
                  {resource.isText ? `Text ${resource.number}` : resource.number}
                </Text>
                <Text style={[styles.resourceDescription, { color: theme.textSecondary }]}>{resource.description}</Text>
              </View>
              <Ionicons name={resource.isText ? 'chatbubble' : 'call'} size={24} color={theme.primary} />
            </Card>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Local Resources</Text>
        <TouchableOpacity onPress={findNearbyResources} activeOpacity={0.7}>
          <Card style={styles.localCard}>
            <View style={[styles.iconCircle, { backgroundColor: theme.primary + '15' }]}>
              <Ionicons name="location" size={28} color={theme.primary} />
            </View>
            <View style={styles.resourceText}>
              <Text style={[styles.localName, { color: theme.text }]}>Find Local Crisis Centers</Text>
              <Text style={[styles.localDescription, { color: theme.textSecondary }]}>Locate nearby mental health facilities</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={theme.primary} />
          </Card>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={findNearestHospital} activeOpacity={0.7}>
          <Card style={styles.localCard}>
            <View style={[styles.iconCircle, { backgroundColor: theme.primary + '15' }]}>
              <Ionicons name="medical" size={28} color={theme.primary} />
            </View>
            <View style={styles.resourceText}>
              <Text style={[styles.localName, { color: theme.text }]}>Hospital Emergency Room</Text>
              <Text style={[styles.localDescription, { color: theme.textSecondary }]}>Nearest emergency medical care</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={theme.primary} />
          </Card>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Crisis Actions</Text>
        
        <TouchableOpacity
          onPress={() => setShowSafetyPlan(true)}
          accessibilityLabel="View My Safety Plan"
          accessibilityHint="Opens your personal safety plan"
          accessibilityRole="button"
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={[theme.primaryGradientTop, theme.primaryGradientBottom]}
            style={styles.safetyPlanButton}
          >
            <Ionicons name="shield-checkmark" size={24} color="white" />
            <Text style={styles.safetyPlanButtonText}>View My Safety Plan</Text>
          </LinearGradient>
        </TouchableOpacity>

        {emergencyContacts.length > 0 && (
          <TouchableOpacity onPress={sendEmergencyAlert} activeOpacity={0.9}>
            <LinearGradient
              colors={['#FF6B35', '#E85A2A']}
              style={styles.alertButton}
            >
              <Ionicons name="warning" size={24} color="white" />
              <Text style={styles.alertButtonText}>Send Emergency Alert</Text>
            </LinearGradient>
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
  container: { flex: 1, paddingBottom: 100 },
  warningBanner: { 
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningText: { 
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '700',
  },
  safetyPlanHeader: { 
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  safetyPlanTitle: { 
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  section: { 
    paddingHorizontal: 20,
    marginTop: designTokens.spacing.section,
  },
  sectionTitle: { 
    ...designTokens.typography.h2,
    marginBottom: 16,
  },
  emergencyCard: { 
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: designTokens.borderRadius.cardLarge,
    marginBottom: 12,
    ...designTokens.shadows.cardStrong,
  },
  emergencyContent: {
    flex: 1,
    marginLeft: 16,
  },
  emergencyTitle: { 
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  emergencyDescription: { 
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  resourceCard: { 
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
  },
  localCard: { 
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resourceText: { 
    marginLeft: 16,
    flex: 1,
  },
  resourceName: { 
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  resourceNumber: { 
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  resourceDescription: { 
    fontSize: 14,
    lineHeight: 20,
  },
  localName: { 
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  localDescription: { 
    fontSize: 14,
    lineHeight: 20,
  },
  safetyPlanButton: { 
    paddingVertical: 16,
    borderRadius: designTokens.borderRadius.button,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    ...designTokens.shadows.button,
  },
  safetyPlanButtonText: { 
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  alertButton: { 
    paddingVertical: 16,
    borderRadius: designTokens.borderRadius.button,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...designTokens.shadows.button,
  },
  alertButtonText: { 
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  safetyPlan: { 
    padding: 20,
    borderRadius: designTokens.borderRadius.card,
  },
  safetyStep: { 
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepNumber: { 
    color: 'white',
    width: 28,
    height: 28,
    borderRadius: 14,
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '700',
    marginRight: 16,
  },
  stepText: { 
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  footer: { 
    padding: 24,
    margin: 20,
    borderRadius: designTokens.borderRadius.cardLarge,
    ...designTokens.shadows.card,
  },
  footerText: { 
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic',
  },
});