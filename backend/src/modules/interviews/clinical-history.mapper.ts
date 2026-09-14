/**
 * Deterministically derives a structured clinical history from the patient's actual
 * recorded interview answers (keyed by CLINICAL_QUESTIONS_SEED question codes), instead
 * of returning a fixed narrative. This is plain answer -> structure mapping, not an LLM
 * call, so it has no dependency on an AI provider being configured.
 */

const CHIEF_COMPLAINT_LABELS: Record<string, string> = {
  chest_pain: 'Chest pain or heaviness',
  fever_bodyache: 'Fever and chills',
  cough_breathless: 'Severe breathlessness',
  stomach_pain: 'Stomach pain / vomiting',
  joint_pain: 'Joint or back pain',
  chronic_followup: 'Routine BP / diabetes follow-up',
};

const LOCATION_LABELS: Record<string, string> = {
  loc_chest_arm: 'Chest, radiating to left arm or jaw',
  loc_head_temple: 'Head / forehead / temples',
  loc_upper_abdomen: 'Upper abdomen, below the ribs',
  loc_knees: 'Both knees / lower back',
  loc_generalized: 'Generalized, whole-body ache',
};

const DURATION_LABELS: Record<string, { onset: string; duration: string }> = {
  dur_acute_hours: { onset: 'Sudden onset within the last 24 hours', duration: 'Less than 24 hours' },
  dur_few_days: { onset: 'Gradual onset over a few days', duration: '2 to 7 days' },
  dur_weeks: { onset: 'Subacute onset', duration: '1 to 4 weeks' },
  dur_months: { onset: 'Chronic, long-standing', duration: 'More than 1 month' },
};

const SEVERITY_SCORES: Record<string, number> = {
  sev_mild: 2,
  sev_moderate: 5,
  sev_severe: 7,
  sev_extreme: 9,
};

const ASSOCIATED_SYMPTOM_LABELS: Record<string, string> = {
  rf_sweating: 'Cold profuse sweating (diaphoresis)',
  rf_breathless: 'Severe shortness of breath at rest',
  rf_dizziness: 'Dizziness or near-fainting',
  rf_vomiting: 'Nausea or vomiting',
};

const PAST_CONDITION_LABELS: Record<string, string> = {
  pmh_htn: 'Hypertension',
  pmh_dm: 'Diabetes Mellitus',
  pmh_cad: 'Coronary Artery Disease / prior stent',
  pmh_asthma: 'Asthma',
  pmh_thyroid: 'Thyroid disorder',
};

const PRAKRITI_LABELS: Record<string, { primaryDosha: string; vata: number; pitta: number; kapha: number }> = {
  prakriti_vata: { primaryDosha: 'Vata Predominant', vata: 60, pitta: 25, kapha: 15 },
  prakriti_pitta: { primaryDosha: 'Pitta Predominant', vata: 20, pitta: 60, kapha: 20 },
  prakriti_kapha: { primaryDosha: 'Kapha Predominant', vata: 20, pitta: 20, kapha: 60 },
  prakriti_vatapitta: { primaryDosha: 'Vata-Pitta Dvandvaja', vata: 45, pitta: 40, kapha: 15 },
};

const AGNI_LABELS: Record<string, string> = {
  agni_mandagni: 'Mandagni (sluggish / heavy / slow digestive fire)',
  agni_tikshnagni: 'Tikshnagni (hyperactive / acidic / sharp digestive fire)',
  agni_vishamagni: 'Vishamagni (irregular / variable digestive fire)',
  agni_samagni: 'Samagni (balanced & energetic digestive fire)',
};

export interface AyushAssessmentFields {
  primaryDosha: string;
  prakritiVata: number;
  prakritiPitta: number;
  prakritiKapha: number;
  aharaShaktiAbhyavaharana: string;
  aharaShaktiJarana: string;
  vikriti: string;
}

