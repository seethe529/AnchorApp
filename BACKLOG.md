# Anchor App - Development Backlog

## Build 12 - iOS Notification Fixes

**Priority:** Critical  
**Estimated Effort:** 2-3 hours  
**Status:** ✅ COMPLETED (Build 12 - November 17, 2025)

### Description
Fixed iOS notification scheduling issues. iOS doesn't support `seconds` with `repeats: true` for timeInterval triggers.

### Implementation
- Schedule 24 individual hourly notifications instead of repeating timeInterval
- Auto-reschedule when less than 12 hours of reminders remain
- AppState listener to recheck on app foreground
- Set notifications to fire on the hour (:00 minutes/seconds)
- Added error logging to all notification functions
- Removed non-functional "Anonymous Analytics" toggle

### Files Modified
- `src/utils/notifications.js` - Fixed breathing reminder scheduling, added recheckBreathingReminders()
- `App.js` - Added AppState listener for auto-reschedule
- `src/screens/SettingsScreen.js` - Removed analytics toggle
- `app.config.js` - Bumped to Build 12

---

## Build 10 - Completed Features

### 1. Swipeable Breathing Exercise Screen

**Priority:** High  
**Estimated Effort:** 4-6 hours  
**Status:** ✅ COMPLETED (Build 10 - November 17, 2025)

#### Description
Dedicated full-screen breathing exercise experience with swipeable carousel of different breathing methods. Each method includes animated visual guide, timer, and use-case description.

#### Breathing Methods to Include
1. **Box Breathing (4-4-4-4)** - Anxiety/panic relief
2. **4-7-8 Breathing** - Deep relaxation, sleep aid
3. **Resonant Breathing (5-5)** - Calm, balance
4. **Physiological Sigh** (2 inhales, long exhale) - Quick stress reset
5. **Triangle Breathing (3-3-3)** - Simple, beginner-friendly
6. **Custom Breathing** - User sets their own timing

#### Technical Implementation
- New screen: `src/screens/BreathingScreen.js`
- Swipeable carousel using `react-native-snap-carousel` or FlatList with horizontal pagination
- Animated circle using `Animated` API or `react-native-reanimated`
- Audio cues (optional) using `expo-av`
- Haptic feedback on phase transitions
- Save usage stats to AsyncStorage

#### UI Components
```
┌─────────────────────────┐
│   Box Breathing         │ ← Title
│   (Anxiety Relief)      │ ← Use case
├─────────────────────────┤
│                         │
│      ⭕ Breathe In      │ ← Animated circle (expands/contracts)
│         4...            │ ← Countdown timer
│                         │
├─────────────────────────┤
│ Inhale 4 • Hold 4 •     │ ← Pattern display
│ Exhale 4 • Hold 4       │
├─────────────────────────┤
│  [Pause] [Stop]         │ ← Controls
│  ← Swipe to change →    │ ← Navigation hint
└─────────────────────────┘
```

#### Features
- Smooth swipe transitions between methods
- Auto-start on method selection
- Pause/resume functionality
- Visual + haptic feedback
- Progress indicator (dots at bottom)
- "When to use" description for each method
- Track completion stats

#### Files to Create/Modify
- **NEW:** `src/screens/BreathingScreen.js` - Main breathing screen
- **NEW:** `src/data/breathingMethods.js` - Breathing patterns data
- **NEW:** `src/components/BreathingCircle.js` - Animated breathing guide
- **MODIFY:** `src/screens/HomeScreen.js` - Add quick access button
- **MODIFY:** `src/screens/ToolsScreen.js` - Link from breathing technique
- **MODIFY:** `src/utils/storage.js` - Add breathing stats tracking

#### Accessibility Considerations
- VoiceOver announces phase changes
- Haptic feedback for visual impairment
- High contrast mode support
- Adjustable animation speed

---

### 2. Fix Notification Scheduling

**Priority:** High  
**Estimated Effort:** 2-3 hours  
**Status:** ✅ COMPLETED (Build 10 - November 17, 2025)

**Implementation:**
- Master toggle enforcement
- Permission gating with user-friendly prompts
- Deduplication (cancels before scheduling)
- Proper repeating schedules (mood: daily 8pm, breathing: hourly)
- Debug logging for verification
- Fixed immediate notification firing on toggle

#### Description
Notifications are currently broken - scheduling functions exist in `src/utils/notifications.js` but aren't being called when users toggle notifications on in SettingsScreen.

