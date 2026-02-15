# Changelog

All notable changes to Anchor PTSD Support App will be documented in this file.

## [1.2.11] - Build 90-92 (Interactive Safety Plan) - February 2025

### Added - Interactive Safety Plan
- Converted Safety Plan from text fields to interactive list-based UI
- Tap-to-call and tap-to-text buttons for emergency contacts
- Automatic phone number formatting (XXX-XXX-XXXX for 10 digits, X-XXX-XXX-XXXX for 11 digits)
- Add/remove functionality for all sections (Warning Signs, Coping Strategies, Social Support, Professional Contacts, Environment Safety, Reasons for Living)
- Cross-platform modal support (iOS: Alert.prompt, Android: custom modal with TextInput)
- Automatic data migration from old string format to new array format
- Smart contact parsing for "Name - Phone" format during migration

### Changed - Trauma-Informed Design
- Simplified visual design with subtle divider lines instead of individual card boxes
- Less visually overwhelming for users in crisis
- Reduced padding and spacing for cleaner appearance
- Maintains full accessibility support with VoiceOver/TalkBack

### Fixed
- Phone number consistency across all contact entries
- Android compatibility (Alert.prompt doesn't exist on Android)
- Data preservation during migration from old Safety Plan format

### Technical
- No new permissions required (uses standard tel:// and sms:// URL schemes)
- 18 comprehensive unit tests covering functionality and migration
- Platform-specific implementation (Platform.OS checks)

## [1.2.8] - Build 88-89 (Secure AI Backend) - February 2025

### Added - Secure Backend Infrastructure
- Vercel serverless backend proxy to protect OpenAI API key
- Client-side rate limiting (5 requests/minute, 10 messages/day per device)
- Server-side rate limiting with device fingerprinting via expo-device
- Compassionate error messages for rate limit scenarios
- Phone number validation for crisis resources
- Cost control: ~$10-18/month for 100 users

### Security
- Removed OpenAI API key from client-side code
- API key now stored securely in Vercel environment variables
- Device-based rate limiting prevents abuse
- No user authentication required (privacy-focused)

### Changed
- AI Agent now calls Vercel backend instead of OpenAI directly
- Max tokens increased to 800 for complete responses

## [1.2.7] - Build 87 (EMDR Therapist Feedback) - January 2025

### Changed - Enhanced Technique Guidance
- **5-4-3-2-1 Technique**: Added texture awareness, cold items, and date/time grounding
- **Cold Grounding**: Added sternum placement for vagus nerve stimulation
- **Name 3 Things**: Added date/time orientation for grounding
- **TIPP**: Added warning that intense exercise may trigger some users
- **ACCEPTS (Push Away)**: Added two-layer lock containment visualization
- **Pros and Cons**: Added 24-hour waiting rule for intense emotions
- **Safe Place Visualization**: Listed all 5 senses explicitly with examples

### Added - Progress Screen
- Non-linear progress reminder with info card
- Reassurance that fluctuating moods don't mean lack of progress
- Trauma-informed messaging about PTSD recovery patterns
- Full accessibility support for new content

### Changed - Android Icon
- Updated adaptive icon with more padding for Google Play Store requirements
- Heart-anchor design with generous white space to prevent cropping

### Documentation
- Implemented professional EMDR therapist feedback
- All changes based on clinical recommendations for PTSD support

## [1.2.6] - Build 86 (Comprehensive Accessibility) - January 2025

### Fixed - VoiceOver Navigation
- Fixed critical VoiceOver navigation in BreathingScreen (only visible method accessible)
- Fixed SwipeableReminders pagination (only visible reminder accessible)
- Removed custom accessibilityActions in favor of standard three-finger swipe
- Added helpful hint: "Use three-finger swipe to change methods"

### Added - Accessibility Compliance
- Added accessibility roles (header, alert, text) throughout all 7 screens
- Grouped multi-element content (technique steps, citations) as single accessible elements
- Added proper accessibility labels, hints, and states to all interactive elements
- Marked decorative button children (icons, text) as accessible={false}
- 20 comprehensive unit tests verifying accessibility logic
- Full compliance with iOS/Android accessibility guidelines

### Changed
- Addresses first user review feedback requesting better blind user support
- Improved screen reader experience across entire app

## [1.2.5] - Build 75-76 (Customizable Reminders) - January 2025

### Added - Customizable Notifications
- Customizable mood check-in time (default 8:00 PM)
- Customizable breathing intervals: 90, 120, 180, 240 minutes (default 90)
- Full-width picker modals with dark mode support
- Temp state for cancel button functionality
- Background notification rescheduling to prevent modal lag
- Respects platform-specific coverage (iOS: 3 days, Android: 7 days)

### Changed - AI Improvements
- Increased AI max_tokens from 200→800 to prevent response cutoff
- Better handling of longer technique lists and crisis responses

### Released
- iOS v1.2.5 (Build 75) released to App Store
- Android v1.2.5 (Build 76) released to Google Play

## [1.2.5] - Build 71 (UI Modernization Complete) - January 2025

### Changed - DisclaimerScreen Modernization
- Applied design tokens and theme support for light/dark mode compatibility
- Integrated reusable Button and Card components
- Improved typography hierarchy with proper font sizes and weights
- Enhanced crisis information layout with label/number structure for better readability
- Added red left border accent (4px) to warning and crisis cards for visual emphasis
- Restructured crisis resources with separate label and number lines
- Improved text wrapping and spacing throughout

### Fixed - Button Component
- Added proper grey disabled state (#CCCCCC) for primary buttons
- Disabled buttons now show clear visual feedback instead of opacity-only
- Matches iOS/Android standard disabled button patterns

### Added - Accessibility Improvements
- Added scroll indicators and bounce scrolling for better UX
- Enhanced VoiceOver/TalkBack support with accessibility hints
- Improved touch targets (44pt/48dp minimum) for checkbox and buttons
- Added haptic feedback (activeOpacity) for better tactile response

### Documentation
- All screens now modernized and following iOS/Android best practices
- Complete design system implementation across entire app

## [1.2.4] - Build 70 (Trauma-Informed Analytics) - January 2025

### Fixed - Analytics Double-Counting Bug
- Fixed critical bug where technique views and ratings were double-counted
- Views and ratings now tracked separately with proper data structure
- Analytics now accurately reflect actual usage patterns

### Changed - Trauma-Informed Design Improvements
- Replaced vertical bar chart with horizontal progress bars (full technique names visible)
- Added qualitative effectiveness labels: "Very Helpful", "Helpful", "Somewhat Helpful", "Needs Practice"
- Added optional view count toggle (eye icon) - default off to reduce pressure
- Renamed charts with supportive language:
  - "Your Go-To Techniques" - Tools you often reach for when you need support
  - "What's Felt Most Helpful" - Tools you've found helpful at times
- Updated Quick Stats labels:
  - "Times you checked in" (was Total Mood Logs)
  - "Support Moments" (was Techniques Used)
  - Removed "Average Mood" to reduce clinical pressure
- Normalized bar charts to reduce comparison anxiety

### Added
- 16 comprehensive unit tests covering all analytics functionality
- Follows mental health app best practices for trauma-informed design

## [1.2.4] - Build 68-69 (iOS Production / Android Production) - December 2025

### Released
- iOS v1.2.4 (Build 68) released to App Store (US, UK, Australia)
- Android v1.2.4 (Build 69) released to Google Play

### Changed - Production Refinements
- Removed debug buttons from Settings for production (Export Notifications, Reset Onboarding)
- Refined emotion model: "Alerted / Anxious / On Edge" with PTSD-appropriate secondary emotions
- Added "Fearful / Unsafe" and "Hypervigilant" to anxiety family
- Moved "Shut Down / Collapsed" to low energy family (hypo-arousal vs hyper-arousal)

## [1.2.3] - Build 66 (Android Alpha Testing) - December 2025

### Fixed
- Onboarding footer safe area insets for Android devices with navigation bars
- Button now fully visible above system navigation on all Android devices

## [1.2.2] - Build 65 (Android Alpha Testing) - December 2025

### Added - Onboarding Tour
- 5-slide welcome tour for new users explaining app features
- Covers DBT/CBT tools, progress tracking, AI support, and privacy
- Fully accessible with screen reader support and announcements
- Skip functionality at any time
- Only shows on first launch (existing users unaffected)
- Proper navigation flow: Disclaimer → Onboarding → Home

### Added - Enhanced Mood Logging (Emotion Model Phase 1)
- Quick Log: Fast 5-point mood scale (existing feature, unchanged)
- Detailed Log: New optional detailed emotion tracking
  - Primary emotion selection (Happy, Sad, Angry, Anxious, Calm, Overwhelmed, Numb, Other)
  - Intensity slider (1-10)
  - Optional notes field (500 character limit)
  - Progressive disclosure UI - only shows when user wants more detail
- Both logging methods available on Home screen
- Mood data stored locally on device
- Improved home screen mood logging workflow

### Changed
- Enhanced accessibility throughout onboarding and mood logging
- Added comprehensive error handling to onboarding flow
- Improved keyboard handling in detailed mood log

### Documentation
- Updated NOTIFICATION_SYSTEM.md with iOS AppState listener (Build 63-64)
- Added release notes for Android testing community

## [1.2.0] - Build 64 (iOS Production) - December 2025

### Fixed
- Export notifications button with proper error handling and JSON stringification
- Added user-friendly error alerts for notification export failures

## [1.2.0] - Build 63 (iOS Production) - December 2025

### Added - iOS Notification Improvements
- iOS AppState listener for immediate notification rescheduling when app opens
- Dual reschedule system: AppState listener (immediate) + hourly timer (backup)
- No debounce on iOS (unlike Android's 5-minute debounce)
- Improves user experience - notifications reschedule as soon as app opens after date change

### Changed
- iOS now uses same AppState pattern as Android but without debounce
- Hourly timer remains as backup for when app stays open

## [1.2.0] - Build 61 (iOS Production / Android Alpha Testing)

### Fixed - iOS 64 Notification Limit
- Discovered iOS platform limit of 64 scheduled notifications maximum
- Reverted iOS to 48 breathing + 7 mood = 55 total notifications (safe under limit)
- iOS now has 3-day breathing coverage (down from attempted 7-day)
- Android maintains 112 breathing + 7 mood = 119 total (7-day coverage)
- Platform-specific BREATHING_COUNT: iOS 48, Android 112
- Unified MOOD_DAYS: 7 for both platforms (mood reminders serve as engagement hook)

### Documentation
- Updated NOTIFICATION_SYSTEM.md with iOS 64 limit discovery and constraints
- Added "Critical Platform Constraints" section documenting iOS behavior
- Updated version history and troubleshooting guides

## [1.2.0] - Build 60 (Testing)

### Attempted
- Unified 7-day notification coverage for iOS and Android (112 breathing + 7 mood)
- Discovered iOS only scheduled 64 notifications instead of expected 119
- Identified iOS platform constraint through testing

### Added
- Test branch `test-8pm-mood-reminder` to verify 8 PM timing
- Confirmed mood reminders fire at exactly 8:00:00 PM with no drift

## [1.2.0] - Build 64 (Android Alpha Testing)

### Fixed - Notification Reliability
- Notifications now fire at exact 90-minute intervals (millisecond-based scheduling)
- Eliminated notifications firing when opening app
- Added 5-minute debounce to prevent reschedule spam during distress
- Skip past notification dates to prevent immediate firing
- HIGH priority notifications to reduce Android battery optimization delays
- Platform-specific rescheduling: iOS (hourly timer), Android (AppState listener with debounce)

### Changed
- Android notification channel set to HIGH importance with vibration
- Added health category identifier for time-sensitive notifications
- Improved notification reliability for PTSD support use case

## [1.2.0] - Build 62-63 (Android Alpha Testing)

### Fixed
- Changed notification scheduling from setSeconds() to millisecond-based calculation
- All 112 Android notifications now schedule with perfect 90-minute spacing
- 7-day notification coverage maintained

### Added
- Comprehensive test suite with 38 passing notification tests
- Android-specific notification math validation tests

## [1.2.0] - Build 58-59 (iOS Production)

### Changed
- Extended iOS notification coverage from 2-day to 3-day
- iOS: 48 breathing + 3 mood notifications (before discovering 64 limit)
- Tested and validated 8 PM mood reminder timing (exact 8:00:00 PM)

## [1.2.0] - Build 57 (Android Alpha Testing)

### Added - Platform-Specific Notification Systems
- iOS: Hourly setInterval timer (16 breathing + 2 mood reminders, 1-2 day coverage)
- Android: AppState listener (112 breathing + 7 mood reminders, 7 day coverage)
- Explicit notification cancellation before rescheduling to prevent duplicates
- Platform-specific constants: MOOD_DAYS (iOS: 2, Android: 7), BREATHING_COUNT (iOS: 16, Android: 112)

### Changed
- Removed USE_EXACT_ALARM and SCHEDULE_EXACT_ALARM permissions (Google Play policy)
- App category changed to "Health & Fitness" for Google Play

### Documentation
- Created NOTIFICATION_SYSTEM.md with technical architecture
- Created BUILD_61_SUMMARY.md and BUILD_61_DEPLOYMENT.md
- Updated ANDROID_RELEASE.md with platform-specific details

## [1.2.0] - Build 57-60 (Android Alpha Testing)

### Fixed
- White flash during navigation (added theme configuration to NavigationContainer)
- Notification system stopped firing on Android (added AppState listener)

### Added
- 14-day closed alpha testing on Google Play with 25+ testers
- Multiple build iterations to fix Android-specific issues

## [1.2.0] - Build 54-56 (iOS Production)

### Added - Enhanced Technique System
- Expanded to 28 DBT/CBT techniques (added 8 new techniques)
- Enhanced AI suggestion algorithm with synonym mapping and weighted scoring
- 100% citation coverage for all 28 techniques from evidence-based sources
- Expanded breathing reminders from 25 to 98 unique messages

### Fixed
- Safety Plan emergency contact buttons (call/text functionality)
- Optimized mood reminders from 7 days to 2 days

### Changed
- Added ios/ and android/ to .gitignore (generated by EAS prebuild)

## [1.1.0] - Build 33 (In Testing)

### Added - Modern UI Upgrade
- Complete design system with modern color palette and design tokens
- Reusable Button component with gradient backgrounds and scale animations
- Reusable Card component with iOS-style shadows
- Floating translucent tab bar with frosted glass effect (88px height)
- Gradient header on Home screen
- 2×3 Quick Actions grid with circular icon containers
- 180px gradient breathing circle with enhanced animations
- Gradient buttons throughout (green/red for breathing, primary for actions)
- Circular icon containers (48-56px) on Crisis and Home screens
- iOS-style shadows with proper elevation (2-8px blur)
- 16-20px border radius on all cards and buttons
- Scale animations on button press (0.97→1.0) for tactile feedback

### Changed
- Updated color palette: Light (#F8F9FA bg, #2E845D primary), Dark (#111418 bg, #3FAF7F primary)
- Increased tab bar height from 60px to 88px for better touch targets
- Improved spacing throughout app (28px section spacing, 20px card padding)
- Enhanced typography with design tokens (H1: 30px/700, H2: 20px/600)
- Modernized all screens: Home, Breathing, Crisis, AI Support, Settings, Progress, Tools

### Fixed
- Tab bar overlap issue: Added 120-140px bottom padding to all ScrollViews
- Breathing screen button visibility: Changed layout from minHeight to flex: 1
- Home screen Quick Actions layout: Confirmed 2×3 grid (48% width cards)

### Dependencies
- Added expo-linear-gradient for gradient UI elements
- Added expo-blur for frosted glass tab bar effect

## [1.0.0] - Build 20 (Production)

### Added - Midnight Auto-Reset System
- Complete notification system rewrite with midnight auto-reset architecture
- Date-based triggers only (no interval triggers, no AppState listeners)
- Silent system notification at midnight regenerates all notifications automatically
- 24 hourly breathing reminders with 25 randomized DBT/CBT messages
- 7-day mood check-in reminders at 8 PM daily
- Opt-in notification permissions (default off, user must enable)
- Debug notification viewer in Settings for troubleshooting
- DEV_MODE flag for testing (3 notifications/60s) vs production (24/hour)

### Changed
- Notification system now self-perpetuating with zero spam
- Improved notification reliability on iOS

## [1.0.0] - Build 14

### Added - Dark Mode
- Global dark mode support with comprehensive ThemeContext
- Theme toggle in Settings under "Appearance" section
- Trauma-informed color palette following Apple Human Interface Guidelines
- Theme preference persists across app restarts
- Charts and progress screens dynamically adapt to current theme

### Added - Enhanced AI Support
- Upgraded to GPT-4o-mini model (improved performance, cost-efficient)
- "Anchor" AI personality with trauma-informed responses
- Adaptive behavior based on user emotional state
- Enhanced crisis detection and safety resource provision
- Personalized DBT/CBT technique suggestions
- Gentle, validating communication designed for PTSD support

### Changed
- All screens seamlessly adapt to light/dark themes
- Enhanced accessibility compliance in both modes

## [1.0.0] - Build 12

### Added - Enhanced Notifications
- Fixed iOS notification scheduling issues
- 25 randomized breathing reminder messages
- DBT/CBT-inspired reminder content
- Hourly breathing reminders (24 individual notifications)
- Auto-reschedule when less than 12 hours remain
- Daily mood check-in reminders at 8:00 PM
- AppState listener for automatic reminder refresh

## [1.0.0] - Build 10

### Added - Breathing Exercises
- 5 swipeable breathing methods (Box, 4-7-8, Resonant, Physiological Sigh, Triangle)
- Animated breathing circle with haptic feedback
- Session tracking and history
- Horizontal swipe navigation between methods

## [1.0.0] - Build 9

### Added - Medical Citations
- Comprehensive citations on every technique
- Sources from Harvard Medical School, Mayo Clinic, APA, VA, etc.
- Clickable "View Source" links
- Dedicated Resources & Citations screen

## [1.0.0] - Initial Release

### Added
- 30+ DBT/CBT techniques across 6 categories
- AI Support with OpenAI GPT-4 integration
- Mood tracking and progress analytics
- Safety plan with secure storage
- Crisis resources with location services
- Offline functionality
- Data export feature
- Accessibility support (VoiceOver)
- Error handling and logging
- App rating prompt

### Categories
- Grounding Techniques: 5-4-3-2-1, Box Breathing, Progressive Muscle Relaxation
- Distress Tolerance: TIPP, ACCEPTS, Self-Soothe
- Emotion Regulation: PLEASE, Opposite Action, Check the Facts
- Interpersonal Skills: DEAR MAN, GIVE
- Mindfulness: Observe, Describe, Participate
- Cognitive Techniques: Thought Records, Behavioral Activation, Exposure
