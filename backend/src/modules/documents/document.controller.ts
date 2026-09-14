import { FastifyRequest, FastifyReply } from 'fastify';
import { documentService } from './document.service.js';
import { sendSuccess } from '../../shared/utils/response.js';
import { BadRequestError } from '../../shared/errors/app.error.js';
import { assertPatientAccess, resolvePatientIdForWrite } from '../../shared/utils/authorize.js';

export class DocumentController {
  async upload(request: FastifyRequest, reply: FastifyReply) {
    let fileBuffer: Buffer | undefined;
    let filename = 'document.png';
    let mimeType = 'image/png';
    let suppliedPatientId: string | undefined;
    let documentType = 'PRESCRIPTION';

    // If multipart/form-data
    if (request.isMultipart()) {
      const data = await request.file();
      if (data) {
        fileBuffer = await data.toBuffer();
        filename = data.filename;
        mimeType = data.mimetype;
        const fields: any = data.fields;
        if (fields?.patientId?.value) suppliedPatientId = fields.patientId.value;
        if (fields?.documentType?.value) documentType = fields.documentType.value;
      }
    } else if (request.body) {
      const body = request.body as any;
      if (body.filename) filename = body.filename;
      if (body.patientId) suppliedPatientId = body.patientId;
      if (body.documentType) documentType = body.documentType;
    }

    if (!fileBuffer) throw new BadRequestError('A file is required to upload a document');

    const patientId = resolvePatientIdForWrite(request, suppliedPatientId);

    const doc = await documentService.uploadDocument(fileBuffer, filename, mimeType, patientId, documentType);
    return sendSuccess(reply, doc, 201, request.id);
  }

  async getPatientDocs(request: FastifyRequest, reply: FastifyReply) {
    const { patientId } = request.params as { patientId: string };
    assertPatientAccess(request, patientId);
    const docs = await documentService.getPatientDocuments(patientId);
    return sendSuccess(reply, { documents: docs }, 200, request.id);
  }

  async getDocById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const doc = await documentService.getDocumentById(id);
    assertPatientAccess(request, doc.patientId);
    return sendSuccess(reply, doc, 200, request.id);
  }
}

export const documentController = new DocumentController();
