export const SUPPORTED_LANGUAGES = ['en', 'hi', 'mr', 'ta', 'te', 'bn'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

export const DEPARTMENTS = [
  { id: 'general', name: 'General Medicine', nativeName: 'सामान्य चिकित्सा', icon: 'Stethoscope', avgWaitMins: 14 },
  { id: 'cardiology', name: 'Cardiology', nativeName: 'हृदय रोग विभाग', icon: 'HeartPulse', avgWaitMins: 18 },
  { id: 'orthopedics', name: 'Orthopedics', nativeName: 'हड्डी एवं जोड़ रोग', icon: 'Bone', avgWaitMins: 12 },
  { id: 'ayush', name: 'AYUSH / Ayurveda', nativeName: 'आयुष एवं आयुर्वेद', icon: 'Leaf', avgWaitMins: 10 },
  { id: 'pediatrics', name: 'Pediatrics', nativeName: 'बाल रोग विभाग', icon: 'Baby', avgWaitMins: 15 },
  { id: 'ent', name: 'Ear, Nose & Throat', nativeName: 'ईएनटी (कान, नाक, गला)', icon: 'Headphones', avgWaitMins: 11 },
];

export const ADMIN_METRICS = {
  patientsToday: 342,
  historiesCompletedKiosk: 316,
  completionRatePct: 92.4,
  avgIntakeTimeMinutes: 3.4,
  traditionalIntakeMinutes: 14.8,
  timeSavedMinutesPerPatient: 11.4,
  urgentRedFlagsIntercepted: 18,
  documentsOcrProcessed: 189,
  ocrAccuracyRatePct: 97.6,
};

export const CLINICAL_QUESTIONS_SEED = [
  {
    code: 'q_chief_complaint',
    stepNumber: 1,
    category: 'chief_complaint',
    questionText: 'What is the main problem bringing you to the hospital today? / आज आप किस मुख्य परेशानी के लिए अस्पताल आए हैं?',
    inputType: 'single_choice',
    options: [
      { id: 'chest_pain', label: 'Chest Pain or Heaviness / सीने में दर्द', isRedFlag: true },
      { id: 'fever_bodyache', label: 'Fever and Chills / बुखार एवं शरीर दर्द' },
      { id: 'cough_breathless', label: 'Severe Breathlessness / सांस लेने में तकलीफ', isRedFlag: true },
      { id: 'stomach_pain', label: 'Stomach Pain / उल्टी या पेट दर्द' },
      { id: 'joint_pain', label: 'Joint / Back Pain / जोड़ों या कमर का दर्द' },
      { id: 'chronic_followup', label: 'Routine BP / Diabetes Follow-up' }
    ]
  },
  {
    code: 'q_location',
    stepNumber: 2,
    category: 'duration_severity',
    questionText: 'Where is the discomfort located, and does it spread anywhere? / दर्द शरीर के किस हिस्से में है?',
    inputType: 'single_choice',
    options: [
      { id: 'loc_chest_arm', label: 'Chest radiating to left arm or jaw', isRedFlag: true },
      { id: 'loc_head_temple', label: 'Head / Forehead / Temples' },
      { id: 'loc_upper_abdomen', label: 'Upper abdomen below ribs' },
      { id: 'loc_knees', label: 'Both knees / Lower back' },
      { id: 'loc_generalized', label: 'Whole body aches / General weakness' }
    ]
  },
  {
    code: 'q_duration',
    stepNumber: 3,
    category: 'duration_severity',
    questionText: 'How long have you had this issue, and how suddenly did it start? / यह तकलीफ कितने समय से है?',
    inputType: 'single_choice',
    options: [
      { id: 'dur_acute_hours', label: 'Started suddenly within last 24 hours', isRedFlag: true },
      { id: 'dur_few_days', label: 'Last 2 to 7 days' },
      { id: 'dur_weeks', label: '1 to 4 weeks' },
      { id: 'dur_months', label: 'Long term (More than 1 month)' }
    ]
  },
  {
    code: 'q_severity',
    stepNumber: 4,
    category: 'duration_severity',
    questionText: 'How severe is the discomfort on a scale of 1 to 10? / 1 से 10 के पैमाने पर आपकी तकलीफ कितनी गंभीर है?',
    inputType: 'scale',
    options: [
      { id: 'sev_mild', label: 'Mild (1 - 3)' },
      { id: 'sev_moderate', label: 'Moderate (4 - 6)' },
      { id: 'sev_severe', label: 'Severe (7 - 8)' },
      { id: 'sev_extreme', label: 'Crushing / Unbearable (9 - 10)', isRedFlag: true }
    ]
  },
  {
    code: 'q_redflags_associated',
    stepNumber: 5,
    category: 'associated_symptoms',
    questionText: 'Are you experiencing any of these critical warning symptoms? / क्या आपको कोई गंभीर चेतावनी लक्षण हैं?',
    inputType: 'multi_choice',
    options: [
      { id: 'rf_sweating', label: 'Cold Profuse Sweating / Diaphoresis', isRedFlag: true },
      { id: 'rf_breathless', label: 'Severe Shortness of Breath while resting', isRedFlag: true },
      { id: 'rf_dizziness', label: 'Dizziness or Near-Fainting', isRedFlag: true },
      { id: 'rf_vomiting', label: 'Nausea or Vomiting' },
      { id: 'rf_none', label: 'None of the above critical signs' }
    ]
  },
  {
    code: 'q_past_conditions',
    stepNumber: 6,
    category: 'past_history',
    questionText: 'Do you have any known medical conditions diagnosed earlier? / क्या पहले से कोई पुरानी बीमारी है?',
    inputType: 'multi_choice',
    options: [
      { id: 'pmh_htn', label: 'High Blood Pressure (Hypertension)' },
      { id: 'pmh_dm', label: 'Diabetes (High Blood Sugar)' },
      { id: 'pmh_cad', label: 'Previous Heart Disease / Stent' },
      { id: 'pmh_asthma', label: 'Asthma / Breathing issue' },
      { id: 'pmh_thyroid', label: 'Thyroid disorder' },
      { id: 'pmh_none', label: 'No prior diagnosed illnesses' }
    ]
  },
  {
    code: 'q_allergies_meds',
    stepNumber: 7,
    category: 'medications',
    questionText: 'Do you take daily medicines or have severe drug allergies? / क्या कोई दैनिक दवाई लेते हैं अथवा एलर्जी है?',
    inputType: 'single_choice',
    options: [
      { id: 'med_taking_regular', label: 'Yes, I take daily medicines regularly' },
      { id: 'med_allergy_penicillin', label: 'Known allergy to Penicillin / Sulfa drugs' },
      { id: 'med_no_daily', label: 'No daily medications & no known drug allergies' }
    ]
  },
  // AYUSH Specific Questions (Dashavidha Pariksha)
  {
    code: 'ayush_prakriti',
    stepNumber: 8,
    category: 'ayush_pariksha',
    questionText: 'Dashavidha Pariksha: What is your primary bodily constitution (Prakriti)? / शारीरिक प्रकृति (दोष)',
    inputType: 'single_choice',
    isAyush: true,
    ayushDimension: 'Prakriti',
    options: [
      { id: 'prakriti_vata', label: 'Vata Predominant (Slender, quick, dry skin)' },
      { id: 'prakriti_pitta', label: 'Pitta Predominant (Medium, sharp appetite, heat-intolerant)' },
      { id: 'prakriti_kapha', label: 'Kapha Predominant (Solid, calm, oily skin)' },
      { id: 'prakriti_vatapitta', label: 'Vata-Pitta Dvandvaja' }
    ]
  },
  {
    code: 'ayush_ahara_agni',
    stepNumber: 9,
    category: 'ayush_pariksha',
    questionText: 'Ahara Shakti & Agni: How would you describe your digestive fire? / पाचन शक्ति एवं जठराग्नि',
    inputType: 'single_choice',
    isAyush: true,
    ayushDimension: 'Ahara Shakti',
    options: [
      { id: 'agni_mandagni', label: 'Mandagni (Sluggish / Heavy / Slow)' },
      { id: 'agni_tikshnagni', label: 'Tikshnagni (Hyperactive / Acidic / Sharp)' },
      { id: 'agni_vishamagni', label: 'Vishamagni (Irregular / Variable)' },
      { id: 'agni_samagni', label: 'Samagni (Balanced & Energetic)' }
    ]
  }
];
