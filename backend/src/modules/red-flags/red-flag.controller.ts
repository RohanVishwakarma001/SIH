import { FastifyRequest, FastifyReply } from 'fastify';
import { redFlagService } from './red-flag.service.js';
import { sendSuccess } from '../../shared/utils/response.js';
import { assertPatientAccess, resolvePatientIdForWrite } from '../../shared/utils/authorize.js';
import { z } from 'zod';

const triggerRedFlagSchema = z.object({
  patientId: z.string().optional(),
  sessionId: z.string().optional(),
  symptoms: z.array(z.string()),
  severity: z.string().optional().default('critical'),
  source: z.string().optional(),
});

export class RedFlagController {
  async trigger(request: FastifyRequest, reply: FastifyReply) {
    const data = triggerRedFlagSchema.parse(request.body);
    const patientId = resolvePatientIdForWrite(request, data.patientId);
    const result = await redFlagService.triggerRedFlag({ ...data, patientId });
    return sendSuccess(reply, result, 201, request.id);
  }

  async getPatientRedFlag(request: FastifyRequest, reply: FastifyReply) {
    const { patientId } = request.params as { patientId: string };
    assertPatientAccess(request, patientId);
    const result = await redFlagService.getPatientRedFlag(patientId);
    return sendSuccess(reply, result, 200, request.id);
  }
}

export const redFlagController = new RedFlagController();
