# Notification System Architecture

## Overview
Anchor uses a platform-specific notification system optimized for iOS and Android's different behaviors and constraints.

**Version:** Build 61 (December 2025)

---

## Platform-Specific Design

### iOS System
**Strategy:** Short coverage + frequent auto-reschedule

#### Rescheduling Mechanism
- **Method:** `setInterval` timer
- **Interval:** Every 1 hour (3600000ms)
- **Trigger:** Runs while app is open (foreground or background)
- **Check:** Compares current date with last reset date
- **Action:** If date changed, cancels all notifications and reschedules

#### Coverage
- **Breathing Reminders:** 48 notifications (3 days)
  - Interval: 90 minutes
  - Total coverage: 72 hours
- **Mood Reminders:** 7 notifications (7 days)
  - Time: 8:00 PM daily
  - Total coverage: 1 week
- **Total:** 55 notifications (safely under iOS 64 limit)

#### iOS 64 Notification Limit
- **Platform Constraint:** iOS has a hard limit of 64 scheduled notifications per app
- **Discovery:** Build 60 attempted 119 notifications (112 breathing + 7 mood), only 64 were scheduled
- **Solution:** Reduced to 48 breathing + 7 mood = 55 total (safe margin)
- **Impact:** 3-day breathing coverage instead of 7-day

#### Rationale
- iOS allows background timers to run
- Hourly checks ensure notifications never expire
- 3-day coverage balances user engagement with platform limits
- 7-day mood reminders serve as engagement hook
- Explicit cancellation prevents duplicate notification branches

#### Code Location
```javascript
// App.js - Lines ~88-108
if (Platform.OS === 'ios') {
  const timer = setInterval(async () => {
    // Check date change and reschedule
  }, 3600000);
  return () => clearInterval(timer);
}
```

---

### Android System
**Strategy:** Long coverage + foreground reschedule

#### Rescheduling Mechanism
- **Method:** `AppState` listener with 5-minute debounce
- **Trigger:** Only when app comes to foreground (user opens app)
- **Debounce:** Prevents reschedule checks within 5 minutes of last check
- **Check:** Compares current date with last reset date
- **Action:** If date changed, cancels all notifications and reschedules
- **Safety:** Skips past notification dates to prevent immediate firing

#### Coverage
- **Breathing Reminders:** 112 notifications (7 days)
  - Interval: 90 minutes
  - Total coverage: 168 hours (1 week)
- **Mood Reminders:** 7 notifications (7 days)
  - Time: 8:00 PM daily
  - Total coverage: 1 week

#### Rationale
- Android restricts background timers for battery optimization
- AppState listener only fires when user opens app
- 5-minute debounce prevents reschedule spam during PTSD episodes
- Long coverage handles users who don't open app frequently
- HIGH priority notifications reduce Android battery batching delays
- Health category identifier marks notifications as time-sensitive

#### Code Location
```javascript
// App.js - Lines ~109-125
else if (Platform.OS === 'android') {
  const subscription = AppState.addEventListener('change', (nextAppState) => {
    if (nextAppState === 'active') {
      checkAndReschedule();
    }
  });
  return () => subscription.remove();
}
```

---

## Configuration

### Constants (`src/utils/notifications.js`)
```javascript
const DEV_MODE = false; // Set to true for testing

// Platform-specific coverage
const MOOD_DAYS = 7; // Both platforms: 7-day mood coverage
const BREATHING_COUNT = DEV_MODE ? 3 : (Platform.OS === 'ios' ? 48 : 112);
  // iOS: 48 (3 days) - stays under 64 notification limit (48+7=55)
  // Android: 112 (7 days) - no platform limit
const BREATHING_INTERVAL = DEV_MODE ? 60 : 5400; // seconds (90 minutes)
```

### Dev Mode
When `DEV_MODE = true`:
- **Breathing:** 3 notifications, 60-second intervals
- **Mood:** 2 notifications
- **Purpose:** Fast testing without waiting hours

---

## Notification Types

### 1. Breathing Reminders
- **Title:** "Breathing Break"
- **Body:** Randomized from 98 DBT/CBT-inspired messages
- **Data:** `{ type: 'breathing_reminder' }`
- **Priority:** HIGH (Android)
- **Category:** 'reminder' (health notification)
- **Trigger:** Date-based (exact time)
- **Scheduling:** Millisecond-based calculation for exact 90-minute intervals

**Example Messages:**
- "Take one mindful breath and return to center."
- "A slow breath helps you ride the wave, not fight it."
- "Let your breath be your anchor for the next 5 seconds."

### 2. Mood Reminders
- **Title:** "Daily Check-in"
- **Body:** "How are you feeling today? Take a moment to log your mood."
- **Data:** `{ type: 'mood_reminder' }`
- **Priority:** HIGH (Android)
- **Category:** 'reminder' (health notification)
- **Trigger:** Date-based (8:00 PM daily)
- **Safety:** Skips past dates to prevent immediate firing

