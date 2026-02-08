import { sendMessageToOpenAI } from '../services/openai';
import { storage } from '../utils/storage';

global.fetch = jest.fn();

jest.mock('../utils/storage', () => ({
  storage: {
    getItem: jest.fn(),
    setItem: jest.fn()
  }
}));

jest.mock('expo-device', () => ({
  modelName: 'iPhone',
  osVersion: '17.0'
}));

describe('OpenAI Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    storage.getItem.mockResolvedValue(null);
    storage.setItem.mockResolvedValue(undefined);
  });

  test('should send message to Vercel backend', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: 'AI response from Vercel'
      })
    });

    const response = await sendMessageToOpenAI('test message', []);
    expect(response).toBe('AI response from Vercel');
    expect(fetch).toHaveBeenCalledWith(
      'https://anchor-hdhkcdg9l-ryans-projects-1d0e75af.vercel.app/api/chat',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'X-Device-ID': expect.any(String)
        })
      })
    );
  });

  test('should return fallback message on error', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    const response = await sendMessageToOpenAI('test message', []);
    expect(response).toContain('having trouble');
  });

  test('should handle rate limiting', async () => {
    // Send 6 messages quickly to trigger rate limit
    for (let i = 0; i < 6; i++) {
      await sendMessageToOpenAI('test', []);
    }
    
    const response = await sendMessageToOpenAI('test', []);
    expect(response).toContain('sending messages too quickly');
  });
});
