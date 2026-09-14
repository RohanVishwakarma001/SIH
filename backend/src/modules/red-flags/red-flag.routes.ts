import { FastifyInstance } from 'fastify';
import { redFlagController } from './red-flag.controller.js';

export async function redFlagRoutes(fastify: FastifyInstance) {
  fastify.post('/trigger', redFlagController.trigger.bind(redFlagController));
  fastify.get('/:patientId', redFlagController.getPatientRedFlag.bind(redFlagController));
}
