# VoiceOver Testing Guide for Anchor

## What is VoiceOver?

VoiceOver is Apple's built-in screen reader for blind and low-vision users. Testing with VoiceOver ensures your app is accessible to everyone.

## Setup (5 minutes)

### Enable VoiceOver on Your iPhone

**Method 1: Settings**
1. Open **Settings** app
2. Go to **Accessibility**
3. Tap **VoiceOver**
4. Toggle **VoiceOver** ON

**Method 2: Siri (Fastest)**
- Say: "Hey Siri, turn on VoiceOver"

**Method 3: Accessibility Shortcut (Recommended)**
1. Settings → Accessibility → Accessibility Shortcut
2. Select **VoiceOver**
3. Now triple-click the side button to toggle VoiceOver on/off

## Basic VoiceOver Gestures

### Essential Gestures:
- **Single tap**: Select an item (VoiceOver reads it)
- **Double tap**: Activate the selected item (like tapping normally)
- **Swipe right**: Move to next item
- **Swipe left**: Move to previous item
- **Two-finger swipe up**: Read all from current position
- **Three-finger triple tap**: Turn screen curtain on/off (screen goes black)

### Navigation:
- **Rotor**: Rotate two fingers on screen (like turning a dial)
  - Changes navigation mode (headings, links, buttons, etc.)
- **Swipe up/down**: Navigate by rotor setting

### Scrolling:
- **Three-finger swipe up/down**: Scroll page
- **Three-finger swipe left/right**: Go back/forward

## Testing Checklist for Anchor

### 1. Home Screen (5 min)

**Start VoiceOver and open Anchor**

✅ **Check:**
- [ ] App name is announced on launch
- [ ] Loading screen is announced ("Loading Anchor")
- [ ] Daily reminder is readable
- [ ] Each quick action button is announced clearly:
  - "Quick Grounding, button"
  - "Breathing Exercise, button"
  - "Talk to AI, button"
  - "Crisis Help, button"
  - "Safety Plan, button"
  - "Progress, button"
- [ ] Mood tracker buttons are announced:
  - "Excellent, button"
  - "Good, button"
  - "Okay, button"
  - "Poor, button"
  - "Terrible, button"
- [ ] Text input field is announced
- [ ] "Log Mood" button is announced

**Test:**
1. Swipe through all elements
2. Double-tap to activate a quick action
3. Verify you can navigate back

### 2. Tools Screen (5 min)

✅ **Check:**
- [ ] Category tabs are announced:
  - "Grounding category, button, selected"
  - "Distress Tolerance category, button"
  - etc.
- [ ] Each technique card is announced with name
- [ ] Technique descriptions are readable
- [ ] "Back" button is announced in detail view
- [ ] Feedback buttons are announced:
  - "Technique helped, button"
  - "Technique somewhat helped, button"
  - "Technique did not help much, button"

**Test:**
1. Navigate through categories
2. Select a technique
3. Read the full description
4. Rate the technique
5. Navigate back

### 3. AI Support Screen (5 min)

✅ **Check:**
- [ ] Quick help buttons are announced clearly
- [ ] Message input field is announced
- [ ] "Send message" button is announced
- [ ] Conversation messages are readable
- [ ] User vs AI messages are distinguishable

**Test:**
1. Navigate through quick help buttons
2. Focus on message input
3. Type a message (VoiceOver keyboard)
4. Send message
5. Verify response is readable

### 4. Crisis Screen (5 min)

✅ **Check:**
- [ ] Warning banner is announced first
- [ ] "Call 911" button is announced clearly
- [ ] Each crisis resource is announced with:
  - Resource name
  - Phone number
  - Description
- [ ] "View My Safety Plan" button is announced
- [ ] All emergency contacts are readable

**Test:**
1. Navigate through crisis resources
2. Verify phone numbers are readable
3. Test safety plan navigation

### 5. Progress Screen (3 min)

✅ **Check:**
- [ ] Chart titles are announced
- [ ] "No data available" messages are clear
- [ ] Stats are announced with labels:
  - "Total Mood Logs: 5"
  - "Techniques Used: 10"
  - "Average Mood: 3.5"

**Test:**
1. Navigate through charts
2. Verify stats are readable

### 6. Settings Screen (3 min)

