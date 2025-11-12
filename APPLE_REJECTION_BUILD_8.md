# Apple Rejection - Build 8 Fix Summary

## Rejection Details
- **Date:** November 12, 2025
- **Guideline:** 1.4.1 - Safety - Physical Harm
- **Issue:** Missing medical citations
- **Build:** 8 (fixing this issue)

## What Apple Said
> "The app includes medical information but does not include citations for the medical information."

## What We Fixed

### ✅ 1. Created Citations Database
- Added `src/data/citations.js` with 14+ authoritative sources
- All citations link to VA, APA, NIH, or peer-reviewed research
- Includes DBT (Linehan, 1993), CBT (Beck, 1979), and all techniques

### ✅ 2. New "Resources & Citations" Screen
- Accessible from Settings
- Shows all medical sources with clickable links
- Includes medical disclaimer
- Easy to find and navigate

### ✅ 3. Citations on Every Technique
- Each technique detail now shows source at bottom
- "View Source" button opens research link
- Formatted in APA style

## Quick Test
1. Open app → Settings
2. Tap "Resources & Citations"
3. See all medical sources with links
4. Go to Tools → Select any technique
5. Scroll to bottom → See citation

## Files Changed
- ✅ `src/data/citations.js` (NEW)
- ✅ `src/screens/ResourcesScreen.js` (NEW)
- ✅ `App.js` (added Resources to nav)
- ✅ `src/screens/SettingsScreen.js` (added Resources button)
- ✅ `src/screens/ToolsScreen.js` (added citations to techniques)
- ✅ `app.config.js` (build 7 → 8)

## Ready to Submit?
**YES** ✅

Build and submit:
```bash
eas build --platform ios --profile production
eas submit --platform ios --profile production --latest
```

## Message to Apple
Include in App Store Connect response:

> We have added comprehensive medical citations:
> 1. New "Resources & Citations" screen in Settings with all sources
> 2. Citations on every technique with clickable links
> 3. All sources are authoritative (VA, APA, NIH)
> 
> The app now fully complies with Guideline 1.4.1.

---

**This fix directly addresses Apple's concern. Should be approved.** 🚀
