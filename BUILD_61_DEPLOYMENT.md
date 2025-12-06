# Build 61 - Deployment Checklist

**Date:** December 5, 2025  
**Version:** 1.2.0 (Build 61)  
**Platform:** Android  
**Status:** ✅ Built - Ready for Upload

---

## Build Information

**Build URL:** https://expo.dev/accounts/ryan-charles-lingo/projects/anchor-ptsd-support/builds/7bd78b93-9ad8-497e-90ef-f3193bea6a0e

**Download AAB:** https://expo.dev/artifacts/eas/ghY64xbNpXwjTVtK28S1KQ.aab

**Git Commit:** f301be86a983f01698390a739fabf4cdd08782e0  
**Branch:** android-release

---

## Deployment Steps

### 1. Download AAB ✅
```bash
# Already built - download from URL above
```

### 2. Upload to Google Play Console

1. Go to: https://play.google.com/console
2. Select: Anchor - PTSD Support
3. Navigate to: Testing → Closed Testing → Alpha
4. Click: "Create new release"
5. Upload: `anchor-build-61.aab`
6. Add release notes (see below)
7. Review and rollout to alpha testers

### 3. Release Notes for Google Play

**Title:** Build 61 - Improved Notification System

**Release Notes:**
```
What's New in Build 61:

🔔 IMPROVED NOTIFICATIONS
• Extended notification coverage from 3 days to 7 days
• 112 breathing reminders (every 90 minutes for a week)
• 7 mood check-ins (8 PM daily for a week)
• Smarter auto-rescheduling when you open the app

🧪 TESTING FOCUS
• Please test notifications over 7 days
• Enable both breathing and mood reminders in Settings
• Report any issues using the Export Notifications tool

📋 WHAT TO TEST
• Notification delivery throughout the day
• 8 PM mood check-ins
• Notifications continuing after not opening app for 24+ hours
• All existing features (28 techniques, AI chat, breathing, crisis resources)

Thank you for testing! Your feedback helps us support veterans and individuals with PTSD.
```

### 4. Notify Testers

**Subject:** New Build Available - Build 61 (Improved Notifications)

**Message:**
```
Hi Alpha Testers,

A new build (Build 61) is now available for testing!

WHAT'S NEW:
This build significantly improves the notification system with 7-day coverage instead of 3 days. This means you'll continue receiving breathing reminders and mood check-ins even if you don't open the app every day.

WHAT TO TEST:
1. Enable notifications in Settings
2. Monitor notification delivery over 7 days
3. Test the app after not opening it for 24+ hours
4. Use "Export Notifications" in Settings if you experience issues

RELEASE NOTES:
See full release notes here: [Attach RELEASE_NOTES_BUILD_61.md]

TESTING PERIOD:
Please test for at least 7 days (ideally through December 12, 2025)

FEEDBACK:
Report any issues through the testing platform or directly to us.

Thank you for your continued support!
```

---

## Testing Checklist

### Pre-Deployment Verification ✅
- [x] Build completed successfully
- [x] Version code incremented (60 → 61)
- [x] Unit tests passing (35/35 notification tests)
- [x] All tests passing (66/66 total)
- [x] Documentation updated
- [x] Release notes prepared
- [x] Git committed

### Post-Upload Verification
- [ ] AAB uploaded to Google Play Console
- [ ] Release notes added
- [ ] Alpha track selected
- [ ] Testers notified
- [ ] Build available to testers

### Monitoring (First 48 Hours)
- [ ] Check for crash reports
- [ ] Monitor tester feedback
- [ ] Verify notification delivery reports
- [ ] Check export notification data from testers

---

## Key Changes in Build 61

### Notification System
- **iOS:** Hourly timer + 1-day coverage (16 breathing, 2 mood)
- **Android:** AppState listener + 7-day coverage (112 breathing, 7 mood)
- **Both:** Explicit cancellation before rescheduling (prevents duplicates)

### Testing
- 35 new unit tests for notification system
- All tests passing (66 total)
- Comprehensive coverage of platform-specific logic

### Documentation
- NOTIFICATION_SYSTEM.md - Technical documentation
- BUILD_61_SUMMARY.md - Change summary
- RELEASE_NOTES_BUILD_61.md - Tester-facing notes
- ANDROID_RELEASE.md - Updated with Build 61 details

---

## Rollback Plan

If critical issues are discovered:

1. **Immediate:** Pause alpha rollout in Google Play Console
2. **Revert:** `git revert f301be86a983f01698390a739fabf4cdd08782e0`
3. **Rebuild:** Build 60 (previous stable version)
4. **Redeploy:** Upload Build 60 to alpha track
5. **Notify:** Inform testers of rollback

**Build 60 Details:**
- Commit: 35ff12c
- AAB: Available in Google Play Console history
- Known stable with 3-day notification coverage

---

## Success Metrics

### Week 1 (December 5-12)
- [ ] No critical crashes reported
- [ ] Notifications delivering consistently
- [ ] Testers report 7-day coverage working
- [ ] Export notification data shows proper scheduling

### Week 2 (December 12-19)
- [ ] Continued stable operation
- [ ] Positive tester feedback
- [ ] No notification gaps reported
- [ ] Ready for production release

---

## Next Steps

1. **Today (December 5):**
   - Upload AAB to Google Play Console
   - Add release notes
   - Notify testers

2. **Weekend (December 6-8):**
   - Monitor initial feedback
   - Check for any immediate issues

3. **Week 1 (December 9-12):**
   - Collect tester feedback
   - Review export notification data
   - Address any issues

4. **Week 2 (December 13-19):**
   - Final testing verification
   - Prepare for production release
   - Plan iOS Build 61 (if Android successful)

---

## Contact

**Issues/Questions:**
- Development Team: [Your contact]
- Testing Platform: testerscommunity.com
- Google Play Console: https://play.google.com/console

---

**Status:** ✅ Ready for Upload  
**Next Action:** Upload AAB to Google Play Console  
**Estimated Time:** 10 minutes  
**Blocker:** None

---

**Prepared By:** Development Team  
**Date:** December 5, 2025  
**Build:** 61 (android-release)
