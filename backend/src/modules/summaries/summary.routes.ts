import { FastifyInstance } from 'fastify';
import { summaryController } from './summary.controller.js';
import { authenticate, optionalAuthenticate } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';

export async function summaryRoutes(fastify: FastifyInstance) {
  fastify.post('/generate', { preHandler: [optionalAuthenticate] }, summaryController.generate.bind(summaryController));
  fastify.get('/:patientId', { preHandler: [optionalAuthenticate] }, summaryController.getPatientSummary.bind(summaryController));
  fastify.post('/:id/verify', { preHandler: [authenticate, requireRole(['DOCTOR', 'ADMIN'])] }, summaryController.verify.bind(summaryController));
}
