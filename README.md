# Anchor - PTSD Support App

A mobile application designed to provide comprehensive support for veterans and individuals with PTSD through evidence-based DBT/CBT techniques, AI-powered crisis support, and immediate access to mental health resources.

## Features

### 🏠 Home Dashboard
- Quick access to essential tools
- Daily motivational reminders
- Emergency crisis button

### 🛠️ DBT/CBT Tools (with Medical Citations)
- **Grounding Techniques**: 5-4-3-2-1, Box Breathing, Progressive Muscle Relaxation
- **Distress Tolerance**: TIPP, ACCEPTS, Self-Soothe
- **Emotion Regulation**: PLEASE, Opposite Action, Check the Facts
- **Interpersonal Skills**: DEAR MAN, GIVE
- **Mindfulness**: Observe, Describe, Participate
- **Cognitive Techniques**: Thought Records, Behavioral Activation, Exposure
- **All 28 techniques include citations** from authoritative sources (Harvard Medical School, Mayo Clinic, APA, VA, Behavioural Tech, etc.)

### 🤖 AI Support Agent
- Real-time technique suggestions based on user input
- Crisis moment guidance
- Contextual support conversations
- Intelligent keyword matching for appropriate interventions

### 🚨 Crisis Support
- Immediate access to crisis hotlines
- Emergency contact integration
- Safety planning tools
- Veteran-specific resources

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd AnchorApp
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Run on device/simulator
```bash
npm run ios    # for iOS
npm run android # for Android
```

## Technology Stack

- **Framework**: React Native with Expo SDK 54
- **Navigation**: React Navigation v6
- **State Management**: React Hooks + Context API (ThemeContext)
- **UI Components**: Custom components with React Native + Expo Linear Gradient
- **Icons**: Expo Vector Icons
- **Storage**: AsyncStorage + Expo Secure Store
- **Notifications**: Expo Notifications
- **AI Integration**: OpenAI GPT-4 API
- **Charts**: React Native Chart Kit
- **Design System**: iOS Human Interface Guidelines with trauma-informed color palette

## Key Components

### Data Layer
- `src/data/techniques.js` - 28 DBT/CBT techniques with enhanced suggestion algorithm
- `src/data/citations.js` - Medical citations from authoritative sources
- `src/data/dailyReminders.js` - 180 trauma-informed daily reminders (CBT/DBT focused)
- `src/data/breathingMethods.js` - 5 breathing exercise patterns
- `src/data/emotionModel.js` - Emotion categories for detailed mood logging

### Screens
- `src/screens/HomeScreen.js` - Dashboard with quick actions
- `src/screens/ToolsScreen.js` - Categorized technique browser with citations
- `src/screens/AIAgentScreen.js` - Intelligent support agent
- `src/screens/BreathingScreen.js` - Swipeable breathing exercises
- `src/screens/CrisisScreen.js` - Emergency support resources
- `src/screens/ProgressScreen.js` - Analytics and mood tracking
- `src/screens/SettingsScreen.js` - App configuration and theme toggle
- `src/screens/ResourcesScreen.js` - Medical citations and sources
- `src/screens/DisclaimerScreen.js` - Medical disclaimer on first launch

### Components
- `src/components/Button.js` - Modern button with gradients and animations
- `src/components/Card.js` - iOS-style card with shadows and variants
- `src/components/OnboardingTour.js` - 5-slide welcome tour with accessibility
- `src/components/MoodTracker.js` - Quick 5-point mood logging
- `src/components/DetailedMoodLog.js` - Enhanced emotion tracking with intensity and notes
- `src/components/SafetyPlan.js` - Interactive safety plan with contact management

### Context & Utils
- `src/context/ThemeContext.js` - Global dark/light theme with design tokens
- `src/utils/notifications.js` - Notification scheduling with shuffle algorithm (150 breathing messages)
- `src/utils/storage.js` - AsyncStorage wrapper with error handling
- `src/services/openai.js` - OpenAI API integration with 16-message context window

## Recent Updates (Build 94 - Message Variety & Context Improvements)

### Build 94 (v1.2.12) - Message Variety & Context Improvements ✅ COMPLETE
- ✅ Fisher-Yates shuffle algorithm for breathing reminders (no repeats until all 150 seen)
- ✅ 52 new breathing reminder messages (98 → 150 total)
- ✅ 30 new CBT/DBT daily reminders (150 → 180 total)
- ✅ AI context window increased from 6 to 16 messages (better conversation continuity)
- ✅ iOS: 48 unique breathing messages over 3 days
- ✅ Android: All 150 unique messages over 7 days
- ✅ 24 unit tests for shuffle algorithm (all passing)
- ✅ 4 unit tests for context window (all passing)
- ✅ No change to 10 messages/day limit

