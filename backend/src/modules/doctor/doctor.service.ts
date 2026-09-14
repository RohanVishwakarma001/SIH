import { prisma } from '../../config/database.js';
import { clinicalHistoryService } from '../clinical-history/history.service.js';
import { summaryService } from '../summaries/summary.service.js';
import { timelineService } from '../timeline/timeline.service.js';
import { documentService } from '../documents/document.service.js';
import { redFlagService } from '../red-flags/red-flag.service.js';
import { NotFoundError } from '../../shared/errors/app.error.js';
import { enumToKebab } from '../../shared/utils/enum.js';

// External benchmark for manual (non-AI-assisted) OPD intake, used only to compute a
// "time saved" comparison metric. Not derived from this system's own data because there
// is no manual-intake pathway to measure.
const TRADITIONAL_INTAKE_MINUTES_BENCHMARK = 14.8;

export class DoctorService {
  async getDashboardMetrics() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [patientsToday, completedHistoriesToday, waitingCount, urgentRedFlagsCount, completedSessionsToday] = await Promise.all([
      prisma.patient.count({ where: { createdAt: { gte: startOfDay } } }),
      prisma.patient.count({ where: { createdAt: { gte: startOfDay }, historyStatus: { in: ['READY_FOR_REVIEW', 'VERIFIED'] } } }),
      prisma.patient.count({ where: { queueStatus: 'WAITING' } }),
      prisma.redFlag.count({ where: { status: 'ACTIVE' } }),
      prisma.patientSession.findMany({
        where: { startedAt: { gte: startOfDay }, completedAt: { not: null } },
        select: { startedAt: true, completedAt: true },
      }),
    ]);

    const completionRatePct = patientsToday > 0 ? Math.round((completedHistoriesToday / patientsToday) * 1000) / 10 : 0;

    const avgIntakeMinutes =
      completedSessionsToday.length > 0
        ? Math.round(
            (completedSessionsToday.reduce((sum, s) => sum + (s.completedAt!.getTime() - s.startedAt.getTime()), 0) /
              completedSessionsToday.length /
              60000) *
              10
          ) / 10
        : 0;

    return {
      todaysTotalOpd: patientsToday,
      waitingCount,
      completedHistoriesCount: completedHistoriesToday,
      completionRatePct,
      urgentRedFlagsCount,
      avgIntakeMinutes,
      traditionalIntakeMinutes: TRADITIONAL_INTAKE_MINUTES_BENCHMARK,
      timeSavedMinutesPerPatient: Math.max(0, Math.round((TRADITIONAL_INTAKE_MINUTES_BENCHMARK - avgIntakeMinutes) * 10) / 10),
    };
  }

  async getQueue(filterPriority = 'all', filterDepartment = 'all', searchQuery?: string) {
    const where: any = {};
    if (filterPriority !== 'all') where.priority = filterPriority.toUpperCase();
    if (filterDepartment !== 'all') where.department = { code: filterDepartment };
    if (searchQuery) {
      where.OR = [
        { name: { contains: searchQuery, mode: 'insensitive' } },
        { token: { contains: searchQuery, mode: 'insensitive' } },
        { abhaId: { contains: searchQuery, mode: 'insensitive' } },
        { chiefComplaintShort: { contains: searchQuery, mode: 'insensitive' } },
      ];
    }

    const patients = await prisma.patient.findMany({
      where,
      include: { department: true, documents: { select: { id: true } } },
      orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
    });

    const queue = patients.map(p => ({
      id: p.id,
      token: p.token,
      name: p.name,
      age: p.age,
      gender: p.gender,
      phone: p.phone,
      abhaId: p.abhaId,
      department: p.department.code,
      priority: enumToKebab(p.priority),
      queueStatus: enumToKebab(p.queueStatus),
      historyStatus: enumToKebab(p.historyStatus),
      waitTimeMinutes: p.waitTimeMinutes,
      chiefComplaintShort: p.chiefComplaintShort,
      documentsCount: p.documents.length,
    }));

    return { queue, total: queue.length };
  }

  /**
   * Aggregated single-call endpoint for Doctor Patient View (Hero Screen 2).
   */
  async getAggregatedPatientWorkspace(patientId: string) {
    const patient = await prisma.patient.findUnique({ where: { id: patientId }, include: { department: true } });
    if (!patient) throw new NotFoundError('Patient', patientId);

    const [structuredHistory, aiSummary, timeline, documents, redFlag] = await Promise.all([
      clinicalHistoryService.getStructuredHistory(patientId),
      summaryService.getPatientSummary(patientId),
      timelineService.getPatientTimeline(patientId),
      documentService.getPatientDocuments(patientId),
      redFlagService.getPatientRedFlag(patientId),
    ]);

    return {
      patient: {
        id: patient.id,
        token: patient.token,
        roomNo: patient.roomNo,
        name: patient.name,
        nameHindi: patient.nameHindi,
        age: patient.age,
        gender: patient.gender,
        phone: patient.phone,
        abhaId: patient.abhaId,
        abhaVerified: patient.abhaVerified,
        priority: enumToKebab(patient.priority),
        queueStatus: enumToKebab(patient.queueStatus),
        historyStatus: enumToKebab(patient.historyStatus),
        department: patient.department.code,
        vitals: {
          bp: patient.bp,
          heartRate: patient.heartRate,
          spo2: patient.spo2,
          temperature: patient.temperature,
          bmi: patient.bmi,
          bloodSugar: patient.bloodSugar,
        },
      },
      structuredHistory,
      aiSummary,
      timeline,
      documents,
      redFlagAlert: redFlag.isTriggered ? redFlag.redFlag : undefined,
    };
  }
}

export const doctorService = new DoctorService();
