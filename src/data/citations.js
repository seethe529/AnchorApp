// Medical and therapeutic technique citations
// Required by Apple App Store Guideline 1.4.1

export const citations = {
  dbt: {
    title: "Dialectical Behavior Therapy (DBT)",
    author: "Linehan, M. M.",
    year: "1993",
    source: "Cognitive-Behavioral Treatment of Borderline Personality Disorder",
    publisher: "Guilford Press",
    url: "https://behavioraltech.org/resources/faqs/dialectical-behavior-therapy-dbt/",
    description: "DBT is an evidence-based psychotherapy developed by Dr. Marsha Linehan for treating emotional dysregulation and has been validated for PTSD treatment."
  },
  cbt: {
    title: "Cognitive Behavioral Therapy (CBT)",
    author: "Beck, A. T.",
    year: "1979",
    source: "Cognitive Therapy and the Emotional Disorders",
    publisher: "Penguin Books",
    url: "https://www.apa.org/ptsd-guideline/treatments/cognitive-behavioral-therapy",
    description: "CBT is a well-established, evidence-based treatment for PTSD recommended by the American Psychological Association."
  },
  grounding: {
    title: "Grounding Techniques for PTSD",
    source: "U.S. Department of Veterans Affairs - National Center for PTSD",
    url: "https://www.ptsd.va.gov/understand/common/common_adults.asp",
    description: "Grounding techniques help manage flashbacks, dissociation, and overwhelming emotions in PTSD."
  },
  breathing: {
    title: "Controlled Breathing Techniques",
    source: "American Psychological Association",
    url: "https://www.apa.org/topics/stress/tips",
    description: "Controlled breathing activates the parasympathetic nervous system, reducing stress and anxiety."
  },
  pmr: {
    title: "Progressive Muscle Relaxation",
    author: "Jacobson, E.",
    year: "1938",
    source: "Progressive Relaxation",
    publisher: "University of Chicago Press",
    url: "https://www.apa.org/topics/stress/tips",
    description: "PMR is a systematic technique for achieving deep relaxation by tensing and releasing muscle groups."
  },
  tipp: {
    title: "TIPP Skills (DBT Distress Tolerance)",
    author: "Linehan, M. M.",
    source: "DBT Skills Training Manual",
    publisher: "Guilford Press",
    url: "https://behavioraltech.org/resources/faqs/dialectical-behavior-therapy-dbt/",
    description: "TIPP is a DBT crisis survival skill for rapidly reducing intense emotional arousal."
  },
  accepts: {
    title: "ACCEPTS (DBT Distraction Skills)",
    author: "Linehan, M. M.",
    source: "DBT Skills Training Manual",
    publisher: "Guilford Press",
    url: "https://behavioraltech.org/resources/faqs/dialectical-behavior-therapy-dbt/",
    description: "ACCEPTS is a DBT acronym for distraction techniques to manage distressing situations."
  },
  please: {
    title: "PLEASE Skills (DBT Emotion Regulation)",
    author: "Linehan, M. M.",
    source: "DBT Skills Training Manual",
    publisher: "Guilford Press",
    url: "https://behavioraltech.org/resources/faqs/dialectical-behavior-therapy-dbt/",
    description: "PLEASE skills focus on physical health to reduce emotional vulnerability."
  },
  oppositeAction: {
    title: "Opposite Action (DBT Emotion Regulation)",
    author: "Linehan, M. M.",
    source: "DBT Skills Training Manual",
    publisher: "Guilford Press",
    url: "https://behavioraltech.org/resources/faqs/dialectical-behavior-therapy-dbt/",
    description: "Opposite Action involves acting opposite to emotion-driven urges to change emotional responses."
  },
  dearman: {
    title: "DEAR MAN (DBT Interpersonal Effectiveness)",
    author: "Linehan, M. M.",
    source: "DBT Skills Training Manual",
    publisher: "Guilford Press",
    url: "https://behavioraltech.org/resources/faqs/dialectical-behavior-therapy-dbt/",
    description: "DEAR MAN is a DBT skill for assertive communication and getting needs met effectively."
  },
  mindfulness: {
    title: "Mindfulness-Based Interventions for PTSD",
    source: "National Center for Complementary and Integrative Health",
    url: "https://www.nccih.nih.gov/health/meditation-and-mindfulness-what-you-need-to-know",
    description: "Mindfulness practices have shown effectiveness in reducing PTSD symptoms and improving emotional regulation."
  },
  thoughtRecord: {
    title: "Cognitive Restructuring and Thought Records",
    author: "Beck, A. T.",
    source: "Cognitive Therapy: Basics and Beyond",
    publisher: "Guilford Press",
    url: "https://www.apa.org/ptsd-guideline/treatments/cognitive-behavioral-therapy",
    description: "Thought records help identify and challenge negative automatic thoughts, a core CBT technique."
  },
  behavioralActivation: {
    title: "Behavioral Activation for Depression",
    source: "American Psychological Association",
    url: "https://www.apa.org/ptsd-guideline/treatments/cognitive-behavioral-therapy",
    description: "Behavioral activation increases engagement in rewarding activities to improve mood and reduce depression."
  },
  exposure: {
    title: "Prolonged Exposure Therapy for PTSD",
    source: "U.S. Department of Veterans Affairs - National Center for PTSD",
    url: "https://www.ptsd.va.gov/understand_tx/tx_basics.asp",
    description: "Gradual exposure to trauma-related memories and situations is an evidence-based PTSD treatment."
  }
};

