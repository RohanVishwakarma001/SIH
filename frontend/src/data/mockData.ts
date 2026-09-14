import { 
  Patient, 
  LanguageOption, 
  Department, 
  ClinicalQuestion, 
  AdminAuditLog, 
  MedicalDocument 
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

// AYUSH Specific Questions (Dashavidha Pariksha)
export const AYUSH_PARIKSHA_QUESTIONS: ClinicalQuestion[] = [
  {
    id: 'ayush_prakriti',
    step: 1,
    totalSteps: 4,
    category: 'ayush_pariksha',
    question: 'Dashavidha Pariksha: What is your primary bodily constitution (Prakriti)?',
    nativeQuestion: {
      en: 'Dashavidha Pariksha: What is your primary bodily constitution (Prakriti)?',
      hi: 'दशविध परीक्षा: आपकी शारीरिक प्रकृति (दोष प्रधानता) क्या है?',
      mr: 'दशविध परीक्षा: तुमची शारीरिक प्रकृती (दोष प्राधान्य) काय आहे?',
      ta: 'தசவித பரீக்ஷா: உங்கள் முதன்மை உடல் தன்மை (பிரகிருதி) என்ன?',
      te: 'దశవిధ పరీక్ష: మీ ప్రాథమిక శరీర స్వభావం (ప్రకృతి) ఏమిటి?',
      bn: 'দশবিধ পরীক্ষা: আপনার শারীরিক প্রকৃতি (দোষ প্রাধান্য) কী?'
    },
    subtext: 'Ayurvedic assessment of Vata, Pitta, and Kapha constitution',
    inputType: 'single_choice',
    isAyushOnly: true,
    ayushDimension: 'Prakriti',
    options: [
      { id: 'prakriti_vata', label: 'Vata Predominant', sublabel: 'Slender build, quick movements, dry skin, sensitive to cold winds' },
      { id: 'prakriti_pitta', label: 'Pitta Predominant', sublabel: 'Medium build, sharp appetite, heat-intolerant, reddish complexion' },
      { id: 'prakriti_kapha', label: 'Kapha Predominant', sublabel: 'Solid heavy build, calm demeanor, steady endurance, oily skin' },
      { id: 'prakriti_vatapitta', label: 'Vata-Pitta Dvandvaja', sublabel: 'Combination of dryness, irregular digestion and heat sensitivity' }
    ]
  },
  {
    id: 'ayush_ahara_agni',
    step: 2,
    totalSteps: 4,
    category: 'ayush_pariksha',
    question: 'Ahara Shakti & Agni: How would you describe your digestive fire (Koshta / Agni)?',
    nativeQuestion: {
      en: 'Ahara Shakti & Agni: How would you describe your digestive fire (Koshta / Agni)?',
      hi: 'आहार शक्ति एवं अग्नि: आपकी पाचन शक्ति एवं जठराग्नि कैसी है?',
      mr: 'आहार शक्ती आणि अग्नी: तुमची पचनशक्ती आणि जठराग्नी कशी आहे?',
      ta: 'ஆஹார சக்தி & அக்னி: உங்கள் செரிமான தீயை எவ்வாறு விவரிப்பீர்கள்?',
      te: 'ఆహార శక్తి మరియు అగ్ని: మీ జీర్ణక్రియ ఎలా ఉంది?',
      bn: 'আহার শক্তি এবং অগ্নি: আপনার হজম শক্তি কেমন?'
    },
    subtext: 'Assessment of Abhyavaharana Shakti (intake) and Jarana Shakti (digestion)',
    inputType: 'single_choice',
    isAyushOnly: true,
    ayushDimension: 'Ahara Shakti',
    options: [
      { id: 'agni_mandagni', label: 'Mandagni (Sluggish / Heavy)', sublabel: 'Bloating, slow metabolism, feeling heavy hours after light meals' },
      { id: 'agni_tikshnagni', label: 'Tikshnagni (Hyperactive / Acidic)', sublabel: 'Sharp hunger, acid regurgitation, burning in chest/throat' },
      { id: 'agni_vishamagni', label: 'Vishamagni (Irregular / Variable)', sublabel: 'Unpredictable hunger, constipation alternating with loose bowels' },
      { id: 'agni_samagni', label: 'Samagni (Balanced)', sublabel: 'Optimal digestion, feeling light and energetic after meals' }
    ]
  },
  {
    id: 'ayush_satva',
    step: 3,
    totalSteps: 4,
    category: 'ayush_pariksha',
    question: 'Satva Pariksha: How is your mental fortitude and stress tolerance?',
    nativeQuestion: {
      en: 'Satva Pariksha: How is your mental fortitude and stress tolerance?',
      hi: 'सत्व परीक्षा: आपका मानसिक बल एवं तनाव सहने की क्षमता कैसी है?',
      mr: 'सत्व परीक्षा: तुमचे मानसिक बळ आणि ताण सहन करण्याची क्षमता कशी आहे?',
      ta: 'சத்வ பரீக்ஷா: உங்கள் மன உறுதி மற்றும் மன அழுத்த தாங்கும் திறன் எப்படி?',
      te: 'సత్వ పరీక్ష: మీ మానసిక బలం మరియు ఒత్తిడిని తట్టుకునే సామర్థ్యం ఎలా ఉంది?',
      bn: 'সত্ত্ব পরীক্ষা: আপনার মানসিক শক্তি এবং মানসিক চাপ সহ্য করার ক্ষমতা কেমন?'
    },
    subtext: 'Psychological constitution according to Ayurvedic clinical principles',
    inputType: 'single_choice',
    isAyushOnly: true,
    ayushDimension: 'Satva',
    options: [
      { id: 'satva_pravara', label: 'Pravara Satva (Superior)', sublabel: 'Calm under severe distress, patient, highly resilient' },
      { id: 'satva_madhyama', label: 'Madhyama Satva (Moderate)', sublabel: 'Copes well with support, occasional anxiety' },
      { id: 'satva_avara', label: 'Avara Satva (Sensitive)', sublabel: 'Easily agitated, highly anxious, fearful of medical procedures' }
    ]
  },
  {
    id: 'ayush_vyayama',
    step: 4,
    totalSteps: 4,
    category: 'ayush_pariksha',
    question: 'Vyayama Shakti & Bala: What is your physical stamina and physical capacity?',
    nativeQuestion: {
      en: 'Vyayama Shakti & Bala: What is your physical stamina and physical capacity?',
      hi: 'व्यायाम शक्ति एवं बल: आपकी शारीरिक सहनशक्ति एवं कार्यक्षमता कैसी है?',
      mr: 'व्यायाम शक्ती आणि बल: तुमची शारीरिक सहनशीलता आणि कार्यक्षमता कशी आहे?',
      ta: 'வியாயாம சக்தி & பலம்: உங்கள் உடல் சகிப்புத்தன்மை மற்றும் திறன் என்ன?',
      te: 'వ్యాయామ శక్తి మరియు బలం: మీ శారీరక సామర్థ్యం ఎలా ఉంది?',
      bn: 'ব্যায়াম শক্তি এবং বল: আপনার শারীরিক ক্ষমতা ও সহনশীলতা কেমন?'
    },
    subtext: 'Assessment of bodily strength and physical endurance',
    inputType: 'single_choice',
    isAyushOnly: true,
    ayushDimension: 'Vyayama Shakti',
    options: [
      { id: 'vyayama_uttama', label: 'Uttama Bala (High Endurance)', sublabel: 'Can perform heavy physical work without quick fatigue' },
      { id: 'vyayama_madhyama', label: 'Madhyama Bala (Moderate Endurance)', sublabel: 'Comfortable with brisk walking, mild tiredness' },
      { id: 'vyayama_heena', label: 'Heena Bala (Low Endurance)', sublabel: 'Tires quickly with minimal exertion, dyspnea on stairs' }
    ]
  }
];

export const MOCK_DOCUMENTS: MedicalDocument[] = [
  {
    id: 'doc_rx_01',
    title: 'Dr. Ram Manohar Lohia Hospital - OPD Prescription',
    type: 'prescription',
    fileUrl: '/mock_rx_patel.png',
    date: '18 Jan 2026',
    facility: 'RML Hospital, Cardiology OPD, New Delhi',
    doctorName: 'Dr. K. S. Venkatesh (MD, DM Cardio)',
    ocrStatus: 'completed',
    confidenceScore: 96.8,
    rawOcrText: 'RML HOSPITAL OPD CARD #88219. Pt: Rameshwar Patel, 58/M. BP: 154/96 mmHg. Rx: Tab. Telmisartan 40mg PO OD. Tab. Atorvastatin 20mg PO HS. Tab. Metformin 500mg BD. Advised: ECG, Lipid Profile. Review in 1 month.',
    entities: [
      { id: 'e1', category: 'medication', value: 'Telmisartan 40mg', dosage: '40mg', frequency: 'Once daily (OD)', confidence: 99.1, isVerified: true },
      { id: 'e2', category: 'medication', value: 'Atorvastatin 20mg', dosage: '20mg', frequency: 'Bedtime (HS)', confidence: 97.5, isVerified: true },
      { id: 'e3', category: 'medication', value: 'Metformin 500mg', dosage: '500mg', frequency: 'Twice daily (BD)', confidence: 98.4, isVerified: true },
      { id: 'e4', category: 'diagnosis', value: 'Essential Hypertension', confidence: 94.2, isVerified: true },
      { id: 'e5', category: 'investigation', value: '12-Lead ECG & Lipid Profile', confidence: 96.0, isVerified: false },
      { id: 'e6', category: 'date', value: '18-01-2026', confidence: 99.4, isVerified: true }
    ]
  },
  {
    id: 'doc_lab_02',
    title: 'Max Healthcare Biochemistry Comprehensive Lab Report',
    type: 'lab_report',
    fileUrl: '/mock_lab_sunita.png',
    date: '04 Feb 2026',
    facility: 'Max Super Speciality Hospital Labs',
    doctorName: 'Dr. Nivedita Sen (MD Path)',
    ocrStatus: 'completed',
    confidenceScore: 98.2,
    rawOcrText: 'BIOCHEMISTRY DEPARTMENT. Glycated Hemoglobin (HbA1c): 8.8% [High]. Fasting Plasma Glucose: 164 mg/dL [High]. Serum Creatinine: 0.92 mg/dL [Normal]. eGFR: >90 mL/min.',
    entities: [
      { id: 'e7', category: 'investigation', value: 'HbA1c: 8.8%', confidence: 99.5, isVerified: true },
      { id: 'e8', category: 'investigation', value: 'Fasting Plasma Glucose: 164 mg/dL', confidence: 98.9, isVerified: true },
      { id: 'e9', category: 'investigation', value: 'Serum Creatinine: 0.92 mg/dL', confidence: 97.2, isVerified: true },
      { id: 'e10', category: 'diagnosis', value: 'Uncontrolled Type 2 Diabetes Mellitus', confidence: 95.8, isVerified: true }
    ]
  }
];

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'pat_001',
    token: 'A-104',
    roomNo: 'Room 04 (Cardiac OPD)',
    name: 'Rameshwar Prasad Patel',
    nameHindi: 'रामेश्वर प्रसाद पटेल',
    age: 58,
    gender: 'Male',
    phone: '+91 98112 43210',
    abhaId: '91-4829-1029-4412',
    abhaAddress: 'rameshwar.patel@abdm',
    abhaVerified: true,
    department: 'cardiology',
    priority: 'urgent',
    queueStatus: 'waiting',
    historyStatus: 'ready-for-review',
    waitTimeMinutes: 2,
    checkedInTime: '08:42 AM',
    chiefComplaintShort: 'Acute crushing retrosternal chest pain radiating to left arm with diaphoresis',
    vitals: {
      bp: '162/98',
      heartRate: 104,
      spo2: 94,
      temperature: '98.4 °F',
      bmi: 27.8,
      bloodSugar: 178
    },
    redFlag: {
      isTriggered: true,
      title: 'ACUTE CORONARY SYNDROME SUSPICION',
      description: 'Patient reports acute substernal crushing pain (Severity 9/10), onset 2 hours ago, radiating to left arm and jaw, accompanied by profuse diaphoresis and tachycardia.',
      symptoms: [
        'Crushing retrosternal chest pain radiating to left arm',
        'Severe diaphoresis (cold sweats)',
        'Tachycardia (HR 104 bpm)',
        'Elevated BP (162/98 mmHg)'
      ],
      severity: 'critical',
      timestamp: '08:44:12 AM',
      staffAlertSent: true
    },
    structuredHistory: {
      chiefComplaint: {
        primary: 'Retrosternal chest pain radiating to left shoulder and arm',
        onset: 'Sudden onset 2 hours ago while climbing stairs at railway station',
        duration: '2 hours persistent',
        severityScore: 9,
        location: 'Mid-chest, radiating to left jaw, neck and left arm',
        aggravatingFactors: ['Exertion', 'Walking'],
        relievingFactors: ['Rest (partial)']
      },
      historyOfPresentIllness: 'A 58-year-old male with a history of hypertension and dyslipidemia presents with sudden, crushing mid-chest heaviness starting 2 hours ago. Pain radiates to the left arm and jaw. Patient felt nauseated and noticed cold profuse sweating. Denies fever, hemoptysis or syncope. Took one tablet of aspirin 75mg at home with no relief.',
      pastMedicalHistory: [
        { condition: 'Essential Hypertension', diagnosedYear: '2019', currentStatus: 'Active', notes: 'On Telmisartan 40mg OD' },
        { condition: 'Dyslipidemia', diagnosedYear: '2021', currentStatus: 'Active', notes: 'On Atorvastatin 20mg HS' }
      ],
      pastSurgicalHistory: [
        { procedure: 'Appendectomy', year: '2008', hospital: 'District Hospital Jabalpur' }
      ],
      drugHistory: [
        { drugName: 'Telmisartan', dosage: '40mg', frequency: 'OD', adherence: 'Regular', duration: '5 years', isVerifiedByOcr: true },
        { drugName: 'Atorvastatin', dosage: '20mg', frequency: 'HS', adherence: 'Regular', duration: '3 years', isVerifiedByOcr: true }
      ],
      allergyHistory: [
        { allergen: 'Penicillin', reaction: 'Skin rash and facial angioedema', severity: 'Severe (Anaphylaxis Risk)' }
      ],
      familyHistory: [
        { relation: 'Father', condition: 'Myocardial Infarction at age 62 (deceased)' },
        { relation: 'Mother', condition: 'Type 2 Diabetes Mellitus' }
      ],
      personalHistory: {
        diet: 'Vegetarian',
        tobaccoUse: 'Quit bidi 6 years ago (15 pack-years prior)',
        alcoholUse: 'Occasional social use',
        sleep: '6 hours, restless',
        physicalActivity: 'Sedentary'
      },
      reviewOfSystems: [
        { system: 'Cardiovascular', status: 'Abnormal', findings: 'Chest pain, palpitation, diaphoresis' },
        { system: 'Respiratory', status: 'Abnormal', findings: 'Mild exertional dyspnea' },
        { system: 'Gastrointestinal', status: 'Normal', findings: 'Mild nausea without vomiting' },
        { system: 'Neurological', status: 'Normal', findings: 'Alert, oriented x 3, no focal deficits' }
      ],
      previousInvestigations: [
        { testName: 'Lipid Profile - Total Cholesterol', result: '242', unit: 'mg/dL', referenceRange: '< 200', date: 'Jan 2026', status: 'High' },
        { testName: 'Serum Creatinine', result: '1.04', unit: 'mg/dL', referenceRange: '0.7 - 1.2', date: 'Jan 2026', status: 'Normal' }
      ]
    },
    aiSummary: {
      id: 'sum_001',
      patientId: 'pat_001',
      generatedAt: '08:44:30 AM',
      conciseSummary: '58M known hypertensive presenting with acute substernal crushing chest pain radiating to left arm/jaw, diaphoresis, and HR 104 bpm. Strongly suspicious for Acute Coronary Syndrome (STEMI/NSTEMI). Immediate stat ECG and Troponin-I advised.',
      keyPositiveFindings: [
        'Acute retrosternal chest pain (Severity 9/10, 2 hr duration)',
        'Classic radiation to left arm and jaw',
        'Profuse cold sweating (diaphoresis)',
        'Hypertension with elevated intake BP 162/98 mmHg',
        'Strong paternal history of premature coronary artery disease'
      ],
      pertinentNegatives: [
        'No pleuritic pain or postural relief (rules down pericarditis)',
        'No focal neurological deficits (rules down acute CVA)',
        'No lower limb unilateral swelling or calf pain (low DVT risk)'
      ],
      redFlagAlerts: [
        'URGENT: High pre-test probability of Acute Coronary Syndrome',
        'Staff alerted to expedite immediate 12-lead ECG & emergency cardiac bed'
      ],
      differentialDiagnoses: [
        { name: 'Acute Myocardial Infarction (STEMI / NSTEMI)', icdCode: 'I21.9', confidence: 92, clinicalRationale: 'Typical crushing radiation, diaphoresis, age, HTN, smoking history' },
        { name: 'Unstable Angina', icdCode: 'I20.0', confidence: 78, clinicalRationale: 'New onset crescendo angina at low physical exertion' },
        { name: 'Aortic Dissection (rule out)', icdCode: 'I71.0', confidence: 25, clinicalRationale: 'Severe pain in hypertensive patient; check bilateral pulses' }
      ],
      recommendedInvestigations: [
        'Stat 12-Lead ECG (Within 10 mins)',
        'High-Sensitivity Cardiac Troponin-I (hs-cTnI)',
        'Point-of-Care Echocardiogram for Regional Wall Motion Abnormality (RWMA)',
        'Serum Electrolytes and CK-MB'
      ],
      doctorVerification: {
        status: 'pending'
      }
    },
    documents: [MOCK_DOCUMENTS[0]],
    timeline: [
      { id: 't1', date: 'Today, 08:42 AM', yearMonth: 'Sep 2026', title: 'MediKiosk Intake & Triage', category: 'diagnosis', facility: 'City Hospital OPD', summary: 'Patient completed AI kiosk intake. Red flag triggered for acute chest pain.', badgeText: 'Urgent Red Flag', isImportant: true },
      { id: 't2', date: '18 Jan 2026', yearMonth: 'Jan 2026', title: 'Cardiology Review & Prescription Refill', category: 'prescription', facility: 'RML Hospital New Delhi', summary: 'BP 154/96. Telmisartan 40mg and Atorvastatin 20mg renewed.', badgeText: 'Prescription OCR', isImportant: false, documentId: 'doc_rx_01' },
      { id: 't3', date: '14 Nov 2024', yearMonth: 'Nov 2024', title: 'Hypertension Diagnostic Workup', category: 'diagnosis', facility: 'District Hospital', summary: 'Primary diagnosis of Essential HTN established. Started on pharmacotherapy.', badgeText: 'Diagnosis' },
      { id: 't4', date: '12 Sep 2008', yearMonth: 'Sep 2008', title: 'Open Appendectomy', category: 'surgery', facility: 'District Hospital Jabalpur', summary: 'Uncomplicated appendectomy for acute phlegmonous appendicitis.', badgeText: 'Surgical History' }
    ]
  },
  {
    id: 'pat_002',
    token: 'B-208',
    roomNo: 'Room 08 (Internal Medicine)',
    name: 'Sunita Devi Sharma',
    nameHindi: 'सुनीता देवी शर्मा',
    age: 52,
    gender: 'Female',
    phone: '+91 97234 11982',
    abhaId: '82-1923-8821-3390',
    abhaAddress: 'sunita.sharma@abdm',
    abhaVerified: true,
    department: 'general',
    priority: 'attention',
    queueStatus: 'ready',
    historyStatus: 'ready-for-review',
    waitTimeMinutes: 9,
    checkedInTime: '08:35 AM',
    chiefComplaintShort: 'Uncontrolled glycemic follow-up, bilateral distal tingling in feet, fatigue',
    vitals: {
      bp: '138/86',
      heartRate: 78,
      spo2: 98,
      temperature: '98.6 °F',
      bmi: 29.4,
      bloodSugar: 214
    },
    structuredHistory: {
      chiefComplaint: {
        primary: 'Burning sensation and tingling numbness in both feet, generalized fatigue',
        onset: 'Gradual onset over past 3 months',
        duration: '3 months',
        severityScore: 5,
        location: 'Bilateral soles and toes (glove-and-stocking distribution)',
        aggravatingFactors: ['Night time', 'Prolonged walking'],
        relievingFactors: ['Rest', 'Foot massage']
      },
      historyOfPresentIllness: 'A 52-year-old female with known Type 2 Diabetes for 7 years presents for quarterly review. Complains of persistent burning sensation and pins-and-needles numbness in both feet worse at bedtime. Also reports polydipsia and nocturia (2-3 times/night). Recent lab report shows HbA1c of 8.8%.',
      pastMedicalHistory: [
        { condition: 'Type 2 Diabetes Mellitus', diagnosedYear: '2019', currentStatus: 'Active', notes: 'Suboptimally controlled' },
        { condition: 'Hypothyroidism', diagnosedYear: '2021', currentStatus: 'Controlled', notes: 'On Levothyroxine 50mcg' }
      ],
      pastSurgicalHistory: [
        { procedure: 'Caesarean section x 2', year: '1998, 2002', hospital: 'District Women Hospital' }
      ],
      drugHistory: [
        { drugName: 'Metformin', dosage: '500mg', frequency: 'BD', adherence: 'Irregular', duration: '4 years', isVerifiedByOcr: true },
        { drugName: 'Glimepiride', dosage: '1mg', frequency: 'OD', adherence: 'Regular', duration: '2 years' },
        { drugName: 'Levothyroxine', dosage: '50mcg', frequency: 'OD (Empty stomach)', adherence: 'Regular', duration: '5 years' }
      ],
      allergyHistory: [],
      familyHistory: [
        { relation: 'Mother', condition: 'Type 2 Diabetes Mellitus with Diabetic Retinopathy' }
      ],
      personalHistory: {
        diet: 'Vegetarian',
        tobaccoUse: 'Nil',
        alcoholUse: 'Nil',
        sleep: '5 hours, disturbed by nocturia and foot burning',
        physicalActivity: 'Minimal brisk walking'
      },
      reviewOfSystems: [
        { system: 'Endocrine', status: 'Abnormal', findings: 'Polydipsia, nocturia, polyuria' },
        { system: 'Neurological', status: 'Abnormal', findings: 'Distal symmetrical sensory paresthesias' },
        { system: 'Cardiovascular', status: 'Normal', findings: 'No chest pain, no palpitations' }
      ],
      previousInvestigations: [
        { testName: 'HbA1c', result: '8.8', unit: '%', referenceRange: '< 7.0 (Target)', date: 'Feb 2026', status: 'High' },
        { testName: 'Fasting Blood Sugar', result: '164', unit: 'mg/dL', referenceRange: '70 - 100', date: 'Feb 2026', status: 'High' },
        { testName: 'Serum Creatinine', result: '0.92', unit: 'mg/dL', referenceRange: '0.6 - 1.1', date: 'Feb 2026', status: 'Normal' }
      ]
    },
    aiSummary: {
      id: 'sum_002',
      patientId: 'pat_002',
      generatedAt: '08:38:15 AM',
      conciseSummary: '52F with 7-year T2DM presenting with poorly controlled HbA1c (8.8%) and clinical symptoms suggestive of early Diabetic Peripheral Neuropathy (distal symmetrical burning paresthesia). Medication adherence optimization and escalation needed.',
      keyPositiveFindings: [
        'HbA1c 8.8% & Point-of-care capillary blood glucose 214 mg/dL',
        'Bilateral stocking distribution foot numbness & burning paresthesia',
        'Nocturia and osmotic symptoms',
        'Irregular adherence to Metformin'
      ],
      pertinentNegatives: [
        'No active diabetic foot ulcers or skin breakdown',
        'Normal renal parameters (eGFR > 90 mL/min, Creatinine 0.92)',
        'No history of hypoglycemic episodes'
      ],
      redFlagAlerts: [],
      differentialDiagnoses: [
        { name: 'Diabetic Peripheral Neuropathy (DPN)', icdCode: 'E11.42', confidence: 91, clinicalRationale: 'Classic distal symmetrical sensory symptoms in uncontrolled T2DM' },
        { name: 'Uncontrolled Type 2 Diabetes without acute complication', icdCode: 'E11.65', confidence: 95, clinicalRationale: 'HbA1c > 8.5% on dual oral therapy with poor adherence' },
        { name: 'Vitamin B12 Deficiency Neuropathy (Metformin-induced)', icdCode: 'E53.8', confidence: 45, clinicalRationale: 'Long-term Metformin use can lower B12 levels' }
      ],
      recommendedInvestigations: [
        'Urine Microalbumin/Creatinine Ratio (UACR)',
        'Serum Vitamin B12 and Folate levels',
        'Dilated Fundus Examination (Annual Diabetic Retinopathy screening)',
        '10g Semmes-Weinstein Monofilament examination'
      ],
      doctorVerification: {
        status: 'pending'
      }
    },
    documents: [MOCK_DOCUMENTS[1]],
    timeline: [
      { id: 't20', date: 'Today, 08:35 AM', yearMonth: 'Sep 2026', title: 'MediKiosk Intake Completed', category: 'diagnosis', facility: 'City Hospital OPD', summary: 'Pre-consultation history recorded. Lab report scanned.', badgeText: 'Intake Complete' },
      { id: 't21', date: '04 Feb 2026', yearMonth: 'Feb 2026', title: 'Biochemistry Panel (HbA1c 8.8%)', category: 'lab_result', facility: 'Max Super Speciality Hospital', summary: 'Uncontrolled glycemic markers. Normal creatinine.', badgeText: 'Lab Report OCR', documentId: 'doc_lab_02' },
      { id: 't22', date: '19 Aug 2025', yearMonth: 'Aug 2025', title: 'Endocrinology OPD Review', category: 'consultation', facility: 'City Hospital', summary: 'Glimepiride 1mg added to Metformin 500mg BD.', badgeText: 'Prescription' }
    ]
  },
  {
    id: 'pat_003',
    token: 'C-312',
    roomNo: 'Room 12 (AYUSH OPD)',
    name: 'Aarav Mukhopadhyay',
    nameHindi: 'आरव मुखोपाध्याय',
    age: 34,
    gender: 'Male',
    phone: '+91 94330 89124',
    abhaId: '77-3819-0931-1122',
    abhaAddress: 'aarav.m@abdm',
    abhaVerified: true,
    department: 'ayush',
    priority: 'normal',
    queueStatus: 'ready',
    historyStatus: 'ready-for-review',
    waitTimeMinutes: 14,
    checkedInTime: '08:48 AM',
    chiefComplaintShort: 'Chronic Agnimandya (indigestion), bloating, irregular bowel habits, Vata-Pitta Prakriti',
    vitals: {
      bp: '122/78',
      heartRate: 72,
      spo2: 99,
      temperature: '98.2 °F',
      bmi: 22.1
    },
    structuredHistory: {
      chiefComplaint: {
        primary: 'Chronic postprandial heaviness, sour belching (Amlapitta), and irregular bowels (Agnimandya)',
        onset: 'Insidious onset over 6 months',
        duration: '6 months',
        severityScore: 4,
        location: 'Epigastric and periumbilical regions',
        aggravatingFactors: ['Late dinner', 'Spicy foods', 'Mental stress / screen time'],
        relievingFactors: ['Warm water', 'Light fasting (Langhana)']
      },
      historyOfPresentIllness: 'A 34-year-old software engineer presents to the AYUSH OPD complaining of sluggish digestion, persistent post-meal bloating, and variable appetite for 6 months. Reports irregular sleep habits (working late shifts) and erratic meal timings. Seeking holistic Ayurvedic management.',
      pastMedicalHistory: [],
      pastSurgicalHistory: [],
      drugHistory: [
        { drugName: 'Pantoprazole 40mg', dosage: '40mg', frequency: 'PRN', adherence: 'Irregular', duration: 'Used on and off' }
      ],
      allergyHistory: [],
      familyHistory: [],
      personalHistory: {
        diet: 'Vegetarian, irregular timings, frequent tea/coffee',
        tobaccoUse: 'Nil',
        alcoholUse: 'Nil',
        sleep: '5-6 hours, erratic circadian rhythm',
        physicalActivity: 'Sedentary desk work'
      },
      reviewOfSystems: [
        { system: 'Gastrointestinal', status: 'Abnormal', findings: 'Vishamagni, Adhmana (flatulence), Vidaha (burning sensation)' }
      ],
      previousInvestigations: [],
      dashavidhaPariksha: {
        prakriti: { vata: 50, pitta: 35, kapha: 15, primaryDosha: 'Vata-Pitta Dvandvaja' },
        vikriti: 'Vishamagni with Pitta-Kapha Samana',
        sara: 'Madhyama Twak & Meda Sara',
        samhanana: 'Madhyama (Medium body compactness)',
        pramana: 'Prakrita (Normal body proportions)',
        satmya: 'Katu-Lavana Satmya (accustomed to pungent-salty tastes)',
        satva: 'Madhyama (Moderate resilience, mild work-related anxiety)',
        aharaShakti: { abhyavaharana: 'Visham (Irregular intake)', jarana: 'Mandata (Delayed digestion > 4 hours)' },
        vyayamaShakti: 'Madhyama',
        vaya: 'Madhyama (Yuvavastha)'
      }
    },
    aiSummary: {
      id: 'sum_003',
      patientId: 'pat_003',
      generatedAt: '08:51:02 AM',
      conciseSummary: '34M with Vata-Pitta Prakriti presenting with chronic Agnimandya, Amlapitta (acid dyspepsia), and Vishama Koshta exacerbated by Ratrijagarana (late nights) and sedentary routine. Dashavidha Pariksha indicates Vishamagni with Madhyama Bala. Deepana-Pachana and Ahara-Vihara regulation suggested.',
      keyPositiveFindings: [
        'Vata-Pitta Prakriti with Vishamagni (irregular digestive fire)',
        'Sluggish digestion with postprandial Adhmana (bloating) and Vidaha',
        'Ratrijagarana (erratic night work shifts) directly aggravating Vata and Pitta',
        'Madhyama Satva and sedentary Vyayama Shakti'
      ],
      pertinentNegatives: [
        'No gastrointestinal bleeding, weight loss, or dysphagia (rules down malignancy/ulcer bleed)',
        'No organomegaly or localized severe peritoneal tenderness'
      ],
      redFlagAlerts: [],
      differentialDiagnoses: [
        { name: 'Agnimandya / Grahani Dosha (Ayurvedic)', icdCode: 'K30 (Functional Dyspepsia)', confidence: 94, clinicalRationale: 'Classic digestive fire disturbance with irregular appetite & sluggish bowel' },
        { name: 'Amlapitta (Pitta Prakopa)', icdCode: 'K21.9 (GERD)', confidence: 85, clinicalRationale: 'Sour belching, epigastric burning aggravated by spicy food and night-shifts' }
      ],
      recommendedInvestigations: [
        'Routine Complete Blood Count (CBC)',
        'Upper GI Ultrasound (to rule out cholelithiasis)',
        'Stool Routine & Microscopy'
      ],
      doctorVerification: {
        status: 'pending'
      }
    },
    documents: [],
    timeline: [
      { id: 't30', date: 'Today, 08:48 AM', yearMonth: 'Sep 2026', title: 'AYUSH Dashavidha Pariksha Intake', category: 'diagnosis', facility: 'City Hospital AYUSH OPD', summary: 'Completed Prakriti, Agni, and Satva digital assessment.', badgeText: 'AYUSH Pariksha' }
    ]
  },
  {
    id: 'pat_004',
    token: 'A-109',
    roomNo: 'Room 05 (Orthopedic OPD)',
    name: 'Meenakshi Sundaram',
    nameHindi: 'मीनाक्षी सुंदरम',
    age: 64,
    gender: 'Female',
    phone: '+91 94441 55670',
    abhaId: '63-9182-4402-9912',
    abhaAddress: 'meenakshi.s@abdm',
    abhaVerified: true,
    department: 'orthopedics',
    priority: 'normal',
    queueStatus: 'waiting',
    historyStatus: 'ready-for-review',
    waitTimeMinutes: 18,
    checkedInTime: '08:52 AM',
    chiefComplaintShort: 'Bilateral knee joint pain and morning stiffness for 2 years, worse with stairs',
    vitals: {
      bp: '134/82',
      heartRate: 74,
      spo2: 98,
      temperature: '98.4 °F',
      bmi: 28.2
    },
    structuredHistory: {
      chiefComplaint: {
        primary: 'Bilateral knee pain, crepitus, and difficulty climbing stairs',
        onset: 'Gradual onset 2 years ago',
        duration: '2 years',
        severityScore: 6,
        location: 'Both knee joints (Right > Left)',
        aggravatingFactors: ['Stairs', 'Squatting', 'Cold weather'],
        relievingFactors: ['Rest', 'Knee brace', 'Analgesic gel']
      },
      historyOfPresentIllness: 'A 64-year-old female presents with progressive pain in bilateral knees for 2 years. Describes morning stiffness lasting under 20 minutes, audible crepitus, and pain aggravated by weight-bearing. Denies joint redness or warm effusions.',
      pastMedicalHistory: [
        { condition: 'Primary Osteoarthritis', diagnosedYear: '2024', currentStatus: 'Active' }
      ],
      pastSurgicalHistory: [],
      drugHistory: [
        { drugName: 'Paracetamol 650mg', dosage: '650mg', frequency: 'PRN', adherence: 'Regular', duration: '1 year' }
      ],
      allergyHistory: [],
      familyHistory: [],
      personalHistory: {
        diet: 'Vegetarian',
        tobaccoUse: 'Nil',
        alcoholUse: 'Nil',
        sleep: '6 hours',
        physicalActivity: 'Limited by knee pain'
      },
      reviewOfSystems: [
        { system: 'Musculoskeletal', status: 'Abnormal', findings: 'Knee crepitus, reduced flexion range, tender joint line' }
      ],
      previousInvestigations: []
    },
    aiSummary: {
      id: 'sum_004',
      patientId: 'pat_004',
      generatedAt: '08:54:10 AM',
      conciseSummary: '64F with progressive bilateral knee pain, weight-bearing exacerbation, and morning stiffness < 30 mins, highly characteristic of Primary Knee Osteoarthritis (Kellgren-Lawrence Grade II-III suspicion).',
      keyPositiveFindings: [
        'Bilateral knee pain, crepitus, and stair climbing limitation',
        'Brief morning stiffness (< 30 min) favoring non-inflammatory etiology',
        'Age 64 and BMI 28.2 providing biomechanical predisposition'
      ],
      pertinentNegatives: [
        'No systemic fever or multiple joint polyarthritis (rules against rheumatoid arthritis)',
        'No hot swollen joint (rules down septic arthritis)'
      ],
      redFlagAlerts: [],
      differentialDiagnoses: [
        { name: 'Primary Osteoarthritis of Bilateral Knees', icdCode: 'M17.0', confidence: 94, clinicalRationale: 'Classic mechanical knee pain with crepitus and age' },
        { name: 'Pes Anserine Bursitis', icdCode: 'M70.5', confidence: 35, clinicalRationale: 'Medial joint line tenderness often co-exists' }
      ],
      recommendedInvestigations: [
        'Weight-bearing Bilateral Knee X-Ray (AP and Lateral views)',
        'Serum Uric Acid and ESR'
      ],
      doctorVerification: {
        status: 'pending'
      }
    },
    documents: [],
    timeline: []
  }
];

