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
      { id: 'chest_pain', label: 'Chest Pain or Heaviness', nativeLabel: { hi: 'सीने में दर्द या भारीपन', mr: 'छातीत दुखणे किंवा जडपणा', ta: 'மார்பு வலி அல்லது கனம்', te: 'ఛాతీ నొప్పి లేదా బరువుగా అనిపించడం', bn: 'বুকে ব্যথা বা ভারী ভাব' }, sublabel: 'Pain in center or left side of chest', isRedFlag: true },
      { id: 'fever_bodyache', label: 'Fever and Chills', nativeLabel: { hi: 'बुखार एवं शरीर दर्द', mr: 'ताप आणि अंगदुखी', ta: 'காய்ச்சல் மற்றும் நடுக்கம்', te: 'జ్వరం మరియు వణుకు', bn: 'জ্বর ও শরীরে কাঁপুনি' }, sublabel: 'High temperature, shivering' },
      { id: 'cough_breathless', label: 'Severe Breathlessness', nativeLabel: { hi: 'सांस लेने में भारी तकलीफ', mr: 'श्वास घेण्यास तीव्र त्रास', ta: 'கடுமையான மூச்சுத் திணறல்', te: 'తీవ్రమైన ఊపిరి ఆడకపోవడం', bn: 'শ্বাসকষ্টের তীব্র সমস্যা' }, sublabel: 'Difficulty breathing even while resting', isRedFlag: true },
      { id: 'stomach_pain', label: 'Stomach Pain / Vomiting', nativeLabel: { hi: 'पेट में तेज दर्द / उल्टी', mr: 'पोटदुखी / उलटी', ta: 'வயிற்று வலி / வாந்தி', te: 'కడుపు నొప్పి / వాంతులు', bn: 'পেটে ব্যথা / বমি' }, sublabel: 'Abdominal cramps, acidity or loose stools' },
      { id: 'joint_pain', label: 'Joint / Back Pain', nativeLabel: { hi: 'जोड़ों या कमर का पुराना दर्द', mr: 'सांधे किंवा पाठदुखी', ta: 'மூட்டு / முதுகு வலி', te: 'కీళ్ల / నడుము నొప్పి', bn: 'জয়েন্ট / কোমরে ব্যথা' }, sublabel: 'Knee, back, shoulder or neck stiffness' },
      { id: 'chronic_followup', label: 'Routine BP / Diabetes Follow-up', nativeLabel: { hi: 'बीपी / शुगर की नियमित जांच', mr: 'बीपी / शुगर नियमित तपासणी', ta: 'வழக்கமான பிபி / சர்க்கரை பரிசோதனை', te: 'సాధారణ బీపీ / షుగర్ తనిఖీ', bn: 'নিয়মিত বিপি / সুগার পরীক্ষা' }, sublabel: 'Medication refill, general review' }
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
      { id: 'loc_chest_arm', label: 'Chest radiating to left arm or jaw', nativeLabel: { hi: 'सीने से बाएं हाथ या जबड़े तक', mr: 'छातीपासून डाव्या हातापर्यंत किंवा जबड्यापर्यंत पसरणे', ta: 'மார்பிலிருந்து இடது கை அல்லது தாடை வரை பரவுதல்', te: 'ఛాతీ నుండి ఎడమ చేయి లేదా దవడకు వ్యాపించడం', bn: 'বুক থেকে বাম হাত বা চোয়াল পর্যন্ত ছড়িয়ে পড়া' }, sublabel: 'Substernal pressure spreading to neck/arm', isRedFlag: true },
      { id: 'loc_head_temple', label: 'Head / Forehead / Temples', nativeLabel: { hi: 'सिर / माथा / दोनों तरफ', mr: 'डोके / कपाळ / कानशिले', ta: 'தலை / நெற்றி / நெற்றிப் பகுதிகள்', te: 'తల / నుదురు / తల పక్క భాగాలు', bn: 'মাথা / কপাল / কপালের দুই পাশ' }, sublabel: 'Throbbing or continuous headache' },
      { id: 'loc_upper_abdomen', label: 'Upper abdomen below ribs', nativeLabel: { hi: 'पेट का ऊपरी हिस्सा (पसलियों के नीचे)', mr: 'पोटाचा वरचा भाग (बरगड्यांच्या खाली)', ta: 'வயிற்றின் மேல் பகுதி (விலா எலும்புகளுக்கு கீழே)', te: 'పొట్ట పైభాగం (పక్కటెముకల కింద)', bn: 'পেটের উপরের অংশ (পাঁজরের নিচে)' }, sublabel: 'Burning sensation or epigastric fullness' },
      { id: 'loc_knees', label: 'Both knees / Lower back', nativeLabel: { hi: 'दोनों घुटने अथवा कमर', mr: 'दोन्ही गुडघे किंवा कंबर', ta: 'இரு முழங்கால்கள் / முதுகுத் தண்டு கீழ்பகுதி', te: 'రెండు మోకాళ్లు / నడుము కింది భాగం', bn: 'দুই হাঁটু / কোমরের নিচের অংশ' }, sublabel: 'Pain worse while standing or climbing stairs' },
      { id: 'loc_generalized', label: 'Whole body aches / General weakness', nativeLabel: { hi: 'पूरे शरीर में दर्द / भारी कमजोरी', mr: 'संपूर्ण शरीर दुखणे / सामान्य अशक्तपणा', ta: 'முழு உடல் வலி / பொது பலவீனம்', te: 'శరీరం మొత్తం నొప్పి / సాధారణ నీరసం', bn: 'সারা শরীরে ব্যথা / সাধারণ দুর্বলতা' }, sublabel: 'Fatigue, tiredness all over' }
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
      { id: 'dur_acute_hours', label: 'Started suddenly within last 24 hours', nativeLabel: { hi: 'अचानक पिछले 24 घंटों में शुरू हुआ', mr: 'गेल्या 24 तासांत अचानक सुरू झाले', ta: 'கடந்த 24 மணி நேரத்தில் திடீரென தொடங்கியது', te: 'గత 24 గంటల్లో అకస్మాత్తుగా మొదలైంది', bn: 'গত ২৪ ঘণ্টার মধ্যে হঠাৎ শুরু হয়েছে' }, sublabel: 'Acute onset, intense', isRedFlag: true },
      { id: 'dur_few_days', label: 'Last 2 to 7 days', nativeLabel: { hi: 'पिछले 2 से 7 दिनों से', mr: 'गेल्या 2 ते 7 दिवसांपासून', ta: 'கடந்த 2 முதல் 7 நாட்களாக', te: 'గత 2 నుండి 7 రోజులుగా', bn: 'গত ২ থেকে ৭ দিন ধরে' }, sublabel: 'Recent onset' },
      { id: 'dur_weeks', label: '1 to 4 weeks', nativeLabel: { hi: '1 से 4 हफ्तों से', mr: '1 ते 4 आठवड्यांपासून', ta: '1 முதல் 4 வாரங்களாக', te: '1 నుండి 4 వారాలుగా', bn: '১ থেকে ৪ সপ্তাহ ধরে' }, sublabel: 'Gradually worsening' },
      { id: 'dur_months', label: 'Long term (More than 1 month)', nativeLabel: { hi: 'काफी लंबे समय से (1 महीने से अधिक)', mr: 'बराच काळ (1 महिन्यापेक्षा जास्त)', ta: 'நீண்ட காலமாக (1 மாதத்திற்கு மேல்)', te: 'చాలా కాలంగా (1 నెలకు మించి)', bn: 'দীর্ঘদিন ধরে (১ মাসের বেশি)' }, sublabel: 'Chronic persistent ailment' }
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
      { id: 'sev_mild', label: 'Mild (1 - 3)', nativeLabel: { hi: 'हल्का (1-3)', mr: 'सौम्य (1-3)', ta: 'லேசானது (1-3)', te: 'తేలికపాటి (1-3)', bn: 'মৃদু (১-৩)' }, sublabel: 'Noticeable but does not disrupt daily work' },
      { id: 'sev_moderate', label: 'Moderate (4 - 6)', nativeLabel: { hi: 'मध्यम (4-6)', mr: 'मध्यम (4-6)', ta: 'மிதமானது (4-6)', te: 'మధ్యస్థం (4-6)', bn: 'মাঝারি (৪-৬)' }, sublabel: 'Difficult to ignore, hampers daily routine' },
      { id: 'sev_severe', label: 'Severe (7 - 8)', nativeLabel: { hi: 'गंभीर (7-8)', mr: 'तीव्र (7-8)', ta: 'கடுமையானது (7-8)', te: 'తీవ్రమైనది (7-8)', bn: 'গুরুতর (৭-৮)' }, sublabel: 'Significant distress, resting is required' },
      { id: 'sev_extreme', label: 'Crushing / Unbearable (9 - 10)', nativeLabel: { hi: 'असहनीय (9-10)', mr: 'असह्य (9-10)', ta: 'தாங்க முடியாதது (9-10)', te: 'భరించలేనిది (9-10)', bn: 'অসহনীয় (৯-১০)' }, sublabel: 'Immediate attention required', isRedFlag: true }
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
      { id: 'rf_sweating', label: 'Cold Profuse Sweating / Diaphoresis', nativeLabel: { hi: 'अचानक ठंडा पसीना आना', mr: 'अचानक थंड घाम येणे', ta: 'குளிர்ந்த அதிக வியர்வை', te: 'చల్లని విపరీత చెమట', bn: 'হঠাৎ ঠান্ডা ঘাম' }, isRedFlag: true },
      { id: 'rf_breathless', label: 'Severe Shortness of Breath while resting', nativeLabel: { hi: 'बैठे-बैठे सांस फूलना', mr: 'बसल्या जागी श्वास फुलणे', ta: 'ஓய்வில் இருக்கும்போதும் மூச்சு திணறல்', te: 'విశ్రాంతిలో కూడా ఊపిరి ఆడకపోవడం', bn: 'বিশ্রামেও শ্বাসকষ্ট' }, isRedFlag: true },
      { id: 'rf_dizziness', label: 'Dizziness or Near-Fainting', nativeLabel: { hi: 'चक्कर आना या बेहोशी जैसा लगना', mr: 'चक्कर येणे किंवा बेशुद्ध पडल्यासारखे वाटणे', ta: 'தலைச்சுற்றல் அல்லது மயக்கம் போன்ற உணர்வு', te: 'తలతిరగడం లేదా మూర్ఛ వచ్చినట్టు అనిపించడం', bn: 'মাথা ঘোরা বা অজ্ঞান হওয়ার মতো অনুভূতি' }, isRedFlag: true },
      { id: 'rf_vomiting', label: 'Nausea or Vomiting', nativeLabel: { hi: 'उल्टी या जी मिचलाना', mr: 'मळमळ किंवा उलटी', ta: 'குமட்டல் அல்லது வாந்தி', te: 'వికారం లేదా వాంతులు', bn: 'বমি বমি ভাব বা বমি' } },
      { id: 'rf_none', label: 'None of the above critical signs', nativeLabel: { hi: 'उपरोक्त में से कोई नहीं', mr: 'वरीलपैकी काहीही नाही', ta: 'மேற்கண்டவை எதுவும் இல்லை', te: 'పైవేవీ లేవు', bn: 'উপরের কোনোটিই নয়' } }
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
      { id: 'pmh_htn', label: 'High Blood Pressure (Hypertension)', nativeLabel: { hi: 'उच्च रक्तचाप (High BP)', mr: 'उच्च रक्तदाब (हाय बीपी)', ta: 'அதிக இரத்த அழுத்தம் (பிபி)', te: 'అధిక రక్తపోటు (బీపీ)', bn: 'উচ্চ রক্তচাপ (হাই বিপি)' } },
      { id: 'pmh_dm', label: 'Diabetes (High Blood Sugar)', nativeLabel: { hi: 'मधुमेह / शुगर (Diabetes)', mr: 'मधुमेह / साखर (डायबिटीस)', ta: 'நீரிழிவு / சர்க்கரை நோய்', te: 'మధుమేహం / షుగర్ వ్యాధి', bn: 'ডায়াবেটিস / সুগার' } },
      { id: 'pmh_cad', label: 'Previous Heart Disease / Stent / Angio', nativeLabel: { hi: 'दिल की बीमारी / स्टेंट / एंजियोप्लास्टी', mr: 'हृदयरोग / स्टेंट / अँजिओप्लास्टी', ta: 'முன்னர் இதய நோய் / ஸ்டென்ட் / ஆஞ்சியோ', te: 'గుండె జబ్బు / స్టెంట్ / యాంజియో చరిత్ర', bn: 'হৃদরোগ / স্টেন্ট / অ্যাঞ্জিওপ্লাস্টি' } },
      { id: 'pmh_asthma', label: 'Asthma / COPD / Breathing issue', nativeLabel: { hi: 'दमा / अस्थमा', mr: 'दमा / श्वसनाचा त्रास', ta: 'ஆஸ்துமா / மூச்சுத் திணறல் பிரச்சனை', te: 'ఆస్తమా / శ్వాస సమస్య', bn: 'হাঁপানি / শ্বাসকষ্টের সমস্যা' } },
      { id: 'pmh_thyroid', label: 'Thyroid disorder', nativeLabel: { hi: 'थायराइड की समस्या', mr: 'थायरॉइडची समस्या', ta: 'தைராய்டு பிரச்சனை', te: 'థైరాయిడ్ సమస్య', bn: 'থাইরয়েডের সমস্যা' } },
      { id: 'pmh_none', label: 'No prior diagnosed illnesses', nativeLabel: { hi: 'कोई पूर्व बीमारी नहीं', mr: 'कोणताही पूर्वीचा आजार नाही', ta: 'முந்தைய நோய் எதுவும் இல்லை', te: 'గతంలో ఎలాంటి వ్యాధి లేదు', bn: 'পূর্বে কোনো রোগ নেই' } }
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
      { id: 'med_taking_regular', label: 'Yes, I take daily medicines regularly', nativeLabel: { hi: 'हाँ, मैं नियमित रूप से दवाएं लेता हूँ', mr: 'होय, मी नियमितपणे औषधे घेतो', ta: 'ஆம், நான் தினமும் மருந்துகள் எடுத்துக்கொள்கிறேன்', te: 'అవును, నేను రోజూ మందులు తీసుకుంటాను', bn: 'হ্যাঁ, আমি নিয়মিত ওষুধ খাই' } },
      { id: 'med_allergy_penicillin', label: 'Known allergy to Penicillin / Sulfa drugs', nativeLabel: { hi: 'पेनिसिलिन / सल्फा दवाओं से एलर्जी है', mr: 'पेनिसिलिन / सल्फा औषधांची ऍलर्जी आहे', ta: 'பென்சிலின் / சல்பா மருந்துகளுக்கு ஒவ்வாமை உண்டு', te: 'పెన్సిలిన్ / సల్ఫా మందులకు అలెర్జీ ఉంది', bn: 'পেনিসিলিন / সালফা ওষুধে অ্যালার্জি আছে' } },
      { id: 'med_no_daily', label: 'No daily medications & no known drug allergies', nativeLabel: { hi: 'कोई नियमित दवाई नहीं एवं कोई एलर्जी नहीं', mr: 'कोणतीही नियमित औषधे नाहीत आणि कोणतीही ऍलर्जी नाही', ta: 'வழக்கமான மருந்துகள் இல்லை, ஒவ்வாமையும் இல்லை', te: 'రోజువారీ మందులు లేవు, ఎలాంటి అలెర్జీ లేదు', bn: 'নিয়মিত কোনো ওষুধ নেই এবং কোনো অ্যালার্জি নেই' } }
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
      { id: 'char_crushing', label: 'Crushing Heavy Pressure', nativeLabel: { hi: 'छाती पर भारी वजन या जकड़न', mr: 'छातीवर जड दाब किंवा घट्टपणा', ta: 'மார்பில் கனமான அழுத்தம் அல்லது இறுக்கம்', te: 'ఛాతీపై బరువైన ఒత్తిడి లేదా బిగుసుకుపోవడం', bn: 'বুকে ভারী চাপ বা আঁটসাঁট ভাব' }, sublabel: 'Feels like an elephant sitting on chest', isRedFlag: true },
      { id: 'char_burning', label: 'Burning / Hot Acidity', nativeLabel: { hi: 'जलन अथवा एसिडिटी जैसा दर्द', mr: 'जळजळ किंवा ऍसिडिटीसारखी वेदना', ta: 'எரிச்சல் / அமிலத்தன்மை போன்ற வலி', te: 'మంట లేదా అసిడిటీ వంటి నొప్పి', bn: 'জ্বালাপোড়া বা অ্যাসিডিটির মতো ব্যথা' }, sublabel: 'Substernal fire sensation, worse when lying flat' },
      { id: 'char_sharp', label: 'Sharp Stabbing / Needle-like', nativeLabel: { hi: 'तेज चुभन जैसा दर्द', mr: 'सुईसारखी तीक्ष्ण टोचणारी वेदना', ta: 'கூர்மையான குத்தும் வலி', te: 'సూది గుచ్చినట్టు పదునైన నొప్పి', bn: 'সূচ ফোটানোর মতো তীব্র ব্যথা' }, sublabel: 'Pinpoint sharp pain with deep breaths' },
      { id: 'char_dull', label: 'Dull Continuous Ache', nativeLabel: { hi: 'हल्का लगातार दर्द', mr: 'सौम्य सततची वेदना', ta: 'மந்தமான தொடர்ச்சியான வலி', te: 'మందకొడి నిరంతర నొప్పి', bn: 'হালকা কিন্তু অবিরাম ব্যথা' }, sublabel: 'Non-radiating constant muscular ache' }
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
      { id: 'rad_arm_jaw', label: 'Radiating to Left Arm, Neck, or Jaw', nativeLabel: { hi: 'बाएं हाथ या जबड़े में', mr: 'डाव्या हातात, मानेत किंवा जबड्यात पसरणे', ta: 'இடது கை, கழுத்து அல்லது தாடைக்கு பரவுதல்', te: 'ఎడమ చేయి, మెడ లేదా దవడకు వ్యాపించడం', bn: 'বাম হাত, ঘাড় বা চোয়ালে ছড়িয়ে পড়া' }, sublabel: 'Classical sign of coronary artery insufficiency', isRedFlag: true },
      { id: 'rad_back', label: 'Radiating straight to Upper Back / Interscapular', nativeLabel: { hi: 'पीठ में', mr: 'पाठीत / खांद्याच्या मध्ये पसरणे', ta: 'முதுகில் / தோள்பட்டைகளுக்கு இடையே பரவுதல்', te: 'వీపులో / భుజాస్థుల మధ్య వ్యాపించడం', bn: 'পিঠে / কাঁধের মাঝখানে ছড়িয়ে পড়া' }, sublabel: 'Tearing or piercing sensation between shoulder blades' },
      { id: 'rad_epigastric', label: 'Spreading downwards to Upper Abdomen', nativeLabel: { hi: 'पेट के ऊपरी भाग में', mr: 'पोटाच्या वरच्या भागाकडे पसरणे', ta: 'வயிற்றின் மேல் பகுதிக்கு பரவுதல்', te: 'పొట్ట పైభాగానికి వ్యాపించడం', bn: 'পেটের উপরের অংশে ছড়িয়ে পড়া' }, sublabel: 'Epigastric discomfort with fullness' },
      { id: 'rad_localized', label: 'Strictly localized to one spot, does not travel', nativeLabel: { hi: 'सिर्फ एक जगह', mr: 'फक्त एकाच ठिकाणी, पसरत नाही', ta: 'ஒரே இடத்தில் மட்டும், பரவாது', te: 'ఒకే చోట మాత్రమే, వ్యాపించదు', bn: 'শুধুমাত্র একই জায়গায়, ছড়ায় না' }, sublabel: 'Does not radiate' }
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
      { id: 'rel_worse_exertion', label: 'Worse with walking / stairs; relieved by resting', nativeLabel: { hi: 'चलने पर बढ़ता है, आराम करने पर कम होता है', mr: 'चालल्याने वाढते, विश्रांतीने कमी होते', ta: 'நடக்கும்போது அதிகரிக்கும், ஓய்வெடுக்கும்போது குறையும்', te: 'నడిచినప్పుడు పెరుగుతుంది, విశ్రాంతితో తగ్గుతుంది', bn: 'হাঁটলে বাড়ে, বিশ্রামে কমে' }, sublabel: 'Strong indicator of effort angina / ischemia', isRedFlag: true },
      { id: 'rel_worse_breathing', label: 'Worse with deep inspiration / coughing', nativeLabel: { hi: 'गहरी सांस लेने या खांसने पर बढ़ता है', mr: 'दीर्घ श्वास घेतल्याने किंवा खोकल्याने वाढते', ta: 'ஆழமாக மூச்சு விடும்போது / இருமும்போது அதிகரிக்கும்', te: 'లోతుగా ఊపిరి పీల్చినప్పుడు / దగ్గినప్పుడు పెరుగుతుంది', bn: 'গভীর শ্বাস নিলে বা কাশলে বাড়ে' }, sublabel: 'Pleuritic or musculoskeletal etiology' },
      { id: 'rel_worse_food', label: 'Worse after oily/spicy food; relieved by antacids', nativeLabel: { hi: 'भोजन के बाद बढ़ता है, एंटासिड से आराम मिलता है', mr: 'तेलकट/तिखट अन्नानंतर वाढते, अँटासिडने आराम मिळतो', ta: 'எண்ணெய்/காரமான உணவுக்குப் பிறகு அதிகரிக்கும்', te: 'నూనె/కారం ఆహారం తర్వాత పెరుగుతుంది, యాంటాసిడ్‌తో తగ్గుతుంది', bn: 'তেল/ঝাল খাবারের পর বাড়ে, অ্যান্টাসিডে কমে' }, sublabel: 'Gastroesophageal reflux / dyspepsia' },
      { id: 'rel_constant', label: 'Constant unchanging intensity at all times', nativeLabel: { hi: 'लगातार एक जैसा रहता है', mr: 'सतत सारखेच राहते', ta: 'எப்போதும் மாறாமல் அப்படியே இருக்கும்', te: 'ఎప్పుడూ మారకుండా అలాగే ఉంటుంది', bn: 'সবসময় একই রকম থাকে' }, sublabel: 'No change with movement or rest' }
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
      { id: 'prakriti_vata', label: 'Vata Predominant', nativeLabel: { hi: 'वात प्रधान', mr: 'वातप्रधान', ta: 'வாத மேலோங்கிய இயல்பு', te: 'వాత ప్రధానం', bn: 'বাত প্রধান' }, sublabel: 'Slender build, quick movements, dry skin, sensitive to cold winds' },
      { id: 'prakriti_pitta', label: 'Pitta Predominant', nativeLabel: { hi: 'पित्त प्रधान', mr: 'पित्तप्रधान', ta: 'பித்த மேலோங்கிய இயல்பு', te: 'పిత్త ప్రధానం', bn: 'পিত্ত প্রধান' }, sublabel: 'Medium build, sharp appetite, heat-intolerant, reddish complexion' },
      { id: 'prakriti_kapha', label: 'Kapha Predominant', nativeLabel: { hi: 'कफ प्रधान', mr: 'कफप्रधान', ta: 'கப மேலோங்கிய இயல்பு', te: 'కఫ ప్రధానం', bn: 'কফ প্রধান' }, sublabel: 'Solid heavy build, calm demeanor, steady endurance, oily skin' },
      { id: 'prakriti_vatapitta', label: 'Vata-Pitta Dvandvaja', nativeLabel: { hi: 'वात-पित्त द्वंद्वज', mr: 'वात-पित्त द्वंद्वज', ta: 'வாத-பித்த கலப்பு இயல்பு', te: 'వాత-పిత్త మిశ్రమం', bn: 'বাত-পিত্ত মিশ্র প্রকৃতি' }, sublabel: 'Combination of dryness, irregular digestion and heat sensitivity' }
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
      { id: 'vikriti_vata', label: 'Vata Prakopa', nativeLabel: { hi: 'वात प्रकोप', mr: 'वात प्रकोप', ta: 'வாத அதிகரிப்பு', te: 'వాత ప్రకోపం', bn: 'বাত প্রকোপ' }, sublabel: 'Body aches, joint cracking, stiffness, insomnia, anxiety, dry stool' },
      { id: 'vikriti_pitta', label: 'Pitta Prakopa', nativeLabel: { hi: 'पित्त प्रकोप', mr: 'पित्त प्रकोप', ta: 'பித்த அதிகரிப்பு', te: 'పిత్త ప్రకోపం', bn: 'পিত্ত প্রকোপ' }, sublabel: 'Acid reflux, excessive thirst, burning eyes, skin eruptions, anger' },
      { id: 'vikriti_kapha', label: 'Kapha Prakopa', nativeLabel: { hi: 'कफ प्रकोप', mr: 'कफ प्रकोप', ta: 'கப அதிகரிப்பு', te: 'కఫ ప్రకోపం', bn: 'কফ প্রকোপ' }, sublabel: 'Heaviness of limbs, productive cough, excessive sleep, sluggishness' },
      { id: 'vikriti_sannipata', label: 'Sannipataja', nativeLabel: { hi: 'सन्निपातज', mr: 'सन्निपातज', ta: 'சந்நிபாத (மூன்றும் கலந்தது)', te: 'సన్నిపాతజ', bn: 'সন্নিপাতজ' }, sublabel: 'Mixed vitiation of all three doshas simultaneously' }
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
      { id: 'agni_mandagni', label: 'Mandagni (Sluggish)', nativeLabel: { hi: 'मंदाग्नि', mr: 'मंदाग्नी', ta: 'மந்தாக்னி (மெதுவான செரிமானம்)', te: 'మందాగ్ని (మందకొడి జీర్ణక్రియ)', bn: 'মন্দাগ্নি (ধীর হজম)' }, sublabel: 'Bloating, slow metabolism, feeling heavy hours after light meals' },
      { id: 'agni_tikshnagni', label: 'Tikshnagni (Hyperactive)', nativeLabel: { hi: 'तीक्ष्णाग्नि', mr: 'तीक्ष्णाग्नी', ta: 'தீக்ஷ்ணாக்னி (வேகமான செரிமானம்)', te: 'తీక్ష్ణాగ్ని (వేగవంతమైన జీర్ణక్రియ)', bn: 'তীক্ষ্ণাগ্নি (দ্রুত হজম)' }, sublabel: 'Sharp hunger, acid regurgitation, burning in chest/throat' },
      { id: 'agni_vishamagni', label: 'Vishamagni (Irregular)', nativeLabel: { hi: 'विषमाग्नि', mr: 'विषमाग्नी', ta: 'விஷமாக்னி (ஒழுங்கற்ற செரிமானம்)', te: 'విషమాగ్ని (అస్తవ్యస్త జీర్ణక్రియ)', bn: 'বিষমাগ্নি (অনিয়মিত হজম)' }, sublabel: 'Unpredictable hunger, constipation alternating with loose bowels' },
      { id: 'agni_samagni', label: 'Samagni (Balanced)', nativeLabel: { hi: 'समाग्नि', mr: 'समाग्नी', ta: 'சமாக்னி (சமநிலை செரிமானம்)', te: 'సమాగ్ని (సమతుల్య జీర్ణక్రియ)', bn: 'সমাগ্নি (সুষম হজম)' }, sublabel: 'Optimal digestion, feeling light and energetic after meals' }
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
      { id: 'satva_pravara', label: 'Pravara Satva (High)', nativeLabel: { hi: 'प्रवर सत्व', mr: 'प्रवर सत्व', ta: 'பிரவர சத்வா (உயர் மன வலிமை)', te: 'ప్రవర సత్వ (అధిక మానసిక బలం)', bn: 'প্রবর সত্ত্ব (উচ্চ মানসিক শক্তি)' }, sublabel: 'Calm under severe distress, highly patient and resilient' },
      { id: 'satva_madhyama', label: 'Madhyama Satva (Moderate)', nativeLabel: { hi: 'मध्यम सत्व', mr: 'मध्यम सत्व', ta: 'மத்யம சத்வா (நடுத்தர மன வலிமை)', te: 'మధ్యమ సత్వ (మధ్యస్థ మానసిక బలం)', bn: 'মধ্যম সত্ত্ব (মাঝারি মানসিক শক্তি)' }, sublabel: 'Copes well with support, occasional anxiety' },
      { id: 'satva_avara', label: 'Avara Satva (Low)', nativeLabel: { hi: 'अवर सत्व', mr: 'अवर सत्व', ta: 'அவர சத்வா (குறைந்த மன வலிமை)', te: 'అవర సత్వ (తక్కువ మానసిక బలం)', bn: 'অবর সত্ত্ব (নিম্ন মানসিক শক্তি)' }, sublabel: 'Easily agitated, highly anxious, fearful of medical procedures' }
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
      { id: 'vyayama_uttama', label: 'Uttama Bala (High Endurance)', nativeLabel: { hi: 'उत्तम बल', mr: 'उत्तम बल', ta: 'உத்தம பலம் (அதிக சகிப்புத்தன்மை)', te: 'ఉత్తమ బలం (అధిక సహనశక్తి)', bn: 'উত্তম বল (উচ্চ সহনশীলতা)' }, sublabel: 'Can perform heavy physical work without quick fatigue' },
      { id: 'vyayama_madhyama', label: 'Madhyama Bala (Moderate)', nativeLabel: { hi: 'मध्यम बल', mr: 'मध्यम बल', ta: 'மத்யம பலம் (நடுத்தர சகிப்புத்தன்மை)', te: 'మధ్యమ బలం (మధ్యస్థ సహనశక్తి)', bn: 'মধ্যম বল (মাঝারি সহনশীলতা)' }, sublabel: 'Comfortable with brisk walking, mild tiredness' },
      { id: 'vyayama_heena', label: 'Heena Bala (Low Endurance)', nativeLabel: { hi: 'हीन बल', mr: 'हीन बल', ta: 'ஹீன பலம் (குறைந்த சகிப்புத்தன்மை)', te: 'హీన బలం (తక్కువ సహనశక్తి)', bn: 'হীন বল (কম সহনশীলতা)' }, sublabel: 'Tires quickly with minimal exertion, dyspnea on stairs' }
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
      { id: 'sara_pravara', label: 'Pravara Sara (High Tissue Vitality)', nativeLabel: { hi: 'प्रवर सार', mr: 'प्रवर सार', ta: 'பிரவர சாரா (உயர் திசு ஆரோக்கியம்)', te: 'ప్రవర సార (అధిక కణజాల ఆరోగ్యం)', bn: 'প্রবর সার (উচ্চ কোষ স্বাস্থ্য)' }, sublabel: 'Strong teeth, lustrous hair, firm musculature, high immunity' },
      { id: 'sara_madhyama', label: 'Madhyama Sara (Moderate)', nativeLabel: { hi: 'मध्यम सार', mr: 'मध्यम सार', ta: 'மத்யம சாரா (நடுத்தர திசு ஆரோக்கியம்)', te: 'మధ్యమ సార (మధ్యస్థ కణజాల ఆరోగ్యం)', bn: 'মধ্যম সার (মাঝারি কোষ স্বাস্থ্য)' }, sublabel: 'Average physical constitution and tissue nourishment' },
      { id: 'sara_avara', label: 'Avara Sara (Low)', nativeLabel: { hi: 'अवर सार', mr: 'अवर सार', ta: 'அவர சாரா (குறைந்த திசு ஆரோக்கியம்)', te: 'అవర సార (తక్కువ కణజాల ఆరోగ్యం)', bn: 'অবর সার (নিম্ন কোষ স্বাস্থ্য)' }, sublabel: 'Fragile nails, sparse hair, prone to frequent infections' }
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
      { id: 'samhanana_pravara', label: 'Susamhata (Well-Knit Body)', nativeLabel: { hi: 'सुसंहत', mr: 'सुसंहत', ta: 'சுசம்ஹத (இறுக்கமான உடல் அமைப்பு)', te: 'సుసంహత (బిగుతైన శరీర నిర్మాణం)', bn: 'সুসংহত (মজবুত দেহ গঠন)' }, sublabel: 'Evenly distributed musculature, firm and stable joints' },
      { id: 'samhanana_madhyama', label: 'Madhyama Samhanana', nativeLabel: { hi: 'मध्यम संहनन', mr: 'मध्यम संहनन', ta: 'மத்யம சம்ஹனன (நடுத்தர உடல் அமைப்பு)', te: 'మధ్యమ సంహనన (మధ్యస్థ శరీర నిర్మాణం)', bn: 'মধ্যম সংহনন (মাঝারি দেহ গঠন)' }, sublabel: 'Normal proportionate body compactness' },
      { id: 'samhanana_avara', label: 'Heena / Hina Samhanana', nativeLabel: { hi: 'हीन संहनन', mr: 'हीन संहनन', ta: 'ஹீன சம்ஹனன (தளர்ந்த உடல் அமைப்பு)', te: 'హీన సంహనన (వదులైన శరీర నిర్మాణం)', bn: 'হীন সংহনন (আলগা দেহ গঠন)' }, sublabel: 'Loose lax joints, delicate and prone to sprains' }
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
      { id: 'pramana_sama', label: 'Sama Pramana (Well-Proportioned)', nativeLabel: { hi: 'सम प्रमाण', mr: 'सम प्रमाण', ta: 'சம பிரமாண (சமச்சீர் உடல் அளவுகள்)', te: 'సమ ప్రమాణ (సమతుల్య శరీర కొలతలు)', bn: 'সম প্রমাণ (সুষম দেহের মাপ)' }, sublabel: 'Harmonious height-to-arm span, symmetrical facial and limb features' },
      { id: 'pramana_vishama_atihrasva', label: 'Hrasva / Ati-Krisha', nativeLabel: { hi: 'ह्रस्व / अतिकृश', mr: 'ह्रस्व / अतिकृश', ta: 'ஹ்ரஸ்வ / அதிக்ரிஷ (குறுகிய / மெலிந்த உடல்)', te: 'హ్రస్వ / అతికృశ (పొట్టి / చాలా సన్నని శరీరం)', bn: 'হ্রস্ব / অতিকৃশ (খাটো / অতি ক্ষীণ দেহ)' }, sublabel: 'Underweight or unusually petite skeletal frame' },
      { id: 'pramana_vishama_atisthula', label: 'Sthula / Ati-Sthula', nativeLabel: { hi: 'स्थूल / अतिस्थूल', mr: 'स्थूल / अतिस्थूल', ta: 'ஸ்தூல / அதிஸ்தூல (பருமனான உடல்)', te: 'స్థూల / అతిస్థూల (లావు శరీరం)', bn: 'স্থূল / অতিস্থূল (স্থূলকায় দেহ)' }, sublabel: 'Excessive adipose accumulation, broad circumference' }
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
      { id: 'satmya_pravara', label: 'Sarva-Rasa Satmya (Madhyama Vaya)', nativeLabel: { hi: 'सर्व-रस सात्म्य', mr: 'सर्व-रस सात्म्य', ta: 'சர்வ-ரச சாத்மிய (அனைத்து சுவைகளுக்கும் பொருந்தும் தன்மை)', te: 'సర్వ-రస సాత్మ్య (అన్ని రుచులకూ అలవాటు)', bn: 'সর্ব-রস সাত্ম্য (সব স্বাদের সাথে মানিয়ে নেওয়া)' }, sublabel: 'Can digest and adapt to all food types and seasonal changes effortlessly' },
      { id: 'satmya_madhyama', label: 'Oka Satmya (Habit Dependent)', nativeLabel: { hi: 'ओक सात्म्य', mr: 'ओक सात्म्य', ta: 'ஓக சாத்மிய (பழக்கத்தை சார்ந்தது)', te: 'ఓక సాత్మ్య (అలవాటుపై ఆధారపడినది)', bn: 'ওক সাত্ম্য (অভ্যাসনির্ভর)' }, sublabel: 'Accustomed only to regional foods; upset by dietary deviations' },
      { id: 'satmya_avara', label: 'Eka-Rasa Satmya / Vriddha Vaya', nativeLabel: { hi: 'एक-रस सात्म्य / वृद्ध वय', mr: 'एक-रस सात्म्य / वृद्ध वय', ta: 'ஏக-ரச சாத்மிய / விருத்த வயது (முதுமை)', te: 'ఏక-రస సాత్మ్య / వృద్ధ వయ (వృద్ధాప్యం)', bn: 'এক-রস সাত্ম্য / বৃদ্ধ বয়স' }, sublabel: 'Elderly stage with sensitive digestion requiring specific light foods' }
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
      { id: 'diet_spicy_fried', label: 'Frequent deep-fried, sour, or spicy food', nativeLabel: { hi: 'तली-भुनी या तीखी चीजें', mr: 'तळलेले, आंबट किंवा तिखट पदार्थ वारंवार खाणे', ta: 'அடிக்கடி பொரித்த, புளிப்பு அல்லது காரமான உணவு', te: 'తరచుగా వేయించిన, పుల్లని లేదా కారంగా ఉండే ఆహారం', bn: 'ঘন ঘন ভাজাভুজি, টক বা ঝাল খাবার' }, sublabel: 'Causes Pitta Prakopa and acid regurgitation' },
      { id: 'diet_irregular_timings', label: 'Irregular meal timings / Skipping meals', nativeLabel: { hi: 'अनियमित भोजन समय', mr: 'अनियमित जेवणाच्या वेळा / जेवण वगळणे', ta: 'ஒழுங்கற்ற உணவு நேரம் / உணவைத் தவிர்த்தல்', te: 'క్రమరహిత భోజన సమయాలు / భోజనం మానేయడం', bn: 'অনিয়মিত খাবারের সময় / খাবার বাদ দেওয়া' }, sublabel: 'Causes Vishamagni and gastric bloating' },
      { id: 'diet_viruddha', label: 'Viruddha Ahara (Milk with sour fruit/fish)', nativeLabel: { hi: 'विरुद्ध आहार', mr: 'विरुद्ध आहार', ta: 'விருத்த ஆஹார (பொருந்தாத உணவு சேர்க்கைகள்)', te: 'విరుద్ధ ఆహార (సరిపడని ఆహార కలయికలు)', bn: 'বিরুদ্ধ আহার (বেমানান খাদ্য সংমিশ্রণ)' }, sublabel: 'Incompatible combinations generating Ama toxins' },
      { id: 'diet_sattvic_fresh', label: 'Fresh, warm, home-cooked Sattvic diet', nativeLabel: { hi: 'ताजा सात्विक भोजन', mr: 'ताजे, उबदार, घरगुती सात्विक अन्न', ta: 'புதிய, சூடான, வீட்டில் சமைத்த சாத்விக உணவு', te: 'తాజా, వేడి, ఇంట్లో వండిన సాత్విక ఆహారం', bn: 'টাটকা, গরম, বাড়িতে তৈরি সাত্ত্বিক খাবার' }, sublabel: 'Balanced nutrition supporting Dhatus' }
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
      { id: 'vihara_ratrijagarana', label: 'Ratrijagarana (Late night waking / screen time)', nativeLabel: { hi: 'रात्रि जागरण', mr: 'रात्री उशिरापर्यंत जागणे', ta: 'இரவு விழிப்பு (தாமதமாக தூங்குதல் / திரை நேரம்)', te: 'రాత్రి మేల్కొని ఉండటం (ఆలస్యంగా నిద్రపోవడం)', bn: 'রাত্রি জাগরণ (দেরিতে ঘুমানো / স্ক্রিন টাইম)' }, sublabel: 'Direct cause of aggravated Vata and dry eyes' },
      { id: 'vihara_divasvapna', label: 'Divasvapna (Sleeping during daytime after heavy lunch)', nativeLabel: { hi: 'दिवास्वप्न', mr: 'दिवसा जेवणानंतर झोपणे', ta: 'பகல் தூக்கம் (உணவுக்குப் பிறகு)', te: 'పగటిపూట నిద్ర (భోజనం తర్వాత)', bn: 'দিবাস্বপ্ন (ভারী খাবারের পর দিনের ঘুম)' }, sublabel: 'Direct cause of Kapha Prakopa and sluggish digestion' },
      { id: 'vihara_manasika_stress', label: 'Chinta & Shoka (Chronic worry and anxiety)', nativeLabel: { hi: 'मानसिक तनाव', mr: 'दीर्घकालीन चिंता आणि ताण', ta: 'நீடித்த கவலை மற்றும் மன அழுத்தம்', te: 'దీర్ఘకాలిక ఆందోళన మరియు ఒత్తిడి', bn: 'দীর্ঘস্থায়ী দুশ্চিন্তা ও মানসিক চাপ' }, sublabel: 'Affects Prana Vata and impairs digestive Agni' },
      { id: 'vihara_swastha_dinacharya', label: 'Healthy Dinacharya (Regular sleep schedule and morning walks)', nativeLabel: { hi: 'संतुलित दिनचर्या एवं पर्याप्त नींद', mr: 'संतुलित दिनचर्या आणि पुरेशी झोप', ta: 'ஆரோக்கியமான தினசரி வழக்கம் மற்றும் போதுமான தூக்கம்', te: 'ఆరోగ్యకరమైన దినచర్య మరియు తగినంత నిద్ర', bn: 'সুষম দৈনন্দিন রুটিন এবং পর্যাপ্ত ঘুম' }, sublabel: 'Regular sleep schedule and morning walks' }
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
      { id: 'koshtha_krura', label: 'Krura Koshtha (Hard stool / Constipation prone)', nativeLabel: { hi: 'क्रूर कोष्ठ', mr: 'क्रूर कोष्ठ (बद्धकोष्ठतेची प्रवृत्ती)', ta: 'க்ரூர கோஷ்ட (மலச்சிக்கல் போக்கு)', te: 'క్రూర కోష్ఠ (మలబద్ధకం ధోరణి)', bn: 'ক্রূর কোষ্ঠ (কোষ্ঠকাঠিন্যের প্রবণতা)' }, sublabel: 'Requires strong laxatives or warm milk to evacuate; dry hard pellets (Vata)' },
      { id: 'koshtha_mridu', label: 'Mridu Koshtha (Quick evacuation / Loose tendency)', nativeLabel: { hi: 'मृदु कोष्ठ', mr: 'मृदु कोष्ठ (सैल मलप्रवृत्ती)', ta: 'ம்ருது கோஷ்ட (மென்மையான, விரைவான மலம் கழித்தல்)', te: 'మృదు కోష్ఠ (వదులుగా విసర్జన ధోరణి)', bn: 'মৃদু কোষ্ঠ (নরম, দ্রুত মলত্যাগ প্রবণতা)' }, sublabel: 'Evacuates easily even with mild warm milk or fruits; prone to loose stools (Pitta)' },
      { id: 'koshtha_madhyama', label: 'Madhyama Koshtha (Regular normal bowel motion)', nativeLabel: { hi: 'मध्यम कोष्ठ', mr: 'मध्यम कोष्ठ (सामान्य नियमित मलप्रवृत्ती)', ta: 'மத்யம கோஷ்ட (இயல்பான, ஒழுங்கான மலம் கழித்தல்)', te: 'మధ్యమ కోష్ఠ (సాధారణ, క్రమమైన విసర్జన)', bn: 'মধ্যম কোষ্ঠ (স্বাভাবিক, নিয়মিত মলত্যাগ)' }, sublabel: 'Once daily formed stool without straining or urgency (Balanced)' }
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
      { id: 'jihwa_saama_heavy', label: 'Saama Jihwa (Thick white/yellow coating & morning heaviness)', nativeLabel: { hi: 'साम जिह्वा', mr: 'साम जिव्हा (जाड पांढरा/पिवळा थर)', ta: 'சாம ஜிஹ்வா (தடிமனான வெள்ளை/மஞ்சள் படலம்)', te: 'సామ జిహ్వ (మందపాటి తెలుపు/పసుపు పొర)', bn: 'সাম জিহ্বা (পুরু সাদা/হলুদ আস্তরণ)' }, sublabel: 'Indicates high circulating Ama (endotoxins) and low digestive Agni' },
      { id: 'jihwa_niraama_clean', label: 'Niraama Jihwa (Clean pink tongue without coating)', nativeLabel: { hi: 'निराम जिह्वा', mr: 'निराम जिव्हा (स्वच्छ गुलाबी जीभ)', ta: 'நிராம ஜிஹ்வா (சுத்தமான இளஞ்சிவப்பு நாக்கு)', te: 'నిరామ జిహ్వ (శుభ్రమైన గులాబీ రంగు నాలుక)', bn: 'নিরাম জিহ্বা (পরিষ্কার গোলাপি জিহ্বা)' }, sublabel: 'Indicates clear digestive channels and absence of acute Ama' },
      { id: 'jihwa_dry_fissured', label: 'Ruksha / Kharata (Dry, rough with fissures)', nativeLabel: { hi: 'रुक्ष जिह्वा', mr: 'रुक्ष जिव्हा (कोरडी, खडबडीत जीभ)', ta: 'ருக்ஷ ஜிஹ்வா (உலர்ந்த, வெடிப்புகளுடன் கூடிய நாக்கு)', te: 'రుక్ష జిహ్వ (పొడి, పగుళ్లతో కూడిన నాలుక)', bn: 'রুক্ষ জিহ্বা (শুষ্ক, ফাটা জিহ্বা)' }, sublabel: 'Indicates aggravated Vata and severe dehydration of mucosal tissues' }
    ]
  }
];

