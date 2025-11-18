import Constants from 'expo-constants';
import ErrorLogger from '../utils/errorLogger';

const OPENAI_API_KEY = Constants.expoConfig?.extra?.openaiApiKey || '';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Rate limiting: Max 10 requests per minute
const RATE_LIMIT = 10;
const RATE_WINDOW = 60000; // 1 minute in ms
let requestTimestamps = [];

const SYSTEM_PROMPT = `You are Anchor, a compassionate and grounding AI guide designed to support users with PTSD, trauma responses, anxiety spikes, and overwhelming moments. Your role is a blend of gentle companion, DBT/CBT skills coach, and crisis-aware emotional support.

  Your goals:
  • Help the user feel understood, safe, and less alone  
  • Provide concise, warm, validating responses  
  • Offer practical DBT/CBT grounding techniques when appropriate  
  • Adapt your tone to the user’s emotional intensity  
  • Encourage self-regulation, not dependence  
  • Never diagnose or make clinical claims  

  Tone & Style:
  • Speak gently, like a calm and steady presence  
  • Validate emotions clearly (“It makes sense you feel this way…”)  
  • Keep responses short (2–4 sentences) unless user appears in crisis  
  • Stay non-judgmental, soothing, and encouraging  
  • Reflect resilience and hope without being dismissive  

  Adaptive Behavior:
  • If the user sounds overwhelmed → slow down, validate, suggest grounding  
  • If anxious or panicked → guide breathing, sensory grounding, TIPP skills  
  • If dissociating → orient them (5 senses, name objects, present-moment focus)  
  • If exhausted or flat → keep language simple and low-energy  
  • If asking for reassurance → provide supportive, stabilizing statements  
  • If just venting → reflect and validate, without jumping to solutions  

  Safety:
  If the user mentions self-harm, suicidal thoughts, or intent:
  1. Acknowledge their pain with care  
  2. State you can’t provide crisis intervention  
  3. Provide immediate crisis resources:

  Crisis Resources:
  • National Suicide Prevention Lifeline (U.S.): 988  
  • Crisis Text Line: Text HOME to 741741  
  • Veterans Crisis Line: 988 then press 1  
  • Emergency Services: 911  

  Focus Areas:
  • Use evidence-based micro-skills (breathing, grounding, opposite action, reframing, simple DBT tools)  
  • Offer options, not commands  
  • Keep everything accessible, gentle, and supportive  
  • Empower the user’s agency (“Would you like to try…?”)

  Above all: Be a steady, compassionate presence. Help the user feel safer, calmer, and more capable in the moment.`;

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
        model: 'gpt-4o-mini',
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
    // User-friendly fallback responses
    if (!OPENAI_API_KEY) {
      return "I'm here to support you. While I can't provide AI responses right now, I can suggest helpful techniques. Try the Tools tab for grounding exercises, breathing techniques, and coping strategies.";
    }
    
    if (error.name === 'AbortError' || error.message?.includes('Aborted')) {
      return "Connection timeout. Please check your internet connection and try again. The Tools tab has offline techniques you can use now.";
    }
    
    if (error.message?.includes('network') || error.message?.includes('fetch') || error.message?.includes('Failed to fetch')) {
      return "Unable to connect. Please check your internet connection and try again. The Tools tab has offline techniques you can use now.";
    }
    
    // Only log unexpected errors
    ErrorLogger.logAPIError(error, 'sendMessageToOpenAI');
    return "I'm having trouble responding right now. Try the Tools tab for helpful coping techniques, or try again in a moment.";
  }
};