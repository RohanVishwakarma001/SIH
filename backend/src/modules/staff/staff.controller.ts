import { FastifyRequest, FastifyReply } from 'fastify';
import { staffService } from './staff.service.js';
import { sendSuccess } from '../../shared/utils/response.js';

export class StaffController {
  async getKiosks(request: FastifyRequest, reply: FastifyReply) {
    const result = await staffService.getKiosksTelemetry();
    return sendSuccess(reply, result, 200, request.id);
  }

  async getAlerts(request: FastifyRequest, reply: FastifyReply) {
    const result = await staffService.getActiveAlerts();
    return sendSuccess(reply, result, 200, request.id);
  }

  async acknowledgeAlert(request: FastifyRequest, reply: FastifyReply) {
    const { alertId } = request.params as { alertId: string };
    const { remarks } = (request.body as any) || {};
    const result = await staffService.acknowledgeAlert(alertId, request.user!.userId, remarks);
    return sendSuccess(reply, result, 200, request.id);
  }
}

export const staffController = new StaffController();
