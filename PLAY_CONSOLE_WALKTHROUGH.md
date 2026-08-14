# Google Play Console Data Safety - Visual Walkthrough

**App:** Anchor - PTSD Support  
**Time Required:** 15-30 minutes  
**Difficulty:** Easy (just follow the steps)

---

## 🎯 What You're Going to Do

Update the Data Safety section in Google Play Console to disclose that your app uses OpenAI for the AI Support feature. This is required for July 2026 policy compliance.

---

## 📱 STEP-BY-STEP WALKTHROUGH

### Step 1: Log Into Play Console

1. Go to https://play.google.com/console
2. Sign in with your Google account (lingoryan084@gmail.com)
3. You should see your developer dashboard

**What You'll See:**
- List of your apps
- "Anchor" app should be visible

---

### Step 2: Select Your App

1. Click on **"Anchor"** (or "Anchor - PTSD Support")
2. You'll enter the app dashboard

**What You'll See:**
- Left sidebar with menu options
- App dashboard in center
- Current app status (published/draft)

---

### Step 3: Navigate to App Content

1. Look at the **left sidebar**
2. Scroll down to find **"App content"** (under "Policy" section)
3. Click **"App content"**

**What You'll See:**
- Page with multiple sections:
  - Privacy policy
  - Ads
  - Content ratings
  - Target audience
  - News apps
  - COVID-19 contact tracing
  - **Data safety** ← This is what you want

---

### Step 4: Open Data Safety Section

