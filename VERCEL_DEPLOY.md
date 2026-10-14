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

## When do I need to deploy Vercel?

Only when `api/chat.js` changes (model name, limits, prompt handling on the server).
App builds (EAS/TestFlight) do NOT deploy Vercel, and Vercel deploys do NOT change the app.

| What changed | Vercel deploy? | New app build? |
|---|---|---|
| `api/chat.js` (model, limits) | Yes | No |
| `src/services/openai.js` (system prompt, app-side logic) | No | Yes |
| Version / build number bump | No | Yes |

## Deploy

Run from `main`:

```bash
vercel --prod --archive=tgz
```

`--archive=tgz` is required. Without it the upload fails with "files should NOT have more than 15000 items" (the repo has too many files).
Vercel only builds `api/chat.js`; the ios/android folders are uploaded but ignored.

## Test after deploying

```bash
curl -s -X POST https://anchor-app-pi.vercel.app/api/chat \
  -H "Content-Type: application/json" -H "X-Device-ID: deploy-test" \
  -d '{"messages":[{"role":"user","content":"I feel anxious tonight."}],"max_tokens":300}'
```

A normal reply means it works. Each test counts toward that device ID's 10 messages/day.

## Backend URLs (important)

- **Stable address (app 1.3.1+):** `https://anchor-app-pi.vercel.app/api/chat`
  Always points to the latest production deploy. `src/services/openai.js` uses this, so backend updates reach users without a new app build.
- **Old frozen copy (app 1.3.0 and older):** `https://anchor-hdhkcdg9l-ryans-projects-1d0e75af.vercel.app/api/chat`
  Frozen to Feb 2026 code using `gpt-4o-mini`. It stops working on Jan 14, 2027, when OpenAI retires that model. Users must update the app.
  It has the extra alias `anchor-app-legacy-v1.vercel.app` so Vercel's retention policy (30 days max on Hobby) never deletes it. Don't remove that alias before Jan 14, 2027.

Never point the app at a `anchor-xxxxxxxxx-...vercel.app` URL again. Those are frozen to one deploy.

## Current model notes (gpt-6-luna, Oct 2026)

- Migrated from `gpt-4o-mini` (retires Jan 14, 2027). Replacement chosen from OpenAI's deprecations page.
- Must use `max_completion_tokens`, not `max_tokens` (the API rejects `max_tokens`).
- Don't send `temperature`; only the default (1) is allowed.
- Uses some reasoning tokens (~30–120 per reply), which count toward the 800 cap and the bill.
- Before changing models, check https://developers.openai.com/api/docs/deprecations for parameter changes and test with a direct curl first.

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
