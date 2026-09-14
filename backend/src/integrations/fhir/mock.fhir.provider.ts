import { v4 as uuidv4 } from 'uuid';

export interface FhirClinicalBundle {
  resourceType: 'Bundle';
  id: string;
  type: 'document';
  timestamp: string;
  entry: any[];
}

export class MockFhirProvider {
  /**
   * Builds an ABDM-compliant FHIR R4 Bundle containing Encounter, Condition, and MedicationRequest.
   */
  public static buildOpdConsultationBundle(consultationData: {
    patientId: string;
    patientName: string;
    doctorId: string;
    doctorName: string;
    diagnosis: string;
    icdCode: string;
    prescriptions: any[];
    clinicalNotes: string;
  }): FhirClinicalBundle {
    const bundleId = `bundle-opd-${uuidv4().substring(0, 8)}`;
    const encounterId = `enc-${uuidv4().substring(0, 8)}`;

    return {
      resourceType: 'Bundle',
      id: bundleId,
      type: 'document',
      timestamp: new Date().toISOString(),
      entry: [
        {
          fullUrl: `urn:uuid:${encounterId}`,
          resource: {
            resourceType: 'Encounter',
            id: encounterId,
            status: 'finished',
            class: { code: 'AMB', display: 'ambulatory' },
            subject: { display: consultationData.patientName, reference: `Patient/${consultationData.patientId}` },
            participant: [{ individual: { display: consultationData.doctorName } }],
          },
        },
        {
          resource: {
            resourceType: 'Condition',
            clinicalStatus: { coding: [{ code: 'active' }] },
            code: {
              coding: [{ system: 'http://hl7.org/fhir/sid/icd-10', code: consultationData.icdCode, display: consultationData.diagnosis }],
            },
            subject: { reference: `Patient/${consultationData.patientId}` },
          },
        },
        ...consultationData.prescriptions.map((rx, idx) => ({
          resource: {
            resourceType: 'MedicationRequest',
            id: `medrx-${idx + 1}`,
            status: 'active',
            intent: 'order',
            medicationCodeableConcept: { text: rx.medicine },
            dosageInstruction: [{ text: `${rx.dosage} ${rx.frequency} for ${rx.duration} (${rx.instructions})` }],
          },
        })),
      ],
    };
  }
}
