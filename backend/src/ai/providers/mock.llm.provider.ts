import { 
  LLMProvider, 
  AdaptiveQuestion, 
  ClinicalSummaryOutput, 
  ExtractedEntityOutput 
} from './llm.provider.js';
import { CLINICAL_QUESTIONS_SEED } from '../../shared/constants/index.js';
import { DrugInteractionEngine } from '../rules/drug-interaction.rules.js';

export class MockLLMProvider implements LLMProvider {
  async generateNextQuestion(
    currentAnswers: Record<string, any>,
    department: string,
    step: number,
    totalSteps: number,
    language: string
  ): Promise<AdaptiveQuestion | null> {
    const isAyush = department === 'ayush';
    const isCardiac = 
      currentAnswers['q_chief_complaint'] === 'chest_pain' ||
      currentAnswers['q_location'] === 'loc_chest_arm';

    let questions = CLINICAL_QUESTIONS_SEED;
    if (isAyush) {
      questions = CLINICAL_QUESTIONS_SEED.filter(q => q.isAyush || q.stepNumber <= 7);
    } else if (isCardiac) {
      // Prioritize SOCRATES questions for chest pain
      questions = CLINICAL_QUESTIONS_SEED.filter(q => !q.isAyush);
    } else {
      questions = CLINICAL_QUESTIONS_SEED.filter(q => !q.isAyush && q.category !== 'socrates_probing');
    }

    if (step >= questions.length) {
      return null;
    }

    const q = questions[step];
    return {
      code: q.code,
      stepNumber: step + 1,
      category: q.category,
      questionText: q.questionText,
      inputType: q.inputType as any,
      options: q.options as any,
      isAyush: q.isAyush,
      ayushDimension: q.ayushDimension,
    };
  }

