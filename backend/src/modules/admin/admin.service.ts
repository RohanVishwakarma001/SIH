import { prisma } from '../../config/database.js';

const DEPARTMENT_COLORS = ['bg-med-green', 'bg-red-400', 'bg-emerald-400', 'bg-amber-400', 'bg-cyan-400', 'bg-violet-400'];

// External benchmark for manual (non-AI-assisted) OPD intake, used only to compute a
// "time saved" comparison metric. Not derived from this system's own data because there
// is no manual-intake pathway to measure.
const TRADITIONAL_INTAKE_MINUTES_BENCHMARK = 14.8;

export class AdminService {
  async getAnalytics() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [patientsToday, historiesCompletedToday, urgentRedFlags, ocrDocs, ocrAvg, departments, patientsForDeptSplit, patientsForHourly, redFlagsForHourly, completedSessionsToday] =
      await Promise.all([
        prisma.patient.count({ where: { createdAt: { gte: startOfDay } } }),
        prisma.patient.count({ where: { createdAt: { gte: startOfDay }, historyStatus: { in: ['READY_FOR_REVIEW', 'VERIFIED'] } } }),
        prisma.redFlag.count({ where: { triggeredAt: { gte: startOfDay } } }),
        prisma.document.count({ where: { ocrStatus: 'COMPLETED' } }),
        prisma.document.aggregate({ where: { ocrStatus: 'COMPLETED' }, _avg: { confidenceScore: true } }),
        prisma.department.findMany(),
        prisma.patient.findMany({ where: { createdAt: { gte: startOfDay } }, select: { departmentId: true } }),
        prisma.patient.findMany({ where: { createdAt: { gte: startOfDay } }, select: { createdAt: true } }),
        prisma.redFlag.findMany({ where: { triggeredAt: { gte: startOfDay } }, select: { triggeredAt: true } }),
        prisma.patientSession.findMany({
          where: { startedAt: { gte: startOfDay }, completedAt: { not: null } },
          select: { startedAt: true, completedAt: true },
        }),
      ]);

    const completionRatePct = patientsToday > 0 ? Math.round((historiesCompletedToday / patientsToday) * 1000) / 10 : 0;

    const avgIntakeTimeMinutes =
      completedSessionsToday.length > 0
        ? Math.round(
            (completedSessionsToday.reduce((sum, s) => sum + (s.completedAt!.getTime() - s.startedAt.getTime()), 0) /
              completedSessionsToday.length /
              60000) *
              10
          ) / 10
        : 0;

    const deptCounts = new Map<string, number>();
    for (const p of patientsForDeptSplit) {
      deptCounts.set(p.departmentId, (deptCounts.get(p.departmentId) || 0) + 1);
    }
    const departmentDistribution = departments
      .map((d, idx) => ({
        name: d.name,
        count: deptCounts.get(d.id) || 0,
        pct: patientsToday > 0 ? Math.round(((deptCounts.get(d.id) || 0) / patientsToday) * 100) : 0,
        color: DEPARTMENT_COLORS[idx % DEPARTMENT_COLORS.length],
      }))
      .filter(d => d.count > 0);

    const hourlyMap = new Map<string, { intake: number; redFlags: number }>();
    for (const p of patientsForHourly) {
      const hour = `${String(p.createdAt.getHours()).padStart(2, '0')}:00`;
      const entry = hourlyMap.get(hour) || { intake: 0, redFlags: 0 };
      entry.intake += 1;
      hourlyMap.set(hour, entry);
    }
    for (const rf of redFlagsForHourly) {
      const hour = `${String(rf.triggeredAt.getHours()).padStart(2, '0')}:00`;
      const entry = hourlyMap.get(hour) || { intake: 0, redFlags: 0 };
      entry.redFlags += 1;
      hourlyMap.set(hour, entry);
    }
    const hourlyFlow = Array.from(hourlyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([hour, v]) => ({ hour, ...v }));

    return {
      metrics: {
        patientsToday,
        historiesCompletedKiosk: historiesCompletedToday,
        completionRatePct,
        avgIntakeTimeMinutes,
        traditionalIntakeMinutes: TRADITIONAL_INTAKE_MINUTES_BENCHMARK,
        timeSavedMinutesPerPatient: Math.max(0, Math.round((TRADITIONAL_INTAKE_MINUTES_BENCHMARK - avgIntakeTimeMinutes) * 10) / 10),
        urgentRedFlagsIntercepted: urgentRedFlags,
        documentsOcrProcessed: ocrDocs,
        ocrAccuracyRatePct: ocrAvg._avg.confidenceScore ? Math.round(ocrAvg._avg.confidenceScore * 10) / 10 : 0,
      },
      hourlyFlow,
      departmentDistribution,
    };
  }

  async getAuditLogs(limit = 50, offset = 0) {
    const [logs, totalCount] = await Promise.all([
      prisma.auditLog.findMany({ take: limit, skip: offset, orderBy: { timestamp: 'desc' } }),
      prisma.auditLog.count(),
    ]);
    return { logs, totalCount };
  }

  async getConsentRegistry() {
    const consents = await prisma.consent.findMany({
      include: { patient: true },
      orderBy: { timestamp: 'desc' },
    });

    return {
      registry: consents.map(c => ({
        id: c.id,
        abhaId: c.patient.abhaId || 'Not linked to ABHA',
        grantedTime: c.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        purpose: [
          c.consentAi ? 'AI-guided clinical intake' : null,
          c.consentDoctorShare ? 'Physician triage sharing' : null,
          c.consentAbha ? 'ABDM health record integration' : null,
        ]
          .filter(Boolean)
          .join(', '),
        validity: 'Duration of this OPD visit',
        status: c.status === 'ACTIVE' ? 'ACTIVE_CONSENT' : 'REVOKED_CONSENT',
      })),
      totalRecords: consents.length,
    };
  }
}

export const adminService = new AdminService();
