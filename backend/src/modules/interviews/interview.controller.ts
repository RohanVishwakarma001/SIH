import { FastifyRequest, FastifyReply } from 'fastify';
import { interviewService } from './interview.service.js';
import { sendSuccess } from '../../shared/utils/response.js';
import { z } from 'zod';

const createInterviewSchema = z.object({
  patientId: z.string(),
  sessionId: z.string(),
  departmentId: z.string().optional().default('general'),
});

const submitAnswerSchema = z.object({
  questionId: z.string(),
  answerType: z.string(),
  value: z.any(),
  rawVoiceTranscript: z.string().optional(),
  confidence: z.number().optional(),
  department: z.string().optional(),
  stepNumber: z.number().optional(),
});

const completeInterviewSchema = z.object({
  patientId: z.string(),
});

export class InterviewController {
  async getOrCreate(request: FastifyRequest, reply: FastifyReply) {
    const data = createInterviewSchema.parse(request.body);
    const result = await interviewService.getOrCreateInterview(data.patientId, data.sessionId, data.departmentId);
    return sendSuccess(reply, result, 201, request.id);
  }

  async submitAnswer(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const data = submitAnswerSchema.parse(request.body);
    const result = await interviewService.submitAnswer({
      interviewId: id,
      ...data,
      value: data.value ?? null,
      patientId: request.user?.patientId,
    });
    return sendSuccess(reply, result, 200, request.id);
  }

  async transcribeVoice(request: FastifyRequest, reply: FastifyReply) {
    const { language = 'hi' } = (request.query as any) || {};
    // Simulate buffer from multipart or body
    const result = await interviewService.transcribeVoice(Buffer.from([]), language);
    return sendSuccess(reply, result, 200, request.id);
  }

  async complete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const data = completeInterviewSchema.parse(request.body);
    const result = await interviewService.completeInterview(id, data.patientId);
    return sendSuccess(reply, result, 200, request.id);
  }
}

export const interviewController = new InterviewController();
