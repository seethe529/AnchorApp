# Anchor PTSD Support App - Technical Architecture

## Overview
Anchor is a React Native mobile application built with Expo, designed to provide evidence-based mental health support for veterans and individuals with PTSD. The app combines DBT/CBT therapeutic techniques with AI-powered conversational support, breathing exercises, mood tracking, and crisis resources.

**Version:** 1.2.14 (Build 104)  
**Platforms:** iOS (App Store) and Android (Google Play)  
**Last Updated:** June 28, 2026

---

## Technology Stack

### Core Framework
- **React Native 0.81.5** with **Expo SDK 54**
- **React 19.1.0** with Hooks-based architecture
- **Hermes** JavaScript engine
- **React Navigation 6** (Stack + Bottom Tabs)

### Key Dependencies
| Category | Library | Purpose |
|----------|---------|---------|
| Navigation | @react-navigation/bottom-tabs, stack, native | Tab + Stack navigation |
| Storage | @react-native-async-storage/async-storage | Local data persistence |
| Security | expo-secure-store | Encrypted storage (Safety Plan) |
| Notifications | expo-notifications | Mood & breathing reminders |
| UI | expo-linear-gradient, expo-blur, react-native-modal | Visual effects |
| Charts | react-native-chart-kit, react-native-svg | Progress analytics |
| Haptics | expo-haptics | Tactile feedback |
| Location | expo-location | Crisis center finder |
| Export | expo-print, expo-sharing, expo-file-system | PDF report generation |
| Audio | expo-av | Sound effects |
| Sensors | expo-sensors | Device sensors |
| Review | expo-store-review | App rating prompts |

### Backend
- **Vercel Serverless Functions** — OpenAI API proxy with rate limiting
- **OpenAI GPT-4o-mini** — AI conversational support

### Build & Deployment
- **EAS Build** — Cloud builds for iOS and Android
- **EAS Submit** — App Store and Play Console submission
- **Vercel** — Backend API deployment

---

## Architecture

### Project Structure
```
AnchorApp/
├── App.js                    # Root component, navigation, notification scheduling
├── app.config.js             # Expo configuration (versions, permissions, icons)
├── eas.json                  # EAS build/submit configuration
├── vercel.json               # Vercel deployment config
├── api/
│   └── chat.js              # Vercel serverless OpenAI proxy
├── src/
│   ├── screens/             # 9 screen components
│   ├── components/          # 11 reusable components
│   ├── context/             # Theme context (light/dark mode)
│   ├── data/                # Static app data (techniques, breathing, etc.)
│   ├── services/            # External service integrations
│   ├── utils/               # Utility functions
│   └── __tests__/           # 23 test files
├── ios/                     # Native iOS project (tracked in git)
├── android/                 # Native Android project (tracked in git)
└── assets/                  # Icons, splash screen, images
```

### Screens (9)
| Screen | Purpose |
|--------|---------|
| HomeScreen | Dashboard with quick actions (mood, crisis, grounding) |
| ToolsScreen | 28 DBT/CBT technique browser with categories |
| AIAgentScreen | Conversational AI support (GPT-4o-mini) |
| BreathingScreen | 5 swipeable breathing methods with animations |
| CrisisScreen | Emergency resources, hotlines, location services |
| ProgressScreen | Mood charts, technique analytics, streaks |
| SettingsScreen | Preferences, notifications, export, data management |
| ResourcesScreen | Medical citations and sources |
| DisclaimerScreen | First-launch medical disclaimer |

### Components (11)
| Component | Purpose |
|-----------|---------|
| BreathingExercise | Animated breathing guide (stack screen) |
| Button | Themed button with gradient and press animation |
| Card | Themed card container with shadows |
| DetailedMoodLog | Extended mood entry with notes |
| ErrorBoundary | React error boundary for crash recovery |
| MoodTracker | 5-point mood logging interface |
| OfflineIndicator | Network status banner |
| OnboardingTour | First-time user walkthrough |
| SafetyPlan | Crisis safety planning tool (secure storage) |
| SwipeableReminders | Swipeable daily affirmation cards |
| WheelPicker | Custom wheel/number picker for settings |

