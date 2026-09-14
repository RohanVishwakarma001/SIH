import { FastifyInstance } from 'fastify';
import { consentController } from './consent.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

export async function consentRoutes(fastify: FastifyInstance) {
  fastify.post('/', { preHandler: [authenticate] }, consentController.recordConsent.bind(consentController));
  fastify.get('/:patientId', { preHandler: [authenticate] }, consentController.getConsent.bind(consentController));
  fastify.post('/:id/revoke', { preHandler: [authenticate] }, consentController.revokeConsent.bind(consentController));
}
