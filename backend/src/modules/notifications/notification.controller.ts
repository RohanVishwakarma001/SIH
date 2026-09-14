import { FastifyRequest, FastifyReply } from 'fastify';
import { notificationService } from './notification.service.js';
import { sendSuccess } from '../../shared/utils/response.js';
import { z } from 'zod';

const sendSmsSchema = z.object({
  mobile: z.string().min(10),
  token: z.string(),
  roomNo: z.string(),
});

const staffDispatchSchema = z.object({
  alertId: z.string(),
  kioskId: z.string(),
  notes: z.string().optional(),
});

export class NotificationController {
  async sendTokenSms(request: FastifyRequest, reply: FastifyReply) {
    const data = sendSmsSchema.parse(request.body);
    const result = await notificationService.sendTokenSms(data.mobile, data.token, data.roomNo);
    return sendSuccess(reply, result, 200, request.id);
  }

  async dispatchStaff(request: FastifyRequest, reply: FastifyReply) {
    const data = staffDispatchSchema.parse(request.body);
    const result = await notificationService.dispatchStaffEmergencyAlert(data.alertId, data.kioskId, data.notes);
    return sendSuccess(reply, result, 200, request.id);
  }
}

export const notificationController = new NotificationController();
