# Anchor PTSD Support App - Technical Architecture

## Overview
Anchor is a React Native mobile application built with Expo, designed to provide evidence-based mental health support for veterans and individuals with PTSD. The app combines DBT/CBT therapeutic techniques with AI-powered support and crisis resources.

## Technology Stack

### Core Framework
- **React Native** with **Expo SDK 54**
- **React Navigation** for routing and navigation
- **React Hooks** for state management (useState, useEffect, useCallback, useMemo)
- **Hermes** JavaScript engine for optimized performance

### Key Libraries
- **expo-notifications** - Push notifications and reminders
- **expo-haptics** - Tactile feedback for user interactions
- **expo-secure-store** - Encrypted storage for sensitive data (Safety Plan)
- **@react-native-async-storage/async-storage** - Local data persistence
- **react-native-chart-kit** - Data visualization for progress tracking
- **@expo/vector-icons** - Ionicons icon set

### AI Integration
- **OpenAI API** (GPT-4) for conversational support
- Custom trauma-informed system prompts
- Rate limiting and error handling
- Graceful offline fallbacks

## Architecture

### Data Layer
```
src/
├── data/
│   ├── techniques.js       # 30+ DBT/CBT techniques database
│   ├── citations.js        # Medical citations from authoritative sources
│   └── dailyReminders.js   # 150+ trauma-informed reminders
├── utils/
│   ├── storage.js          # AsyncStorage wrapper with error handling
│   ├── notifications.js    # Notification scheduling and management
│   ├── errorLogger.js      # Centralized error logging
│   └── appRating.js        # App Store rating prompts
└── services/
    └── openai.js           # OpenAI API integration
```

### Screen Architecture
```
src/screens/
├── HomeScreen.js           # Dashboard with quick actions
├── ToolsScreen.js          # DBT/CBT technique browser
├── AIAgentScreen.js        # Conversational AI support
├── CrisisScreen.js         # Emergency resources
├── ProgressScreen.js       # Analytics and mood tracking
├── SettingsScreen.js       # App configuration
├── ResourcesScreen.js      # Medical citations and sources
└── DisclaimerScreen.js     # First-launch medical disclaimer
```

### Component Structure
```
src/components/
├── MoodTracker.js          # 5-point mood logging with notes
├── BreathingExercise.js    # Interactive breathing guide
├── SafetyPlan.js           # Crisis safety planning tool
├── ErrorBoundary.js        # Crash recovery
└── OfflineIndicator.js     # Network status banner
```

## Key Technical Features

### 1. Local-First Data Architecture
- **All data stored locally** using AsyncStorage
- No cloud sync without explicit user consent
- HIPAA-aware design principles
- Secure storage for sensitive information (Safety Plan)

**Storage Keys:**
```javascript
STORAGE_KEYS = {
  MOOD_LOGS: 'mood_logs',
  TECHNIQUE_USAGE: 'technique_usage',
  SAFETY_PLAN: 'safety_plan',
  SETTINGS: 'settings',
  CONVERSATION_HISTORY: 'conversation_history'
}
```

### 2. Performance Optimizations
- **React.memo** for expensive components (MoodTracker, technique cards)
- **useMemo** for computed values (filtered techniques, chart data)
- **useCallback** for event handlers to prevent unnecessary re-renders
- **Lazy loading** for heavy screens
- **Optimized list rendering** with FlatList where appropriate

### 3. Offline-First Design
- All core features work without internet
- AI Support gracefully degrades with helpful error messages
- Crisis resources cached locally
- 10-second timeout on API calls
- Network status indicator

### 4. Accessibility (WCAG 2.1 Level AA)
- VoiceOver/TalkBack support throughout
- Semantic HTML roles (button, text, header)
- Accessibility labels and hints on all interactive elements
- Keyboard navigation support
- High contrast text (WCAG AAA compliant)
- Dynamic type support

### 5. Error Handling
- **ErrorBoundary** component catches React errors
- **ErrorLogger** utility for centralized logging
- User-friendly error messages
- Graceful API failure handling
- Storage error recovery

### 6. AI Support Architecture

**System Prompt:**
```javascript
- Trauma-informed responses
- Crisis detection and escalation
- Technique suggestions based on context
- Empathetic, non-judgmental tone
- Clear boundaries (not a therapist)
```

**Features:**
- Conversation history (last 50 messages)
- Rate limiting (10 requests/minute)
- 10-second timeout
- Offline detection
- Quick help buttons for common needs

### 7. Medical Citations (Apple Guideline 1.4.1)
- Citations from Harvard Medical School, Mayo Clinic, APA, VA
- Clickable source links on every technique
- Dedicated Resources & Citations screen
- formatCitation() utility for consistent formatting
- All URLs verified and working

## Data Flow

### Mood Tracking Flow
```
User logs mood → MoodTracker component
  ↓
Validates input (1-5 scale + optional notes)
  ↓
Saves to AsyncStorage (MOOD_LOGS key)
  ↓
Updates ProgressScreen charts
  ↓
Triggers app rating prompt (after 5 uses)
```

### Technique Usage Flow
```
User selects technique → ToolsScreen
  ↓
Logs usage with timestamp
  ↓
Displays technique with citation
  ↓
User rates effectiveness (1-5)
  ↓
Saves to AsyncStorage (TECHNIQUE_USAGE key)
  ↓
Updates Progress analytics
```

