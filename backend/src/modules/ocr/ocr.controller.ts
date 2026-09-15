import { FastifyRequest, FastifyReply } from 'fastify';
import { ocrService } from './ocr.service.js';
import { sendSuccess } from '../../shared/utils/response.js';
import { z } from 'zod';

const correctEntitySchema = z.object({
  entityId: z.string().min(1),
  correctedValue: z.string().min(1),
});

const verifyEntitySchema = z.object({
  entityId: z.string().min(1),
});

export class OcrController {
  async process(request: FastifyRequest, reply: FastifyReply) {
    const { documentId } = request.params as { documentId: string };
    const result = await ocrService.triggerOcrProcess(documentId);
    return sendSuccess(reply, result, 200, request.id);
  }

  async getStatus(request: FastifyRequest, reply: FastifyReply) {
    const { jobId } = request.params as { jobId: string };
    const result = await ocrService.getJobStatus(jobId);
    return sendSuccess(reply, result, 200, request.id);
  }

  async getExtraction(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const result = await ocrService.getDocumentExtraction(id);
    return sendSuccess(reply, result, 200, request.id);
  }

  async correctEntity(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const data = correctEntitySchema.parse(request.body);
    const result = await ocrService.correctEntity(id, data.entityId, data.correctedValue, request.user?.userId);
    return sendSuccess(reply, result, 200, request.id);
  }

  async verifyEntity(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const data = verifyEntitySchema.parse(request.body);
    const result = await ocrService.verifyEntity(id, data.entityId, request.user?.userId);
    return sendSuccess(reply, result, 200, request.id);
  }
}

export const ocrController = new OcrController();
