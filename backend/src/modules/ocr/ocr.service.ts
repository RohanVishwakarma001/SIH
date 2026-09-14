import { prisma } from '../../config/database.js';
import { aiOrchestrator } from '../../ai/ai.orchestrator.js';
import { NotFoundError } from '../../shared/errors/app.error.js';
import { EntityCategory } from '@prisma/client';

export class OcrService {
  /**
   * Runs the OCR pipeline for a document and persists the extracted text and entities.
   * The document id doubles as the job id since there is no separate job queue.
   */
  async triggerOcrProcess(documentId: string) {
    const document = await prisma.document.findUnique({ where: { id: documentId }, include: { patient: true } });
    if (!document) throw new NotFoundError('Document', documentId);

    await prisma.document.update({ where: { id: documentId }, data: { ocrStatus: 'PROCESSING' } });

    const ocrResult = await aiOrchestrator.processDocumentOCR(Buffer.from([]), 'image/png', {
      name: document.patient.name,
      age: document.patient.age,
      gender: document.patient.gender,
    });

    await prisma.document.update({
      where: { id: documentId },
      data: {
        ocrStatus: 'COMPLETED',
        confidenceScore: ocrResult.confidenceScore,
        rawOcrText: ocrResult.rawText,
      },
    });

    const savedOcrResult = await prisma.oCRResult.create({
      data: {
        documentId,
        rawText: ocrResult.rawText,
        confidenceScore: ocrResult.confidenceScore,
        processingTimeMs: ocrResult.processingTimeMs,
      },
    });

    await prisma.medicalEntity.createMany({
      data: ocrResult.entities.map(e => ({
        ocrResultId: savedOcrResult.id,
        documentId,
        category: e.category.toUpperCase() as EntityCategory,
        value: e.value,
        dosage: e.dosage,
        frequency: e.frequency,
        confidence: e.confidence,
        isVerified: e.isVerified,
        boundingBox: e.boundingBox,
      })),
    });

    return {
      jobId: documentId,
      documentId,
      status: 'COMPLETED',
      progressPct: 100,
      confidenceScore: ocrResult.confidenceScore,
      extractedEntitiesCount: ocrResult.entities.length,
    };
  }

  async getJobStatus(jobId: string) {
    // jobId is the document id
    const document = await prisma.document.findUnique({ where: { id: jobId } });
    if (!document) throw new NotFoundError('Document', jobId);

    return {
      jobId,
      status: document.ocrStatus,
      progressPct: document.ocrStatus === 'COMPLETED' ? 100 : document.ocrStatus === 'PROCESSING' ? 50 : 0,
      stage:
        document.ocrStatus === 'COMPLETED'
          ? 'Timeline Indexing Complete'
          : document.ocrStatus === 'PROCESSING'
          ? 'Reading document & extracting text'
          : 'Queued for processing',
    };
  }

  async getDocumentExtraction(documentId: string) {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: { medicalEntities: true },
    });
    if (!document) throw new NotFoundError('Document', documentId);

    return {
      documentId,
      rawText: document.rawOcrText,
      confidenceScore: document.confidenceScore,
      entities: document.medicalEntities,
    };
  }

  async correctEntity(documentId: string, entityId: string, correctedValue: string, userId?: string) {
    const entity = await prisma.medicalEntity.findUnique({ where: { id: entityId } });
    if (!entity || entity.documentId !== documentId) throw new NotFoundError('MedicalEntity', entityId);

    const previousValue = entity.value;

    const updated = await prisma.medicalEntity.update({
      where: { id: entityId },
      data: { value: correctedValue, isVerified: true },
    });

    await prisma.entityCorrection.create({
      data: {
        entityId,
        previousValue,
        correctedValue,
        correctedByUserId: userId,
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: userId || 'kiosk_patient',
        actorName: 'Clinical Operator',
        role: userId ? 'DOCTOR' : 'PATIENT',
        action: 'OCR_ENTITY_CORRECTED',
        resource: 'MedicalEntity',
        resourceId: entityId,
        details: `Entity value corrected from "${previousValue}" to "${correctedValue}"`,
      },
    });

    return {
      documentId,
      entityId,
      updatedValue: updated.value,
      isVerified: updated.isVerified,
      correctedAt: new Date().toISOString(),
    };
  }
}

export const ocrService = new OcrService();
