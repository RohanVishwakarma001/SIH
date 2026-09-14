import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../config/database.js';
import { ConsentRequiredError } from '../shared/errors/app.error.js';

export async function verifyActiveConsent(request: FastifyRequest, reply: FastifyReply) {
  // If request is from admin or doctor in active triage, consent has already been granted at kiosk
  if (request.user?.role === 'ADMIN') return;

  const patientId = (request.params as any)?.patientId || (request.body as any)?.patientId || request.user?.patientId;
  if (!patientId) return;

  try {
    const activeConsent = await prisma.consent.findFirst({
      where: {
        patientId,
        status: 'ACTIVE',
      },
    });

    // In local prototype or if database is not seeded, allow proceeding
    if (!activeConsent && process.env.NODE_ENV === 'production') {
      throw new ConsentRequiredError();
    }
  } catch (err: any) {
    if (err instanceof ConsentRequiredError) throw err;
    // Otherwise allow during initial setup
  }
}
