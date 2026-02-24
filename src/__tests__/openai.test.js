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
  let originalDateNow;

  beforeAll(() => {
    originalDateNow = Date.now;
  });

  afterAll(() => {
    Date.now = originalDateNow;
  });
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock storage to allow daily limit checks to pass
    storage.getItem.mockImplementation((key) => {
      if (key === 'daily_usage') {
        return Promise.resolve({ date: new Date().toDateString(), count: 0 });
      }
      return Promise.resolve(null);
    });
    storage.setItem.mockResolvedValue(undefined);
    
    // Mock successful fetch by default
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'AI response' })
    });
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

  test('should include last 16 messages in context window', async () => {
    const conversationHistory = Array.from({ length: 20 }, (_, i) => ({
      type: i % 2 === 0 ? 'user' : 'ai',
      text: `Message ${i + 1}`
    }));

    await sendMessageToOpenAI('New message', conversationHistory);

    expect(fetch).toHaveBeenCalled();
    const lastCall = fetch.mock.calls[fetch.mock.calls.length - 1];
    const requestBody = JSON.parse(lastCall[1].body);
    const messages = requestBody.messages;

    // Should have: system prompt + last 16 messages + new message = 18 total
    expect(messages.length).toBe(18);
    expect(messages[0].role).toBe('system');
    expect(messages[messages.length - 1].content).toBe('New message');
    
    // First conversation message should be Message 5 (skipping first 4 messages)
    expect(messages[1].content).toBe('Message 5');
  });

  test('should handle conversation history shorter than 16 messages', async () => {
    const shortHistory = [
      { type: 'user', text: 'Message 1' },
      { type: 'ai', text: 'Response 1' },
      { type: 'user', text: 'Message 2' },
      { type: 'ai', text: 'Response 2' },
    ];

    await sendMessageToOpenAI('New message', shortHistory);

    const lastCall = fetch.mock.calls[fetch.mock.calls.length - 1];
    const requestBody = JSON.parse(lastCall[1].body);
    const messages = requestBody.messages;

    // Should have: system prompt + 4 history messages + new message = 6 total
    expect(messages.length).toBe(6);
    expect(messages[0].role).toBe('system');
    expect(messages[1].content).toBe('Message 1');
    expect(messages[messages.length - 1].content).toBe('New message');
  });

  test('should handle empty conversation history', async () => {
    await sendMessageToOpenAI('First message', []);

    const lastCall = fetch.mock.calls[fetch.mock.calls.length - 1];
    const requestBody = JSON.parse(lastCall[1].body);
    const messages = requestBody.messages;

    // Should have: system prompt + new message = 2 total
    expect(messages.length).toBe(2);
    expect(messages[0].role).toBe('system');
    expect(messages[1].content).toBe('First message');
    expect(messages[1].role).toBe('user');
  });

  test('should correctly map user and AI message types to roles', async () => {
    const history = [
      { type: 'user', text: 'User message' },
      { type: 'ai', text: 'AI message' },
    ];

    await sendMessageToOpenAI('New message', history);

    const lastCall = fetch.mock.calls[fetch.mock.calls.length - 1];
    const requestBody = JSON.parse(lastCall[1].body);
    const messages = requestBody.messages;

    expect(messages[1].role).toBe('user');
    expect(messages[1].content).toBe('User message');
    expect(messages[2].role).toBe('assistant');
    expect(messages[2].content).toBe('AI message');
  });
});
