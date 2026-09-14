import { describe, it, expect } from 'vitest';
import { aiOrchestrator } from '../../src/ai/ai.orchestrator.js';

describe('AI Clinical Interview Orchestrator', () => {
  it('should generate next question dynamically based on step index and department', async () => {
    const question = await aiOrchestrator.getNextQuestion(
      { q_chief_complaint: 'chest_pain' },
      'cardiology',
      1,
      7,
      'en'
    );

    expect(question).toBeDefined();
    expect(question?.code).toBeDefined();
    expect(question?.questionText).toBeDefined();
    expect(question?.options).toBeInstanceOf(Array);
    expect(question?.options?.length).toBeGreaterThan(0);
    expect(question?.stepNumber).toBe(2);
  });

  it('should deliver AYUSH/Ayurveda Dashavidha Pariksha question when department is ayush', async () => {
    // Step index 7 maps to ayush_prakriti
    const question = await aiOrchestrator.getNextQuestion(
      {},
      'ayush',
      7,
      9,
      'hi'
    );

    expect(question).toBeDefined();
    expect(question?.isAyush).toBe(true);
    expect(question?.ayushDimension).toBe('Prakriti');
  });

  it('should evaluate clinical triage accurately and return priority', () => {
    const triage = aiOrchestrator.evaluateClinicalTriage(['chest pain with radiation to arm', 'sweating']);
    expect(triage.priority).toBe('URGENT');
    expect(triage.isTriggered).toBe(true);
  });

  it('should generate a structured clinical summary with Zod schema compliance', async () => {
    const summary = await aiOrchestrator.generateSummary({
      name: 'Ramesh Patel',
      age: 52,
      gender: 'Male',
      chiefComplaint: 'Acute retrosternal chest pain',
      answers: {
        q_chief_complaint: 'chest_pain',
        q_severity: 8,
      },
    });

    expect(summary).toBeDefined();
    expect(summary.conciseSummary).toBeDefined();
    expect(summary.keyPositiveFindings).toBeInstanceOf(Array);
    expect(summary.pertinentNegatives).toBeInstanceOf(Array);
    expect(summary.redFlagAlerts).toBeInstanceOf(Array);
    expect(summary.differentialDiagnoses).toBeInstanceOf(Array);
    expect(summary.recommendedInvestigations).toBeInstanceOf(Array);
  });
});
