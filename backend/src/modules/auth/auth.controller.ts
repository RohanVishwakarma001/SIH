import { FastifyRequest, FastifyReply } from 'fastify';
import { authService } from './auth.service.js';
import { loginSchema, refreshSchema, abhaVerifySchema, mobileVerifySchema, walkinSchema, bootstrapAdminSchema } from './auth.schemas.js';
import { sendSuccess } from '../../shared/utils/response.js';
import { env } from '../../config/env.js';
import { UnauthorizedError } from '../../shared/errors/app.error.js';

export class AuthController {
  async login(request: FastifyRequest, reply: FastifyReply) {
    const data = loginSchema.parse(request.body);
    const result = await authService.login(data.email, data.password);
    return sendSuccess(reply, result, 200, request.id);
  }

  async refresh(request: FastifyRequest, reply: FastifyReply) {
    const data = refreshSchema.parse(request.body);
    const result = await authService.refresh(data.refreshToken);
    return sendSuccess(reply, result, 200, request.id);
  }

  async verifyAbha(request: FastifyRequest, reply: FastifyReply) {
    const data = abhaVerifySchema.parse(request.body);
    const result = await authService.verifyAbha(data.abhaId, data.otp, data.sessionId);
    return sendSuccess(reply, result, 200, request.id);
  }

  async verifyMobile(request: FastifyRequest, reply: FastifyReply) {
    const data = mobileVerifySchema.parse(request.body);
    const result = await authService.verifyMobile(data.mobile, data.otp, data.sessionId);
    return sendSuccess(reply, result, 200, request.id);
  }

  async registerWalkin(request: FastifyRequest, reply: FastifyReply) {
    const data = walkinSchema.parse(request.body);
    const result = await authService.registerWalkin(data);
    return sendSuccess(reply, result, 201, request.id);
  }

  async registerPatient(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as any;
    if (!body?.email || !body?.password || !body?.firstName || !body?.lastName) {
      return reply.status(400).send({ success: false, error: 'Email, password, firstName, and lastName are required' });
    }
    const result = await authService.registerPatientAccount(body);
    return sendSuccess(reply, result, 201, request.id);
  }

  async loginPatient(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as any;
    const identifier = body?.email || body?.phone || body?.identifier || body?.username;
    if (!identifier || !body?.password) {
      return reply.status(400).send({ success: false, error: 'Email/Phone and password are required' });
    }
    const result = await authService.loginPatientAccount(identifier, body.password);
    return sendSuccess(reply, result, 200, request.id);
  }

  async getCurrentUser(request: FastifyRequest, reply: FastifyReply) {
    return sendSuccess(reply, { user: request.user }, 200, request.id);
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    return sendSuccess(reply, { loggedOut: true }, 200, request.id);
  }

  async bootstrapAdmin(request: FastifyRequest, reply: FastifyReply) {
    const key = request.headers['x-bootstrap-key'];
    if (!env.BOOTSTRAP_ADMIN_KEY || key !== env.BOOTSTRAP_ADMIN_KEY) {
      throw new UnauthorizedError('Invalid or missing bootstrap key.');
    }
    const data = bootstrapAdminSchema.parse(request.body);
    const result = await authService.bootstrapAdmin(data);
    return sendSuccess(reply, result, 201, request.id);
  }
}

export const authController = new AuthController();
