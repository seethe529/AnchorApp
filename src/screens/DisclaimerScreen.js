import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { storage } from '../utils/storage';

export default function DisclaimerScreen({ navigation }) {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = async () => {
    await storage.setItem('disclaimer_accepted', true);
    navigation.replace('MainApp');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="shield-checkmark" size={60} color="#2E8B57" />
        <Text style={styles.title}>Important Notice</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.warningBox}>
          <Ionicons name="warning" size={24} color="#DC143C" />
          <Text style={styles.warningTitle}>Medical Disclaimer</Text>
        </View>

        <Text style={styles.text}>
          Anchor is a self-help tool designed to provide educational information and support for individuals with PTSD and trauma-related conditions.
        </Text>

        <Text style={styles.boldText}>This app is NOT:</Text>
        <Text style={styles.bulletPoint}>• A substitute for professional medical advice</Text>
        <Text style={styles.bulletPoint}>• A replacement for therapy or counseling</Text>
        <Text style={styles.bulletPoint}>• Monitored by healthcare professionals</Text>
        <Text style={styles.bulletPoint}>• An emergency service</Text>

        <View style={styles.crisisBox}>
          <Text style={styles.crisisTitle}>🚨 If You're In Crisis:</Text>
          <Text style={styles.crisisText}>• National Suicide Prevention Lifeline: 988</Text>
          <Text style={styles.crisisText}>• Crisis Text Line: Text HOME to 741741</Text>
          <Text style={styles.crisisText}>• Veterans Crisis Line: 1-800-273-8255</Text>
          <Text style={styles.crisisText}>• Emergency Services: 911</Text>
        </View>

        <Text style={styles.text}>
          By using this app, you acknowledge that you understand these limitations and agree to seek professional help when needed.
        </Text>

        <TouchableOpacity 
          style={styles.checkbox}
          onPress={() => setAccepted(!accepted)}
        >
          <Ionicons 
            name={accepted ? "checkbox" : "square-outline"} 
            size={24} 
            color="#2E8B57" 
          />
          <Text style={styles.checkboxText}>
            I understand and agree to the terms above
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity 
        style={[styles.acceptButton, !accepted && styles.disabledButton]}
        onPress={handleAccept}
        disabled={!accepted}
      >
        <Text style={styles.acceptButtonText}>Continue to App</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { backgroundColor: 'white', padding: 30, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginTop: 15 },
  content: { flex: 1, padding: 20 },
  warningBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF3CD', padding: 15, borderRadius: 10, marginBottom: 20, borderLeftWidth: 4, borderLeftColor: '#DC143C' },
  warningTitle: { fontSize: 18, fontWeight: 'bold', color: '#DC143C', marginLeft: 10 },
  text: { fontSize: 16, lineHeight: 24, color: '#333', marginBottom: 15 },
  boldText: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 10, marginTop: 10 },
  bulletPoint: { fontSize: 16, lineHeight: 24, color: '#333', marginLeft: 10, marginBottom: 5 },
  crisisBox: { backgroundColor: '#FFE5E5', padding: 15, borderRadius: 10, marginVertical: 20, borderLeftWidth: 4, borderLeftColor: '#DC143C' },
  crisisTitle: { fontSize: 16, fontWeight: 'bold', color: '#DC143C', marginBottom: 10 },
  crisisText: { fontSize: 14, color: '#333', marginBottom: 5 },
  checkbox: { flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 20 },
  checkboxText: { fontSize: 16, color: '#333', marginLeft: 10, flex: 1 },
  acceptButton: { backgroundColor: '#2E8B57', margin: 20, padding: 18, borderRadius: 10, alignItems: 'center' },
  disabledButton: { backgroundColor: '#ccc' },
  acceptButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});
