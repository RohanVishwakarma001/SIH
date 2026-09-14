import { FastifyInstance } from 'fastify';
import { ocrController } from './ocr.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

export async function ocrRoutes(fastify: FastifyInstance) {
  fastify.post('/process/:documentId', { preHandler: [authenticate] }, ocrController.process.bind(ocrController));
  fastify.get('/status/:jobId', { preHandler: [authenticate] }, ocrController.getStatus.bind(ocrController));
  fastify.get('/:id/extraction', { preHandler: [authenticate] }, ocrController.getExtraction.bind(ocrController));
  fastify.patch('/:id/extraction', { preHandler: [authenticate] }, ocrController.correctEntity.bind(ocrController));
}
