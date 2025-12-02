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

**Current Build:** 54 (Expo SDK 54)  
**Last Updated:** December 2, 2025  
**Status:** Build 54 in TestFlight, preparing for App Store + Android release

---

## Upcoming - App Store & Android Release

**Priority:** High  
**Estimated Effort:** 2-3 days  
**Status:** 🔄 IN PROGRESS (Build 54 in TestFlight testing)

### Description
Prepare and release Android version of Anchor app to Google Play Store.

### iOS Tasks (Build 54)
- [x] Enhanced technique system with 7 new techniques
- [x] Expanded breathing reminders to 98 messages
- [x] Fixed Safety Plan emergency contacts
- [x] Optimized notifications (2-day mood reminders)
- [x] Build 54 submitted to TestFlight
- [ ] 24-hour TestFlight testing
- [ ] Submit Build 54 to App Store

### Android Tasks
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

### Build 54 (December 2025)
- ✅ Expanded to 28 DBT/CBT techniques (8 new techniques added)
- ✅ Enhanced AI suggestion algorithm with synonym mapping
- ✅ 100% citation coverage for all techniques
- ✅ Expanded breathing reminders from 25 to 98 messages
- ✅ Optimized mood reminders from 7 days to 2 days
- ✅ Fixed Safety Plan emergency contact buttons
- ✅ Comprehensive test suite (68 tests passing)
- ✅ Removed ios/ and android/ from git (EAS managed)
- ✅ Build 54 submitted to TestFlight

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
- ✅ 16 breathing reminders (90-minute intervals)
- ✅ Mood check-in reminders at 8 PM daily
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

- **Current Build:** 54 (Expo SDK 54)
- **iOS Status:** Build 54 in TestFlight testing
- **Android Status:** Pending iOS approval
- **Focus:** TestFlight validation, then App Store + Android
- **Next:** 24-hour testing, then App Store submission

### Removed Features
- ❌ Medication reminders (removed from app)
- Notification system now focuses on mood check-ins and breathing reminders only

### Known Limitations
- **Expo Go:** Scheduled notifications don't work in Expo Go (Expo limitation)
- **Testing:** Full notification testing requires EAS production builds
- **Android:** First-time Android release, may need iteration

---

Last Updated: December 2, 2025
