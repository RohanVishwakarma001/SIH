import { prisma } from '../../config/database.js';
import { StorageProvider } from '../../integrations/storage/storage.provider.js';
import { DocumentType } from '@prisma/client';
import { NotFoundError } from '../../shared/errors/app.error.js';
import { ocrService } from '../ocr/ocr.service.js';

export class DocumentService {
  async uploadDocument(
    fileBuffer: Buffer,
    filename: string,
    mimeType: string,
    patientId: string,
    documentType: string = 'PRESCRIPTION',
    facility?: string
  ) {
    const patient = await prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) throw new NotFoundError('Patient', patientId);

    const uploadResult = await StorageProvider.saveFile(fileBuffer, filename, mimeType);

    const doc = await prisma.document.create({
      data: {
        patientId,
        title: filename || 'Scanned Clinical Document',
        documentType: (documentType.toUpperCase() as DocumentType) || 'PRESCRIPTION',
        fileUrl: uploadResult.fileUrl,
        storageKey: uploadResult.storageKey,
        facility: facility || 'MediKiosk OPD',
        ocrStatus: 'PENDING',
      },
    });

    // Kick off OCR processing immediately; the document id doubles as the job id
    // for status polling since there is no separate job queue in this system.
    await ocrService.triggerOcrProcess(doc.id);

    return { ...doc, jobId: doc.id };
  }

  async getPatientDocuments(patientId: string) {
    return prisma.document.findMany({
      where: { patientId },
      include: { medicalEntities: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getDocumentById(id: string) {
    const doc = await prisma.document.findUnique({
      where: { id },
      include: { medicalEntities: true, ocrResults: true },
    });
    if (!doc) throw new NotFoundError('Document', id);
    return doc;
  }
}

export const documentService = new DocumentService();
