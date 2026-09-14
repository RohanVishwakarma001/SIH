import {
  LanguageOption,
  Department,
  ClinicalQuestion
} from '../types';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    audioPrompt: 'Please tap here to proceed in English',
    description: 'Select for English audio and text guidance'
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    audioPrompt: 'हिन्दी में जारी रखने के लिए यहाँ स्पर्श करें',
    description: 'हिन्दी भाषा और आवाज़ मार्गदर्शन के लिए चुनें'
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    audioPrompt: 'मराठीत पुढे जाण्यासाठी येथे स्पर्श करा',
    description: 'मराठी भाषा आणि व्हॉईस मार्गदर्शनासाठी निवडा'
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    audioPrompt: 'தமிழில் தொடர இங்கே தட்டவும்',
    description: 'தமிழ் மொழி மற்றும் குரல் வழிகாட்டுதலுக்கு தேர்வு செய்யவும்'
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    audioPrompt: 'తెలుగులో కొనసాగడానికి ఇక్కడ నొక్కండి',
    description: 'తెలుగు భాష మరియు వాయిస్ మార్గదర్శకత్వం కోసం ఎంచుకోండి'
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    audioPrompt: 'বাংলায় এগিয়ে যাওয়ার জন্য এখানে স্পর্শ করুন',
    description: 'বাংলা ভাষা এবং ভয়েস নির্দেশিকার জন্য নির্বাচন করুন'
  }
];

export const DEPARTMENTS: Department[] = [
  {
    id: 'general',
    name: 'General Medicine',
    nativeName: 'सामान्य चिकित्सा',
    description: 'Fever, cough, weakness, common infections, diabetes & BP checkup',
    icon: 'Stethoscope',
    avgWaitMins: 14
  },
  {
    id: 'cardiology',
    name: 'Cardiology',
    nativeName: 'हृदय रोग विभाग',
    description: 'Chest discomfort, high BP, palpitations, breathlessness, cardiac review',
    icon: 'HeartPulse',
    avgWaitMins: 18
  },
  {
    id: 'orthopedics',
    name: 'Orthopedics',
    nativeName: 'हड्डी एवं जोड़ रोग',
    description: 'Joint pain, fractures, spine problems, arthritis, difficulty walking',
    icon: 'Bone',
    avgWaitMins: 12
  },
  {
    id: 'ayush',
    name: 'AYUSH / Ayurveda',
    nativeName: 'आयुष एवं आयुर्वेद',
    description: 'Holistic assessment, Dashavidha Pariksha, chronic metabolic & lifestyle care',
    icon: 'Leaf',
    avgWaitMins: 10
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    nativeName: 'बाल रोग विभाग',
    description: 'Child healthcare, vaccinations, growth monitoring, pediatric ailments',
    icon: 'Baby',
    avgWaitMins: 15
  },
  {
    id: 'ent',
    name: 'Ear, Nose & Throat',
    nativeName: 'ईएनटी (कान, नाक, गला)',
    description: 'Ear discharge, hearing issues, sinusitis, throat pain, voice change',
    icon: 'Headphones',
    avgWaitMins: 11
  }
];

