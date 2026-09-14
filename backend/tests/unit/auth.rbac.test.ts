import { describe, it, expect } from 'vitest';
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from '../../src/shared/utils/jwt.js';

describe('Auth & JWT Utilities', () => {
  it('should generate and verify a valid access token for DOCTOR role', () => {
    const payload = {
      userId: 'usr_doc_01',
      role: 'DOCTOR' as const,
      email: 'doctor@hospital.in',
    };

    const token = generateAccessToken(payload);
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(20);

    const decoded = verifyAccessToken(token);
    expect(decoded.userId).toBe('usr_doc_01');
    expect(decoded.role).toBe('DOCTOR');
    expect(decoded.email).toBe('doctor@hospital.in');
  });

  it('should generate and verify a refresh token with longer expiration', () => {
    const payload = {
      userId: 'usr_pat_01',
      role: 'PATIENT' as const,
      email: 'patient@kiosk.medikiosk.in',
      patientId: 'pat_001',
    };

    const refreshToken = generateRefreshToken(payload);
    expect(typeof refreshToken).toBe('string');

    const decoded = verifyRefreshToken(refreshToken);
    expect(decoded.userId).toBe('usr_pat_01');
    expect(decoded.role).toBe('PATIENT');
    expect(decoded.patientId).toBe('pat_001');
  });

  it('should throw an error when verifying an invalid or tampered token', () => {
    expect(() => verifyAccessToken('invalid.tampered.token')).toThrow();
  });
});
