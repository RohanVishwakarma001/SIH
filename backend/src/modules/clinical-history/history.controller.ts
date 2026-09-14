import { FastifyRequest, FastifyReply } from 'fastify';
import { clinicalHistoryService } from './history.service.js';
import { sendSuccess } from '../../shared/utils/response.js';
import { assertPatientAccess } from '../../shared/utils/authorize.js';

export class ClinicalHistoryController {
  async getHistory(request: FastifyRequest, reply: FastifyReply) {
    const { patientId } = request.params as { patientId: string };
    assertPatientAccess(request, patientId);
    const history = await clinicalHistoryService.getStructuredHistory(patientId);
    return sendSuccess(reply, { history }, 200, request.id);
  }
}

export const clinicalHistoryController = new ClinicalHistoryController();
