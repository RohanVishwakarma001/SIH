import { FastifyRequest, FastifyReply } from 'fastify';
import { consentService } from './consent.service.js';
import { sendSuccess } from '../../shared/utils/response.js';
import { assertPatientAccess, resolvePatientIdForWrite } from '../../shared/utils/authorize.js';
import { z } from 'zod';

const recordConsentSchema = z.object({
  patientId: z.string().min(1).optional(),
  sessionId: z.string().min(1),
  consentAi: z.boolean().default(true),
  consentDoctorShare: z.boolean().default(true),
  consentAbha: z.boolean().default(true),
  version: z.string().optional(),
});

export class ConsentController {
  async recordConsent(request: FastifyRequest, reply: FastifyReply) {
    const data = recordConsentSchema.parse(request.body);
    const patientId = resolvePatientIdForWrite(request, data.patientId);
    const result = await consentService.recordConsent({ ...data, patientId });
    return sendSuccess(reply, result, 201, request.id);
  }

  async getConsent(request: FastifyRequest, reply: FastifyReply) {
    const { patientId } = request.params as { patientId: string };
    assertPatientAccess(request, patientId);
    const result = await consentService.getConsent(patientId);
    return sendSuccess(reply, result, 200, request.id);
  }

  async revokeConsent(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const { reason } = (request.body as any) || {};
    const result = await consentService.revokeConsent(id, reason);
    return sendSuccess(reply, result, 200, request.id);
  }
}

export const consentController = new ConsentController();
