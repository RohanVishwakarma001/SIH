import { FastifyRequest, FastifyReply } from 'fastify';
import { adminService } from './admin.service.js';
import { sendSuccess } from '../../shared/utils/response.js';

export class AdminController {
  async getAnalytics(request: FastifyRequest, reply: FastifyReply) {
    const result = await adminService.getAnalytics();
    return sendSuccess(reply, result, 200, request.id);
  }

  async getAuditLogs(request: FastifyRequest, reply: FastifyReply) {
    const { limit = '50', offset = '0' } = (request.query as any) || {};
    const result = await adminService.getAuditLogs(Number(limit), Number(offset));
    return sendSuccess(reply, result, 200, request.id);
  }

  async getConsentRegistry(request: FastifyRequest, reply: FastifyReply) {
    const result = await adminService.getConsentRegistry();
    return sendSuccess(reply, result, 200, request.id);
  }
}

export const adminController = new AdminController();
