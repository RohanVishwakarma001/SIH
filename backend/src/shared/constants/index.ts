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
  // SOCRATES Probing Questions (Adaptive Branching for Acute Symptoms)
  {
    code: 'q_socrates_character',
    stepNumber: 8,
    category: 'socrates_probing',
    questionText: 'SOCRATES: What is the exact character of the pain or discomfort? / दर्द का स्वरूप कैसा है?',
    inputType: 'single_choice',
    options: [
      { id: 'char_crushing', label: 'Crushing pressure / Heaviness (जैसे छाती पर भारी बोझ)', isRedFlag: true },
      { id: 'char_burning', label: 'Burning / Hot acidity (जलन जैसा महसूस होना)' },
      { id: 'char_sharp', label: 'Sharp / Stabbing / Pleuritic (तेज चुभने वाला दर्द)' },
      { id: 'char_dull', label: 'Dull continuous ache (हल्का लगातार मीठा दर्द)' }
    ]
  },
  {
    code: 'q_socrates_radiation',
    stepNumber: 9,
    category: 'socrates_probing',
    questionText: 'SOCRATES: Does the pain radiate or travel anywhere else? / क्या दर्द कहीं और फैल रहा है?',
    inputType: 'single_choice',
    options: [
      { id: 'rad_arm_jaw', label: 'Radiating to left arm, neck, or jaw (बाएं हाथ या जबड़े तक)', isRedFlag: true },
      { id: 'rad_back', label: 'Radiating through to the upper back / scapula (पीठ के पीछे)' },
      { id: 'rad_epigastric', label: 'Spreading downward into upper abdomen (पेट की तरफ)' },
      { id: 'rad_localized', label: 'Strictly localized, does not spread (सिर्फ एक जगह पर स्थिर)' }
    ]
  },
  {
    code: 'q_socrates_timing_relieving',
    stepNumber: 10,
    category: 'socrates_probing',
    questionText: 'SOCRATES: What makes the pain worse or better? / दर्द किस स्थिति में बढ़ता या घटता है?',
    inputType: 'single_choice',
    options: [
      { id: 'rel_worse_exertion', label: 'Worse with walking/climbing, better with rest (चलने पर बढ़ता है, आराम से घटता है)', isRedFlag: true },
      { id: 'rel_worse_breathing', label: 'Worse on deep breathing or coughing (गहरी सांस लेने पर बढ़ता है)' },
      { id: 'rel_worse_meals', label: 'Worse after spicy food, better with antacids (भोजन के बाद बढ़ता है)' },
      { id: 'rel_constant', label: 'Constant intensity regardless of position (लगातार एक जैसा रहता है)' }
    ]
  },
  // Full AYUSH Dashavidha Pariksha (10 Dimensions) & Ahara-Vihara
  {
    code: 'ayush_prakriti',
    stepNumber: 11,
    category: 'ayush_pariksha',
    questionText: 'Dashavidha Pariksha 1 (Prakriti): What is your constitutional dosha? / शारीरिक प्रकृति (दोष प्रधानता)',
    inputType: 'single_choice',
    isAyush: true,
    ayushDimension: 'Prakriti',
    options: [
      { id: 'prakriti_vata', label: 'Vata Predominant (Slender build, quick, dry skin, cold intolerant)' },
      { id: 'prakriti_pitta', label: 'Pitta Predominant (Medium build, sharp hunger, heat intolerant)' },
      { id: 'prakriti_kapha', label: 'Kapha Predominant (Broad solid build, calm, oily skin, high stamina)' },
      { id: 'prakriti_vatapitta', label: 'Vata-Pitta Dvandvaja (Dryness, acidity, variable digestion)' }
    ]
  },
  {
    code: 'ayush_vikriti',
    stepNumber: 12,
    category: 'ayush_pariksha',
    questionText: 'Dashavidha Pariksha 2 (Vikriti): Current Dosha Imbalance / वर्तमान दोष असंतुलन (विकृति)',
    inputType: 'single_choice',
    isAyush: true,
    ayushDimension: 'Vikriti',
    options: [
      { id: 'vikriti_vata', label: 'Vata Prakopa (Stiffness, joint pains, anxiety, constipation)' },
      { id: 'vikriti_pitta', label: 'Pitta Prakopa (Acidity, burning, skin eruptions, irritability)' },
      { id: 'vikriti_kapha', label: 'Kapha Prakopa (Heaviness, excessive mucus, lethargy, congestion)' },
      { id: 'vikriti_sannipata', label: 'Sannipataja / Tridosha mixed morbidity' }
    ]
  },
  {
    code: 'ayush_ahara_agni',
    stepNumber: 13,
    category: 'ayush_pariksha',
    questionText: 'Dashavidha Pariksha 3 & 4 (Ahara Shakti & Agni): Digestive Fire & Capacity / पाचन शक्ति एवं जठराग्नि',
    inputType: 'single_choice',
    isAyush: true,
    ayushDimension: 'Ahara Shakti',
    options: [
      { id: 'agni_mandagni', label: 'Mandagni (Sluggish, slow metabolism, heavy fullness after light meals)' },
      { id: 'agni_tikshnagni', label: 'Tikshnagni (Hyperactive, sour reflux, ravenous hunger)' },
      { id: 'agni_vishamagni', label: 'Vishamagni (Irregular, fluctuating appetite, bloating alternating with cramps)' },
      { id: 'agni_samagni', label: 'Samagni (Balanced, healthy digestion, energetic post-meals)' }
    ]
  },
  {
    code: 'ayush_satva',
    stepNumber: 14,
    category: 'ayush_pariksha',
    questionText: 'Dashavidha Pariksha 5 (Satva): Mental Fortitude & Resilience / सत्व परीक्षा (मानसिक बल)',
    inputType: 'single_choice',
    isAyush: true,
    ayushDimension: 'Satva',
    options: [
      { id: 'satva_pravara', label: 'Pravara Satva (Superior: calm under distress, highly patient)' },
      { id: 'satva_madhyama', label: 'Madhyama Satva (Moderate: copes with support, occasional anxiety)' },
      { id: 'satva_avara', label: 'Avara Satva (Sensitive: easily overwhelmed, fearful, nervous)' }
    ]
  },
  {
    code: 'ayush_vyayama_bala',
    stepNumber: 15,
    category: 'ayush_pariksha',
    questionText: 'Dashavidha Pariksha 6 (Vyayama Shakti): Physical Endurance & Bala / व्यायाम शक्ति एवं शारीरिक बल',
    inputType: 'single_choice',
    isAyush: true,
    ayushDimension: 'Vyayama Shakti',
    options: [
      { id: 'vyayama_uttama', label: 'Uttama Bala (High endurance, can perform strenuous exertion)' },
      { id: 'vyayama_madhyama', label: 'Madhyama Bala (Moderate endurance, comfortable with routine activity)' },
      { id: 'vyayama_heena', label: 'Heena Bala (Low stamina, fatigues very quickly on mild effort)' }
    ]
  },
  {
    code: 'ayush_sara_samhanana',
    stepNumber: 16,
    category: 'ayush_pariksha',
    questionText: 'Dashavidha Pariksha 7 & 8 (Sara & Samhanana): Tissue Essence & Body Compactness / सार एवं संहनन परीक्षा',
    inputType: 'single_choice',
    isAyush: true,
    ayushDimension: 'Sara & Samhanana',
    options: [
      { id: 'sara_pravara', label: 'Pravara Sara & Susamhanana (Well-knit compact joints, strong bones/muscles)' },
      { id: 'sara_madhyama', label: 'Madhyama Sara & Samhanana (Moderate compact build, average musculature)' },
      { id: 'sara_avara', label: 'Avara Sara & Asamhanana (Loose joints, delicate skeletal frame)' }
    ]
  },
  {
    code: 'ayush_satmya_vaya',
    stepNumber: 17,
    category: 'ayush_pariksha',
    questionText: 'Dashavidha Pariksha 9 & 10 (Satmya & Vaya): Adaptability & Life Stage / सात्म्य एवं वय परीक्षा',
    inputType: 'single_choice',
    isAyush: true,
    ayushDimension: 'Satmya & Vaya',
    options: [
      { id: 'satmya_sarva', label: 'Sarva-Rasa Satmya (Adapts well to diverse foods & seasons, Madhyama Vaya)' },
      { id: 'satmya_madhyama', label: 'Vyayam/Habit Dependent Satmya (Occasional food intolerances, Madhyama Vaya)' },
      { id: 'satmya_eka', label: 'Eka-Rasa Satmya / Vriddha Vaya (Rigid food tolerance, elderly/sensitive stage)' }
    ]
  },
  {
    code: 'ayush_ahara_vihara',
    stepNumber: 18,
    category: 'ayush_pariksha',
    questionText: 'Ahara-Vihara & Nidana: Daily Regimen & Lifestyle Factors / आहार-विहार एवं हेतु (निदान)',
    inputType: 'multi_choice',
    isAyush: true,
    ayushDimension: 'Ahara-Vihara',
    options: [
      { id: 'vihara_ratrijagarana', label: 'Ratrijagarana (Late night waking / irregular sleep schedule)' },
      { id: 'ahara_viruddha', label: 'Viruddha Ahara / Adhyashana (Eating incompatible foods or overeating)' },
      { id: 'vihara_divasvapna', label: 'Divasvapna (Daytime sleeping immediately after meals)' },
      { id: 'vihara_manasika', label: 'Chinta & Shoka (Chronic psychological stress / mental strain)' },
      { id: 'vihara_swastha', label: 'Healthy Dinacharya (Timely meals, balanced sleep, daily exercise)' }
    ]
  }
];
