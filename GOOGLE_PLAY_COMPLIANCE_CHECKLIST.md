# Google Play Policy Compliance - Quick Action Checklist

**Policy Update Date:** July 15, 2026  
**Compliance Deadline:** August 14, 2026  
**Your App:** Anchor - PTSD Support

---

## ✅ IMMEDIATE ACTIONS REQUIRED

### 1. Update Google Play Console Data Safety Section (15-30 minutes)

**Status:** 🔴 **REQUIRED - Not Yet Complete**

**Steps:**
1. [ ] Log into [Google Play Console](https://play.google.com/console)
2. [ ] Select Anchor app
3. [ ] Navigate to **App content** → **Data safety**
4. [ ] Click **Manage** or **Start**
5. [ ] Answer "Yes" to collecting/sharing data
6. [ ] Select **Messages** as data type shared
7. [ ] Mark as **"Shared with OpenAI"**
8. [ ] Indicate it's **"Optional"** (users choose)
9. [ ] Copy declaration text from `GOOGLE_PLAY_DATA_SAFETY_GUIDE.md` Section 6
10. [ ] Add OpenAI as third-party service with privacy policy link
11. [ ] Confirm HTTPS/TLS encryption
12. [ ] Confirm data deletion capability
13. [ ] Save and submit
14. [ ] Wait 1-3 business days for approval

**Detailed Guide:** See `GOOGLE_PLAY_DATA_SAFETY_GUIDE.md`

---

### 2. Verify App Registration (2 minutes)

**Status:** ❓ **VERIFICATION NEEDED**

**Steps:**
1. [ ] Open Google Play Console Home page
2. [ ] Look for "Register your app" banner
3. [ ] If banner appears → Click and complete registration
4. [ ] If no banner → You're already registered ✅

---

### 3. Update Privacy Policy Online (5 minutes)

**Status:** ✅ **COMPLETED** (files updated, need to deploy)

**Steps:**
1. [ ] Commit updated privacy policy files:
   - `PRIVACY_POLICY.md` ✅ Updated
   - `docs/index.md` ✅ Updated
2. [ ] Push to GitHub
3. [ ] Verify live at https://seethe529.github.io/AnchorApp/
4. [ ] Confirm updated date shows: August 12, 2026

**Commands:**
```bash
cd /Users/ryanl/AnchorApp
git add PRIVACY_POLICY.md docs/index.md GOOGLE_PLAY_DATA_SAFETY_GUIDE.md GOOGLE_PLAY_COMPLIANCE_CHECKLIST.md
git commit -m "docs: update privacy policy for Google Play July 2026 compliance - OpenAI disclosure"
git push
```

---

## ✅ ALREADY COMPLIANT (No Action Needed)

### Target SDK Version ✅
- **Your SDK:** Android 15 (API 35) via Expo SDK 54
- **Required:** Latest API by August 31, 2026
- **Status:** Already compliant

### Anonymous Chat Restrictions ✅
- **Your App:** AI support, not random/anonymous chat
- **Status:** Policy doesn't apply to you

### Call Log Permissions ✅
- **Your Permissions:** NOTIFICATIONS only
- **Status:** Policy doesn't apply to you

### Content Rating ✅
- **Your Rating:** Present in app config
- **Status:** Compliant

---

## 📋 OPTIONAL (Recommended)

### 4. Update In-App Disclosure (Optional but Recommended)

**Status:** 🟡 **OPTIONAL - Consider Adding**

**Location:** `src/components/OnboardingTour.js` or AI Support screen

**Current Text:**
> "Your mood logs, progress, and safety plan stay on your device. AI conversations are sent to OpenAI for responses but not stored by us."

**Suggested Addition:**
```javascript
// Add to AI Support screen header or first use:
"AI Support uses OpenAI to generate responses. Your messages are sent securely but not stored by Anchor. Limited to 10 messages/day. Learn more in Settings → Privacy Policy."
```

---

### 5. Monitor for Follow-up Requests (Ongoing)

**Status:** 🟡 **ONGOING**

**Actions:**
- [ ] Check Google Play Console email notifications daily
- [ ] Respond to any clarification requests within 7 days
- [ ] Monitor app status for warnings

---

## 📊 COMPLIANCE STATUS DASHBOARD

| Item | Status | Deadline | Priority |
|------|--------|----------|----------|
| Data Safety Update | 🔴 TODO | Aug 14 | **HIGH** |
| App Registration Check | ❓ Verify | Aug 14 | **HIGH** |
| Privacy Policy Deploy | ✅ Ready | Aug 14 | **MEDIUM** |
| Target SDK | ✅ Done | Aug 31 | - |
| In-App Disclosure | 🟡 Optional | - | **LOW** |

---

## 🎯 SUCCESS CRITERIA

Your app is fully compliant when:
- [x] Target SDK is API 35 (Android 15) ✅
- [ ] Data Safety section explicitly mentions OpenAI integration
- [ ] OpenAI privacy policy linked in Data Safety
- [ ] User control/opt-out clearly stated
- [ ] Privacy policy updated and deployed online
- [ ] App registration verified in Play Console
- [ ] No warnings/violations in Play Console

---

## ⏰ TIMELINE

**Today (August 12, 2026):**
- ✅ Privacy policy files updated
- 🔴 Need to: Deploy privacy policy
- 🔴 Need to: Update Data Safety in Play Console
- ❓ Need to: Verify app registration

**August 14, 2026 (Deadline):**
- All updates must be submitted
- Google will review within 1-3 days after submission

**August 31, 2026 (Target SDK Deadline):**
- Already compliant ✅

---

## 🆘 IF YOU GET STUCK

### Google Rejects Your Data Safety Submission
- Read the rejection reason carefully
- Common fix: Add more detail about user control/opt-out
- Refer to Section 9 of `GOOGLE_PLAY_DATA_SAFETY_GUIDE.md`
- Resubmit within 7 days

### Can't Find Data Safety Section
- Make sure you're in the correct app (com.anchor.ptsdsupport)
- Try: App content → Scroll down → Data safety
- Alternative: Search "data safety" in Play Console search bar

### Questions About OpenAI Compliance
- OpenAI is GDPR/CCPA compliant
- Their API terms cover enterprise data processing
- Your privacy policy + Play Console disclosure = compliant

---

## 📞 SUPPORT CONTACTS

**Google Play Support:**
- Policy Help: https://support.google.com/googleplay/android-developer/answer/10787469
- Developer Forum: https://support.google.com/googleplay/android-developer/community

**Your Resources:**
- Detailed Guide: `GOOGLE_PLAY_DATA_SAFETY_GUIDE.md`
- Privacy Policy: `PRIVACY_POLICY.md`
- Online Privacy: https://seethe529.github.io/AnchorApp/

---

## 🔄 NEXT STEPS (In Order)

1. **RIGHT NOW:**
   ```bash
   # Deploy updated privacy policy
   cd /Users/ryanl/AnchorApp
   git add -A
   git commit -m "docs: Google Play July 2026 policy compliance"
   git push
   ```

2. **NEXT (15-30 minutes):**
   - Open Google Play Console
   - Update Data Safety section (use guide)
   - Verify app registration
   - Submit changes

3. **WITHIN 48 HOURS:**
   - Check for Google email confirmation
   - Verify Data Safety section is live

4. **BEFORE AUGUST 14:**
   - Confirm no warnings in Play Console
   - Mark this checklist complete ✅

---

**Last Updated:** August 12, 2026  
**Prepared By:** Kiro AI Assistant  
**Estimated Time to Complete:** 30-45 minutes total
