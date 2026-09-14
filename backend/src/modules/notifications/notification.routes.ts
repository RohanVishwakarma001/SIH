import { FastifyInstance } from 'fastify';
import { notificationController } from './notification.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

export async function notificationRoutes(fastify: FastifyInstance) {
  fastify.post('/send-token-sms', { preHandler: [authenticate] }, notificationController.sendTokenSms.bind(notificationController));
  fastify.post('/staff-dispatch', { preHandler: [authenticate] }, notificationController.dispatchStaff.bind(notificationController));
}
