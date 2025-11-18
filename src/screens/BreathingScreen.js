import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, FlatList, Dimensions, Platform, AccessibilityInfo } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { breathingMethods } from '../data/breathingMethods';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

export default function BreathingScreen({ navigation }) {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [completedCycles, setCompletedCycles] = useState(0);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const flatListRef = useRef(null);

  const currentMethod = breathingMethods[currentIndex];
  const currentPhase = currentMethod.pattern[currentPhaseIndex];

  useEffect(() => {
    if (!isActive) return;

    setCountdown(currentPhase.duration);
    
    // Animate circle based on phase
    if (currentPhase.phase.includes('In')) {
      Animated.timing(scaleAnim, {
        toValue: 1.8,
        duration: currentPhase.duration * 1000,
        useNativeDriver: true,
      }).start();
    } else if (currentPhase.phase.includes('Out')) {
      Animated.timing(scaleAnim, {
        toValue: 0.6,
        duration: currentPhase.duration * 1000,
        useNativeDriver: true,
      }).start();
    }
    // Hold: don't animate, keep current scale

    // Countdown timer
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          moveToNextPhase();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, currentPhaseIndex, currentIndex]);

  const moveToNextPhase = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const nextPhaseIndex = currentPhaseIndex + 1;
    if (nextPhaseIndex >= currentMethod.pattern.length) {
      setCurrentPhaseIndex(0);
      const newCycles = completedCycles + 1;
      setCompletedCycles(newCycles);
      // Announce cycle completion for blind users
      AccessibilityInfo.announceForAccessibility(`Cycle ${newCycles} completed`);
      logBreathingSession();
    } else {
      setCurrentPhaseIndex(nextPhaseIndex);
      // Announce phase change for blind users
      const nextPhase = currentMethod.pattern[nextPhaseIndex];
      AccessibilityInfo.announceForAccessibility(`${nextPhase.phase}, ${nextPhase.instruction}`);
    }
  };

  const toggleActive = () => {
    if (!isActive) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      scaleAnim.setValue(1);
      setIsActive(true);
      setCurrentPhaseIndex(0);
      setCompletedCycles(0);
    } else {
      setIsActive(false);
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const logBreathingSession = async () => {
    try {
      const sessions = await storage.getItem(STORAGE_KEYS.BREATHING_SESSIONS) || [];
      sessions.push({
        method: currentMethod.name,
        methodId: currentMethod.id,
        timestamp: new Date().toISOString(),
        cycles: completedCycles + 1
      });
      await storage.setItem(STORAGE_KEYS.BREATHING_SESSIONS, sessions);
    } catch (error) {
      console.error('Error logging breathing session:', error);
    }
  };

  const navigateToMethod = (index) => {
    if (index >= 0 && index < breathingMethods.length) {
      flatListRef.current?.scrollToIndex({ index, animated: true });
      setCurrentIndex(index);
      setIsActive(false);
      setCurrentPhaseIndex(0);
      setCompletedCycles(0);
      scaleAnim.setValue(1);
      // Announce method change for blind users
      AccessibilityInfo.announceForAccessibility(`Switched to ${breathingMethods[index].name} breathing exercise`);
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
      setIsActive(false);
      setCurrentPhaseIndex(0);
      setCompletedCycles(0);
      scaleAnim.setValue(1);
    }
  }).current;

  const renderMethod = ({ item, index }) => (
    <View style={[styles.methodContainer, { width }]}>
      <View 
        style={styles.header}
        accessible={true}
        accessibilityRole="header"
        accessibilityLabel={`${item.name} breathing exercise. ${item.subtitle}. ${item.description}`}
      >
        <Text 
          style={[styles.methodName, { color: theme.text }]}
          accessibilityElementsHidden={true}
        >
          {item.name}
        </Text>
        <Text 
          style={[styles.subtitle, { color: theme.textSecondary }]}
          accessibilityElementsHidden={true}
        >
          {item.subtitle}
        </Text>
        <Text 
          style={[styles.description, { color: theme.textSecondary }]}
          accessibilityElementsHidden={true}
        >
          {item.description}
        </Text>
      </View>

      <View style={styles.circleContainer}>
        <Animated.View
          style={[
            styles.breathingCircle,
            {
              backgroundColor: item.color,
              transform: [{ scale: scaleAnim }],
            },
          ]}
          accessible={true}
          accessibilityLabel={isActive ? `${currentPhase.phase}, ${countdown} seconds remaining` : `${item.name} breathing circle, ready to start`}
          accessibilityHint={isActive ? currentPhase.instruction : `Tap start button to begin ${item.name} breathing exercise`}
          accessibilityLiveRegion="polite"
          accessibilityValue={{ text: isActive ? `${countdown}` : undefined }}
          importantForAccessibility="yes"
        >
          <Text 
            style={styles.phaseText}
            accessibilityElementsHidden={true}
            importantForAccessibility="no"
          >
            {isActive ? currentPhase.phase : 'Ready'}
          </Text>
          {isActive && (
            <Text 
              style={styles.countdownText}
              accessibilityElementsHidden={true}
              importantForAccessibility="no"
            >
              {countdown}
            </Text>
          )}
        </Animated.View>
      </View>

      <View 
        style={styles.infoContainer}
        accessible={true}
        accessibilityRole="text"
        accessibilityLabel={`
          ${isActive ? `Current instruction: ${currentPhase.instruction}. ` : ''}
          Breathing pattern: ${item.pattern.map(phase => `${phase.phase} for ${phase.duration} seconds`).join(', then ')}.
          ${isActive || completedCycles > 0 ? ` You have completed ${completedCycles} breathing cycles.` : ''}
        `}
        accessibilityLiveRegion="polite"
      >
        <View style={styles.instructionContainer}>
          <Text 
            style={[styles.instruction, { color: theme.textSecondary }]}
            accessibilityElementsHidden={true}
          >
            {isActive ? currentPhase.instruction : ' '}
          </Text>
        </View>

        <View style={styles.patternContainer}>
          {item.pattern.map((phase, idx) => (
            <Text 
              key={idx} 
              style={[styles.patternText, { color: theme.textTertiary }]}
              accessibilityElementsHidden={true}
            >
              {phase.phase} {phase.duration}s
              {idx < item.pattern.length - 1 ? ' • ' : ''}
            </Text>
          ))}
        </View>

        <View style={styles.cyclesContainer}>
          <Text 
            style={styles.cyclesText}
            accessibilityElementsHidden={true}
          >
            {isActive || completedCycles > 0 ? `Cycles completed: ${completedCycles}` : ' '}
          </Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, isActive && styles.buttonActive]}
          onPress={toggleActive}
          accessibilityLabel={`${isActive ? 'Stop' : 'Start'} ${item.name} breathing exercise. Method ${index + 1} of ${breathingMethods.length}.`}
          accessibilityRole="button"
          accessibilityHint={`Double tap to ${isActive ? 'stop' : 'start'}. ${index > 0 ? 'Swipe up for previous method. ' : ''}${index < breathingMethods.length - 1 ? 'Swipe down for next method.' : ''}`}
          accessibilityActions={[
            { name: 'activate', label: isActive ? 'Stop breathing exercise' : 'Start breathing exercise' },
            ...(index > 0 ? [{ name: 'decrement', label: `Previous method: ${breathingMethods[index - 1].name}` }] : []),
            ...(index < breathingMethods.length - 1 ? [{ name: 'increment', label: `Next method: ${breathingMethods[index + 1].name}` }] : [])
          ]}
          onAccessibilityAction={(event) => {
            switch (event.nativeEvent.actionName) {
              case 'activate':
                toggleActive();
                break;
              case 'increment':
                navigateToMethod(index + 1);
                break;
              case 'decrement':
                navigateToMethod(index - 1);
                break;
            }
          }}
        >
          <Ionicons name={isActive ? 'pause' : 'play'} size={24} color="white" />
          <Text style={styles.buttonText}>{isActive ? 'Pause' : 'Start'}</Text>
        </TouchableOpacity>
      </View>

      <Text 
        style={[styles.swipeHint, { color: theme.textSecondary }]}
        accessible={false}
        importantForAccessibility="no"
      >
        {index > 0 ? '← ' : ''}
        Swipe to change method
        {index < breathingMethods.length - 1 ? ' →' : ''}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        ref={flatListRef}
        data={breathingMethods}
        renderItem={renderMethod}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        accessible={false}
        accessibilityElementsHidden={false}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />
      
      <SafeAreaView style={styles.headerBar} edges={['top']}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={32} color="#2E8B57" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </SafeAreaView>

      <View 
        style={styles.pagination}
        accessible={true}
        accessibilityRole="text"
        accessibilityLabel={`Page ${currentIndex + 1} of ${breathingMethods.length}. Current method: ${currentMethod.name}. Use accessibility actions on the start button to navigate between methods.`}
        importantForAccessibility="no-hide-descendants"
      >
        {breathingMethods.map((method, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex && styles.dotActive,
              { backgroundColor: index === currentIndex ? currentMethod.color : '#ccc' }
            ]}
            accessible={false}
            importantForAccessibility="no"
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 8,
    paddingVertical: 8,
    zIndex: 10,
    height: 100,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    minWidth: 44,
    minHeight: 44,
  },
  backText: {
    fontSize: 17,
    color: '#2E8B57',
    marginLeft: 4,
  },
  methodContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 110,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  methodName: {
    fontSize: 28,
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
    marginBottom: 4,
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 17,
    marginBottom: 12,
    fontWeight: '400',
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 22,
  },
  circleContainer: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
  },
  breathingCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  phaseText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
    textAlign: 'center',
  },
  countdownText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  instructionContainer: {
    height: 44,
    justifyContent: 'center',
    marginBottom: 20,
  },
  instruction: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  patternContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 15,
  },
  patternText: {
    fontSize: 14,
  },
  cyclesContainer: {
    height: 24,
    justifyContent: 'center',
    marginBottom: 15,
  },
  cyclesText: {
    fontSize: 14,
    color: '#2E8B57',
    fontWeight: '600',
    textAlign: 'center',
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  controls: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E8B57',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    minHeight: 50,
    minWidth: 120,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonActive: {
    backgroundColor: '#E74C3C',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  swipeHint: {
    fontSize: 13,
    marginTop: 20,
    marginBottom: 20,
    fontWeight: '400',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 30,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  dotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
