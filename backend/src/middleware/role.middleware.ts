import { FastifyRequest, FastifyReply } from 'fastify';
import { UserRole } from '@prisma/client';
import { ForbiddenError, UnauthorizedError } from '../shared/errors/app.error.js';

export function requireRole(allowedRoles: UserRole[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      throw new UnauthorizedError();
    }

    if (!allowedRoles.includes(request.user.role)) {
      throw new ForbiddenError(
        `Role ${request.user.role} is not authorized for this resource. Required: ${allowedRoles.join(', ')}`
      );
    }
  };
}

export function enforcePatientScope() {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) throw new UnauthorizedError();

    // Doctors and Admins can access patients
    if (request.user.role === 'DOCTOR' || request.user.role === 'ADMIN' || request.user.role === 'STAFF') {
      return;
    }

    const requestedPatientId = (request.params as any)?.patientId;
    if (request.user.role === 'PATIENT' && requestedPatientId && request.user.patientId !== requestedPatientId) {
      throw new ForbiddenError('Patients are only authorized to access their own clinical records');
    }
  };
}
