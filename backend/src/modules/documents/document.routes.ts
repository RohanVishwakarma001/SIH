import { FastifyInstance } from 'fastify';
import { documentController } from './document.controller.js';
import { optionalAuthenticate } from '../../middleware/auth.middleware.js';

export async function documentRoutes(fastify: FastifyInstance) {
  fastify.post('/upload', { preHandler: [optionalAuthenticate] }, documentController.upload.bind(documentController));
  fastify.get('/patient/:patientId', { preHandler: [optionalAuthenticate] }, documentController.getPatientDocs.bind(documentController));
  fastify.get('/:id', { preHandler: [optionalAuthenticate] }, documentController.getDocById.bind(documentController));
}
