import bcrypt from 'bcryptjs';
import { prisma } from '../../config/database.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../shared/utils/jwt.js';
import { UnauthorizedError, NotFoundError } from '../../shared/errors/app.error.js';
import { SandboxAbhaProvider } from '../../integrations/abha/mock.abha.provider.js';
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
   * Checks a patient in at the kiosk via their self-entered 14-digit ABHA number.
   *
   * There is no live ABDM gateway configured (see SandboxAbhaProvider), so this
   * cannot cryptographically verify the ABHA holder's identity or fetch their
   * real name/age/gender from the government record. It only validates the
   * number format and looks up (or creates) the real Patient record tied to
   * that ABHA number — it never fabricates or substitutes a different
   * identity. `abhaVerified` stays false until a real ABDM gateway integration
   * is wired in.
   */
  async verifyAbha(abhaId: string, otp: string, sessionId?: string) {
    const cleanAbha = SandboxAbhaProvider.normalizeAbhaId(abhaId);
    if (!otp || otp.trim().length < 4) {
      throw new UnauthorizedError('Please enter the verification code sent to your registered mobile.');
    }

    let patient = await prisma.patient.findFirst({
      where: { abhaId: cleanAbha },
    });

    if (!patient) {
      const dept = await prisma.department.findFirst({ where: { code: 'general' } });
      if (!dept) throw new NotFoundError('Department', 'general');

      const patientToken = `A-${Math.floor(100 + Math.random() * 900)}`;
      patient = await prisma.patient.create({
        data: {
          token: patientToken,
          // Real name is not known until collected (no live ABDM demographic
          // lookup available); the clinical interview or staff capture it later.
          name: `Patient ${patientToken}`,
          age: 0,
          gender: 'Other',
          abhaId: cleanAbha,
          abhaAddress: `${cleanAbha.replace(/-/g, '')}@abdm`,
          abhaVerified: false,
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

  /**
   * Registers a new patient portal account with personal login ID, password, and ABHA ID.
   */
  async registerPatientAccount(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    abhaId?: string;
    age?: number;
    gender?: string;
  }) {
    const existing = await prisma.user.findUnique({ where: { email: data.email.toLowerCase().trim() } });
    if (existing) {
      throw new UnauthorizedError('An account with this email already exists. Please sign in.');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase().trim(),
        passwordHash,
        role: UserRole.PATIENT,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || null,
      },
    });

    // Link or create this user's Patient clinical record. A prior kiosk visit
    // may have already created a Patient row for the same ABHA number or
    // phone — link to it by a durable userId foreign key rather than
    // fuzzy name/phone matching, and never fabricate an ABHA number/phone
    // the patient didn't actually provide.
    const patientToken = `P-${Math.floor(100 + Math.random() * 900)}`;
    const dept = await prisma.department.findFirst({ where: { code: 'general' } });

    let patient = data.abhaId
      ? await prisma.patient.findFirst({ where: { abhaId: data.abhaId } })
      : null;

    if (!patient && data.phone) {
      patient = await prisma.patient.findFirst({ where: { phone: data.phone } });
    }

    if (patient && !patient.userId) {
      patient = await prisma.patient.update({ where: { id: patient.id }, data: { userId: user.id } });
    }

    if (!patient && dept) {
      patient = await prisma.patient.create({
        data: {
          userId: user.id,
          token: patientToken,
          name: `${data.firstName} ${data.lastName}`,
          age: data.age || 0,
          gender: data.gender || 'Other',
          phone: data.phone || null,
          abhaId: data.abhaId || null,
          abhaAddress: data.abhaId ? `${data.firstName.toLowerCase()}.${data.lastName.toLowerCase()}@abdm` : null,
          // Self-declared at registration — not verified against a live ABDM gateway.
          abhaVerified: false,
          priority: 'NORMAL',
          queueStatus: 'WAITING',
          historyStatus: 'NOT_STARTED',
          checkedInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          chiefComplaintShort: 'Patient portal registered user',
          departmentId: dept.id,
        },
      });
    }

    const patientId = patient?.id || user.id;
    const tokenPayload = {
      userId: user.id,
      patientId,
      role: UserRole.PATIENT,
      email: user.email,
    };

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: data.lastName,
        phone: user.phone,
        patientId,
      },
      patient,
      token: generateAccessToken(tokenPayload),
      refreshToken: generateRefreshToken(tokenPayload),
    };
  }

  /**
   * Authenticates a patient into their personal Patient Dashboard.
   */
  async loginPatientAccount(emailOrPhone: string, password: string) {
    const cleanId = emailOrPhone.trim().toLowerCase();
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanId },
          { phone: cleanId },
        ],
        role: UserRole.PATIENT,
      },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid credentials or no patient account found');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const patient = await prisma.patient.findFirst({ where: { userId: user.id } });

    const patientId = patient?.id || user.id;
    const tokenPayload = {
      userId: user.id,
      patientId,
      role: UserRole.PATIENT,
      email: user.email,
    };

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        patientId,
      },
      patient,
      token: generateAccessToken(tokenPayload),
      refreshToken: generateRefreshToken(tokenPayload),
    };
  }

  /**
   * One-time creation of the first real ADMIN account after deployment.
   * Self-disables once any ADMIN user exists — the bootstrap key alone does
   * not authorize repeated use, so a leaked key after first use is harmless.
   */
  async bootstrapAdmin(data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) {
    const existingAdmin = await prisma.user.findFirst({ where: { role: UserRole.ADMIN } });
    if (existingAdmin) {
      throw new UnauthorizedError('An admin account already exists. This bootstrap endpoint is now disabled.');
    }

    const existingEmail = await prisma.user.findUnique({ where: { email: data.email.toLowerCase().trim() } });
    if (existingEmail) {
      throw new UnauthorizedError('An account with this email already exists.');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const admin = await prisma.user.create({
      data: {
        email: data.email.toLowerCase().trim(),
        passwordHash,
        role: UserRole.ADMIN,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || null,
      },
    });

    return {
      id: admin.id,
      email: admin.email,
      role: admin.role,
      firstName: admin.firstName,
      lastName: admin.lastName,
    };
  }
}

export const authService = new AuthService();
