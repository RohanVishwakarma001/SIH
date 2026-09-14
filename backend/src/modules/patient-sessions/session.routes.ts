import { FastifyInstance } from 'fastify';
import { sessionController } from './session.controller.js';

export async function sessionRoutes(fastify: FastifyInstance) {
  fastify.post('/', sessionController.create.bind(sessionController));
  fastify.get('/:sessionId', sessionController.getSession.bind(sessionController));
  fastify.patch('/:sessionId/language', sessionController.updateLanguage.bind(sessionController));
  fastify.post('/:sessionId/complete', sessionController.complete.bind(sessionController));
}
