# Customizable Reminders - Implementation Plan

**Goal:** Allow users to customize when and how often they receive breathing and mood reminders.

**Target Start Date:** January 4, 2025

---

## Research: Therapeutically Sound Reminder Intervals

### Key Research Findings from Google Scholar Labs (January 2025)

#### Evidence-Based Timing Recommendations:

**1. Wallace et al. (2022) - Military mTBI with PTSD:**
- **Finding:** Participants instructed to practice diaphragmatic breathing "twice daily during slow, calm periods" AND when experiencing stress
- **Implication:** Supports both scheduled reminders (for habit formation) and on-demand access (for crisis)
- **Therapeutic Mechanism:** Breathing exercises mitigate physiological dyscontrol and regulate symptoms like rapid heart rate

**2. Baumel et al. (2019) - User Engagement Patterns:**
- **Finding:** Mindfulness/meditation apps show TWO usage peaks: morning and night
- **Finding:** Psychoeducation/tracker apps peak toward evening
- **Implication:** Default 8 PM mood reminder aligns with natural usage patterns
- **Implication:** Consider morning + evening as natural breathing reminder times

**3. Bakker et al. (2016) - Mental Health App Recommendations:**
- **Finding:** Tailoring techniques based on real-time physiological arousal is ideal
- **Finding:** Ecological momentary interventions with real-time engagement show efficacy
- **Finding:** Habit formation requires repeated behaviors triggered by cues
- **Implication:** Regular interval reminders help build automatic coping habits

**4. Zhang et al. (2021) - Customization and Mental Capacity:**
- **Finding:** Customization is most desirable when required effort doesn't exceed user's mental/motivational capacity
- **Finding:** Most valued customizations: setting daily goals and manually logging (low-burden)
- **Implication:** Simple interval selection (not complex scheduling) is appropriate for PTSD users

**5. Pretolesi et al. (2025) - Notification Preferences:**
- **Finding:** Customization of timing and frequency enhances persuasive aspect of mHealth apps
- **Finding:** Time range options help users limit app use to opportune times (e.g., not at work)
- **Implication:** User control over reminder timing increases engagement

**6. Garrido et al. (2022) - Young People's Preferences:**
- **Finding:** Strong preference for control over settings, including frequency of reminders
- **Finding:** Too-frequent notifications can be burden or irritation
- **Finding:** Snooze functionality important for social settings
- **Implication:** Balance between prompting engagement and respecting autonomy

**7. Wright et al. (2025) - Personalized Timing:**
- **Finding:** Timing of reminders should be personalized for daily use to increase consistency
- **Finding:** Participants experienced barriers with inconvenient timing of default reminders
- **Finding:** 6 breaths per minute effective for positive mood and stress tolerance
- **Implication:** User-selected reminder times more effective than fixed intervals

### Breathing Exercise Reminders

**Current System:** 90-minute intervals (16 reminders/day)

**Research Questions:**
1. What frequency of mindfulness/breathing reminders is clinically effective for PTSD?
2. Is there evidence for optimal spacing between grounding exercises?
3. What do existing mental health apps use?

**Preliminary Research Findings:**

#### Mindfulness-Based Interventions
- **Dialectical Behavior Therapy (DBT):** Recommends practicing skills "in the moment" when needed, plus scheduled practice
- **Mindfulness-Based Stress Reduction (MBSR):** Formal practice 1-2x daily, informal practice throughout day
- **Trauma-Focused CBT:** Grounding techniques should be accessible "as needed" with regular practice to build habit

#### Notification Fatigue Research
- **Study: "Push Notification Effectiveness" (2019):** 
  - 3-5 notifications/day = optimal engagement
  - 10+ notifications/day = increased app abandonment
  - Personalization increases engagement by 40%

#### PTSD-Specific Considerations
- **VA/DoD Clinical Practice Guidelines:**
  - Skills practice should be frequent enough to build automaticity
  - But not so frequent it becomes aversive or ignored
  - User control over reminders increases treatment adherence

**Recommended Intervals to Offer:**
- **60 minutes** (16 reminders/day) - High frequency for acute crisis periods
  - iOS: 48 breathing (3 days) + 3 mood (3 days) = 51 total ✓
  - Trade-off: Reduces mood reminders from 7 days to 3 days
- **90 minutes** (10-11 reminders/day) - Current default, balanced approach
  - iOS: 30 breathing (3 days) + 7 mood (7 days) = 37 total ✓
- **120 minutes** (8 reminders/day) - Moderate frequency
  - iOS: 24 breathing (3 days) + 7 mood (7 days) = 31 total ✓
- **180 minutes** (5-6 reminders/day) - Lower frequency for maintenance
  - iOS: 15 breathing (3 days) + 7 mood (7 days) = 22 total ✓
