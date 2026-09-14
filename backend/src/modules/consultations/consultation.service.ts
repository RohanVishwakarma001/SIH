import { prisma } from '../../config/database.js';
import { MockFhirProvider } from '../../integrations/fhir/mock.fhir.provider.js';
import { NotFoundError } from '../../shared/errors/app.error.js';
import { v4 as uuidv4 } from 'uuid';

export class ConsultationService {
  async saveConsultation(data: {
    patientId: string;
    doctorId: string;
    provisionalDiagnosis: string;
    icdCode: string;
    clinicalNotes: string;
    prescriptions: any[];
    orderedInvestigations?: string[];
    followUpDays?: number;
  }) {
    const doctor = await prisma.user.findUnique({ where: { id: data.doctorId } });
    if (!doctor) throw new NotFoundError('User', data.doctorId);

    const consultation = await prisma.consultation.create({
      data: {
        patientId: data.patientId,
        doctorId: data.doctorId,
        provisionalDiagnosis: data.provisionalDiagnosis,
        icdCode: data.icdCode,
        clinicalNotes: data.clinicalNotes,
        orderedInvestigations: data.orderedInvestigations,
        followUpDays: data.followUpDays || 7,
        savedAt: new Date(),
        prescriptions: {
          create: data.prescriptions.map(rx => ({
            medicine: rx.medicine,
            dosage: rx.dosage,
            frequency: rx.frequency,
            duration: rx.duration,
            instructions: rx.instructions,
          })),
        },
      },
    });

    await prisma.patient.update({
      where: { id: data.patientId },
      data: { queueStatus: 'COMPLETED', historyStatus: 'VERIFIED' },
    });

    await prisma.auditLog.create({
      data: {
        actorId: data.doctorId,
        actorName: `Dr. ${doctor.firstName} ${doctor.lastName}`,
        role: 'DOCTOR',
        action: 'CONSULTATION_SAVED',
        resource: 'Consultation',
        resourceId: consultation.id,
        details: `Diagnosis: ${data.provisionalDiagnosis} (ICD-10: ${data.icdCode}), ${data.prescriptions.length} Rx items.`,
      },
    });

    return {
      consultationId: consultation.id,
      status: 'SAVED',
      savedAt: consultation.savedAt!.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }

  async pushToAbha(consultationId: string) {
    const consultation = await prisma.consultation.findUnique({
      where: { id: consultationId },
      include: { patient: true, doctor: true, prescriptions: true },
    });
    if (!consultation) throw new NotFoundError('Consultation', consultationId);

    const abhaBundle = MockFhirProvider.buildOpdConsultationBundle({
      patientId: consultation.patientId,
      patientName: consultation.patient.name,
      doctorId: consultation.doctorId,
      doctorName: `Dr. ${consultation.doctor.firstName} ${consultation.doctor.lastName}`,
      diagnosis: consultation.provisionalDiagnosis,
      icdCode: consultation.icdCode,
      prescriptions: consultation.prescriptions,
      clinicalNotes: consultation.clinicalNotes,
    });

    await prisma.consultation.update({
      where: { id: consultationId },
      data: { isPushedToAbha: true, abhaBundleId: abhaBundle.id },
    });

    return {
      pushedToAbha: true,
      abhaBundleId: abhaBundle.id,
      transactionId: `txn_abdm_${uuidv4().substring(0, 8)}`,
      timestamp: new Date().toISOString(),
    };
  }
}

export const consultationService = new ConsultationService();
