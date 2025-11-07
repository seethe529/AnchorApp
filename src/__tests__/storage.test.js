import { storage, STORAGE_KEYS } from '../utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('Storage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should set item in storage', async () => {
    await storage.setItem('test-key', { data: 'test' });
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  test('should get item from storage', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify({ data: 'test' }));
    const result = await storage.getItem('test-key');
    expect(result).toEqual({ data: 'test' });
  });

  test('should remove item from storage', async () => {
    await storage.removeItem('test-key');
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('test-key');
  });

  test('should have all storage keys defined', () => {
    expect(STORAGE_KEYS.MOOD_LOGS).toBeDefined();
    expect(STORAGE_KEYS.SAFETY_PLAN).toBeDefined();
    expect(STORAGE_KEYS.TECHNIQUE_USAGE).toBeDefined();
  });
});