export const MOCK_AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: 'log_01',
    timestamp: '08:44:12 AM',
    actor: 'MediKiosk AI Core',
    role: 'System_AI',
    action: 'URGENT_RED_FLAG_TRIGGERED',
    patientToken: 'A-104',
    details: 'Acute substernal chest pain + diaphoresis detected. Broadcast alert sent to Nursing Station & Triage Monitor.',
    ipAddress: '192.168.1.104 (Terminal Kiosk-01)',
    status: 'ALERT'
  },
  {
    id: 'log_02',
    timestamp: '08:42:04 AM',
    actor: 'Rameshwar Patel',
    role: 'Patient',
    action: 'ABHA_CONSENT_GRANTED',
    patientToken: 'A-104',
    details: 'Patient granted ABDM Health Data Sharing consent (Purpose: OPD Clinical Triage, Valid for 24h).',
    ipAddress: '192.168.1.104 (Terminal Kiosk-01)',
    status: 'SUCCESS'
  },
  {
    id: 'log_03',
    timestamp: '08:37:45 AM',
    actor: 'MediKiosk OCR Engine',
    role: 'System_AI',
    action: 'DOCUMENT_OCR_PROCESSED',
    patientToken: 'B-208',
    details: 'Biochemistry Lab report processed. Extracted HbA1c 8.8%, Fasting Blood Sugar 164 mg/dL with 98.2% confidence.',
    ipAddress: '192.168.1.108 (Terminal Kiosk-02)',
    status: 'SUCCESS'
  },
  {
    id: 'log_04',
    timestamp: '08:35:10 AM',
    actor: 'Sunita Sharma',
    role: 'Patient',
    action: 'ABHA_AUTH_SUCCESS',
    patientToken: 'B-208',
    details: 'ABHA 82-1923-8821-3390 authenticated via OTP and demographic match.',
    ipAddress: '192.168.1.108 (Terminal Kiosk-02)',
    status: 'SUCCESS'
  },
  {
    id: 'log_05',
    timestamp: '08:31:22 AM',
    actor: 'Dr. Venkatesh K.S.',
    role: 'Doctor',
    action: 'AI_SUMMARY_ACCEPTED',
    patientToken: 'A-098',
    details: 'Physician accepted AI clinical summary with minor modification to medication dosage.',
    ipAddress: '192.168.2.14 (Workstation Room-04)',
    status: 'SUCCESS'
  }
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
  activeKiosks: [
    { id: 'Kiosk-01', location: 'Gate 2 OPD Triage', status: 'In Use', patientToken: 'A-104', language: 'Hindi' },
    { id: 'Kiosk-02', location: 'Main OPD Lobby', status: 'In Use', patientToken: 'B-208', language: 'Hindi' },
    { id: 'Kiosk-03', location: 'AYUSH Wing 1st Floor', status: 'Ready', patientToken: 'C-312', language: 'English' },
    { id: 'Kiosk-04', location: 'Gate 3 Ortho Block', status: 'Ready', patientToken: 'Idle', language: 'Marathi' }
  ]
};
