import { FastifyRequest, FastifyReply } from 'fastify';
import { patientPortalService } from './patient-portal.service.js';
import { sendSuccess } from '../../shared/utils/response.js';
import { UnauthorizedError, BadRequestError } from '../../shared/errors/app.error.js';
import { StorageProvider } from '../../integrations/storage/storage.provider.js';

function requirePatientId(request: FastifyRequest): string {
  const user = request.user;
  const patientId = user?.patientId || user?.userId;
  if (!patientId) {
    throw new UnauthorizedError('Sign in to your patient account to access this record.');
  }
  return patientId;
}

export class PatientPortalController {
  async getProfile(request: FastifyRequest, reply: FastifyReply) {
    const patientId = requirePatientId(request);
    const result = await patientPortalService.getProfile(patientId);
    return sendSuccess(reply, result, 200, request.id);
  }

  async updateProfile(request: FastifyRequest, reply: FastifyReply) {
    const patientId = requirePatientId(request);
    const result = await patientPortalService.updateProfile(patientId, request.body as any);
    return sendSuccess(reply, result, 200, request.id);
  }

  async getDocuments(request: FastifyRequest, reply: FastifyReply) {
    const patientId = requirePatientId(request);
    const result = await patientPortalService.getDocuments(patientId);
    return sendSuccess(reply, result, 200, request.id);
  }

  async storeDocument(request: FastifyRequest, reply: FastifyReply) {
    const patientId = requirePatientId(request);

    if (!request.isMultipart()) {
      throw new BadRequestError('A real file upload (multipart/form-data) is required to store a medical record.');
    }

    const data = await request.file();
    if (!data) {
      throw new BadRequestError('A file is required to store a medical record.');
    }

    const fields: any = data.fields;
    const fileBuffer = await data.toBuffer();
    const uploadResult = await StorageProvider.saveFile(fileBuffer, data.filename, data.mimetype);

    const result = await patientPortalService.storeDocument(patientId, {
      title: fields?.title?.value || data.filename,
      documentType: (fields?.documentType?.value || 'OTHER').toUpperCase(),
      facility: fields?.facility?.value,
      doctorName: fields?.doctorName?.value,
      date: fields?.date?.value,
      fileUrl: uploadResult.fileUrl,
      storageKey: uploadResult.storageKey,
    });
    return sendSuccess(reply, result, 201, request.id);
  }

  async getMedicalJourney(request: FastifyRequest, reply: FastifyReply) {
    const patientId = requirePatientId(request);
    const result = await patientPortalService.getMedicalJourney(patientId);
    return sendSuccess(reply, result, 200, request.id);
  }
}

export const patientPortalController = new PatientPortalController();
