export type LanguageCode = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  audioPrompt: string;
  description: string;
}

export type DepartmentId = 'general' | 'cardiology' | 'orthopedics' | 'ayush' | 'pediatrics' | 'ent';

export interface Department {
  id: DepartmentId;
  name: string;
  nativeName?: string;
  description: string;
  icon: string;
  avgWaitMins: number;
}

export type PriorityLevel = 'normal' | 'attention' | 'urgent';
export type HistoryStatus = 'not-started' | 'in-progress' | 'ready-for-review' | 'verified';
export type QueueStatus = 'waiting' | 'in-kiosk' | 'ready' | 'with-doctor' | 'completed';

export interface VitalSigns {
  bp: string;
  heartRate: number;
  spo2: number;
  temperature: string;
  bmi: number;
  bloodSugar?: number;
}

export interface RedFlagAlert {
  isTriggered: boolean;
  title: string;
  description: string;
  symptoms: string[];
  severity: 'urgent' | 'critical';
  timestamp: string;
  staffAlertSent: boolean;
}

export interface ClinicalOption {
  id: string;
  label: string;
  nativeLabel?: Partial<Record<LanguageCode, string>>;
  sublabel?: string;
  icon?: string;
  isRedFlag?: boolean;
}

export interface ClinicalQuestion {
  id: string;
  step: number;
  totalSteps: number;
  category: 'chief_complaint' | 'duration_severity' | 'associated_symptoms' | 'past_history' | 'medications' | 'lifestyle' | 'ayush_pariksha';
  question: string;
  nativeQuestion?: Record<LanguageCode, string>;
  subtext?: string;
  inputType: 'single_choice' | 'multi_choice' | 'scale' | 'body_map' | 'text_voice';
  options?: ClinicalOption[];
  isAyushOnly?: boolean;
  ayushDimension?: string;
}

export interface DashavidhaPariksha {
  prakriti: { vata: number; pitta: number; kapha: number; primaryDosha: string };
  vikriti: string;
  sara: string;
  samhanana: string;
  pramana: string;
  satmya: string;
  satva: string;
  aharaShakti: { abhyavaharana: string; jarana: string };
  vyayamaShakti: string;
  vaya: string;
  agni?: string; // Manda, Tikshna, Vishama, Sama
  koshtha?: string; // Krura, Mridu, Madhyama
  ashtavidhaPariksha?: {
    nadi?: string;
    mutra?: string;
    mala?: string;
    jihwa?: string;
    shabda?: string;
    sparsha?: string;
    druk?: string;
    akruti?: string;
  };
  trividhaPariksha?: {
    darshana?: string;
    sparshana?: string;
    prashna?: string;
  };
  aharaVihara?: {
    dietRegimen?: string;
    lifestyleHabits?: string;
    viruddhaAhara?: string;
  };
  nidanaSamprapti?: {
    causativeFactors?: string;
    pathogenesisChain?: string;
  };
}

export interface DrugInteractionAlert {
  drug1: string;
  drug2: string;
  severity: 'CRITICAL' | 'MAJOR' | 'MODERATE';
  mechanism: string;
  clinicalEffect: string;
  recommendation: string;
  interactionType?: 'drug-drug' | 'herb-drug';
}

export interface AbnormalLabFinding {
  testName: string;
  value: string;
  referenceRange: string;
  status: 'HIGH' | 'LOW' | 'CRITICAL';
}

export interface ExtractedMedicalEntity {
  id: string;
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
  boundingBox?: { x: number; y: number; w: number; h: number };
  isVerified: boolean;
}

export interface MedicalDocument {
  id: string;
  title: string;
  type: 'prescription' | 'lab_report' | 'discharge_summary' | 'imaging';
  fileUrl: string;
  thumbnail?: string;
  date: string;
  facility: string;
  doctorName?: string;
  ocrStatus: 'pending' | 'processing' | 'completed' | 'failed';
  confidenceScore: number;
  entities: ExtractedMedicalEntity[];
  rawOcrText: string;
  drugInteractions?: DrugInteractionAlert[];
  abnormalLabFindings?: AbnormalLabFinding[];
  procedureHistory?: string[];
}

export interface TimelineEvent {
  id: string;
  date: string;
  yearMonth: string;
  title: string;
  category: 'hospitalization' | 'diagnosis' | 'prescription' | 'lab_result' | 'surgery' | 'consultation';
  facility: string;
  summary: string;
  badgeText: string;
  isImportant?: boolean;
  documentId?: string;
}