export const generalResources = [
  {
    title: "National Center for PTSD",
    organization: "U.S. Department of Veterans Affairs",
    url: "https://www.ptsd.va.gov/",
    description: "Comprehensive PTSD information, research, and treatment resources"
  },
  {
    title: "APA Clinical Practice Guideline for PTSD",
    organization: "American Psychological Association",
    url: "https://www.apa.org/ptsd-guideline",
    description: "Evidence-based treatment recommendations for PTSD"
  },
  {
    title: "Behavioral Tech (DBT Resources)",
    organization: "Linehan Institute",
    url: "https://behavioraltech.org/",
    description: "Official DBT training and resources from Dr. Marsha Linehan's organization"
  },
  {
    title: "SAMHSA National Helpline",
    organization: "Substance Abuse and Mental Health Services Administration",
    url: "https://www.samhsa.gov/find-help/national-helpline",
    phone: "1-800-662-4357",
    description: "Free, confidential, 24/7 treatment referral and information service"
  }
];

export const disclaimer = {
  title: "Medical Disclaimer",
  content: "The techniques and information provided in this app are based on evidence-based therapeutic approaches (DBT and CBT) and are intended for educational and self-help purposes only. This app is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified health providers with questions regarding medical conditions. If you are experiencing a mental health crisis, contact emergency services immediately.",
  lastUpdated: "January 2025"
};

// Get citation for a specific technique
export function getCitationForTechnique(techniqueName) {
  const citationMap = {
    '5-4-3-2-1 Technique': citations.grounding,
    'Box Breathing': citations.breathing,
    'Progressive Muscle Relaxation': citations.pmr,
    'TIPP': citations.tipp,
    'Distract with ACCEPTS': citations.accepts,
    'Self-Soothe': citations.dbt,
    'PLEASE': citations.please,
    'Opposite Action': citations.oppositeAction,
    'Check the Facts': citations.cbt,
    'DEAR MAN': citations.dearman,
    'GIVE': citations.dearman,
    'Observe': citations.mindfulness,
    'Describe': citations.mindfulness,
    'Participate': citations.mindfulness,
    'Thought Record': citations.thoughtRecord,
    'Behavioral Activation': citations.behavioralActivation,
    'Exposure': citations.exposure
  };
  
  return citationMap[techniqueName] || citations.dbt;
}

// Format citation in APA style
export function formatCitation(citation) {
  if (citation.author && citation.year) {
    return `${citation.author} (${citation.year}). ${citation.title}. ${citation.publisher}.`;
  }
  return `${citation.title}. ${citation.source}.`;
}
