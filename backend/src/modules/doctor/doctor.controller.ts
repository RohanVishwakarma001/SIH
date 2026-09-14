import { FastifyRequest, FastifyReply } from 'fastify';
import { doctorService } from './doctor.service.js';
import { sendSuccess } from '../../shared/utils/response.js';

export class DoctorController {
  async getDashboard(request: FastifyRequest, reply: FastifyReply) {
    const metrics = await doctorService.getDashboardMetrics();
    return sendSuccess(reply, metrics, 200, request.id);
  }

  async getQueue(request: FastifyRequest, reply: FastifyReply) {
    const { priority = 'all', department = 'all', search = '' } = (request.query as any) || {};
    const queue = await doctorService.getQueue(priority, department, search);
    return sendSuccess(reply, queue, 200, request.id);
  }

  async getWorkspace(request: FastifyRequest, reply: FastifyReply) {
    const { patientId } = request.params as { patientId: string };
    const workspace = await doctorService.getAggregatedPatientWorkspace(patientId);
    return sendSuccess(reply, workspace, 200, request.id);
  }
}

export const doctorController = new DoctorController();
