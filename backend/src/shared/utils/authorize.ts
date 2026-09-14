import { FastifyRequest } from 'fastify';
import { ForbiddenError, UnauthorizedError } from '../errors/app.error.js';

const STAFF_ROLES = new Set(['DOCTOR', 'STAFF', 'ADMIN']);

/**
 * Ensures the authenticated caller may access this patient's clinical data:
 * clinical staff (doctor/staff/admin) may access any patient, but a PATIENT
 * token may only access its own record. Throws if unauthenticated or
 * scoped to a different patient.
 */
export function assertPatientAccess(request: FastifyRequest, patientId: string): void {
  const user = request.user;
  if (!user) {
    throw new UnauthorizedError('Sign in to access this clinical record.');
  }
  if (STAFF_ROLES.has(user.role)) {
    return;
  }
  if (user.patientId !== patientId) {
    throw new ForbiddenError('You may only access your own clinical records.');
  }
}

/**
 * Returns the patientId a PATIENT-role caller must act as (their own, from the
 * token — a client-supplied override is ignored). Staff/doctor/admin callers
 * may act on behalf of the explicitly supplied patientId.
 */
export function resolvePatientIdForWrite(request: FastifyRequest, suppliedPatientId?: string): string {
  const user = request.user;
  if (!user) {
    throw new UnauthorizedError('Sign in to continue.');
  }
  if (STAFF_ROLES.has(user.role)) {
    if (!suppliedPatientId) {
      throw new ForbiddenError('patientId is required for staff-initiated actions.');
    }
    return suppliedPatientId;
  }
  if (!user.patientId) {
    throw new ForbiddenError('This action requires a patient-scoped session.');
  }
  return user.patientId;
}
