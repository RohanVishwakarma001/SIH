import { FastifyInstance } from 'fastify';
import { timelineController } from './timeline.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

export async function timelineRoutes(fastify: FastifyInstance) {
  fastify.get('/:patientId', { preHandler: [authenticate] }, timelineController.getTimeline.bind(timelineController));
  fastify.post('/events', { preHandler: [authenticate] }, timelineController.createEvent.bind(timelineController));
}
