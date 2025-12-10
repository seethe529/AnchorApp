import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Platform, Alert, AccessibilityInfo } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { storage } from '../utils/storage';
import ErrorLogger from '../utils/errorLogger';
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

export default function OnboardingTour() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = async () => {
    try {
      if (currentSlide < TOUR_SLIDES.length - 1) {
        const nextSlide = currentSlide + 1;
        setCurrentSlide(nextSlide);
        // Announce slide change for screen readers
        AccessibilityInfo.announceForAccessibility(
          `Slide ${nextSlide + 1} of ${TOUR_SLIDES.length}. ${TOUR_SLIDES[nextSlide].title}`
        );
      } else {
        console.log('✅ [ONBOARDING] Completing onboarding');
        await storage.setItem('onboarding_completed', true);
        navigation.replace('MainApp');
      }
    } catch (error) {
      console.error('❌ [ONBOARDING] Error in handleNext:', error);
      ErrorLogger.log(error, 'OnboardingTour.handleNext');
      Alert.alert('Error', 'Failed to proceed. Please try again.');
    }
  };

  const handleSkip = async () => {
    try {
      console.log('⏭️ [ONBOARDING] Skipping onboarding');
      await storage.setItem('onboarding_completed', true);
      navigation.replace('MainApp');
    } catch (error) {
      console.error('❌ [ONBOARDING] Error in handleSkip:', error);
      ErrorLogger.log(error, 'OnboardingTour.handleSkip');
      Alert.alert('Error', 'Failed to skip onboarding. Please try again.');
    }
  };

  const slide = TOUR_SLIDES[currentSlide];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'bottom']}>
      <TouchableOpacity 
        style={styles.skipButton}
        onPress={handleSkip}
        accessibilityLabel="Skip onboarding tour"
        accessibilityHint="Skip the tour and go directly to the app"
        accessibilityRole="button"
        accessible={true}
      >
        <Text style={[styles.skipText, { color: theme.textSecondary }]}>Skip</Text>
      </TouchableOpacity>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View 
          style={[styles.iconContainer, { backgroundColor: slide.color + '15' }]}
          accessible={true}
          accessibilityLabel={`${slide.title} icon`}
          accessibilityRole="image"
        >
          <Ionicons name={slide.icon} size={80} color={slide.color} />
        </View>

        <Text 
          style={[styles.title, { color: theme.text }]}
          accessible={true}
          accessibilityRole="header"
        >
          {slide.title}
        </Text>
        <Text 
          style={[styles.description, { color: theme.textSecondary }]}
          accessible={true}
        >
          {slide.description}
        </Text>

        <View 
          style={styles.pagination}
          accessible={true}
          accessibilityLabel={`Slide ${currentSlide + 1} of ${TOUR_SLIDES.length}`}
          accessibilityRole="progressbar"
        >
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
              accessible={false}
            />
          ))}
        </View>
      </ScrollView>

      <SafeAreaView style={styles.footer} edges={['bottom']}>
        <TouchableOpacity
          onPress={handleNext}
          accessibilityLabel={currentSlide === TOUR_SLIDES.length - 1 ? 'Get started with Anchor' : `Next, slide ${currentSlide + 2} of ${TOUR_SLIDES.length}`}
          accessibilityHint={currentSlide === TOUR_SLIDES.length - 1 ? 'Complete onboarding and start using Anchor' : 'Go to next slide'}
          accessibilityRole="button"
          accessible={true}
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
      </SafeAreaView>
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
