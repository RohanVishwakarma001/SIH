import { FastifyRequest, FastifyReply } from 'fastify';
import { authService } from './auth.service.js';
import { loginSchema, refreshSchema, abhaVerifySchema, mobileVerifySchema, walkinSchema } from './auth.schemas.js';
import { sendSuccess } from '../../shared/utils/response.js';

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

  async getCurrentUser(request: FastifyRequest, reply: FastifyReply) {
    return sendSuccess(reply, { user: request.user }, 200, request.id);
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    return sendSuccess(reply, { loggedOut: true }, 200, request.id);
  }
}

export const authController = new AuthController();
