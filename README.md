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
- **All techniques include citations** from authoritative sources (Harvard Medical School, Mayo Clinic, APA, VA, etc.)

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
- **UI Components**: Custom components with React Native
- **Icons**: Expo Vector Icons
- **Storage**: AsyncStorage + Expo Secure Store
- **Notifications**: Expo Notifications
- **AI Integration**: OpenAI GPT-4 API
- **Charts**: React Native Chart Kit

## Key Components

### Data Layer
- `src/data/techniques.js` - 30+ DBT/CBT techniques database
- `src/data/citations.js` - Medical citations from authoritative sources
- `src/data/dailyReminders.js` - 150+ trauma-informed daily reminders
- `src/data/breathingMethods.js` - 5 breathing exercise patterns

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

### Context & Utils
- `src/context/ThemeContext.js` - Global dark/light theme management
- `src/utils/notifications.js` - Notification scheduling and management
- `src/utils/storage.js` - AsyncStorage wrapper with error handling
- `src/services/openai.js` - OpenAI API integration

## Recent Updates (Build 16 - App Store Ready)

### Build 16 - Final App Store Version ✅ COMPLETE
- ✅ Working AI Agent with proper OpenAI API integration
- ✅ Fixed notification system with reliable date-based triggers
- ✅ Perfect breathing screen layout with no overlapping elements
- ✅ All features fully functional and tested
- ✅ Ready for App Store submission

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

### Version 1.2.0
- Enhanced AI conversation capabilities with longer context
- Personalized technique recommendations based on usage patterns
- Apple Watch companion app
- Data backup to iCloud
- Customizable reminder times

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