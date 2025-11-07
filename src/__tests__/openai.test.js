import { sendMessageToOpenAI } from '../services/openai';

global.fetch = jest.fn();

describe('OpenAI Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should send message and return response', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'AI response' } }]
      })
    });

    const response = await sendMessageToOpenAI('test message', []);
    expect(response).toBe('AI response');
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Authorization': expect.stringContaining('Bearer')
        })
      })
    );
  });

  test('should return fallback message on error', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    const response = await sendMessageToOpenAI('test message', []);
    expect(response).toContain('here to support you');
  });

  test('should include conversation history', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'AI response' } }]
      })
    });

    const history = [
      { type: 'user', text: 'previous message' },
      { type: 'ai', text: 'previous response' }
    ];

    await sendMessageToOpenAI('new message', history);
    
    const callBody = JSON.parse(fetch.mock.calls[0][1].body);
    expect(callBody.messages.length).toBeGreaterThan(2);
  });
});
