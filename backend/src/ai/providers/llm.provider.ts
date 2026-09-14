export interface QuestionOption {
  id: string;
  label: string;
  nativeLabel?: string;
  sublabel?: string;
  isRedFlag?: boolean;
}

export interface AdaptiveQuestion {
  code: string;
  stepNumber: number;
  category: string;
  questionText: string;
  nativeQuestion?: Record<string, string>;
  subtext?: string;
  inputType: 'single_choice' | 'multi_choice' | 'scale' | 'text_voice';
  options?: QuestionOption[];
  isAyush?: boolean;
  ayushDimension?: string;
}

export interface DifferentialDiagnosis {
  name: string;
  icdCode: string;
  confidence: number;
  clinicalRationale: string;
}

export interface ClinicalSummaryOutput {
  conciseSummary: string;
  keyPositiveFindings: string[];
  pertinentNegatives: string[];
  redFlagAlerts: string[];
  differentialDiagnoses: DifferentialDiagnosis[];
  recommendedInvestigations: string[];
  drugInteractions?: Array<{
    drug1: string;
    drug2: string;
    severity: string;
    mechanism: string;
    clinicalEffect: string;
    recommendation: string;
  }>;
  abnormalLabFindings?: Array<{
    testName: string;
    value: string;
    referenceRange: string;
    status: 'HIGH' | 'LOW' | 'CRITICAL';
  }>;
  procedureHistory?: string[];
  hindiSummary?: {
    conciseSummary: string;
    keyPositiveFindings: string[];
    pertinentNegatives: string[];
    differentialDiagnoses: string[];
  };
}

export interface ExtractedEntityOutput {
  category: 'diagnosis' | 'medication' | 'investigation' | 'date' | 'doctor' | 'procedure';
  value: string;
  standardizedName?: string;
  dosage?: string;
  frequency?: string;
  numericalValue?: number;
  unit?: string;
  referenceRange?: string;
  isAbnormal?: boolean;
  abnormalDirection?: 'HIGH' | 'LOW' | 'CRITICAL';
  confidence: number;
  isVerified: boolean;
  boundingBox?: { x: number; y: number; w: number; h: number };
}

export interface LLMProvider {
  generateNextQuestion(
    currentAnswers: Record<string, any>,
    department: string,
    step: number,
    totalSteps: number,
    language: string
  ): Promise<AdaptiveQuestion | null>;

  generateClinicalSummary(
    patientData: {
      name: string;
      age: number;
      gender: string;
      chiefComplaint: string;
      answers: Record<string, any>;
      vitals?: any;
      ocrEntities?: ExtractedEntityOutput[];
      isAyush?: boolean;
      ayushData?: any;
    }
  ): Promise<ClinicalSummaryOutput>;

  extractMedicalEntities(rawOcrText: string): Promise<ExtractedEntityOutput[]>;
}
