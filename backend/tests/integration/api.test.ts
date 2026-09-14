import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import bcrypt from 'bcryptjs';
import { buildApp } from '../../src/app.js';
import { prisma } from '../../src/config/database.js';
import { FastifyInstance } from 'fastify';

// Test-only fixtures, created and torn down here so this suite never depends
// on (or pollutes) the production seed data.
const TEST_DOCTOR_EMAIL = 'test.doctor@medikiosk.test';
const TEST_DOCTOR_PASSWORD = 'TestDoctor@123';
const TEST_PATIENT_ID = 'test_patient_workspace';

describe('MediKiosk API Integration Tests', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();

    const dept = await prisma.department.findFirst();
    if (!dept) throw new Error('No department found — run prisma migrate/seed before testing.');

    await prisma.user.upsert({
      where: { email: TEST_DOCTOR_EMAIL },
      update: {},
      create: {
        email: TEST_DOCTOR_EMAIL,
        passwordHash: await bcrypt.hash(TEST_DOCTOR_PASSWORD, 10),
        role: 'DOCTOR',
        firstName: 'Test',
        lastName: 'Doctor',
      },
    });

    await prisma.patient.upsert({
      where: { id: TEST_PATIENT_ID },
      update: {},
      create: {
        id: TEST_PATIENT_ID,
        token: 'T-001',
        name: 'Integration Test Patient',
        age: 40,
        gender: 'Other',
        priority: 'NORMAL',
        queueStatus: 'WAITING',
        historyStatus: 'NOT_STARTED',
        checkedInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        chiefComplaintShort: 'Integration test fixture',
        departmentId: dept.id,
      },
    });
  });

  afterAll(async () => {
    await prisma.patient.delete({ where: { id: TEST_PATIENT_ID } }).catch(() => {});
    await prisma.user.delete({ where: { email: TEST_DOCTOR_EMAIL } }).catch(() => {});
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
        email: TEST_DOCTOR_EMAIL,
        password: TEST_DOCTOR_PASSWORD,
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
        email: TEST_DOCTOR_EMAIL,
        password: TEST_DOCTOR_PASSWORD,
      },
    });
    const token = JSON.parse(loginRes.payload).data.accessToken;

    // 2. Fetch aggregated workspace
    const workspaceRes = await app.inject({
      method: 'GET',
      url: `/api/v1/doctor/patients/${TEST_PATIENT_ID}/workspace`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(workspaceRes.statusCode).toBe(200);
    const body = JSON.parse(workspaceRes.payload);
    expect(body.success).toBe(true);
    expect(body.data.patient).toBeDefined();
    expect(body.data.patient.id).toBe(TEST_PATIENT_ID);
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
