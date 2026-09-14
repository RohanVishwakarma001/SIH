import { prisma } from '../../config/database.js';
import { aiOrchestrator } from '../../ai/ai.orchestrator.js';
import { NotFoundError } from '../../shared/errors/app.error.js';
import { buildStructuredHistoryFromAnswers, buildAyushAssessmentFromAnswers } from './clinical-history.mapper.js';

async function loadAnswersMap(interviewId: string): Promise<Record<string, any>> {
  const answers = await prisma.interviewAnswer.findMany({
    where: { interviewId },
    include: { question: true },
    orderBy: { timestamp: 'asc' },
  });

  const map: Record<string, any> = {};
  for (const answer of answers) {
    const code = answer.question.questionCode;
    if (answer.selectedOptions !== null && answer.selectedOptions !== undefined) {
      map[code] = answer.selectedOptions;
    } else if (answer.scaleValue !== null) {
      map[code] = answer.scaleValue;
    } else if (answer.textValue !== null) {
      map[code] = answer.textValue;
    }
  }
  return map;
}

export class InterviewService {
  /**
   * Initializes or resumes an ongoing clinical interview and persists the current question.
   */
  async getOrCreateInterview(patientId: string, sessionId: string, departmentId = 'general') {
    const patient = await prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) throw new NotFoundError('Patient', patientId);

    const session = await prisma.patientSession.findUnique({ where: { id: sessionId } });
    if (!session) throw new NotFoundError('PatientSession', sessionId);

    const isAyush = departmentId === 'ayush';
    const totalSteps = isAyush ? 9 : 7;

    let interview = await prisma.clinicalInterview.findFirst({
      where: { patientId, sessionId, status: 'IN_PROGRESS' },
      orderBy: { startedAt: 'desc' },
    });

    if (!interview) {
      interview = await prisma.clinicalInterview.create({
        data: { patientId, sessionId, departmentId, currentStep: 1, totalSteps, status: 'IN_PROGRESS' },
      });
    }

    const answeredSoFar = await loadAnswersMap(interview.id);
    const currentQuestion = await aiOrchestrator.getNextQuestion(answeredSoFar, departmentId, interview.currentStep - 1, totalSteps, session.language);

    if (currentQuestion) {
      await this.persistQuestion(interview.id, currentQuestion);
    }

