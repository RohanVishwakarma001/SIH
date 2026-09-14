import { FastifyInstance } from 'fastify';
import { doctorController } from './doctor.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';

export async function doctorRoutes(fastify: FastifyInstance) {
  const doctorAuth = { preHandler: [authenticate, requireRole(['DOCTOR', 'ADMIN'])] };

  fastify.get('/dashboard', doctorAuth, doctorController.getDashboard.bind(doctorController));
  fastify.get('/queue', doctorAuth, doctorController.getQueue.bind(doctorController));
  fastify.get('/patients/:patientId/workspace', doctorAuth, doctorController.getWorkspace.bind(doctorController));
}
