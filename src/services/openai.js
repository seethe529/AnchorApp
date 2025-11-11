import Constants from 'expo-constants';
import ErrorLogger from '../utils/errorLogger';

const OPENAI_API_KEY = Constants.expoConfig?.extra?.openaiApiKey || '';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Rate limiting: Max 10 requests per minute
const RATE_LIMIT = 10;
const RATE_WINDOW = 60000; // 1 minute in ms
let requestTimestamps = [];

const SYSTEM_PROMPT = `You are a compassionate AI therapist specializing in PTSD and trauma support. You provide evidence-based guidance using DBT/CBT techniques. Always:

- Be empathetic and validating
- Prioritize safety - if someone mentions self-harm or suicide, immediately provide crisis resources
- Suggest specific grounding, breathing, or coping techniques when appropriate
- Keep responses concise but supportive (2-3 sentences max unless crisis situation)
- Never diagnose or replace professional therapy
- Focus on immediate coping strategies

Crisis resources to provide when needed:
- National Suicide Prevention Lifeline: 988
- Crisis Text Line: Text HOME to 741741
- Veterans Crisis Line: 1-800-273-8255
- Emergency Services: 911`;

export const sendMessageToOpenAI = async (message, conversationHistory = []) => {
  // Rate limiting check
  const now = Date.now();
  requestTimestamps = requestTimestamps.filter(ts => now - ts < RATE_WINDOW);
  
  if (requestTimestamps.length >= RATE_LIMIT) {
    return "You're sending messages too quickly. Please wait a moment before trying again. Take a deep breath.";
  }
  
  requestTimestamps.push(now);
  
  try {
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.slice(-6).map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.text
      })),
      { role: 'user', content: message }
    ];

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 200,
        temperature: 0.7
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.text();
      ErrorLogger.logAPIError(new Error(`Status ${response.status}: ${errorData}`), 'OpenAI');
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    ErrorLogger.logAPIError(error, 'sendMessageToOpenAI');
    
    // User-friendly fallback responses
    if (!OPENAI_API_KEY) {
      return "I'm here to support you. While I can't provide AI responses right now, I can suggest helpful techniques. Try the Tools tab for grounding exercises, breathing techniques, and coping strategies.";
    }
    
    if (error.name === 'AbortError') {
      return "Connection timeout. Please check your internet connection and try again. The Tools tab has offline techniques you can use now.";
    }
    
    if (error.message?.includes('network') || error.message?.includes('fetch') || error.message?.includes('Failed to fetch')) {
      return "Unable to connect. Please check your internet connection and try again. The Tools tab has offline techniques you can use now.";
    }
    
    return "I'm having trouble responding right now. Try the Tools tab for helpful coping techniques, or try again in a moment.";
  }
};