export const CLINICAL_QUESTIONS: ClinicalQuestion[] = [
  {
    id: 'q_chief_complaint',
    step: 1,
    totalSteps: 7,
    category: 'chief_complaint',
    question: 'What is the main problem bringing you to the hospital today?',
    nativeQuestion: {
      en: 'What is the main problem bringing you to the hospital today?',
      hi: 'आज आप किस मुख्य परेशानी के लिए अस्पताल आए हैं?',
      mr: 'आज तुम्ही मुख्यत्वे कोणत्या त्रासासाठी रुग्णालयात आला आहात?',
      ta: 'இன்று நீங்கள் எந்த முக்கிய பிரச்சினைக்காக மருத்துவமனைக்கு வந்துள்ளீர்கள்?',
      te: 'ఈ రోజు మీరు ఏ ముఖ్యమైన సమస్య కోసం ఆసుపత్రికి వచ్చారు?',
      bn: 'আজ আপনি প্রধানত কী সমস্যার জন্য হাসপাতালে এসেছেন?'
    },
    subtext: 'You can tap an option or simply speak aloud in your language.',
    inputType: 'single_choice',
    options: [
      { id: 'chest_pain', label: 'Chest Pain or Heaviness', nativeLabel: 'सीने में दर्द या भारीपन', sublabel: 'Pain in center or left side of chest', isRedFlag: true },
      { id: 'fever_bodyache', label: 'Fever and Chills', nativeLabel: 'बुखार एवं शरीर दर्द', sublabel: 'High temperature, shivering' },
      { id: 'cough_breathless', label: 'Severe Breathlessness', nativeLabel: 'सांस लेने में भारी तकलीफ', sublabel: 'Difficulty breathing even while resting', isRedFlag: true },
      { id: 'stomach_pain', label: 'Stomach Pain / Vomiting', nativeLabel: 'पेट में तेज दर्द / उल्टी', sublabel: 'Abdominal cramps, acidity or loose stools' },
      { id: 'joint_pain', label: 'Joint / Back Pain', nativeLabel: 'जोड़ों या कमर का पुराना दर्द', sublabel: 'Knee, back, shoulder or neck stiffness' },
      { id: 'chronic_followup', label: 'Routine BP / Diabetes Follow-up', nativeLabel: 'बीपी / शुगर की नियमित जांच', sublabel: 'Medication refill, general review' }
    ]
  },
  {
    id: 'q_location',
    step: 2,
    totalSteps: 7,
    category: 'duration_severity',
    question: 'Where is the discomfort located, and does it spread anywhere?',
    nativeQuestion: {
      en: 'Where is the discomfort located, and does it spread anywhere?',
      hi: 'दर्द या तकलीफ शरीर के किस हिस्से में है, और क्या यह कहीं फैल रहा है?',
      mr: 'त्रास नक्की कोणत्या भागात होत आहे आणि तो कुठे पसरत आहे का?',
      ta: 'அசௌகரியம் எங்குள்ளது, அது வேறு எங்கும் பரவுகிறதா?',
      te: 'బాధ ఎక్కడ ఉంది, అది ఎక్కడైనా వ్యాపిస్తుందా?',
      bn: 'অসুবিধাটি কোথায় অবস্থিত এবং এটি কি কোথাও ছড়িয়ে পড়ছে?'
    },
    subtext: 'Select the primary location or describe where you feel it.',
    inputType: 'single_choice',
    options: [
      { id: 'loc_chest_arm', label: 'Chest radiating to left arm or jaw', nativeLabel: 'सीने से बाएं हाथ या जबड़े तक', sublabel: 'Substernal pressure spreading to neck/arm', isRedFlag: true },
      { id: 'loc_head_temple', label: 'Head / Forehead / Temples', nativeLabel: 'सिर / माथा / दोनों तरफ', sublabel: 'Throbbing or continuous headache' },
      { id: 'loc_upper_abdomen', label: 'Upper abdomen below ribs', nativeLabel: 'पेट का ऊपरी हिस्सा (पसलियों के नीचे)', sublabel: 'Burning sensation or epigastric fullness' },
      { id: 'loc_knees', label: 'Both knees / Lower back', nativeLabel: 'दोनों घुटने अथवा कमर', sublabel: 'Pain worse while standing or climbing stairs' },
      { id: 'loc_generalized', label: 'Whole body aches / General weakness', nativeLabel: 'पूरे शरीर में दर्द / भारी कमजोरी', sublabel: 'Fatigue, tiredness all over' }
    ]
  },
  {
    id: 'q_duration',
    step: 3,
    totalSteps: 7,
    category: 'duration_severity',
    question: 'How long have you had this issue, and how suddenly did it start?',
    nativeQuestion: {
      en: 'How long have you had this issue, and how suddenly did it start?',
      hi: 'यह तकलीफ कितने समय से है, और यह कैसे शुरू हुई?',
      mr: 'हा त्रास किती दिवसांपासून आहे आणि तो कसा सुरू झाला?',
      ta: 'இந்த பிரச்சனை எவ்வளவு காலமாக உள்ளது, அது எவ்வளவு திடீரென தொடங்கியது?',
      te: 'ఈ సమస్య ఎంతకాలంగా ఉంది మరియు అది ఎంత అకస్మాత్తుగా ప్రారంభమైంది?',
      bn: 'এই সমস্যাটি কতদিন ধরে চলছে এবং এটি কীভাবে শুরু হয়েছিল?'
    },
    subtext: 'Acute sudden issues help us prioritize emergency triage.',
    inputType: 'single_choice',
    options: [
      { id: 'dur_acute_hours', label: 'Started suddenly within last 24 hours', nativeLabel: 'अचानक पिछले 24 घंटों में शुरू हुआ', sublabel: 'Acute onset, intense', isRedFlag: true },
      { id: 'dur_few_days', label: 'Last 2 to 7 days', nativeLabel: 'पिछले 2 से 7 दिनों से', sublabel: 'Recent onset' },
      { id: 'dur_weeks', label: '1 to 4 weeks', nativeLabel: '1 से 4 हफ्तों से', sublabel: 'Gradually worsening' },
      { id: 'dur_months', label: 'Long term (More than 1 month)', nativeLabel: 'काफी लंबे समय से (1 महीने से अधिक)', sublabel: 'Chronic persistent ailment' }
    ]
  },
  {
    id: 'q_severity',
    step: 4,
    totalSteps: 7,
    category: 'duration_severity',
    question: 'How severe is the discomfort on a scale of 1 to 10?',
    nativeQuestion: {
      en: 'How severe is the discomfort on a scale of 1 to 10?',
      hi: '1 से 10 के पैमाने पर आपकी तकलीफ कितनी गंभीर है?',
      mr: '1 ते 10 च्या प्रमाणात तुमचा त्रास किती तीव्र आहे?',
      ta: '1 முதல் 10 வரையிலான அளவில் உங்கள் வலி அல்லது அசௌகரியம் எவ்வளவு தீவிரமானது?',
      te: '1 నుండి 10 స్కేలుపై మీ అసౌకర్యం ఎంత తీవ్రంగా ఉంది?',
      bn: '1 থেকে 10 এর স্কেলে আপনার অস্বস্তি কতটা তীব্র?'
    },
    subtext: '1 = Very mild, 5 = Moderate, 10 = Severe unbearable pain',
    inputType: 'scale',
    options: [
      { id: 'sev_mild', label: 'Mild (1 - 3)', sublabel: 'Noticeable but does not disrupt daily work' },
      { id: 'sev_moderate', label: 'Moderate (4 - 6)', sublabel: 'Difficult to ignore, hampers daily routine' },
      { id: 'sev_severe', label: 'Severe (7 - 8)', sublabel: 'Significant distress, resting is required' },
      { id: 'sev_extreme', label: 'Crushing / Unbearable (9 - 10)', sublabel: 'Immediate attention required', isRedFlag: true }
    ]
  },
  {
    id: 'q_redflags_associated',
    step: 5,
    totalSteps: 7,
    category: 'associated_symptoms',
    question: 'Are you experiencing any of these critical warning symptoms?',
    nativeQuestion: {
      en: 'Are you experiencing any of these critical warning symptoms?',
      hi: 'क्या आपको इनमें से कोई भी गंभीर चेतावनी लक्षण महसूस हो रहे हैं?',
      mr: 'तुम्हाला यापैकी कोणतीही गंभीर चेतावणी लक्षणे जाणवत आहेत का?',
      ta: 'இந்த முக்கியமான எச்சரிக்கை அறிகுறிகளில் ஏதேனும் உங்களுக்கு ஏற்படுகிறதா?',
      te: 'ఈ ముఖ్యమైన హెచ్చరిక లక్షణాలలో దేనినైనా మీరు అనుభవిస్తున్నారా?',
      bn: 'আপনি কি এই গুরুতর সতর্কতা লক্ষণগুলির মধ্যে কোনটি অনুভব করছেন?'
    },
    subtext: 'Our AI checks for emergency signs to protect your safety.',
    inputType: 'multi_choice',
    options: [
      { id: 'rf_sweating', label: 'Cold Profuse Sweating / Diaphoresis', nativeLabel: 'अचानक ठंडा पसीना आना', isRedFlag: true },
      { id: 'rf_breathless', label: 'Severe Shortness of Breath while resting', nativeLabel: 'बैठे-बैठे सांस फूलना', isRedFlag: true },
      { id: 'rf_dizziness', label: 'Dizziness or Near-Fainting', nativeLabel: 'चक्कर आना या बेहोशी जैसा लगना', isRedFlag: true },
      { id: 'rf_vomiting', label: 'Nausea or Vomiting', nativeLabel: 'उल्टी या जी मिचलाना' },
      { id: 'rf_none', label: 'None of the above critical signs', nativeLabel: 'उपरोक्त में से कोई नहीं' }
    ]
  },
  {
    id: 'q_past_conditions',
    step: 6,
    totalSteps: 7,
    category: 'past_history',
    question: 'Do you have any known medical conditions diagnosed earlier?',
    nativeQuestion: {
      en: 'Do you have any known medical conditions diagnosed earlier?',
      hi: 'क्या आपको पहले से कोई पुरानी बीमारी या डॉक्टर द्वारा बताई गई समस्या है?',
      mr: 'तुम्हाला आधीपासून काही जुनाट आजार किंवा निदान झालेला त्रास आहे का?',
      ta: 'முன்னதாக கண்டறியப்பட்ட ஏதேனும் மருத்துவ நிலைமைகள் உங்களுக்கு உள்ளதா?',
      te: 'గతంలో నిర్ధారించబడిన ఏదైనా ఆరోగ్య సమస్యలు మీకు ఉన్నాయా?',
      bn: 'আপনার কি আগে থেকে জানা কোনো রোগ বা চিকিৎসকের পরামর্শকৃত সমস্যা আছে?'
    },
    subtext: 'Select all that apply to complete your medical profile.',
    inputType: 'multi_choice',
    options: [
      { id: 'pmh_htn', label: 'High Blood Pressure (Hypertension)', nativeLabel: 'उच्च रक्तचाप (High BP)' },
      { id: 'pmh_dm', label: 'Diabetes (High Blood Sugar)', nativeLabel: 'मधुमेह / शुगर (Diabetes)' },
      { id: 'pmh_cad', label: 'Previous Heart Disease / Stent / Angio', nativeLabel: 'दिल की बीमारी / स्टेंट / एंजियोप्लास्टी' },
      { id: 'pmh_asthma', label: 'Asthma / COPD / Breathing issue', nativeLabel: 'दमा / अस्थमा' },
      { id: 'pmh_thyroid', label: 'Thyroid disorder', nativeLabel: 'थायराइड की समस्या' },
      { id: 'pmh_none', label: 'No prior diagnosed illnesses', nativeLabel: 'कोई पूर्व बीमारी नहीं' }
    ]
  },
  {
    id: 'q_allergies_meds',
    step: 7,
    totalSteps: 7,
    category: 'medications',
    question: 'Do you take daily medicines or have severe drug allergies?',
    nativeQuestion: {
      en: 'Do you take daily medicines or have severe drug allergies?',
      hi: 'क्या आप कोई दैनिक दवाई लेते हैं अथवा किसी दवा से एलर्जी है?',
      mr: 'तुम्ही रोज औषधे घेता का किंवा तुम्हाला एखाद्या औषधाची ऍलर्जी आहे का?',
      ta: 'நீங்கள் தினமும் மருந்துகள் உட்கொள்கிறீர்களா அல்லது மருந்து ஒவ்வாமை உள்ளதா?',
      te: 'మీరు రోజూ మందులు తీసుకుంటారా లేదా ఏదైనా ఔషధ అలెర్జీ ఉందా?',
      bn: 'আপনি কি প্রতিদিন ওষুধ খান অথবা আপনার কি কোনো ওষুধের অ্যালার্জি আছে?'
    },
    subtext: 'You can also scan your prescription in the next step.',
    inputType: 'single_choice',
    options: [
      { id: 'med_taking_regular', label: 'Yes, I take daily medicines regularly', nativeLabel: 'हाँ, मैं नियमित रूप से दवाएं लेता हूँ' },
      { id: 'med_allergy_penicillin', label: 'Known allergy to Penicillin / Sulfa drugs', nativeLabel: 'पेनिसिलिन / सल्फा दवाओं से एलर्जी है' },
      { id: 'med_no_daily', label: 'No daily medications & no known drug allergies', nativeLabel: 'कोई नियमित दवाई नहीं एवं कोई एलर्जी नहीं' }
    ]
  }
];

