# Anchor App - Development Backlog

## Build 10 - Planned Features

### 1. Swipeable Breathing Exercise Screen

**Priority:** High  
**Estimated Effort:** 4-6 hours  
**Status:** Planned

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
**Status:** Planned

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
- [ ] Toggle on → Notification scheduled
- [ ] Toggle off → Notification cancelled
- [ ] App restart → Notifications persist
- [ ] Permission denied → Show helpful message
- [ ] Timezone change → Notifications adjust
- [ ] Background/foreground behavior

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

- **Build 10 Focus:** Breathing exercises + Notifications
- **Timeline:** Next week (estimated 6-9 hours total)
- **Testing:** Test on physical device for notifications
- **Deployment:** EAS build after testing complete
- **App Store:** Submit as minor update (no review needed if no new permissions)

---

Last Updated: November 2025
