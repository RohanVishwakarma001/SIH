import { FastifyInstance } from 'fastify';
import { authController } from './auth.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/login', authController.login.bind(authController));
  fastify.post('/refresh', authController.refresh.bind(authController));
  fastify.post('/patient/abha-verify', authController.verifyAbha.bind(authController));
  fastify.post('/patient/mobile-verify', authController.verifyMobile.bind(authController));
  fastify.post('/patient/walkin', authController.registerWalkin.bind(authController));
  fastify.post('/patient/register', authController.registerPatient.bind(authController));
  fastify.post('/patient/login', authController.loginPatient.bind(authController));
  fastify.post('/bootstrap-admin', authController.bootstrapAdmin.bind(authController));

  fastify.get('/me', { preHandler: [authenticate] }, authController.getCurrentUser.bind(authController));
  fastify.post('/logout', { preHandler: [authenticate] }, authController.logout.bind(authController));
}