### Data Layer (5 files)
| File | Content |
|------|---------|
| techniques.js | 28 DBT/CBT techniques across 6 categories, synonym mapping (40+ phrases), weighted suggestion algorithm |
| breathingMethods.js | 5 breathing methods (Box, 4-7-8, Resonant, Physiological Sigh, Triangle) |
| dailyReminders.js | 196 daily affirmations/reminders (PTSD-focused, DBT skill references) |
| emotionModel.js | Hierarchical emotion wheel (6 primary → secondary → tertiary) |
| citations.js | 22 evidence-based citations + technique-to-citation mapping |

### Services (1 file)
| Service | Purpose |
|---------|---------|
| openai.js | Client-side OpenAI service — sends messages to Vercel proxy, handles errors |

### Utilities (5 files)
| Utility | Purpose |
|---------|---------|
| storage.js | AsyncStorage wrapper + SecureStore wrapper + STORAGE_KEYS constants |
| notifications.js | Notification scheduling (150 breathing messages, mood reminders) |
| errorLogger.js | Centralized error logging with user-friendly messages |
| appRating.js | App Store/Play Store rating prompt triggers |
| dataValidation.js | Input validation utilities |

### Context (1 file)
| Context | Purpose |
|---------|---------|
| ThemeContext.js | Light/dark theme provider with design tokens (colors, typography, spacing, shadows) |

---

## Navigation Flow

```
App (ThemeProvider)
└── AppContent (ErrorBoundary + SafeAreaProvider + OfflineIndicator)
    └── Stack Navigator
        ├── Disclaimer → (first launch only)
        ├── Onboarding → (first launch only)
        ├── MainApp (Bottom Tab Navigator)
        │   ├── Home
        │   ├── Tools
        │   ├── AI (Support Chat)
        │   ├── Crisis
        │   ├── Progress
        │   └── Settings
        ├── Breathing (from Home quick action)
        ├── BreathingMethods (full breathing screen)
        ├── Safety Plan (from Crisis or Home)
        └── Resources (from Settings or Tools)
```

---

## Key Technical Features

### 1. Local-First Data Architecture
- All user data stored locally (AsyncStorage)
- Sensitive data encrypted (expo-secure-store for Safety Plan)
- No cloud sync — privacy by design
- No analytics or tracking SDKs

**Storage Keys:**
```javascript
STORAGE_KEYS = {
  MOOD_LOGS: 'mood_logs',
  TECHNIQUE_USAGE: 'technique_usage',
  SAFETY_PLAN: 'safety_plan',
  EMERGENCY_CONTACTS: 'emergency_contacts',
  USER_PREFERENCES: 'user_preferences',
  PROGRESS_DATA: 'progress_data',
  MEDICATION_REMINDERS: 'medication_reminders',
  BREATHING_SESSIONS: 'breathing_sessions',
  AI_MESSAGE_COUNT: 'ai_message_count'
}
```

### 2. AI Support Architecture

**Backend (api/chat.js — Vercel Serverless):**
- Model: GPT-4o-mini
- Rate limit: 5 requests/minute per device
- Daily limit: 10 messages/day (free tier)
- Max message length: 500 characters
- Max response tokens: 800
- Trauma-informed system prompt
- Crisis detection and escalation
- API key secured as environment variable (never in client)

**Client (src/services/openai.js + AIAgentScreen):**
- 16-message context window (last 8 exchanges)
- Conversation history capped at 50 messages in storage
- Lifetime message counter (user messages only)
- 10-second timeout with graceful fallback
- Offline detection
- Quick help buttons for common needs
- Technique suggestion engine with synonym mapping

### 3. Notification System (Platform-Specific)

**iOS:**
- AppState listener (foreground check) + hourly setInterval backup
- Reschedules on date change
- Explicit cancellation before reschedule (prevents duplicates)
- 48 breathing reminders (3-day coverage at default 90-min interval)
- 7-day mood reminder coverage
- Stays under iOS 64 notification limit

