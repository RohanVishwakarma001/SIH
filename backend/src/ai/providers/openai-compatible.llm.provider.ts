import { LLMProvider, AdaptiveQuestion, ClinicalSummaryOutput, ExtractedEntityOutput } from './llm.provider.js';
import { MockLLMProvider } from './mock.llm.provider.js';
import { logger } from '../../config/logger.js';

export interface OpenAICompatibleConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
  providerLabel: string;
}

/**
 * Real LLM provider for any OpenAI-compatible chat completions API (OpenAI itself,
 * or OpenRouter, which mirrors the same request/response shape). Used when
 * AI_PROVIDER is "openai" or "openrouter" and a matching API key is configured.
 *
 * The adaptive question flow stays on the deterministic clinical question bank
 * (delegated to MockLLMProvider) rather than free-form LLM generation, so that
 * red-flag detection continues to run against a fixed, clinically-reviewed
 * question set regardless of which summary provider is active.
 */
export class OpenAICompatibleLLMProvider implements LLMProvider {
  private readonly questionBank = new MockLLMProvider();

  constructor(private readonly config: OpenAICompatibleConfig) {}

  async generateNextQuestion(
    currentAnswers: Record<string, any>,
    department: string,
    step: number,
    totalSteps: number,
    language: string
  ): Promise<AdaptiveQuestion | null> {
    return this.questionBank.generateNextQuestion(currentAnswers, department, step, totalSteps, language);
  }

  private async chatJSON(systemPrompt: string, userPrompt: string): Promise<any> {
    const res = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`${this.config.providerLabel} request failed (${res.status}): ${body.slice(0, 500)}`);
    }

    const data: any = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error(`${this.config.providerLabel} returned no content`);
    }

    try {
      return JSON.parse(content);
    } catch {
      throw new Error(`${this.config.providerLabel} returned non-JSON content: ${String(content).slice(0, 500)}`);
    }
  }

  async generateClinicalSummary(patientData: {
    name: string;
    age: number;
    gender: string;
    chiefComplaint: string;
    answers: Record<string, any>;
    vitals?: any;
    ocrEntities?: ExtractedEntityOutput[];
    isAyush?: boolean;
    ayushData?: any;
  }): Promise<ClinicalSummaryOutput> {
    const systemPrompt = `You are a clinical documentation assistant supporting doctors at a high-volume Indian OPD (outpatient) triage kiosk. Given a patient's intake answers, produce a physician-ready clinical summary.

Return ONLY a JSON object with exactly these keys:
- conciseSummary: string, 2-3 sentences summarizing the presentation
- keyPositiveFindings: string[]
- pertinentNegatives: string[]
- redFlagAlerts: string[] (empty array if none)
- differentialDiagnoses: array of { name: string, icdCode: string, confidence: number (0-100), clinicalRationale: string }
- recommendedInvestigations: string[]

Do not include any text outside the JSON object. This is a clinical decision-support draft only; it will always be reviewed and approved by a licensed physician before being used for patient care.`;

    try {
      const result = await this.chatJSON(systemPrompt, JSON.stringify(patientData));
      return {
        conciseSummary: typeof result.conciseSummary === 'string' ? result.conciseSummary : '',
        keyPositiveFindings: Array.isArray(result.keyPositiveFindings) ? result.keyPositiveFindings : [],
        pertinentNegatives: Array.isArray(result.pertinentNegatives) ? result.pertinentNegatives : [],
        redFlagAlerts: Array.isArray(result.redFlagAlerts) ? result.redFlagAlerts : [],
        differentialDiagnoses: Array.isArray(result.differentialDiagnoses) ? result.differentialDiagnoses : [],
        recommendedInvestigations: Array.isArray(result.recommendedInvestigations) ? result.recommendedInvestigations : [],
      };
    } catch (err: any) {
      logger.error({ error: err.message, provider: this.config.providerLabel }, 'LLM clinical summary generation failed');
      throw err;
    }
  }

  async extractMedicalEntities(rawOcrText: string): Promise<ExtractedEntityOutput[]> {
    const systemPrompt = `Extract structured medical entities (medications, diagnoses, investigations, dates, doctor names) from this OCR'd clinical document text.

Return ONLY a JSON object: { "entities": [ { "category": "diagnosis"|"medication"|"investigation"|"date"|"doctor", "value": string, "dosage"?: string, "frequency"?: string, "confidence": number (0-100), "isVerified": boolean } ] }`;

    try {
      const result = await this.chatJSON(systemPrompt, rawOcrText);
      return Array.isArray(result.entities) ? result.entities : [];
    } catch (err: any) {
      logger.error({ error: err.message, provider: this.config.providerLabel }, 'LLM entity extraction failed');
      throw err;
    }
  }
}
