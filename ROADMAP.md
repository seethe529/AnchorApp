# Anchor App Roadmap

This document tracks planned features, enhancements, and ideas for future versions of Anchor.

---

## Version 1.1.0 (Next Release)

### High Priority

#### 🛠️ Additional DBT/CBT Techniques

**DBT-oriented:**
- [ ] **Radical Acceptance** - Coping with unchangeable pain
  - Description: Accepting reality as it is, not as you wish it to be
  - Example: "I can't change what happened, but I can accept it and choose how to move forward"
  - Keywords: acceptance, pain, unchangeable, reality

- [ ] **Self-Validation** - Validating your own emotions
  - Description: Acknowledging your feelings are valid without judgment
  - Example: "It makes sense I feel this way given what I've been through. My feelings are valid."
  - Keywords: validation, emotions, feelings, self-compassion

- [ ] **Pros & Cons** - Weighing choices during distress
  - Description: List pros and cons of tolerating distress vs. acting on urges
  - Example: "Pros of staying calm: I won't regret my actions. Cons: It's uncomfortable right now."
  - Keywords: decision, choice, urges, weighing

**CBT-oriented:**
- [ ] **Cognitive Defusion** - Labeling thoughts as "just thoughts"
  - Description: Creating distance from thoughts by observing them objectively
  - Example: "I'm having the thought that I'm worthless" vs "I am worthless"
  - Keywords: thoughts, defusion, distance, observe

- [ ] **Graded Exposure Plan** - Structured fear ladder
  - Description: Create a hierarchy of feared situations from least to most anxiety-provoking
  - Example: "0-10 scale: 2=Look at photo, 5=Drive past location, 8=Enter building, 10=Stay for 1 hour"
  - Keywords: exposure, fear, hierarchy, gradual

- [ ] **Problem-Solving Worksheet** - Step-by-step solutions
  - Description: Define problem, brainstorm solutions, evaluate options, create action plan
  - Example: "Problem: Feeling isolated. Solutions: 1) Join support group 2) Text a friend 3) Volunteer"
  - Keywords: problem, solution, planning, action

**Trauma-specific:**
- [ ] **Safe Place Visualization** - Guided imagery for grounding
  - Description: Imagine a safe, peaceful place in detail using all 5 senses
  - Example: "Picture a beach: warm sand, sound of waves, smell of salt air, taste of coconut, feel of sun"
  - Keywords: visualization, safe, imagery, grounding

- [ ] **Body Scan** - Awareness of tension and release
  - Description: Systematically notice sensations in each body part from head to toe
  - Example: "Notice your forehead - any tension? Your jaw? Shoulders? Breathe into each area."
  - Keywords: body, tension, awareness, scan, physical

#### 💰 Monetization (If API Costs Become High)
- [ ] Implement in-app purchase for AI Support
- [ ] Keep all DBT/CBT tools free
- [ ] Premium tier: $2.99 one-time unlock for AI Support
- [ ] Add paywall screen for AI Support tab
- [ ] Store purchase status locally
- [ ] Set up product in App Store Connect

### Medium Priority
- [ ] Add onboarding tutorial for first-time users
- [ ] Dark mode support
- [ ] Data backup to iCloud
- [ ] Push notifications for daily reminders
- [ ] Customizable reminder times

### Low Priority
- [ ] Export progress reports as PDF
- [ ] Share anonymized progress with therapist
- [ ] Customizable app theme colors

---

## Version 1.2.0 (Future)

### Features Under Consideration
- [ ] Widget support (iOS 14+)
- [ ] Apple Watch companion app
- [ ] Siri shortcuts for quick technique access
- [ ] **Internationalization (i18n)** - See detailed plan below
- [ ] Community forum (moderated)
- [ ] Therapist portal for tracking client progress

### 🌍 Internationalization Plan (High Priority)

**Problem:** Language barriers prevent people in crisis from accessing mental health support.

**Solution Phases:**

