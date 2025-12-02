// Synonym mapping for natural language understanding
const SYNONYM_MAP = {
  // Panic/anxiety variations
  'panicked': 'panic',
  'panicking': 'panic',
  'freaking out': 'panic',
  'losing it': 'panic',
  'on edge': 'anxiety',
  'anxious': 'anxiety',
  'nervous': 'anxiety',
  'worried': 'anxiety',
  
  // Physical symptoms
  'heart racing': 'panic',
  'heart pounding': 'panic',
  'heart is racing': 'panic',
  'chest tight': 'panic',
  'chest tightness': 'panic',
  'chest is tight': 'panic',
  'can\'t breathe': 'panic',
  'cannot breathe': 'panic',
  'hyperventilating': 'hyperventilation',
  'shaky': 'anxiety',
  'shaking': 'anxiety',
  'trembling': 'anxiety',
  'dizzy': 'overwhelmed',
  'lightheaded': 'overwhelmed',
  'numb': 'dissociation',
  
  // Dissociation/trauma
  'unreal': 'dissociation',
  'detached': 'dissociation',
  'disconnected': 'dissociation',
  'out of body': 'dissociation',
  'triggered': 'flashback',
  'reliving': 'flashback',
  
  // Emotions
  'hate myself': 'shame',
  'ashamed': 'shame',
  'guilty': 'guilt',
  'alone': 'isolation',
  'lonely': 'isolation',
  'hopeless': 'depression',
  'worthless': 'depression',
  'sad': 'depression',
  'angry': 'anger',
  'mad': 'anger',
  'furious': 'anger',
  'scared': 'fear',
  'afraid': 'fear',
  'terrified': 'fear'
};

// High-intensity phrases that should prioritize grounding/distress tolerance
const HIGH_INTENSITY_PHRASES = [
  'panic attack', 'can\'t breathe', 'cannot breathe', 'losing it', 
  'freaking out', 'overwhelmed', 'feel unsafe', 'heart racing',
  'chest tight', 'hyperventilating', 'flashback', 'triggered'
];

