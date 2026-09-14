import { FastifyInstance } from 'fastify';
import { staffController } from './staff.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';

export async function staffRoutes(fastify: FastifyInstance) {
  const staffAuth = { preHandler: [authenticate, requireRole(['STAFF', 'ADMIN'])] };

  fastify.get('/kiosks', staffAuth, staffController.getKiosks.bind(staffController));
  fastify.get('/alerts', staffAuth, staffController.getAlerts.bind(staffController));
  fastify.post('/alerts/:alertId/acknowledge', staffAuth, staffController.acknowledgeAlert.bind(staffController));
}
