import { PrismaClient, UserRole, PriorityLevel, QueueStatus, HistoryStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding MediKiosk database...');

  // 1. Hospital
  const hospital = await prisma.hospital.upsert({
    where: { code: 'AIIMS_DELHI' },
    update: {},
    create: {
      name: 'All India Institute of Medical Sciences (AIIMS)',
      code: 'AIIMS_DELHI',
      city: 'New Delhi',
      state: 'Delhi',
    },
  });

  // 2. Departments
  const generalDept = await prisma.department.upsert({
    where: { code: 'general' },
    update: {},
    create: {
      code: 'general',
      name: 'General Medicine',
      nativeName: 'सामान्य चिकित्सा',
      description: 'Fever, cough, weakness, common infections, diabetes & BP checkup',
      icon: 'Stethoscope',
      avgWaitMins: 14,
      hospitalId: hospital.id,
    },
  });

  const cardioDept = await prisma.department.upsert({
    where: { code: 'cardiology' },
    update: {},
    create: {
      code: 'cardiology',
      name: 'Cardiology',
      nativeName: 'हृदय रोग विभाग',
      description: 'Chest discomfort, high BP, palpitations, breathlessness, cardiac review',
      icon: 'HeartPulse',
      avgWaitMins: 18,
      hospitalId: hospital.id,
    },
  });

  const ayushDept = await prisma.department.upsert({
    where: { code: 'ayush' },
    update: {},
    create: {
      code: 'ayush',
      name: 'AYUSH / Ayurveda',
      nativeName: 'आयुष एवं आयुर्वेद',
      description: 'Holistic assessment, Dashavidha Pariksha, chronic metabolic & lifestyle care',
      icon: 'Leaf',
      avgWaitMins: 10,
      hospitalId: hospital.id,
    },
  });

  const orthoDept = await prisma.department.upsert({
    where: { code: 'orthopedics' },
    update: {},
    create: {
      code: 'orthopedics',
      name: 'Orthopedics',
      nativeName: 'हड्डी एवं जोड़ रोग',
      description: 'Joint pain, fractures, spine problems, arthritis, difficulty walking',
      icon: 'Bone',
      avgWaitMins: 12,
      hospitalId: hospital.id,
    },
  });

  // 3. Kiosk Terminals
  await prisma.kioskTerminal.upsert({
    where: { terminalCode: 'K01' },
    update: {},
    create: {
      terminalCode: 'K01',
      location: 'Gate 2 OPD Triage',
      status: 'In Use',
      activeLanguage: 'hi',
      currentPatientToken: 'A-104',
      hospitalId: hospital.id,
    },
  });

  await prisma.kioskTerminal.upsert({
    where: { terminalCode: 'K02' },
    update: {},
    create: {
      terminalCode: 'K02',
      location: 'Main OPD Lobby',
      status: 'In Use',
      activeLanguage: 'hi',
      currentPatientToken: 'B-208',
      hospitalId: hospital.id,
    },
  });

  await prisma.kioskTerminal.upsert({
    where: { terminalCode: 'K03' },
    update: {},
    create: {
      terminalCode: 'K03',
      location: 'AYUSH Wing 1st Floor',
      status: 'Ready',
      activeLanguage: 'en',
      currentPatientToken: 'C-312',
      hospitalId: hospital.id,
    },
  });

  await prisma.kioskTerminal.upsert({
    where: { terminalCode: 'K04' },
    update: {},
    create: {
      terminalCode: 'K04',
      location: 'Gate 3 Ortho Block',
      status: 'Ready',
      activeLanguage: 'mr',
      hospitalId: hospital.id,
    },
  });

  // 4. Clinical Users
  const doctorUser = await prisma.user.upsert({
    where: { email: 'doctor@medikiosk.in' },
    update: { firstName: 'K. S.', lastName: 'Venkatesh', role: UserRole.DOCTOR },
    create: {
      email: 'doctor@medikiosk.in',
      passwordHash: await bcrypt.hash('Doctor@123', 10),
      role: UserRole.DOCTOR,
      firstName: 'K. S.',
      lastName: 'Venkatesh',
      phone: '+91 98765 43210',
    },
  });

  await prisma.user.upsert({
    where: { email: 'staff@medikiosk.in' },
    update: { firstName: 'Sunita', lastName: 'Nursing Incharge', role: UserRole.STAFF },
    create: {
      email: 'staff@medikiosk.in',
      passwordHash: await bcrypt.hash('Staff@123', 10),
      role: UserRole.STAFF,
      firstName: 'Sunita',
      lastName: 'Nursing Incharge',
      phone: '+91 98765 43211',
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@medikiosk.in' },
    update: { firstName: 'Medical Director', lastName: 'Operations', role: UserRole.ADMIN },
    create: {
      email: 'admin@medikiosk.in',
      passwordHash: await bcrypt.hash('Admin@123', 10),
      role: UserRole.ADMIN,
      firstName: 'Medical Director',
      lastName: 'Operations',
      phone: '+91 98765 43212',
    },
  });

  // 5. Demo patients. IDs are pinned to well-known values so the doctor demo shortcuts
  // and integration tests can reference a stable, real database record instead of an
  // in-code mock array.
  const patient1 = await prisma.patient.upsert({
    where: { id: 'pat_001' },
    update: {},
    create: {
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
      priority: PriorityLevel.URGENT,
      queueStatus: QueueStatus.WAITING,
      historyStatus: HistoryStatus.READY_FOR_REVIEW,
      waitTimeMinutes: 2,
      checkedInTime: '08:42 AM',
      chiefComplaintShort: 'Acute crushing retrosternal chest pain radiating to left arm with diaphoresis',
      bp: '162/98',
      heartRate: 104,
      spo2: 94,
      temperature: '98.4 °F',
      bmi: 27.8,
      bloodSugar: 178,
      departmentId: cardioDept.id,
    },
  });

  const patient2 = await prisma.patient.upsert({
    where: { id: 'pat_002' },
    update: {},
    create: {
      id: 'pat_002',
      token: 'B-208',
      roomNo: 'Room 02 (General OPD)',
      name: 'Sunita Devi Sharma',
      nameHindi: 'सुनीता देवी शर्मा',
      age: 52,
      gender: 'Female',
      phone: '+91 97234 11982',
      abhaId: '82-1923-8821-3390',
      abhaAddress: 'sunita.sharma@abdm',
      abhaVerified: true,
      priority: PriorityLevel.ATTENTION,
      queueStatus: QueueStatus.READY,
      historyStatus: HistoryStatus.READY_FOR_REVIEW,
      waitTimeMinutes: 9,
      checkedInTime: '08:35 AM',
      chiefComplaintShort: 'Uncontrolled glycemic follow-up, bilateral distal tingling in feet, fatigue',
      bp: '138/86',
      heartRate: 78,
      spo2: 98,
      temperature: '98.2 °F',
      bmi: 29.4,
      bloodSugar: 214,
      departmentId: generalDept.id,
    },
  });

  const patient3 = await prisma.patient.upsert({
    where: { id: 'pat_003' },
    update: {},
    create: {
      id: 'pat_003',
      token: 'C-312',
      roomNo: 'Room 12 (AYUSH Wing)',
      name: 'Aarav Mukhopadhyay',
      nameHindi: 'आरव मुखोपाध्याय',
      age: 34,
      gender: 'Male',
      phone: '+91 94330 89124',
      abhaId: '77-3819-0931-1122',
      abhaAddress: 'aarav.mukhopadhyay@abdm',
      abhaVerified: true,
      priority: PriorityLevel.NORMAL,
      queueStatus: QueueStatus.READY,
      historyStatus: HistoryStatus.READY_FOR_REVIEW,
      waitTimeMinutes: 14,
      checkedInTime: '08:48 AM',
      chiefComplaintShort: 'Chronic Agnimandya (indigestion), bloating, irregular bowel habits, Vata-Pitta',
      bp: '118/76',
      heartRate: 72,
      spo2: 99,
      temperature: '98.6 °F',
      bmi: 23.1,
      bloodSugar: null,
      departmentId: ayushDept.id,
    },
  });

  const patient4 = await prisma.patient.upsert({
    where: { id: 'pat_004' },
    update: {},
    create: {
      id: 'pat_004',
      token: 'A-109',
      roomNo: 'Room 07 (Ortho OPD)',
      name: 'Meenakshi Sundaram',
      nameHindi: 'मीनाक्षी सुंदरम',
      age: 64,
      gender: 'Female',
      phone: '+91 94441 55670',
      abhaId: '63-9182-4402-9912',
      abhaAddress: 'meenakshi.sundaram@abdm',
      abhaVerified: true,
      priority: PriorityLevel.NORMAL,
      queueStatus: QueueStatus.WAITING,
      historyStatus: HistoryStatus.READY_FOR_REVIEW,
      waitTimeMinutes: 18,
      checkedInTime: '08:31 AM',
      chiefComplaintShort: 'Bilateral knee joint pain and morning stiffness for 2 years, worse with stairs',
      bp: '142/88',
      heartRate: 80,
      spo2: 97,
      temperature: '98.5 °F',
      bmi: 28.6,
      bloodSugar: null,
      departmentId: orthoDept.id,
    },
  });

  // 6. Clinical history + AI summary for the cardiac patient (Rameshwar) so the doctor
  // workspace has real structured data to review without needing a live kiosk run.
  const history1 = await prisma.clinicalHistory.upsert({
    where: { id: 'hist_pat_001' },
    update: {},
    create: {
      id: 'hist_pat_001',
      patientId: patient1.id,
      chiefComplaintPrimary: 'Retrosternal chest pain radiating to left shoulder and arm',
      onset: 'Sudden onset 2 hours ago',
      duration: '2 hours persistent',
      severityScore: 9,
      location: 'Mid-chest, radiating to left jaw and left arm',
      aggravatingFactors: ['Exertion', 'Walking'],
      relievingFactors: ['Rest (partial)'],
      hpiNarrative:
        'A 58-year-old male with a history of hypertension presents with sudden, crushing mid-chest heaviness starting 2 hours ago. Pain radiates to the left arm and jaw. Patient felt nauseated and noticed cold profuse sweating.',
      pastMedicalHistory: [
        { condition: 'Essential Hypertension', currentStatus: 'Active, diagnosed 2019' },
        { condition: 'Dyslipidemia', currentStatus: 'Active, diagnosed 2021' },
      ],
      pastSurgicalHistory: [{ procedure: 'Appendectomy', year: '2008', hospital: 'District Hospital Jabalpur' }],
      drugHistory: [
        { drugName: 'Telmisartan', dosage: '40mg', frequency: 'OD', adherence: 'Regular', duration: '5 years' },
        { drugName: 'Atorvastatin', dosage: '20mg', frequency: 'HS', adherence: 'Regular', duration: '3 years' },
      ],
      allergyHistory: [{ allergen: 'Penicillin', reaction: 'Skin rash and facial angioedema', severity: 'Severe (Anaphylaxis Risk)' }],
      familyHistory: [{ relation: 'Father', condition: 'Myocardial Infarction at age 62' }],
      personalHistory: { diet: 'Vegetarian', tobaccoUse: 'Quit bidi 6 years ago', alcoholUse: 'Nil', sleep: '6 hours', physicalActivity: 'Sedentary' },
      reviewOfSystems: [
        { system: 'Cardiovascular', status: 'Abnormal', findings: 'Chest pain, palpitation, diaphoresis' },
        { system: 'Respiratory', status: 'Abnormal', findings: 'Mild exertional dyspnea' },
      ],
      previousInvestigations: [{ testName: 'Lipid Profile - Total Cholesterol', result: '242', unit: 'mg/dL', referenceRange: '< 200', date: 'Jan 2026', status: 'High' }],
      status: 'READY_FOR_REVIEW',
    },
  });

  await prisma.clinicalSummary.upsert({
    where: { id: 'sum_pat_001' },
    update: {},
    create: {
      id: 'sum_pat_001',
      patientId: patient1.id,
      conciseSummary:
        '58M presenting with acute crushing retrosternal chest pain radiating to the left arm/jaw, accompanied by diaphoresis and vital instability. High pre-test probability of Acute Coronary Syndrome (STEMI / NSTEMI). Immediate 12-lead ECG and hs-Troponin advised.',
      keyPositiveFindings: [
        'Acute retrosternal chest pressure radiating to left upper extremity',
        'Cold diaphoresis and exertional onset',
        'Elevated systolic BP and resting tachycardia',
      ],
      pertinentNegatives: ['No pleuritic chest pain or friction rub', 'No focal neurological signs'],
      redFlagAlerts: ['URGENT: High suspicion for Acute Coronary Syndrome'],
      differentialDiagnoses: [
        { name: 'Acute Myocardial Infarction (STEMI / NSTEMI)', icdCode: 'I21.9', confidence: 92, clinicalRationale: 'Typical crushing radiation, cold sweat, cardiovascular risk factors' },
        { name: 'Unstable Angina Pectoris', icdCode: 'I20.0', confidence: 78, clinicalRationale: 'Crescendo angina at low exertion' },
      ],
      recommendedInvestigations: ['Stat 12-Lead Electrocardiogram', 'High Sensitivity Cardiac Troponin-I', 'Point-of-Care Bedside 2D Echocardiogram'],
      status: 'PENDING',
      currentRevisionNumber: 1,
    },
  });

  await prisma.medicalTimelineEvent.upsert({
    where: { id: 'tl_pat_001_1' },
    update: {},
    create: {
      id: 'tl_pat_001_1',
      patientId: patient1.id,
      date: 'Today, 08:42 AM',
      yearMonth: 'Sep 2026',
      title: 'MediKiosk Intake & Triage',
      category: 'diagnosis',
      facility: 'AIIMS OPD Kiosk',
      summary: 'Patient completed AI kiosk intake. Red flag triggered for acute chest pain.',
      badgeText: 'Urgent Red Flag',
      isImportant: true,
    },
  });

  await prisma.medicalTimelineEvent.upsert({
    where: { id: 'tl_pat_001_2' },
    update: {},
    create: {
      id: 'tl_pat_001_2',
      patientId: patient1.id,
      date: '18 Jan 2026',
      yearMonth: 'Jan 2026',
      title: 'Cardiology Review & Prescription Refill',
      category: 'prescription',
      facility: 'RML Hospital New Delhi',
      summary: 'BP 154/96. Telmisartan 40mg and Atorvastatin 20mg renewed.',
      badgeText: 'Prescription OCR',
      isImportant: false,
    },
  });

  // 7. Diabetes follow-up patient (Sunita) - general medicine, non-urgent.
  await prisma.clinicalHistory.upsert({
    where: { id: 'hist_pat_002' },
    update: {},
    create: {
      id: 'hist_pat_002',
      patientId: patient2.id,
      chiefComplaintPrimary: 'Uncontrolled glycemic follow-up with bilateral distal tingling in feet',
      onset: 'Progressive over 6 months',
      duration: 'Chronic',
      severityScore: 4,
      location: 'Bilateral feet (paresthesia)',
      aggravatingFactors: ['Prolonged standing'],
      relievingFactors: ['Rest'],
      hpiNarrative:
        'A 52-year-old female with known Type 2 Diabetes Mellitus presents for routine follow-up reporting suboptimal glycemic control and new bilateral distal paresthesia suggestive of early peripheral neuropathy.',
      pastMedicalHistory: [{ condition: 'Type 2 Diabetes Mellitus', currentStatus: 'Active, diagnosed 2018' }],
      pastSurgicalHistory: [],
      drugHistory: [{ drugName: 'Metformin', dosage: '500mg', frequency: 'BD', adherence: 'Regular', duration: '6 years' }],
      allergyHistory: [],
      familyHistory: [{ relation: 'Mother', condition: 'Type 2 Diabetes Mellitus' }],
      personalHistory: { diet: 'Vegetarian', tobaccoUse: 'Nil', alcoholUse: 'Nil', sleep: '7 hours', physicalActivity: 'Sedentary' },
      reviewOfSystems: [{ system: 'Neurological', status: 'Abnormal', findings: 'Bilateral distal paresthesia' }],
      previousInvestigations: [{ testName: 'HbA1c', result: '8.8', unit: '%', referenceRange: '< 5.7', date: 'Feb 2026', status: 'High' }],
      status: 'READY_FOR_REVIEW',
    },
  });

  await prisma.medicalTimelineEvent.upsert({
    where: { id: 'tl_pat_002_1' },
    update: {},
    create: {
      id: 'tl_pat_002_1',
      patientId: patient2.id,
      date: 'Today, 08:35 AM',
      yearMonth: 'Sep 2026',
      title: 'MediKiosk Intake & Triage',
      category: 'diagnosis',
      facility: 'AIIMS OPD Kiosk',
      summary: 'Patient completed AI kiosk intake for chronic diabetes follow-up.',
      badgeText: 'Kiosk Intake',
      isImportant: false,
    },
  });

  // 8. AYUSH patient (Aarav) with a Dashavidha Pariksha assessment.
  const history3 = await prisma.clinicalHistory.upsert({
    where: { id: 'hist_pat_003' },
    update: {},
    create: {
      id: 'hist_pat_003',
      patientId: patient3.id,
      chiefComplaintPrimary: 'Chronic Agnimandya (sluggish digestion) with postprandial bloating',
      onset: 'Gradual over several months',
      duration: 'Chronic',
      severityScore: 4,
      location: 'Upper abdomen',
      aggravatingFactors: ['Irregular meal timing', 'Late-night eating'],
      relievingFactors: ['Warm food', 'Regular meal timing'],
      hpiNarrative:
        'A 34-year-old male presents with chronic sluggish digestion, postprandial bloating, and irregular bowel habits, consistent with Vishamagni per Ayurvedic assessment.',
      pastMedicalHistory: [],
      pastSurgicalHistory: [],
      drugHistory: [],
      allergyHistory: [],
      familyHistory: [],
      personalHistory: { diet: 'Vegetarian', tobaccoUse: 'Nil', alcoholUse: 'Occasional', sleep: '5-6 hours, irregular', physicalActivity: 'Sedentary' },
      reviewOfSystems: [{ system: 'Gastrointestinal', status: 'Abnormal', findings: 'Bloating, irregular bowel habits' }],
      previousInvestigations: [],
      status: 'READY_FOR_REVIEW',
    },
  });

  await prisma.ayushAssessment.upsert({
    where: { clinicalHistoryId: history3.id },
    update: {},
    create: {
      clinicalHistoryId: history3.id,
      patientId: patient3.id,
      prakritiVata: 45,
      prakritiPitta: 40,
      prakritiKapha: 15,
      primaryDosha: 'Vata-Pitta Dvandvaja',
      vikriti: 'Vishamagni with Pitta-Kapha Samana',
      aharaShaktiAbhyavaharana: 'Vishamagni (irregular / variable digestive fire)',
      aharaShaktiJarana: 'Mandata (delayed digestion)',
    },
  });

  await prisma.medicalTimelineEvent.upsert({
    where: { id: 'tl_pat_003_1' },
    update: {},
    create: {
      id: 'tl_pat_003_1',
      patientId: patient3.id,
      date: 'Today, 08:48 AM',
      yearMonth: 'Sep 2026',
      title: 'MediKiosk AYUSH Intake',
      category: 'diagnosis',
      facility: 'AIIMS AYUSH Wing Kiosk',
      summary: 'Patient completed AI kiosk intake including Dashavidha Pariksha assessment.',
      badgeText: 'Kiosk Intake',
      isImportant: false,
    },
  });

  // 9. Orthopedic patient (Meenakshi) - normal priority, no history yet (tests the
  // "not yet assessed" path for a patient who has checked in but not completed intake).
  await prisma.medicalTimelineEvent.upsert({
    where: { id: 'tl_pat_004_1' },
    update: {},
    create: {
      id: 'tl_pat_004_1',
      patientId: patient4.id,
      date: 'Today, 08:31 AM',
      yearMonth: 'Sep 2026',
      title: 'MediKiosk Intake & Triage',
      category: 'diagnosis',
      facility: 'AIIMS OPD Kiosk',
      summary: 'Patient checked in for orthopedic OPD review.',
      badgeText: 'Kiosk Intake',
      isImportant: false,
    },
  });

  console.log(`✅ Seeded ${4} demo patients, 3 clinical histories, 2 clinical summaries, and clinical staff accounts.`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
