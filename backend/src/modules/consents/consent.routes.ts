import { FastifyInstance } from 'fastify';
import { consentController } from './consent.controller.js';
import { optionalAuthenticate } from '../../middleware/auth.middleware.js';

export async function consentRoutes(fastify: FastifyInstance) {
  fastify.post('/', { preHandler: [optionalAuthenticate] }, consentController.recordConsent.bind(consentController));
  fastify.get('/:patientId', { preHandler: [optionalAuthenticate] }, consentController.getConsent.bind(consentController));
  fastify.post('/:id/revoke', { preHandler: [optionalAuthenticate] }, consentController.revokeConsent.bind(consentController));
}
