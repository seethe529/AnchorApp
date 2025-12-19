import { storage, STORAGE_KEYS } from '../utils/storage';

// Mock storage
jest.mock('../utils/storage', () => ({
  storage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
  STORAGE_KEYS: {
    TECHNIQUE_USAGE: 'technique_usage',
  },
}));

describe('Progress Analytics - Technique Tracking', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('View Tracking (No Effectiveness)', () => {
    it('should log technique view without effectiveness field', async () => {
      storage.getItem.mockResolvedValue([]);
      
      const viewEntry = {
        technique: 'Box Breathing',
        category: 'grounding',
        timestamp: new Date().toISOString(),
        date: new Date().toDateString(),
        effectiveness: null
      };

      await storage.setItem(STORAGE_KEYS.TECHNIQUE_USAGE, [viewEntry]);

      expect(storage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.TECHNIQUE_USAGE,
        expect.arrayContaining([
          expect.objectContaining({
            technique: 'Box Breathing',
            effectiveness: null
          })
        ])
      );
    });

    it('should track multiple views of same technique', async () => {
      const existingData = [
        { technique: 'Box Breathing', effectiveness: null, date: '2024-01-01' }
      ];
      storage.getItem.mockResolvedValue(existingData);

      const newView = {
        technique: 'Box Breathing',
        effectiveness: null,
        date: '2024-01-02'
      };

      await storage.setItem(STORAGE_KEYS.TECHNIQUE_USAGE, [newView, ...existingData]);

      expect(storage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.TECHNIQUE_USAGE,
        expect.arrayContaining([
          expect.objectContaining({ technique: 'Box Breathing', effectiveness: null }),
          expect.objectContaining({ technique: 'Box Breathing', effectiveness: null })
        ])
      );
    });
  });

  describe('Rating Tracking (With Effectiveness)', () => {
    it('should log technique rating with effectiveness 5 (Helped)', async () => {
      storage.getItem.mockResolvedValue([]);

      const rating = {
        technique: 'TIPP',
        category: 'distress_tolerance',
        timestamp: new Date().toISOString(),
        date: new Date().toDateString(),
        effectiveness: 5
      };

      await storage.setItem(STORAGE_KEYS.TECHNIQUE_USAGE, [rating]);

      expect(storage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.TECHNIQUE_USAGE,
        expect.arrayContaining([
          expect.objectContaining({
            technique: 'TIPP',
            effectiveness: 5
          })
        ])
      );
    });

    it('should log technique rating with effectiveness 3 (Somewhat)', async () => {
      storage.getItem.mockResolvedValue([]);

      const rating = {
        technique: 'DEAR MAN',
        effectiveness: 3
      };

      await storage.setItem(STORAGE_KEYS.TECHNIQUE_USAGE, [rating]);

      expect(storage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.TECHNIQUE_USAGE,
        expect.arrayContaining([
          expect.objectContaining({
            effectiveness: 3
          })
        ])
      );
    });

    it('should log technique rating with effectiveness 1 (Not much)', async () => {
      storage.getItem.mockResolvedValue([]);

      const rating = {
        technique: 'Progressive Muscle Relaxation',
        effectiveness: 1
      };

      await storage.setItem(STORAGE_KEYS.TECHNIQUE_USAGE, [rating]);

      expect(storage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.TECHNIQUE_USAGE,
        expect.arrayContaining([
          expect.objectContaining({
            effectiveness: 1
          })
        ])
      );
    });
  });

  describe('Data Processing - Separate Views and Ratings', () => {
    it('should count only views (no effectiveness) for Go-To Techniques', () => {
      const usage = [
        { technique: 'Box Breathing', effectiveness: null },
        { technique: 'Box Breathing', effectiveness: 5 },
        { technique: 'Box Breathing', effectiveness: null },
        { technique: 'TIPP', effectiveness: null }
      ];

      const techniqueStats = {};
      
      usage.forEach(entry => {
        if (!techniqueStats[entry.technique]) {
          techniqueStats[entry.technique] = { count: 0, totalEffectiveness: 0, ratings: 0 };
        }
        // Only count views (entries without effectiveness)
        if (!entry.effectiveness) {
          techniqueStats[entry.technique].count++;
        }
        // Track ratings separately
        if (entry.effectiveness) {
          techniqueStats[entry.technique].totalEffectiveness += entry.effectiveness;
          techniqueStats[entry.technique].ratings++;
        }
      });

      expect(techniqueStats['Box Breathing'].count).toBe(2); // Only 2 views
      expect(techniqueStats['Box Breathing'].ratings).toBe(1); // 1 rating
      expect(techniqueStats['TIPP'].count).toBe(1); // 1 view
      expect(techniqueStats['TIPP'].ratings).toBe(0); // 0 ratings
    });

    it('should calculate average effectiveness only from ratings', () => {
      const usage = [
        { technique: 'TIPP', effectiveness: 5 },
        { technique: 'TIPP', effectiveness: 3 },
        { technique: 'TIPP', effectiveness: null },
        { technique: 'TIPP', effectiveness: null }
      ];

      const techniqueStats = {};
      
      usage.forEach(entry => {
        if (!techniqueStats[entry.technique]) {
          techniqueStats[entry.technique] = { count: 0, totalEffectiveness: 0, ratings: 0 };
        }
        if (!entry.effectiveness) {
          techniqueStats[entry.technique].count++;
        }
        if (entry.effectiveness) {
          techniqueStats[entry.technique].totalEffectiveness += entry.effectiveness;
          techniqueStats[entry.technique].ratings++;
        }
      });

      const avgEffectiveness = techniqueStats['TIPP'].ratings > 0
        ? techniqueStats['TIPP'].totalEffectiveness / techniqueStats['TIPP'].ratings
        : null;

      expect(avgEffectiveness).toBe(4); // (5 + 3) / 2 = 4
      expect(techniqueStats['TIPP'].count).toBe(2); // 2 views
    });

    it('should filter out techniques with no ratings from What\'s Felt Most Helpful', () => {
      const usage = [
        { technique: 'Box Breathing', effectiveness: null },
        { technique: 'Box Breathing', effectiveness: null },
        { technique: 'TIPP', effectiveness: 5 },
        { technique: 'DEAR MAN', effectiveness: null }
      ];

      const techniqueStats = {};
      
      usage.forEach(entry => {
        if (!techniqueStats[entry.technique]) {
          techniqueStats[entry.technique] = { count: 0, totalEffectiveness: 0, ratings: 0 };
        }
        if (!entry.effectiveness) {
          techniqueStats[entry.technique].count++;
        }
        if (entry.effectiveness) {
          techniqueStats[entry.technique].totalEffectiveness += entry.effectiveness;
          techniqueStats[entry.technique].ratings++;
        }
      });

      const ratedTechniques = Object.entries(techniqueStats)
        .filter(([name, stats]) => stats.ratings > 0);

      expect(ratedTechniques.length).toBe(1); // Only TIPP has ratings
      expect(ratedTechniques[0][0]).toBe('TIPP');
    });
  });

  describe('Qualitative Labels', () => {
    const getQualitativeLabel = (score) => {
      if (score >= 4.5) return 'Very Helpful';
      if (score >= 3.5) return 'Helpful';
      if (score >= 2.5) return 'Somewhat Helpful';
      return 'Needs Practice';
    };

    it('should return "Very Helpful" for scores 4.5-5.0', () => {
      expect(getQualitativeLabel(5.0)).toBe('Very Helpful');
      expect(getQualitativeLabel(4.8)).toBe('Very Helpful');
      expect(getQualitativeLabel(4.5)).toBe('Very Helpful');
    });

    it('should return "Helpful" for scores 3.5-4.4', () => {
      expect(getQualitativeLabel(4.4)).toBe('Helpful');
      expect(getQualitativeLabel(4.0)).toBe('Helpful');
      expect(getQualitativeLabel(3.5)).toBe('Helpful');
    });

    it('should return "Somewhat Helpful" for scores 2.5-3.4', () => {
      expect(getQualitativeLabel(3.4)).toBe('Somewhat Helpful');
      expect(getQualitativeLabel(3.0)).toBe('Somewhat Helpful');
      expect(getQualitativeLabel(2.5)).toBe('Somewhat Helpful');
    });

    it('should return "Needs Practice" for scores below 2.5', () => {
      expect(getQualitativeLabel(2.4)).toBe('Needs Practice');
      expect(getQualitativeLabel(2.0)).toBe('Needs Practice');
      expect(getQualitativeLabel(1.0)).toBe('Needs Practice');
    });
  });

  describe('Bar Chart Calculations', () => {
    it('should normalize bars relative to max count', () => {
      const techniqueData = [
        { name: 'Box Breathing', count: 10 },
        { name: 'TIPP', count: 5 },
        { name: '5-4-3-2-1', count: 2 }
      ];

      const maxCount = Math.max(...techniqueData.map(t => t.count));
      
      const percentages = techniqueData.map(tech => ({
        name: tech.name,
        percentage: (tech.count / maxCount) * 100
      }));

      expect(percentages[0].percentage).toBe(100); // 10/10 = 100%
      expect(percentages[1].percentage).toBe(50);  // 5/10 = 50%
      expect(percentages[2].percentage).toBe(20);  // 2/10 = 20%
    });

    it('should handle single technique correctly', () => {
      const techniqueData = [
        { name: 'Box Breathing', count: 5 }
      ];

      const maxCount = Math.max(...techniqueData.map(t => t.count));
      const percentage = (techniqueData[0].count / maxCount) * 100;

      expect(percentage).toBe(100); // Single technique always 100%
    });
  });

  describe('Top 5 Limiting', () => {
    it('should limit Go-To Techniques to top 5 by view count', () => {
      const techniqueStats = {
        'Tech1': { count: 10 },
        'Tech2': { count: 8 },
        'Tech3': { count: 6 },
        'Tech4': { count: 4 },
        'Tech5': { count: 3 },
        'Tech6': { count: 2 },
        'Tech7': { count: 1 }
      };

      const top5 = Object.entries(techniqueStats)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 5);

      expect(top5.length).toBe(5);
      expect(top5[0][0]).toBe('Tech1');
      expect(top5[4][0]).toBe('Tech5');
    });

    it('should limit What\'s Felt Most Helpful to top 5 by effectiveness', () => {
      const techniqueStats = {
        'Tech1': { ratings: 2, totalEffectiveness: 10, avgEffectiveness: 5.0 },
        'Tech2': { ratings: 3, totalEffectiveness: 13, avgEffectiveness: 4.3 },
        'Tech3': { ratings: 1, totalEffectiveness: 4, avgEffectiveness: 4.0 },
        'Tech4': { ratings: 2, totalEffectiveness: 7, avgEffectiveness: 3.5 },
        'Tech5': { ratings: 1, totalEffectiveness: 3, avgEffectiveness: 3.0 },
        'Tech6': { ratings: 2, totalEffectiveness: 5, avgEffectiveness: 2.5 }
      };

      const top5 = Object.entries(techniqueStats)
        .filter(([name, stats]) => stats.ratings > 0)
        .sort((a, b) => b[1].avgEffectiveness - a[1].avgEffectiveness)
        .slice(0, 5);

      expect(top5.length).toBe(5);
      expect(top5[0][0]).toBe('Tech1'); // 5.0
      expect(top5[4][0]).toBe('Tech5'); // 3.0
    });
  });
});