export const dbtCbtTechniques = {
  grounding: [
    { 
      name: '5-4-3-2-1 Technique', 
      description: '5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste', 
      example: 'Example: "I see my phone, a chair, the wall, a lamp, my hands. I hear traffic, a clock ticking, my breathing, birds. I touch my shirt, the couch, my hair. I smell coffee, fresh air. I taste mint from my gum."', 
      keywords: ['panic', 'panicked', 'panicking', 'overwhelmed', 'dissociation', 'flashback', 'triggered', 'unreal', 'detached', 'disconnected', 'grounding', 'present', 'senses', 'anxiety', 'fear', 'scared']
    },
    { 
      name: 'Box Breathing', 
      description: 'Breathe in 4, hold 4, out 4, hold 4', 
      example: 'Example: Inhale slowly counting 1-2-3-4, hold your breath 1-2-3-4, exhale slowly 1-2-3-4, hold empty 1-2-3-4. Repeat 4-5 times until you feel calmer.', 
      keywords: ['anxiety', 'anxious', 'panic', 'panicked', 'hyperventilation', 'hyperventilating', 'stress', 'can\'t breathe', 'cannot breathe', 'heart racing', 'chest tight', 'breathing', 'calm', 'nervous']
    },
    { 
      name: 'Progressive Muscle Relaxation', 
      description: 'Tense and release muscle groups', 
      example: 'Example: Clench your fists tight for 5 seconds, then release. Tense your shoulders up to your ears for 5 seconds, then drop. Continue with jaw, stomach, legs, and feet.', 
      keywords: ['tension', 'tense', 'tight', 'stress', 'physical', 'body', 'muscle', 'relaxation', 'stiff', 'sore', 'aching']
    },
    { 
      name: '4-7-8 Breathing', 
      description: 'Inhale 4, hold 7, exhale 8 for deep relaxation', 
      example: 'Example: Inhale quietly through nose for 4 counts, hold breath for 7 counts, exhale completely through mouth for 8 counts. Developed by Dr. Andrew Weil for sleep and anxiety.', 
      keywords: ['sleep', 'insomnia', 'relaxation', 'anxiety', 'calm', 'rest', 'tired', 'exhausted', 'wind down']
    },
    { 
      name: 'Resonant Breathing', 
      description: '5-second inhale, 5-second exhale for balance', 
      example: 'Example: Breathe in slowly for 5 counts, breathe out slowly for 5 counts. This 6-breaths-per-minute pattern optimizes heart rate variability and emotional balance.', 
      keywords: ['balance', 'heart rate', 'calm', 'steady', 'regulate', 'center', 'grounded']
    },
    { 
      name: 'Physiological Sigh', 
      description: 'Double inhale, long exhale for quick stress relief', 
      example: 'Example: Take a quick inhale through nose, immediately take another quick inhale, then one long slow exhale. Rapidly reduces stress and resets your nervous system.', 
      keywords: ['stress', 'quick', 'reset', 'emergency', 'fast', 'rapid', 'immediate', 'overwhelmed']
    },
    { 
      name: 'Triangle Breathing', 
      description: 'Simple 3-count inhale, hold, exhale pattern', 
      example: 'Example: Inhale for 3 counts, hold for 3 counts, exhale for 3 counts. Perfect for beginners or when you need something simple and easy to remember.', 
      keywords: ['simple', 'beginner', 'easy', 'basic', 'starting', 'new']
    },
    {
      name: 'Safe Place Visualization',
      description: 'Imagine a place where you feel safe, calm, and protected, using all of your senses to make it vivid.',
      example: 'Picture a quiet beach at sunset, notice the sound of waves, the colors in the sky, and the feeling of warm sand under your feet.',
      keywords: ['safe', 'safety', 'visualization', 'imagery', 'flashback', 'triggered', 'fear', 'panic', 'comfort', 'calm', 'peaceful', 'protected', 'secure']
    },
    {
      name: 'Cold Grounding',
      description: 'Use cold temperature (water, ice, cool object) to quickly shift your body out of high emotional arousal.',
      example: 'Hold an ice cube or run cool water over your wrists while taking slow breaths.',
      keywords: ['panic', 'panic attack', 'overwhelmed', 'crisis', 'reset', 'cold water', 'ice', 'cooling', 'TIPP', 'intense', 'emergency', 'losing it']
    },
    {
      name: 'Name 3 Things',
      description: 'Quickly orient yourself by naming three things you can see, hear, or feel in your present environment.',
      example: 'Say to yourself: "I see the lamp, I hear the fan, I feel the chair under me."',
      keywords: ['grounding', 'dissociation', 'disconnected', 'unreal', 'flashback', 'overwhelmed', 'quick', 'fast', 'simple', 'present', 'here', 'now']
    }
  ],
  distress_tolerance: [
    { 
      name: 'TIPP', 
      description: 'Temperature, Intense exercise, Paced breathing, Paired muscle relaxation', 
      example: 'Example: Splash cold water on your face or hold ice cubes. Do 20 jumping jacks. Practice slow breathing. Tense and release your muscles while breathing deeply.', 
      keywords: ['crisis', 'intense', 'emergency', 'overwhelming', 'panic attack', 'losing it', 'can\'t cope', 'desperate', 'urgent', 'severe']
    },
    { 
      name: 'Distract with ACCEPTS', 
      description: 'Activities, Contributing, Comparisons, Emotions, Push away, Thoughts, Sensations', 
      example: 'Example: Clean your room (Activity), text a friend support (Contributing), remember a harder time you survived (Comparisons), watch a funny video (Emotions), visualize putting worries in a box (Push away).', 
      keywords: ['urges', 'impulse', 'distraction', 'coping', 'temptation', 'craving', 'avoid', 'redirect']
    },
    { 
      name: 'Self-Soothe', 
      description: 'Use your 5 senses to comfort yourself', 
      example: 'Example: Look at photos you love, listen to calming music, pet a soft blanket, smell lavender or coffee, eat a piece of chocolate slowly.', 
      keywords: ['comfort', 'calm', 'soothe', 'relax', 'gentle', 'soft', 'peaceful', 'nurture', 'care']
    },
    {
      name: 'Radical Acceptance',
      description: 'Accept reality as it is, without judgment or resistance, to reduce additional suffering caused by fighting what you cannot change.',
      example: '"I can\'t change that this happened, but I can choose how I respond in this moment."',
      keywords: ['accept', 'acceptance', 'reality', 'unfair', 'injustice', 'stuck', 'grief', 'anger', 'trauma', 'cannot change', 'powerless', 'helpless', 'surrender', 'let go']
    },
    {
      name: 'Pros and Cons',
      description: 'Write out the pros and cons of acting on an urge versus not acting, to help you pause and make a deliberate choice.',
      example: 'List the pros and cons of sending an angry message right now versus waiting until you feel calmer.',
      keywords: ['urge', 'impulse', 'decision', 'choice', 'pause', 'crisis', 'regret', 'self-control', 'temptation', 'acting out', 'consequences']
    }
  ],
  emotion_regulation: [
    { 
      name: 'PLEASE', 
      description: 'Treat PhysicaL illness, balance Eating, avoid mood-Altering substances, balance Sleep, get Exercise', 
      example: 'Example: Take prescribed medications, eat 3 balanced meals, limit alcohol/caffeine, maintain 7-8 hours sleep schedule, take a 15-minute walk daily.', 
      keywords: ['mood', 'emotional', 'stability', 'routine', 'self-care', 'health', 'wellness', 'balance', 'lifestyle']
    },
    { 
      name: 'Opposite Action', 
      description: 'Act opposite to your emotional urge', 
      example: 'Example: If depressed and want to stay in bed → Get up and go outside. If angry and want to yell → Speak softly. If anxious and want to avoid → Approach gently.', 
      keywords: ['depression', 'depressed', 'sad', 'anger', 'angry', 'mad', 'fear', 'scared', 'afraid', 'avoidance', 'avoiding', 'isolating', 'withdrawal', 'urge']
    },
    { 
      name: 'Check the Facts', 
      description: 'Is my emotion fitting the facts?', 
      example: 'Example: "I feel like everyone hates me. Facts: My friend texted me yesterday. My coworker smiled at me. No one has said they hate me. My emotion doesn\'t fit the facts."', 
      keywords: ['thoughts', 'thinking', 'reality', 'perspective', 'rational', 'evidence', 'facts', 'assumptions', 'beliefs', 'distorted', 'catastrophizing', 'overthinking']
    },
    {
      name: 'Self-Validation',
      description: 'Notice and validate your feelings instead of judging or dismissing them.',
      example: 'Tell yourself, "It makes sense that I feel scared after what I went through."',
      keywords: ['validation', 'validate', 'shame', 'ashamed', 'guilt', 'guilty', 'misunderstood', 'dismissed', 'emotions', 'feelings', 'trauma', 'invalidated', 'judged', 'criticized', 'self-compassion']
    }
  ],
  interpersonal: [
    { 
      name: 'DEAR MAN', 
      description: 'Describe, Express, Assert, Reinforce, Mindful, Appear confident, Negotiate', 
      example: 'Example: "When you cancel plans last minute (Describe), I feel hurt (Express). I need advance notice (Assert). This will help our friendship (Reinforce). Can we agree on 24 hours notice? (Negotiate)"', 
      keywords: ['communication', 'boundaries', 'conflict', 'assertive', 'needs', 'relationship', 'conversation', 'difficult', 'confrontation']
    },
    { 
      name: 'GIVE', 
      description: 'Gentle, Interested, Validate, Easy manner', 
      example: 'Example: Use a calm tone (Gentle), ask "How are you feeling?" (Interested), say "That makes sense" (Validate), smile and stay relaxed (Easy manner).', 
      keywords: ['relationships', 'connection', 'empathy', 'social', 'listening', 'support', 'kindness', 'understanding']
    }
  ],
  mindfulness: [
    { 
      name: 'Observe', 
      description: 'Notice thoughts and feelings without judgment', 
      example: 'Example: "I notice I\'m having the thought that I\'m not good enough. I notice tension in my chest. I\'m observing these without judging them as good or bad."', 
      keywords: ['awareness', 'present', 'mindful', 'observe', 'notice', 'watching', 'witnessing', 'non-judgmental']
    },
    { 
      name: 'Describe', 
      description: 'Put words to your experience', 
      example: 'Example: "My heart is racing. My palms are sweaty. I\'m thinking about the meeting. I feel nervous." Just describe what is, not what it means.', 
      keywords: ['thoughts', 'feelings', 'awareness', 'verbal', 'naming', 'labeling', 'articulate', 'express']
    },
    { 
      name: 'Participate', 
      description: 'Throw yourself into the activity', 
      example: 'Example: When washing dishes, feel the warm water, notice the soap bubbles, hear the water running. Be fully present in just that moment and activity.', 
      keywords: ['engagement', 'flow', 'present', 'activity', 'immersed', 'absorbed', 'focused', 'involved']
    },
    {
      name: 'Half-Smile and Willing Hands',
      description: 'Use gentle posture shifts (half-smile and open palms) to send a signal of safety to your nervous system.',
      example: 'Relax your face into a soft half-smile and rest your hands open on your lap with palms up.',
      keywords: ['tension', 'tense', 'angry', 'tight', 'fight', 'stress', 'nervous system', 'posture', 'calming', 'body', 'physical', 'relaxation']
    }
  ],
  cognitive: [
    { 
      name: 'Thought Record', 
      description: 'Identify situation, mood, thoughts, evidence for/against', 
      example: 'Example: Situation: Friend didn\'t text back. Mood: Sad. Thought: "They hate me." Evidence for: None. Evidence against: They\'re usually busy at work. Alternative: "They\'re probably just busy."', 
      keywords: ['negative thoughts', 'cognitive', 'thinking', 'beliefs', 'assumptions', 'distorted', 'catastrophizing', 'rumination', 'overthinking', 'worry', 'anxious thoughts']
    },
    { 
      name: 'Behavioral Activation', 
      description: 'Schedule pleasant activities', 
      example: 'Example: Monday 10am - coffee at favorite café. Tuesday 6pm - call a friend. Wednesday 7pm - watch favorite show. Thursday 5pm - take a walk in the park.', 
      keywords: ['depression', 'depressed', 'sad', 'motivation', 'activity', 'mood', 'withdrawal', 'isolating', 'avoidance', 'inertia', 'stuck']
    },
    { 
      name: 'Exposure', 
      description: 'Gradually face feared situations', 
      example: 'Example: Fear of crowds: Week 1 - walk past a store. Week 2 - enter store for 5 min. Week 3 - stay 15 min. Week 4 - go during busy time. Gradually increase difficulty.', 
      keywords: ['avoidance', 'avoiding', 'fear', 'scared', 'afraid', 'phobia', 'anxiety', 'anxious', 'confronting', 'facing', 'gradual']
    }
  ]
};