---

## Duplicate Prevention

### iOS Explicit Cancellation
```javascript
// iOS timer explicitly cancels before rescheduling
await cancelBreathingReminder();
await cancelMoodReminder();
// Then reschedule
if (prefs.breathingReminders) await scheduleBreathingReminder();
if (prefs.moodReminders) await scheduleMoodReminder();
```

### Why This Matters
- Previous builds had duplicate notification branches on iOS
- Users reported receiving multiple notifications at same time
- Explicit cancellation ensures clean slate before rescheduling

### Android Cancellation
- Same explicit cancellation logic
- 5-minute debounce prevents multiple cancellation/reschedule cycles
- Skips past notification dates after cancellation to prevent immediate firing

---

## User Preferences

### Storage Key: `user_preferences`
```javascript
{
  breathingReminders: true,  // User enabled breathing reminders
  moodReminders: true        // User enabled mood reminders
}
```

### Behavior
- Rescheduling checks user preferences before scheduling
- If disabled, notifications are cancelled but not rescheduled
- User can toggle in Settings → Notifications

---

## Date Tracking

### Storage Key: `last_reset`
- **Value:** Day of month (1-31)
- **Purpose:** Track when notifications were last rescheduled
- **Check:** `now.getDate() !== last_reset`

### Why Day of Month?
- Simple comparison
- Works across month boundaries
- Resets daily at midnight

---

## Debugging Tools

### Export Notifications (Settings)
```javascript
exportScheduledNotifications()
```

**Returns:**
```json
{
  "exportDate": "2025-12-05T10:30:00.000Z",
  "totalScheduled": 118,
  "summary": {
    "moodReminders": 2,
    "breathingReminders": 16
  },
  "rescheduleSystem": {
    "platform": "ios",
    "ios": {
      "method": "setInterval timer",
      "checkInterval": "3600000ms (1 hour)",
      "breathingCount": 16,
      "moodDays": 2
    },
    "android": {
      "method": "AppState listener",
      "checkInterval": "On app foreground",
      "breathingCount": 112,
      "moodDays": 7
    }
  },
  "notifications": [...]
}
```

### Console Logging
All notification operations log to console with emoji prefixes:
- 📱 Permission requests
- 🫁 Breathing reminders
- 🌙 Mood reminders
- 🧹 Cancellations
- ✅ Success
- ❌ Errors

---

## Edge Cases

### 1. User Doesn't Open App (Android)
- **Scenario:** User doesn't open app for 7+ days
- **Result:** Notifications stop after 7 days
- **Mitigation:** 7-day coverage handles most users
- **Alternative:** Would require server-side push (future enhancement)

### 2. App Killed (iOS)
- **Scenario:** User force-quits app
- **Result:** Timer stops, no rescheduling until app reopens
- **Mitigation:** 1-day coverage usually sufficient
- **Fallback:** User reopening app triggers reschedule check

### 3. Past Notification Dates
- **Scenario:** Rescheduling creates notifications with past trigger times
- **Logic:** Skips any notification with trigger time <= Date.now()
- **Code:** `if (triggerTime <= Date.now()) continue;`
- **Impact:** Prevents notifications from firing immediately on app open

### 4. Rapid App Opens (PTSD Episodes)
- **Scenario:** User opens app multiple times during distress
- **Logic:** 5-minute debounce prevents reschedule spam
- **Code:** `if (now - lastCheck < 300000) return;`
- **Impact:** No notification disruption during crisis moments

### 5. Timezone Changes
- **Behavior:** Uses device local time
- **Impact:** Notifications adjust to new timezone automatically
- **No special handling needed**

---

## Performance Considerations

### iOS
- **Timer Overhead:** Minimal (1 check per hour)
- **Battery Impact:** Negligible
- **Memory:** Single timer instance

### Android
- **Listener Overhead:** Only fires on app open (debounced)
- **Battery Impact:** None (no background work)
- **Storage:** 112 scheduled notifications (~10KB)
- **Notification Priority:** HIGH importance channel with vibration

---

## Testing Checklist

### iOS Testing
- [ ] Enable breathing reminders
- [ ] Verify 48 breathing + 7 mood = 55 total notifications scheduled
- [ ] Confirm total stays under 64 notification limit
- [ ] Wait 1 hour with app open
- [ ] Check console for date change check
- [ ] Verify no duplicate notifications
- [ ] Force-quit and reopen app
- [ ] Verify notifications still scheduled

