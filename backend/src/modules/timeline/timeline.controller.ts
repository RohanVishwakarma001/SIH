import { FastifyRequest, FastifyReply } from 'fastify';
import { timelineService } from './timeline.service.js';
import { sendSuccess } from '../../shared/utils/response.js';
import { assertPatientAccess, resolvePatientIdForWrite } from '../../shared/utils/authorize.js';
import { z } from 'zod';

const createEventSchema = z.object({
  patientId: z.string().optional(),
  date: z.string(),
  title: z.string(),
  category: z.string(),
  facility: z.string(),
  summary: z.string(),
  badgeText: z.string().optional(),
  isImportant: z.boolean().optional(),
});

export class TimelineController {
  async getTimeline(request: FastifyRequest, reply: FastifyReply) {
    const { patientId } = request.params as { patientId: string };
    assertPatientAccess(request, patientId);
    const timeline = await timelineService.getPatientTimeline(patientId);
    return sendSuccess(reply, { timeline }, 200, request.id);
  }

  async createEvent(request: FastifyRequest, reply: FastifyReply) {
    const data = createEventSchema.parse(request.body);
    const patientId = resolvePatientIdForWrite(request, data.patientId);
    const result = await timelineService.appendTimelineEvent({ ...data, patientId });
    return sendSuccess(reply, result, 201, request.id);
  }
}

export const timelineController = new TimelineController();