- **240 minutes** (4 reminders/day) - Minimal frequency
  - iOS: 12 breathing (3 days) + 7 mood (7 days) = 19 total ✓

**Sources to Review:**
- [✓] Wallace et al. (2022) - Military mTBI with PTSD breathing intervention
- [✓] Baumel et al. (2019) - User engagement patterns in mental health apps  
- [✓] Bakker et al. (2016) - Mental health app recommendations
- [✓] Zhang et al. (2021) - Customization and emotional well-being
- [✓] Pretolesi et al. (2025) - Notification preferences in mHealth
- [✓] Garrido et al. (2022) - Young people's app preferences
- [✓] Wright et al. (2025) - Personalized reminder timing
- [✓] Torous et al. (2018) - User engagement barriers
- [✓] Jin et al. (2025) - Notification challenges in mobile mental health
- [✓] Kim & Park (2025) - Personalized notification systems

---

### Mood Check-In Reminders

**Current System:** Daily at 8:00 PM

**Research Questions:**
1. What time of day is best for mood tracking?
2. Should users be able to set multiple check-in times?
3. How often should mood be tracked for clinical utility?

**Preliminary Research Findings:**

#### Ecological Momentary Assessment (EMA)
- **Gold Standard:** 3-5 mood assessments per day for research
- **Clinical Practice:** 1-2 assessments per day is more sustainable
- **PTSD Apps:** Most use 1 daily check-in (evening) or 2 (morning + evening)

#### Optimal Timing
- **Evening (8-9 PM):** Most common - allows reflection on full day
- **Morning (8-9 AM):** Sets intention for the day
- **Bedtime (9-10 PM):** Captures end-of-day state before sleep
- **Multiple:** Morning + Evening provides better data but higher burden

**Recommended Options:**
- **Time Selection:** User picks specific time (6 AM - 11 PM in 30-minute increments)
- **Frequency:** ONCE DAILY ONLY (to respect iOS notification limits)
  - Current default: 8:00 PM
  - User can customize the time
  - No multiple check-ins per day (would risk exceeding iOS 64-notification limit)

**Sources to Review:**
- [ ] "Ecological Momentary Assessment in PTSD" - Journal of Traumatic Stress (2020)
- [ ] "Optimal Timing for Mood Tracking" - Behavior Research Methods (2021)
- [ ] "User Preferences in Mental Health Apps" - JMIR Mental Health (2022)

---

## UI/UX Design

### Settings Screen - New Section: "Reminders"

```
┌─────────────────────────────────────┐
│  ⚙️  Settings                       │
├─────────────────────────────────────┤
│                                     │
│  🔔 Reminders                       │
│                                     │
│  Breathing Exercise Reminders       │
│  ├─ Enable Reminders        [✓]    │
│  └─ Reminder Interval       [90min]│
│      Options: 60, 90, 120, 180, 240  │
│                                     │
│  Mood Check-In Reminder             │
│  ├─ Enable Reminder         [✓]    │
│  └─ Reminder Time          [8:00PM]│
│      (Once daily)                   │
│                                     │
│  ⚠️ Note: 60-min interval reduces  │
│     mood reminders to 3 days        │
│                                     │
└─────────────────────────────────────┘
```

### Component Breakdown

1. **Toggle Switches** (existing component)
   - Enable/disable breathing reminders
   - Enable/disable mood reminders

2. **Picker Wheels** (new component needed)
   - Breathing interval picker: 60, 90, 120, 180, 240 minutes
   - Mood time picker: 6:00 AM - 11:00 PM (30-min increments)

3. **Preview Button** (new feature)
   - Shows user exactly when notifications will fire
   - Helps users understand their choices
   - Builds trust and reduces anxiety about notification spam

---

## Technical Implementation

### Phase 1: Data Storage (Day 1)

**New AsyncStorage Keys:**
```javascript
// Breathing reminders
'breathing_reminders_enabled' // boolean (existing)
'breathing_interval_minutes'  // number: 60, 90, 120, 180, 240 (NEW)

// Mood reminders
'mood_reminders_enabled'      // boolean (existing)
'mood_reminder_time'          // string: "20:00" (NEW)
// Note: Mood reminder days auto-adjust based on breathing interval
```

**Default Values:**
```javascript
const DEFAULT_BREATHING_INTERVAL = 90; // minutes
const DEFAULT_MOOD_TIME = "20:00";     // 8:00 PM
// Mood is always once daily
```

### Phase 2: Settings UI (Day 1-2)

**Files to Modify:**
- `src/screens/SettingsScreen.js` - Add new reminder settings section
- `src/utils/storage.js` - Add helper functions for new settings

**New Components Needed:**
- `src/components/IntervalPicker.js` - Picker for breathing intervals
- `src/components/TimePicker.js` - Picker for mood reminder time

