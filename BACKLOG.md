# Anchor App - Development Backlog

## Build 14 - Dark Mode Implementation

**Priority:** High  
**Estimated Effort:** 4-6 hours  
**Status:** ✅ COMPLETED (Build 14 - November 2025)

### Description
Implemented comprehensive dark mode support with global theme management.

### Implementation
- Created ThemeContext for global theme state management
- Updated all screens to use dynamic theme colors
- Added theme toggle in Settings under "Appearance"
- Theme preference persists across app restarts
- Charts and progress visualizations adapt to theme
- Trauma-informed color pale# Anchor App - Development Backlog

**Current Build:** 53 (Expo SDK 54)  
**Last Updated:** January 2025  
**Status:** Production-ready, preparing for Android release

---

## Upcoming - Android Release

**Priority:** High  
**Estimated Effort:** 1-2 days  
**Status:** 🔄 IN PROGRESS

### Description
Prepare and release Android version of Anchor app to Google Play Store.

### Tasks
- [ ] Configure Android build settings in app.config.js
- [ ] Generate Android app signing key
- [ ] Test on Android emulator/device
- [ ] Verify all features work on Android
- [ ] Create Google Play Store listing
- [ ] Prepare screenshots for Play Store
- [ ] Submit to Google Play for review

### Files to Modify
- `app.config.js` - Android configuration
- `eas.json` - Android build profile
- Google Play Store assets

---

## Future Enhancements (v1.2+)

### Enhanced AI Conversation
- Longer conversation history (100+ messages)
- Context-aware technique suggestions
- Sentiment analysis for mood tracking
- Voice input support

### Personalized Recommendations
- ML-based technique recommendations
- Usage pattern analysis
- "Techniques that work for you" section
- Smart reminders based on mood patterns

### Data Export & Backup
- Export mood logs to CSV
- iCloud backup integration
- Share progress with therapist
- Data portability (GDPR compliance)

### Apple Watch Integration
- Quick breathing exercises
- Mood logging from watch
- Crisis button on watch face
- Heart rate integration

### Multi-Language Support
- Spanish translation
- Localized crisis resources
- RTL language support

### Social Features (Optional)
- Anonymous peer support groups
- Share techniques (not personal data)
- Community-contributed reminders

---

## Technical Debt

### Code Quality
- [ ] Add TypeScript for better type safety
- [ ] Increase test coverage to 90%+
- [ ] Refactor ToolsScreen (too large)
- [ ] Extract reusable components from screens

### Performance
- [ ] Optimize FlatList rendering in ProgressScreen
- [ ] Reduce app bundle size
- [ ] Implement code splitting
- [ ] Add performance monitoring

### Documentation
- [ ] API documentation for all utilities
- [ ] Component prop documentation
- [ ] Architecture decision records (ADRs)
- [ ] Contributing guidelines

---

## Completed Features

### Build 44 (January 2025)
- ✅ Modern UI upgrade complete
- ✅ Dark mode and light mode fully implemented
- ✅ Theme toggle in Settings (persists across restarts)
- ✅ All screens adapt to theme dynamically
- ✅ AI Agent keyboard behavior fixes
- ✅ Enhanced tab bar with high contrast
- ✅ Improved accessibility throughout
- ✅ Unit tests updated and passing (60/60)

### Build 20 (December 2024)
- ✅ Midnight auto-reset notification system
- ✅ 24 hourly breathing reminders
- ✅ 7-day mood check-in reminders
- ✅ Opt-in notification permissions
- ✅ Debug notification viewer
- ✅ Self-perpetuating notification architecture

### Build 14 (November 2024)
- ✅ Dark mode with ThemeContext
- ✅ Theme toggle in Settings
- ✅ GPT-4o-mini AI upgrade
- ✅ Trauma-informed color palette

### Build 10 (November 2024)
- ✅ Swipeable breathing exercises (5 methods)
- ✅ Animated breathing circle with haptics
- ✅ Session tracking and history

### Build 9 (November 2024)
- ✅ Medical citations on all techniques
- ✅ Resources & Citations screen
- ✅ Apple App Store approval

### Build 8 (October 2024)
- ✅ AI Support Agent with OpenAI
- ✅ Mood tracking with charts
- ✅ Progress analytics
- ✅ Safety Plan with encrypted storage
- ✅ 30+ DBT/CBT techniques
- ✅ Crisis resources screen

---

## Notes

- **Current Build:** 53 (Expo SDK 54)
- **iOS Status:** Live on App Store
- **Android Status:** In development
- **Focus:** Android release preparation
- **Next:** Google Play Store submission

### Removed Features
- ❌ Medication reminders (removed from app)
- Notification system now focuses on mood check-ins and breathing reminders only

### Known Limitations
- **Expo Go:** Scheduled notifications don't work in Expo Go (Expo limitation)
- **Testing:** Full notification testing requires EAS production builds
- **Android:** First-time Android release, may need iteration

---

Last Updated: January 2025
