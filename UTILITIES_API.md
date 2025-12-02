# Anchor App - Utilities API Documentation

**Version:** 1.1.2 (Build 53)  
**Last Updated:** January 2025

---

## Table of Contents

1. [Storage Utilities](#storage-utilities)
2. [Notification Utilities](#notification-utilities)
3. [Error Logger](#error-logger)
4. [Data Validation](#data-validation)
5. [App Rating](#app-rating)

---

## Storage Utilities

**File:** `src/utils/storage.js`

Provides secure and regular storage wrappers with automatic JSON serialization and error handling.

### Imports

```javascript
import { storage, secureStorage, STORAGE_KEYS } from '../utils/storage';
```

### Regular Storage

For non-sensitive data using AsyncStorage.

#### `storage.setItem(key, value)`

Stores data with automatic JSON serialization.

**Parameters:**
- `key` (string): Storage key
- `value` (any): Data to store (will be JSON stringified)

**Returns:** `Promise<void>`

**Throws:** Error if storage operation fails

**Example:**
```javascript
await storage.setItem('mood_logs', [{ mood: 4, date: '2025-01-15' }]);
```

#### `storage.getItem(key)`

Retrieves data with automatic JSON parsing.

**Parameters:**
- `key` (string): Storage key

**Returns:** `Promise<any | null>` - Parsed data or null if not found

**Example:**
```javascript
const moodLogs = await storage.getItem('mood_logs');
```

#### `storage.removeItem(key)`

Removes data from storage.

**Parameters:**
- `key` (string): Storage key

**Returns:** `Promise<void>`

**Example:**
```javascript
await storage.removeItem('mood_logs');
```

---

### Secure Storage

For sensitive data using Expo SecureStore (falls back to AsyncStorage on web).

#### `secureStorage.setItem(key, value)`

Securely stores sensitive data.

**Parameters:**
- `key` (string): Storage key
- `value` (any): Sensitive data to store

**Returns:** `Promise<void>`

**Throws:** Error if storage operation fails

**Example:**
```javascript
await secureStorage.setItem('emergency_contacts', [
  { name: 'John', phone: '555-0100' }
]);
```

#### `secureStorage.getItem(key)`

Retrieves secure data.

**Parameters:**
- `key` (string): Storage key

**Returns:** `Promise<any | null>` - Parsed data or null if not found

**Example:**
```javascript
const contacts = await secureStorage.getItem('emergency_contacts');
```

#### `secureStorage.removeItem(key)`

Removes secure data.

**Parameters:**
- `key` (string): Storage key

**Returns:** `Promise<void>`

**Example:**
```javascript
await secureStorage.removeItem('emergency_contacts');
```

---

### Storage Keys

Predefined constants for consistent storage key usage.

```javascript
STORAGE_KEYS = {
  MOOD_LOGS: 'mood_logs',
  TECHNIQUE_USAGE: 'technique_usage',
  SAFETY_PLAN: 'safety_plan',
  EMERGENCY_CONTACTS: 'emergency_contacts',
  USER_PREFERENCES: 'user_preferences',
  PROGRESS_DATA: 'progress_data',
  MEDICATION_REMINDERS: 'medication_reminders',
  BREATHING_SESSIONS: 'breathing_sessions'
}
```

**Example:**
```javascript
const prefs = await storage.getItem(STORAGE_KEYS.USER_PREFERENCES);
```

---

## Notification Utilities

**File:** `src/utils/notifications.js`

Manages scheduled notifications for mood check-ins and breathing reminders.

### Imports

```javascript
import {
  requestPermissions,
  scheduleMoodReminder,
  cancelMoodReminder,
  scheduleBreathingReminder,
  cancelBreathingReminder,
  clearAllNotifications,
  debugListScheduled,
  exportScheduledNotifications
} from '../utils/notifications';
```

---

### Configuration

```javascript
DEV_MODE = false; // Set to true for testing
MOOD_DAYS = 7; // Days to schedule mood reminders
BREATHING_COUNT = 16; // Number of breathing reminders
BREATHING_INTERVAL = 5400; // Seconds between reminders (90 min)
```

---

### Permission Management

#### `requestPermissions()`

Requests notification permissions from the user.

**Returns:** `Promise<boolean>` - true if granted, false otherwise

**Platform:** iOS/Android only (returns false on web)

**Example:**
```javascript
const granted = await requestPermissions();
if (granted) {
  await scheduleMoodReminder();
}
```

---

### Mood Reminders

Daily reminders at 8:00 PM for mood check-ins.

#### `scheduleMoodReminder()`

Schedules mood check-in notifications for the next 7 days.

**Returns:** `Promise<void>`

**Platform:** iOS/Android only

**Behavior:**
- Cancels existing mood reminders before scheduling
- Schedules daily at 8:00 PM
- Skips today if already past 8 PM
- Schedules for next 7 days

**Example:**
```javascript
await scheduleMoodReminder();
```

#### `cancelMoodReminder()`

Cancels all scheduled mood reminders.

**Returns:** `Promise<void>`

**Platform:** iOS/Android only

**Example:**
```javascript
await cancelMoodReminder();
```

---

### Breathing Reminders

Periodic reminders with DBT/CBT-inspired messages.

#### `scheduleBreathingReminder()`

Schedules 16 breathing reminders every 90 minutes.

**Returns:** `Promise<void>`

**Platform:** iOS/Android only

**Behavior:**
- Cancels existing breathing reminders before scheduling
- Schedules 16 notifications at 90-minute intervals
- Uses randomized DBT/CBT messages (25 variations)
- Messages include mindfulness, distress tolerance, and grounding techniques

**Example:**
```javascript
await scheduleBreathingReminder();
```

#### `cancelBreathingReminder()`

Cancels all scheduled breathing reminders.

**Returns:** `Promise<void>`

**Platform:** iOS/Android only

**Example:**
```javascript
await cancelBreathingReminder();
```

---

### Utility Functions

#### `clearAllNotifications()`

Cancels all scheduled notifications.

**Returns:** `Promise<void>`

**Platform:** iOS/Android only

**Example:**
```javascript
await clearAllNotifications();
```

#### `debugListScheduled()`

Logs all scheduled notifications to console (development only).

**Returns:** `Promise<void>`

**Platform:** iOS/Android only

**Output:** Console logs with notification counts by type

**Example:**
```javascript
await debugListScheduled();
// Console: 🔎 [NOTIF] Total scheduled: 23
// Console: 📊 Mood: 7, Breathing: 16, Reset: 0
```

#### `exportScheduledNotifications()`

Exports all scheduled notifications as JSON object.

**Returns:** `Promise<Object | null>`

**Platform:** iOS/Android only

**Response Structure:**
```javascript
{
  exportDate: "2025-01-15T10:30:00.000Z",
  totalScheduled: 23,
  summary: {
    moodReminders: 7,
    breathingReminders: 16,
    midnightReset: 0
  },
  notifications: [
    {
      id: "notification-id",
      type: "mood_reminder",
      title: "Daily Check-in",
      body: "How are you feeling today?",
      triggerDate: "2025-01-15T20:00:00.000Z"
    }
  ]
}
```

**Example:**
```javascript
const data = await exportScheduledNotifications();
console.log(`Total: ${data.totalScheduled}`);
```

---

## Error Logger

**File:** `src/utils/errorLogger.js`

Centralized error logging with context and user-friendly messages.

### Imports

```javascript
import ErrorLogger from '../utils/errorLogger';
```

---

### Methods

#### `ErrorLogger.log(error, context)`

Logs error with timestamp and context.

**Parameters:**
- `error` (Error): Error object
- `context` (string): Context description (optional)

**Returns:** `void`

**Example:**
```javascript
try {
  await riskyOperation();
} catch (error) {
  ErrorLogger.log(error, 'HomeScreen - loadData');
}
```

#### `ErrorLogger.logAPIError(error, endpoint)`

Logs API-specific errors.

**Parameters:**
- `error` (Error): Error object
- `endpoint` (string): API endpoint

**Returns:** `void`

**Example:**
```javascript
ErrorLogger.logAPIError(error, '/api/chat');
```

#### `ErrorLogger.logStorageError(error, operation)`

Logs storage-specific errors.

**Parameters:**
- `error` (Error): Error object
- `operation` (string): Storage operation description

**Returns:** `void`

**Example:**
```javascript
ErrorLogger.logStorageError(error, 'storage.setItem(mood_logs)');
```

#### `ErrorLogger.getUserFriendlyMessage(error)`

Converts technical errors to user-friendly messages.

**Parameters:**
- `error` (Error): Error object

**Returns:** `string` - User-friendly error message

**Message Mapping:**
- Network errors → "Network connection issue. Please check your internet."
- API errors → "Unable to connect to support service. Try again later."
- Storage errors → "Unable to save data. Please try again."
- Default → "Something went wrong. Please try again."

**Example:**
```javascript
try {
  await sendMessage();
} catch (error) {
  const message = ErrorLogger.getUserFriendlyMessage(error);
  Alert.alert('Error', message);
}
```

---

## Data Validation

**File:** `src/utils/dataValidation.js`

Validates and sanitizes user data before storage.

### Imports

```javascript
import {
  validateMoodEntry,
  validateTechniqueUsage,
  validateSafetyPlan,
  sanitizeText,
  validatePreferences,
  cleanStorageData
} from '../utils/dataValidation';
```

---

### Validators

#### `validateMoodEntry(entry)`

Validates mood log entry structure.

**Parameters:**
- `entry` (Object): Mood entry object

**Returns:** `boolean` - true if valid

**Required Fields:**
- `mood` (number): 1-5
- `moodName` (string): Mood name
- `date` (string): Date string
- `timestamp` (number): Unix timestamp

**Example:**
```javascript
const entry = { mood: 4, moodName: 'Good', date: '2025-01-15', timestamp: Date.now() };
if (validateMoodEntry(entry)) {
  await storage.setItem('mood_logs', [entry]);
}
```

#### `validateTechniqueUsage(usage)`

Validates technique usage entry.

**Parameters:**
- `usage` (Object): Technique usage object

**Returns:** `boolean` - true if valid

**Required Fields:**
- `technique` (string): Technique name
- `category` (string): Category name
- `date` (string): Date string
- `timestamp` (number): Unix timestamp
- `effectiveness` (number, optional): 1-5

**Example:**
```javascript
const usage = {
  technique: 'Box Breathing',
  category: 'grounding',
  date: '2025-01-15',
  timestamp: Date.now(),
  effectiveness: 4
};
if (validateTechniqueUsage(usage)) {
  await storage.setItem('technique_usage', [usage]);
}
```

#### `validateSafetyPlan(plan)`

Validates safety plan object.

**Parameters:**
- `plan` (Object): Safety plan object

**Returns:** `boolean` - true if valid (any object structure)

**Example:**
```javascript
const plan = { warningSignals: ['...'], copingStrategies: ['...'] };
if (validateSafetyPlan(plan)) {
  await secureStorage.setItem('safety_plan', plan);
}
```

#### `validatePreferences(prefs)`

Validates user preferences object.

**Parameters:**
- `prefs` (Object): Preferences object

**Returns:** `boolean` - true if valid

**Boolean Fields:**
- `darkMode`, `notifications`, `moodReminders`, `breathingReminders`, `hapticFeedback`, `dataSharing`

**Example:**
```javascript
const prefs = { darkMode: true, notifications: true };
if (validatePreferences(prefs)) {
  await storage.setItem('user_preferences', prefs);
}
```

---

### Sanitization

#### `sanitizeText(text, maxLength)`

Sanitizes and truncates text input.

**Parameters:**
- `text` (string): Input text
- `maxLength` (number): Maximum length (default: 500)

**Returns:** `string` - Sanitized text

**Behavior:**
- Trims whitespace
- Truncates to maxLength
- Returns empty string for invalid input

**Example:**
```javascript
const notes = sanitizeText(userInput, 200);
```

#### `cleanStorageData(storage, key, validator)`

Cleans invalid entries from stored arrays.

**Parameters:**
- `storage` (Object): Storage instance
- `key` (string): Storage key
- `validator` (Function): Validation function

**Returns:** `Promise<Array>` - Cleaned data array

**Behavior:**
- Loads data from storage
- Filters using validator function
- Saves back if data was cleaned
- Returns valid entries

**Example:**
```javascript
const validMoodLogs = await cleanStorageData(
  storage,
  'mood_logs',
  validateMoodEntry
);
```

---

## App Rating

**File:** `src/utils/appRating.js`

Tracks user engagement and prompts for App Store ratings.

### Imports

```javascript
import { trackMoodLog, trackTechniqueUsed } from '../utils/appRating';
```

---

### Configuration

```javascript
THRESHOLDS = {
  MOOD_LOGS: 5,      // Mood logs before prompting
  TECHNIQUES_USED: 3  // Techniques used before prompting
}
```

---

### Methods

#### `trackMoodLog()`

Increments mood log counter and checks rating threshold.

**Returns:** `Promise<void>`

**Behavior:**
- Increments mood log count
- Checks if thresholds met (5 mood logs + 3 techniques)
- Prompts for rating if eligible
- Only prompts once per user

**Example:**
```javascript
await trackMoodLog();
```

#### `trackTechniqueUsed()`

Increments technique usage counter and checks rating threshold.

**Returns:** `Promise<void>`

**Behavior:**
- Increments technique count
- Checks if thresholds met (5 mood logs + 3 techniques)
- Prompts for rating if eligible
- Only prompts once per user

**Example:**
```javascript
await trackTechniqueUsed();
```

---

## Usage Examples

### Complete Mood Logging Flow

```javascript
import { storage, STORAGE_KEYS } from '../utils/storage';
import { validateMoodEntry, sanitizeText } from '../utils/dataValidation';
import { trackMoodLog } from '../utils/appRating';
import ErrorLogger from '../utils/errorLogger';

const logMood = async (mood, moodName, notes) => {
  try {
    const entry = {
      mood,
      moodName,
      notes: sanitizeText(notes, 200),
      date: new Date().toDateString(),
      timestamp: Date.now()
    };
    
    if (!validateMoodEntry(entry)) {
      throw new Error('Invalid mood entry');
    }
    
    const logs = await storage.getItem(STORAGE_KEYS.MOOD_LOGS) || [];
    logs.unshift(entry);
    
    await storage.setItem(STORAGE_KEYS.MOOD_LOGS, logs);
    await trackMoodLog();
    
    return true;
  } catch (error) {
    ErrorLogger.logStorageError(error, 'logMood');
    return false;
  }
};
```

### Complete Notification Setup

```javascript
import {
  requestPermissions,
  scheduleMoodReminder,
  scheduleBreathingReminder
} from '../utils/notifications';

const setupNotifications = async () => {
  const granted = await requestPermissions();
  
  if (granted) {
    await scheduleMoodReminder();
    await scheduleBreathingReminder();
    return true;
  }
  
  return false;
};
```

---

## Platform Support

| Utility | iOS | Android | Web |
|---------|-----|---------|-----|
| Storage | ✅ | ✅ | ✅ |
| Secure Storage | ✅ | ✅ | ⚠️ (fallback) |
| Notifications | ✅ | ✅ | ❌ |
| Error Logger | ✅ | ✅ | ✅ |
| Data Validation | ✅ | ✅ | ✅ |
| App Rating | ✅ | ✅ | ❌ |

---

## Error Handling Best Practices

1. **Always wrap storage operations in try-catch**
```javascript
try {
  await storage.setItem(key, value);
} catch (error) {
  ErrorLogger.logStorageError(error, 'operation');
}
```

2. **Validate data before storage**
```javascript
if (validateMoodEntry(entry)) {
  await storage.setItem('mood_logs', [entry]);
}
```

3. **Use user-friendly error messages**
```javascript
const message = ErrorLogger.getUserFriendlyMessage(error);
Alert.alert('Error', message);
```

4. **Check platform before using platform-specific features**
```javascript
if (Platform.OS !== 'web') {
  await requestPermissions();
}
```

---

## Testing

All utilities have corresponding test files:
- `src/__tests__/storage.test.js`
- `src/__tests__/dataValidation.test.js`
- `src/__tests__/openai.test.js`

Run tests:
```bash
npm test
```

---

**Last Updated:** January 2025  
**Build:** 53 (Expo SDK 54)
