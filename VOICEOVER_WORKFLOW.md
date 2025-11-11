# VoiceOver Workflow for AI Support Screen

## Expected VoiceOver Navigation Order

When a blind user navigates the AI Support screen with VoiceOver enabled, they should encounter elements in this order:

### 1. Quick Help Section (Top)
- "Quick Help:" heading
- "Help me calm down" button
- "I need grounding techniques" button
- "Help with sleep" button
- "Breathing exercises" button
- "Feeling overwhelmed" button
- "Need coping strategies" button

### 2. Conversation Messages (Middle - Scrollable)
- "AI responded: Hi, I'm here to support you..." (initial greeting)
- "You said: [user message]" (if any previous messages)
- "AI responded: [AI response]" (if any previous messages)
- Continue for all conversation history...

### 3. Message Input (Bottom - Always Accessible)
- "Message input field" - TextInput
  - Hint: "Type your message to AI support. Double tap to activate."
- "Send message" button
  - Hint: "Sends your message to AI support"
  - State: Disabled when no text entered

## How Blind Users Interact

### Sending a Message:
1. Swipe right through elements until reaching "Message input field"
2. Double-tap to activate the text field
3. Type message using on-screen keyboard or dictation
4. Swipe right to "Send message" button
5. Double-tap to send

### Using Quick Help:
1. From top of screen, swipe right through Quick Help buttons
2. When desired button is focused, double-tap to send that message
3. Message is automatically sent to AI

### Reading Conversation:
1. Swipe right through conversation messages
2. VoiceOver reads each message with context ("You said" or "AI responded")
3. Three-finger swipe up/down to scroll through longer conversations

## Testing Checklist

- [ ] Can navigate to text input field by swiping right
- [ ] Text input field announces correctly when focused
- [ ] Can activate text input with double-tap
- [ ] Can type or dictate message
- [ ] Can navigate to Send button
- [ ] Send button announces disabled state when no text
- [ ] Quick Help buttons are accessible and announce correctly
- [ ] Conversation messages are readable in order
- [ ] No elements are skipped or unreachable
- [ ] Navigation order makes logical sense

## Common VoiceOver Issues Fixed

1. ❌ **TouchableWithoutFeedback blocking navigation** - REMOVED
2. ❌ **ScrollView grouping all content** - FIXED (Quick Help separated)
3. ❌ **TextInput not focusable** - FIXED (explicit accessible={true})
4. ❌ **Unclear accessibility labels** - FIXED (descriptive labels added)

## If Text Input Still Not Accessible

Try these debugging steps:

1. **Check element order**: Use VoiceOver rotor to list all form controls
2. **Verify TextInput is rendered**: Check if it appears in accessibility tree
3. **Test without Quick Help**: Temporarily hide Quick Help to isolate issue
4. **Check KeyboardAvoidingView**: May be affecting layout/accessibility
5. **Test on physical device**: Simulator VoiceOver has known bugs
