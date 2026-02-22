import * as Device from 'expo-device';
import { storage } from '../utils/storage';
import ErrorLogger from '../utils/errorLogger';

// SECURITY: API calls now go through Vercel backend (not directly to OpenAI)
// This prevents API key exposure and enables server-side rate limiting
const BACKEND_API_URL = 'https://anchor-hdhkcdg9l-ryans-projects-1d0e75af.vercel.app/api/chat';

// Client-side rate limiting (backup layer)
const RATE_LIMIT = 5; // Reduced from 10
const RATE_WINDOW = 60000; // 1 minute
const DAILY_LIMIT = 10; // Max 10 messages per day per device (800 tokens each)
let requestTimestamps = [];

const SYSTEM_PROMPT = `You are Anchor, a compassionate and grounding AI guide designed to support users with PTSD, trauma responses, anxiety spikes, and overwhelming moments. Your role is a blend of gentle companion, DBT/CBT skills coach, and crisis-aware emotional support.

  Your goals:
  • Help the user feel understood, safe, and less alone  
  • Provide concise, warm, validating responses  
  • Offer practical DBT/CBT grounding techniques when appropriate  
  • Adapt your tone to the user's emotional intensity  
  • Encourage self-regulation, not dependence  
  • Never diagnose or make clinical claims  

  Tone & Style:
  • Speak gently, like a calm and steady presence  
  • Validate emotions clearly ("It makes sense you feel this way…")  
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
  2. State you can't provide crisis intervention  
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
  • Empower the user's agency ("Would you like to try…?")

  Above all: Be a steady, compassionate presence. Help the user feel safer, calmer, and more capable in the moment.`;

// Generate device fingerprint for rate limiting
const getDeviceId = async () => {
  try {
    let deviceId = await storage.getItem('device_id');
    if (!deviceId) {
      deviceId = `${Device.modelName}-${Device.osVersion}-${Date.now()}`;
      await storage.setItem('device_id', deviceId);
    }
    return deviceId;
  } catch {
    return 'unknown';
  }
};

// Check daily usage limit
const checkDailyLimit = async () => {
  const today = new Date().toDateString();
  const usage = await storage.getItem('daily_usage') || { date: today, count: 0 };
  
  if (usage.date !== today) {
    usage.date = today;
    usage.count = 0;
  }
  
  if (usage.count >= DAILY_LIMIT) {
    return false;
  }
  
  usage.count++;
  await storage.setItem('daily_usage', usage);
  return true;
};

export const sendMessageToOpenAI = async (message, conversationHistory = []) => {
  // Rate limiting check
  const now = Date.now();
  requestTimestamps = requestTimestamps.filter(ts => now - ts < RATE_WINDOW);
  
  if (requestTimestamps.length >= RATE_LIMIT) {
    return "You're sending messages too quickly. Please wait a moment before trying again. Take a deep breath.";
  }
  
  // Daily limit check
  const withinDailyLimit = await checkDailyLimit();
  if (!withinDailyLimit) {
    return "You've reached today's message limit (10 messages). This helps keep the service available for everyone. The limit resets tomorrow, and the Tools tab has offline techniques you can use anytime.";
  }
  
  requestTimestamps.push(now);
  
  try {
    const deviceId = await getDeviceId();
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.slice(-16).map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.text
      })),
      { role: 'user', content: message }
    ];

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    // SECURITY: Call your backend instead of OpenAI directly
    const response = await fetch(BACKEND_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Device-ID': deviceId,
        'X-App-Version': '1.2.6'
      },
      body: JSON.stringify({
        messages,
        max_tokens: 800,
        temperature: 0.7
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.text();
      ErrorLogger.logAPIError(new Error(`Status ${response.status}: ${errorData}`), 'Backend');
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Handle daily limit reached (subscription prompt)
    if (response.status === 429 && data.message) {
      return data.message; // "Upgrade to Premium" message from backend
    }
    
    return data.message || "I'm here to support you. Try the Tools tab for helpful techniques.";
  } catch (error) {
    if (error.name === 'AbortError') {
      return "Connection timeout. Please check your internet connection. The Tools tab has offline techniques you can use now.";
    }
    
    if (error.message?.includes('network') || error.message?.includes('fetch')) {
      return "Unable to connect. Please check your internet connection. The Tools tab has offline techniques you can use now.";
    }
    
    ErrorLogger.logAPIError(error, 'sendMessageToOpenAI');
    return "I'm having trouble responding right now. Try the Tools tab for helpful coping techniques, or try again in a moment.";
  }
};
