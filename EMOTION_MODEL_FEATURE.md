# Emotion Model Feature - Development Documentation

## Branch Information
- **Branch Name**: `feature/emotion-model-dev`
- **Base Branch**: `main`
- **Status**: In Development
- **Created**: December 2025

## Feature Overview
Implementation of a trauma-informed 3-tier emotion taxonomy alongside the existing 5-point mood scale. This provides users with optional detailed emotion logging that maps to the existing valence scale for backward-compatible graphing.

## Architecture

### Dual Mood Logging System
1. **Quick Log (Default)**: 5-point scale with emoji faces (😢 😟 😐 🙂 😊)
   - Maps to mood values 1-5
   - Immediate, low-friction logging
   - Triggered by 8 PM daily reminders

2. **Detailed Log (Optional)**: 3-tier emotion model
   - Primary → Secondary → Tertiary (optional) → Notes (optional)
   - Maps to valence 1-5 via `getEmotionValence()` function
   - Accessed via CTA after quick log: "Add Emotional Details"

### Emotion Model Structure
**6 Primary Emotions** (each with 6 secondary emotions, each with 2 tertiary options):
- Activated / Protective (😡) → Valence 2
- Fearful / Unsafe / Alerted (😨) → Valence 2
- Joy / Positive Activation (😊) → Valence 5
- Empowered / Capable (💪) → Valence 4
- Calm / Grounded / Connected (😌) → Valence 4
- Low / Heavy / Withdrawn (😢) → Valence 1

## Key Files

### New Files Created
- `src/data/emotionModel.js` - Emotion taxonomy + valence mapping function
- `src/components/DetailedMoodLog.js` - Progressive disclosure UI for emotion selection

### Modified Files
- `src/components/MoodTracker.js` - Added CTA display after logging
- `src/screens/HomeScreen.js` - Complex state management for workflow
- `src/screens/ProgressScreen.js` - Updated to handle both log types + chart improvements

## Data Structure

### Quick Mood Log Entry
```javascript
{
  type: 'quick',
  mood: 4,              // 1-5 scale
  moodName: 'Good',
  timestamp: '2025-12-09T...',
  date: '2025-12-09'
}
```

### Detailed Emotion Log Entry
```javascript
{
  type: 'detailed',
  primary: 'Fearful / Unsafe / Alerted',
  primaryEmoji: '😨',
  secondary: 'Anxious',
  tertiary: 'Restless',        // optional
  notes: 'User notes...',      // optional
  valence: 2,                  // calculated from primary
  mood: 2,                     // for compatibility
  moodName: 'Fearful / Unsafe / Alerted',
  timestamp: '2025-12-09T...',
  date: '2025-12-09'
}
```

## User Workflow

### First-Time Mood Log (Top of Home Screen)
1. User sees MoodTracker at top of HomeScreen
2. User clicks emoji (e.g., 😊 "Excellent")
3. Quick log saved with mood=5
4. CTA appears: "✓ Mood logged" + "Add Emotional Details" button + "Skip" button
5. **Option A**: User clicks "Add Emotional Details"
   - DetailedMoodLog opens
   - User selects Primary → Secondary → Optional Tertiary → Optional Notes
   - Detailed log saved with valence=5
   - **Quick log is deleted** (prevents duplicate/averaged data)
   - Tracker hides, recentMood set
6. **Option B**: User clicks "Skip"
   - Quick log remains
   - Tracker hides, recentMood set

### Subsequent Mood Logs (Bottom of Home Screen)
1. User clicks "Log Another Mood Entry" button
2. MoodTracker appears at bottom
3. Same workflow as above

## Critical Implementation Details

### Preventing Duplicate Logs
**Problem**: User clicks "Excellent" (mood=4), then adds detailed emotion "Fearful" (valence=2). Graph was averaging them: (4+2)/2=3, showing misleading data.

**Solution**: `DetailedMoodLog.js` filters out today's quick logs before saving:
```javascript
const filteredLogs = existingLogs.filter(log => 
  log.date !== dateString || log.type === 'detailed'
);
```

### State Management Complexity
**HomeScreen.js** uses multiple state variables to control visibility:
- `showMoodTracker` - Controls tracker visibility
- `showDetailedLog` - Controls detailed log visibility
- `todayMoodLogged` - Marks if any log exists today
- `recentMood` - Stores most recent log, controls bottom section visibility

