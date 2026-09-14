import { 
  LLMProvider, 
  AdaptiveQuestion, 
  ClinicalSummaryOutput, 
  ExtractedEntityOutput 
} from './llm.provider.js';
import { CLINICAL_QUESTIONS_SEED } from '../../shared/constants/index.js';

export class MockLLMProvider implements LLMProvider {
  async generateNextQuestion(
    currentAnswers: Record<string, any>,
    department: string,
    step: number,
    totalSteps: number,
    language: string
  ): Promise<AdaptiveQuestion | null> {
    const isAyush = department === 'ayush';
    const questions = isAyush 
      ? CLINICAL_QUESTIONS_SEED 
      : CLINICAL_QUESTIONS_SEED.filter(q => !q.isAyush);

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
    const { age, gender, chiefComplaint, answers, isAyush } = patientData;

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
    };
  }

  async extractMedicalEntities(rawOcrText: string): Promise<ExtractedEntityOutput[]> {
    return [
      { category: 'medication', value: 'Telmisartan 40mg', dosage: '40mg', frequency: 'PO OD', confidence: 99.1, isVerified: true },
      { category: 'medication', value: 'Atorvastatin 20mg', dosage: '20mg', frequency: 'PO HS', confidence: 97.5, isVerified: true },
      { category: 'medication', value: 'Metformin 500mg', dosage: '500mg', frequency: 'PO BD', confidence: 98.4, isVerified: true },
      { category: 'diagnosis', value: 'Essential Hypertension', confidence: 94.2, isVerified: true },
      { category: 'investigation', value: '12-Lead ECG & Lipid Profile', confidence: 96.0, isVerified: false },
      { category: 'date', value: new Date().toISOString().split('T')[0], confidence: 99.4, isVerified: true },
    ];
  }
}
