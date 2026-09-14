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
      rawText: `AIIMS / RML HOSPITAL OPD CARD. ${patientLine} BP: 154/96 mmHg. Prior Procedure: PTCA Stent (LAD) in 2022. Lab Results: HbA1c: 8.6% (Ref: 4.0-5.6), S. Creatinine: 1.8 mg/dL (Ref: 0.7-1.3), Fasting Glucose: 178 mg/dL (Ref: 70-99). Rx: Tab. Telmisartan 40mg PO OD. Tab. Spironolactone 25mg PO OD. Tab. Atorvastatin 20mg PO HS. Tab. Metformin 500mg BD. Advised: 12-Lead ECG, Lipid Profile. Review in 1 month.`,
      confidenceScore: 97.4,
      processingTimeMs: 1240,
      entities: [
        { category: 'medication', value: 'Telmisartan 40mg', dosage: '40mg', frequency: 'Once daily (OD)', confidence: 99.2, isVerified: true, boundingBox: { x: 30, y: 140, w: 220, h: 28 } },
        { category: 'medication', value: 'Spironolactone 25mg', dosage: '25mg', frequency: 'Once daily (OD)', confidence: 98.1, isVerified: true, boundingBox: { x: 30, y: 175, w: 220, h: 28 } },
        { category: 'medication', value: 'Atorvastatin 20mg', dosage: '20mg', frequency: 'Bedtime (HS)', confidence: 97.8, isVerified: true, boundingBox: { x: 30, y: 210, w: 215, h: 28 } },
        { category: 'medication', value: 'Metformin 500mg', dosage: '500mg', frequency: 'Twice daily (BD)', confidence: 98.6, isVerified: true, boundingBox: { x: 30, y: 245, w: 210, h: 28 } },
        { category: 'diagnosis', value: 'Essential Hypertension & Type 2 Diabetes', confidence: 95.1, isVerified: true, boundingBox: { x: 30, y: 105, w: 190, h: 25 } },
        { category: 'procedure', value: 'Percutaneous Transluminal Coronary Angioplasty (PTCA Stent to LAD) - 2022', confidence: 94.7, isVerified: true, boundingBox: { x: 30, y: 75, w: 280, h: 25 } },
        { 
          category: 'investigation', 
          value: 'HbA1c Glycated Hemoglobin', 
          numericalValue: 8.6, 
          unit: '%', 
          referenceRange: '4.0 - 5.6 %', 
          isAbnormal: true, 
          abnormalDirection: 'HIGH', 
          confidence: 99.0, 
          isVerified: true, 
          boundingBox: { x: 30, y: 280, w: 250, h: 25 } 
        },
        { 
          category: 'investigation', 
          value: 'Serum Creatinine', 
          numericalValue: 1.8, 
          unit: 'mg/dL', 
          referenceRange: '0.7 - 1.3 mg/dL', 
          isAbnormal: true, 
          abnormalDirection: 'HIGH', 
          confidence: 98.4, 
          isVerified: true, 
          boundingBox: { x: 30, y: 310, w: 250, h: 25 } 
        },
        { 
          category: 'investigation', 
          value: 'Fasting Blood Glucose', 
          numericalValue: 178, 
          unit: 'mg/dL', 
          referenceRange: '70 - 99 mg/dL', 
          isAbnormal: true, 
          abnormalDirection: 'HIGH', 
          confidence: 97.9, 
          isVerified: true, 
          boundingBox: { x: 30, y: 340, w: 250, h: 25 } 
        },
        { category: 'investigation', value: '12-Lead ECG & Lipid Profile Advised', confidence: 96.5, isVerified: false, boundingBox: { x: 30, y: 370, w: 240, h: 25 } },
        { category: 'date', value: new Date().toISOString().split('T')[0], confidence: 99.5, isVerified: true, boundingBox: { x: 320, y: 40, w: 110, h: 20 } },
      ],
    };
  }
}
