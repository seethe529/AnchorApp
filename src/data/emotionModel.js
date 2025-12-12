export const EmotionModel = [
  {
    primary: "Activated / Protective",
    emoji: "😡",
    secondary: [
      {
        name: "Hurt",
        tertiary: [
          "Feeling exposed",
          "Emotionally overwhelmed"
        ]
      },
      {
        name: "Protective / Overwhelmed",
        tertiary: [
          "Emotionally flooded",
          "Guarded"
        ]
      },
      {
        name: "Irritated",
        tertiary: [
          "Agitated",
          "Tense"
        ]
      },
      {
        name: "Overpowered",
        tertiary: [
          "Losing internal control",
          "Highly activated"
        ]
      },
      {
        name: "Misunderstood",
        tertiary: [
          "Disconnected",
          "Pushed away"
        ]
      },
      {
        name: "Self-Critical",
        tertiary: [
          "Doubting myself",
          "Feeling not good enough"
        ]
      }
    ]
  },

  {
    primary: "Fearful / Unsafe / Alerted",
    emoji: "😨",
    secondary: [
      {
        name: "Helpless",
        tertiary: [
          "Needing support",
          "Not sure what to do next"
        ]
      },
      {
        name: "Confused",
        tertiary: [
          "Emotionally unsure",
          "Conflicted internally"
        ]
      },
      {
        name: "Unseen",
        tertiary: [
          "Left out",
          "Overlooked"
        ]
      },
      {
        name: "Shut Down / Collapsed",
        tertiary: [
          "Withdrawn",
          "Feeling small"
        ]
      },
      {
        name: "Self-Doubt",
        tertiary: [
          "Second-guessing myself",
          "Feeling exposed"
        ]
      },
      {
        name: "Anxious",
        tertiary: [
          "Restless",
          "On edge"
        ]
      }
    ]
  },

  {
    primary: "Joy / Positive Activation",
    emoji: "😊",
    secondary: [
      {
        name: "Excited",
        tertiary: [
          "Energized",
          "Motivated"
        ]
      },
      {
        name: "Confident / Attractive",
        tertiary: [
          "Expressive",
          "Feeling good in my body"
        ]
      },
      {
        name: "Energetic",
        tertiary: [
          "Inspired",
          "Focused"
        ]
      },
      {
        name: "Playful",
        tertiary: [
          "Lighthearted",
          "Open to fun"
        ]
      },
      {
        name: "Creative",
        tertiary: [
          "Expressive",
          "Innovative"
        ]
      },
      {
        name: "Aware",
        tertiary: [
          "Appreciative",
          "Reflective"
        ]
      }
    ]
  },

  {
    primary: "Empowered / Capable",
    emoji: "💪",
    secondary: [
      {
        name: "Proud",
        tertiary: [
          "Accomplished",
          "Growing"
        ]
      },
      {
        name: "Respected",
        tertiary: [
          "Seen for who I am",
          "Valued"
        ]
      },
      {
        name: "Appreciated",
        tertiary: [
          "Accepted",
          "Acknowledged"
        ]
      },
      {
        name: "Purposeful",
        tertiary: [
          "Meaningful",
          "Significant to others"
        ]
      },
      {
        name: "Hopeful",
        tertiary: [
          "Optimistic",
          "Encouraged"
        ]
      },
      {
        name: "Committed / Connected",
        tertiary: [
          "Dedicated",
          "Reliable"
        ]
      }
    ]
  },

  {
    primary: "Calm / Grounded / Connected",
    emoji: "😌",
    secondary: [
      {
        name: "Loving",
        tertiary: [
          "Affectionate",
          "Caring"
        ]
      },
      {
        name: "Trusting",
        tertiary: [
          "Open",
          "Secure"
        ]
      },
      {
        name: "Nurturing",
        tertiary: [
          "Supportive",
          "Encouraging"
        ]
      },
      {
        name: "Thankful",
        tertiary: [
          "Grateful",
          "Appreciative"
        ]
      },
      {
        name: "Emotionally Close",
        tertiary: [
          "Connected",
          "Warm"
        ]
      },
      {
        name: "Thoughtful",
        tertiary: [
          "Mindful",
          "Reflective"
        ]
      }
    ]
  },

  {
    primary: "Low / Heavy / Withdrawn",
    emoji: "😢",
    secondary: [
      {
        name: "Lonely",
        tertiary: [
          "Isolated",
          "Disconnected"
        ]
      },
      {
        name: "Low / Depleted",
        tertiary: [
          "Emotionally drained",
          "Heavy"
        ]
      },
      {
        name: "Regretful",
        tertiary: [
          "Reflective about choices",
          "Wanting repair"
        ]
      },
      {
        name: "Self-Conscious",
        tertiary: [
          "Feeling not enough",
          "Feeling exposed"
        ]
      },
      {
        name: "Understimulated",
        tertiary: [
          "Disengaged",
          "Distant"
        ]
      },
      {
        name: "Fatigued",
        tertiary: [
          "Low energy",
          "Unmotivated"
        ]
      }
    ]
  }
];

// Map primary emotions to valence for graphing
export const getEmotionValence = (primaryEmotion) => {
  const valenceMap = {
    "Joy / Positive Activation": 5,
    "Empowered / Capable": 4,
    "Calm / Grounded / Connected": 4,
    "Activated / Protective": 2,
    "Fearful / Unsafe / Alerted": 2,
    "Low / Heavy / Withdrawn": 1
  };
  return valenceMap[primaryEmotion] || 3;
};