**Key Logic**: `recentMood` is only set AFTER user clicks "Skip" or completes detailed log. This keeps the top tracker mounted during CTA display.

### Graph Compatibility
**ProgressScreen.js** `processMoodData()` handles both log types:
```javascript
const avgMood = dayLogs.reduce((sum, log) => {
  return sum + (log.mood || log.valence || 0);
}, 0) / dayLogs.length;
```

## UI/UX Decisions

### Trauma-Informed Language
- Emotion labels are respectful and clinical
- No harsh synonyms added (per user request)
- Optional tertiary selection (not required)
- No intensity slider (keeps it simple)

### Chart Display
- Auto-scaling Y-axis (react-native-chart-kit limitation)
- Added "Scale: 1 (Low) to 5 (Excellent)" label for context
- Chart shifted left for better centering
- Whole number Y-axis labels (decimalPlaces: 0)

### Progressive Disclosure
DetailedMoodLog uses 4-step flow:
1. Primary emotion selection (6 options with emoji)
2. Secondary emotion selection (6 options)
3. Tertiary emotion selection (2 options, optional with Skip)
4. Notes input (optional)

Back navigation available at each step.

## Known Limitations

### Chart Library Constraints
`react-native-chart-kit` doesn't support fixed Y-axis min/max values. Attempted workarounds:
- Adding invisible constraint values (0, 5) → Created fake data points
- Using `formatYLabel` → Ignored by library
- Using `fromZero` + `segments` → Still auto-scales

**Current Solution**: Auto-scaling with context label. When user has varied data (1-5 range), chart will naturally show full scale.

## Testing Considerations

### Test Scenarios
1. ✅ Quick log only (click emoji, click Skip)
2. ✅ Quick log → Detailed log (emoji → Add Details → complete flow)
3. ✅ Multiple logs same day (should show in bottom section)
4. ✅ Detailed log replaces quick log (no duplicate data)
5. ✅ Graph displays both log types correctly
6. ✅ First-time workflow (top tracker → CTA → hide)
7. ✅ Subsequent workflow (bottom button → tracker → CTA)

### Edge Cases
- User clicks emoji then immediately navigates away (quick log saved)
- User starts detailed log then clicks Cancel (quick log remains)
- User has old quick logs from before feature (still display correctly)

## Future Enhancements (Phase 2)

### Emotion Frequency Charts
Once enough detailed emotion data exists:
- Bar chart showing most frequent primary emotions
- Heatmap of secondary emotions over time
- Insights: "You felt 'Anxious' 12 times this month"

### Data Export
- CSV export with both quick and detailed logs
- Separate columns for mood vs. valence
- Include full emotion taxonomy path

### AI Integration
- AI Agent could suggest techniques based on logged emotions
- "I see you've been feeling 'Overwhelmed' lately. Try TIPP technique?"

## iOS Platform Constraints
- iOS has 64 scheduled notification limit (documented in NOTIFICATION_SYSTEM.md)
- Current: 48 breathing + 7 mood = 55 notifications (within limit)

## Git Workflow
```bash
# Current branch
git branch
# feature/emotion-model-dev

# Commit pattern
git add .
git commit -m "Fix: [description]"
git push origin feature/emotion-model-dev

# When ready to merge
git checkout main
git pull origin main
git merge feature/emotion-model-dev
git push origin main
```

## Dependencies
No new dependencies added. Uses existing:
- React Native core components
- AsyncStorage (via `src/utils/storage.js`)
- Expo Linear Gradient (for buttons)
- React Navigation (for screen flow)

## Performance Notes
- Emotion model data is static (no API calls)
- `getEmotionValence()` is O(1) lookup
- MoodTracker and DetailedMoodLog use `memo()` for optimization
- Storage operations are async but fast (local only)

## Accessibility
- All buttons have `accessibilityLabel` and `accessibilityRole`
- Emotion labels are screen-reader friendly
- High contrast colors maintained in both light/dark modes
- Touch targets meet minimum size requirements (44x44pt)

## Documentation Updates Needed
- [ ] Update README.md with emotion model feature
- [ ] Update CHANGELOG.md with version bump
- [ ] Add emotion model to app store description
- [ ] Create user guide for detailed logging

---

**Last Updated**: December 9, 2025  
**Document Version**: 1.0  
**Maintained By**: Development Team
