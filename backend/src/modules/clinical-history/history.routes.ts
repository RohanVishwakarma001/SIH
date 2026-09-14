import { FastifyInstance } from 'fastify';
import { clinicalHistoryController } from './history.controller.js';
import { optionalAuthenticate } from '../../middleware/auth.middleware.js';

export async function clinicalHistoryRoutes(fastify: FastifyInstance) {
  fastify.get('/:patientId', { preHandler: [optionalAuthenticate] }, clinicalHistoryController.getHistory.bind(clinicalHistoryController));
}
