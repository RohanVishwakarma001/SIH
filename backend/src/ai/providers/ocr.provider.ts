import { ExtractedEntityOutput } from './llm.provider.js';

export interface OCRResultOutput {
  rawText: string;
  confidenceScore: number;
  processingTimeMs: number;
  entities: ExtractedEntityOutput[];
}

export interface OCRPatientContext {
  name: string;
  age: number;
  gender: string;
}

export interface OCRProvider {
  processDocument(fileBuffer: Buffer, mimeType: string, patient?: OCRPatientContext): Promise<OCRResultOutput>;
}

export class MockOCRProvider implements OCRProvider {
  async processDocument(fileBuffer: Buffer, mimeType: string, patient?: OCRPatientContext): Promise<OCRResultOutput> {
    // Simulate OCR inference delay
    await new Promise(r => setTimeout(r, 600));

    const patientLine = patient ? `Pt: ${patient.name}, ${patient.age}/${patient.gender[0]}.` : 'Pt: Unidentified.';

    return {
      rawText: `AIIMS / RML HOSPITAL OPD CARD. ${patientLine} BP: 154/96 mmHg. Rx: Tab. Telmisartan 40mg PO OD. Tab. Atorvastatin 20mg PO HS. Tab. Metformin 500mg BD. Advised: 12-Lead ECG, Lipid Profile. Review in 1 month.`,
      confidenceScore: 97.4,
      processingTimeMs: 1240,
      entities: [
        { category: 'medication', value: 'Telmisartan 40mg', dosage: '40mg', frequency: 'Once daily (OD)', confidence: 99.2, isVerified: true, boundingBox: { x: 30, y: 140, w: 220, h: 28 } },
        { category: 'medication', value: 'Atorvastatin 20mg', dosage: '20mg', frequency: 'Bedtime (HS)', confidence: 97.8, isVerified: true, boundingBox: { x: 30, y: 175, w: 215, h: 28 } },
        { category: 'medication', value: 'Metformin 500mg', dosage: '500mg', frequency: 'Twice daily (BD)', confidence: 98.6, isVerified: true, boundingBox: { x: 30, y: 210, w: 210, h: 28 } },
        { category: 'diagnosis', value: 'Essential Hypertension', confidence: 95.1, isVerified: true, boundingBox: { x: 30, y: 105, w: 190, h: 25 } },
        { category: 'investigation', value: '12-Lead ECG & Lipid Profile', confidence: 96.5, isVerified: false, boundingBox: { x: 30, y: 250, w: 240, h: 25 } },
        { category: 'date', value: new Date().toISOString().split('T')[0], confidence: 99.5, isVerified: true, boundingBox: { x: 320, y: 40, w: 110, h: 20 } },
      ],
    };
  }
}
