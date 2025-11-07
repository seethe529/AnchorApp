import { suggestTechniques, dbtCbtTechniques } from '../data/techniques';

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
});
