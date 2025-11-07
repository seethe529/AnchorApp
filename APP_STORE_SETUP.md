# App Store Submission Guide for Anchor

## Prerequisites Completed ✅
- [x] Privacy Policy created
- [x] Terms of Service created
- [x] Medical disclaimer screen implemented
- [x] Environment variables configured
- [x] EAS build configuration created

## Next Steps

### 1. Apple Developer Account
- Sign up at https://developer.apple.com ($99/year)
- Complete your developer profile
- Accept agreements

### 2. App Store Connect Setup
1. Go to https://appstoreconnect.apple.com
2. Click "My Apps" → "+" → "New App"
3. Fill in:
   - Platform: iOS
   - Name: Anchor - PTSD Support
   - Primary Language: English
   - Bundle ID: com.anchor.ptsd-support
   - SKU: anchor-ptsd-support-001

### 3. App Information
**Category:** Health & Fitness → Mental Health
**Age Rating:** 17+ (Medical/Treatment Information)

**Description:**
```
Anchor provides evidence-based DBT/CBT techniques and support for individuals with PTSD and trauma-related conditions. Features include:

• Comprehensive DBT/CBT technique library with examples
• Mood tracking and progress analytics
• Personal safety planning tools
• Crisis resources and hotlines
• AI-powered support (optional)
• Breathing exercises and grounding techniques

IMPORTANT: This app is not a substitute for professional medical care. Always consult qualified healthcare providers for medical concerns.

Crisis Resources:
• National Suicide Prevention Lifeline: 988
• Crisis Text Line: Text HOME to 741741
• Veterans Crisis Line: 1-800-273-8255
```

**Keywords:**
PTSD, trauma, DBT, CBT, mental health, anxiety, therapy, coping, veterans, support

**Support URL:** [Your website or GitHub]
**Privacy Policy URL:** [Host PRIVACY_POLICY.md online]

### 4. Prepare Screenshots
Required sizes for iPhone:
- 6.7" (iPhone 15 Pro Max): 1290 x 2796
- 6.5" (iPhone 14 Plus): 1284 x 2778
- 5.5" (iPhone 8 Plus): 1242 x 2208

Take screenshots of:
1. Home screen with mood tracker
2. Tools screen showing techniques
3. AI Support conversation
4. Crisis resources screen
5. Progress analytics

### 5. Create App Icon
Required: 1024x1024 PNG (no transparency, no rounded corners)

Current icon location: `./assets/icon.png`
- Ensure it's exactly 1024x1024
- No alpha channel
- RGB color space

### 6. Build the App

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure

# Create production build
eas build --platform ios --profile production

# When prompted, set your OpenAI API key:
# OPENAI_API_KEY=your-actual-key-here
```

### 7. TestFlight (Optional but Recommended)
```bash
# Submit to TestFlight for internal testing
eas submit --platform ios --latest
```

### 8. App Review Information

**Contact Information:**
- First Name: [Your Name]
- Last Name: [Your Name]
- Phone: [Your Phone]
- Email: [Your Email]

**Demo Account:** Not required (no login needed)

**Notes for Reviewer:**
```
This is a mental health support app providing DBT/CBT techniques for PTSD.

IMPORTANT NOTES:
1. Medical disclaimer is shown on first launch (must be accepted)
2. Crisis resources are prominently displayed
3. AI Support feature is optional and clearly labeled as not replacing therapy
4. All data is stored locally on device
5. No user accounts or authentication required

To test AI Support:
- OpenAI API may require billing credits
- Fallback responses work without API key
- All other features work offline

The app is designed to help users manage PTSD symptoms between therapy sessions, not replace professional care.
```

### 9. Privacy Questionnaire

**Data Collection:**
- Does your app collect data? NO (all data stored locally)
- Third-party analytics? NO
- Third-party advertising? NO

**Health Data:**
- Does your app use HealthKit? NO
- Does it collect health data? YES (mood logs, stored locally only)

**OpenAI API:**
- User messages sent to OpenAI for AI Support feature
- Users can opt out by not using AI Support
- Link to OpenAI privacy policy: https://openai.com/privacy

### 10. Age Rating Questionnaire

Select YES for:
- Medical/Treatment Information (frequent/intense)
- Realistic Violence (infrequent/mild) - PTSD content
- Horror/Fear Themes (infrequent/mild) - trauma discussion

Result: 17+

### 11. Export Compliance

**Does your app use encryption?** YES
- Standard encryption for local data storage
- HTTPS for API calls
- Select "No" for custom encryption

### 12. Submit for Review

1. Upload build from EAS
2. Fill in all metadata
3. Upload screenshots
4. Add privacy policy URL
5. Complete questionnaires
6. Submit for review

**Review Time:** Typically 24-48 hours

### 13. After Approval

- Monitor crash reports in App Store Connect
- Respond to user reviews
- Plan updates based on feedback
- Monitor OpenAI API costs

## Common Rejection Reasons

1. **Incomplete medical disclaimer** - ✅ Already implemented
2. **Missing privacy policy** - ✅ Already created
3. **Unclear crisis resources** - ✅ Prominently displayed
4. **Health claims** - Avoid saying app "treats" or "cures"
5. **Missing screenshots** - Need to create these

## Cost Estimates

- Apple Developer Account: $99/year
- OpenAI API: ~$1-5 per active user/month (optional)
- Hosting for privacy policy: Free (GitHub Pages) or $5/month

## Support Resources

- Expo EAS Docs: https://docs.expo.dev/build/introduction/
- App Store Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- Health App Guidelines: https://developer.apple.com/app-store/review/guidelines/#health-and-health-research

## Need Help?

Common issues:
- Build fails: Check `eas build --platform ios --profile production --clear-cache`
- Icon rejected: Ensure 1024x1024, no transparency, RGB
- Privacy policy: Host PRIVACY_POLICY.md on GitHub Pages
- API key: Set in `eas secret:create` or in eas.json

Good luck! 🚀
