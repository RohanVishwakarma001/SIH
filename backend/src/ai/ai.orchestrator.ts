import { env } from '../config/env.js';
import { LLMProvider, AdaptiveQuestion, ClinicalSummaryOutput } from './providers/llm.provider.js';
import { MockLLMProvider } from './providers/mock.llm.provider.js';
import { OpenAICompatibleLLMProvider } from './providers/openai-compatible.llm.provider.js';
import { OCRProvider, MockOCRProvider, OCRPatientContext } from './providers/ocr.provider.js';
import { SpeechProvider, MockSpeechProvider } from './providers/speech.provider.js';
import { RedFlagRuleEngine, RedFlagEvaluationResult } from './rules/red-flag.rules.js';
import { logger } from '../config/logger.js';

function buildLLMProvider(): LLMProvider {
  if (env.AI_PROVIDER === 'mock') {
    return new MockLLMProvider();
  }

  const isOpenAI = env.AI_PROVIDER === 'openai';
  const apiKey = isOpenAI ? env.OPENAI_API_KEY : env.OPENROUTER_API_KEY;
  const keyName = isOpenAI ? 'OPENAI_API_KEY' : 'OPENROUTER_API_KEY';

  if (!apiKey) {
    throw new Error(
      `AI_PROVIDER is set to "${env.AI_PROVIDER}" but ${keyName} is not configured. Set ${keyName}, or set AI_PROVIDER=mock to use the offline mock provider.`
    );
  }

  return new OpenAICompatibleLLMProvider({
    apiKey,
    baseUrl: isOpenAI ? 'https://api.openai.com/v1' : 'https://openrouter.ai/api/v1',
    model: isOpenAI ? 'gpt-4o-mini' : 'openai/gpt-4o-mini',
    providerLabel: isOpenAI ? 'OpenAI' : 'OpenRouter',
  });
}

export class AIOrchestrator {
  private static instance: AIOrchestrator;
  public llm: LLMProvider;
  public ocr: OCRProvider;
  public speech: SpeechProvider;

  private constructor() {
    // Provider selection based on configuration. OCR and speech transcription stay on
    // the mock provider — no OCR/ASR vendor credentials are configured in this project.
    this.llm = buildLLMProvider();
    this.ocr = new MockOCRProvider();
    this.speech = new MockSpeechProvider();
    logger.info({ provider: env.AI_PROVIDER }, '🤖 AI Orchestrator initialized with active providers');
  }

  public static getInstance(): AIOrchestrator {
    if (!AIOrchestrator.instance) {
      AIOrchestrator.instance = new AIOrchestrator();
    }
    return AIOrchestrator.instance;
  }

  /**
   * Evaluates patient answers through deterministic clinical rules and returns red-flag status.
   */
  public evaluateClinicalTriage(
    symptoms: string[],
    severity?: number,
    location?: string,
    onset?: string,
    vitals?: any
  ): RedFlagEvaluationResult {
    return RedFlagRuleEngine.evaluate(symptoms, severity, location, onset, vitals);
  }

  /**
   * Generates the next adaptive question based on previous answers, department, and language.
   */
  public async getNextQuestion(
    currentAnswers: Record<string, any>,
    department: string,
    step: number,
    totalSteps: number,
    language: string
  ): Promise<AdaptiveQuestion | null> {
    return this.llm.generateNextQuestion(currentAnswers, department, step, totalSteps, language);
  }

  /**
   * Generates a structured clinical summary with key positive findings, pertinent negatives,
   * differential diagnoses, and recommended lab investigations.
   */
  public async generateSummary(patientData: any): Promise<ClinicalSummaryOutput> {
    return this.llm.generateClinicalSummary(patientData);
  }

  /**
   * Processes an uploaded document through the OCR pipeline.
   */
  public async processDocumentOCR(fileBuffer: Buffer, mimeType: string, patient?: OCRPatientContext) {
    return this.ocr.processDocument(fileBuffer, mimeType, patient);
  }
}

export const aiOrchestrator = AIOrchestrator.getInstance();
