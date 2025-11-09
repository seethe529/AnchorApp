# App Store Submission Guide - Anchor v1.0.0

## 🎯 Complete Step-by-Step Guide for First-Time Submission

This guide will walk you through submitting Anchor to the Apple App Store for the first time.

---

## Prerequisites Checklist ✅

Before you start, make sure you have:

- [x] Apple Developer Account ($99/year) - [Sign up here](https://developer.apple.com/programs/)
- [x] App built and tested on your iPhone
- [x] App icon (1024x1024 PNG) - Located at `assets/icon.png`
- [x] Screenshots (6-10 images) - Located in `screenshots/` folder
- [x] Privacy Policy URL - https://seethe529.github.io/AnchorApp/
- [x] App description written
- [x] Keywords chosen
- [x] Support URL (can use GitHub repo)

---

## Part 1: Apple Developer Account Setup (15 minutes)

### Step 1: Enroll in Apple Developer Program

1. Go to https://developer.apple.com/programs/
2. Click "Enroll"
3. Sign in with your Apple ID
4. Complete enrollment ($99/year fee)
5. Wait for approval (usually 24-48 hours)

**Note:** You need this before you can submit apps!

---

## Part 2: Create App in App Store Connect (20 minutes)

### Step 2: Access App Store Connect

1. Go to https://appstoreconnect.apple.com
2. Sign in with your Apple Developer account
3. Click "My Apps"
4. Click the "+" button
5. Select "New App"

### Step 3: Fill Out App Information

**Platform:** iOS

**Name:** Anchor - PTSD Support
- This is what users see in the App Store
- Must be unique (check if available)

**Primary Language:** English (U.S.)

**Bundle ID:** 
- Click "Register a new bundle ID"
- Enter: `com.anchor.ptsd-support`
- Description: "Anchor PTSD Support App"
- Click "Continue"

**SKU:** `anchor-ptsd-support-001`
- This is for your internal tracking only
- Users never see this

**User Access:** Full Access

Click "Create"

---

## Part 3: App Information (30 minutes)

### Step 4: Fill Out App Store Information

Navigate to your app → "App Information" section:

#### Privacy Policy URL
```
https://seethe529.github.io/AnchorApp/
```

#### Category
- **Primary Category:** Health & Fitness
- **Secondary Category:** Medical

#### Age Rating
Click "Edit" next to Age Rating:
- Medical/Treatment Information: **Yes** (provides mental health support)
- Unrestricted Web Access: **No**
- All other questions: **No**

Result should be: **12+** (appropriate for mental health content)

#### Copyright
```
2024 Ryan L
```

---

## Part 4: Pricing and Availability (5 minutes)

### Step 5: Set Pricing

Navigate to "Pricing and Availability":

**Price:** Free (Tier 0)

**Availability:** All countries/regions
- Or select specific countries if you prefer

**Pre-Order:** No (not needed for first release)

Click "Save"

---

## Part 5: Prepare for Submission (45 minutes)

### Step 6: Version Information

Navigate to "1.0 Prepare for Submission":

#### App Previews and Screenshots

**6.9" Display (iPhone 17 Pro Max):**

Upload these 6 screenshots in order:
1. `screenshots/01-home.jpeg` - Home screen
2. `screenshots/07-crisis.jpeg` - Crisis resources
3. `screenshots/03-tools.jpeg` - DBT/CBT tools
4. `screenshots/11-tools-tipp.jpeg` - Technique detail
5. `screenshots/06-ai-support-chat.jpeg` - AI support
6. `screenshots/10-progress.jpeg` - Progress tracking

**Optional Captions:**
1. "Quick access to grounding techniques and crisis support"
2. "Immediate help when you need it most - 24/7 crisis resources"
3. "50+ evidence-based DBT & CBT techniques for PTSD"
4. "Step-by-step guidance for each coping technique"
5. "AI-powered support for difficult moments"
6. "Track your mood and see your progress over time"

#### Promotional Text (Optional, 170 characters max)
```
Evidence-based support for PTSD and trauma. Access 50+ DBT/CBT techniques, AI crisis support, and 24/7 resources. Your companion for healing.
```

#### Description (4000 characters max)

```
Anchor is a comprehensive mental health support app designed specifically for veterans and individuals living with PTSD and trauma-related conditions. Built with evidence-based DBT and CBT techniques, Anchor provides immediate access to coping strategies, crisis resources, and AI-powered support whenever you need it.

KEY FEATURES:

🛠️ 50+ DBT/CBT Techniques
• Grounding exercises (5-4-3-2-1, Body Scan)
• Breathing techniques (Box Breathing, 4-7-8)
• Distress tolerance skills (TIPP, ACCEPTS)
• Emotion regulation strategies (PLEASE, Opposite Action)
• Interpersonal effectiveness (DEAR MAN, GIVE)
• Mindfulness practices
• Cognitive restructuring tools

🤖 AI Crisis Support
• Real-time technique suggestions
• Contextual guidance during difficult moments
• Quick help buttons for immediate support
• Conversational AI trained on mental health best practices

🚨 24/7 Crisis Resources
• National Suicide Prevention Lifeline (988)
• Veterans Crisis Line
• Crisis Text Line
• Local emergency resources
• Personal safety planning tools

📊 Progress Tracking
• Daily mood logging
• Technique effectiveness ratings
• Visual progress charts
• Data export for healthcare providers

🔒 Privacy & Security
• All data stored locally on your device
• No cloud storage without your consent
• No tracking or analytics
• HIPAA-aware design
• Secure storage for sensitive information

💚 100% Offline Capable
• All features work without internet
• Access techniques anytime, anywhere
• Crisis resources available offline

DESIGNED FOR:
• Veterans with PTSD
• Trauma survivors
• Individuals in therapy seeking supplemental tools
• Anyone learning DBT/CBT skills
• People managing anxiety and stress

IMPORTANT DISCLAIMER:
Anchor is a self-help tool and educational resource. It is NOT a substitute for professional medical advice, diagnosis, or treatment. If you're experiencing a mental health crisis, please contact emergency services or a crisis hotline immediately.

WHY ANCHOR?
Created with input from mental health professionals and trauma survivors, Anchor combines evidence-based techniques with modern technology to provide support when you need it most. Whether you're in therapy or managing symptoms on your own, Anchor is your companion for healing and growth.

SUPPORT:
For questions, feedback, or support, visit our GitHub repository or contact us through the app.

Your journey to healing matters. Download Anchor today.
```

#### Keywords (100 characters max, comma-separated)
```
PTSD,trauma,DBT,CBT,anxiety,veteran,therapy,mental health,crisis,grounding,mindfulness,coping
```

#### Support URL
```
https://github.com/seethe529/AnchorApp
```

#### Marketing URL (Optional)
```
https://seethe529.github.io/AnchorApp/
```

---

## Part 6: Build Information (10 minutes)

### Step 7: General App Information

Scroll down to "General App Information":

#### App Icon
- Upload: `assets/icon.png` (1024x1024 PNG)
- Must not have transparency or rounded corners
- Apple will apply the rounded corners automatically

#### Version
```
1.0.0
```

#### Copyright
```
2024 Ryan L
```

#### Trade Representative Contact Information
- Your contact info (required for Korean App Store)
- Use your email and phone number

#### Sign-In Information
- **Sign-in required:** No
- (Your app doesn't require login)

#### Contact Information
- **First Name:** Ryan
- **Last Name:** L
- **Phone Number:** Your phone
- **Email:** Your email

#### Notes (Optional)
```
This is the first release of Anchor. The app provides mental health support tools and crisis resources for individuals with PTSD. All features work offline. No user accounts or login required.
```

#### Attachment (Optional)
- You can upload a demo video if you want

---

## Part 7: App Review Information (10 minutes)

### Step 8: Fill Out Review Information

This helps Apple reviewers test your app:

#### Contact Information
- **First Name:** Ryan
- **Last Name:** L
- **Phone Number:** Your phone
- **Email:** Your email

#### Demo Account (if needed)
- **Username:** N/A
- **Password:** N/A
- **Sign-in required:** No

#### Notes
```
TESTING INSTRUCTIONS FOR REVIEWERS:

1. On first launch, you'll see a medical disclaimer - tap "I understand and agree" then "Continue to App"

2. Main features to test:
   - Home screen: Tap any Quick Action button
   - Tools tab: Browse 50+ DBT/CBT techniques, tap one to view details
   - AI Support tab: Use Quick Help buttons or type a message
   - Crisis tab: View crisis resources (please don't actually call the numbers)
   - Progress tab: View mood tracking (will be empty on first launch)
   - Settings tab: View app settings and data export

3. The app works 100% offline - no internet required
4. No user account or login needed
5. All data stored locally on device

Thank you for reviewing Anchor!
```

---

## Part 8: Version Release (5 minutes)

### Step 9: Version Release Options

Choose how you want to release:

**Recommended for first release:**
- ⭐ **Manually release this version**
  - You control when it goes live after approval
  - Gives you time to prepare marketing, etc.

**Other options:**
- Automatically release after approval
- Schedule for specific date

---

## Part 9: Content Rights (5 minutes)

### Step 10: Content Rights Declaration

Scroll to bottom:

**Does your app contain, display, or access third-party content?**
- Select: **No**
- (Your app uses your own content and public crisis hotline info)

**Advertising Identifier (IDFA)**
- Select: **No**
- (You don't use ads or tracking)

---

## Part 10: Build Upload (30-60 minutes)

### Step 11: Build Your App with EAS

Now you need to create a production build and upload it to App Store Connect.

**Option A: Using EAS Build (Recommended - Easiest)**

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Login to Expo:
```bash
eas login
```

3. Configure EAS:
```bash
eas build:configure
```

4. Build for iOS:
```bash
eas build --platform ios
```

5. Wait for build to complete (20-30 minutes)
6. EAS will automatically upload to App Store Connect!

**Option B: Using Xcode (Advanced)**

1. Install Xcode from Mac App Store
2. Run: `npx expo prebuild`
3. Open `ios/AnchorPTSDSupport.xcworkspace` in Xcode
4. Select "Any iOS Device" as target
5. Product → Archive
6. Upload to App Store Connect

---

## Part 11: Select Build (5 minutes)

### Step 12: Add Build to Submission

1. Go back to App Store Connect
2. Navigate to your app → "1.0 Prepare for Submission"
3. Scroll to "Build" section
4. Click the "+" button
5. Select your uploaded build (version 1.0.0)
6. Click "Done"

**Note:** It may take 10-15 minutes for your build to appear after upload.

---

## Part 12: Export Compliance (2 minutes)

### Step 13: Export Compliance

After selecting your build, you'll see "Export Compliance Information":

**Does your app use encryption?**
- Select: **No**
- (Standard HTTPS doesn't count as encryption requiring declaration)

---

## Part 13: Submit for Review! (1 minute)

### Step 14: Final Submission

1. Review all information one last time
2. Click "Add for Review" (top right)
3. Click "Submit for Review"

🎉 **Congratulations! Your app is submitted!**

---

## What Happens Next?

### Review Timeline

**Typical timeline:**
- **Waiting for Review:** 1-3 days
- **In Review:** 1-24 hours
- **Total:** Usually 1-4 days

**You'll receive emails for:**
- "Waiting for Review" status
- "In Review" status
- "Ready for Sale" (approved!) or "Rejected" (needs fixes)

### If Approved ✅

1. You'll get "Ready for Sale" email
2. If you chose "Manually release":
   - Go to App Store Connect
   - Click "Release this version"
3. App goes live within 24 hours!

### If Rejected ❌

Don't worry! Common reasons:
- Missing information
- Guideline violations
- Crashes during testing

**What to do:**
1. Read rejection reason carefully
2. Fix the issues
3. Resubmit (no extra fee)

---

## Post-Submission Checklist

While waiting for review:

- [ ] Prepare social media posts
- [ ] Set up support email/system
- [ ] Plan launch announcement
- [ ] Create press kit (optional)
- [ ] Prepare for user feedback
- [ ] Monitor App Store Connect for updates

---

## Common Issues & Solutions

### Issue: Build not appearing
**Solution:** Wait 15 minutes, refresh page. Build processing takes time.

### Issue: Missing compliance info
**Solution:** Fill out export compliance section after selecting build.

### Issue: Screenshots wrong size
**Solution:** Use screenshots from iPhone 17 Pro Max (6.9" display).

### Issue: App icon has transparency
**Solution:** Export icon as PNG without alpha channel.

### Issue: Bundle ID doesn't match
**Solution:** Make sure `app.json` bundle ID matches App Store Connect.

---

## Important URLs

- **App Store Connect:** https://appstoreconnect.apple.com
- **Developer Portal:** https://developer.apple.com
- **App Store Guidelines:** https://developer.apple.com/app-store/review/guidelines/
- **EAS Build Docs:** https://docs.expo.dev/build/introduction/

---

## Need Help?

- **Expo Forums:** https://forums.expo.dev
- **Apple Developer Support:** https://developer.apple.com/support/
- **App Store Connect Help:** https://help.apple.com/app-store-connect/

---

## Estimated Total Time

- **First-time setup:** 2-3 hours
- **Build upload:** 30-60 minutes
- **Review wait:** 1-4 days
- **Total to launch:** ~1 week

---

## 🎉 You're Ready!

Follow this guide step-by-step and you'll have your app submitted in no time. Take breaks, don't rush, and double-check everything.

**Good luck with your submission! You've built something amazing that will help people.** 💚

---

**Questions?** Feel free to ask for help at any step!
