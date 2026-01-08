# Customizable Reminders - Test Summary

## Overview
Comprehensive unit tests for the customizable reminders feature, covering both mood check-in time selection and breathing interval customization.

## Test Results
✅ **24 tests passed** (100% pass rate)

## Test Coverage

### 1. Custom Mood Check-in Time (5 tests)
- ✅ Schedule at 8 PM (default)
- ✅ Schedule at 9 AM
- ✅ Schedule at 6 PM
- ✅ Schedule at midnight (0:00)
- ✅ Default to 8 PM if no time provided

### 2. Custom Breathing Interval - 90 minutes (3 tests)
- ✅ Schedule 16 notifications per day (48 total for 3 days)
- ✅ Verify exactly 90-minute intervals between notifications
- ✅ Stay under iOS 64-notification limit (48 + 7 = 55)

### 3. Custom Breathing Interval - 2 hours/120 minutes (3 tests)
- ✅ Schedule 12 notifications per day (36 total for 3 days)
- ✅ Verify exactly 2-hour intervals between notifications
- ✅ Stay under iOS 64-notification limit (36 + 7 = 43)

### 4. Custom Breathing Interval - 3 hours/180 minutes (3 tests)
- ✅ Schedule 8 notifications per day (24 total for 3 days)
- ✅ Verify exactly 3-hour intervals between notifications
- ✅ Stay under iOS 64-notification limit (24 + 7 = 31)

### 5. Custom Breathing Interval - 4 hours/240 minutes (3 tests)
- ✅ Schedule 6 notifications per day (18 total for 3 days)
- ✅ Verify exactly 4-hour intervals between notifications
- ✅ Stay under iOS 64-notification limit (18 + 7 = 25)

### 6. Default Breathing Interval (1 test)
- ✅ Default to 90 minutes if no interval provided

### 7. iOS 64-Notification Limit Validation (2 tests)
- ✅ Verify all 4 intervals stay under 64-notification limit
- ✅ Verify 60-minute interval would exceed limit (79 total) - not offered

### 8. Notification Coverage Calculation (2 tests)
- ✅ Verify all intervals provide 3 days of coverage
- ✅ Verify correct notification counts for each interval

### 9. Error Handling (2 tests)
- ✅ Handle scheduling errors with custom interval gracefully
- ✅ Handle scheduling errors with custom mood time gracefully

## Key Validations

### iOS 64-Notification Limit Compliance
All offered intervals stay safely under the iOS 64-notification limit:
- 90 min: 48 breathing + 7 mood = **55 total** ✅
- 120 min: 36 breathing + 7 mood = **43 total** ✅
- 180 min: 24 breathing + 7 mood = **31 total** ✅
- 240 min: 18 breathing + 7 mood = **25 total** ✅

### 60-Minute Interval Excluded
Tests confirm that 60-minute interval would create:
- 24 notifications/day × 3 days = 72 breathing notifications
- 72 + 7 mood = **79 total** ❌ (exceeds 64 limit)
- Therefore, 60-minute option is correctly excluded from UI

### Interval Accuracy
All tests verify that notifications are scheduled at exactly the specified intervals:
- 90 min = 5,400 seconds between notifications
- 120 min = 7,200 seconds between notifications
- 180 min = 10,800 seconds between notifications
- 240 min = 14,400 seconds between notifications

### Coverage Duration
All intervals provide exactly 3 days of notification coverage before requiring app open to reschedule.

## Test File Location
`src/__tests__/customizableReminders.test.js`

## Running Tests
```bash
npm test -- customizableReminders.test.js
```

## Related Files
- `src/utils/notifications.js` - Notification scheduling logic
- `src/screens/SettingsScreen.js` - UI for customization
- `src/components/WheelPicker.js` - Custom picker component

## Notes
- Tests use mocked Date.now() for deterministic interval validation
- All error handling paths are tested
- Tests verify both the math and the actual scheduling behavior
- Platform-specific behavior (iOS vs Android) is considered