✅ **Check:**
- [ ] Each setting is announced with:
  - Setting name
  - Description
  - Current state (on/off)
- [ ] "Export Data" button is announced
- [ ] "Clear All Data" button is announced with warning
- [ ] Version info is readable

**Test:**
1. Toggle a setting
2. Verify state change is announced
3. Navigate to export data

### 7. Tab Navigation (2 min)

✅ **Check:**
- [ ] Each tab is announced:
  - "Home, tab, 1 of 6"
  - "Tools, tab, 2 of 6"
  - etc.
- [ ] Selected tab is announced as "selected"
- [ ] Tab icons have meaningful labels

**Test:**
1. Navigate through all tabs
2. Verify current tab is announced

## Common Issues to Look For

### ❌ Bad Accessibility:
- "Button" with no label
- "Text" with no content
- Numbers without context ("5" instead of "Mood rating: 5")
- Generic labels ("Button 1", "Button 2")
- Missing hints for complex actions

### ✅ Good Accessibility:
- "Quick Grounding, button. Navigate to grounding techniques"
- "Mood rating: Excellent, button. Select this mood"
- "Send message, button. Sends your message to AI support"
- Clear, descriptive labels
- Helpful hints for non-obvious actions

## Testing Tips

### Do's:
✅ Test with eyes closed (real user experience)
✅ Try to complete a full task (log mood, use technique)
✅ Test with screen curtain on (three-finger triple tap)
✅ Navigate using only VoiceOver gestures
✅ Test all interactive elements

### Don'ts:
❌ Don't peek at the screen
❌ Don't skip elements
❌ Don't assume labels are clear
❌ Don't test with VoiceOver off

## Quick Test Scenarios (15 min total)

### Scenario 1: New User (5 min)
1. Open app for first time
2. Accept disclaimer using VoiceOver
3. Navigate to Tools
4. Find and use a grounding technique
5. Rate the technique

### Scenario 2: Crisis Moment (3 min)
1. Navigate to Crisis tab
2. Find Veterans Crisis Line
3. Verify phone number is readable
4. Access Safety Plan

### Scenario 3: Daily Check-in (4 min)
1. Open app
2. Log mood
3. Add notes
4. Submit
5. View progress

### Scenario 4: AI Support (3 min)
1. Navigate to AI Support
2. Use quick help button
3. Read AI response
4. Send custom message

## Fixing Issues

If you find issues, note:
- **Screen**: Which screen has the issue
- **Element**: Which button/text/input
- **Problem**: What's wrong (no label, unclear label, etc.)
- **Expected**: What it should say

Example:
```
Screen: Home
Element: First quick action button
Problem: Announced as "Button" only
Expected: "Quick Grounding, button. Navigate to grounding techniques"
```

## After Testing

### Document Results:
- [ ] All screens tested
- [ ] All interactive elements have labels
- [ ] All labels are clear and descriptive
- [ ] All hints are helpful
- [ ] Navigation is logical
- [ ] Can complete all major tasks

### Create Issues:
If you find problems, create GitHub issues with:
- Title: "Accessibility: [Screen] - [Problem]"
- Description: What's wrong and how to fix
- Label: "accessibility"

## Turning Off VoiceOver

**Method 1:** Triple-click side button (if shortcut enabled)
**Method 2:** Say "Hey Siri, turn off VoiceOver"
**Method 3:** Settings → Accessibility → VoiceOver → OFF

## Resources

- [Apple VoiceOver Guide](https://support.apple.com/guide/iphone/turn-on-and-practice-voiceover-iph3e2e415f/ios)
- [VoiceOver Gestures](https://support.apple.com/en-us/HT204783)
- [Accessibility Best Practices](https://developer.apple.com/accessibility/)

## Time Estimate

- **Setup**: 5 minutes
- **Full Testing**: 30 minutes
- **Quick Test**: 15 minutes
- **Per Screen**: 3-5 minutes

## Success Criteria

Your app passes VoiceOver testing if:
✅ Every interactive element is announced
✅ Labels are clear and descriptive
✅ Users can complete all major tasks
✅ Navigation is logical and predictable
✅ No elements are skipped or hidden
✅ Hints provide helpful context

---

**Remember**: If you can complete all tasks with your eyes closed, your app is accessible! 👍

Good luck with testing! 💚
