import { FastifyRequest, FastifyReply } from 'fastify';
import { summaryService } from './summary.service.js';
import { sendSuccess } from '../../shared/utils/response.js';
import { z } from 'zod';

const generateSummarySchema = z.object({
  patientId: z.string(),
  interviewId: z.string().optional(),
  isAyush: z.boolean().optional(),
});

const verifySummarySchema = z.object({
  action: z.enum(['accepted', 'edited', 'rejected']),
  modifiedText: z.string().optional(),
  physicianRemarks: z.string().optional(),
});

export class SummaryController {
  async generate(request: FastifyRequest, reply: FastifyReply) {
    const data = generateSummarySchema.parse(request.body);
    const result = await summaryService.generateSummary(data.patientId, data.interviewId, data.isAyush);
    return sendSuccess(reply, result, 201, request.id);
  }

  async getPatientSummary(request: FastifyRequest, reply: FastifyReply) {
    const { patientId } = request.params as { patientId: string };
    const result = await summaryService.getPatientSummary(patientId);
    return sendSuccess(reply, result, 200, request.id);
  }

  async verify(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const data = verifySummarySchema.parse(request.body);
    const result = await summaryService.verifySummary(
      id,
      data.action,
      data.modifiedText,
      request.user!.userId
    );
    return sendSuccess(reply, result, 200, request.id);
  }
}

export const summaryController = new SummaryController();
