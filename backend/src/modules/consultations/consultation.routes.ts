import { FastifyInstance } from 'fastify';
import { consultationController } from './consultation.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';

export async function consultationRoutes(fastify: FastifyInstance) {
  const doctorAuth = { preHandler: [authenticate, requireRole(['DOCTOR', 'ADMIN'])] };

  fastify.post('/', doctorAuth, consultationController.save.bind(consultationController));
  fastify.post('/:id/push-abha', doctorAuth, consultationController.pushAbha.bind(consultationController));
}
