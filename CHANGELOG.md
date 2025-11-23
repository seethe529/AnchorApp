# Changelog

All notable changes to Anchor PTSD Support App will be documented in this file.

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
