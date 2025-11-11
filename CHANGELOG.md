# Changelog

All notable changes to the Anchor PTSD Support App will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Git branching strategy (main, develop, feature branches)
- Comprehensive documentation for contributors

## [1.0.0] - 2025-01-11 (Build 5 - TestFlight)

**Status:** Testing in TestFlight (Build 5 submitted November 11, 2025)

### Fixed (Build 5)
- **Apple Rejection Fixes:**
  - Added clear location permission explanation for Crisis screen
  - Disabled iPad support (iPhone only)
  - Removed "Dark Mode (coming soon)" incomplete feature
  - Fixed AI Support API key configuration for production builds
  - Improved AI Support error messages to not sound incomplete

- **AI Support Improvements:**
  - Added auto-scroll to bottom when new messages arrive
  - Improved message padding and layout
  - Added 8 comprehensive unit tests (all passing)

- **Progress Screen:**
  - Fixed data not updating after logging mood
  - Added auto-refresh when tab is focused

### Technical Changes
- OpenAI API key stored as EAS secret (secure)
- Location permission only used for Crisis screen features
- Improved test coverage for AI Support screen

## [1.0.0] - 2025-01-09 (Build 1 - Rejected)

**Status:** Rejected by Apple (January 11, 2025)
**Rejection Reasons:**
- Guideline 5.1.1: Missing location permission explanation
- Guideline 4.0: iPad layout issues
- Guideline 2.2: AI Support appeared as incomplete feature

### Added
- **Core Features**
  - Home dashboard with quick actions
  - 150 trauma-informed daily reminders
  - Mood tracking with 5-point scale and notes
  - Progress analytics with mood trends and technique effectiveness
  - Safety plan with secure storage
  - Crisis resources with emergency contacts
  
- **DBT/CBT Tools**
  - 6 categories: Grounding, Distress Tolerance, Emotion Regulation, Interpersonal Skills, Mindfulness, Cognitive Techniques
  - 30+ evidence-based techniques
  - Technique effectiveness tracking
  - Usage analytics
  - Interactive breathing exercise
  
- **AI Support**
  - OpenAI-powered conversational support
  - Trauma-informed system prompt
  - Conversation history (last 50 messages)
  - Quick help suggestions
  - Rate limiting (10 requests/minute)
  - Graceful fallbacks when offline
  
- **Data & Privacy**
  - Local-first data storage (AsyncStorage)
  - Secure storage for sensitive data (Safety Plan)
  - Data export feature (JSON format)
  - Data validation and sanitization
  - No tracking or analytics
  - Privacy policy and terms of service
  
- **User Experience**
  - Medical disclaimer on first launch
  - Loading screen on app startup
  - Offline indicator banner
  - Keyboard handling for all inputs
  - Haptic feedback on interactions
  - Accessibility labels throughout
  - Error boundary for crash recovery
  
- **Performance**
  - React.memo for expensive components
  - useMemo for computed values
  - useCallback for event handlers
  - Optimized re-renders
  - Hermes engine enabled
  
- **Testing**
  - 26 unit tests covering core functionality
  - Test coverage for utilities and services
  - Mock external dependencies
  
- **Documentation**
  - Comprehensive README
  - App Store submission guide
  - Screenshot guide
  - Best practices audit
  - Branching strategy
  - Privacy policy (hosted on GitHub Pages)
  - Terms of service

### Technical Details
- React Native with Expo SDK 54
- React Navigation for routing
- React Native Chart Kit for analytics
- OpenAI API integration
- Platform-specific code for iOS/Android/Web

### Security
- Environment variables for API keys
- Input validation and sanitization
- Rate limiting on API calls
- Secure storage for sensitive data
- HTTPS for all network calls

## [0.1.0] - 2025-01-XX (Initial Development)

### Added
- Initial project setup
- Basic navigation structure
- Core technique database
- Simple mood tracking
- Basic AI agent with keyword matching

---

## Release Notes Template

### [Version] - YYYY-MM-DD

#### Added
- New features

#### Changed
- Changes to existing functionality

#### Deprecated
- Features that will be removed in future versions

#### Removed
- Features that have been removed

#### Fixed
- Bug fixes

#### Security
- Security improvements
