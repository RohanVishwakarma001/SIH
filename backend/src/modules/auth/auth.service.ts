import bcrypt from 'bcryptjs';
import { prisma } from '../../config/database.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../shared/utils/jwt.js';
import { UnauthorizedError, NotFoundError } from '../../shared/errors/app.error.js';
import { MockAbhaProvider } from '../../integrations/abha/mock.abha.provider.js';
import { UserRole } from '@prisma/client';

export class AuthService {
  /**
   * Authenticates staff, doctor, or admin users.
   */
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const tokenPayload = { userId: user.id, role: user.role, email: user.email };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  /**
   * Refreshes an expired access token using a valid refresh token.
   */
  async refresh(refreshToken: string) {
    try {
      const payload = verifyRefreshToken(refreshToken);
      const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });

      if (stored && stored.revoked) {
        throw new UnauthorizedError('Refresh token has been revoked');
      }

      const newAccessToken = generateAccessToken({
        userId: payload.userId,
        role: payload.role,
        email: payload.email,
        patientId: payload.patientId,
      });

      return { accessToken: newAccessToken };
    } catch (err) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }
  }

  /**
   * Authenticates a patient at the kiosk via 14-digit ABHA ID and OTP.
   */
  async verifyAbha(abhaId: string, otp: string, sessionId?: string) {
    const verifiedData = await MockAbhaProvider.verifyAbhaOtp(abhaId, otp);

    let patient = await prisma.patient.findFirst({
      where: { abhaId: verifiedData.abhaId },
    });

    if (!patient) {
      const dept = await prisma.department.findFirst({ where: { code: 'general' } });
      if (!dept) throw new NotFoundError('Department', 'general');

      patient = await prisma.patient.create({
        data: {
          token: `A-${Math.floor(100 + Math.random() * 900)}`,
          name: verifiedData.name,
          age: verifiedData.age,
          gender: verifiedData.gender,
          phone: verifiedData.phone,
          abhaId: verifiedData.abhaId,
          abhaAddress: verifiedData.abhaAddress,
          abhaVerified: true,
          priority: 'NORMAL',
          queueStatus: 'WAITING',
          historyStatus: 'NOT_STARTED',
          checkedInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          chiefComplaintShort: 'ABHA kiosk check-in pending clinical intake',
          departmentId: dept.id,
        },
      });
    }

    const tokenPayload = {
      userId: patient.id,
      patientId: patient.id,
      role: 'PATIENT' as UserRole,
      email: `${patient.token.toLowerCase()}@kiosk.medikiosk.in`,
    };

    return {
      patient,
      token: generateAccessToken(tokenPayload),
      refreshToken: generateRefreshToken(tokenPayload),
    };
  }

  /**
   * Authenticates a patient via mobile number OTP.
   */
  async verifyMobile(mobile: string, otp: string, sessionId?: string) {
    const cleanMobile = mobile.replace(/[^0-9]/g, '');
    const patientToken = `B-${Math.floor(100 + Math.random() * 900)}`;

    let patient = await prisma.patient.findFirst({ where: { phone: `+91 ${cleanMobile}` } });

    if (!patient) {
      const dept = await prisma.department.findFirst({ where: { code: 'general' } });
      if (!dept) throw new NotFoundError('Department', 'general');

      // Mobile OTP check-in only collects a phone number; the patient's name is
      // captured later when the interview or a staff member records it.
      patient = await prisma.patient.create({
        data: {
          token: patientToken,
          name: `Patient ${patientToken}`,
          age: 0,
          gender: 'Other',
          phone: `+91 ${cleanMobile}`,
          abhaVerified: false,
          priority: 'NORMAL',
          queueStatus: 'WAITING',
          historyStatus: 'NOT_STARTED',
          checkedInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          chiefComplaintShort: 'Mobile OTP kiosk check-in pending clinical intake',
          departmentId: dept.id,
        },
      });
    }

    const tokenPayload = {
      userId: patient.id,
      patientId: patient.id,
      role: 'PATIENT' as UserRole,
      email: `${patient.token.toLowerCase()}@kiosk.medikiosk.in`,
    };

    return {
      patient,
      token: generateAccessToken(tokenPayload),
      refreshToken: generateRefreshToken(tokenPayload),
    };
  }

  /**
   * Registers a new walk-in patient.
   */
  async registerWalkin(data: { name: string; age: number; gender: string; mobile?: string; sessionId?: string }) {
    const patientToken = `W-${Math.floor(100 + Math.random() * 900)}`;

    const dept = await prisma.department.findFirst({ where: { code: 'general' } });
    if (!dept) throw new NotFoundError('Department', 'general');

    const patient = await prisma.patient.create({
      data: {
        token: patientToken,
        name: data.name,
        age: data.age,
        gender: data.gender,
        phone: data.mobile || '+91 99999 00000',
        abhaVerified: false,
        priority: 'NORMAL',
        queueStatus: 'WAITING',
        historyStatus: 'NOT_STARTED',
        checkedInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        chiefComplaintShort: 'Walk-in assisted registration pending clinical intake',
        departmentId: dept.id,
      },
    });

    const tokenPayload = {
      userId: patient.id,
      patientId: patient.id,
      role: 'PATIENT' as UserRole,
      email: `${patient.token.toLowerCase()}@kiosk.medikiosk.in`,
    };

    return {
      patient,
      token: generateAccessToken(tokenPayload),
      refreshToken: generateRefreshToken(tokenPayload),
    };
  }
}

export const authService = new AuthService();
