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

- **Framework**: React Native with Expo
- **Navigation**: React Navigation
- **State Management**: React Hooks
- **UI Components**: Custom components with React Native
- **Icons**: Expo Vector Icons

## Key Components

- `src/data/techniques.js` - Comprehensive DBT/CBT technique database
- `src/data/citations.js` - Medical citations from authoritative sources
- `src/screens/AIAgentScreen.js` - Intelligent support agent
- `src/screens/ToolsScreen.js` - Categorized technique browser with citations
- `src/screens/ResourcesScreen.js` - Dedicated resources and citations screen
- `src/screens/CrisisScreen.js` - Emergency support resources
- `src/screens/DisclaimerScreen.js` - Medical disclaimer on first launch

## Recent Updates (Build 9)

### Medical Citations (Apple Guideline 1.4.1 Compliance)
- ✅ Comprehensive citations on every technique
- ✅ Sources from Harvard Medical School, Mayo Clinic, APA, VA National Center for PTSD, University of Rochester Medical Center, Behavioural Tech, NAMI
- ✅ Clickable "View Source" links
- ✅ Dedicated Resources & Citations screen
- ✅ All URLs verified and working

### UI/UX Improvements
- ✅ Improved technique detail page layout (Apple HIG compliant)
- ✅ Better spacing and typography
- ✅ Auto-scroll to top when opening techniques
- ✅ Feedback moved to bottom for better reading flow

## Future Enhancements

- Enhanced AI conversation capabilities
- Personalized technique recommendations based on usage
- Push notifications for reminders
- Integration with wearable devices
- Multi-language support

## Contributing

This app is designed to help save lives. Contributions focused on improving mental health support are welcome.

## Contributing

This app is designed to help save lives. Contributions focused on improving mental health support are welcome.

- Open an issue to report bugs or suggest features
- Submit pull requests for improvements
- Help with documentation and testing
- Share feedback from users

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