export function buildAyushAssessmentFromAnswers(answers: Record<string, any>): AyushAssessmentFields {
  const prakriti = PRAKRITI_LABELS[answers['ayush_prakriti']] || { primaryDosha: 'Not assessed via kiosk', vata: 40, pitta: 35, kapha: 25 };
  const agni = AGNI_LABELS[answers['ayush_ahara_agni']] || 'Not assessed via kiosk';

  return {
    primaryDosha: prakriti.primaryDosha,
    prakritiVata: prakriti.vata,
    prakritiPitta: prakriti.pitta,
    prakritiKapha: prakriti.kapha,
    aharaShaktiAbhyavaharana: agni,
    aharaShaktiJarana: 'Not assessed via kiosk',
    vikriti: 'Not assessed via kiosk',
  };
}

export interface StructuredHistoryFields {
  chiefComplaintPrimary: string;
  onset: string;
  duration: string;
  severityScore: number;
  location: string;
  aggravatingFactors: string[];
  relievingFactors: string[];
  hpiNarrative: string;
  pastMedicalHistory: Array<{ condition: string; currentStatus: string }>;
  drugHistory: Array<{ drugName: string; adherence: string }>;
  allergyHistory: Array<{ allergen: string; reaction: string; severity: string }>;
  reviewOfSystems: Array<{ system: string; status: string; findings: string }>;
}

export function buildStructuredHistoryFromAnswers(
  patient: { name: string; age: number; gender: string },
  answers: Record<string, any>
): StructuredHistoryFields {
  const chiefComplaintId = answers['q_chief_complaint'];
  const chiefComplaintPrimary = CHIEF_COMPLAINT_LABELS[chiefComplaintId] || 'General clinical complaint reported at kiosk intake';

  const locationId = answers['q_location'];
  const location = LOCATION_LABELS[locationId] || 'Not specifically localized';

  const durationId = answers['q_duration'];
  const { onset, duration } = DURATION_LABELS[durationId] || { onset: 'Onset not specified', duration: 'Duration not specified' };

  const severityId = answers['q_severity'];
  const severityScore = SEVERITY_SCORES[severityId] ?? 5;

  const associatedIds: string[] = Array.isArray(answers['q_redflags_associated']) ? answers['q_redflags_associated'] : [];
  const associatedFindings = associatedIds
    .filter(id => id !== 'rf_none')
    .map(id => ASSOCIATED_SYMPTOM_LABELS[id])
    .filter(Boolean) as string[];

  const pastConditionIds: string[] = Array.isArray(answers['q_past_conditions']) ? answers['q_past_conditions'] : [];
  const pastMedicalHistory = pastConditionIds
    .filter(id => id !== 'pmh_none')
    .map(id => ({ condition: PAST_CONDITION_LABELS[id] || id, currentStatus: 'Reported by patient at kiosk intake' }));

  const medsAnswer = answers['q_allergies_meds'];
  const drugHistory =
    medsAnswer === 'med_taking_regular'
      ? [{ drugName: 'Regular daily medication (see uploaded prescriptions)', adherence: 'Reported regular' }]
      : [];
  const allergyHistory =
    medsAnswer === 'med_allergy_penicillin'
      ? [{ allergen: 'Penicillin / Sulfa drugs', reaction: 'Patient-reported allergy', severity: 'Reported at kiosk intake' }]
      : [];

  const hpiNarrative = `${patient.age}-year-old ${patient.gender.toLowerCase()} presents with ${chiefComplaintPrimary.toLowerCase()}. ${onset}, located at ${location.toLowerCase()}, rated ${severityScore}/10 in severity.${
    associatedFindings.length > 0 ? ` Associated findings: ${associatedFindings.join(', ')}.` : ''
  } History captured via MediKiosk AI-assisted multilingual intake.`;

  const reviewOfSystems = [
    {
      system: 'Presenting complaint',
      status: associatedFindings.length > 0 ? 'Abnormal' : 'Normal',
      findings: associatedFindings.length > 0 ? associatedFindings.join(', ') : 'No critical associated symptoms reported',
    },
  ];

  return {
    chiefComplaintPrimary,
    onset,
    duration,
    severityScore,
    location,
    aggravatingFactors: [],
    relievingFactors: [],
    hpiNarrative,
    pastMedicalHistory,
    drugHistory,
    allergyHistory,
    reviewOfSystems,
  };
}
