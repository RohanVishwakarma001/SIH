import { FastifyInstance } from 'fastify';
import { notificationController } from './notification.controller.js';
import { optionalAuthenticate } from '../../middleware/auth.middleware.js';

export async function notificationRoutes(fastify: FastifyInstance) {
  fastify.post('/send-token-sms', { preHandler: [optionalAuthenticate] }, notificationController.sendTokenSms.bind(notificationController));
  fastify.post('/staff-dispatch', { preHandler: [optionalAuthenticate] }, notificationController.dispatchStaff.bind(notificationController));
}
