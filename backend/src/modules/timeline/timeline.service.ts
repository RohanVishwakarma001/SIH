import { prisma } from '../../config/database.js';

export class TimelineService {
  async getPatientTimeline(patientId: string) {
    return prisma.medicalTimelineEvent.findMany({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async appendTimelineEvent(data: {
    patientId: string;
    date: string;
    yearMonth?: string;
    title: string;
    category: string;
    facility: string;
    summary: string;
    badgeText?: string;
    isImportant?: boolean;
    documentId?: string;
  }) {
    return prisma.medicalTimelineEvent.create({
      data: {
        patientId: data.patientId,
        date: data.date,
        yearMonth: data.yearMonth || new Date().toLocaleString([], { month: 'short', year: 'numeric' }),
        title: data.title,
        category: data.category,
        facility: data.facility,
        summary: data.summary,
        badgeText: data.badgeText || 'Clinical Note',
        isImportant: data.isImportant || false,
        documentId: data.documentId,
      },
    });
  }
}

export const timelineService = new TimelineService();
