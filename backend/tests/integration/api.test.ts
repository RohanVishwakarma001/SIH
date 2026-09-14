import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { buildApp } from '../../src/app.js';
import { FastifyInstance } from 'fastify';

describe('MediKiosk API Integration Tests', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health returns 200 and healthy status', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/health',
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body.status.toLowerCase()).toBe('healthy');
    expect(body.service).toBe('MediKiosk Clinical Core API');
  });

  it('POST /api/v1/auth/login validates credentials and returns tokens', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {
        email: 'doctor@medikiosk.in',
        password: 'Doctor@123',
      },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body.success).toBe(true);
    expect(body.data.accessToken).toBeDefined();
    expect(body.data.user.role).toBe('DOCTOR');
  }, 15000);

  it('POST /api/v1/auth/login rejects invalid credentials', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {
        email: 'unknown@hospital.com',
        password: 'WrongPassword!',
      },
    });

    expect(res.statusCode).toBe(401);
    const body = JSON.parse(res.payload);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('AUTH_REQUIRED');
  }, 15000);

  it('GET /api/v1/doctor/patients/:patientId/workspace returns aggregated clinical workspace', async () => {
    // 1. Login as doctor to obtain token
    const loginRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {
        email: 'doctor@medikiosk.in',
        password: 'Doctor@123',
      },
    });
    const token = JSON.parse(loginRes.payload).data.accessToken;

    // 2. Fetch aggregated workspace
    const workspaceRes = await app.inject({
      method: 'GET',
      url: '/api/v1/doctor/patients/pat_001/workspace',
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(workspaceRes.statusCode).toBe(200);
    const body = JSON.parse(workspaceRes.payload);
    expect(body.success).toBe(true);
    expect(body.data.patient).toBeDefined();
    expect(body.data.patient.id).toBe('pat_001');
    expect(body.data.structuredHistory).toBeDefined();
    expect(body.data.aiSummary).toBeDefined();
    expect(body.data.timeline).toBeInstanceOf(Array);
    expect(body.data.documents).toBeInstanceOf(Array);
  }, 15000);

  it('RBAC: Rejects PATIENT token trying to access /api/v1/doctor/queue', async () => {
    // 1. Patient check-in via mobile OTP
    const checkinRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/patient/mobile-verify',
      payload: {
        mobile: '9876543210',
        otp: '1234',
      },
    });
    const patientToken = JSON.parse(checkinRes.payload).data.token;

    // 2. Attempt to access doctor queue
    const queueRes = await app.inject({
      method: 'GET',
      url: '/api/v1/doctor/queue',
      headers: {
        authorization: `Bearer ${patientToken}`,
      },
    });

    expect(queueRes.statusCode).toBe(403);
    const body = JSON.parse(queueRes.payload);
    expect(body.error.code).toBe('FORBIDDEN');
  }, 15000);
});
