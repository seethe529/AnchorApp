# Google Play Data Safety Section - Complete Guide

**Last Updated:** August 2026  
**App:** Anchor - PTSD Support  
**Package:** com.anchor.ptsdsupport

---

## Overview

This guide walks you through updating your Data Safety section in Google Play Console to comply with the July 2026 policy updates regarding third-party AI integrations.

---

## Step-by-Step Process

### 1. Access Data Safety Section

1. Go to [Google Play Console](https://play.google.com/console)
2. Select **Anchor - PTSD Support** app
3. In left sidebar, click **App content**
4. Scroll down and click **Data safety**
5. Click **Start** or **Manage** (if you've filled it before)

---

### 2. Data Collection Overview

**Question:** "Does your app collect or share any of the required user data types?"

**Answer:** ✅ **YES**

**Explanation:** Your app collects user messages when they use the AI Support feature, which are sent to OpenAI for processing.

---

### 3. Data Types Collected

You'll need to indicate which data types are collected. For Anchor, select:

#### ✅ **Messages (required)**
- **Category:** Personal info → Messages
- **Is this data collected, shared, or both?** → Select **"Shared"**
- **Is this data processed ephemerally?** → Select **"Yes"** (messages are not stored permanently)
- **Is data collection required or optional?** → Select **"Optional, users can choose whether to provide data"**
- **Why is this user data shared?** → Select **"App functionality"**

#### Details to provide:
```
Data type: Messages
Collection method: User input (text messages typed in AI Support screen)
Shared with: OpenAI (third-party AI service provider)
Purpose: To generate AI-powered mental health support responses
Retention: Not stored by Anchor; processed by OpenAI according to their privacy policy
User control: Users can choose not to use AI Support feature; all other app features work offline
```

---

### 4. Third-Party Service Disclosure (Critical Section)

**Question:** "Do you use any third-party services that may access user data?"

**Answer:** ✅ **YES** - OpenAI API

**Required Information:**

```
Service Name: OpenAI API
Purpose: AI-powered mental health support responses
Data Shared: User-typed messages only (not mood logs, safety plans, or other app data)
Service Privacy Policy: https://openai.com/privacy
Processing Method: Messages sent via secure Vercel backend proxy
Data Storage: OpenAI may temporarily process data; Anchor does not store messages
User Consent: Users actively type messages; can opt-out by not using AI feature
```

---

### 5. Data Security Practices

**Question:** "Is all user data encrypted in transit?"

**Answer:** ✅ **YES**

**Details:**
- HTTPS/TLS encryption for all API calls
- Secure communication between app → Vercel backend → OpenAI API

---

**Question:** "Does your app allow users to request data deletion?"

**Answer:** ✅ **YES**

**Details:**
```
Users can delete all locally stored data from Settings → Export/Delete Data.
For AI messages sent to OpenAI, users should refer to OpenAI's data deletion policy.
```

---

### 6. Complete Data Safety Declaration Text

Copy and paste this into the "Data Safety" details section:

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

Questions? Contact us at [your support email] or review our full privacy policy at https://seethe529.github.io/AnchorApp/
```

---

### 7. Data Types Checklist

Mark **YES** for these categories:

#### Collected & Stored Locally (Not Shared):
- ❌ **Location** (only used temporarily for crisis center search, not stored)
- ❌ **Personal info** (no name, email, phone number collected)
- ❌ **Financial info** (no payment/purchase data)
- ❌ **Health & fitness** (mood data stays local, not shared)

#### Shared with Third Parties:
- ✅ **Messages** - shared with OpenAI for AI Support feature only

---

### 8. App Content Questionnaire Updates

While in App Content section, verify these are correct:

#### Privacy Policy
- ✅ URL: https://seethe529.github.io/AnchorApp/
- ✅ Last updated: August 2026 (update this!)

#### Ads
- ✅ Select **"No, my app does not contain ads"**

#### Target Audience
- ✅ Target age: 18+ (PTSD support app for adults)

#### Content Rating
- ✅ Verify current rating reflects app content accurately

---

### 9. Save & Submit

1. Review all your answers
2. Click **Save** at bottom of Data Safety form
3. Click **Submit** when ready
4. Monitor for any Google Play warnings or requests for clarification

---

## Common Mistakes to Avoid

❌ **Don't say:** "We don't collect any data"  
✅ **Do say:** "We share messages with OpenAI only when users use AI Support feature"

❌ **Don't forget:** To mention it's optional and users can opt-out  
✅ **Do include:** Clear explanation of user control

❌ **Don't hide:** Third-party integrations  
✅ **Do disclose:** OpenAI usage explicitly with link to their privacy policy

---

## Policy Compliance Checklist

Before submitting, verify:

- [ ] ✅ OpenAI integration explicitly disclosed
- [ ] ✅ Purpose clearly stated ("AI support responses")
- [ ] ✅ User control explained (optional feature)
- [ ] ✅ OpenAI privacy policy linked
- [ ] ✅ Data retention explained (not stored by Anchor)
- [ ] ✅ Local data vs shared data clearly distinguished
- [ ] ✅ Encryption confirmed (HTTPS/TLS)
- [ ] ✅ Data deletion process described
- [ ] ✅ No misleading statements
- [ ] ✅ Vercel backend proxy mentioned for transparency

---

## Timeline

- **Policy Announcement:** July 15, 2026
- **Compliance Deadline:** August 14, 2026 (30 days)
- **Your Status:** Need to update Data Safety section
- **Time Required:** 15-30 minutes to complete form

---

## What Happens After Submission?

1. **Automatic Review:** Google reviews within 1-3 business days
2. **Possible Outcomes:**
   - ✅ **Approved:** Data Safety section goes live immediately
   - ⚠️ **Needs Changes:** Google requests clarifications (respond within 7 days)
   - ❌ **Rejected:** Rare, usually means missing required info

3. **If Approved:** Your app stays compliant with July 2026 policies
4. **If Changes Needed:** Google will email specific feedback - address and resubmit

---

## Support Resources

- **Google Play Policy Center:** https://support.google.com/googleplay/android-developer/answer/10787469
- **Data Safety Help:** https://support.google.com/googleplay/android-developer/answer/10787469
- **Policy Webinars:** Register at https://play.google.com/console/developers (see announcements)
- **Developer Community:** https://support.google.com/googleplay/android-developer/community

---

## Questions Google Might Ask

**Q: "How do you ensure OpenAI complies with user privacy?"**  
**A:** "We've reviewed OpenAI's privacy policy and enterprise data processing terms. User messages are processed according to OpenAI's policies. Users are informed via our privacy policy and in-app disclosures that their messages are sent to OpenAI."

**Q: "Can users delete their data from OpenAI's servers?"**  
**A:** "Users should refer to OpenAI's data deletion process outlined in their privacy policy at https://openai.com/privacy. Anchor does not store the messages, so local deletion is immediate."

**Q: "Do you obtain explicit consent before sharing data with OpenAI?"**  
**A:** "Yes. Users must actively choose to use the AI Support feature by typing messages. All other app features work offline without any data sharing. Users are informed about OpenAI integration in our privacy policy and onboarding tour."

---

## Next Steps After Updating Data Safety

1. **Update Privacy Policy:** Add rate limiting (10 messages/day) and Vercel proxy details
2. **Update App Listing:** Ensure app description mentions AI Support is optional
3. **Monitor Compliance:** Check Play Console for any new policy requirements
4. **Document Changes:** Keep this guide updated with any Google feedback

---

## Contact Information

If Google requests verification:
- **Developer Email:** lingoryan084@gmail.com
- **Support URL:** https://seethe529.github.io/AnchorApp/
- **Privacy Policy:** https://seethe529.github.io/AnchorApp/
- **Backend Provider:** Vercel (https://vercel.com)
- **AI Provider:** OpenAI (https://openai.com)

---

**Last Reviewed:** August 12, 2026  
**Next Review:** December 2026 (or when policies update)
