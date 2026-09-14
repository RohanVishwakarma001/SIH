import { prisma } from '../../config/database.js';
import { aiOrchestrator } from '../../ai/ai.orchestrator.js';
import { NotFoundError } from '../../shared/errors/app.error.js';

export class RedFlagService {
  async triggerRedFlag(data: {
    patientId: string;
    sessionId?: string;
    symptoms: string[];
    severity?: string;
    source?: string;
  }) {
    const patient = await prisma.patient.findUnique({ where: { id: data.patientId } });
    if (!patient) throw new NotFoundError('Patient', data.patientId);

    const evaluation = aiOrchestrator.evaluateClinicalTriage(data.symptoms, 9);

    const session = data.sessionId
      ? await prisma.patientSession.findUnique({ where: { id: data.sessionId } })
      : null;

    const redFlag = await prisma.redFlag.create({
      data: {
        patientId: data.patientId,
        sessionId: data.sessionId,
        title: evaluation.title,
        description: data.source || evaluation.reason,
        symptoms: evaluation.triggeringFindings,
        severity: 'CRITICAL',
        status: 'ACTIVE',
        staffPagingStatus: 'DISPATCHED',
      },
    });

    await prisma.triageAlert.create({
      data: {
        redFlagId: redFlag.id,
        patientId: data.patientId,
        kioskTerminalId: session?.kioskTerminalId,
      },
    });

    await prisma.patient.update({
      where: { id: data.patientId },
      data: { priority: 'URGENT' },
    });

    await prisma.auditLog.create({
      data: {
        actorId: data.patientId,
        actorName: patient.name,
        role: 'PATIENT',
        action: 'URGENT_RED_FLAG_TRIGGERED',
        resource: 'RedFlag',
        resourceId: redFlag.id,
        details: `${evaluation.title}: ${evaluation.reason}`,
        status: 'ALERT',
      },
    });

    return {
      alertId: redFlag.id,
      priority: 'URGENT',
      title: evaluation.title,
      description: evaluation.reason,
      symptoms: evaluation.triggeringFindings,
      staffAlertSent: true,
      emergencyToken: patient.token,
      triggeredAt: redFlag.triggeredAt.toISOString(),
    };
  }

  async getPatientRedFlag(patientId: string) {
    const redFlag = await prisma.redFlag.findFirst({
      where: { patientId, status: 'ACTIVE' },
      orderBy: { triggeredAt: 'desc' },
    });
    return { isTriggered: !!redFlag, redFlag };
  }
}

export const redFlagService = new RedFlagService();
