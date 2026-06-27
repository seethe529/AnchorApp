# Build 97 - PDF Progress Report Export

**Date:** June 27, 2026  
**Platform:** iOS & Android  
**Version:** 1.2.14 (Build 97)  
**Status:** Submitted to TestFlight

---

## Feature: PDF Progress Report Export

### Problem
The previous export feature passed raw JSON through `Share.share()`, which would fail silently when users accumulated large amounts of data. Additionally, the JSON format wasn't user-friendly — most users wouldn't know what to do with it.

### Solution
Completely redesigned the export as a styled PDF progress report that users can share with their therapist or healthcare provider.

### What's Included in the Report
- **App logo and branding** — professional appearance with Anchor's green theme
- **Date range selector** — Last 7 days, 30 days, 3 months, or All time
- **Summary section** — mood entries, techniques used, average mood score, AI conversations
- **Mood history** — chronological list with mood names, dates, and user notes
- **Technique usage** — deduplicated entries with effectiveness ratings
- **Medical disclaimer** — clarifies data is self-reported, not a clinical record
- **Friendly filename** — "Anchor Progress Report 2026-06-27.pdf"

### Technical Details
- Uses `expo-print` to generate PDF from HTML template
- App icon embedded as base64 (no network needed)
- `expo-sharing` for cross-platform share sheet
- Handles arbitrarily large datasets (no size limit issues)
- Deduplication logic prevents showing technique entries twice

### Dependencies Added
- `expo-print` (~15.0.x)

### Files Changed
- `src/screens/SettingsScreen.js` — complete export rewrite
- `package.json` — added expo-print
- `app.config.js` — version bump
