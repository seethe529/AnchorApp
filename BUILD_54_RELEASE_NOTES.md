# Build 54 Release Notes

**Version:** 1.2.0  
**Build Number:** 54  
**Release Date:** December 2, 2025  
**Status:** TestFlight Testing

---

## What's New in Build 54

### 🧠 Enhanced DBT/CBT Technique System

**8 New Techniques Added:**
1. **Safe Place Visualization** - Grounding through mental imagery
2. **Cold Grounding** - Physical sensation grounding technique
3. **Name 3 Things** - Quick cognitive grounding exercise
4. **Radical Acceptance** - DBT distress tolerance skill
5. **Pros and Cons** - Decision-making and emotion regulation
6. **Self-Validation** - Emotion regulation and self-compassion
7. **Half-Smile and Willing Hands** - DBT mindfulness technique
8. **Additional Breathing Method** - Enhanced breathing exercise collection

**Total Techniques:** 28 (up from 20)

### 🎯 Improved AI Suggestion Algorithm

- **Synonym Mapping:** Understands 40+ phrase variations (e.g., "panic attack" → "anxiety attack")
- **Weighted Scoring:** Prioritizes most relevant techniques based on user input
- **High-Intensity Detection:** Automatically boosts grounding/distress tolerance for crisis phrases
- **Natural Language Understanding:** Better interprets user emotional states

### 📚 100% Citation Coverage

All 28 techniques now include evidence-based citations from:
- Behavioural Tech (Linehan's DBT Institute)
- American Psychological Association (APA)
- Veterans Affairs (VA)
- Harvard Medical School
- Mayo Clinic
- University of Rochester Medical Center

### 🔔 Notification Improvements

**Breathing Reminders:**
- Expanded from 25 to **98 unique messages**
- Reduced duplicate notifications
- More variety in DBT/CBT-inspired content
- 16 reminders per day (90-minute intervals)

**Mood Check-In Reminders:**
- Optimized from 7 days to **2 days** (today + tomorrow)
- More efficient scheduling (app reschedules daily)
- Fires at 8:00 PM daily

### 🚨 Safety Plan Fixes

- Fixed emergency contact buttons (call/text now functional)
- **988 Suicide & Crisis Lifeline** - Direct call
- **Crisis Text Line (741741)** - Pre-filled SMS with "HOME"
- **Veterans Crisis Line** - Direct call to 1-800-273-8255

### 🧪 Testing & Quality

- **68 tests passing** (100% pass rate)
- New test coverage for:
  - Synonym mapping
  - High-intensity phrase detection
  - Citation coverage validation
  - Technique suggestion algorithm

### 🏗️ Technical Improvements

- Removed `ios/` and `android/` from git (now EAS-managed)
- Cleaner repository structure
- Improved build process reliability
- Better separation of concerns

---

## Testing Checklist (24 Hours)

### Critical Features
- [ ] **Breathing Reminders:** Enable notifications, verify 98 unique messages appear
- [ ] **8 PM Mood Reminder:** Confirm fires at 8:00 PM
- [ ] **2-Day Scheduling:** Check Settings debug view shows only 2 mood reminders
- [ ] **New Techniques:** Test all 7 new techniques load and display correctly
- [ ] **Safety Plan Buttons:** Verify call/text buttons work for all 3 crisis lines
- [ ] **AI Suggestions:** Test synonym mapping with phrases like "panic attack", "can't breathe"
- [ ] **Citations:** Verify all 28 techniques show citations

### General Functionality
- [ ] Dark/Light theme toggle works
- [ ] Breathing exercises animate correctly
- [ ] Progress charts display mood data
- [ ] AI Agent responds appropriately
- [ ] All navigation flows work smoothly

---

## Known Issues

None currently identified. Report any issues found during TestFlight testing.

---

## Next Steps

1. **TestFlight Testing:** 24-hour validation period
2. **App Store Submission:** If testing passes, submit Build 54
3. **Android Development:** Begin Android build after iOS approval
4. **Google Play Submission:** Target within 1 week of iOS approval

---

## Version History

- **Build 54 (1.2.0):** 28 techniques (8 new), 98 breathing messages, optimized notifications
- **Build 53 (1.1.2):** Breathing screen fixes, iOS stability improvements
- **Build 44 (1.1.0):** Modern UI complete, dark mode, enhanced tab bar
- **Build 20 (1.0.5):** Notification system rewrite, midnight auto-reset
- **Build 14 (1.0.3):** Dark mode, GPT-4o-mini upgrade
- **Build 9 (1.0.0):** Initial App Store release

---

**For Support:** lingoryan084@gmail.com  
**TestFlight Link:** [Provided via email]  
**App Store:** [Pending Build 54 approval]
