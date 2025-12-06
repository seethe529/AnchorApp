# Release Notes - Build 61

**Version:** 1.2.0 (Build 61)  
**Platform:** Android  
**Release Date:** December 5, 2025  
**Testing Type:** Closed Alpha

---

## What's New in Build 61

### 🔔 Improved Notification System

We've completely redesigned how notifications work to ensure you never miss a breathing reminder or mood check-in, even if you don't open the app every day.

**Key Improvements:**
- **Extended Coverage:** Notifications now scheduled for 7 days instead of 3 days
  - 112 breathing reminders (every 90 minutes for 7 days)
  - 7 mood check-ins (8 PM daily for 7 days)
- **Smarter Rescheduling:** App automatically refreshes notifications when you open it after a day has passed
- **Better Reliability:** Handles users who don't open the app frequently

**Why This Matters:**
- Previous builds only scheduled 3 days of notifications
- If you didn't open the app for 3+ days, notifications would stop
- Now you're covered for a full week

---

## What to Test

### Priority Testing Areas

1. **Notification Delivery (Most Important)**
   - Enable breathing reminders in Settings
   - Enable mood reminders in Settings
   - Verify you receive notifications throughout the day
   - Check if you get the 8 PM mood check-in
   - Test over multiple days (ideally 7 days)

2. **Notification Rescheduling**
   - Enable notifications
   - Close the app completely
   - Wait 24+ hours without opening the app
   - Open the app
   - Verify notifications continue working

3. **Notification Settings**
   - Toggle breathing reminders ON/OFF
   - Toggle mood reminders ON/OFF
   - Verify notifications stop when disabled
   - Verify notifications resume when re-enabled

4. **Export Notifications (Debug Tool)**
   - Go to Settings → Data Management
   - Tap "Export Notifications"
   - Share the JSON output with us if you experience issues
   - This helps us troubleshoot notification problems

### Secondary Testing Areas

5. **All Existing Features**
   - Home screen quick actions
   - 28 DBT/CBT techniques
   - AI Support chat
   - Breathing exercises (5 methods)
   - Crisis resources
   - Safety plan
   - Progress tracking
   - Dark/Light theme toggle

---

## Known Behaviors

### Android Notification Timing

**Expected:** Notifications may not fire at exact 90-minute intervals

**Why:** Android batches notifications to save battery when apps don't have "exact alarm" permission. Google Play doesn't allow wellness apps to use exact alarms.

**Impact:** You might receive notifications a few minutes early or late, but you'll still get all of them throughout the day.

### Notification Coverage Limit

**Expected:** If you don't open the app for 7+ days, notifications will stop

**Why:** We can only schedule notifications 7 days in advance. Opening the app reschedules them for another 7 days.

**Workaround:** Open the app at least once per week to keep notifications active.

---

## How to Report Issues

### If Notifications Stop Working

1. Go to Settings → Data Management
2. Tap "Export Notifications"
3. Share the JSON output with us
4. Include:
   - When you last received a notification
   - When you last opened the app
   - Whether you have notifications enabled in Android Settings

### If You Experience Crashes or Bugs

1. Note what you were doing when it happened
2. Try to reproduce the issue
3. Share:
   - Steps to reproduce
   - What screen you were on
   - What you expected vs. what happened

### General Feedback

We want to hear about:
- Features you love
- Features you don't use
- Things that feel confusing
- Ideas for improvements
- How the app helps (or doesn't help) you

---

## Technical Details (For Curious Testers)

### Notification Architecture

**Android System:**
- Uses `AppState` listener to detect when app opens
- Checks if date has changed since last reschedule
- If date changed, cancels old notifications and schedules new ones
- Schedules 7 days of notifications to handle infrequent app opens

**Why 7 Days:**
- Balances coverage with storage/performance
- Most users open apps at least weekly
- Prevents notification spam from over-scheduling

### Comparison to iOS

**iOS (Build 54):**
- Uses hourly timer to check for date changes
- Only schedules 1 day of breathing reminders (16 notifications)
- Only schedules 2 days of mood reminders
- Shorter coverage because hourly timer ensures daily rescheduling

**Android (Build 61):**
- Uses app open to check for date changes
- Schedules 7 days of breathing reminders (112 notifications)
- Schedules 7 days of mood reminders
- Longer coverage because rescheduling only happens when app opens

---

## Changes from Build 60

### What Changed
- Extended breathing reminders from 48 to 112 (3 days → 7 days)
- Extended mood reminders from 2 to 7 days
- Improved notification rescheduling logic
- Added comprehensive unit tests (35 tests)
- Updated documentation

### What Stayed the Same
- All features work identically
- UI/UX unchanged
- Performance unchanged
- No breaking changes

---

## Testing Timeline

**Testing Period:** 14 days (December 5-19, 2025)  
**Minimum Testing:** Please test for at least 7 days to verify full notification coverage

**Ideal Testing Schedule:**
- **Day 1:** Enable notifications, verify initial delivery
- **Day 2:** Don't open app, verify notifications continue
- **Day 3:** Open app, verify rescheduling works
- **Day 4-7:** Continue monitoring notifications
- **Day 7:** Export notifications, share results

---

## Questions?

If you have any questions about this build or how to test specific features, please reach out through the testing platform or directly to the development team.

Thank you for helping us make Anchor better! Your feedback is invaluable in ensuring this app can help veterans and individuals with PTSD.

---

## Quick Reference

**Enable Notifications:**
1. Open Anchor
2. Go to Settings (bottom right tab)
3. Scroll to "Notifications" section
4. Toggle "Breathing Reminders" ON
5. Toggle "Mood Reminders" ON
6. Grant permission when prompted

**Export Notifications (Debug):**
1. Go to Settings
2. Scroll to "Data Management"
3. Tap "Export Notifications"
4. Share the JSON output

**Disable Notifications:**
1. Go to Settings
2. Toggle reminders OFF
3. Or: Android Settings → Apps → Anchor → Notifications → Disable

---

**Build:** 61  
**Version:** 1.2.0  
**Platform:** Android  
**Branch:** android-release  
**Commit:** [Will be added after build]
