# Build 54 - Technique System Enhancements

**Date:** January 2025  
**Status:** ✅ Complete

## Overview

Major enhancement to the DBT/CBT technique suggestion system with improved natural language understanding, expanded technique library, and comprehensive citation coverage.

---

## New Techniques Added (7)

### Grounding
1. **Safe Place Visualization** - Imagine a safe, calm place using all senses
2. **Cold Grounding** - Use cold temperature to shift emotional arousal
3. **Name 3 Things** - Quick orientation by naming 3 things you see/hear/feel

### Distress Tolerance
4. **Radical Acceptance** - Accept reality without judgment to reduce suffering
5. **Pros and Cons** - Pause and evaluate urges before acting

### Emotion Regulation
6. **Self-Validation** - Notice and validate feelings without judgment

### Mindfulness
7. **Half-Smile and Willing Hands** - Use posture to signal safety to nervous system

---

## Enhanced Suggestion Algorithm

### Synonym Mapping
- Maps natural language variations to core keywords
- Examples:
  - "panicked", "panicking", "freaking out" → "panic"
  - "heart racing", "chest tight" → "panic"
  - "unreal", "detached" → "dissociation"
  - "ashamed", "guilty" → emotional keywords

### High-Intensity Phrase Detection
- Detects crisis language: "panic attack", "can't breathe", "losing it", "overwhelmed"
- Applies 1.5x score boost to grounding and distress tolerance techniques
- Prioritizes immediate coping skills for acute distress

### Weighted Scoring
- Counts keyword matches per technique
- Bonus points for multi-word phrase matches
- Returns top 3 most relevant suggestions
- Sorts by relevance score

---

## Expanded Keywords

### Core Techniques (Deep Expansion)
- **5-4-3-2-1 Technique**: 16 keywords including panic variations, dissociation, trauma terms
- **Box Breathing**: 14 keywords including physical symptoms, breathing difficulties
- **TIPP**: 10 keywords for crisis and emergency situations
- **Opposite Action**: 15 keywords covering depression, anger, fear, avoidance
- **Check the Facts**: 12 keywords for cognitive distortions
- **Thought Record**: 11 keywords for negative thinking patterns
- **Behavioral Activation**: 11 keywords for depression and withdrawal
- **Self-Validation**: 15 keywords for shame, guilt, invalidation

### All Other Techniques
- Expanded to 5-10 meaningful keywords each
- Includes synonyms, physical symptoms, emotional states
- Trauma-informed language throughout

---

## Citation Coverage

### All Techniques Now Have Citations
- **Total techniques**: 27 (20 existing + 7 new)
- **Citation coverage**: 100%

### New Citations Added
1. Radical Acceptance - Behavioural Tech DBT
2. Pros and Cons - Behavioural Tech DBT
3. Self-Validation - Behavioural Tech DBT
4. Half-Smile and Willing Hands - Behavioural Tech DBT
5. Safe Place Visualization - VA National Center for PTSD
6. Cold Grounding - Behavioural Tech TIPP Skills
7. Name 3 Things - University of Rochester Medical Center

### Citation Sources
- Behavioural Tech (Linehan Institute) - DBT skills
- American Psychological Association - CBT/mindfulness
- VA National Center for PTSD - Trauma techniques
- Harvard Medical School - Breathing techniques
- Mayo Clinic - Progressive Muscle Relaxation
- University of Rochester Medical Center - Grounding

---

## Testing

### New Tests Added (8)
1. ✅ Panic phrase variations ("panicked", "freaking out", "losing it")
2. ✅ Physical symptom phrases ("heart racing", "chest tight", "can't breathe")
3. ✅ Dissociation phrases ("unreal", "detached", "disconnected")
4. ✅ Top 3 suggestion limit
5. ✅ Empty/invalid input handling
6. ✅ High-intensity boost verification
7. ✅ Every technique has citation
8. ✅ All new techniques have citations

### Test Results
- **Total tests**: 68 (60 existing + 8 new)
- **Pass rate**: 100%
- **Coverage**: All techniques, citations, and suggestion logic

---

## Files Modified

### Core Data
- `src/data/techniques.js` - Added 7 techniques, expanded keywords, enhanced algorithm
- `src/data/citations.js` - Added 7 citations, updated mapping

### Components
- `src/components/SafetyPlan.js` - Fixed Emergency Contact buttons (call/text functionality)

### Tests
- `src/__tests__/techniques.test.js` - Added 8 comprehensive tests

### Configuration
- `app.config.js` - Version 1.2.0, Build 54

---

## Algorithm Performance

### Input Processing
- Lowercase + trim normalization
- Synonym expansion (40+ mappings)
- Multi-word phrase detection
- Case-insensitive matching

### Scoring System
- Base: +1 per keyword match
- Bonus: +2 for exact multi-word phrase
- Multiplier: 1.5x for high-intensity + grounding/distress tolerance
- Output: Top 3 sorted by score

### Example Behavior
```javascript
// Input: "I'm having a panic attack and can't breathe"
// Output: [Box Breathing, Cold Grounding, TIPP]
// Reason: High-intensity phrases detected, grounding prioritized

// Input: "I feel unreal and detached"
// Output: [5-4-3-2-1, Name 3 Things, Safe Place Visualization]
// Reason: Dissociation keywords, grounding techniques

// Input: "I hate myself and feel ashamed"
// Output: [Self-Validation, Opposite Action, Check the Facts]
// Reason: Emotion regulation for shame/guilt
```

---

## User Impact

### Improved Accuracy
- Natural language understanding (not just exact keywords)
- Handles variations: "panicked" vs "panicking" vs "panic attack"
- Physical symptom recognition
- Trauma-informed phrase detection

### Better Crisis Response
- High-intensity phrases prioritize immediate coping skills
- Grounding and breathing techniques surface first for panic
- Distress tolerance for overwhelming moments

### Complete Evidence Base
- Every technique backed by credible source
- Citations from recognized mental health organizations
- Educational, non-clinical language maintained

---

## Safety Plan Fix

### Emergency Contacts Now Functional
- **988 button** → Calls National Suicide Prevention Lifeline
- **741741 button** → Opens SMS with "HOME" pre-filled
- **1-800-273-8255 button** → Calls Veterans Crisis Line

Previously these buttons had no `onPress` handlers and were non-functional.

---

## Backward Compatibility

### No Breaking Changes
- All existing techniques preserved
- Public API unchanged: `suggestTechniques(userInput)`
- Citation functions unchanged: `getCitationForTechnique(name)`, `formatCitation(citation)`
- ToolsScreen continues to work without modification
- AI Agent screen continues to work without modification

---

## Next Steps for Build 55+

### Potential Enhancements
- [ ] Add more breathing techniques (Alternate Nostril, Coherent Breathing)
- [ ] Expand interpersonal effectiveness (FAST, THINK)
- [ ] Add more cognitive techniques (Cognitive Defusion, Decatastrophizing)
- [ ] Multi-language support for keywords
- [ ] User feedback on suggestion accuracy
- [ ] Personalized suggestions based on usage history

---

**Build 54 Status:** ✅ Ready for iOS submission  
**Test Coverage:** 100% (68/68 tests passing)  
**Citation Coverage:** 100% (27/27 techniques)  
**New Techniques:** 7 added  
**Enhanced Keywords:** All 27 techniques  
**Algorithm:** Natural language + weighted scoring
