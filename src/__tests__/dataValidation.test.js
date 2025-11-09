import { 
  validateMoodEntry, 
  validateTechniqueUsage, 
  sanitizeText,
  validatePreferences 
} from '../utils/dataValidation';

describe('Data Validation', () => {
  describe('validateMoodEntry', () => {
    test('should validate correct mood entry', () => {
      const validEntry = {
        mood: 3,
        moodName: 'Okay',
        date: new Date().toDateString(),
        timestamp: new Date().toISOString(),
        notes: 'Feeling okay today'
      };
      expect(validateMoodEntry(validEntry)).toBe(true);
    });

    test('should reject invalid mood value', () => {
      const invalidEntry = {
        mood: 6,
        moodName: 'Invalid',
        date: new Date().toDateString(),
        timestamp: new Date().toISOString()
      };
      expect(validateMoodEntry(invalidEntry)).toBe(false);
    });

    test('should reject missing required fields', () => {
      const invalidEntry = {
        mood: 3
      };
      expect(validateMoodEntry(invalidEntry)).toBe(false);
    });
  });

  describe('validateTechniqueUsage', () => {
    test('should validate correct technique usage', () => {
      const validUsage = {
        technique: '5-4-3-2-1',
        category: 'grounding',
        date: new Date().toDateString(),
        timestamp: new Date().toISOString(),
        effectiveness: 5
      };
      expect(validateTechniqueUsage(validUsage)).toBe(true);
    });

    test('should reject invalid effectiveness rating', () => {
      const invalidUsage = {
        technique: '5-4-3-2-1',
        category: 'grounding',
        date: new Date().toDateString(),
        timestamp: new Date().toISOString(),
        effectiveness: 10
      };
      expect(validateTechniqueUsage(invalidUsage)).toBe(false);
    });
  });

  describe('sanitizeText', () => {
    test('should trim whitespace', () => {
      expect(sanitizeText('  hello  ')).toBe('hello');
    });

    test('should limit length', () => {
      const longText = 'a'.repeat(1000);
      expect(sanitizeText(longText, 100).length).toBe(100);
    });

    test('should handle empty input', () => {
      expect(sanitizeText('')).toBe('');
      expect(sanitizeText(null)).toBe('');
    });
  });

  describe('validatePreferences', () => {
    test('should validate correct preferences', () => {
      const validPrefs = {
        darkMode: false,
        notifications: true,
        moodReminders: true
      };
      expect(validatePreferences(validPrefs)).toBe(true);
    });

    test('should reject non-boolean values', () => {
      const invalidPrefs = {
        darkMode: 'yes',
        notifications: true
      };
      expect(validatePreferences(invalidPrefs)).toBe(false);
    });
  });
});
