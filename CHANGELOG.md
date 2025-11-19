# Changelog

All notable changes to the Anchor PTSD Support App will be documented in this file.

## [1.1.0] - Build 16 - 2025-11-19 - APP STORE READY

### Added
- Working AI Agent with OpenAI GPT-4o-mini integration
- Proper environment variable configuration for production builds
- Comprehensive App Store submission documentation

### Fixed
- AI Agent now responds properly with trauma-informed guidance
- OpenAI API key properly loaded in production builds
- All notification systems working reliably
- Breathing screen layout perfected with no overlapping elements

### Technical
- Moved to paid EAS organization for priority builds
- Environment variables configured via EAS secrets
- Build process optimized for App Store submission
- All features tested and verified working

### Status
- ✅ Ready for App Store submission
- ✅ All core features functional
- ✅ Accessibility compliance verified
- ✅ Privacy and security requirements met

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned (Future Builds)
- Additional DBT/CBT techniques (Radical Acceptance, Self-Validation, Pros & Cons)
- Apple Watch companion app with heart rate monitoring
- Multi-language support (Spanish, French, German priority)
- Advanced analytics and personalized insights
- Peer support matching (optional, privacy-focused)

## [1.1.0] - 2025-01-XX (Build 14 - Current)

**Status:** Ready for App Store Submission (Build 14)

### Added (Build 14)
- **Global Dark Mode:**
  - Complete ThemeContext implementation with light and dark themes
  - All screens updated to support both themes seamlessly
  - Consistent trauma-informed color palette following Apple Human Interface Guidelines
  - Theme toggle in Settings under "Appearance" section
  - Theme preference persists across app restarts using AsyncStorage
  - Charts and progress visualizations adapt dynamically to current theme
  - Improved accessibility compliance in both light and dark modes

- **Enhanced AI Support ("Anchor" Personality):**
  - Upgraded to GPT-4o-mini model for improved performance and cost efficiency
  - Comprehensive trauma-informed AI personality with adaptive responses
  - Specialized responses for different emotional states (overwhelmed, anxious, dissociating)
  - Enhanced crisis detection and safety resource provision
  - Personalized DBT/CBT technique suggestions based on user input
  - Gentle, validating communication style designed for PTSD support

- **Swipeable Breathing Exercises (Build 10 - Included):**
  - 5 evidence-based breathing methods: Box Breathing, 4-7-8, Resonant Breathing, Physiological Sigh, Triangle Breathing
  - Animated breathing circle with smooth visual guidance
  - Haptic feedback on breathing phase transitions
  - Session tracking and history storage
  - Horizontal swipe navigation between different methods
  - Individual method descriptions and benefits

- **Enhanced Notification System:**
  - 25 randomized DBT/CBT-inspired breathing reminder messages
  - Hourly breathing reminders (24 individual notifications scheduled)
  - Daily mood check-in reminders at 8:00 PM
  - Auto-reschedule when less than 12 hours of reminders remain
  - AppState listener for automatic reminder refresh on app foreground
  - Trauma-informed messaging throughout all notifications

### Changed (Build 14)
- **UI/UX Improvements:**
  - All breathing exercises now use theme-appropriate colors
  - Crisis screen updated with consistent trauma-informed green colors
  - Navigation elements adapt seamlessly to current theme
  - Improved visual hierarchy and spacing throughout app
  - Enhanced accessibility features for both light and dark modes

- **AI Support Enhancements:**
  - More natural, conversational AI responses
  - Better context awareness and emotional intelligence
  - Improved crisis resource delivery and safety prioritization
  - Enhanced technique recommendations based on user emotional state

### Technical (Build 14)
- Created comprehensive ThemeContext for global theme management
- Updated all screens to use dynamic theme colors with proper contrast ratios
- Upgraded OpenAI integration to GPT-4o-mini for better performance
- Enhanced AI system prompt with trauma-informed response patterns
- Improved notification scheduling reliability on iOS
- Better error handling and fallback responses throughout app
- Optimized performance for theme switching and breathing animations

## [1.1.0] - 2025-01-XX (Build 13 - Superseded)

**Status:** Development build (never released - superseded by Build 14)

### Added (Build 13)
- **Global Dark Mode:**
  - Theme context with light and dark themes
  - Dark mode toggle in Settings under "Appearance"
  - All screens updated to support both themes
  - Consistent color palette following Apple HIG
  - Theme persists across app restarts

- **Enhanced Breathing Reminders:**
  - 25 randomized DBT/CBT-inspired reminder messages
  - Messages rotate to provide variety and engagement
  - Trauma-informed language throughout

