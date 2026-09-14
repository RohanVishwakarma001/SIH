import { prisma } from '../../config/database.js';

function asArray<T = any>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export class ClinicalHistoryService {
  async getStructuredHistory(patientId: string) {
    const history = await prisma.clinicalHistory.findFirst({
      where: { patientId },
      include: { ayushAssessment: true },
      orderBy: { createdAt: 'desc' },
    });

    if (!history) {
      return {
        available: false,
        chiefComplaint: {
          primary: 'Not yet captured', onset: '', duration: '', severityScore: 0, location: '',
          aggravatingFactors: [], relievingFactors: [],
        },
        historyOfPresentIllness: 'This patient has not yet completed the MediKiosk clinical interview.',
        pastMedicalHistory: [],
        pastSurgicalHistory: [],
        drugHistory: [],
        allergyHistory: [],
        familyHistory: [],
        personalHistory: { diet: 'Not assessed', tobaccoUse: 'Not assessed', alcoholUse: 'Not assessed', sleep: 'Not assessed', physicalActivity: 'Not assessed' },
        reviewOfSystems: [],
        previousInvestigations: [],
      };
    }

    return {
      available: true,
      chiefComplaint: {
        primary: history.chiefComplaintPrimary,
        onset: history.onset,
        duration: history.duration,
        severityScore: history.severityScore,
        location: history.location,
        aggravatingFactors: asArray<string>(history.aggravatingFactors),
        relievingFactors: asArray<string>(history.relievingFactors),
      },
      historyOfPresentIllness: history.hpiNarrative,
      pastMedicalHistory: asArray(history.pastMedicalHistory),
      pastSurgicalHistory: asArray(history.pastSurgicalHistory),
      drugHistory: asArray(history.drugHistory),
      allergyHistory: asArray(history.allergyHistory),
      familyHistory: asArray(history.familyHistory),
      personalHistory: (history.personalHistory as any) || {
        diet: 'Not assessed', tobaccoUse: 'Not assessed', alcoholUse: 'Not assessed', sleep: 'Not assessed', physicalActivity: 'Not assessed',
      },
      reviewOfSystems: asArray(history.reviewOfSystems),
      previousInvestigations: asArray(history.previousInvestigations),
      dashavidhaPariksha: history.ayushAssessment
        ? {
            prakriti: {
              vata: history.ayushAssessment.prakritiVata,
              pitta: history.ayushAssessment.prakritiPitta,
              kapha: history.ayushAssessment.prakritiKapha,
              primaryDosha: history.ayushAssessment.primaryDosha,
            },
            vikriti: history.ayushAssessment.vikriti,
            sara: history.ayushAssessment.sara,
            samhanana: history.ayushAssessment.samhanana,
            pramana: history.ayushAssessment.pramana,
            satmya: history.ayushAssessment.satmya,
            satva: history.ayushAssessment.satva,
            aharaShakti: {
              abhyavaharana: history.ayushAssessment.aharaShaktiAbhyavaharana,
              jarana: history.ayushAssessment.aharaShaktiJarana,
            },
            vyayamaShakti: history.ayushAssessment.vyayamaShakti,
            vaya: history.ayushAssessment.vaya,
          }
        : undefined,
    };
  }
}

export const clinicalHistoryService = new ClinicalHistoryService();
