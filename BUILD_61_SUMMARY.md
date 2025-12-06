# Build 61 - Platform-Specific Notification System

**Date:** December 5, 2025  
**Version:** 1.2.0 (Build 61)  
**Branch:** android-release

---

## Summary

Implemented platform-specific notification rescheduling systems optimized for iOS and Android's different behaviors and constraints.

---

## Changes

### 1. Platform-Specific Rescheduling Logic (`App.js`)

**iOS System:**
- Hourly `setInterval` timer (3600000ms)
- Checks for date changes while app is open
- Explicitly cancels all notifications before rescheduling to prevent duplicates
- Runs in foreground and background

**Android System:**
- `AppState` listener
- Checks for date changes only when app comes to foreground
- Optimized for battery life (no background timers)

```javascript
// iOS: Hourly timer
if (Platform.OS === 'ios') {
  const timer = setInterval(async () => {
    // Check date and reschedule
  }, 3600000);
  return () => clearInterval(timer);
}

// Android: AppState listener
else if (Platform.OS === 'android') {
  const subscription = AppState.addEventListener('change', (nextAppState) => {
    if (nextAppState === 'active') {
      checkAndReschedule();
    }
  });
  return () => subscription.remove();
}
```

### 2. Platform-Specific Coverage (`src/utils/notifications.js`)

**iOS Configuration:**
- `MOOD_DAYS = 2` (2 days)
- `BREATHING_COUNT = 16` (1 day / 24 hours)
- Rationale: Hourly timer ensures daily rescheduling

**Android Configuration:**
- `MOOD_DAYS = 7` (7 days)
- `BREATHING_COUNT = 112` (7 days / 168 hours)
- Rationale: Handles users who don't open app frequently

```javascript
const MOOD_DAYS = Platform.OS === 'ios' ? 2 : 7;
const BREATHING_COUNT = Platform.OS === 'ios' ? 16 : 112;
const BREATHING_INTERVAL = 5400; // 90 minutes (same for both)
```

### 3. Duplicate Prevention (iOS)

Added explicit cancellation before rescheduling:

```javascript
// Cancel ALL notifications first to prevent duplicates
await cancelBreathingReminder();
await cancelMoodReminder();
// Then reschedule if user has them enabled
if (prefs.breathingReminders) await scheduleBreathingReminder();
if (prefs.moodReminders) await scheduleMoodReminder();
```

### 4. Updated Export Function

Updated `exportScheduledNotifications()` to document both systems:

```javascript
rescheduleSystem: {
  platform: Platform.OS,
  ios: {
    method: 'setInterval timer',
    checkInterval: '3600000ms (1 hour)',
    breathingCount: 16,
    moodDays: 2
  },
  android: {
    method: 'AppState listener',
    checkInterval: 'On app foreground',
    breathingCount: 112,
    moodDays: 7
  }
}
```

---

## Testing

### Unit Tests Created

**File:** `src/__tests__/notifications.test.js`  
**Tests:** 35 passing

**Coverage:**
- ✅ Permission requests (iOS/Android)
- ✅ Mood reminder scheduling (iOS: 2 days, Android: 7 days)
- ✅ Breathing reminder scheduling (iOS: 16, Android: 112)
- ✅ Cancellation logic (mood/breathing separate)
- ✅ Clear all notifications
- ✅ Export scheduled notifications
- ✅ Platform-specific configuration
- ✅ Error handling
- ✅ 8 PM skip logic
- ✅ 90-minute intervals
- ✅ Randomized messages

### Test Results

```
Test Suites: 10 total (5 failed pre-existing, 5 passed)
Tests:       66 passed, 66 total
Notifications: 35 passed, 35 total
```

---

## Documentation

### Files Created/Updated

1. **NOTIFICATION_SYSTEM.md** (New)
   - Complete technical documentation
   - Platform-specific design rationale
   - Configuration details
   - Debugging tools
   - Troubleshooting guide
   - Testing checklists

