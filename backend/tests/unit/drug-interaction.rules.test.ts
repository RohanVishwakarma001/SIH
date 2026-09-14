import { describe, it, expect } from 'vitest';
import { DrugInteractionEngine } from '../../src/ai/rules/drug-interaction.rules.js';

describe('Drug & Ayurvedic Herb Interaction Engine', () => {
  it('should flag CRITICAL allopathic interaction for Telmisartan and Spironolactone', () => {
    const meds = ['Tab Telmisartan 40mg', 'Tab Spironolactone 25mg'];
    const results = DrugInteractionEngine.checkInteractions(meds);

    expect(results.length).toBeGreaterThan(0);
    const alert = results.find(r => r.drug1.includes('Telmisartan') || r.drug2.includes('Telmisartan'));
    expect(alert).toBeDefined();
    expect(alert?.severity).toBe('CRITICAL');
    expect(alert?.clinicalEffect).toContain('Hyperkalemia');
    expect(alert?.interactionType).toBe('drug-drug');
  });

  it('should flag MAJOR Herb-Drug interaction between modern Aspirin and Ayurvedic Guggulu', () => {
    const meds = ['Ecosprin 75mg (Aspirin)', 'Shuddha Guggulu 500mg'];
    const results = DrugInteractionEngine.checkInteractions(meds);

    expect(results.length).toBeGreaterThan(0);
    const alert = results.find(r => r.interactionType === 'herb-drug');
    expect(alert).toBeDefined();
    expect(alert?.severity).toBe('MAJOR');
    expect(alert?.clinicalEffect).toContain('bleeding');
  });

  it('should flag CRITICAL Herb-Drug interaction between Digoxin and Yashtimadhu (Licorice)', () => {
    const meds = ['Tab Digoxin 0.25mg', 'Yashtimadhu Churna (Mulethi)'];
    const results = DrugInteractionEngine.checkInteractions(meds);

    expect(results.length).toBeGreaterThan(0);
    const alert = results.find(r => r.severity === 'CRITICAL');
    expect(alert).toBeDefined();
    expect(alert?.clinicalEffect).toContain('Hypokalemia');
    expect(alert?.interactionType).toBe('herb-drug');
  });

  it('should flag MAJOR Herb-Drug interaction between Metformin and Karela / Jamun', () => {
    const meds = ['Metformin 500mg BD', 'Karela Jamun Juice'];
    const results = DrugInteractionEngine.checkInteractions(meds);

    expect(results.length).toBeGreaterThan(0);
    const alert = results[0];
    expect(alert.severity).toBe('MAJOR');
    expect(alert.clinicalEffect).toContain('hypoglycemia');
    expect(alert.interactionType).toBe('herb-drug');
  });

  it('should return empty array when no known interactions exist', () => {
    const meds = ['Paracetamol 500mg', 'Vitamin C 500mg'];
    const results = DrugInteractionEngine.checkInteractions(meds);

    expect(results.length).toBe(0);
  });
});