// Enhanced suggestion algorithm with synonym mapping and weighted scoring
export function suggestTechniques(userInput) {
  if (!userInput || typeof userInput !== 'string') return [];
  
  // Normalize input
  const input = userInput.toLowerCase().trim();
  
  // Apply synonym mapping
  let normalizedInput = input;
  Object.entries(SYNONYM_MAP).forEach(([phrase, replacement]) => {
    if (normalizedInput.includes(phrase)) {
      normalizedInput += ' ' + replacement; // Add synonym to expand matching
    }
  });
  
  // Check for high-intensity phrases
  const hasHighIntensity = HIGH_INTENSITY_PHRASES.some(phrase => 
    input.includes(phrase)
  );
  
  const suggestions = [];
  
  Object.entries(dbtCbtTechniques).forEach(([category, techniques]) => {
    techniques.forEach(technique => {
      let score = 0;
      
      // Count keyword matches
      technique.keywords.forEach(keyword => {
        if (normalizedInput.includes(keyword.toLowerCase())) {
          score += 1;
          
          // Bonus for exact multi-word phrase matches
          if (keyword.includes(' ') && input.includes(keyword)) {
            score += 2;
          }
        }
      });
      
      // Apply high-intensity boost for grounding and distress tolerance
      if (hasHighIntensity && (category === 'grounding' || category === 'distress_tolerance')) {
        score *= 1.5;
      }
      
      if (score > 0) {
        suggestions.push({ ...technique, category, score });
      }
    });
  });
  
  // Sort by score (descending) and return top 3
  return suggestions
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
