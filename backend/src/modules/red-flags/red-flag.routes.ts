import { FastifyInstance } from 'fastify';
import { redFlagController } from './red-flag.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

export async function redFlagRoutes(fastify: FastifyInstance) {
  fastify.post('/trigger', { preHandler: [authenticate] }, redFlagController.trigger.bind(redFlagController));
  fastify.get('/:patientId', { preHandler: [authenticate] }, redFlagController.getPatientRedFlag.bind(redFlagController));
}