// SOCRATES Probing Framework for Chest Pain and Acute Symptoms
export const SOCRATES_QUESTIONS: ClinicalQuestion[] = [
  {
    id: 'socrates_character',
    step: 1,
    totalSteps: 3,
    category: 'duration_severity',
    question: 'SOCRATES: What is the exact character or feeling of the discomfort?',
    nativeQuestion: {
      en: 'SOCRATES: What is the exact character or feeling of the discomfort?',
      hi: 'दर्द या तकलीफ का स्वरूप कैसा महसूस हो रहा है?',
      mr: 'वेदनेचे नेमके स्वरूप कसे जाणवत आहे?',
      ta: 'அசௌகரியத்தின் சரியான தன்மை என்ன?',
      te: 'బాధ లేదా అసౌకర్యం యొక్క ఖచ్చితమైన స్వభావం ఏమిటి?',
      bn: 'অস্বস্তির সঠিক অনুভূতি বা লক্ষণ কেমন?'
    },
    subtext: 'Describes the nature of pain (crushing, burning, stabbing, or aching)',
    inputType: 'single_choice',
    options: [
      { id: 'char_crushing', label: 'Crushing Heavy Pressure (छाती पर भारी वजन या जकड़न)', sublabel: 'Feels like an elephant sitting on chest', isRedFlag: true },
      { id: 'char_burning', label: 'Burning / Hot Acidity (जलन अथवा एसिडिटी जैसा दर्द)', sublabel: 'Substernal fire sensation, worse when lying flat' },
      { id: 'char_sharp', label: 'Sharp Stabbing / Needle-like (तेज चुभन जैसा दर्द)', sublabel: 'Pinpoint sharp pain with deep breaths' },
      { id: 'char_dull', label: 'Dull Continuous Ache (हल्का लगातार मीठा दर्द)', sublabel: 'Non-radiating constant muscular ache' }
    ]
  },
  {
    id: 'socrates_radiation',
    step: 2,
    totalSteps: 3,
    category: 'duration_severity',
    question: 'SOCRATES: Does the pain radiate or travel anywhere outside the chest?',
    nativeQuestion: {
      en: 'SOCRATES: Does the pain radiate or travel anywhere outside the chest?',
      hi: 'क्या दर्द सीने से होकर शरीर के किसी अन्य भाग में फैल रहा है?',
      mr: 'वेदना छातीतून इतर कोणत्याही भागात पसरत आहेत का?',
      ta: 'மார்பைத் தவிர வேறு எங்கும் வலி பரவுகிறதா?',
      te: 'ఛాతీ వెలుపల నొప్పి ఎక్కడైనా వ్యాపిస్తుందా?',
      bn: 'ব্যথা কি বুকের বাইরে কোথাও ছড়িয়ে পড়ছে?'
    },
    subtext: 'Probes classical radiation pathways to detect myocardial ischemia',
    inputType: 'single_choice',
    options: [
      { id: 'rad_arm_jaw', label: 'Radiating to Left Arm, Neck, or Jaw (बाएं हाथ या जबड़े में)', sublabel: 'Classical sign of coronary artery insufficiency', isRedFlag: true },
      { id: 'rad_back', label: 'Radiating straight to Upper Back / Interscapular (पीठ में)', sublabel: 'Tearing or piercing sensation between shoulder blades' },
      { id: 'rad_epigastric', label: 'Spreading downwards to Upper Abdomen (पेट के ऊपरी भाग में)', sublabel: 'Epigastric discomfort with fullness' },
      { id: 'rad_localized', label: 'Strictly localized to one spot, does not travel (सिर्फ एक जगह)', sublabel: 'Does not radiate' }
    ]
  },
  {
    id: 'socrates_exacerbating_relieving',
    step: 3,
    totalSteps: 3,
    category: 'duration_severity',
    question: 'SOCRATES: What triggers or relieves the pain (Exacerbating & Relieving Factors)?',
    nativeQuestion: {
      en: 'SOCRATES: What triggers or relieves the pain (Exacerbating & Relieving Factors)?',
      hi: 'दर्द किस स्थिति में बढ़ता है अथवा किससे आराम मिलता है?',
      mr: 'वेदना कशामुळे वाढतात किंवा कशामुळे कमी होतात?',
      ta: 'வலியை அதிகரிப்பது அல்லது குறைப்பது எது?',
      te: 'నొప్పి దేని ద్వారా పెరుగుతుంది లేదా తగ్గుతుంది?',
      bn: 'কীসের কারণে ব্যথা বাড়ে বা কমে?'
    },
    subtext: 'Exertional angina typically worsens with walking and resolves with rest',
    inputType: 'single_choice',
    options: [
      { id: 'rel_worse_exertion', label: 'Worse with walking / stairs; relieved by resting (चलने पर बढ़ता है)', sublabel: 'Strong indicator of effort angina / ischemia', isRedFlag: true },
      { id: 'rel_worse_breathing', label: 'Worse with deep inspiration / coughing (गहरी सांस लेने पर बढ़ता है)', sublabel: 'Pleuritic or musculoskeletal etiology' },
      { id: 'rel_worse_food', label: 'Worse after oily/spicy food; relieved by antacids (भोजन के बाद बढ़ता है)', sublabel: 'Gastroesophageal reflux / dyspepsia' },
      { id: 'rel_constant', label: 'Constant unchanging intensity at all times (लगातार एक जैसा रहता है)', sublabel: 'No change with movement or rest' }
    ]
  }
];

