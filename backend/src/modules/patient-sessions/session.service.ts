import { prisma } from '../../config/database.js';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundError } from '../../shared/errors/app.error.js';

export class SessionService {
  async createSession(departmentId = 'general', kioskTerminalCode = 'K01', language = 'hi', patientId?: string) {
    const dept = (await prisma.department.findFirst({
      where: { OR: [{ id: departmentId }, { code: departmentId }] },
    })) || (await prisma.department.findFirst({ where: { code: 'general' } }));

    if (!dept) {
      throw new NotFoundError('Department', departmentId);
    }

    const terminal = await prisma.kioskTerminal.findFirst({
      where: { OR: [{ id: kioskTerminalCode }, { terminalCode: kioskTerminalCode }] },
    });

    // A PatientSession has both an internal `id` and a public `sessionId` field in the
    // schema; every downstream relation (Consent, ClinicalInterview, RedFlag) is keyed off
    // `id`, while lookups from the frontend use `sessionId`. Assigning the same generated
    // value to both keeps every caller consistent without needing two identifiers.
    const id = uuidv4();

    const session = await prisma.patientSession.create({
      data: {
        id,
        sessionId: id,
        departmentId: dept.id,
        kioskTerminalId: terminal?.id,
        patientId: patientId || undefined,
        language,
        status: 'CREATED',
        currentStep: 1,
        estimatedWaitMins: dept.avgWaitMins,
      },
      include: { department: true, kioskTerminal: true },
    });

    return session;
  }

  async updateLanguage(sessionId: string, language: string) {
    const existing = await prisma.patientSession.findUnique({ where: { sessionId } });
    if (!existing) throw new NotFoundError('PatientSession', sessionId);

    return prisma.patientSession.update({
      where: { sessionId },
      data: { language },
    });
  }

  async getSession(sessionId: string) {
    const session = await prisma.patientSession.findUnique({
      where: { sessionId },
      include: { department: true, patient: true },
    });
    if (!session) throw new NotFoundError('PatientSession', sessionId);
    return session;
  }

  async completeSession(sessionId: string) {
    const session = await prisma.patientSession.findUnique({
      where: { sessionId },
      include: { patient: true },
    });
    if (!session) throw new NotFoundError('PatientSession', sessionId);

    await prisma.patientSession.update({
      where: { sessionId },
      data: { status: 'COMPLETED', completedAt: new Date() },
    });

    let assignedDoctorName = 'Duty Doctor';
    const doctor = await prisma.user.findFirst({ where: { role: 'DOCTOR', isActive: true } });
    if (doctor) assignedDoctorName = `Dr. ${doctor.firstName} ${doctor.lastName}`;

    if (session.patientId) {
      await prisma.patient.update({
        where: { id: session.patientId },
        data: { queueStatus: 'WAITING', historyStatus: 'READY_FOR_REVIEW' },
      });
    }

    const token = session.patient?.token || `A-${Math.floor(100 + Math.random() * 900)}`;
    const roomNo = session.patient?.roomNo || 'Room 04';

    return {
      token,
      roomNo,
      assignedDoctor: assignedDoctorName,
      waitTimeMins: session.patient?.waitTimeMinutes ?? session.estimatedWaitMins,
      queuePosition: await prisma.patient.count({ where: { queueStatus: 'WAITING' } }),
      qrCodeData: `https://medikiosk.in/opd/token/${token}`,
      completedAt: new Date().toISOString(),
    };
  }
}

export const sessionService = new SessionService();
