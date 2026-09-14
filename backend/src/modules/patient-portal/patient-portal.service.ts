import { prisma } from '../../config/database.js';
import { NotFoundError } from '../../shared/errors/app.error.js';
import { DrugInteractionEngine } from '../../ai/rules/drug-interaction.rules.js';
import { ocrService } from '../ocr/ocr.service.js';

export class PatientPortalService {
  /**
   * Retrieves full profile and health metrics for the Patient Dashboard.
   */
  async getProfile(patientId: string) {
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        department: true,
        consents: { orderBy: { timestamp: 'desc' }, take: 1 },
      },
    });

    if (!patient) {
      throw new NotFoundError('Patient', patientId);
    }

    // Retrieve active clinical history
    const history = await prisma.clinicalHistory.findFirst({
      where: { patientId: patient.id },
      include: { ayushAssessment: true },
      orderBy: { createdAt: 'desc' },
    });

    return {
      id: patient.id,
      token: patient.token,
      name: patient.name,
      nameHindi: patient.nameHindi,
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone,
      abhaId: patient.abhaId,
      abhaAddress: patient.abhaAddress,
      abhaVerified: patient.abhaVerified,
      priority: patient.priority,
      queueStatus: patient.queueStatus,
      vitals: {
        bp: patient.bp,
        heartRate: patient.heartRate,
        spo2: patient.spo2,
        temperature: patient.temperature,
        bmi: patient.bmi,
        bloodSugar: patient.bloodSugar,
      },
      department: patient.department ? {
        id: patient.department.id,
        name: patient.department.name,
        code: patient.department.code,
      } : null,
      activeConsent: patient.consents[0] || {
        consentAi: true,
        consentDoctorShare: true,
        consentAbha: true,
        status: 'ACTIVE',
      },
      clinicalData: {
        pastMedicalHistory: history?.pastMedicalHistory || [],
        pastSurgicalHistory: history?.pastSurgicalHistory || [],
        drugAllergies: history?.allergyHistory || [],
        dailyMedications: history?.drugHistory || [],
        ayushConstitution: history?.ayushAssessment || null
      }
    };
  }

  /**
   * Updates patient profile details, lifestyle, chronic conditions, and personal health data ("put data").
   */
  async updateProfile(patientId: string, data: {
    phone?: string;
    age?: number;
    gender?: string;
    bloodSugar?: number;
    chronicConditions?: any[];
    allergies?: any[];
    medications?: any[];
    ayushDetails?: any;
  }) {
    const patient = await prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) throw new NotFoundError('Patient', patientId);

    const updated = await prisma.patient.update({
      where: { id: patientId },
      data: {
        phone: data.phone ?? patient.phone,
        age: data.age ?? patient.age,
        gender: data.gender ?? patient.gender,
        bloodSugar: data.bloodSugar ?? patient.bloodSugar,
      },
    });

    // Update or create this patient's clinical history entry so self-reported
    // conditions/allergies/medications are actually persisted even before
    // they've ever completed a kiosk clinical interview.
    const history = await prisma.clinicalHistory.findFirst({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
    });

    if (history) {
      await prisma.clinicalHistory.update({
        where: { id: history.id },
        data: {
          pastMedicalHistory: data.chronicConditions ?? history.pastMedicalHistory ?? undefined,
          allergyHistory: data.allergies ?? history.allergyHistory ?? undefined,
          drugHistory: data.medications ?? history.drugHistory ?? undefined,
        },
      });
    } else if (data.chronicConditions || data.allergies || data.medications) {
      await prisma.clinicalHistory.create({
        data: {
          patientId,
          chiefComplaintPrimary: 'Not yet recorded',
          onset: 'Not yet recorded',
          duration: 'Not yet recorded',
          location: 'Not yet recorded',
          hpiNarrative: 'Not yet recorded — patient has not completed a clinical interview yet.',
          pastMedicalHistory: data.chronicConditions ?? undefined,
          allergyHistory: data.allergies ?? undefined,
          drugHistory: data.medications ?? undefined,
          status: 'DRAFT',
        },
      });
    }

    return { success: true, patient: updated };
  }

  /**
   * Retrieves all stored medical records for this patient with abnormal lab highlights and DDI alerts.
   */
  async getDocuments(patientId: string) {
    const documents = await prisma.document.findMany({
      where: { patientId },
      include: {
        medicalEntities: true,
        ocrResults: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Extract all current medications across documents to check for real interactions only.
    const allMeds: string[] = [];
    documents.forEach(doc => {
      doc.medicalEntities
        .filter(e => e.category === 'MEDICATION')
        .forEach(e => allMeds.push(e.value));
    });

    const drugInteractions = allMeds.length > 0 ? DrugInteractionEngine.checkInteractions(allMeds) : [];

    return {
      documents: documents.map(d => ({
        id: d.id,
        title: d.title,
        documentType: d.documentType,
        facility: d.facility || 'Not specified',
        doctorName: d.doctorName || 'Not specified',
        date: d.date || new Date(d.createdAt).toISOString().split('T')[0],
        confidenceScore: d.confidenceScore ?? null,
        entities: d.medicalEntities.map(e => ({
          id: e.id,
          category: e.category.toLowerCase(),
          value: e.value,
          dosage: e.dosage,
          frequency: e.frequency,
          confidence: e.confidence,
          isVerified: e.isVerified,
        })),
      })),
      drugInteractions,
    };
  }

  /**
   * Uploads and stores a new medical document in the patient's personal records repository.
   */
  async storeDocument(patientId: string, data: {
    title: string;
    documentType: 'PRESCRIPTION' | 'LAB_REPORT' | 'DISCHARGE_SUMMARY' | 'IMAGING' | 'OTHER';
    fileUrl: string;
    storageKey: string;
    facility?: string;
    doctorName?: string;
    date?: string;
    rawText?: string;
  }) {
    const patient = await prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) throw new NotFoundError('Patient', patientId);

    const doc = await prisma.document.create({
      data: {
        patientId,
        title: data.title,
        documentType: data.documentType,
        fileUrl: data.fileUrl,
        storageKey: data.storageKey,
        facility: data.facility || 'Not specified',
        doctorName: data.doctorName || 'Not specified',
        date: data.date || new Date().toISOString().split('T')[0],
        ocrStatus: 'PENDING',
        rawOcrText: data.rawText,
      },
    });

    // Kick off the same document-intelligence pipeline used by the kiosk upload flow.
    await ocrService.triggerOcrProcess(doc.id);

    // Add corresponding medical timeline event
    await prisma.medicalTimelineEvent.create({
      data: {
        patientId,
        date: doc.date || new Date().toISOString().split('T')[0],
        yearMonth: (doc.date || new Date().toISOString()).slice(0, 7),
        title: doc.title,
        category: doc.documentType,
        facility: doc.facility || 'Not specified',
        summary: `Digitized and stored in personal medical records.`,
        badgeText: doc.documentType.replace('_', ' '),
        isImportant: true,
        documentId: doc.id,
      },
    });

    return doc;
  }

  /**
   * Retrieves complete medical journey: clinical summaries, timeline, and prescriptions.
   */
  async getMedicalJourney(patientId: string) {
    const timeline = await prisma.medicalTimelineEvent.findMany({
      where: { patientId },
      orderBy: { date: 'desc' },
    });

    const summaries = await prisma.clinicalSummary.findMany({
      where: { patientId },
      include: { revisions: true },
      orderBy: { createdAt: 'desc' },
    });

    const consultations = await prisma.consultation.findMany({
      where: { patientId },
      include: { prescriptions: true, doctor: true },
      orderBy: { createdAt: 'desc' },
    });

    return {
      timeline,
      summaries: summaries.map(s => ({
        id: s.id,
        conciseSummary: s.conciseSummary,
        keyPositiveFindings: s.keyPositiveFindings,
        pertinentNegatives: s.pertinentNegatives,
        differentialDiagnoses: s.differentialDiagnoses,
        recommendedInvestigations: s.recommendedInvestigations,
        status: s.status,
        createdAt: s.createdAt,
      })),
      consultations: consultations.map(c => ({
        id: c.id,
        provisionalDiagnosis: c.provisionalDiagnosis,
        icdCode: c.icdCode,
        clinicalNotes: c.clinicalNotes,
        doctorName: `Dr. ${c.doctor.firstName} ${c.doctor.lastName}`,
        prescriptions: c.prescriptions,
        createdAt: c.createdAt,
      })),
    };
  }
}

export const patientPortalService = new PatientPortalService();
