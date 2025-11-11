# Apple Rejection Fixes - Build 3

**Rejection Date:** November 11, 2025  
**Submission ID:** 4b3a717a-62b5-49e3-8c1a-32221593c51c

---

## Issues to Fix

### ✅ Issue 1: Location Permission (Guideline 5.1.1)
**Problem:** App requests location permission without clear explanation.

**Root Cause:** 
- **AIAgentScreen.js** (lines 9-11, 19, 24, 56-67): Requests location but never uses it
- **CrisisScreen.js** (lines 7-9, 13, 18, 22-36, 107-125): Uses location for "Find Local Crisis Centers" and "Find Nearest Hospital"

**Two Options:**

**Option A: Remove ALL location features (Simplest)**
1. Remove location from AIAgentScreen.js (it's not used)
2. Remove location from CrisisScreen.js
3. Remove "Find Local Crisis Centers" and "Find Nearest Hospital" buttons
4. No permission string needed

**Option B: Keep location for Crisis features (Better UX)**
1. Remove location from AIAgentScreen.js (it's not used)
2. Keep location in CrisisScreen.js for finding nearby help
3. Add proper permission string to app.json:
```json
"infoPlist": {
  "NSLocationWhenInUseUsageDescription": "Anchor uses your location to help you find nearby crisis centers and emergency rooms when you need immediate help. Your location is only used when you tap 'Find Local Crisis Centers' or 'Hospital Emergency Room' and is never stored or shared."
}
```

**Recommendation: Option B** - Finding nearby crisis centers is valuable for users in crisis.

**Files to modify:**
- `src/screens/AIAgentScreen.js` (remove location)
- `app.json` or `app.config.js` (add permission string)

---

### ✅ Issue 2: iPad Layout (Guideline 4.0)
**Problem:** UI is crowded/broken on iPad Air 11-inch.

**Root Cause:**
- `app.json` has `supportsTablet: true` (line 17)
- We changed `app.config.js` to `false`, but `app.json` overrides it
- Apple tested on iPad and found layout issues

**Fix:**
1. Change `supportsTablet: true` to `supportsTablet: false` in `app.json`
2. OR delete `app.json` entirely (app.config.js should be the source of truth)

**Files to modify:**
- `app.json` (line 17)

---

### ⚠️ Issue 3: Incomplete Features (Guideline 2.2)
**Problem:** Apple thinks there's an incomplete/beta feature users must use.

**Possible Causes:**
1. **AI Support might have failed during testing**
   - Check OpenAI usage logs for November 11, 2025
   - If API key failed, they saw error messages
   
2. **Empty states might look "incomplete"**
   - Progress screen is empty on first launch
   - Mood tracking has no data initially
   
3. **Settings "Data Export" might look like beta feature**
   - Could be labeled more clearly

**Questions to Answer:**
- Did OpenAI API work during Apple's test? (Check logs)
- Which screen did Apple consider "incomplete"?
- Do we need better empty state messaging?

**Potential Fixes:**
1. Add better empty state messages:
   - Progress: "Start tracking your mood to see progress here"
   - AI Support: If API fails, show clear message it's unavailable
   
2. Remove "beta" language anywhere in the app
   
3. Make sure all features work without internet (offline mode)

**Files to check:**
- `src/screens/ProgressScreen.js`
- `src/components/MoodTracker.js`
- `src/screens/AIAgentScreen.js`
- `src/services/openai.js`

---

## Action Plan for Tomorrow

### Step 1: Fix Location Permission (5 minutes)
- [ ] Remove location code from AIAgentScreen.js
- [ ] Test AI screen still works
- [ ] Commit changes

### Step 2: Fix iPad Support (2 minutes)
- [ ] Change `supportsTablet: false` in app.json
- [ ] Commit changes

### Step 3: Investigate Incomplete Features (15 minutes)
- [ ] Check OpenAI usage logs for Nov 11
- [ ] Test all screens with empty data
- [ ] Identify what Apple might consider "incomplete"
- [ ] Add better empty state messages if needed

### Step 4: Build & Submit (30 minutes)
- [ ] Increment build number to 3
- [ ] Run `eas build --platform ios --profile production --non-interactive`
- [ ] Wait for build to complete
- [ ] Run `eas submit --platform ios --profile production --latest`
- [ ] Select Build 3 in App Store Connect
- [ ] Resubmit for review

---

## Questions for Ryan

1. **Did you check OpenAI usage on November 11?**
   - Go to: https://platform.openai.com/usage
   - Look for API calls on Nov 11, 2025
   - Did Apple's test trigger any API calls?

2. **Did you select Build 2 in App Store Connect?**
   - Or did Apple test Build 1 (which had iPad support)?

3. **Any screenshots from Apple showing the "incomplete" feature?**
   - Check the rejection email for attachments

4. **Do you see any features that look "beta" or "incomplete"?**
   - Walk through the app with fresh eyes

---

## Notes

- **Location removal is critical** - This is the clearest violation
- **iPad support fix is easy** - Just change one line
- **Incomplete features is vague** - Need more investigation
- **Build 3 should fix issues 1 & 2** - Issue 3 needs clarification

---

**Next Session:** Remove location code, fix iPad support, investigate incomplete features, rebuild and resubmit.
