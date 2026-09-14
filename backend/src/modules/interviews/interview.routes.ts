import { FastifyInstance } from 'fastify';
import { interviewController } from './interview.controller.js';
import { optionalAuthenticate } from '../../middleware/auth.middleware.js';

export async function interviewRoutes(fastify: FastifyInstance) {
  fastify.post('/', { preHandler: [optionalAuthenticate] }, interviewController.getOrCreate.bind(interviewController));
  fastify.post('/:id/answer', { preHandler: [optionalAuthenticate] }, interviewController.submitAnswer.bind(interviewController));
  fastify.post('/voice/transcribe', { preHandler: [optionalAuthenticate] }, interviewController.transcribeVoice.bind(interviewController));
  fastify.post('/:id/complete', { preHandler: [optionalAuthenticate] }, interviewController.complete.bind(interviewController));
}