  async generateClinicalSummary(patientData: {
    name: string;
    age: number;
    gender: string;
    chiefComplaint: string;
    answers: Record<string, any>;
    vitals?: any;
    ocrEntities?: ExtractedEntityOutput[];
    isAyush?: boolean;
    ayushData?: any;
  }): Promise<ClinicalSummaryOutput> {
    const { age, gender, chiefComplaint, answers, isAyush, ocrEntities } = patientData;

    // Check drug interactions from extracted medications
    const medications = (ocrEntities || [])
      .filter(e => e.category === 'medication')
      .map(e => e.value);
    
    // Default medications if none scanned yet
    const activeMeds = medications.length > 0 
      ? medications 
      : ['Telmisartan 40mg', 'Spironolactone 25mg', 'Atorvastatin 20mg'];

    const drugInteractions = DrugInteractionEngine.checkInteractions(activeMeds);

    const abnormalLabFindings = [
      { testName: 'HbA1c (Glycated Hemoglobin)', value: '8.6 %', referenceRange: '4.0 - 5.6 %', status: 'HIGH' as const },
      { testName: 'Serum Creatinine', value: '1.8 mg/dL', referenceRange: '0.7 - 1.3 mg/dL', status: 'HIGH' as const },
      { testName: 'Fasting Blood Glucose', value: '178 mg/dL', referenceRange: '70 - 99 mg/dL', status: 'HIGH' as const }
    ];

    const procedureHistory = [
      'Percutaneous Transluminal Coronary Angioplasty (PTCA Stent to LAD) - 2022'
    ];

    // 1. AYUSH Consultation
    if (isAyush) {
      return {
        conciseSummary: `${age}${gender[0]} presenting to AYUSH OPD with chronic Agnimandya (sluggish digestion), postprandial Adhmana, and Vishama Koshta. Dashavidha Pariksha reveals Vata-Pitta Dvandvaja Prakriti with Vishamagni and Madhyama Satva. Deepana-Pachana therapy indicated.`,
        keyPositiveFindings: [
          'Vata-Pitta Prakriti with Vishamagni (irregular digestive fire)',
          'Sluggish digestion with postprandial bloating and acid regurgitation',
          'Ratrijagarana (erratic late night routines) exacerbating Vata-Pitta',
          'Madhyama Satva and sedentary Vyayama Shakti',
        ],
        pertinentNegatives: [
          'No gastrointestinal bleeding or unexplained weight loss',
          'No acute peritoneal signs or organomegaly',
        ],
        redFlagAlerts: [],
        differentialDiagnoses: [
          { name: 'Agnimandya / Grahani Dosha (Ayurvedic)', icdCode: 'K30', confidence: 94, clinicalRationale: 'Classic digestive fire disturbance with irregular appetite and bowel sluggishness' },
          { name: 'Amlapitta (Pitta Prakopa / GERD)', icdCode: 'K21.9', confidence: 86, clinicalRationale: 'Sour belching and epigastric discomfort' },
        ],
        recommendedInvestigations: [
          'Complete Blood Count (CBC)',
          'Upper Abdominal Ultrasound (USG)',
          'Stool Routine & Microscopy',
        ],
        drugInteractions,
        abnormalLabFindings,
        procedureHistory,
        hindiSummary: {
          conciseSummary: `${age} वर्षीय ${gender === 'Male' ? 'पुरुष' : 'महिला'} आयुष ओपीडी में दीर्घकालिक अग्निमांद्य (मंद पाचन), भोजनोपरांत आध्मान और विषम कोष्ठ के लक्षणों के साथ उपस्थित। दशविध परीक्षा में वात-पित्त द्वंद्वज प्रकृति, विषमाग्नि एवं मध्यम सत्व का निर्धारण। दीपन-पाचन चिकित्सा निर्देशित।`,
          keyPositiveFindings: [
            'वात-पित्त प्रकृति एवं विषमाग्नि (अनियमित जठराग्नि)',
            'भोजनोपरांत पेट फूलना एवं अम्ल उद्गार (खट्टी डकारें)',
            'रात्रिजागरण हेतु वात-पित्त प्रकोप',
            'मध्यम सत्व एवं हीन व्यायाम शक्ति'
          ],
          pertinentNegatives: [
            'कोई जठरांत्र रक्तस्राव या वजन में अप्रत्याशित कमी नहीं',
            'कोई तीव्र उदर संकेत या यकृत-प्लीहा वृद्धि नहीं'
          ],
          differentialDiagnoses: [
            'ग्रहणी दोष / अग्निमांद्य (K30) - 94% विश्वास्यता',
            'अम्लपित्त / Pitta Prakopa (K21.9) - 86% विश्वास्यता'
          ]
        }
      };
    }

    // 2. Acute Cardiac Presentation
    const isCardiac = 
      chiefComplaint.toLowerCase().includes('chest') || 
      answers['q_chief_complaint'] === 'chest_pain' ||
      answers['q_location'] === 'loc_chest_arm';

    if (isCardiac) {
      return {
        conciseSummary: `${age}${gender[0]} presenting with acute crushing retrosternal chest pain radiating to the left arm/jaw, accompanied by diaphoresis and vital instability. High pre-test probability of Acute Coronary Syndrome (STEMI / NSTEMI). Immediate 12-lead ECG and hs-Troponin advised.`,
        keyPositiveFindings: [
          'Acute retrosternal chest pressure radiating to left upper extremity',
          'Cold diaphoresis and exertional onset',
          'Elevated systolic BP and resting tachycardia',
          'Past history of cardiovascular risk factors',
        ],
        pertinentNegatives: [
          'No pleuritic chest pain or friction rub (low pericarditis probability)',
          'No focal neurological signs (rules down acute CVA)',
          'No unilateral lower extremity edema (low DVT probability)',
        ],
        redFlagAlerts: [
          'URGENT: High suspicion for Acute Coronary Syndrome',
          'Emergency priority bed and nursing staff alerted',
        ],
        differentialDiagnoses: [
          { name: 'Acute Myocardial Infarction (STEMI / NSTEMI)', icdCode: 'I21.9', confidence: 92, clinicalRationale: 'Typical crushing radiation, cold sweat, age, and cardiovascular risk factors' },
          { name: 'Unstable Angina Pectoris', icdCode: 'I20.0', confidence: 78, clinicalRationale: 'Crescendo angina at low exertion' },
          { name: 'Aortic Dissection (Rule out)', icdCode: 'I71.0', confidence: 22, clinicalRationale: 'Severe pain in hypertensive patient; check bilateral pulses' },
        ],
        recommendedInvestigations: [
          'Stat 12-Lead Electrocardiogram (Within 10 min)',
          'High Sensitivity Cardiac Troponin-I (hs-cTnI)',
          'Point-of-Care Bedside 2D Echocardiogram',
          'Serum Electrolytes and Lipid Panel',
        ],
        drugInteractions,
        abnormalLabFindings,
        procedureHistory,
        hindiSummary: {
          conciseSummary: `${age} वर्षीय ${gender === 'Male' ? 'पुरुष' : 'महिला'} तीव्र सीने में दबाव/दर्द के साथ उपस्थित, जो बाएं हाथ और जबड़े तक फैल रहा है, साथ में पसीना और घबराहट है। एक्यूट कोरोनरी सिंड्रोम (ACS) की उच्च संभावना। तत्काल 12-लीड ईसीजी एवं कार्डियक ट्रोपोनिन जांच अनिवार्य।`,
          keyPositiveFindings: [
            'सीने के मध्य में तीव्र दबाव जो बाएं हाथ और जबड़े तक जा रहा है',
            'अचानक ठंडा पसीना एवं चलने-फिरने पर दर्द में वृद्धि',
            'रक्तचाप में वृद्धि एवं नाड़ी गति तीव्र (Tachycardia)',
            'हृदय रोग एवं स्टेंट का पूर्व इतिहास'
          ],
          pertinentNegatives: [
            'गहरी सांस लेने पर दर्द में वृद्धि नहीं (पेरीकार्डाइटिस की संभावना कम)',
            'कोई लकवा या बोलने में लड़खड़ाहट नहीं (स्ट्रोक रहित)',
            'पैरों में एकतरफा सूजन नहीं (DVT रहित)'
          ],
          differentialDiagnoses: [
            'एक्यूट मायोकार्डियल इन्फ्रक्शन / दिल का दौरा (I21.9) - 92% विश्वास्यता',
            'अनस्टेबल एनजाइना पेक्टोरिस (I20.0) - 78% विश्वास्यता'
          ]
        }
      };
    }

    // 3. Default General / Chronic Presentation
    return {
      conciseSummary: `${age}${gender[0]} presenting for OPD clinical review with ${chiefComplaint}. Medical history synthesized via MediKiosk intake.`,
      keyPositiveFindings: [
        `Chief complaint of ${chiefComplaint}`,
        'Structured clinical review completed via kiosk',
      ],
      pertinentNegatives: [
        'No emergency red-flag symptoms reported',
        'Vital signs within clinical tolerance',
      ],
      redFlagAlerts: [],
      differentialDiagnoses: [
        { name: 'Clinical Evaluation / Routine Follow-up', icdCode: 'Z00.0', confidence: 88, clinicalRationale: 'Symptom constellation consistent with non-acute presentation' },
      ],
      recommendedInvestigations: [
        'Routine Complete Blood Count (CBC)',
        'Fasting Blood Glucose',
      ],
      drugInteractions,
      abnormalLabFindings,
      procedureHistory,
      hindiSummary: {
        conciseSummary: `${age} वर्षीय ${gender === 'Male' ? 'पुरुष' : 'महिला'} नियमित ओपीडी परामर्श हेतु मुख्य शिकायत: ${chiefComplaint} के साथ उपस्थित। मेडीकियोस्क डिजिटल प्रणाली द्वारा क्लिनिकल इतिहास संकलित।`,
        keyPositiveFindings: [
          `मुख्य लक्षण: ${chiefComplaint}`,
          'कियोस्क द्वारा व्यवस्थित क्लिनिकल इतिहास संकलित'
        ],
        pertinentNegatives: [
          'कोई आपातकालीन रेड-फ्लैग चेतावनी लक्षण नहीं',
          'सभी महत्वपूर्ण लक्षण (Vitals) सामान्य सीमा में'
        ],
        differentialDiagnoses: [
          'नैदानिक मूल्यांकन एवं नियमित अनुवर्ती समीक्षा (Z00.0) - 88% विश्वास्यता'
        ]
      }
    };
  }

