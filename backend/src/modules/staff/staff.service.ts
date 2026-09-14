import { prisma } from '../../config/database.js';
import { NotFoundError } from '../../shared/errors/app.error.js';

export class StaffService {
  async getKiosksTelemetry() {
    const terminals = await prisma.kioskTerminal.findMany({ orderBy: { terminalCode: 'asc' } });

    return {
      activeKiosks: terminals.map(t => ({
        id: t.id,
        terminalCode: t.terminalCode,
        location: t.location,
        status: t.status,
        patientToken: t.currentPatientToken || 'Idle',
        language: t.activeLanguage,
      })),
    };
  }

  async getActiveAlerts() {
    const redFlags = await prisma.redFlag.findMany({
      where: { status: 'ACTIVE' },
      include: { patient: true, session: { include: { kioskTerminal: true } } },
      orderBy: { triggeredAt: 'desc' },
    });

    return {
      alerts: redFlags.map(rf => ({
        id: rf.id,
        patientToken: rf.patient.token,
        patientName: rf.patient.name,
        age: rf.patient.age,
        gender: rf.patient.gender,
        title: rf.title,
        description: rf.description,
        severity: rf.severity,
        kioskTerminal: rf.session?.kioskTerminal
          ? `${rf.session.kioskTerminal.location} (${rf.session.kioskTerminal.terminalCode})`
          : 'Kiosk terminal not recorded',
        triggeredAt: rf.triggeredAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: rf.staffPagingStatus,
      })),
    };
  }

  async acknowledgeAlert(alertId: string, staffId: string, remarks?: string) {
    const redFlag = await prisma.redFlag.findUnique({ where: { id: alertId } });
    if (!redFlag) throw new NotFoundError('RedFlag', alertId);

    const staff = await prisma.user.findUnique({ where: { id: staffId } });

    await prisma.redFlag.update({
      where: { id: alertId },
      data: { status: 'ACKNOWLEDGED' },
    });

    const triageAlert = await prisma.triageAlert.findFirst({ where: { redFlagId: alertId } });
    if (triageAlert) {
      await prisma.triageAlert.update({
        where: { id: triageAlert.id },
        data: { status: 'ACKNOWLEDGED', acknowledgedByUserId: staffId, acknowledgedAt: new Date() },
      });
    }

    await prisma.auditLog.create({
      data: {
        actorId: staffId,
        actorName: staff ? `${staff.firstName} ${staff.lastName}` : 'Unknown Staff',
        role: 'STAFF',
        action: 'RED_FLAG_ACKNOWLEDGED',
        resource: 'RedFlag',
        resourceId: alertId,
        details: remarks || 'Nursing staff acknowledged and dispatched to patient.',
      },
    });

    return {
      alertId,
      status: 'ACKNOWLEDGED',
      acknowledgedByStaffId: staffId,
      nurseDispatchedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      remarks: remarks || 'Emergency Triage Nurse dispatched.',
    };
  }
}

export const staffService = new StaffService();