// Complete AYUSH Specific Questions (Dashavidha Pariksha - 10 Dimensions & Ahara-Vihara)
export const AYUSH_PARIKSHA_QUESTIONS: ClinicalQuestion[] = [
  {
    id: 'ayush_prakriti',
    step: 1,
    totalSteps: 11,
    category: 'ayush_pariksha',
    question: 'Dashavidha Pariksha 1 (Prakriti): What is your constitutional dosha predominance?',
    nativeQuestion: {
      en: 'Dashavidha Pariksha 1 (Prakriti): What is your constitutional dosha predominance?',
      hi: 'दशविध परीक्षा 1 (प्रकृति): आपकी शारीरिक प्रकृति (दोष प्रधानता) क्या है?',
      mr: 'दशविध परीक्षा 1 (प्रकृती): तुमची शारीरिक प्रकृती (दोष प्राधान्य) काय आहे?',
      ta: 'தசவித பரீக்ஷா 1 (பிரகிருதி): உங்கள் முதன்மை உடல் தன்மை என்ன?',
      te: 'దశవిధ పరీక్ష 1 (ప్రకృతి): మీ ప్రాథమిక శరీర స్వభావం ఏమిటి?',
      bn: 'দশবিধ পরীক্ষা 1 (প্রকৃতি): আপনার শারীরিক প্রকৃতি কী?'
    },
    subtext: 'Constitutional baseline assessment of Vata, Pitta, and Kapha',
    inputType: 'single_choice',
    isAyushOnly: true,
    ayushDimension: 'Prakriti (प्रकृति)',
    options: [
      { id: 'prakriti_vata', label: 'Vata Predominant', sublabel: 'Slender build, quick movements, dry skin, sensitive to cold winds' },
      { id: 'prakriti_pitta', label: 'Pitta Predominant', sublabel: 'Medium build, sharp appetite, heat-intolerant, reddish complexion' },
      { id: 'prakriti_kapha', label: 'Kapha Predominant', sublabel: 'Solid heavy build, calm demeanor, steady endurance, oily skin' },
      { id: 'prakriti_vatapitta', label: 'Vata-Pitta Dvandvaja', sublabel: 'Combination of dryness, irregular digestion and heat sensitivity' }
    ]
  },
  {
    id: 'ayush_vikriti',
    step: 2,
    totalSteps: 11,
    category: 'ayush_pariksha',
    question: 'Dashavidha Pariksha 2 (Vikriti): Current Dosha Imbalance / वर्तमान दोष असंतुलन (विकृति)',
    nativeQuestion: {
      en: 'Dashavidha Pariksha 2 (Vikriti): Current Dosha Imbalance and morbidity?',
      hi: 'दशविध परीक्षा 2 (विकृति): वर्तमान में किस दोष के असंतुलन के लक्षण हैं?',
      mr: 'दशविध परीक्षा 2 (विकृती): सध्या कोणत्या दोषाचे असंतुलन जाणवत आहे?',
      ta: 'தசவித பரீக்ஷா 2 (விக்ருதி): தற்போதைய தோஷ சமநிலையின்மை என்ன?',
      te: 'దశవిధ పరీక్ష 2 (వికృతి): ప్రస్తుత దోష అసమతుల్యత ఏమిటి?',
      bn: 'দশবিধ পরীক্ষা 2 (বিকৃতি): বর্তমানে কোন দোষের ভারসাম্যহীনতা রয়েছে?'
    },
    subtext: 'Pathological deviation from patient baseline constitution (Samprapti)',
    inputType: 'single_choice',
    isAyushOnly: true,
    ayushDimension: 'Vikriti (विकृति)',
    options: [
      { id: 'vikriti_vata', label: 'Vata Prakopa (वात प्रकोप)', sublabel: 'Body aches, joint cracking, stiffness, insomnia, anxiety, dry stool' },
      { id: 'vikriti_pitta', label: 'Pitta Prakopa (पित्त प्रकोप)', sublabel: 'Acid reflux, excessive thirst, burning eyes, skin eruptions, anger' },
      { id: 'vikriti_kapha', label: 'Kapha Prakopa (कफ प्रकोप)', sublabel: 'Heaviness of limbs, productive cough, excessive sleep, sluggishness' },
      { id: 'vikriti_sannipata', label: 'Sannipataja (सन्निपातज)', sublabel: 'Mixed vitiation of all three doshas simultaneously' }
    ]
  },
  {
    id: 'ayush_ahara_agni',
    step: 3,
    totalSteps: 11,
    category: 'ayush_pariksha',
    question: 'Dashavidha Pariksha 3 & 4 (Ahara Shakti & Agni): Digestive Fire & Capacity / जठराग्नि',
    nativeQuestion: {
      en: 'Dashavidha Pariksha 3 & 4 (Ahara Shakti & Agni): How is your digestive capacity?',
      hi: 'दशविध परीक्षा 3 एवं 4 (आहार शक्ति एवं अग्नि): आपकी पाचन शक्ति एवं जठराग्नि कैसी है?',
      mr: 'दशविध परीक्षा 3 आणि 4 (आहार शक्ती आणि अग्नी): तुमची पचनशक्ती कशी आहे?',
      ta: 'தசவித பரீக்ஷா 3 & 4: உங்கள் செரிமான தீ மற்றும் உட்கொள்ளும் திறன் எப்படி?',
      te: 'దశవిధ పరీక్ష 3 & 4: మీ జీర్ణశక్తి ఎలా ఉంది?',
      bn: 'দশবিধ পরীক্ষা 3 এবং 4: আপনার হজম ক্ষমতা কেমন?'
    },
    subtext: 'Abhyavaharana Shakti (food intake power) and Jarana Shakti (digestive efficiency)',
    inputType: 'single_choice',
    isAyushOnly: true,
    ayushDimension: 'Ahara Shakti & Agni (आहार शक्ति)',
    options: [
      { id: 'agni_mandagni', label: 'Mandagni (मंदाग्नि / Sluggish)', sublabel: 'Bloating, slow metabolism, feeling heavy hours after light meals' },
      { id: 'agni_tikshnagni', label: 'Tikshnagni (तीक्ष्णाग्नि / Hyperactive)', sublabel: 'Sharp hunger, acid regurgitation, burning in chest/throat' },
      { id: 'agni_vishamagni', label: 'Vishamagni (विषमाग्नि / Irregular)', sublabel: 'Unpredictable hunger, constipation alternating with loose bowels' },
      { id: 'agni_samagni', label: 'Samagni (समाग्नि / Balanced)', sublabel: 'Optimal digestion, feeling light and energetic after meals' }
    ]
  },
  {
    id: 'ayush_satva',
    step: 4,
    totalSteps: 11,
    category: 'ayush_pariksha',
    question: 'Dashavidha Pariksha 5 (Satva): Mental Fortitude and Stress Tolerance / सत्व परीक्षा',
    nativeQuestion: {
      en: 'Dashavidha Pariksha 5 (Satva): Mental Fortitude and Stress Tolerance?',
      hi: 'दशविध परीक्षा 5 (सत्व): आपका मानसिक बल एवं तनाव सहने की क्षमता कैसी है?',
      mr: 'दशविध परीक्षा 5 (सत्व): तुमचे मानसिक बळ आणि ताण सहन करण्याची क्षमता कशी आहे?',
      ta: 'தசவித பரீக்ஷா 5: உங்கள் மன உறுதி மற்றும் மன அழுத்த தாங்கும் திறன் எப்படி?',
      te: 'దశవిధ పరీక్ష 5: మీ మానసిక బలం మరియు ఒత్తిడిని తట్టుకునే సామర్థ్యం ఎలా ఉంది?',
      bn: 'দশবিধ পরীক্ষা 5: আপনার মানসিক শক্তি এবং মানসিক চাপ সহ্য করার ক্ষমতা কেমন?'
    },
    subtext: 'Psychological constitution according to Ayurvedic clinical principles',
    inputType: 'single_choice',
    isAyushOnly: true,
    ayushDimension: 'Satva (सत्व)',
    options: [
      { id: 'satva_pravara', label: 'Pravara Satva (प्रवर सत्व / High)', sublabel: 'Calm under severe distress, highly patient and resilient' },
      { id: 'satva_madhyama', label: 'Madhyama Satva (मध्यम सत्व / Moderate)', sublabel: 'Copes well with support, occasional anxiety' },
      { id: 'satva_avara', label: 'Avara Satva (अवर सत्व / Low)', sublabel: 'Easily agitated, highly anxious, fearful of medical procedures' }
    ]
  },
  {
    id: 'ayush_vyayama',
    step: 5,
    totalSteps: 11,
    category: 'ayush_pariksha',
    question: 'Dashavidha Pariksha 6 (Vyayama Shakti): Physical Stamina & Bala / व्यायाम शक्ति',
    nativeQuestion: {
      en: 'Dashavidha Pariksha 6 (Vyayama Shakti): What is your physical stamina and capacity?',
      hi: 'दशविध परीक्षा 6 (व्यायाम शक्ति): आपकी शारीरिक सहनशक्ति एवं कार्यक्षमता कैसी है?',
      mr: 'दशविध परीक्षा 6 (व्यायाम शक्ती): तुमची शारीरिक सहनशीलता आणि कार्यक्षमता कशी आहे?',
      ta: 'தசவித பரீக்ஷா 6: உங்கள் உடல் சகிப்புத்தன்மை மற்றும் திறன் என்ன?',
      te: 'దశవిధ పరీక్ష 6: మీ శారీరక సామర్థ్యం ఎలా ఉంది?',
      bn: 'দশবিধ পরীক্ষা 6: আপনার শারীরিক ক্ষমতা ও সহনশীলতা কেমন?'
    },
    subtext: 'Assessment of bodily strength and physical endurance (Karma Samarthya)',
    inputType: 'single_choice',
    isAyushOnly: true,
    ayushDimension: 'Vyayama Shakti (व्यायाम शक्ति)',
    options: [
      { id: 'vyayama_uttama', label: 'Uttama Bala (उत्तम बल / High Endurance)', sublabel: 'Can perform heavy physical work without quick fatigue' },
      { id: 'vyayama_madhyama', label: 'Madhyama Bala (मध्यम बल / Moderate)', sublabel: 'Comfortable with brisk walking, mild tiredness' },
      { id: 'vyayama_heena', label: 'Heena Bala (हीन बल / Low Endurance)', sublabel: 'Tires quickly with minimal exertion, dyspnea on stairs' }
    ]
  },
  {
    id: 'ayush_sara',
    step: 6,
    totalSteps: 11,
    category: 'ayush_pariksha',
    question: 'Dashavidha Pariksha 7 (Sara): Tissue Excellence & Vitality / धातु सार परीक्षा',
    nativeQuestion: {
      en: 'Dashavidha Pariksha 7 (Sara): Tissue Excellence and Vitality?',
      hi: 'दशविध परीक्षा 7 (सार): आपकी शारीरिक धातुओं की पुष्टि एवं सारता कैसी है?',
      mr: 'दशविध परीक्षा 7 (सार): तुमच्या शारीरिक धातूंची पुष्टी कशी आहे?',
      ta: 'தசவித பரீக்ஷா 7 (சாரா): தாதுக்களின் ஆரோக்கியம் எப்படி உள்ளது?',
      te: 'దశవిధ పరీక్ష 7 (సార): మీ శరీర ధాతువుల బలం ఎలా ఉంది?',
      bn: 'দশবিধ পরীক্ষা 7 (সার): আপনার শারীরিক ধাতুর পুষ্টি কেমন?'
    },
    subtext: 'Excellence of Dhatus (Rasa, Rakta, Mamsa, Meda, Asthi, Majja, Shukra)',
    inputType: 'single_choice',
    isAyushOnly: true,
    ayushDimension: 'Sara (सार)',
    options: [
      { id: 'sara_pravara', label: 'Pravara Sara (प्रवर सार / High Tissue Vitality)', sublabel: 'Strong teeth, lustrous hair, firm musculature, high immunity' },
      { id: 'sara_madhyama', label: 'Madhyama Sara (मध्यम सार / Moderate)', sublabel: 'Average physical constitution and tissue nourishment' },
      { id: 'sara_avara', label: 'Avara Sara (अवर सार / Low)', sublabel: 'Fragile nails, sparse hair, prone to frequent infections' }
    ]
  },
  {
    id: 'ayush_samhanana',
    step: 7,
    totalSteps: 11,
    category: 'ayush_pariksha',
    question: 'Dashavidha Pariksha 8 (Samhanana): Body Compactness & Skeletal Built / संहनन परीक्षा',
    nativeQuestion: {
      en: 'Dashavidha Pariksha 8 (Samhanana): Body Compactness and Skeletal Built?',
      hi: 'दशविध परीक्षा 8 (संहनन): आपके शरीर का गठन एवं संधियों (जोड़ों) की दृढ़ता कैसी है?',
      mr: 'दशविध परीक्षा 8 (संहनन): तुमच्या शरीराची बांधणी आणि सांध्यांची मजबुती कशी आहे?',
      ta: 'தசவித பரீக்ஷா 8 (சம்ஹனன): உடலின் கட்டமைப்பு மற்றும் மூட்டுகளின் வலிமை எப்படி?',
      te: 'దశవిధ పరీక్ష 8 (సంహనన): శరీర నిర్మాణం మరియు కీళ్ల బలం ఎలా ఉంది?',
      bn: 'দশবিধ পরীক্ষা 8 (সংহনন): শরীরের গঠন এবং গাঁটের দৃঢ়তা কেমন?'
    },
    subtext: 'Symmetry and compactness of body parts and bone-joint integrity',
    inputType: 'single_choice',
    isAyushOnly: true,
    ayushDimension: 'Samhanana (संहनन)',
    options: [
      { id: 'samhanana_pravara', label: 'Susamhata (सुसंहत / Well-Knit Body)', sublabel: 'Evenly distributed musculature, firm and stable joints' },
      { id: 'samhanana_madhyama', label: 'Madhyama Samhanana (मध्यम संहनन)', sublabel: 'Normal proportionate body compactness' },
      { id: 'samhanana_avara', label: 'Heena / Hina Samhanana (हीन संहनन)', sublabel: 'Loose lax joints, delicate and prone to sprains' }
    ]
  },
  {
    id: 'ayush_pramana',
    step: 8,
    totalSteps: 11,
    category: 'ayush_pariksha',
    question: 'Dashavidha Pariksha 9 (Pramana): Anthropometric Proportions / प्रमाण परीक्षा',
    nativeQuestion: {
      en: 'Dashavidha Pariksha 9 (Pramana): Anthropometric Proportions and Physical Frame?',
      hi: 'दशविध परीक्षा 9 (प्रमाण): शारीरिक अंग-प्रत्यंगों का अनुपात और बनावट कैसी है?',
      mr: 'दशविध परीक्षा 9 (प्रमाण): शरीराचे प्रमाण आणि ठेवण कशी आहे?',
      ta: 'தசவித பரீக்ஷா 9 (பிரமாண): உடல் உறுப்புகளின் விகிதாச்சாரம் எப்படி?',
      te: 'దశవిధ పరీక్ష 9 (ప్రమాణ): శరీర అవయవాల నిష్పత్తి ఎలా ఉంది?',
      bn: 'দশবিধ পরীক্ষা 9 (প্রমাণ): শারীরিক অঙ্গ-प्रत्यঙ্গের অনুপাত কেমন?'
    },
    subtext: 'Ayurvedic evaluation of ideal body measurements and proportions (Sama Pramana)',
    inputType: 'single_choice',
    isAyushOnly: true,
    ayushDimension: 'Pramana (प्रमाण)',
    options: [
      { id: 'pramana_sama', label: 'Sama Pramana (सम प्रमाण / Well-Proportioned)', sublabel: 'Harmonious height-to-arm span, symmetrical facial and limb features' },
      { id: 'pramana_vishama_atihrasva', label: 'Hrasva / Ati-Krisha (ह्रस्व / कृश)', sublabel: 'Underweight or unusually petite skeletal frame' },
      { id: 'pramana_vishama_atisthula', label: 'Sthula / Ati-Sthula (स्थूल / अतिस्थूल)', sublabel: 'Excessive adipose accumulation, broad circumference' }
    ]
  },
  {
    id: 'ayush_satmya_vaya',
    step: 9,
    totalSteps: 11,
    category: 'ayush_pariksha',
    question: 'Dashavidha Pariksha 10 (Satmya & Vaya): Adaptability, Habits & Age / सात्म्य एवं वय',
    nativeQuestion: {
      en: 'Dashavidha Pariksha 10 (Satmya & Vaya): Dietary Adaptability and Age Category?',
      hi: 'दशविध परीक्षा 10 (सात्म्य एवं वय): भोजन व वातावरण की अनुकूलता एवं आयु वर्ग क्या है?',
      mr: 'दशविध परीक्षा 10 (सात्म्य आणि वय): अन्नाची अनुकूलता आणि वय काय आहे?',
      ta: 'தசவித பரீக்ஷா 10 (சாத்மிய & வய): உணவின் பொருந்தும் தன்மை மற்றும் வயது என்ன?',
      te: 'దశవిధ పరీక్ష 10 (సాత్మ్య మరియు వయ): ఆహార అలవాట్లు మరియు వయస్సు ఏమిటి?',
      bn: 'দশবিধ পরীক্ষা 10 (সাৎম্য ও বয়): খাদ্যের উপযোগিতা এবং বয়স কী?'
    },
    subtext: 'Habituation to tastes and climate (Satmya) and current chronological stage (Vaya)',
    inputType: 'single_choice',
    isAyushOnly: true,
    ayushDimension: 'Satmya & Vaya (सात्म्य एवं वय)',
    options: [
      { id: 'satmya_pravara', label: 'Sarva-Rasa Satmya (सर्व-रस सात्म्य / Madhyama Vaya)', sublabel: 'Can digest and adapt to all food types and seasonal changes effortlessly' },
      { id: 'satmya_madhyama', label: 'Oka Satmya (ओक सात्म्य / Habit Dependent)', sublabel: 'Accustomed only to regional foods; upset by dietary deviations' },
      { id: 'satmya_avara', label: 'Eka-Rasa Satmya / Vriddha Vaya (वृद्ध वय)', sublabel: 'Elderly stage with sensitive digestion requiring specific light foods' }
    ]
  },
  {
    id: 'ayush_ahara_vihara_diet',
    step: 10,
    totalSteps: 11,
    category: 'ayush_pariksha',
    question: 'Ahara Pariksha: Dietary Habits & Food Intake Regimen / आहार परीक्षा (खानपान)',
    nativeQuestion: {
      en: 'Ahara Pariksha: What are your regular dietary patterns and habits?',
      hi: 'आहार परीक्षा: आपकी नियमित खानपान की आदतें और दिनचर्या कैसी है?',
      mr: 'आहार परीक्षा: तुमच्या नियमित खाण्यापिण्याच्या सवयी कशा आहेत?',
      ta: 'ஆஹார பரீக்ஷா: உங்கள் வழக்கமான உணவுப் பழக்கவழக்கங்கள் என்ன?',
      te: 'ఆహార పరీక్ష: మీ సాధారణ ఆహారపు అలవాట్లు ఏమిటి?',
      bn: 'আহার পরীক্ষা: আপনার খাদ্যাভ্যাস কেমন?'
    },
    subtext: 'Probes Viruddha Ahara (incompatible foods), untimely meals, and spicy diet',
    inputType: 'multi_choice',
    isAyushOnly: true,
    ayushDimension: 'Ahara (खानपान)',
    options: [
      { id: 'diet_spicy_fried', label: 'Frequent deep-fried, sour, or spicy food (तली-भुनी या तीखी चीजें)', sublabel: 'Causes Pitta Prakopa and acid regurgitation' },
      { id: 'diet_irregular_timings', label: 'Irregular meal timings / Skipping meals (अनियमित भोजन समय)', sublabel: 'Causes Vishamagni and gastric bloating' },
      { id: 'diet_viruddha', label: 'Viruddha Ahara (विरुद्ध आहार - Milk with sour fruit/fish)', sublabel: 'Incompatible combinations generating Ama toxins' },
      { id: 'diet_sattvic_fresh', label: 'Fresh, warm, home-cooked Sattvic diet (ताजा सात्विक भोजन)', sublabel: 'Balanced nutrition supporting Dhatus' }
    ]
  },
  {
    id: 'ayush_vihara_lifestyle',
    step: 11,
    totalSteps: 11,
    category: 'ayush_pariksha',
    question: 'Vihara & Nidana: Sleep Routine & Lifestyle Regimen / विहार एवं निदान (जीवनशैली)',
    nativeQuestion: {
      en: 'Vihara & Nidana: Sleep Routine, Daily Schedule & Lifestyle Factors?',
      hi: 'विहार एवं निदान: आपकी नींद, दैनिक दिनचर्या एवं मानसिक तनाव कैसा है?',
      mr: 'विहार आणि निदान: तुमची झोप, दिनचर्या आणि ताणतणाव कसा आहे?',
      ta: 'விஹார & நிதான: உங்கள் தூக்கம், தினசரி நடைமுறை மற்றும் வாழ்க்கை முறை என்ன?',
      te: 'విహార మరియు నిదాన: మీ నిద్ర మరియు జీవనశైలి ఎలా ఉంది?',
      bn: 'বিহার ও নিদান: আপনার ঘুম এবং জীবনধারা কেমন?'
    },
    subtext: 'Probes Ratrijagarana (late nights), Divasvapna (daytime sleep), and mental stress',
    inputType: 'multi_choice',
    isAyushOnly: true,
    ayushDimension: 'Vihara (जीवनशैली)',
    options: [
      { id: 'vihara_ratrijagarana', label: 'Ratrijagarana (रात्रि जागरण - Late night waking / screen time)', sublabel: 'Direct cause of aggravated Vata and dry eyes' },
      { id: 'vihara_divasvapna', label: 'Divasvapna (दिवास्वप्न - Sleeping during daytime after heavy lunch)', sublabel: 'Direct cause of Kapha Prakopa and sluggish digestion' },
      { id: 'vihara_manasika_stress', label: 'Chinta & Shoka (मानसिक तनाव / Chronic worry and anxiety)', sublabel: 'Affects Prana Vata and impairs digestive Agni' },
      { id: 'vihara_swastha_dinacharya', label: 'Healthy Dinacharya (संतुलित दिनचर्या एवं पर्याप्त नींद)', sublabel: 'Regular sleep schedule and morning walks' }
    ]
  },
  {
    id: 'ayush_koshtha',
    step: 12,
    totalSteps: 13,
    category: 'ayush_pariksha',
    question: 'Koshtha Pariksha: Bowel Evacuation Tendency / कोष्ठ परीक्षा (शौच प्रवृत्ति)',
    nativeQuestion: {
      en: 'Koshtha Pariksha: What is your regular bowel habit and evacuation nature?',
      hi: 'कोष्ठ परीक्षा: आपकी शौच प्रवृत्ति एवं पेट साफ होने की प्रकृति कैसी है?',
      mr: 'कोष्ठ परीक्षा: तुमची पोट साफ होण्याची प्रवृत्ती कशी आहे?',
      ta: 'கோஷ்ட பரீக்ஷா: உங்கள் குடல் இயக்கம் மற்றும் மலம் கழிக்கும் தன்மை என்ன?',
      te: 'కోష్ఠ పరీక్ష: మీ ప్రేగు కదలికలు మరియు విసర్జన స్వభావం ఎలా ఉంది?',
      bn: 'কোষ্ঠ পরীক্ষা: আপনার পেট পরিষ্কার হওয়ার প্রকৃতি কেমন?'
    },
    subtext: 'Assesses Krura (hard/constipated - Vata), Mridu (soft/loose - Pitta), or Madhyama (balanced - Kapha)',
    inputType: 'single_choice',
    isAyushOnly: true,
    ayushDimension: 'Koshtha (कोष्ठ)',
    options: [
      { id: 'koshtha_krura', label: 'Krura Koshtha (क्रूर कोष्ठ - Hard stool / Constipation prone)', sublabel: 'Requires strong laxatives or warm milk to evacuate; dry hard pellets (Vata)' },
      { id: 'koshtha_mridu', label: 'Mridu Koshtha (मृदु कोष्ठ - Quick evacuation / Loose tendency)', sublabel: 'Evacuates easily even with mild warm milk or fruits; prone to loose stools (Pitta)' },
      { id: 'koshtha_madhyama', label: 'Madhyama Koshtha (मध्यम कोष्ठ - Regular normal bowel motion)', sublabel: 'Once daily formed stool without straining or urgency (Balanced)' }
    ]
  },
  {
    id: 'ayush_ashtavidha_jihwa_mala',
    step: 13,
    totalSteps: 13,
    category: 'ayush_pariksha',
    question: 'Ashtavidha Pariksha (Jihwa & Ama): Tongue Appearance & Metabolic Endotoxins / जिह्वा एवं सामता',
    nativeQuestion: {
      en: 'Ashtavidha Pariksha: Is your tongue coated with white/yellow layer (Ama)?',
      hi: 'अष्टविध परीक्षा: क्या आपकी जीभ पर सफेद या पीली परत (आम दोष / टॉक्सिन) जमी रहती है?',
      mr: 'अष्टविध परीक्षा: तुमच्या जिभेवर पांढरा थर किंवा चिकटपणा जाणवतो का?',
      ta: 'அஷ்டவித பரீக்ஷா: உங்கள் நாக்கில் வெள்ளை அல்லது மஞ்சள் படலம் உள்ளதா?',
      te: 'అష్టవిధ పరీక్ష: మీ నాలుకపై తెల్లటి పొర ఉందా?',
      bn: 'অষ্টবিধ পরীক্ষা: আপনার জিহ্বায় কি সাদা বা হলুদ আস্তরণ থাকে?'
    },
    subtext: 'Probes Saama (coated tongue with metabolic Ama toxins) vs Niraama (clean tongue)',
    inputType: 'single_choice',
    isAyushOnly: true,
    ayushDimension: 'Ashtavidha (अष्टविध परीक्षा)',
    options: [
      { id: 'jihwa_saama_heavy', label: 'Saama Jihwa (साम जिह्वा - Thick white/yellow coating & morning heaviness)', sublabel: 'Indicates high circulating Ama (endotoxins) and low digestive Agni' },
      { id: 'jihwa_niraama_clean', label: 'Niraama Jihwa (निराम जिह्वा - Clean pink tongue without coating)', sublabel: 'Indicates clear digestive channels and absence of acute Ama' },
      { id: 'jihwa_dry_fissured', label: 'Ruksha / Kharata (रुक्ष जिह्वा - Dry, rough with fissures)', sublabel: 'Indicates aggravated Vata and severe dehydration of mucosal tissues' }
    ]
  }
];

