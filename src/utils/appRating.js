import * as StoreReview from 'expo-store-review';
import { storage } from './storage';

const RATING_KEYS = {
  MOOD_LOGS_COUNT: 'rating_mood_logs',
  TECHNIQUES_USED: 'rating_techniques_used',
  RATING_PROMPTED: 'rating_prompted',
  RATING_GIVEN: 'rating_given'
};

const THRESHOLDS = {
  MOOD_LOGS: 5,
  TECHNIQUES_USED: 3
};

export const trackMoodLog = async () => {
  try {
    const count = await storage.getItem(RATING_KEYS.MOOD_LOGS_COUNT) || 0;
    await storage.setItem(RATING_KEYS.MOOD_LOGS_COUNT, count + 1);
    await checkAndPromptRating();
  } catch (error) {
    console.error('Error tracking mood log:', error);
  }
};

export const trackTechniqueUsed = async () => {
  try {
    const count = await storage.getItem(RATING_KEYS.TECHNIQUES_USED) || 0;
    await storage.setItem(RATING_KEYS.TECHNIQUES_USED, count + 1);
    await checkAndPromptRating();
  } catch (error) {
    console.error('Error tracking technique:', error);
  }
};

const checkAndPromptRating = async () => {
  try {
    const hasPrompted = await storage.getItem(RATING_KEYS.RATING_PROMPTED);
    const hasGivenRating = await storage.getItem(RATING_KEYS.RATING_GIVEN);
    
    if (hasPrompted || hasGivenRating) return;
    
    const moodLogs = await storage.getItem(RATING_KEYS.MOOD_LOGS_COUNT) || 0;
    const techniques = await storage.getItem(RATING_KEYS.TECHNIQUES_USED) || 0;
    
    if (moodLogs >= THRESHOLDS.MOOD_LOGS && techniques >= THRESHOLDS.TECHNIQUES_USED) {
      const isAvailable = await StoreReview.isAvailableAsync();
      if (isAvailable) {
        await StoreReview.requestReview();
        await storage.setItem(RATING_KEYS.RATING_PROMPTED, true);
      }
    }
  } catch (error) {
    console.error('Error checking rating prompt:', error);
  }
};
