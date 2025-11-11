# TestFlight Testing Checklist - Build 5

**Build Number:** 5  
**Version:** 1.0.0  
**Date:** November 11, 2025  
**Status:** Ready for Testing

---

## Pre-Testing Setup

- [ ] Wait for Apple to process Build 5 (5-10 minutes)
- [ ] Add yourself as Internal Tester in App Store Connect
- [ ] Install TestFlight app on iPhone
- [ ] Accept invite and install Anchor Build 5

---

## Critical Tests (Apple Rejection Issues)

### ✅ Issue 1: Location Permission
- [ ] Go to Crisis tab
- [ ] Tap "Find Local Crisis Centers"
- [ ] **Verify:** Permission prompt shows clear explanation about finding nearby crisis centers
- [ ] **Verify:** Location is only requested when button is tapped
- [ ] Grant permission and verify Google Maps opens with nearby results

### ✅ Issue 2: iPad Support
- [ ] **Verify:** App only available on iPhone (not iPad)
- [ ] Check App Store Connect shows "iPhone" only

### ✅ Issue 3: AI Support Functionality
- [ ] Go to AI Support tab
- [ ] Send a test message: "I feel anxious"
- [ ] **Verify:** AI responds with helpful message (not error)
- [ ] **Verify:** No "API key required" error message
- [ ] **Verify:** Conversation scrolls to bottom automatically
- [ ] Try Quick Help buttons
- [ ] **Verify:** All buttons work and send messages

### ✅ Issue 4: No Incomplete Features
- [ ] Go to Settings tab
- [ ] **Verify:** No "Dark Mode (coming soon)" option
- [ ] **Verify:** All visible features work
- [ ] Check all tabs for any "coming soon" text

---

## Core Functionality Tests

### Home Screen
- [ ] Daily reminder displays
- [ ] Quick Actions work (Breathing, Grounding, Crisis)
- [ ] Mood tracker opens and works
- [ ] Log a mood entry
- [ ] **Verify:** Mood saves successfully

### Tools Screen
- [ ] All 6 categories display
- [ ] Tap a technique and view details
- [ ] Rate a technique (thumbs up/down)
- [ ] **Verify:** Rating saves

### AI Support Screen
- [ ] Initial greeting displays
- [ ] Quick Help buttons work
- [ ] Type and send a message
- [ ] **Verify:** AI responds appropriately
- [ ] **Verify:** Conversation history persists
- [ ] **Verify:** Auto-scrolls to new messages
- [ ] Test with multiple messages

### Crisis Screen
- [ ] Warning banner displays
- [ ] All crisis hotline numbers display
- [ ] Tap "Call 911" - verify alert shows
- [ ] Tap "National Suicide Prevention Lifeline" - verify call prompt
- [ ] Tap "Find Local Crisis Centers" - verify location permission
- [ ] Tap "Hospital Emergency Room" - verify Google Maps opens
- [ ] View Safety Plan

### Progress Screen
- [ ] Go to Home, log a mood
- [ ] Switch to Progress tab
- [ ] **Verify:** New mood appears in chart
- [ ] **Verify:** Quick Stats update
- [ ] **Verify:** Charts display correctly
- [ ] Use a technique, return to Progress
- [ ] **Verify:** Technique usage updates

### Settings Screen
- [ ] All toggles work
- [ ] Tap "Export Data"
- [ ] **Verify:** Share sheet opens with JSON data
- [ ] Check app version displays correctly (1.0.0)
- [ ] **Verify:** No "coming soon" features

---

## Accessibility Tests

### VoiceOver
- [ ] Enable VoiceOver (Settings > Accessibility)
- [ ] Navigate through all tabs
- [ ] **Verify:** All buttons have labels
- [ ] **Verify:** AI Support messages are readable
- [ ] **Verify:** Crisis resources are accessible

### Reduced Motion
- [ ] Enable Reduce Motion (Settings > Accessibility)
- [ ] Go to Tools > Breathing Exercise
- [ ] **Verify:** Animation is disabled or simplified

---

## Performance Tests

### Offline Mode
- [ ] Enable Airplane Mode
- [ ] **Verify:** Offline indicator appears
- [ ] Navigate all tabs
- [ ] **Verify:** All features work except AI Support
- [ ] Try AI Support
- [ ] **Verify:** Shows helpful offline message

### Memory & Crashes
- [ ] Use app for 10+ minutes
- [ ] Switch between tabs rapidly
- [ ] Send multiple AI messages
- [ ] Log multiple moods
- [ ] **Verify:** No crashes or freezes

---

## Edge Cases

### Empty States
- [ ] Fresh install (or clear data in Settings)
- [ ] Check Progress tab
- [ ] **Verify:** Shows "No data yet" messages
- [ ] **Verify:** Doesn't crash or show errors

### Long Text
- [ ] Send a very long message to AI (400+ characters)
- [ ] **Verify:** Handles gracefully
- [ ] Add long notes to mood log
- [ ] **Verify:** Displays correctly

---

## Final Checks

- [ ] No crashes during entire test session
- [ ] All features work as expected
- [ ] No error messages or broken UI
- [ ] App feels polished and complete
- [ ] No "beta" or "coming soon" language anywhere

---

## Issues Found

**Document any issues here:**

1. 
2. 
3. 

---

## Sign-Off

- [ ] All critical tests passed
- [ ] All core functionality tests passed
- [ ] No blocking issues found
- [ ] Ready to submit to App Store

**Tester:** _______________  
**Date:** _______________  
**Build:** 5  
**Result:** ☐ PASS  ☐ FAIL (see issues above)

---

## Next Steps After Testing

If all tests pass:
1. Go to App Store Connect
2. Select Build 5 for version 1.0.0
3. Submit for App Store Review
4. Monitor email for Apple's response

If issues found:
1. Document issues above
2. Fix issues in code
3. Increment to Build 6
4. Rebuild and retest
