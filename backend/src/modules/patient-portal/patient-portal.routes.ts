import { FastifyInstance } from 'fastify';
import { patientPortalController } from './patient-portal.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

// Every route here serves a specific patient's personal health records, so all of
// them require a verified bearer token (no unauthenticated fallback to any record).
export async function patientPortalRoutes(fastify: FastifyInstance) {
  fastify.get('/profile', { preHandler: [authenticate] }, patientPortalController.getProfile.bind(patientPortalController));
  fastify.put('/profile', { preHandler: [authenticate] }, patientPortalController.updateProfile.bind(patientPortalController));
  fastify.get('/documents', { preHandler: [authenticate] }, patientPortalController.getDocuments.bind(patientPortalController));
  fastify.post('/documents', { preHandler: [authenticate] }, patientPortalController.storeDocument.bind(patientPortalController));
  fastify.get('/records', { preHandler: [authenticate] }, patientPortalController.getMedicalJourney.bind(patientPortalController));
}
