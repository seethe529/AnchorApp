export const dbtCbtTechniques = {
  grounding: [
    { name: '5-4-3-2-1 Technique', description: '5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste', example: 'Example: "I see my phone, a chair, the wall, a lamp, my hands. I hear traffic, a clock ticking, my breathing, birds. I touch my shirt, the couch, my hair. I smell coffee, fresh air. I taste mint from my gum."', keywords: ['panic', 'overwhelmed', 'dissociation', 'flashback'] },
    { name: 'Box Breathing', description: 'Breathe in 4, hold 4, out 4, hold 4', example: 'Example: Inhale slowly counting 1-2-3-4, hold your breath 1-2-3-4, exhale slowly 1-2-3-4, hold empty 1-2-3-4. Repeat 4-5 times until you feel calmer.', keywords: ['anxiety', 'panic', 'hyperventilation', 'stress'] },
    { name: 'Progressive Muscle Relaxation', description: 'Tense and release muscle groups', example: 'Example: Clench your fists tight for 5 seconds, then release. Tense your shoulders up to your ears for 5 seconds, then drop. Continue with jaw, stomach, legs, and feet.', keywords: ['tension', 'stress', 'physical', 'body'] }
  ],
  distress_tolerance: [
    { name: 'TIPP', description: 'Temperature, Intense exercise, Paced breathing, Paired muscle relaxation', example: 'Example: Splash cold water on your face or hold ice cubes. Do 20 jumping jacks. Practice slow breathing. Tense and release your muscles while breathing deeply.', keywords: ['crisis', 'intense', 'emergency', 'overwhelming'] },
    { name: 'Distract with ACCEPTS', description: 'Activities, Contributing, Comparisons, Emotions, Push away, Thoughts, Sensations', example: 'Example: Clean your room (Activity), text a friend support (Contributing), remember a harder time you survived (Comparisons), watch a funny video (Emotions), visualize putting worries in a box (Push away).', keywords: ['urges', 'impulse', 'distraction', 'coping'] },
    { name: 'Self-Soothe', description: 'Use your 5 senses to comfort yourself', example: 'Example: Look at photos you love, listen to calming music, pet a soft blanket, smell lavender or coffee, eat a piece of chocolate slowly.', keywords: ['comfort', 'calm', 'soothe', 'relax'] }
  ],
  emotion_regulation: [
    { name: 'PLEASE', description: 'Treat PhysicaL illness, balance Eating, avoid mood-Altering substances, balance Sleep, get Exercise', example: 'Example: Take prescribed medications, eat 3 balanced meals, limit alcohol/caffeine, maintain 7-8 hours sleep schedule, take a 15-minute walk daily.', keywords: ['mood', 'emotional', 'stability', 'routine'] },
    { name: 'Opposite Action', description: 'Act opposite to your emotional urge', example: 'Example: If depressed and want to stay in bed → Get up and go outside. If angry and want to yell → Speak softly. If anxious and want to avoid → Approach gently.', keywords: ['depression', 'anger', 'fear', 'avoidance'] },
    { name: 'Check the Facts', description: 'Is my emotion fitting the facts?', example: 'Example: "I feel like everyone hates me. Facts: My friend texted me yesterday. My coworker smiled at me. No one has said they hate me. My emotion doesn\'t fit the facts."', keywords: ['thoughts', 'reality', 'perspective', 'rational'] }
  ],
  interpersonal: [
    { name: 'DEAR MAN', description: 'Describe, Express, Assert, Reinforce, Mindful, Appear confident, Negotiate', example: 'Example: "When you cancel plans last minute (Describe), I feel hurt (Express). I need advance notice (Assert). This will help our friendship (Reinforce). Can we agree on 24 hours notice? (Negotiate)"', keywords: ['communication', 'boundaries', 'conflict', 'assertive'] },
    { name: 'GIVE', description: 'Gentle, Interested, Validate, Easy manner', example: 'Example: Use a calm tone (Gentle), ask "How are you feeling?" (Interested), say "That makes sense" (Validate), smile and stay relaxed (Easy manner).', keywords: ['relationships', 'connection', 'empathy', 'social'] }
  ],
  mindfulness: [
    { name: 'Observe', description: 'Notice thoughts and feelings without judgment', example: 'Example: "I notice I\'m having the thought that I\'m not good enough. I notice tension in my chest. I\'m observing these without judging them as good or bad."', keywords: ['awareness', 'present', 'mindful', 'observe'] },
    { name: 'Describe', description: 'Put words to your experience', example: 'Example: "My heart is racing. My palms are sweaty. I\'m thinking about the meeting. I feel nervous." Just describe what is, not what it means.', keywords: ['thoughts', 'feelings', 'awareness', 'verbal'] },
    { name: 'Participate', description: 'Throw yourself into the activity', example: 'Example: When washing dishes, feel the warm water, notice the soap bubbles, hear the water running. Be fully present in just that moment and activity.', keywords: ['engagement', 'flow', 'present', 'activity'] }
  ],
  cognitive: [
    { name: 'Thought Record', description: 'Identify situation, mood, thoughts, evidence for/against', example: 'Example: Situation: Friend didn\'t text back. Mood: Sad. Thought: "They hate me." Evidence for: None. Evidence against: They\'re usually busy at work. Alternative: "They\'re probably just busy."', keywords: ['negative thoughts', 'cognitive', 'thinking', 'beliefs'] },
    { name: 'Behavioral Activation', description: 'Schedule pleasant activities', example: 'Example: Monday 10am - coffee at favorite café. Tuesday 6pm - call a friend. Wednesday 7pm - watch favorite show. Thursday 5pm - take a walk in the park.', keywords: ['depression', 'motivation', 'activity', 'mood'] },
    { name: 'Exposure', description: 'Gradually face feared situations', example: 'Example: Fear of crowds: Week 1 - walk past a store. Week 2 - enter store for 5 min. Week 3 - stay 15 min. Week 4 - go during busy time. Gradually increase difficulty.', keywords: ['avoidance', 'fear', 'phobia', 'anxiety'] }
  ]
};

export function suggestTechniques(userInput) {
  const input = userInput.toLowerCase();
  const suggestions = [];
  
  Object.entries(dbtCbtTechniques).forEach(([category, techniques]) => {
    techniques.forEach(technique => {
      const score = technique.keywords.reduce((acc, keyword) => {
        return input.includes(keyword) ? acc + 1 : acc;
      }, 0);
      if (score > 0) {
        suggestions.push({ ...technique, category, score });
      }
    });
  });
  
  return suggestions.sort((a, b) => b.score - a.score).slice(0, 3);
}