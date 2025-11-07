import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

let Haptics;
if (Platform.OS !== 'web') {
  Haptics = require('expo-haptics');
}

export default function BreathingExercise({ onComplete }) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('inhale'); // inhale, hold, exhale, hold
  const [count, setCount] = useState(4);
  const [cycles, setCycles] = useState(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef(null);

  const phases = {
    inhale: { text: 'Breathe In', duration: 4, next: 'hold1' },
    hold1: { text: 'Hold', duration: 4, next: 'exhale' },
    exhale: { text: 'Breathe Out', duration: 4, next: 'hold2' },
    hold2: { text: 'Hold', duration: 4, next: 'inhale' }
  };

  useEffect(() => {
    if (isActive) {
      startBreathingCycle();
    } else {
      stopBreathingCycle();
    }
    return () => stopBreathingCycle();
  }, [isActive, phase]);

  const startBreathingCycle = () => {
    const currentPhase = phases[phase];
    setCount(currentPhase.duration);
    
    intervalRef.current = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) {
          nextPhase();
          return currentPhase.duration;
        }
        return prev - 1;
      });
    }, 1000);

    // Animate circle based on phase
    if (phase === 'inhale') {
      Animated.timing(scaleAnim, {
        toValue: 1.5,
        duration: 4000,
        useNativeDriver: true,
      }).start();
    } else if (phase === 'exhale') {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      }).start();
    }
  };

  const stopBreathingCycle = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const nextPhase = () => {
    const currentPhase = phases[phase];
    const nextPhase = currentPhase.next;
    
    if (nextPhase === 'inhale') {
      setCycles(prev => prev + 1);
    }
    
    setPhase(nextPhase);
    
    // Haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const toggleExercise = () => {
    if (isActive) {
      setIsActive(false);
      setCycles(0);
      setPhase('inhale');
      scaleAnim.setValue(1);
    } else {
      setIsActive(true);
    }
  };

  const completeExercise = () => {
    setIsActive(false);
    setCycles(0);
    setPhase('inhale');
    scaleAnim.setValue(1);
    onComplete && onComplete(cycles);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Box Breathing Exercise</Text>
      <Text style={styles.subtitle}>4-4-4-4 Pattern</Text>
      
      <View style={styles.breathingArea}>
        <Animated.View 
          style={[
            styles.breathingCircle,
            { 
              transform: [{ scale: scaleAnim }],
              backgroundColor: phase === 'inhale' || phase === 'hold1' ? '#4CAF50' : '#2196F3'
            }
          ]}
        >
          <Text style={styles.phaseText}>{phases[phase].text}</Text>
          <Text style={styles.countText}>{count}</Text>
        </Animated.View>
      </View>

      <View style={styles.stats}>
        <Text style={styles.cyclesText}>Cycles: {cycles}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: isActive ? '#F44336' : '#4CAF50' }]}
          onPress={toggleExercise}
        >
          <Ionicons 
            name={isActive ? 'stop' : 'play'} 
            size={24} 
            color="white" 
          />
          <Text style={styles.buttonText}>
            {isActive ? 'Stop' : 'Start'}
          </Text>
        </TouchableOpacity>

        {cycles >= 3 && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#2E8B57' }]}
            onPress={completeExercise}
          >
            <Ionicons name="checkmark" size={24} color="white" />
            <Text style={styles.buttonText}>Complete</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          Follow the circle and breathe with the rhythm. 
          Complete at least 3 cycles for maximum benefit.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 20, backgroundColor: '#F5F5F5' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2E8B57', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 30 },
  breathingArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  breathingCircle: { 
    width: 200, 
    height: 200, 
    borderRadius: 100, 
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  phaseText: { fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 10 },
  countText: { fontSize: 48, fontWeight: 'bold', color: 'white' },
  stats: { marginBottom: 20 },
  cyclesText: { fontSize: 18, fontWeight: '500', color: '#333' },
  controls: { flexDirection: 'row', gap: 15, marginBottom: 20 },
  button: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15, 
    borderRadius: 25, 
    minWidth: 100,
    justifyContent: 'center'
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 5 },
  instructions: { paddingHorizontal: 20 },
  instructionText: { fontSize: 14, textAlign: 'center', color: '#666', lineHeight: 20 }
});