**Android:**
- AppState listener with 5-minute debounce
- Reschedules when app comes to foreground after date change
- 112 breathing reminders (7-day coverage at default 90-min interval)
- 7-day mood reminder coverage
- No exact alarm permission (Google Play policy)
- Android notification channel: "Breathing Reminders" (HIGH importance)

**Shared:**
- 150 unique breathing messages (Fisher-Yates shuffle — no repeats until all seen)
- Configurable breathing interval (default 90 minutes, user-adjustable)
- Configurable mood reminder time (default 8 PM, user-adjustable)
- Date-based triggers (not interval-based)
- Notification types tagged with `data.type`: `mood_reminder`, `breathing_reminder`
- Cancellation by type (filters scheduled notifications by type before removing)
- Opt-in permissions (default off)
- Web platform skipped entirely (no notification support)
- Debug export tool in Settings for troubleshooting

### 4. PDF Progress Report Export

**Flow:** User taps Export → Selects date range → HTML template rendered → PDF generated → Share sheet

**Technical details:**
- `expo-print` converts HTML to PDF
- `expo-file-system/next` (File API) for friendly filename rename
- `expo-sharing` for cross-platform share sheet
- App icon embedded as base64 in PDF header
- Date range filtering (7 days, 30 days, 3 months, All time)
- Technique deduplication logic
- Handles repeat exports (deletes existing file before rename)
- iOS: Native Alert with 5 options
- Android: Bottom sheet Modal (Alert only supports 3 buttons)

### 5. Breathing Exercises

- 5 methods with distinct patterns
- Horizontal FlatList with paginated swiping
- Animated.timing for breathing circle expansion/contraction
- AccessibilityInfo.announceForAccessibility for VoiceOver phase cues
- Only current method's elements are focusable (hides off-screen items)
- Haptic feedback on phase transitions
- Session logging to AsyncStorage

### 6. Theme System

- ThemeContext provides `useTheme()` hook globally
- Light and dark themes with complete color definitions
- Design tokens: typography, spacing, borderRadius, shadows
- Persists preference to AsyncStorage
- NavigationContainer theme synced with app theme
- All components use dynamic theme colors

### 7. Accessibility (WCAG 2.1 Level AA)
- VoiceOver (iOS) and TalkBack (Android) support
- accessibilityRole, accessibilityLabel, accessibilityHint on all interactive elements
- accessibilityState for toggles/checkboxes
- Header levels (accessibilityLevel 1, 2) for screen structure
- importantForAccessibility to hide off-screen paginated content
- AccessibilityInfo.announceForAccessibility for dynamic updates
- Minimum 44pt touch targets
- High contrast text in both themes

### 8. Error Handling
- ErrorBoundary wraps entire app (crash recovery)
- ErrorLogger utility with context-specific logging
- User-friendly error messages (never raw errors)
- Storage error recovery (returns null, logs error)
- API timeout handling (10s)
- Offline graceful degradation

---

## Data Flow

### Mood Tracking
```
User logs mood → MoodTracker → Validates (1-5 + optional notes)
  → Saves to AsyncStorage (MOOD_LOGS) → Updates ProgressScreen charts
  → Triggers app rating prompt (after 5 uses)
```

### Technique Usage
```
User selects technique → ToolsScreen → Logs usage with timestamp
  → User rates effectiveness (1-5, optional)
  → Saves to AsyncStorage (TECHNIQUE_USAGE)
  → Deduplication in export (rated entry takes precedence over unrated within 5 min)
```

### AI Conversation
```
User sends message → AIAgentScreen → Checks network
  → POST to Vercel proxy (api/chat.js) → Rate limit check → Daily limit check
  → Forward to OpenAI (GPT-4o-mini) → Return response
  → Save both messages to conversation_history (capped at 50)
  → Increment AI_MESSAGE_COUNT (user messages only)
```

### Export
```
User taps Export → Date range picker (Alert on iOS / Modal on Android)
  → Filter data by date range → Build HTML template with branding
  → expo-print generates PDF → Rename to friendly filename
  → expo-sharing opens share sheet
```