    return {
      interviewId: interview.id,
      patientId,
      sessionId,
      departmentId,
      currentStep: interview.currentStep,
      totalSteps: interview.totalSteps,
      status: interview.status,
      currentQuestion,
    };
  }

  private async persistQuestion(interviewId: string, question: NonNullable<Awaited<ReturnType<typeof aiOrchestrator.getNextQuestion>>>) {
    const existing = await prisma.interviewQuestion.findFirst({
      where: { interviewId, questionCode: question.code },
    });
    if (existing) return existing;

    return prisma.interviewQuestion.create({
      data: {
        interviewId,
        questionCode: question.code,
        stepNumber: question.stepNumber,
        category: question.category,
        questionText: question.questionText,
        inputType: question.inputType,
        isAyush: question.isAyush || false,
        ayushDimension: question.ayushDimension,
      },
    });
  }

  /**
   * Records an answer, runs deterministic red-flag triage, and fetches the next question.
   */
  async submitAnswer(data: {
    interviewId: string;
    questionId: string;
    answerType: string;
    value: any;
    rawVoiceTranscript?: string;
    confidence?: number;
    patientId?: string;
    department?: string;
    stepNumber?: number;
  }) {
    const interview = await prisma.clinicalInterview.findUnique({ where: { id: data.interviewId } });
    if (!interview) throw new NotFoundError('ClinicalInterview', data.interviewId);

    // data.questionId is the question CODE (e.g. "q_chief_complaint"), not a DB row id -
    // find-or-create the InterviewQuestion row it refers to within this interview.
    let question = await prisma.interviewQuestion.findFirst({
      where: { interviewId: data.interviewId, questionCode: data.questionId },
    });
    if (!question) {
      question = await prisma.interviewQuestion.create({
        data: {
          interviewId: data.interviewId,
          questionCode: data.questionId,
          stepNumber: data.stepNumber || interview.currentStep,
          category: 'unspecified',
          questionText: data.questionId,
          inputType: data.answerType,
        },
      });
    }

    const symptoms: string[] = [];
    if (typeof data.value === 'string') symptoms.push(data.value);
    if (Array.isArray(data.value)) symptoms.push(...data.value);
    if (data.rawVoiceTranscript) symptoms.push(data.rawVoiceTranscript);

    const redFlagResult = aiOrchestrator.evaluateClinicalTriage(
      symptoms,
      typeof data.value === 'number' ? data.value : undefined
    );

    await prisma.interviewAnswer.create({
      data: {
        interviewId: data.interviewId,
        questionId: question.id,
        answerType: data.answerType,
        selectedOptions: Array.isArray(data.value) || typeof data.value === 'string' ? data.value : undefined,
        scaleValue: typeof data.value === 'number' ? data.value : undefined,
        rawVoiceTranscript: data.rawVoiceTranscript,
        confidence: data.confidence,
        isRedFlagTriggered: redFlagResult.isTriggered,
      },
    });

    const nextStep = data.stepNumber || interview.currentStep;
    const department = data.department || interview.departmentId;
    const totalSteps = interview.totalSteps;

    const answeredSoFar = await loadAnswersMap(data.interviewId);
    const nextQuestion = await aiOrchestrator.getNextQuestion(answeredSoFar, department, nextStep, totalSteps, 'hi');
    if (nextQuestion) {
      await this.persistQuestion(data.interviewId, nextQuestion);
    }

    await prisma.clinicalInterview.update({
      where: { id: data.interviewId },
      data: {
        currentStep: nextStep + 1,
        redFlagDetected: interview.redFlagDetected || redFlagResult.isTriggered,
      },
    });

    return {
      interviewId: data.interviewId,
      isAccepted: true,
      redFlagAlert: redFlagResult,
      nextQuestion,
      isCompleted: nextStep >= totalSteps,
    };
  }

  /**
   * Transcribes voice audio data into speech text.
   */
  async transcribeVoice(audioBuffer: Buffer, language = 'hi') {
    return aiOrchestrator.speech.transcribeAudio(audioBuffer, language);
  }

  /**
   * Completes the clinical interview: builds a structured clinical history and AI summary
   * from the patient's actual recorded answers, and persists both to the database.
   */
  async completeInterview(interviewId: string, patientId: string) {
    const interview = await prisma.clinicalInterview.findUnique({ where: { id: interviewId } });
    if (!interview) throw new NotFoundError('ClinicalInterview', interviewId);

    const patient = await prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) throw new NotFoundError('Patient', patientId);

    await prisma.clinicalInterview.update({
      where: { id: interviewId },
      data: { status: 'COMPLETED', completedAt: new Date() },
    });

    const answers = await loadAnswersMap(interviewId);
    const isAyush = interview.departmentId === 'ayush';
    const structured = buildStructuredHistoryFromAnswers(patient, answers);

    const clinicalHistory = await prisma.clinicalHistory.create({
      data: {
        patientId,
        interviewId,
        chiefComplaintPrimary: structured.chiefComplaintPrimary,
        onset: structured.onset,
        duration: structured.duration,
        severityScore: structured.severityScore,
        location: structured.location,
        aggravatingFactors: structured.aggravatingFactors,
        relievingFactors: structured.relievingFactors,
        hpiNarrative: structured.hpiNarrative,
        pastMedicalHistory: structured.pastMedicalHistory,
        drugHistory: structured.drugHistory,
        allergyHistory: structured.allergyHistory,
        reviewOfSystems: structured.reviewOfSystems,
        status: 'READY_FOR_REVIEW',
      },
    });

    if (isAyush) {
      const ayush = buildAyushAssessmentFromAnswers(answers);
      await prisma.ayushAssessment.create({
        data: {
          clinicalHistoryId: clinicalHistory.id,
          patientId,
          primaryDosha: ayush.primaryDosha,
          prakritiVata: ayush.prakritiVata,
          prakritiPitta: ayush.prakritiPitta,
          prakritiKapha: ayush.prakritiKapha,
          aharaShaktiAbhyavaharana: ayush.aharaShaktiAbhyavaharana,
          aharaShaktiJarana: ayush.aharaShaktiJarana,
          vikriti: ayush.vikriti,
        },
      });
    }

    const aiOutput = await aiOrchestrator.generateSummary({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      chiefComplaint: structured.chiefComplaintPrimary,
      answers,
      isAyush,
    });

    const clinicalSummary = await prisma.clinicalSummary.create({
      data: {
        patientId,
        interviewId,
        conciseSummary: aiOutput.conciseSummary,
        keyPositiveFindings: aiOutput.keyPositiveFindings,
        pertinentNegatives: aiOutput.pertinentNegatives,
        redFlagAlerts: aiOutput.redFlagAlerts,
        differentialDiagnoses: aiOutput.differentialDiagnoses as any,
        recommendedInvestigations: aiOutput.recommendedInvestigations as any,
        status: 'PENDING',
        currentRevisionNumber: 1,
      },
    });

    await prisma.summaryRevision.create({
      data: {
        clinicalSummaryId: clinicalSummary.id,
        revisionNumber: 1,
        summaryText: aiOutput.conciseSummary,
        action: 'GENERATED_BY_AI',
      },
    });

    await prisma.medicalTimelineEvent.create({
      data: {
        patientId,
        date: new Date().toLocaleString([], { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        yearMonth: new Date().toLocaleString([], { month: 'short', year: 'numeric' }),
        title: 'MediKiosk Intake & Triage',
        category: 'diagnosis',
        facility: 'Kiosk AI Intake',
        summary: interview.redFlagDetected
          ? `Patient completed AI kiosk intake. Red flag triggered: ${structured.chiefComplaintPrimary}.`
          : `Patient completed AI kiosk intake. Chief complaint: ${structured.chiefComplaintPrimary}.`,
        badgeText: interview.redFlagDetected ? 'Urgent Red Flag' : 'Kiosk Intake',
        isImportant: interview.redFlagDetected,
      },
    });

    await prisma.patient.update({
      where: { id: patientId },
      data: { historyStatus: 'READY_FOR_REVIEW', chiefComplaintShort: structured.chiefComplaintPrimary },
    });

    return {
      interviewId,
      patientId,
      status: 'COMPLETED',
      completedAt: new Date().toISOString(),
      clinicalHistoryId: clinicalHistory.id,
      summaryId: clinicalSummary.id,
    };
  }
}

export const interviewService = new InterviewService();
