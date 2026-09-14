import { FastifyInstance } from 'fastify';
import { interviewController } from './interview.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

export async function interviewRoutes(fastify: FastifyInstance) {
  fastify.post('/', { preHandler: [authenticate] }, interviewController.getOrCreate.bind(interviewController));
  fastify.post('/:id/answer', { preHandler: [authenticate] }, interviewController.submitAnswer.bind(interviewController));
  fastify.post('/voice/transcribe', { preHandler: [authenticate] }, interviewController.transcribeVoice.bind(interviewController));
  fastify.post('/:id/complete', { preHandler: [authenticate] }, interviewController.complete.bind(interviewController));
}