### Android Testing
- [ ] Enable breathing reminders
- [ ] Verify 112 notifications scheduled at exact 90-min intervals
- [ ] Close app (background)
- [ ] Reopen app immediately → verify debounce (no reschedule)
- [ ] Wait 6 minutes, reopen → verify debounce expired
- [ ] Wait 24 hours, reopen → verify reschedule
- [ ] Check console for reschedule logs
- [ ] Verify no notifications fire on app open
- [ ] Rapid open/close 5 times → verify no spam

### Cross-Platform
- [ ] Toggle reminders OFF → verify cancellation
- [ ] Toggle reminders ON → verify scheduling
- [ ] Export notifications → verify correct counts
- [ ] Receive notification → verify correct message
- [ ] Check notification at 8 PM (mood)

---

## Future Enhancements

### Potential Improvements
1. **Server-Side Push:** Eliminate coverage limits
2. **Background Tasks:** Android WorkManager for periodic checks
3. **Adaptive Scheduling:** Learn user's app usage patterns
4. **Smart Timing:** Avoid notifications during sleep hours
5. **Notification History:** Track which notifications were delivered

### Constraints
- **Google Play Policy:** No exact alarm permission for wellness apps
- **Battery Optimization:** Android may kill background tasks
- **User Control:** Must respect notification preferences

---

## Troubleshooting

### Notifications Not Firing (iOS)
1. Check Settings → Notifications → Anchor → Allow Notifications
2. Verify app is open at least once per 3 days (breathing coverage limit)
3. Check console logs for timer execution
4. Export notifications to verify scheduling (should show 55 total)
5. If 0 notifications scheduled, iOS may have hit 64 limit from another app

### Notifications Not Firing (Android)
1. Check Settings → Apps → Anchor → Notifications → Enabled
2. Disable battery optimization for Anchor
3. Open app to trigger reschedule
4. Export notifications to verify scheduling

### Duplicate Notifications
1. Fixed in Build 61 (explicit cancellation)
2. If still occurring, toggle reminders OFF then ON
3. Check for multiple app instances running

### Notifications Fire on App Open (Android)
1. Fixed in Build 64 (skip past dates + debounce)
2. If still occurring, check console logs for reschedule spam
3. Verify debounce is working (5-minute minimum between checks)

### Notifications Stop After 7 Days (Android)
1. Expected behavior if user doesn't open app
2. Open app to reschedule
3. Consider enabling daily app usage

### Notifications Stop After 3 Days (iOS)
1. Expected behavior if user doesn't open app
2. Open app to reschedule (hourly timer will trigger)
3. 7-day mood reminders continue as engagement hook

---

## Version History

### Build 61 (Current)
- **iOS 64 Notification Limit Discovery:** iOS only schedules 64 notifications maximum
- Reverted iOS to 48 breathing + 7 mood = 55 total (safe under limit)
- Android maintains 112 breathing + 7 mood = 119 total
- Platform-specific BREATHING_COUNT: iOS 48, Android 112
- Unified MOOD_DAYS: 7 for both platforms
- iOS: 3-day breathing coverage, 7-day mood coverage
- Android: 7-day breathing coverage, 7-day mood coverage

### Build 60
- Attempted unified 7-day coverage (112 breathing + 7 mood = 119)
- Discovered iOS 64 notification limit (only 64 scheduled instead of 119)
- Extended iOS coverage from 2-day to 3-day before hitting limit
- Test branch created to verify 8 PM mood reminder timing

### Build 59
- Test branch `test-8pm-mood-reminder` created
- Confirmed 8 PM mood reminders fire at exactly 8:00:00 PM
- Test utilities created and removed after validation

### Build 58
- Extended iOS notification coverage from 2-day to 3-day
- iOS: 48 breathing + 3 mood notifications

### Build 54
- iOS hourly timer with 1-day coverage (16 breathing)
- 7-day mood reminders
- Original platform-specific implementation

### Build 20
- Original notification system
- Midnight reset architecture

---

**Document Version:** 2.1  
**Last Updated:** December 2025  
**Maintained By:** Development Team

---

## Critical Platform Constraints

### iOS 64 Notification Limit
- **Hard Limit:** iOS allows maximum 64 scheduled local notifications per app
- **Documentation:** Not prominently documented by Apple, discovered through testing
- **Behavior:** When scheduling >64 notifications, iOS silently drops extras (only first 64 are scheduled)
- **Detection:** Use `Notifications.getAllScheduledNotificationsAsync()` to verify count
- **Current Config:** 48 breathing + 7 mood = 55 total (9 notification safety margin)
- **Trade-off:** 3-day breathing coverage vs 7-day (Android has no such limit)

### Android No Limit
- **Constraint:** None for scheduled notifications
- **Current Config:** 112 breathing + 7 mood = 119 total
- **Coverage:** Full 7-day breathing and mood coverage
- **Battery:** HIGH priority prevents Android from batching/delaying notifications