2. **ANDROID_RELEASE.md** (Updated)
   - Added Build 61 section
   - Platform-specific notification details
   - Code examples
   - Updated version to 1.1

3. **BUILD_61_SUMMARY.md** (This file)
   - Change summary
   - Testing results
   - Migration notes

---

## Benefits

### iOS
- ✅ Automatic daily rescheduling (no user action needed)
- ✅ Short coverage reduces notification clutter
- ✅ Explicit cancellation prevents duplicate branches
- ✅ Hourly checks ensure notifications never expire

### Android
- ✅ Long coverage handles infrequent app opens
- ✅ No background battery drain
- ✅ Respects Android battery optimization
- ✅ Works without exact alarm permissions

### Both Platforms
- ✅ Respects user preferences
- ✅ Comprehensive error handling
- ✅ Debug export tool
- ✅ Extensive unit test coverage

---

## Edge Cases Handled

1. **User doesn't open app (Android)**
   - 7-day coverage handles most users
   - Notifications stop after 7 days (expected)

2. **App force-quit (iOS)**
   - Timer stops, but 1-day coverage usually sufficient
   - Reschedules when app reopens

3. **Past 8 PM rescheduling**
   - Skips today, schedules for tomorrow
   - Prevents immediate notification spam

4. **Timezone changes**
   - Uses device local time
   - Adjusts automatically

5. **Permission denied**
   - Graceful fallback
   - No crashes

---

## Migration Notes

### From Build 60 to Build 61

**No breaking changes** - automatic migration:

1. iOS users will see notifications switch from 3-day to 1-day coverage
2. Android users will see notifications extend from 3-day to 7-day coverage
3. iOS users will benefit from hourly auto-reschedule (was AppState only)
4. No user action required

### Testing Recommendations

**iOS:**
1. Enable breathing reminders
2. Verify 16 notifications scheduled
3. Leave app open for 1+ hours
4. Check console for hourly date checks
5. Verify no duplicate notifications

**Android:**
1. Enable breathing reminders
2. Verify 112 notifications scheduled
3. Close app for 24+ hours
4. Reopen app
5. Check console for reschedule
6. Verify notifications refreshed

---

## Known Limitations

1. **iOS:** Requires app to be open (foreground or background) for hourly timer
2. **Android:** Requires user to open app for rescheduling
3. **Both:** No server-side push (future enhancement)
4. **Android:** Notifications may be batched/delayed without exact alarm permission

---

## Future Enhancements

1. **Server-Side Push:** Eliminate coverage limits entirely
2. **Background Tasks:** Android WorkManager for periodic checks
3. **Adaptive Scheduling:** Learn user's app usage patterns
4. **Smart Timing:** Avoid notifications during sleep hours
5. **Notification History:** Track delivery success

---

## Files Modified

- `App.js` - Platform-specific rescheduling logic
- `src/utils/notifications.js` - Platform-specific constants and export
- `jest.setup.js` - Added Platform and Notifications mocks
- `src/__tests__/notifications.test.js` - New test file (35 tests)
- `ANDROID_RELEASE.md` - Updated with Build 61 details
- `NOTIFICATION_SYSTEM.md` - New comprehensive documentation
- `BUILD_61_SUMMARY.md` - This file

---

## Deployment

### Build Commands

**iOS:**
```bash
eas build --platform ios --profile production
```

**Android:**
```bash
eas build --platform android --profile production
```

### Version Numbers

- **iOS:** 1.2.0 (Build 54) - No change needed
- **Android:** 1.2.0 (Build 61) - Updated in app.config.js

---

## Rollback Plan

If issues arise, revert to Build 60:

```bash
git revert HEAD
```

Build 60 used AppState listener for both platforms with 3-day coverage.

---

**Status:** ✅ Ready for Testing  
**Next Steps:** Deploy to closed alpha testers  
**Estimated Testing Time:** 7 days (to verify Android 7-day coverage)

---

**Prepared By:** Development Team  
**Reviewed By:** Pending  
**Approved By:** Pending
