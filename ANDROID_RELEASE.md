# Android Release Documentation

## Version Information
- **Current Version:** 1.2.14 (Build 102)
- **Platform:** Android (Google Play Store)
- **Release Status:** Closed Testing
- **iOS Version:** 1.2.14 (Build 102)

## Platform Differences

### Configuration (`app.config.js`)

#### iOS-Specific
```javascript
ios: {
  bundleIdentifier: "com.anchor.ptsd-support",
  buildNumber: "102"
}
```

#### Android-Specific
```javascript
android: {
  package: "com.anchor.ptsdsupport",
  versionCode: 102,
  permissions: ["NOTIFICATIONS"]
}
```

### Key Differences

#### 1. **Version Numbering**
- **iOS:** Uses `buildNumber` (currently 54)
- **Android:** Uses `versionCode` (currently 60)
- **Reason:** Android testing required multiple builds (56-60) for bug fixes

#### 2. **Bundle Identifiers**
- **iOS:** `com.anchor.ptsd-support` (with hyphen)
- **Android:** `com.anchor.ptsdsupport` (no hyphen - Android convention)

#### 3. **Permissions**
- **iOS:** Declared in `infoPlist` with usage descriptions
- **Android:** Declared in `permissions` array
- **Current:** Only `NOTIFICATIONS` permission (removed `SCHEDULE_EXACT_ALARM` due to Google Play policy)

#### 4. **Notification Behavior**
- **iOS:** Exact timing with background refresh
- **Android:** Approximate timing (batched by system without exact alarm permission)

#### 5. **Notification Rescheduling (Build 61)**
- **iOS:** Hourly `setInterval` timer checks for date changes while app is open
  - Reschedules automatically every 24 hours
  - Short coverage: 16 breathing (1 day), 2 mood (2 days)
  - Explicitly cancels all notifications before rescheduling to prevent duplicates
- **Android:** `AppState` listener checks when app comes to foreground
  - Reschedules only when user opens app after date change
  - Long coverage: 112 breathing (7 days), 7 mood (7 days)
  - Handles users who don't open app frequently

## Recent Builds

### Build 102 (Current)
- **PDF Progress Report Export** — replaces old JSON export
- **Android date range picker** — two-step alert flow (Android only supports 3 buttons)
- **Lifetime AI message counter** — tracks user messages sent (not capped like conversation history)
- **Friendly PDF filename** — "Anchor Progress Report 2026-06-28.pdf"
- **Repeat export fix** — no longer crashes when exporting multiple times same day
- **Technique deduplication** — removes duplicate entries from reports

### Build 61 (Previous Stable)
- **Platform-Specific Notification Systems:** Separated iOS and Android notification logic
- **Android:** Kept AppState listener for foreground checks
- **Android Coverage:** 112 breathing (7 days), 7 mood (7 days) - infrequent app opens

## Android-Specific Fixes (Builds 56-61)

### Build 56
- Removed `USE_EXACT_ALARM` permission (Google Play rejection)
- Removed `SCHEDULE_EXACT_ALARM` permission initially

### Build 57
- Fixed white flash during navigation transitions
- Added `NavigationContainer` theme configuration
- Added `cardStyle` to Stack.Navigator

### Build 58 (Not Released)
- Attempted to restore `SCHEDULE_EXACT_ALARM` permission
- Skipped due to permission issues

### Build 59
- Added notification debug export tool in Settings
- Fixed notification date display bug in export function

### Build 60
- **Major Fix:** Added AppState listener for automatic notification rescheduling
- Notifications now auto-refresh when app opens after date change
- Extended breathing reminders from 16 (1 day) to 48 (3 days)
- Checks user preferences before rescheduling

### Build 61 (Previous)
- **Platform-Specific Notification Systems:** Separated iOS and Android notification logic
- **iOS:** Restored hourly setInterval timer (Build 54 system) with explicit cancellation
- **Android:** Kept AppState listener for foreground checks
- **iOS Coverage:** 16 breathing (1 day), 2 mood (2 days) - hourly reschedule
- **Android Coverage:** 112 breathing (7 days), 7 mood (7 days) - infrequent app opens
- **Fix:** Prevents duplicate notifications on iOS with explicit cancellation before reschedule

## Testing Requirements

### Google Play Closed Alpha
- **Minimum Testers:** 20
- **Testing Period:** 14 days
- **Current Status:** In progress (25+ testers)
- **Cost:** $40 for tester recruitment via testerscommunity.com

