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
   * Builds an ABDM-compliant FHIR R4 Bundle containing Encounter, Condition, MedicationRequest,
   * Observation (Vitals/AYUSH Pariksha), AllergyIntolerance, and DocumentReference.
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
    observations?: Array<{ code: string; display: string; value: string | number; unit?: string }>;
    allergies?: Array<{ allergen: string; severity?: string }>;
    dashavidhaPariksha?: any;
    documentReferences?: Array<{ id: string; title: string; contentType: string }>;
  }): FhirClinicalBundle {
    const bundleId = `bundle-opd-${uuidv4().substring(0, 8)}`;
    const encounterId = `enc-${uuidv4().substring(0, 8)}`;

    const entries: any[] = [
      {
        fullUrl: `urn:uuid:${encounterId}`,
        resource: {
          resourceType: 'Encounter',
          id: encounterId,
          status: 'finished',
          class: { code: 'AMB', display: 'ambulatory' },
          subject: { display: consultationData.patientName, reference: `Patient/${consultationData.patientId}` },
          participant: [{ individual: { display: consultationData.doctorName } }],
          serviceProvider: { display: 'All India Institute of Ayurveda (AIIA), Ministry of Ayush' },
        },
      },
      {
        resource: {
          resourceType: 'Condition',
          clinicalStatus: { coding: [{ code: 'active' }] },
          code: {
            coding: [
              { system: 'http://hl7.org/fhir/sid/icd-10', code: consultationData.icdCode, display: consultationData.diagnosis },
              { system: 'https://namstp.ayush.gov.in', code: 'AYUSH-NIDANA', display: consultationData.diagnosis }
            ],
          },
          subject: { reference: `Patient/${consultationData.patientId}` },
          note: [{ text: consultationData.clinicalNotes }],
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
    ];

    // Add Observations (Vitals / Lab investigations)
    if (consultationData.observations && consultationData.observations.length > 0) {
      consultationData.observations.forEach((obs, idx) => {
        entries.push({
          resource: {
            resourceType: 'Observation',
            id: `obs-${idx + 1}`,
            status: 'final',
            code: { coding: [{ display: obs.display, code: obs.code }] },
            subject: { reference: `Patient/${consultationData.patientId}` },
            valueQuantity: obs.unit ? { value: obs.value, unit: obs.unit } : undefined,
            valueString: !obs.unit ? String(obs.value) : undefined,
          }
        });
      });
    }

    // Add AllergyIntolerance
    if (consultationData.allergies && consultationData.allergies.length > 0) {
      consultationData.allergies.forEach((al, idx) => {
        entries.push({
          resource: {
            resourceType: 'AllergyIntolerance',
            id: `allergy-${idx + 1}`,
            clinicalStatus: { coding: [{ code: 'active' }] },
            verificationStatus: { coding: [{ code: 'confirmed' }] },
            code: { text: al.allergen },
            patient: { reference: `Patient/${consultationData.patientId}` },
            criticality: al.severity?.toLowerCase().includes('severe') ? 'high' : 'low',
          }
        });
      });
    }

    // Add AYUSH Dashavidha Pariksha Observation
    if (consultationData.dashavidhaPariksha) {
      entries.push({
        resource: {
          resourceType: 'Observation',
          id: 'obs-dashavidha-pariksha',
          status: 'final',
          category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'exam', display: 'Exam' }] }],
          code: { text: 'Ayurvedic Dashavidha Pariksha Assessment (AIIA Standard)' },
          subject: { reference: `Patient/${consultationData.patientId}` },
          component: [
            { code: { text: 'Prakriti' }, valueString: consultationData.dashavidhaPariksha.prakriti?.primaryDosha || 'Vata-Pitta' },
            { code: { text: 'Vikriti' }, valueString: consultationData.dashavidhaPariksha.vikriti || 'Pitta Prakopa' },
            { code: { text: 'Agni' }, valueString: consultationData.dashavidhaPariksha.agni || 'Vishamagni' },
            { code: { text: 'Satva' }, valueString: consultationData.dashavidhaPariksha.satva || 'Madhyama' },
            { code: { text: 'Vyayama Shakti' }, valueString: consultationData.dashavidhaPariksha.vyayamaShakti || 'Madhyama' },
          ]
        }
      });
    }

    // Add Scanned DocumentReference
    if (consultationData.documentReferences && consultationData.documentReferences.length > 0) {
      consultationData.documentReferences.forEach((doc, idx) => {
        entries.push({
          resource: {
            resourceType: 'DocumentReference',
            id: `docref-${idx + 1}`,
            status: 'current',
            docStatus: 'final',
            type: { text: doc.title },
            subject: { reference: `Patient/${consultationData.patientId}` },
            content: [{ attachment: { contentType: doc.contentType, title: doc.title } }],
          }
        });
      });
    }

    return {
      resourceType: 'Bundle',
      id: bundleId,
      type: 'document',
      timestamp: new Date().toISOString(),
      entry: entries,
    };
  }
}