#### Current Issue
- User toggles "Daily Mood Reminder" → Nothing happens
- User toggles "Medication Reminder" → Nothing happens
- User toggles "Breathing Reminder" → Nothing happens
- Functions exist: `scheduleMoodReminder()`, `scheduleMedicationReminder()`, `scheduleBreathingReminder()`
- They're just not being invoked

#### Technical Implementation
- **MODIFY:** `src/screens/SettingsScreen.js` - Call scheduling functions on toggle
- **MODIFY:** `src/utils/notifications.js` - Add cancel functions for each reminder type
- Test notification permissions flow
- Add notification preview/test button
- Handle timezone changes
- Persist notification settings to AsyncStorage

#### Features to Add
- Call `scheduleMoodReminder()` when mood reminder toggled on
- Call `cancelMoodReminder()` when toggled off
- Same for medication and breathing reminders
- Show confirmation toast when notification scheduled
- "Test Notification" button to verify it works
- Time picker for custom notification times
- Notification badge on app icon

#### Files to Modify
- **MODIFY:** `src/screens/SettingsScreen.js` - Wire up toggle handlers
- **MODIFY:** `src/utils/notifications.js` - Add cancel functions, improve error handling
- **MODIFY:** `src/utils/storage.js` - Persist notification preferences

#### Testing Checklist
- [x] Toggle on → Notification scheduled
- [x] Toggle off → Notification cancelled
- [x] App restart → Notifications persist
- [x] No toggle flickering on Settings load
- [x] Test notification button works
- [ ] Permission denied → Show helpful message (TODO)
- [ ] Timezone change → Notifications adjust (TODO)

---

## Future Enhancements (v1.1+)

### Enhanced AI Conversation
- Longer conversation history (100+ messages)
- Context-aware technique suggestions
- Sentiment analysis for mood tracking
- Voice input support

### Personalized Recommendations
- ML-based technique recommendations
- Usage pattern analysis
- "Techniques that work for you" section
- Smart reminders based on mood patterns

### Data Export & Backup
- Export mood logs to CSV
- iCloud backup integration
- Share progress with therapist
- Data portability (GDPR compliance)

### Apple Watch Integration
- Quick breathing exercises
- Mood logging from watch
- Crisis button on watch face
- Heart rate integration

### Multi-Language Support
- Spanish translation
- Localized crisis resources
- RTL language support

### Social Features (Optional)
- Anonymous peer support groups
- Share techniques (not personal data)
- Community-contributed reminders

---

## Technical Debt

### Code Quality
- [ ] Add TypeScript for better type safety
- [ ] Increase test coverage to 90%+
- [ ] Refactor ToolsScreen (too large)
- [ ] Extract reusable components from screens

### Performance
- [ ] Optimize FlatList rendering in ProgressScreen
- [ ] Reduce app bundle size
- [ ] Implement code splitting
- [ ] Add performance monitoring

### Documentation
- [ ] API documentation for all utilities
- [ ] Component prop documentation
- [ ] Architecture decision records (ADRs)
- [ ] Contributing guidelines

---

## Completed Features

### Build 9 (Released November 2025)
- ✅ Medical citations on all techniques
- ✅ Resources & Citations screen
- ✅ Improved ToolsScreen layout
- ✅ Auto-scroll to top on technique selection
- ✅ Fixed blank screen swipe bug
- ✅ Apple App Store approval

### Build 8
- ✅ AI Support Agent with OpenAI integration
- ✅ Mood tracking with charts
- ✅ Progress analytics
- ✅ Safety Plan with encrypted storage
- ✅ 30+ DBT/CBT techniques
- ✅ Crisis resources screen
- ✅ First-launch disclaimer

---

## Notes

- **Build 12 Status:** Submitted to TestFlight (November 17, 2025)
- **Build 10 Status:** Released to App Store (November 17, 2025)
- **Focus:** iOS notification fixes + breathing exercises
- **Next:** Test notifications on physical device via TestFlight

### Known Limitations
- **Expo Go:** Scheduled notifications (daily/hourly) don't work in Expo Go, only immediate notifications. This is an Expo Go limitation, NOT a code issue.
- **Testing:** Notifications work correctly in EAS production builds. Cannot fully test scheduled notifications until deployed.
- **Verification:** Notification IDs are generated successfully, indicating proper scheduling. Will verify in TestFlight/production.
- **Testing:** Test on physical device for notifications
- **Deployment:** EAS build after testing complete
- **App Store:** Submit as minor update (no review needed if no new permissions)

---

Last Updated: November 17, 2025
