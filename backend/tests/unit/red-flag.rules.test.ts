import { describe, it, expect } from 'vitest';
import { evaluateRedFlags } from '../../src/ai/rules/red-flag.rules.js';

describe('Deterministic Red Flag Triage Engine', () => {
  it('should identify URGENT cardiac warning for chest pain with radiation', () => {
    const symptoms = ['severe chest pain radiating to left arm', 'sweating'];
    const result = evaluateRedFlags(symptoms);

    expect(result.isTriggered).toBe(true);
    expect(result.priority).toBe('URGENT');
    expect(result.title).toContain('ACUTE CORONARY SYNDROME');
    expect(result.triggeringFindings.length).toBeGreaterThan(0);
  });

  it('should identify URGENT neurological warning for unilateral weakness', () => {
    const symptoms = ['sudden weakness on right side of face and arm', 'slurred speech'];
    const result = evaluateRedFlags(symptoms);

    expect(result.isTriggered).toBe(true);
    expect(result.priority).toBe('URGENT');
    expect(result.title).toContain('STROKE');
    expect(result.triggeringFindings.length).toBeGreaterThan(0);
  });

  it('should trigger URGENT priority if numeric pain score is >= 8', () => {
    const symptoms = ['lower back ache'];
    const result = evaluateRedFlags(symptoms, 9);

    expect(result.isTriggered).toBe(true);
    expect(result.priority).toBe('URGENT');
    expect(result.title).toContain('SEVERE INTRACTABLE PAIN');
  });

  it('should return NORMAL priority for mild non-urgent symptoms', () => {
    const symptoms = ['mild dry cough for 2 days', 'occasional sneezing'];
    const result = evaluateRedFlags(symptoms, 2);

    expect(result.isTriggered).toBe(false);
    expect(result.priority).toBe('NORMAL');
    expect(result.triggeringFindings.length).toBe(0);
  });

  it('should identify ATTENTION priority for moderate red-flags such as high fever with chills', () => {
    const symptoms = ['high fever with chills and vomiting for 4 days'];
    const result = evaluateRedFlags(symptoms, 5);

    expect(result.isTriggered).toBe(true);
    expect(result.priority).toBe('ATTENTION');
    expect(result.triggeringFindings.length).toBeGreaterThan(0);
  });
});
