export interface RedFlagEvaluationResult {
  isTriggered: boolean;
  priority: 'NORMAL' | 'ATTENTION' | 'URGENT';
  title: string;
  reason: string;
  triggeringFindings: string[];
}

export class RedFlagRuleEngine {
  /**
   * Deterministically evaluates symptoms and clinical findings for emergency priority triage.
   */
  public static evaluate(
    symptoms: string[],
    severityScore?: number,
    location?: string,
    onset?: string,
    vitals?: { bp?: string; hr?: number; spo2?: number }
  ): RedFlagEvaluationResult {
    const findings: string[] = [];
    const normalizedSymptoms = symptoms.map(s => s.toLowerCase());

    // 1. Acute Coronary Syndrome (ACS) Rule
    const hasChestDiscomfort = normalizedSymptoms.some(s => 
      s.includes('chest_pain') || s.includes('chest pain') || s.includes('heaviness') || s.includes('loc_chest_arm')
    ) || (location && location.toLowerCase().includes('chest'));

    const hasRadiationOrSweating = normalizedSymptoms.some(s =>
      s.includes('sweating') || s.includes('rf_sweating') || s.includes('diaphoresis') ||
      s.includes('arm') || s.includes('jaw') || s.includes('breathless') || s.includes('rf_breathless')
    );

    if (hasChestDiscomfort && (hasRadiationOrSweating || (severityScore && severityScore >= 8))) {
      findings.push('Substernal chest pain or crushing pressure');
      if (hasRadiationOrSweating) findings.push('Radiation to arm/jaw or cold diaphoresis');
      if (severityScore && severityScore >= 8) findings.push(`Severe distress (Severity ${severityScore}/10)`);

      return {
        isTriggered: true,
        priority: 'URGENT',
        title: 'ACUTE CORONARY SYNDROME SUSPICION',
        reason: 'Acute crushing chest discomfort accompanied by radiation, sweating, or severe distress.',
        triggeringFindings: findings,
      };
    }

    // 2. Severe Respiratory Failure Rule
    const hasSevereDyspnea = normalizedSymptoms.some(s =>
      s.includes('cough_breathless') || s.includes('rf_breathless') || s.includes('shortness of breath')
    );

    if (hasSevereDyspnea && (vitals?.spo2 && vitals.spo2 < 92)) {
      findings.push('Severe acute breathlessness at rest');
      findings.push(`Low oxygen saturation (SpO2 ${vitals.spo2}%)`);

      return {
        isTriggered: true,
        priority: 'URGENT',
        title: 'ACUTE RESPIRATORY INSUFFICIENCY',
        reason: 'Resting shortness of breath with hypoxemia indicator.',
        triggeringFindings: findings,
      };
    }

    // 3. Neurological Deficit / Stroke / Near-Syncope Rule
    const hasNeurologicalSigns = normalizedSymptoms.some(s =>
      s.includes('slurred') || s.includes('speech') || s.includes('weakness') ||
      s.includes('paralysis') || s.includes('facial') || s.includes('droop') ||
      s.includes('vision loss') || s.includes('confusion')
    );

    if (hasNeurologicalSigns) {
      findings.push('Focal neurological deficit (slurred speech / unilateral weakness / facial droop)');
      return {
        isTriggered: true,
        priority: 'URGENT',
        title: 'ACUTE NEUROLOGICAL DEFICIT / STROKE WARNING',
        reason: 'Patient presents with acute focal neurological deficits requiring immediate emergency stroke triage.',
        triggeringFindings: findings,
      };
    }

    const hasSyncopeOrDizziness = normalizedSymptoms.some(s =>
      s.includes('dizziness') || s.includes('rf_dizziness') || s.includes('fainting') || s.includes('syncope')
    );

    if (hasSyncopeOrDizziness && (vitals?.hr && (vitals.hr > 120 || vitals.hr < 45))) {
      findings.push('Dizziness / Near-syncope');
      findings.push(`Hemodynamic vulnerability (Heart Rate ${vitals.hr} bpm)`);

      return {
        isTriggered: true,
        priority: 'URGENT',
        title: 'HEMODYNAMIC / SYNCOPE RISK',
        reason: 'Altered consciousness or dizziness with abnormal heart rate.',
        triggeringFindings: findings,
      };
    }

    // 4. Critical Pain Score
    if (severityScore && severityScore >= 8) {
      findings.push(`Severe intractable pain (Severity ${severityScore}/10)`);
      return {
        isTriggered: true,
        priority: 'URGENT',
        title: 'SEVERE INTRACTABLE PAIN',
        reason: 'Patient reports severe distress (>= 8/10) requiring immediate analgesia and evaluation.',
        triggeringFindings: findings,
      };
    }

    // 5. Moderate Attention Triggers
    const hasModerateFlags = normalizedSymptoms.some(s =>
      s.includes('fever') || s.includes('vomiting') || s.includes('chills')
    );

    if (hasModerateFlags || (severityScore && severityScore >= 5)) {
      if (hasModerateFlags) findings.push('High febrile illness with chills or persistent vomiting');
      if (severityScore && severityScore >= 5) findings.push(`Moderate-high reported discomfort (${severityScore}/10)`);
      return {
        isTriggered: true,
        priority: 'ATTENTION',
        title: 'ACUTE SYMPTOM EVALUATION',
        reason: 'Patient reports moderate distress requiring expedited clinical review.',
        triggeringFindings: findings,
      };
    }

    return {
      isTriggered: false,
      priority: 'NORMAL',
      title: 'ROUTINE OPD TRIAGE',
      reason: 'Standard OPD priority based on current interview responses.',
      triggeringFindings: [],
    };
  }
}

export const evaluateRedFlags = (
  symptoms: string[],
  severityScore?: number,
  location?: string,
  onset?: string,
  vitals?: any
): RedFlagEvaluationResult => {
  return RedFlagRuleEngine.evaluate(symptoms, severityScore, location, onset, vitals);
};