export interface StructuredClinicalHistory {
  chiefComplaint: {
    primary: string;
    onset: string;
    duration: string;
    severityScore: number; // 1-10
    location: string;
    aggravatingFactors: string[];
    relievingFactors: string[];
  };
  historyOfPresentIllness: string;
  pastMedicalHistory: {
    condition: string;
    diagnosedYear: string;
    currentStatus: 'Active' | 'Controlled' | 'Resolved';
    notes?: string;
  }[];
  pastSurgicalHistory: {
    procedure: string;
    year: string;
    hospital: string;
  }[];
  drugHistory: {
    drugName: string;
    dosage: string;
    frequency: string;
    adherence: 'Regular' | 'Irregular' | 'Stopped';
    duration: string;
    isVerifiedByOcr?: boolean;
  }[];
  allergyHistory: {
    allergen: string;
    reaction: string;
    severity: 'Mild' | 'Moderate' | 'Severe (Anaphylaxis Risk)';
  }[];
  familyHistory: {
    relation: string;
    condition: string;
  }[];
  personalHistory: {
    diet: 'Vegetarian' | 'Non-Vegetarian' | 'Eggetarian' | string;
    tobaccoUse: string;
    alcoholUse: string;
    sleep: string;
    physicalActivity: string;
  };
  reviewOfSystems: {
    system: string;
    status: 'Normal' | 'Abnormal' | 'Unassessed';
    findings: string;
  }[];
  previousInvestigations: {
    testName: string;
    result: string;
    unit: string;
    referenceRange: string;
    date: string;
    status: 'Normal' | 'High' | 'Low' | 'Critical';
  }[];
  dashavidhaPariksha?: DashavidhaPariksha;
}

export interface AiClinicalSummary {
  id: string;
  patientId: string;
  generatedAt: string;
  conciseSummary: string;
  keyPositiveFindings: string[];
  pertinentNegatives: string[];
  redFlagAlerts: string[];
  differentialDiagnoses: {
    name: string;
    icdCode: string;
    confidence: number;
    clinicalRationale: string;
  }[];
  recommendedInvestigations: string[];
  drugInteractions?: DrugInteractionAlert[];
  abnormalLabFindings?: AbnormalLabFinding[];
  procedureHistory?: string[];
  hindiSummary?: {
    conciseSummary: string;
    keyPositiveFindings: string[];
    pertinentNegatives: string[];
    differentialDiagnoses: string[];
  };
  doctorVerification: {
    status: 'pending' | 'accepted' | 'edited' | 'rejected';
    modifiedText?: string;
    physicianRemarks?: string;
    verifiedAt?: string;
    verifiedByDoctorId?: string;
  };
}

export interface PatientPortalProfile {
  id: string;
  token: string;
  name: string;
  nameHindi?: string;
  age: number;
  gender: string;
  phone: string;
  abhaId?: string;
  abhaAddress?: string;
  abhaVerified?: boolean;
  priority?: string;
  queueStatus?: string;
  vitals: VitalSigns;
  department?: { id: string; name: string; code: string };
  activeConsent?: {
    consentAi: boolean;
    consentDoctorShare: boolean;
    consentAbha: boolean;
    status: string;
  };
  clinicalData?: {
    pastMedicalHistory: Array<{ condition: string; diagnosedYear: string }>;
    pastSurgicalHistory: Array<{ procedure: string; year: string; hospital: string }>;
    drugAllergies: Array<{ allergen: string; reaction: string; severity: string }>;
    dailyMedications: Array<{ drugName: string; dosage: string; frequency: string; adherence: string }>;
    ayushConstitution?: any;
  };
}

export interface Patient {
  id: string;
  token: string;
  roomNo: string;
  name: string;
  nameHindi?: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  abhaId: string;
  abhaAddress: string;
  abhaVerified: boolean;
  department: DepartmentId;
  priority: PriorityLevel;
  queueStatus: QueueStatus;
  historyStatus: HistoryStatus;
  waitTimeMinutes: number;
  checkedInTime: string;
  chiefComplaintShort: string;
  vitals: VitalSigns;
  redFlag?: RedFlagAlert;
  structuredHistory: StructuredClinicalHistory;
  aiSummary: AiClinicalSummary;
  documents: MedicalDocument[];
  timeline: TimelineEvent[];
}

export interface DoctorConsultationNote {
  patientId: string;
  doctorName: string;
  provisionalDiagnosis: string;
  icdCode: string;
  clinicalNotes: string;
  prescriptions: {
    medicine: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }[];
  orderedInvestigations: string[];
  followUpDays: number;
  savedAt?: string;
  isPushedToAbha: boolean;
}

export interface AdminAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: 'Patient' | 'Doctor' | 'Staff' | 'System_AI';
  action: string;
  patientToken: string;
  details: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'ALERT';
}