### Build 90-92 (v1.2.9-1.2.11) - Interactive Safety Plan ✅ COMPLETE
- ✅ Converted Safety Plan from text fields to interactive list-based UI
- ✅ Tap-to-call and tap-to-text buttons for emergency contacts
- ✅ Automatic phone number formatting (XXX-XXX-XXXX)
- ✅ Add/remove functionality for all sections
- ✅ Simplified visual design with divider lines (trauma-informed, less overwhelming)
- ✅ Automatic data migration from old string format to new array format
- ✅ Cross-platform modal support (iOS: Alert.prompt, Android: custom modal)
- ✅ Full accessibility support with VoiceOver/TalkBack
- ✅ No new permissions required (uses standard tel:// and sms:// URL schemes)
- ✅ 18 comprehensive unit tests covering all functionality

### Build 88-89 (v1.2.7-1.2.8) - Secure AI Backend ✅ COMPLETE
- ✅ Vercel serverless backend proxy to protect OpenAI API key
- ✅ Client-side and server-side rate limiting (5 req/min, 10 msg/day per device)
- ✅ Device fingerprinting via expo-device for rate limit enforcement
- ✅ Compassionate error messages for rate limits
- ✅ Phone number validation for crisis resources
- ✅ Removed API key from client-side code
- ✅ Cost control: ~$10-18/month for 100 users

### Build 82 (v1.2.6) - Comprehensive Accessibility Improvements ✅ COMPLETE
- ✅ Fixed critical VoiceOver navigation in BreathingScreen (only visible method accessible)
- ✅ Fixed SwipeableReminders pagination (only visible reminder accessible)
- ✅ Removed custom accessibilityActions in favor of standard three-finger swipe
- ✅ Added accessibility roles (header, alert, text) throughout all 7 screens
- ✅ Grouped multi-element content (technique steps, citations) as single accessible elements
- ✅ Added proper accessibility labels, hints, and states to all interactive elements
- ✅ Marked decorative button children (icons, text) as accessible={false}
- ✅ 20 comprehensive unit tests verifying accessibility logic
- ✅ Full compliance with iOS/Android accessibility guidelines
- ✅ Addresses first user review feedback requesting better blind user support

### Build 75-76 (v1.2.5) - Customizable Reminders ✅ COMPLETE
- ✅ Customizable mood check-in time (default 8:00 PM)
- ✅ Customizable breathing intervals: 90, 120, 180, 240 minutes (default 90)
- ✅ Full-width picker modals with dark mode support
- ✅ Temp state for cancel button functionality
- ✅ Background notification rescheduling to prevent modal lag
- ✅ Respects platform-specific coverage (iOS: 3 days, Android: 7 days)
- ✅ Increased AI max_tokens from 200→800 to prevent response cutoff
- ✅ Released to iOS App Store and Google Play production

### Build 70 - Trauma-Informed Analytics Improvements ✅ COMPLETE
- ✅ Fixed double-counting bug: views and ratings now tracked separately
- ✅ Replaced vertical bar chart with horizontal progress bars (full technique names visible)
- ✅ Added qualitative effectiveness labels: "Very Helpful", "Helpful", "Somewhat Helpful", "Needs Practice"
- ✅ Added optional view count toggle (eye icon) - default off to reduce pressure
- ✅ Renamed charts with supportive language:
  - "Your Go-To Techniques" - Tools you often reach for when you need support
  - "What's Felt Most Helpful" - Tools you've found helpful at times
- ✅ Updated Quick Stats labels:
  - "Times you checked in" (was Total Mood Logs)
  - "Support Moments" (was Techniques Used)
  - Removed "Average Mood" to reduce clinical pressure
- ✅ Normalized bar charts to reduce comparison anxiety
- ✅ 16 comprehensive unit tests covering all analytics functionality
- ✅ Follows mental health app best practices for trauma-informed design

### Build 68-69 - Production Release & Emotion Model Refinements ✅ COMPLETE (iOS LIVE)
- ✅ iOS v1.2.1 (Build 68) released to App Store (US, UK, Australia)
- ✅ Removed debug buttons from Settings for production (Export Notifications, Reset Onboarding)
- ✅ Refined emotion model: "Alerted / Anxious / On Edge" with PTSD-appropriate secondary emotions
- ✅ Added "Fearful / Unsafe" and "Hypervigilant" to anxiety family
- ✅ Moved "Shut Down / Collapsed" to low energy family (hypo-arousal vs hyper-arousal)
- ✅ Android Build 69 ready for Google Play production access

### Build 65-66 - Onboarding Tour & Enhanced Mood Logging ✅ COMPLETE (Android Alpha)
- ✅ 5-slide onboarding tour for new users (Welcome, DBT/CBT Tools, Progress Tracking, AI Support, Privacy)
- ✅ Full accessibility support with screen reader announcements
- ✅ Skip functionality and proper navigation flow (Disclaimer → Onboarding → Home)
- ✅ Enhanced mood logging with emotion model Phase 1:
  - Quick Log: Fast 5-point mood scale (existing)
  - Detailed Log: Primary emotion + intensity slider + optional notes
  - Progressive disclosure UI design
- ✅ Safe area insets for Android navigation bars
- ✅ Comprehensive error handling and logging
- ✅ Only shows for new users (existing users unaffected)

### Build 63-64 - iOS Notification Improvements ✅ COMPLETE
- ✅ iOS AppState listener for immediate notification rescheduling on app open
- ✅ Dual system: AppState listener (immediate) + hourly timer (backup)
- ✅ Fixed export notifications button with proper error handling
- ✅ Updated documentation with iOS AppState listener architecture

### Build 61 - iOS 64 Notification Limit Discovery ✅ COMPLETE
- ✅ Discovered iOS platform limit of 64 scheduled notifications
- ✅ iOS: 48 breathing + 7 mood = 55 total (3-day coverage)
- ✅ Android: 112 breathing + 7 mood = 119 total (7-day coverage)
- ✅ Platform-specific notification counts and strategies

### Build 54 - Enhanced Technique System & Notifications ✅ COMPLETE
- ✅ Expanded to 28 DBT/CBT techniques (added 8 new: Safe Place Visualization, Cold Grounding, Name 3 Things, Radical Acceptance, Pros and Cons, Self-Validation, Half-Smile and Willing Hands, plus additional breathing method)
- ✅ Enhanced AI suggestion algorithm with synonym mapping and weighted scoring
- ✅ 100% citation coverage for all 28 techniques from evidence-based sources
- ✅ Expanded breathing reminders from 25 to 98 unique messages
- ✅ Optimized mood reminders from 7 days to 2 days (daily rescheduling makes this sufficient)
- ✅ Fixed Safety Plan emergency contact buttons (call/text functionality)
- ✅ Comprehensive test suite with 68 passing tests
- ✅ Added ios/ and android/ to .gitignore (generated by EAS prebuild)

## Previous Updates (Build 44 - Modern UI Complete)

### Build 39-44 - AI Agent & Tab Bar Refinements ✅ COMPLETE
- ✅ Fixed AI Agent keyboard behavior with proper KeyboardAvoidingView configuration
- ✅ Input box positioned at bottom: 88px (above 75px tab bar)
- ✅ ScrollView with marginBottom: 168px prevents content behind tab bar
- ✅ Technique suggestions positioned absolutely at bottom: 168px with max height
- ✅ Category names formatted (removed underscores, proper capitalization)
- ✅ Enhanced tab bar visibility with 27px bold icons and 13px/600 labels
- ✅ High-contrast colors: Dark mode (#4ADE80 active, #6B7280 inactive), Light mode (#2E845D active, #94A3B8 inactive)
- ✅ Solid tab bar backgrounds (#0F1115 dark, #FFFFFF light) with improved shadows
- ✅ Tab bar height optimized to 75px with labels positioned below icons
- ✅ Full VoiceOver accessibility maintained throughout

### Build 31-38 - Modern UI Upgrade ✅ COMPLETE
- ✅ Comprehensive design system with modern color palette and design tokens
- ✅ Reusable Button and Card components with gradients and animations
- ✅ Modernized Home screen with gradient header and 2×3 Quick Actions grid
- ✅ Enhanced Breathing screen with 180px gradient circle and modern buttons
- ✅ Redesigned Crisis screen with gradient emergency cards and circular icons
- ✅ Updated AI Support, Settings, Progress, and Tools screens with modern styling
- ✅ iOS-style shadows, 16-20px border radius, improved spacing throughout
- ✅ Scale animations on button press (0.97→1.0) for tactile feedback
- ✅ Fixed tab bar overlap with proper bottom padding on all screens

## Previous Updates (Build 20 - Production)

### Build 20 - Midnight Auto-Reset System ✅ COMPLETE
- ✅ Complete notification system rewrite with midnight auto-reset architecture
- ✅ Date-based triggers only (no interval triggers, no AppState listeners)
- ✅ Silent system notification at midnight regenerates all notifications automatically
- ✅ 16 breathing reminders (90-minute intervals) with 98 randomized DBT/CBT messages
- ✅ 2-day mood check-in reminders at 8 PM daily (optimized for daily rescheduling)
- ✅ Opt-in notification permissions (default off, user must enable)
- ✅ Debug notification viewer in Settings for troubleshooting
- ✅ DEV_MODE flag for testing (3 notifications/60s) vs production (24/hour)
- ✅ Zero immediate firing, zero spam, self-perpetuating system

### Build 17-20 - App Store Versions ✅ COMPLETE
- ✅ Expanded to 19 evidence-based techniques (added all breathing methods)
- ✅ Working AI Agent with proper OpenAI API integration
- ✅ Fixed notification system with reliable date-based triggers
- ✅ Optimized notification rescheduling with cooldown prevention
- ✅ Perfect breathing screen layout with no overlapping elements
- ✅ All features fully functional and tested

### Dark Mode (Build 14) ✅ COMPLETE
- ✅ Global dark mode support with comprehensive ThemeContext
- ✅ Theme toggle in Settings under "Appearance" section
- ✅ All screens seamlessly adapt to light/dark themes
- ✅ Trauma-informed color palette following Apple Human Interface Guidelines
- ✅ Theme preference persists across app restarts
- ✅ Charts and progress screens dynamically adapt to current theme
- ✅ Enhanced accessibility compliance in both modes

### Enhanced AI Support (Build 14) ✅ COMPLETE
- ✅ Upgraded to GPT-4o-mini model (improved performance, cost-efficient)
- ✅ "Anchor" AI personality with trauma-informed responses
- ✅ Adaptive behavior based on user emotional state
- ✅ Enhanced crisis detection and safety resource provision
- ✅ Personalized DBT/CBT technique suggestions
- ✅ Gentle, validating communication designed for PTSD support

### Enhanced Notifications (Build 12-14)
- ✅ Fixed iOS notification scheduling issues
- ✅ 25 randomized breathing reminder messages
- ✅ DBT/CBT-inspired reminder content
- ✅ Hourly breathing reminders (24 individual notifications)
- ✅ Auto-reschedule when less than 12 hours remain
- ✅ Daily mood check-in reminders at 8:00 PM
- ✅ AppState listener for automatic reminder refresh

### Breathing Exercises (Build 10)
- ✅ 5 swipeable breathing methods (Box, 4-7-8, Resonant, Physiological Sigh, Triangle)
- ✅ Animated breathing circle with haptic feedback
- ✅ Session tracking and history
- ✅ Horizontal swipe navigation between methods

### Medical Citations (Build 9)
- ✅ Comprehensive citations on every technique
- ✅ Sources from Harvard Medical School, Mayo Clinic, APA, VA, etc.
- ✅ Clickable "View Source" links
- ✅ Dedicated Resources & Citations screen

## Future Enhancements

### Version 1.3.0 (Android Release)
- Android platform support via Google Play Store
- Platform-specific optimizations
- Cross-platform testing and validation

### Version 1.4.0
- Interactive exposure therapy tracker (user-requested feature)
- Enhanced AI conversation capabilities with longer context
- Personalized technique recommendations based on usage patterns
- Apple Watch companion app
- Data backup to iCloud

### Version 2.0.0
- Multi-language support (Spanish, French, German priority)
- Wearable device integration (heart rate monitoring)
- Advanced analytics and insights
- Peer support matching (optional, privacy-focused)
- Professional therapist directory integration

## Contributing

This app is designed to help save lives. Contributions focused on improving mental health support are welcome.

- Open an issue to report bugs or suggest features
- Submit pull requests for improvements
- Help with documentation and testing
- Share feedback from users
- See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines
- Check [ROADMAP.md](ROADMAP.md) for planned features

## License

MIT License - Feel free to use this code to help others. See [LICENSE](LICENSE) for details.

## Disclaimer

This app is not a replacement for professional mental health treatment. If you're experiencing a mental health crisis, please contact emergency services or a crisis hotline immediately.

## Crisis Resources

- **National Suicide Prevention Lifeline**: 988
- **Crisis Text Line**: Text HOME to 741741
- **Veterans Crisis Line**: 1-800-273-8255 (Press 1)

## Support

If this app has helped you or someone you know, please consider:
- ⭐ Starring this repository
- 📢 Sharing it with others who might benefit
- 🐛 Reporting bugs or suggesting improvements
- 💝 Contributing code or documentation