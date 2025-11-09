# Contributing to Anchor

Thank you for your interest in contributing to Anchor! This app is designed to help people with PTSD and trauma, so every contribution has the potential to make a real difference in someone's life.

## Code of Conduct

This project is dedicated to providing a welcoming and supportive environment for all contributors. We expect:

- **Respect**: Treat everyone with respect and kindness
- **Empathy**: Remember that this app serves people in crisis
- **Professionalism**: Keep discussions focused and constructive
- **Privacy**: Never share user data or personal information
- **Safety**: Prioritize user safety in all features

## How Can I Contribute?

### Reporting Bugs

Before creating a bug report:
- Check if the bug has already been reported in Issues
- Test on the latest version
- Gather as much information as possible

When reporting a bug, include:
- **Description**: Clear description of the issue
- **Steps to Reproduce**: Detailed steps to recreate the bug
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: Device, OS version, app version
- **Screenshots**: If applicable

### Suggesting Features

We welcome feature suggestions! Please:
- Check if the feature has already been suggested
- Explain the problem the feature would solve
- Describe how it would help users with PTSD/trauma
- Consider privacy and safety implications

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch** from `develop`:
   ```bash
   git checkout -b feature/your-feature-name develop
   ```
3. **Make your changes**
4. **Test thoroughly**:
   ```bash
   npm test
   ```
5. **Commit with clear messages**:
   ```bash
   git commit -m "feat: Add feature description"
   ```
6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request** to the `develop` branch

## Development Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator

### Installation
```bash
git clone https://github.com/seethe529/AnchorApp.git
cd AnchorApp
npm install
```

### Running the App
```bash
npm start          # Start Expo dev server
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm test           # Run tests
```

### Environment Variables
Create a `.env` file:
```
OPENAI_API_KEY=your_api_key_here
```

## Coding Guidelines

### Style
- Use functional components with hooks
- Follow existing code style
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

### Components
- One component per file
- Use React.memo for expensive components
- Add PropTypes or TypeScript types
- Include accessibility labels

### Testing
- Write tests for new features
- Maintain test coverage
- Test on both iOS and Android
- Test offline functionality

### Accessibility
- Add `accessibilityLabel` to all interactive elements
- Add `accessibilityHint` for complex interactions
- Use `accessibilityRole` appropriately
- Test with VoiceOver/TalkBack

### Commit Messages
Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Example:
```
feat: Add technique effectiveness tracking

- Users can rate techniques after viewing
- Progress screen shows effectiveness ratings
- Helps users identify what works best
```

## Areas We Need Help

### High Priority
- **Accessibility**: VoiceOver testing and improvements
- **Localization**: Spanish translation
- **Testing**: More comprehensive test coverage
- **Documentation**: User guides and tutorials

### Medium Priority
- **Features**: Dark mode, data backup, onboarding
- **Performance**: Bundle size optimization
- **UI/UX**: Animations and micro-interactions

### Low Priority
- **Integrations**: Apple Watch, widgets
- **Advanced Features**: Siri shortcuts, Spotlight search

## Important Considerations

### User Safety
- **Crisis Features**: Never remove or hide crisis resources
- **Medical Disclaimer**: Always maintain clear disclaimers
- **Data Privacy**: Never collect or transmit user data without consent
- **Offline First**: Core features must work offline

### Privacy
- No tracking or analytics without explicit consent
- Local-first data storage
- Secure storage for sensitive information
- Clear privacy policy

### Mental Health Best Practices
- Use trauma-informed language
- Avoid triggering content
- Provide content warnings when necessary
- Link to professional resources

## Questions?

- **Issues**: Open an issue for questions
- **Discussions**: Use GitHub Discussions for general questions
- **Email**: Contact the maintainer for sensitive issues

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- App credits (if applicable)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping make Anchor better! Your contributions can help save lives. 💚
