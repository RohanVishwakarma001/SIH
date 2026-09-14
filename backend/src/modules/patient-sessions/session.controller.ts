import { FastifyRequest, FastifyReply } from 'fastify';
import { sessionService } from './session.service.js';
import { sendSuccess } from '../../shared/utils/response.js';
import { z } from 'zod';

const createSessionSchema = z.object({
  departmentId: z.string().optional().default('general'),
  kioskTerminalId: z.string().optional().default('K01'),
  language: z.string().optional().default('hi'),
  patientId: z.string().optional(),
});

const updateLangSchema = z.object({
  languageCode: z.string().min(2).max(5),
});

export class SessionController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const data = createSessionSchema.parse(request.body || {});
    const session = await sessionService.createSession(
      data.departmentId,
      data.kioskTerminalId,
      data.language,
      data.patientId
    );
    return sendSuccess(reply, session, 201, request.id);
  }

  async updateLanguage(request: FastifyRequest, reply: FastifyReply) {
    const { sessionId } = request.params as { sessionId: string };
    const data = updateLangSchema.parse(request.body);
    const updated = await sessionService.updateLanguage(sessionId, data.languageCode);
    return sendSuccess(reply, updated, 200, request.id);
  }

  async getSession(request: FastifyRequest, reply: FastifyReply) {
    const { sessionId } = request.params as { sessionId: string };
    const session = await sessionService.getSession(sessionId);
    return sendSuccess(reply, session, 200, request.id);
  }

  async complete(request: FastifyRequest, reply: FastifyReply) {
    const { sessionId } = request.params as { sessionId: string };
    const result = await sessionService.completeSession(sessionId);
    return sendSuccess(reply, result, 200, request.id);
  }
}

export const sessionController = new SessionController();
