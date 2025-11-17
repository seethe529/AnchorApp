export const breathingMethods = [
  {
    id: 'box',
    name: 'Box Breathing',
    subtitle: 'Anxiety & Panic Relief',
    description: 'Equal breathing pattern that calms the nervous system. Used by Navy SEALs for stress management.',
    pattern: [
      { phase: 'Breathe In', duration: 4, instruction: 'Inhale slowly through your nose' },
      { phase: 'Hold', duration: 4, instruction: 'Hold your breath gently' },
      { phase: 'Breathe Out', duration: 4, instruction: 'Exhale slowly through your mouth' },
      { phase: 'Hold', duration: 4, instruction: 'Hold your breath gently' }
    ],
    totalCycleDuration: 16,
    color: '#2E8B57',
    icon: 'square-outline'
  },
  {
    id: '478',
    name: '4-7-8 Breathing',
    subtitle: 'Deep Relaxation & Sleep',
    description: 'Developed by Dr. Andrew Weil. Activates the parasympathetic nervous system for deep relaxation.',
    pattern: [
      { phase: 'Breathe In', duration: 4, instruction: 'Inhale quietly through your nose' },
      { phase: 'Hold', duration: 7, instruction: 'Hold your breath' },
      { phase: 'Breathe Out', duration: 8, instruction: 'Exhale completely through your mouth' }
    ],
    totalCycleDuration: 19,
    color: '#4A90E2',
    icon: 'moon-outline'
  },
  {
    id: 'resonant',
    name: 'Resonant Breathing',
    subtitle: 'Calm & Balance',
    description: 'Breathing at 5-6 breaths per minute optimizes heart rate variability and promotes emotional balance.',
    pattern: [
      { phase: 'Breathe In', duration: 5, instruction: 'Inhale slowly and deeply' },
      { phase: 'Breathe Out', duration: 5, instruction: 'Exhale slowly and completely' }
    ],
    totalCycleDuration: 10,
    color: '#9B59B6',
    icon: 'heart-outline'
  },
  {
    id: 'physiological',
    name: 'Physiological Sigh',
    subtitle: 'Quick Stress Reset',
    description: 'Two quick inhales followed by a long exhale. Rapidly reduces stress and anxiety in real-time.',
    pattern: [
      { phase: 'Breathe In', duration: 2, instruction: 'Quick inhale through nose' },
      { phase: 'Breathe In', duration: 2, instruction: 'Another quick inhale' },
      { phase: 'Breathe Out', duration: 6, instruction: 'Long, slow exhale' }
    ],
    totalCycleDuration: 10,
    color: '#E74C3C',
    icon: 'flash-outline'
  },
  {
    id: 'triangle',
    name: 'Triangle Breathing',
    subtitle: 'Simple & Beginner-Friendly',
    description: 'Easy three-part breathing pattern. Perfect for beginners or when you need something simple.',
    pattern: [
      { phase: 'Breathe In', duration: 3, instruction: 'Inhale through your nose' },
      { phase: 'Hold', duration: 3, instruction: 'Hold gently' },
      { phase: 'Breathe Out', duration: 3, instruction: 'Exhale through your mouth' }
    ],
    totalCycleDuration: 9,
    color: '#F39C12',
    icon: 'triangle-outline'
  }
];
