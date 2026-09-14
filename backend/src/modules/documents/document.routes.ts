import { FastifyInstance } from 'fastify';
import { documentController } from './document.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

export async function documentRoutes(fastify: FastifyInstance) {
  fastify.post('/upload', { preHandler: [authenticate] }, documentController.upload.bind(documentController));
  fastify.get('/patient/:patientId', { preHandler: [authenticate] }, documentController.getPatientDocs.bind(documentController));
  fastify.get('/:id', { preHandler: [authenticate] }, documentController.getDocById.bind(documentController));
}