---

## Security & Privacy

- **No analytics/tracking** — zero third-party SDKs
- **No cloud storage** — all data on device
- **Encrypted storage** — expo-secure-store for Safety Plan
- **No PII collection** — app doesn't collect personal information
- **HTTPS only** — all API calls use secure connections
- **API key server-side** — OpenAI key on Vercel, never in client bundle
- **Rate limiting** — prevents API abuse (5/min, 10/day)
- **Device ID** — anonymous, used only for rate limiting

---

## Build & Deployment

### Configuration
```javascript
// eas.json
{
  "cli": { "appVersionSource": "local" },
  "build": {
    "production": {
      "autoIncrement": false,
      "ios": { "image": "latest" },
      "android": { "buildType": "app-bundle" }
    }
  }
}
```

### Build Process
```bash
# 1. Bump build number in app.config.js
# 2. Regenerate native folders
rm -rf .expo node_modules/.cache
npx expo prebuild --clean --platform ios
npx expo prebuild --clean --platform android
# 3. Commit and push
git add ios/ android/ app.config.js
git commit -m "chore: bump build" && git push
# 4. Build
eas build --platform ios --profile production --non-interactive
eas build --platform android --profile production --non-interactive
# 5. Verify
eas build:list --platform ios --limit 1
eas build:list --platform android --limit 1
```

### Submission
- **iOS:** `eas submit --platform ios --latest`
- **Android:** Download .aab from EAS → Upload to Play Console

### Key Notes
- `ios/` and `android/` are tracked in git for reliable version control
- Always regenerate native folders before building (prevents version mismatch)
- `appVersionSource: "local"` ensures EAS reads from native files, not remote cache
- Distribution certificate expires November 19, 2026

---

## Testing

### Framework
- **Jest 29** with **jest-expo** preset
- **React Native Testing Library** for component tests
- 23 test files covering core functionality

### Test Categories
```
src/__tests__/
├── accessibility.test.js          # VoiceOver/TalkBack compliance
├── AIAgentScreen.test.js          # AI conversation logic
├── breathing-accessibility.test.js # Breathing screen a11y
├── CrisisScreen.test.js           # Emergency features
├── customizable-reminders.test.js # Reminder scheduling
├── dataValidation.test.js         # Input validation
├── ExportModal.test.js            # PDF export, date filtering, dedup
├── MoodTracker.test.js            # Mood logging
├── notifications.test.js          # Notification system
├── openai.test.js                 # AI service
├── ProgressAnalytics.test.js      # Analytics calculations
├── ProgressScreen.test.js         # Progress display
├── SafetyPlan.*.test.js           # Safety plan (multiple files)
├── shuffle-algorithm.test.js      # Message randomization
├── storage.test.js                # Storage utilities
└── techniques.test.js             # Technique data
```

---

## Performance

- **App size:** ~15MB (Hermes optimized)
- **Cold start:** <2 seconds
- **AI response:** 2-5 seconds (network dependent)
- **PDF generation:** <1 second
- **Memory:** ~50MB average
- **Battery:** Minimal (no persistent background processes)

---

## App Store Compliance

### Apple (Guidelines 1.4.1, 5.1)
- ✅ Medical citations from Harvard, Mayo Clinic, APA, VA
- ✅ Educational disclaimer (not a medical device)
- ✅ Privacy policy
- ✅ Location/notification permissions with clear explanations
- ✅ No encryption declaration (usesNonExemptEncryption: false)
- ✅ VoiceOver accessibility

### Google Play
- ✅ No SCHEDULE_EXACT_ALARM permission (policy compliance)
- ✅ Adaptive icon properly centered
- ✅ NOTIFICATIONS permission only
- ✅ Privacy policy
- ✅ Content rating appropriate

---

## Repository

**GitHub:** https://github.com/seethe529/AnchorApp  
**License:** MIT  
**Owner:** Ryan Charles Lingo (Individual Developer)  
**Apple Team ID:** X57B3HGZ6U

---

**Last Updated:** June 28, 2026 (Build 104)
