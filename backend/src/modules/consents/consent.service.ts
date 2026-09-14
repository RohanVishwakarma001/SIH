import { prisma } from '../../config/database.js';
import { NotFoundError } from '../../shared/errors/app.error.js';

export class ConsentService {
  async recordConsent(data: {
    patientId: string;
    sessionId: string;
    consentAi: boolean;
    consentDoctorShare: boolean;
    consentAbha: boolean;
    version?: string;
  }) {
    const consent = await prisma.consent.create({
      data: {
        patientId: data.patientId,
        sessionId: data.sessionId,
        consentAi: data.consentAi,
        consentDoctorShare: data.consentDoctorShare,
        consentAbha: data.consentAbha,
        version: data.version || '1.0',
        status: 'ACTIVE',
      },
    });

    const patient = await prisma.patient.findUnique({ where: { id: data.patientId } });

    await prisma.auditLog.create({
      data: {
        actorId: data.patientId,
        actorName: patient?.name || 'Kiosk Patient',
        role: 'PATIENT',
        action: 'ABHA_CONSENT_GRANTED',
        resource: 'Consent',
        resourceId: consent.id,
        details: `Patient granted ABDM Health Data Sharing consent (v${consent.version})`,
      },
    });

    return consent;
  }

  async getConsent(patientId: string) {
    const consent = await prisma.consent.findFirst({
      where: { patientId, status: 'ACTIVE' },
      orderBy: { timestamp: 'desc' },
    });
    return { hasConsented: !!consent, activeConsent: consent };
  }

  async revokeConsent(consentId: string, reason = 'Patient revoked') {
    const consent = await prisma.consent.findUnique({ where: { id: consentId } });
    if (!consent) throw new NotFoundError('Consent', consentId);

    return prisma.consent.update({
      where: { id: consentId },
      data: {
        status: 'REVOKED',
        revokedAt: new Date(),
        revokeReason: reason,
      },
    });
  }
}

export const consentService = new ConsentService();
