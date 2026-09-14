import { FastifyInstance } from 'fastify';
import { adminController } from './admin.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';

export async function adminRoutes(fastify: FastifyInstance) {
  const adminAuth = { preHandler: [authenticate, requireRole(['ADMIN'])] };

  fastify.get('/analytics', adminAuth, adminController.getAnalytics.bind(adminController));
  fastify.get('/audit-logs', adminAuth, adminController.getAuditLogs.bind(adminController));
  fastify.get('/consent-registry', adminAuth, adminController.getConsentRegistry.bind(adminController));
}