### Changed (Build 13)
- **UI/UX Improvements:**
  - Breathing exercises now use dark theme by default
  - Physiological Sigh color changed from red to calming teal
  - Crisis screen colors changed to consistent green (trauma-informed design)
  - All navigation elements adapt to theme
  - Charts in Progress screen adapt to dark mode

### Technical (Build 13)
- Created ThemeContext for global theme management
- Updated all screens to use theme colors dynamically
- Improved color accessibility in both light and dark modes

## [1.1.0] - 2025-01-XX (Build 12 - TestFlight)

**Status:** Submitted to TestFlight (Build 12 - January 2025)

### Fixed (Build 12)
- **iOS Notification Fixes:**
  - Fixed breathing reminders to work on iOS (schedule 24 individual hourly notifications)
  - Added auto-reschedule when less than 12 hours of reminders remain
  - Added AppState listener to recheck reminders when app comes to foreground
  - Set notifications to fire on the hour (:00 minutes/seconds)
  - Ensures continuous hourly reminders without overwhelming notification queue

### Removed (Build 12)
- Removed non-functional "Anonymous Analytics" toggle from Settings

### Technical (Build 12)
- Added try-catch error logging to all notification functions
- Added recheckBreathingReminders() utility function
- Improved notification handler to properly detect iOS date triggers

## [1.1.0] - 2025-11-17 (Build 11 - Internal)

**Status:** Built with EAS but never submitted to App Store Connect (superseded by Build 12)

### Fixed (Build 11)
- Initial attempt at iOS notification fixes
- Removed non-functional analytics toggle
- Added error logging

### Note
- Build 11 was completed but additional changes were needed
- Never uploaded to TestFlight or App Store Connect
- Changes rolled into Build 12 instead

## [1.1.0] - 2025-11-17 (Build 10 - App Store)

**Status:** Released to App Store (Build 10)

### Added (Build 10)
- **Swipeable Breathing Exercises:**
  - 5 breathing methods: Box Breathing, 4-7-8, Resonant Breathing, Physiological Sigh, Triangle Breathing
  - Animated breathing circle with smooth transitions
  - Haptic feedback on phase changes
  - Cycle tracking and session logging
  - Horizontal swipe navigation between methods
  - Session history stored in AsyncStorage

- **Notification System:**
  - Master notification toggle with permission gating
  - Daily mood check-in reminders (8:00 PM)
  - Hourly breathing exercise reminders
  - Proper notification scheduling with deduplication

### Fixed (Build 10)
- Fixed notification toggle flickering in Settings
- Fixed notifications firing immediately on toggle
- Added cancelReminderType() helper for proper deduplication
- Updated notification handler to only show scheduled notifications
- Removed notification rehydration that caused duplicate notifications

### Changed (Build 10)
- Updated Home screen "Breathing Exercise" to "Breathing Exercises" (plural)
- Improved notification grammar with proper punctuation

## [1.0.0] - 2025-01-13 (Build 9 - App Store)

**Status:** Released to App Store (Build 9 - January 13, 2025)

### Added (Build 9)
- **Medical Citations (Apple Guideline 1.4.1 Compliance):**
  - Comprehensive citations from authoritative sources on every technique
  - Sources include: Harvard Medical School, Mayo Clinic, American Psychological Association, VA National Center for PTSD, University of Rochester Medical Center, Behavioural Tech, NAMI
  - Clickable "View Source" links on all technique detail pages
  - Dedicated Resources & Citations screen accessible from Settings
  - formatCitation() function for consistent citation formatting
  - All citation URLs verified and working

### Changed (Build 9)
- **UI/UX Improvements:**
  - Improved technique detail page layout following Apple HIG
  - Moved "Was this helpful?" feedback to bottom of technique pages
  - Added breathing space and better typography throughout
  - Centered technique titles with proper back button placement
  - Auto-scroll to top when opening technique details
  - Removed swipe gesture (conflicted with ScrollView)

- **Citations Structure:**
  - Replaced generic URLs with technique-specific authoritative sources
  - Added separate citation for Self-Soothe (was sharing with ACCEPTS)
  - Updated all DBT skill citations to use official Behavioural Tech Knowledge Center
  - Added source property to key citations for ResourcesScreen compatibility

### Fixed (Build 9)
- Fixed blank screen issue when navigating back from techniques
- Fixed ResourcesScreen crash due to missing citation properties
- Updated disclaimer lastUpdated date to November 2025

## [1.0.0] - 2025-01-12 (Build 8 - TestFlight)

**Status:** Testing in TestFlight (Build 8 submitted January 12, 2025)

### Added (Build 8)
- Initial medical citations implementation
- Basic citation structure in citations.js

### Fixed (Build 8)
- Fixed broken citation URLs
- Removed conflicting app.json file
- Updated to use app.config.js as single source of truth

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