### AI Support Flow
```
User sends message → AIAgentScreen
  ↓
Checks network connectivity
  ↓
Sends to OpenAI API with system prompt
  ↓
Receives response (or timeout after 10s)
  ↓
Saves conversation to AsyncStorage
  ↓
Displays response with auto-scroll
```

## Security & Privacy

### Data Protection
- **No analytics or tracking** - Zero third-party analytics
- **No cloud storage** - All data stays on device
- **Encrypted storage** - Secure Store for Safety Plan
- **No PII collection** - App doesn't collect personal information
- **HTTPS only** - All API calls use secure connections

### API Key Management
- OpenAI API key stored as EAS secret
- Never exposed in client code
- Environment-specific configuration
- Rate limiting to prevent abuse

## Build & Deployment

### EAS Build Configuration
```javascript
// eas.json
{
  "build": {
    "production": {
      "ios": {
        "buildNumber": "9",
        "bundleIdentifier": "com.anchor.ptsd-support"
      }
    }
  }
}
```

### App Configuration
```javascript
// app.config.js
{
  version: "1.0.0",
  buildNumber: "9",
  supportsTablet: false,  // iPhone only
  permissions: [
    "NSLocationWhenInUseUsageDescription",  // Crisis center finder
    "NSUserNotificationsUsageDescription"   // Mood reminders
  ]
}
```

## Testing

### Test Coverage
- **26 unit tests** covering core functionality
- **Jest** test framework
- **React Native Testing Library** for component tests
- Mock external dependencies (OpenAI, AsyncStorage)
- 80%+ coverage on critical paths

### Test Categories
```
src/__tests__/
├── AIAgentScreen.test.js    # AI conversation logic
├── CrisisScreen.test.js     # Emergency features
├── MoodTracker.test.js      # Mood logging
└── ProgressScreen.test.js   # Analytics calculations
```

## Performance Metrics

- **App size:** ~15MB (optimized with Hermes)
- **Cold start:** <2 seconds
- **Technique load:** <100ms
- **AI response:** 2-5 seconds (network dependent)
- **Memory usage:** ~50MB average
- **Battery impact:** Minimal (no background processes)

## Apple App Store Compliance

### Medical App Requirements (Guideline 1.4.1)
- ✅ Medical citations from authoritative sources
- ✅ Clickable source links on every technique
- ✅ Dedicated Resources & Citations screen
- ✅ Clear educational disclaimer
- ✅ Not marketed as medical device

### Privacy & Permissions
- ✅ Location permission with clear explanation (Crisis center finder)
- ✅ Notification permission with clear explanation (Mood reminders)
- ✅ Privacy policy hosted on GitHub Pages
- ✅ No data collection without consent

### Accessibility Requirements
- ✅ VoiceOver support throughout
- ✅ Accessibility labels on all interactive elements
- ✅ WCAG 2.1 Level AA compliance
- ✅ High contrast text
- ✅ Keyboard navigation

### Design Guidelines (HIG)
- ✅ Standard iOS navigation patterns
- ✅ Proper spacing and typography
- ✅ Native iOS components
- ✅ Consistent visual hierarchy
- ✅ iPhone-only (iPad disabled)

## Future Technical Enhancements

### Planned for v1.1
- Fix notification scheduling
- Enhanced AI conversation context
- Technique recommendation algorithm
- Data export improvements
- Multi-language support

### Potential Features
- End-to-end encryption for cloud sync
- Wearable device integration (Apple Watch)
- Voice input for AI support
- Offline AI with local LLM
- Progressive Web App (PWA) version

## Lessons Learned

### Apple App Store Compliance
- **Medical citations required** - Health apps need authoritative sources
- **Clear disclaimers** - Must state it's not medical advice
- **Permission explanations** - Every permission needs clear justification
- **iPad support** - Disable if not optimized
- **Accessibility** - VoiceOver support is critical

### Technical Challenges Solved
1. **Offline AI graceful degradation** - 10s timeout + helpful error messages
2. **Citation management** - Centralized citations.js with formatCitation()
3. **Performance optimization** - React.memo + useMemo for smooth scrolling
4. **Error recovery** - ErrorBoundary prevents full app crashes
5. **Storage reliability** - Wrapper with error handling and validation

## Development Timeline

- **Initial Development:** 2 weeks
- **Apple Rejections:** 3 iterations (Builds 1, 5, 7)
- **Citation Implementation:** Build 8-9
- **Total Time to Approval:** ~1 month
- **Final Build:** Build 9 (Approved January 2025)

## Open Source

Anchor is open source (MIT License) to help others build mental health apps. The codebase demonstrates:
- Production-ready React Native architecture
- HIPAA-aware design patterns
- Accessibility best practices
- Apple App Store compliance
- Offline-first mobile development

**Repository:** https://github.com/seethe529/AnchorApp

---

## Tech Stack Summary

**Frontend:**
- React Native + Expo SDK 54
- React Navigation
- React Hooks (useState, useEffect, useCallback, useMemo)

**Backend/Services:**
- OpenAI GPT-4 API
- AsyncStorage for local data
- Expo Secure Store for encrypted data

**Development:**
- Jest for testing
- EAS for builds and deployment
- Git for version control

**Key Principles:**
- Privacy-first (local storage)
- Offline-capable
- Accessible (WCAG 2.1 AA)
- Evidence-based (medical citations)
- User-focused (simple, clean UI)

---

**Last Updated:** January 13, 2025 (Build 9)
**Status:** Live on App Store
**License:** MIT
