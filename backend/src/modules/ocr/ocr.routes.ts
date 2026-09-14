import { FastifyInstance } from 'fastify';
import { ocrController } from './ocr.controller.js';
import { optionalAuthenticate } from '../../middleware/auth.middleware.js';

export async function ocrRoutes(fastify: FastifyInstance) {
  fastify.post('/process/:documentId', { preHandler: [optionalAuthenticate] }, ocrController.process.bind(ocrController));
  fastify.get('/status/:jobId', { preHandler: [optionalAuthenticate] }, ocrController.getStatus.bind(ocrController));
  fastify.get('/:id/extraction', { preHandler: [optionalAuthenticate] }, ocrController.getExtraction.bind(ocrController));
  fastify.patch('/:id/extraction', { preHandler: [optionalAuthenticate] }, ocrController.correctEntity.bind(ocrController));
}