### Test Coverage
- ✅ Navigation (no white flash)
- ✅ Notifications (auto-reschedule working)
- ✅ Dark/Light theme toggle
- ✅ All 28 DBT/CBT techniques
- ✅ AI Support agent
- ✅ Crisis resources
- ✅ Breathing exercises
- ✅ Safety plan
- ✅ PDF Export (date range picker, file sharing)
- ✅ AI message counter

## Known Platform-Specific Issues

### Android
1. **Keyboard Size:** Android keyboards are larger, reducing visible chat area in AI Support
   - Status: Noted, waiting for tester feedback
   - Potential Fix: Adjust ScrollView margins for Android specifically

2. **Theme Persistence:** No issues reported (unlike iOS)

### iOS
1. **Theme Reset:** Dark mode occasionally resets after app updates
   - Cause: AsyncStorage cleared during update
   - Status: Minor, user can re-toggle

2. **Notification Duplicates:** Occasionally after updates
   - Cause: Old notifications not cleared before new ones scheduled
   - Status: Self-corrects after 24 hours

## Build Process

### Android Build Command
```bash
rm -rf .expo node_modules/.cache
eas build --platform android --profile production --non-interactive
```

### Verify Build
```bash
eas build:list --platform android --limit 1
```

### Output
- **File Type:** AAB (Android App Bundle)
- **Upload To:** Google Play Console → Closed Testing
- **Build Time:** ~8-12 minutes
- **Download:** Use the Application Archive URL from `eas build:list`

### Release Process
1. Build AAB with EAS
2. Verify build number with `eas build:list --platform android --limit 1`
3. Download AAB from the Application Archive URL
4. Upload to Google Play Console → Testing → Closed Testing
5. Add release notes
6. Submit for review (1-24 hours)
7. Share opt-in link with testers

## Code Differences

### Notification System (`src/utils/notifications.js`)
```javascript
// Platform-specific configuration (Build 61)
const MOOD_DAYS = Platform.OS === 'ios' ? 2 : 7;
const BREATHING_COUNT = Platform.OS === 'ios' ? 16 : 112;
const BREATHING_INTERVAL = 5400; // 90 minutes in seconds
```

### Platform-Specific Rescheduling (`App.js` - Build 61)
```javascript
// iOS: Hourly timer
if (Platform.OS === 'ios') {
  const timer = setInterval(async () => {
    const now = new Date();
    const last = await storage.getItem("last_reset") || 0;
    if (now.getDate() !== last) {
      // Cancel ALL notifications first to prevent duplicates
      await cancelBreathingReminder();
      await cancelMoodReminder();
      // Reschedule
      if (prefs.breathingReminders) await scheduleBreathingReminder();
      if (prefs.moodReminders) await scheduleMoodReminder();
      await storage.setItem("last_reset", now.getDate());
    }
  }, 3600000); // every hour
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

## Future Considerations

### Android-Specific Enhancements
1. **Material Design:** Consider Android-specific UI patterns
2. **Back Button:** Handle Android hardware back button
3. **Adaptive Icons:** Already configured in `app.config.js`
4. **Notification Channels:** Already configured for Android 8+

### Cross-Platform Parity
- Both platforms now on version 1.2.0
- Feature parity achieved
- Notification systems optimized per platform (Build 61):
  - iOS: Short coverage + hourly auto-reschedule
  - Android: Long coverage + foreground reschedule

## Deployment Timeline

### iOS
- **Released:** November 2024
- **Current Version:** 1.2.14 (Build 102)
- **Status:** Live on App Store / TestFlight

### Android
- **Alpha Testing Started:** December 3, 2025
- **Current Version:** 1.2.14 (Build 102)
- **Status:** Closed Testing

## Support & Troubleshooting

### Debug Tools
- **Export Notifications:** Settings → Data Management → Export Notifications
- **Shows:** Scheduled notifications, trigger dates, last reset date

### Common Issues
1. **Notifications Not Firing:**
   - Solution: Toggle breathing reminders OFF then ON in Settings
   - Or: Open app (triggers auto-reschedule if date changed)

2. **White Flash on Navigation:**
   - Fixed in Build 57
   - Update to latest version

3. **Theme Not Persisting:**
   - iOS only issue
   - Re-toggle dark mode after updates

## Contact
For Android-specific issues during testing, testers can provide feedback through:
- Google Play Console feedback
- Community testing platform
- Direct contact with development team

---

**Last Updated:** June 28, 2026  
**Document Version:** 1.2 (Build 102 - PDF Export & Android Fixes)  
**Maintained By:** Development Team
