import { prisma } from '../../config/database.js';
import { aiOrchestrator } from '../../ai/ai.orchestrator.js';
import { NotFoundError } from '../../shared/errors/app.error.js';

function shapeSummary(summary: {
  id: string;
  patientId: string;
  conciseSummary: string;
  keyPositiveFindings: unknown;
  pertinentNegatives: unknown;
  redFlagAlerts: unknown;
  differentialDiagnoses: unknown;
  recommendedInvestigations: unknown;
  status: string;
  currentRevisionNumber: number;
  createdAt: Date;
}) {
  return {
    id: summary.id,
    patientId: summary.patientId,
    generatedAt: summary.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    conciseSummary: summary.conciseSummary,
    keyPositiveFindings: summary.keyPositiveFindings,
    pertinentNegatives: summary.pertinentNegatives,
    redFlagAlerts: summary.redFlagAlerts,
    differentialDiagnoses: summary.differentialDiagnoses,
    recommendedInvestigations: summary.recommendedInvestigations,
    currentRevisionNumber: summary.currentRevisionNumber,
    doctorVerification: { status: summary.status.toLowerCase() },
  };
}

export class SummaryService {
  async generateSummary(patientId: string, interviewId?: string, isAyush = false) {
    const patient = await prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) throw new NotFoundError('Patient', patientId);

    const latestHistory = await prisma.clinicalHistory.findFirst({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
    });

    const aiOutput = await aiOrchestrator.generateSummary({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      chiefComplaint: latestHistory?.chiefComplaintPrimary || patient.chiefComplaintShort,
      answers: {},
      isAyush,
    });

    const summary = await prisma.clinicalSummary.create({
      data: {
        patientId,
        interviewId,
        conciseSummary: aiOutput.conciseSummary,
        keyPositiveFindings: aiOutput.keyPositiveFindings,
        pertinentNegatives: aiOutput.pertinentNegatives,
        redFlagAlerts: aiOutput.redFlagAlerts,
        differentialDiagnoses: aiOutput.differentialDiagnoses as any,
        recommendedInvestigations: aiOutput.recommendedInvestigations as any,
        status: 'PENDING',
        currentRevisionNumber: 1,
      },
    });

    await prisma.summaryRevision.create({
      data: {
        clinicalSummaryId: summary.id,
        revisionNumber: 1,
        summaryText: aiOutput.conciseSummary,
        action: 'GENERATED_BY_AI',
      },
    });

    return shapeSummary(summary);
  }

  async getPatientSummary(patientId: string) {
    const existing = await prisma.clinicalSummary.findFirst({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
    });

    if (existing) return shapeSummary(existing);

    return this.generateSummary(patientId);
  }

  async verifySummary(
    summaryId: string,
    action: 'accepted' | 'edited' | 'rejected',
    modifiedText: string | undefined,
    doctorId: string
  ) {
    const summary = await prisma.clinicalSummary.findUnique({ where: { id: summaryId } });
    if (!summary) throw new NotFoundError('ClinicalSummary', summaryId);

    const doctor = await prisma.user.findUnique({ where: { id: doctorId } });
    const nextRevisionNumber = summary.currentRevisionNumber + 1;

    const updated = await prisma.clinicalSummary.update({
      where: { id: summaryId },
      data: {
        status: action.toUpperCase() as any,
        currentRevisionNumber: nextRevisionNumber,
      },
    });

    await prisma.summaryRevision.create({
      data: {
        clinicalSummaryId: summaryId,
        revisionNumber: nextRevisionNumber,
        summaryText: modifiedText || summary.conciseSummary,
        action: action.toUpperCase(),
        modifiedByUserId: doctorId,
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: doctorId,
        actorName: doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Unknown Doctor',
        role: 'DOCTOR',
        action: `AI_SUMMARY_${action.toUpperCase()}`,
        resource: 'ClinicalSummary',
        resourceId: summaryId,
        details: `Doctor ${action} AI summary. Remarks: ${modifiedText || 'Approved without edits'}`,
      },
    });

    return {
      summaryId,
      status: action,
      modifiedText,
      verifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      verifiedByDoctorId: doctorId,
      revisionNumber: nextRevisionNumber,
      summary: shapeSummary(updated),
    };
  }
}

export const summaryService = new SummaryService();
