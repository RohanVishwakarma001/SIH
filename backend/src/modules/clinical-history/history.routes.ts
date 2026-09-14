import { FastifyInstance } from 'fastify';
import { clinicalHistoryController } from './history.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

export async function clinicalHistoryRoutes(fastify: FastifyInstance) {
  fastify.get('/:patientId', { preHandler: [authenticate] }, clinicalHistoryController.getHistory.bind(clinicalHistoryController));
}