1. Find the **"Data safety"** section (middle of page)
2. Click **"Manage"** (if you've filled it before) or **"Start"** (if new)

**What You'll See:**
- Form with questions about data collection

---

### Step 5: Answer "Do You Collect Data?"

**Question:** "Does your app collect or share any of the required user data types?"

**Your Answer:** ✅ **YES**

**Explanation to provide:**
```
Anchor shares user-typed messages with OpenAI when users choose to use the AI Support feature. All other app data (mood logs, safety plans, etc.) stays on the device and is never shared.
```

Click **"Next"**

---

### Step 6: Select Data Types

You'll see a long list of data categories. Here's what to select:

#### ✅ SELECT THESE:

**Messages** (under "Personal info" category)
- Check the box next to "Messages"
- This represents the text users type in AI Support

#### ❌ DO NOT SELECT:
- Location (you use it temporarily but don't collect/store it)
- Health & Fitness (stays local, not shared)
- Name, Email, Phone (not collected)
- Financial info (not collected)
- Photos, Videos, Audio (not collected)

**After selecting "Messages":**
Click **"Next"**

---

### Step 7: Provide Details About Messages

For the "Messages" data type you selected, answer these questions:

#### Question 1: "Is this data collected, shared, or both?"
**Answer:** ✅ **"Shared"**
(You share it with OpenAI, but don't store it yourself)

#### Question 2: "Is this data processed ephemerally?"
**Answer:** ✅ **"Yes"**
(Messages are not stored permanently by your app)

#### Question 3: "Is data collection required or optional?"
**Answer:** ✅ **"Optional, users can choose whether to provide data"**

#### Question 4: "Why is this user data collected?"
**Answer:** ✅ **"App functionality"**
(To provide AI-powered mental health support responses)

Click **"Next"**

---

### Step 8: Specify Third-Party Recipients

**Question:** "Who has access to this data?"

**Answer:** Add **"OpenAI"** as a third-party service

**Details to provide:**
```
Service name: OpenAI
Service type: AI/ML API Provider
Purpose: Generate mental health support responses
Privacy policy: https://openai.com/privacy
Data retention: Processed according to OpenAI's privacy policy; not stored by Anchor
```

Click **"Next"**

---

### Step 9: Data Security Practices

#### Question 1: "Is all user data encrypted in transit?"
**Answer:** ✅ **"Yes"**

**Explanation:**
```
All data transmission uses HTTPS/TLS encryption between:
- App → Vercel backend
- Vercel backend → OpenAI API
```

#### Question 2: "Do you provide a way for users to request data deletion?"
**Answer:** ✅ **"Yes"**

**Explanation:**
```
Users can delete all locally stored app data from Settings → Export/Delete Data.
For messages processed by OpenAI, users should refer to OpenAI's data deletion policy at https://openai.com/privacy
```

Click **"Next"**

---

### Step 10: Add Data Safety Declaration (Important!)

This is where you add the detailed explanation users will see.

**Copy and paste this text:**

```
DATA COLLECTION & PRIVACY

Anchor is designed with privacy as a priority. Most data stays on your device.

LOCAL DATA (NOT SHARED):
• Mood logs and history
• Breathing exercise records
• Grounding technique usage
• Safety plans and crisis contacts
• Personal notes and journal entries
• App settings and preferences

OPTIONAL AI SUPPORT FEATURE:
If you choose to use the AI Support feature, your typed messages are shared with OpenAI (a third-party AI service) to generate helpful responses.

What's shared: Only the text you type in AI Support conversations
What's NOT shared: Mood logs, safety plans, personal notes, or any other app data
How it works: Messages are sent securely through our backend server to OpenAI's API
Retention: Messages are not stored by Anchor; OpenAI processes them according to their privacy policy (https://openai.com/privacy)
Your control: You can choose not to use AI Support - all other app features work completely offline

SECURITY:
• All data transmission uses HTTPS/TLS encryption
• Sensitive data (safety plans) stored using device secure storage
• No tracking, analytics, or advertising
• No account required - no email, name, or personal identifiers collected

DELETE YOUR DATA:
You can delete all app data at any time from Settings → Export/Delete Data.

Questions? Contact us at lingoryan084@gmail.com or review our full privacy policy at https://seethe529.github.io/AnchorApp/
```

Click **"Next"**

---

### Step 11: Review & Submit

1. Review all your answers
2. Make sure everything looks correct:
   - Messages: Shared with OpenAI ✓
   - Optional feature ✓
   - Encrypted in transit ✓
   - User can delete data ✓
   - Declaration text present ✓

3. Click **"Submit"** at the bottom

**What happens next:**
- Google reviews your submission (1-3 business days)
- You'll get an email when it's approved or if changes are needed
- Once approved, the Data Safety section goes live on your Play Store listing

---

## ✅ VERIFICATION STEP

After submitting, verify everything saved correctly:

1. Go back to **App content** page
2. Look at **Data safety** section
3. Status should show: "Review in progress" or "Completed"
4. You should see: "Shared: Messages"

---

## 🎯 BONUS: Check App Registration

While you're in Play Console:

1. Go to **Home** (click home icon in left sidebar)
2. Look for a banner saying **"Register your app"**
   - **If you see it:** Click the banner and complete registration
   - **If you don't see it:** You're already registered ✅

---

## 📧 WHAT TO EXPECT

### Within 24-48 hours:
- Email from Google Play: "Data safety review update"
- Status in console changes to "Approved" or "Changes requested"

### If Approved:
✅ You're done! Data Safety is now live on your app listing

### If Changes Requested:
⚠️ Google will tell you specifically what to fix
- Most common: Add more detail about user control
- Fix and resubmit within 7 days

---

## 🆘 TROUBLESHOOTING

### "I can't find the Data safety section"
- Make sure you selected the correct app (Anchor)
- Look under "App content" in left sidebar
- Scroll down - it's usually in the middle of the page

### "The form is confusing"
- Just answer questions honestly
- When in doubt, refer to Section 7 of `GOOGLE_PLAY_DATA_SAFETY_GUIDE.md`
- Key point: You share messages (optional) with OpenAI, nothing else

### "What if I make a mistake?"
- You can edit and resubmit anytime
- Changes don't affect your live app until approved
- No penalty for resubmission

### "Do I need to update my app?"
- **NO!** You're only updating the Play Store listing
- No new app version needed
- No code changes required

---

## 🔔 IMPORTANT REMINDERS

1. **Deadline:** August 14, 2026 (2 days from now)
2. **Don't overthink it:** Answer truthfully, Google wants transparency
3. **User control is key:** Emphasize the feature is optional
4. **Privacy policy must match:** Make sure your online privacy policy says the same thing

---

## ✅ COMPLETION CHECKLIST

Once you're done, mark these off:

- [ ] Logged into Play Console
- [ ] Found Anchor app
- [ ] Opened App content → Data safety
- [ ] Answered "Yes" to collecting data
- [ ] Selected "Messages" as data type
- [ ] Marked as "Shared" with OpenAI
- [ ] Indicated it's "Optional"
- [ ] Added OpenAI as third-party service
- [ ] Confirmed encryption (HTTPS/TLS)
- [ ] Confirmed data deletion capability
- [ ] Pasted declaration text
- [ ] Reviewed all answers
- [ ] Clicked "Submit"
- [ ] Received confirmation email (wait 24-48 hrs)
- [ ] Verified app registration status
- [ ] Checked for warnings in console

---

## 🎉 AFTER SUBMISSION

**Immediate:**
- Take a screenshot of the submission confirmation
- Note the submission date/time
- Check your email for confirmation

**Within 48 hours:**
- Check email for Google's review result
- If approved: Mark compliance checklist complete ✅
- If changes needed: Address feedback and resubmit

**Before August 14:**
- Ensure Data Safety shows "Completed" status
- No warnings in Play Console
- Compliance complete! 🎉

---

## 📞 NEED HELP?

**Google Play Support:**
- https://support.google.com/googleplay/android-developer/answer/10787469

**Your Documentation:**
- Detailed guide: `GOOGLE_PLAY_DATA_SAFETY_GUIDE.md`
- Checklist: `GOOGLE_PLAY_COMPLIANCE_CHECKLIST.md`
- Privacy policy: https://seethe529.github.io/AnchorApp/

**Common Questions:**
- See Section 9 in `GOOGLE_PLAY_DATA_SAFETY_GUIDE.md`

---

**Last Updated:** August 12, 2026  
**Estimated Time:** 15-30 minutes  
**Difficulty:** ⭐⭐☆☆☆ (Easy)
