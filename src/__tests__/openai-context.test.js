// Isolated tests for context window functionality
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

describe('OpenAI Context Window', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    storage.getItem.mockImplementation((key) => {
      if (key === 'daily_usage') {
        return Promise.resolve({ date: new Date().toDateString(), count: 0 });
      }
      if (key === 'device_id') {
        return Promise.resolve('test-device-id');
      }
      return Promise.resolve(null);
    });
    storage.setItem.mockResolvedValue(undefined);
    
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'AI response' })
    });
  });

  test('should include last 16 messages in context window', async () => {
    const conversationHistory = Array.from({ length: 20 }, (_, i) => ({
      type: i % 2 === 0 ? 'user' : 'ai',
      text: `Message ${i + 1}`
    }));

    await sendMessageToOpenAI('New message', conversationHistory);

    expect(fetch).toHaveBeenCalled();
    const fetchCall = fetch.mock.calls[0];
    const requestBody = JSON.parse(fetchCall[1].body);
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

    const fetchCall = fetch.mock.calls[0];
    const requestBody = JSON.parse(fetchCall[1].body);
    const messages = requestBody.messages;

    // Should have: system prompt + 4 history messages + new message = 6 total
    expect(messages.length).toBe(6);
    expect(messages[0].role).toBe('system');
    expect(messages[1].content).toBe('Message 1');
    expect(messages[messages.length - 1].content).toBe('New message');
  });

  test('should handle empty conversation history', async () => {
    await sendMessageToOpenAI('First message', []);

    const fetchCall = fetch.mock.calls[0];
    const requestBody = JSON.parse(fetchCall[1].body);
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

    const fetchCall = fetch.mock.calls[0];
    const requestBody = JSON.parse(fetchCall[1].body);
    const messages = requestBody.messages;

    expect(messages[1].role).toBe('user');
    expect(messages[1].content).toBe('User message');
    expect(messages[2].role).toBe('assistant');
    expect(messages[2].content).toBe('AI message');
  });
});
