import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, designTokens } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const TOUR_SLIDES = [
  {
    icon: 'heart',
    title: 'Welcome to Anchor',
    description: 'Your personal PTSD support companion with evidence-based DBT/CBT techniques, mood tracking, and 24/7 AI support.',
    color: '#2E8B57'
  },
  {
    icon: 'construct',
    title: 'DBT/CBT Tools',
    description: 'Access 28 proven techniques for grounding, distress tolerance, emotion regulation, and mindfulness - all with medical citations.',
    color: '#4169E1'
  },
  {
    icon: 'analytics',
    title: 'Track Your Progress',
    description: 'Log your mood daily with our simple 5-point scale or detailed emotion model. Visualize your journey over time.',
    color: '#9370DB'
  },
  {
    icon: 'chatbubble-ellipses',
    title: 'AI Support Agent',
    description: 'Get personalized technique suggestions and support anytime. Powered by OpenAI for intelligent responses.',
    color: '#20B2AA'
  },
  {
    icon: 'shield-checkmark',
    title: 'Your Privacy Matters',
    description: 'Your mood logs, progress, and safety plan stay on your device. AI conversations are sent to OpenAI for responses but not stored by us.',
    color: '#2E8B57'
  }
];

export default function OnboardingTour({ onComplete, onSkip }) {
  const { theme } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < TOUR_SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  const slide = TOUR_SLIDES[currentSlide];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'bottom']}>
      <TouchableOpacity 
        style={styles.skipButton}
        onPress={handleSkip}
        accessibilityLabel="Skip tour"
        accessibilityRole="button"
      >
        <Text style={[styles.skipText, { color: theme.textSecondary }]}>Skip</Text>
      </TouchableOpacity>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.iconContainer, { backgroundColor: slide.color + '15' }]}>
          <Ionicons name={slide.icon} size={80} color={slide.color} />
        </View>

        <Text style={[styles.title, { color: theme.text }]}>{slide.title}</Text>
        <Text style={[styles.description, { color: theme.textSecondary }]}>{slide.description}</Text>

        <View style={styles.pagination}>
          {TOUR_SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: index === currentSlide ? theme.primary : theme.border,
                  width: index === currentSlide ? 24 : 8
                }
              ]}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleNext}
          accessibilityLabel={currentSlide === TOUR_SLIDES.length - 1 ? 'Get started' : 'Next'}
          accessibilityHint={currentSlide === TOUR_SLIDES.length - 1 ? 'Complete onboarding and start using Anchor' : 'Go to next slide'}
          accessibilityRole="button"
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[theme.primaryGradientTop, theme.primaryGradientBottom]}
            style={styles.nextButton}
          >
            <Text style={styles.nextButtonText}>
              {currentSlide === TOUR_SLIDES.length - 1 ? 'Get Started' : 'Next'}
            </Text>
            <Ionicons 
              name={currentSlide === TOUR_SLIDES.length - 1 ? 'checkmark' : 'arrow-forward'} 
              size={20} 
              color="white" 
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingTop: 100,
    paddingBottom: 140,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 40,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: designTokens.borderRadius.button,
    gap: 8,
    ...designTokens.shadows.button,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
