# Anchor App Roadmap

This document tracks planned features, enhancements, and ideas for future versions of Anchor.

**Current Status:** v1.2.14, Build 104 | iOS live on App Store | Android in Closed Testing  
**Last Updated:** June 28, 2026

---

## ✅ Completed (v1.0 – v1.2.14)

### Core Features (v1.0)
- ✅ 28 evidence-based DBT/CBT techniques across 6 categories
- ✅ AI Support with OpenAI GPT-4o-mini (10 messages/day, 16-message context)
- ✅ Mood tracking with charts and progress analytics
- ✅ Safety plan with encrypted secure storage
- ✅ Crisis resources with location services
- ✅ Offline functionality
- ✅ Accessibility support (VoiceOver, TalkBack)
- ✅ App rating prompt

### Breathing & Techniques (v1.1)
- ✅ 5 swipeable breathing methods with animations and haptics
- ✅ Medical citations from Harvard, Mayo Clinic, APA, VA
- ✅ Dark mode with ThemeContext
- ✅ Modern UI overhaul with design system

### Notifications (v1.1–1.2)
- ✅ 150 unique breathing reminder messages (Fisher-Yates shuffle)
- ✅ 180 daily CBT/DBT reminder messages
- ✅ Platform-specific scheduling (iOS hourly, Android AppState)
- ✅ Auto-reschedule on date change

### Export & Data (v1.2.14)
- ✅ PDF progress report export with app branding
- ✅ Date range filter (7 days, 30 days, 3 months, All time)
- ✅ Android bottom sheet date picker
- ✅ Technique deduplication in reports
- ✅ Lifetime AI message counter
- ✅ Medical disclaimer in exports
- ✅ Friendly PDF filename

### Platform (v1.2)
- ✅ iOS App Store live
- ✅ Android closed testing (Google Play)
- ✅ Expo SDK 54 with React 19
- ✅ EAS Build pipeline for both platforms
- ✅ Centered adaptive icon for Android

---

## 🔜 Next Up (v1.3)

### High Priority

#### Share Report with Therapist
- [ ] Allow user to email PDF directly from the app
- [ ] Add therapist email to settings for quick sharing
- [ ] Optional: recurring scheduled exports

#### Onboarding Tutorial
- [ ] First-time user walkthrough
- [ ] Highlight key features (mood logging, AI, techniques, breathing)
- [ ] Skippable but accessible from Settings

#### Customizable Reminder Times
- [ ] Let users set their own breathing reminder interval
- [ ] Let users choose mood check-in time (not just 8 PM)
- [ ] Per-day scheduling

### Medium Priority

#### Enhanced AI Conversation
- [ ] Voice input support
- [ ] Context-aware technique suggestions based on mood history
- [ ] Sentiment analysis to detect escalation

#### Data Backup
- [ ] iCloud backup for iOS
- [ ] Google Drive backup for Android
- [ ] Data portability (GDPR compliance)

#### Widget Support
- [ ] iOS widget for quick mood log
- [ ] iOS widget for breathing exercise shortcut
- [ ] Android widget equivalent

---

## 🔮 Future (v2.0)

### Internationalization (i18n)
- [ ] AI responds in user's detected language (OpenAI already supports this)
- [ ] i18next framework for UI translation
- [ ] Community translation contributions
- [ ] Localized crisis resources by country
- [ ] Priority: Spanish, French, Arabic, Mandarin, German, Portuguese

### Wearable Integration
- [ ] Apple Watch companion (quick breathing, mood log, crisis button)
- [ ] Heart rate integration for stress detection
- [ ] Haptic breathing guidance on watch

### Advanced Analytics
- [ ] ML-based technique recommendations ("what works for you")
- [ ] Mood pattern detection and alerts
- [ ] Weekly/monthly insight summaries
- [ ] Correlation analysis (mood vs. technique usage)

### Social Features (Privacy-First)
- [ ] Anonymous peer support groups
- [ ] Share techniques (not personal data)
- [ ] Therapist portal for tracking client progress (with consent)
- [ ] Professional therapist directory

### Monetization (If API Costs Require)
- [ ] Keep all DBT/CBT tools free
- [ ] Premium tier for unlimited AI messages ($2.99 one-time)
- [ ] Store purchase status locally

---

## Technical Debt

- [ ] Migrate to TypeScript
- [ ] Increase test coverage to 90%+
- [ ] Refactor ToolsScreen (too large)
- [ ] Extract reusable components
- [ ] Optimize FlatList rendering in ProgressScreen
- [ ] Add performance monitoring
- [ ] Reduce app bundle size

---

## Ideas & Feedback

- Journaling feature
- Apple Health integration
- Partnership with VA/veteran organizations
- Siri shortcuts for quick technique access
- HIPAA compliance for therapist features

---

## Notes

- Priority levels shift based on user feedback and App Store reviews
- API costs will determine monetization timeline
- Apple/Google review feedback may require immediate changes
- Distribution certificate expires November 19, 2026 — renew before then

---

**Next Review:** After v1.2.14 is live on both stores and user feedback is collected
