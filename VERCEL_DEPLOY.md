# Vercel Deployment Instructions

## Setup (One-time)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Add your OpenAI API key as environment variable:**
   ```bash
   vercel env add OPENAI_API_KEY
   ```
   - Choose "Production"
   - Paste your NEW OpenAI API key (get a new one from platform.openai.com)

## Deploy

```bash
vercel --prod
```

You'll get a URL like: `https://anchor-app-xyz.vercel.app`

## Update React Native App

After deployment, update `src/services/openai.js`:
- Change `BACKEND_API_URL` to: `https://YOUR-VERCEL-URL.vercel.app/api/chat`

## Cost Protection Features

✅ Rate limiting: 5 requests/minute per device
✅ Daily limit: 10 messages/day per device (free tier)
✅ Max tokens: 800 per response (prevents cutoff while controlling costs)
✅ Message length limited to 500 characters
✅ Ready for subscription upgrades

**Cost estimate:** 10 msg/day × 800 tokens × 100 users = ~$0.60/day = $18/month max
**Realistic cost:** 10-50 users = $5-15/month

## Future: Add Subscriptions

When ready to add Premium subscriptions:
1. Integrate RevenueCat or Stripe
2. Pass subscription status in request headers
3. Remove daily limit for premium users
4. Increase max_tokens to 800 for premium users
