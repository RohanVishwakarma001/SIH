import { FastifyInstance } from 'fastify';
import { timelineController } from './timeline.controller.js';
import { optionalAuthenticate } from '../../middleware/auth.middleware.js';

export async function timelineRoutes(fastify: FastifyInstance) {
  fastify.get('/:patientId', { preHandler: [optionalAuthenticate] }, timelineController.getTimeline.bind(timelineController));
  fastify.post('/events', { preHandler: [optionalAuthenticate] }, timelineController.createEvent.bind(timelineController));
}
