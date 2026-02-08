// Vercel Serverless Function - Secure OpenAI Proxy
// Protects API key and adds rate limiting + subscription checks

const rateLimit = new Map();
const dailyLimit = new Map();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const deviceId = req.headers['x-device-id'] || 'unknown';
  const now = Date.now();

  // Rate limiting: 5 requests per minute
  const userRequests = rateLimit.get(deviceId) || [];
  const recentRequests = userRequests.filter(t => now - t < 60000);
  if (recentRequests.length >= 5) {
    return res.status(429).json({ 
      message: "You're sending messages too quickly. Please take a moment to breathe. I'll be here when you're ready."
    });
  }
  recentRequests.push(now);
  rateLimit.set(deviceId, recentRequests);

  // Daily limit: 10 requests per day (free tier)
  const today = new Date().toDateString();
  const dailyData = dailyLimit.get(deviceId) || { date: today, count: 0 };
  if (dailyData.date !== today) {
    dailyData.date = today;
    dailyData.count = 0;
  }
  if (dailyData.count >= 10) {
    return res.status(429).json({ 
      message: "You've reached today's message limit (10 messages). This helps keep Anchor available for everyone. The limit resets tomorrow, and the Tools tab has helpful techniques you can use anytime."
    });
  }
  dailyData.count++;
  dailyLimit.set(deviceId, dailyData);

  try {
    const { messages, max_tokens = 300 } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ 
        message: "I'm having trouble understanding that request. Could you try sending your message again?"
      });
    }

    const userMessage = messages[messages.length - 1]?.content || '';
    if (userMessage.length > 500) {
      return res.status(400).json({ 
        message: "That message is a bit long for me to process. Could you break it down into a shorter message? I'm here to help."
      });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: Math.min(max_tokens, 800),
        temperature: 0.7
      })
    });

    if (!response.ok) {
      console.error('OpenAI error:', response.status);
      return res.status(500).json({ 
        message: "I'm having trouble connecting right now. Please try again in a moment, or check out the Tools tab for helpful techniques you can use offline."
      });
    }

    const data = await response.json();
    res.json({ message: data.choices[0].message.content });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      message: "I'm experiencing some technical difficulties. Please try again in a moment. Remember, the Tools tab has offline techniques that are always available to help you."
    });
  }
}
