import { FastifyRequest, FastifyReply } from 'fastify';
import { consultationService } from './consultation.service.js';
import { sendSuccess } from '../../shared/utils/response.js';
import { z } from 'zod';

const prescriptionItemSchema = z.object({
  medicine: z.string().min(1),
  dosage: z.string().min(1),
  frequency: z.string().min(1),
  duration: z.string().min(1),
  instructions: z.string().optional().default('After food'),
});

const saveConsultationSchema = z.object({
  patientId: z.string(),
  provisionalDiagnosis: z.string(),
  icdCode: z.string(),
  clinicalNotes: z.string(),
  prescriptions: z.array(prescriptionItemSchema),
  orderedInvestigations: z.array(z.string()).optional(),
  followUpDays: z.number().optional().default(7),
});

export class ConsultationController {
  async save(request: FastifyRequest, reply: FastifyReply) {
    const data = saveConsultationSchema.parse(request.body);
    const result = await consultationService.saveConsultation({
      ...data,
      doctorId: request.user!.userId,
    });
    return sendSuccess(reply, result, 201, request.id);
  }

  async pushAbha(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const result = await consultationService.pushToAbha(id);
    return sendSuccess(reply, result, 200, request.id);
  }
}

export const consultationController = new ConsultationController();