#### Phase 1: AI-Powered (Free, Immediate)
- [ ] Update OpenAI system prompt to respond in user's language
- [ ] Add language detection to AI Support
- [ ] Test with Spanish, French, German, Arabic, Mandarin
- **Cost:** $0 (OpenAI already supports 50+ languages)
- **Impact:** AI Support becomes multilingual immediately

#### Phase 2: Community Translation (Free, Crowdsourced)
- [ ] Set up i18next framework
- [ ] Create translation contribution guide
- [ ] Open GitHub issues for each language
- [ ] Accept pull requests from bilingual volunteers
- [ ] Native speakers review and approve translations
- **Cost:** $0 (volunteer-driven)
- **Priority Languages:** Spanish, French, Arabic, Mandarin, German, Portuguese
- **Impact:** Core app UI translated by community

#### Phase 3: Professional Review (Paid, Quality Assurance)
- [ ] Partner with mental health organizations for translation review
- [ ] Reach out to veteran organizations (VA, international equivalents)
- [ ] Apply for grants to fund professional translation
- [ ] Seek pro-bono translation from mental health professionals
- **Cost:** Seek grants/donations
- **Impact:** Ensure clinical accuracy of mental health terminology

#### Phase 4: Localized Crisis Resources
- [ ] Research crisis hotlines by country
- [ ] Add country detection
- [ ] Display local emergency numbers (not just US)
- [ ] Partner with international crisis organizations
- **Examples:**
  - Spain: 024 (Suicide Prevention)
  - France: 3114 (Mental Health Crisis)
  - Germany: 0800-1110111 (Telefonseelsorge)
  - Australia: 13 11 14 (Lifeline)
- **Cost:** $0 (research and data entry)
- **Impact:** Life-saving for international users

**Technical Implementation:**
```javascript
// Install: npm install i18next react-i18next
// Auto-detect device language
// Fallback to English if translation missing
// ~5,000 words to translate
```

**Why This Matters:**
- 75% of the world doesn't speak English
- PTSD affects veterans and trauma survivors globally
- Mental health crisis doesn't care about language barriers
- Free app should be accessible to everyone

**Call for Help:**
- Seeking bilingual volunteers
- Mental health professionals who can review translations
- Partnerships with international veteran organizations
- Grant opportunities for accessibility funding

---

## Version 2.0.0 (Long-term Vision)

### Major Features
- [ ] AI-powered personalized technique recommendations
- [ ] Integration with wearable devices (heart rate monitoring)
- [ ] Peer support matching (optional, privacy-focused)
- [ ] Professional therapist directory
- [ ] Group therapy session scheduling
- [ ] Advanced analytics and insights

---

## Ideas & Suggestions

### From Users
- (Add user feedback here as it comes in)

### From Team
- Consider adding journaling feature
- Explore integration with Apple Health
- Research partnership with VA/veteran organizations
- Investigate HIPAA compliance for therapist features

---

## Completed Features

### Version 1.0.0 (Released January 9, 2025)
- ✅ 17 DBT/CBT techniques across 6 categories
- ✅ AI Support with OpenAI integration
- ✅ Mood tracking and progress analytics
- ✅ Safety plan with secure storage
- ✅ Crisis resources
- ✅ Offline functionality
- ✅ Data export feature
- ✅ Accessibility support (VoiceOver)
- ✅ Error handling and logging
- ✅ App rating prompt

---

## Notes

- **Priority levels** can change based on user feedback
- **Version numbers** are tentative and may shift
- **User feedback** will heavily influence roadmap priorities
- **API costs** will determine monetization timeline
- **Apple review feedback** may require immediate changes

---

## How to Contribute Ideas

1. Open an issue on GitHub with the `enhancement` label
2. Describe the feature and why it would help users
3. Include any relevant research or examples
4. Tag with priority level (high/medium/low)

---

**Last Updated:** January 9, 2025  
**Next Review:** After v1.0.0 approval and first month of user feedback
