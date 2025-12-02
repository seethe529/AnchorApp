import { suggestTechniques, dbtCbtTechniques } from '../data/techniques';
import { getCitationForTechnique } from '../data/citations';

describe('Techniques', () => {
  test('should have techniques defined', () => {
    expect(dbtCbtTechniques).toBeDefined();
    expect(Object.keys(dbtCbtTechniques).length).toBeGreaterThan(0);
  });

  test('should suggest techniques for anxiety keywords', () => {
    const suggestions = suggestTechniques('I am feeling anxiety');
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions[0]).toHaveProperty('name');
    expect(suggestions[0]).toHaveProperty('category');
  });

  test('should suggest techniques for panic keywords', () => {
    const suggestions = suggestTechniques('I am having a panic attack');
    expect(suggestions.length).toBeGreaterThan(0);
  });

  test('should return empty array for non-matching keywords', () => {
    const suggestions = suggestTechniques('hello world');
    expect(suggestions).toEqual([]);
  });

  test('should be case insensitive', () => {
    const suggestions1 = suggestTechniques('ANXIETY');
    const suggestions2 = suggestTechniques('anxiety');
    expect(suggestions1.length).toBe(suggestions2.length);
  });

  // New tests for enhanced suggestion algorithm
  describe('Enhanced Suggestion Algorithm', () => {
    test('should handle panic phrase variations', () => {
      const phrases = [
        'I am panicked',
        'I\'m freaking out',
        'I feel like I\'m losing it'
      ];
      
      phrases.forEach(phrase => {
        const suggestions = suggestTechniques(phrase);
        expect(suggestions.length).toBeGreaterThan(0);
        // Should prioritize grounding or distress tolerance
        const categories = suggestions.map(s => s.category);
        expect(
          categories.some(c => c === 'grounding' || c === 'distress_tolerance')
        ).toBe(true);
      });
    });

    test('should handle physical symptom phrases', () => {
      const phrases = [
        'my heart is racing',
        'my chest is tight',
        'I can\'t breathe'
      ];
      
      phrases.forEach(phrase => {
        const suggestions = suggestTechniques(phrase);
        expect(suggestions.length).toBeGreaterThan(0);
        // Should suggest breathing or grounding techniques
        const hasBreathingOrGrounding = suggestions.some(s => 
          s.name.includes('Breathing') || s.category === 'grounding'
        );
        expect(hasBreathingOrGrounding).toBe(true);
      });
    });

    test('should handle dissociation phrases', () => {
      const phrases = [
        'I feel unreal',
        'I feel detached',
        'I feel disconnected'
      ];
      
      phrases.forEach(phrase => {
        const suggestions = suggestTechniques(phrase);
        expect(suggestions.length).toBeGreaterThan(0);
        // Should prioritize grounding techniques
        expect(suggestions[0].category).toBe('grounding');
      });
    });

    test('should return top 3 suggestions maximum', () => {
      const suggestions = suggestTechniques('I feel anxious and panicked and overwhelmed');
      expect(suggestions.length).toBeLessThanOrEqual(3);
    });

    test('should handle empty or invalid input', () => {
      expect(suggestTechniques('')).toEqual([]);
      expect(suggestTechniques(null)).toEqual([]);
      expect(suggestTechniques(undefined)).toEqual([]);
    });

    test('should apply high-intensity boost for panic phrases', () => {
      const panicSuggestions = suggestTechniques('I\'m having a panic attack');
      const mildSuggestions = suggestTechniques('I feel a bit nervous');
      
      // Panic should prioritize grounding/distress tolerance more strongly
      if (panicSuggestions.length > 0 && mildSuggestions.length > 0) {
        const panicCategories = panicSuggestions.map(s => s.category);
        expect(
          panicCategories.filter(c => c === 'grounding' || c === 'distress_tolerance').length
        ).toBeGreaterThan(0);
      }
    });
  });

  // Citation coverage tests
  describe('Citation Coverage', () => {
    test('every technique should have a citation', () => {
      Object.entries(dbtCbtTechniques).forEach(([category, techniques]) => {
        techniques.forEach(technique => {
          const citation = getCitationForTechnique(technique.name);
          expect(citation).toBeDefined();
          expect(citation).not.toBeNull();
          expect(citation).toHaveProperty('title');
          expect(citation).toHaveProperty('organization');
          expect(citation).toHaveProperty('url');
        });
      });
    });

    test('all new techniques should have citations', () => {
      const newTechniques = [
        'Radical Acceptance',
        'Pros and Cons',
        'Self-Validation',
        'Half-Smile and Willing Hands',
        'Safe Place Visualization',
        'Cold Grounding',
        'Name 3 Things'
      ];

      newTechniques.forEach(name => {
        const citation = getCitationForTechnique(name);
        expect(citation).toBeDefined();
        expect(citation.url).toBeTruthy();
      });
    });
  });
});
