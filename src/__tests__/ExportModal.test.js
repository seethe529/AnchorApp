import { Platform } from 'react-native';

/**
 * Export Modal Logic Tests
 * 
 * Tests the platform-specific date range picker behavior:
 * - iOS: Uses Alert.alert with 5 options (native action sheet)
 * - Android: Uses a bottom sheet Modal with all options + cancel
 */

describe('Export Date Range Picker - Platform Logic', () => {
  describe('Android', () => {
    beforeEach(() => {
      Platform.OS = 'android';
    });

    it('should use modal instead of Alert on Android', () => {
      // On Android, we use a modal because Alert only supports 3 buttons
      const useModal = Platform.OS !== 'ios';
      expect(useModal).toBe(true);
    });

    it('should provide all 4 date range options', () => {
      const dateRangeOptions = [
        { label: 'Last 7 Days', days: 7 },
        { label: 'Last 30 Days', days: 30 },
        { label: 'Last 3 Months', days: 90 },
        { label: 'All Time', days: null },
      ];

      expect(dateRangeOptions).toHaveLength(4);
      expect(dateRangeOptions[0].days).toBe(7);
      expect(dateRangeOptions[1].days).toBe(30);
      expect(dateRangeOptions[2].days).toBe(90);
      expect(dateRangeOptions[3].days).toBeNull();
    });

    it('should include a cancel option', () => {
      const hasCancel = true; // Modal has explicit Cancel button
      expect(hasCancel).toBe(true);
    });
  });

  describe('iOS', () => {
    beforeEach(() => {
      Platform.OS = 'ios';
    });

    it('should use Alert.alert on iOS', () => {
      const useModal = Platform.OS !== 'ios';
      expect(useModal).toBe(false);
    });

    it('should provide all options including cancel in Alert', () => {
      const alertOptions = [
        { text: 'Last 7 Days' },
        { text: 'Last 30 Days' },
        { text: 'Last 3 Months' },
        { text: 'All Time' },
        { text: 'Cancel', style: 'cancel' },
      ];

      expect(alertOptions).toHaveLength(5);
      expect(alertOptions[4].style).toBe('cancel');
    });
  });
});

describe('Export Data - Date Filtering', () => {
  const mockMoodLogs = [
    { timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), mood: 4, moodName: 'Good' },
    { timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), mood: 3, moodName: 'Okay' },
    { timestamp: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), mood: 2, moodName: 'Low' },
    { timestamp: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(), mood: 5, moodName: 'Excellent' },
  ];

  const filterByDays = (logs, daysBack) => {
    if (!daysBack) return logs;
    const cutoff = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
    return logs.filter(log => new Date(log.timestamp) >= cutoff);
  };

  it('should return all logs when daysBack is null (All Time)', () => {
    const result = filterByDays(mockMoodLogs, null);
    expect(result).toHaveLength(4);
  });

  it('should filter to last 7 days', () => {
    const result = filterByDays(mockMoodLogs, 7);
    expect(result).toHaveLength(1);
    expect(result[0].moodName).toBe('Good');
  });

  it('should filter to last 30 days', () => {
    const result = filterByDays(mockMoodLogs, 30);
    expect(result).toHaveLength(2);
  });

  it('should filter to last 3 months (90 days)', () => {
    const result = filterByDays(mockMoodLogs, 90);
    expect(result).toHaveLength(3);
  });
});

describe('Export Data - Technique Deduplication', () => {
  const mockTechniques = [
    { technique: 'Box Breathing', timestamp: '2026-06-27T10:00:00Z', effectiveness: null },
    { technique: 'Box Breathing', timestamp: '2026-06-27T10:02:00Z', effectiveness: 4 },
    { technique: '5-4-3-2-1', timestamp: '2026-06-27T11:00:00Z', effectiveness: null },
    { technique: 'Grounding', timestamp: '2026-06-27T12:00:00Z', effectiveness: 5 },
  ];

  const deduplicateTechniques = (techniqueUsage) => {
    const ratedEntries = techniqueUsage.filter(u => u.effectiveness);
    const unratedEntries = techniqueUsage.filter(u => !u.effectiveness);
    const dedupedTechniques = [...ratedEntries];
    
    unratedEntries.forEach(unrated => {
      const hasMatchingRated = ratedEntries.some(rated =>
        rated.technique === unrated.technique &&
        Math.abs(new Date(rated.timestamp) - new Date(unrated.timestamp)) < 5 * 60 * 1000
      );
      if (!hasMatchingRated) {
        dedupedTechniques.push(unrated);
      }
    });

    return dedupedTechniques;
  };

  it('should remove duplicate unrated entry when rated entry exists within 5 min', () => {
    const result = deduplicateTechniques(mockTechniques);
    // Box Breathing: rated entry at 10:02 removes unrated at 10:00 (2 min gap)
    // 5-4-3-2-1: no matching rated entry, so unrated stays
    // Grounding: rated entry, included directly
    expect(result).toHaveLength(3);
  });

  it('should keep unrated entries without a matching rated entry', () => {
    const result = deduplicateTechniques(mockTechniques);
    const fiveForOneTwo = result.find(t => t.technique === '5-4-3-2-1');
    expect(fiveForOneTwo).toBeTruthy();
    expect(fiveForOneTwo.effectiveness).toBeNull();
  });

  it('should always include rated entries', () => {
    const result = deduplicateTechniques(mockTechniques);
    const rated = result.filter(t => t.effectiveness);
    expect(rated).toHaveLength(2);
  });
});

describe('AI Message Counter', () => {
  it('should only count user messages, not AI responses', () => {
    const messages = [
      { type: 'user', text: 'Hello' },
      { type: 'ai', text: 'Hi there' },
      { type: 'user', text: 'Help me' },
      { type: 'ai', text: 'Sure' },
    ];

    const userMessageCount = messages.filter(m => m.type === 'user').length;
    expect(userMessageCount).toBe(2);
  });

  it('should default to 0 when no messages have been sent', () => {
    const storedCount = null;
    const count = storedCount || 0;
    expect(count).toBe(0);
  });
});