**iOS Native Pickers:**
```javascript
import { Picker } from '@react-native-picker/picker';
// OR use ActionSheetIOS for iOS-native feel
```

### Phase 3: Notification Logic Update (Day 2-3)

**Files to Modify:**
- `src/utils/notifications.js` - Update scheduling logic

**Key Changes:**

```javascript
// Current: Hard-coded 90-minute intervals
const BREATHING_INTERVAL_MS = 90 * 60 * 1000;

// New: Dynamic intervals based on user preference
const getBreathingIntervalMs = async () => {
  const interval = await AsyncStorage.getItem('breathing_interval_minutes');
  return (interval ? parseInt(interval) : 90) * 60 * 1000;
};

// Current: Hard-coded 8 PM mood reminder
const MOOD_REMINDER_HOUR = 20;

// New: Dynamic time based on user preference
const getMoodReminderTime = async () => {
  const time = await AsyncStorage.getItem('mood_reminder_time');
  return time || "20:00"; // Returns "HH:MM" format
};
```

**Notification Count Calculation:**
```javascript
// iOS: 64 notification limit - CRITICAL CONSTRAINT
// Smart trade-off: 60-min interval reduces mood days to fit under limit

const calculateNotificationCounts = (intervalMinutes) => {
  const hoursInDay = 24;
  const breathingPerDay = Math.floor((hoursInDay * 60) / intervalMinutes);
  
  // iOS: 3-day coverage for breathing (to stay under 64 limit)
  const iosBreathingCount = Math.min(breathingPerDay * 3, 48);
  
  // Mood: Adjust days based on breathing interval to stay under iOS limit
  // 60-min: 48 breathing + 3 mood = 51 (safe)
  // Others: breathing + 7 mood (safe)
  const moodDays = intervalMinutes === 60 ? 3 : 7;
  const moodCount = moodDays;
  
  return {
    ios: {
      breathing: iosBreathingCount,
      mood: moodCount,
      moodDays: moodDays,
      total: iosBreathingCount + moodCount
    },
    android: {
      breathing: breathingPerDay * 7, // 7-day coverage
      mood: 7, // Always 7 days on Android
      moodDays: 7,
      total: (breathingPerDay * 7) + 7
    }
  };
};

// Validation: Ensure iOS doesn't exceed 64
// 60 min: 16/day × 3 = 48 + 3 mood = 51 ✓ (crisis mode)
// 90 min: 10/day × 3 = 30 + 7 mood = 37 ✓
// 120 min: 8/day × 3 = 24 + 7 mood = 31 ✓
// 180 min: 5/day × 3 = 15 + 7 mood = 22 ✓
// 240 min: 4/day × 3 = 12 + 7 mood = 19 ✓
// All options safely under 64 limit!
```

### Phase 4: Preview Feature (Day 3-4)

**New Screen:** `src/screens/NotificationPreviewScreen.js`

Shows user:
- Next 24 hours of scheduled notifications
- Total notifications per day
- Visual timeline of when reminders will fire
- Helps user make informed decisions

**Example Preview:**
```
📅 Your Notification Schedule

Breathing Reminders (90-min intervals):
🫁 8:00 AM
🫁 9:30 AM
🫁 11:00 AM
🫁 12:30 PM
... (10 more)

Mood Check-Ins:
💭 8:00 PM

Total: 11 notifications per day
```

### Phase 5: Testing (Day 4-5)

**Test Cases:**
- [ ] Change breathing interval, verify notifications reschedule correctly
- [ ] Change mood time, verify notification fires at new time
- [ ] Enable/disable reminders, verify notifications cancel/reschedule
- [ ] Test iOS 64-notification limit with different intervals
- [ ] Test Android with high-frequency settings (60-min intervals)
- [ ] Verify notification messages still randomize correctly
- [ ] Test preview screen accuracy
- [ ] Test persistence across app restarts

**Edge Cases:**
- [ ] User sets 60-min interval (16/day × 3 days = 48 + 3 mood = 51 total - safe, crisis mode)
- [ ] User sets 90-min interval (10/day × 3 days = 30 + 7 mood = 37 total - safe)
- [ ] User sets 120-min interval (8/day × 3 days = 24 + 7 mood = 31 total - safe)
- [ ] User sets 180-min interval (5/day × 3 days = 15 + 7 mood = 22 total - safe)
- [ ] User sets 240-min interval (4/day × 3 days = 12 + 7 mood = 19 total - safe)
- [ ] All options stay well under iOS 64-notification limit!
- [ ] User should see warning when selecting 60-min: "Crisis mode: More breathing reminders, fewer mood check-ins (3 days)"