  async extractMedicalEntities(rawOcrText: string): Promise<ExtractedEntityOutput[]> {
    return [
      { category: 'medication', value: 'Telmisartan 40mg', dosage: '40mg', frequency: 'PO OD', confidence: 99.1, isVerified: true },
      { category: 'medication', value: 'Spironolactone 25mg', dosage: '25mg', frequency: 'PO OD', confidence: 98.1, isVerified: true },
      { category: 'medication', value: 'Atorvastatin 20mg', dosage: '20mg', frequency: 'PO HS', confidence: 97.5, isVerified: true },
      { category: 'medication', value: 'Metformin 500mg', dosage: '500mg', frequency: 'PO BD', confidence: 98.4, isVerified: true },
      { category: 'diagnosis', value: 'Essential Hypertension & Type 2 Diabetes', confidence: 94.2, isVerified: true },
      { category: 'procedure', value: 'Percutaneous Transluminal Coronary Angioplasty (PTCA Stent) - 2022', confidence: 95.0, isVerified: true },
      { category: 'investigation', value: 'HbA1c Glycated Hemoglobin', numericalValue: 8.6, unit: '%', referenceRange: '4.0 - 5.6 %', isAbnormal: true, abnormalDirection: 'HIGH', confidence: 98.0, isVerified: true },
      { category: 'investigation', value: 'Serum Creatinine', numericalValue: 1.8, unit: 'mg/dL', referenceRange: '0.7 - 1.3 mg/dL', isAbnormal: true, abnormalDirection: 'HIGH', confidence: 97.5, isVerified: true },
      { category: 'date', value: new Date().toISOString().split('T')[0], confidence: 99.4, isVerified: true },
    ];
  }
}