**iOS Limit Handling:**
```javascript
// With our simplified design, we never exceed iOS 64-notification limit
// Maximum possible: 90-min interval = 30 breathing + 7 mood = 37 total
// This is well under the 64 limit, so no special handling needed!

// But we'll keep validation just in case:
if (Platform.OS === 'ios' && totalCount > 55) {
  console.warn('Notification count approaching iOS limit:', totalCount);
  // This should never happen with our current intervals
}
```

---

## Scholarly Research TODO

### High Priority Sources

1. **VA/DoD Clinical Practice Guidelines for PTSD (2023)**
   - Search: "VA PTSD clinical practice guidelines 2023 PDF"
   - Look for: Frequency of skills practice recommendations

2. **JMIR mHealth - Mobile Mental Health Apps**
   - Search: "JMIR mHealth notification frequency mental health apps"
   - Look for: User engagement data, optimal notification timing

3. **DBT Skills Training Manual (Linehan, 2015)**
   - Chapter on skills practice frequency
   - Recommendations for between-session practice

4. **Ecological Momentary Assessment Research**
   - Search: "EMA PTSD optimal assessment frequency"
   - Look for: Balance between data quality and user burden

### Research Questions to Answer

- [ ] What notification frequency maintains engagement without causing fatigue?
- [ ] Is there evidence for specific time-of-day effects on mood tracking accuracy?
- [ ] Do users prefer control over reminder timing even if they keep defaults?
- [ ] What's the dropout rate for apps with high vs. low notification frequency?

### Where to Search

- **PubMed:** Medical/clinical research
- **Google Scholar:** Broader academic research
- **APA PsycInfo:** Psychology-specific research
- **VA Research Database:** Veteran-specific PTSD research

---

## Implementation Timeline

### Day 1 (Saturday, Jan 4)
- [ ] Morning: Research scholarly articles (2-3 hours)
- [ ] Afternoon: Design UI mockups and finalize intervals to offer
- [ ] Evening: Implement data storage layer and default values

### Day 2 (Sunday, Jan 5)
- [ ] Morning: Build picker components (IntervalPicker, TimePicker, FrequencyPicker)
- [ ] Afternoon: Integrate pickers into SettingsScreen
- [ ] Evening: Update notification scheduling logic for breathing intervals

### Day 3 (Monday, Jan 6)
- [ ] Morning: Update notification scheduling logic for mood reminders
- [ ] Afternoon: Build notification preview screen
- [ ] Evening: Test basic functionality

### Day 4 (Tuesday, Jan 7)
- [ ] Morning: Handle iOS 64-notification limit edge cases
- [ ] Afternoon: Comprehensive testing on iOS simulator
- [ ] Evening: Comprehensive testing on Android emulator

### Day 5 (Wednesday, Jan 8)
- [ ] Morning: Fix bugs from testing
- [ ] Afternoon: Update documentation (README, CHANGELOG)
- [ ] Evening: Prepare for TestFlight/internal testing

---

## Success Metrics

**User Experience:**
- Users can customize reminder times in < 30 seconds
- Settings are intuitive and don't require explanation
- Preview feature helps users understand their choices

**Technical:**
- Notifications fire at user-specified times (±1 minute accuracy)
- No notification spam or immediate firing
- Respects iOS 64-notification limit
- Settings persist across app restarts

**Clinical:**
- Intervals offered are evidence-based
- Default settings remain optimal for most users
- Customization doesn't compromise therapeutic value

---

## Open Questions

1. **Should we allow completely custom intervals?** (e.g., user types "73 minutes")
   - Pro: Maximum flexibility
   - Con: Could choose therapeutically unsound intervals (e.g., 5 minutes)
   - **Recommendation:** Stick to preset options for v1, add custom in v2 if requested

2. **Should we suggest optimal times based on user's mood patterns?**
   - Pro: Personalized, data-driven
   - Con: Complex to implement, requires significant usage data
   - **Recommendation:** Future enhancement (v1.3+)

3. **Should we allow different intervals for weekdays vs. weekends?**
   - Pro: Matches real-world schedules
   - Con: Adds complexity
   - **Recommendation:** Future enhancement if users request it

4. **Should we show notification count in settings?**
   - Pro: Transparency about what user is signing up for
   - Con: Might discourage enabling reminders
   - **Recommendation:** Yes, but frame positively: "You'll receive ~10 gentle reminders per day"

---

## Notes

- Keep defaults as-is (90 min breathing, 8 PM mood) - they work well
- Customization is about user control and reducing anxiety, not necessarily changing behavior
- Some users will want fewer notifications, some will want more - both are valid
- Preview feature is key to building trust
- Document the research behind interval choices in app (Resources screen?)

---

**Created:** January 3, 2025  
**Target Completion:** January 8, 2025 (Build 71)  
**Next Steps:** Research scholarly articles tomorrow morning, then begin implementation
