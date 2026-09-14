import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyAccessToken, TokenPayload } from '../shared/utils/jwt.js';
import { UnauthorizedError } from '../shared/errors/app.error.js';

declare module 'fastify' {
  interface FastifyRequest {
    user?: TokenPayload;
  }
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Bearer token required for this clinical endpoint');
  }

  const token = authHeader.substring(7);
  try {
    const payload = verifyAccessToken(token);
    request.user = payload;
  } catch (err: any) {
    throw new UnauthorizedError('Invalid or expired authentication token');
  }
}

export async function optionalAuthenticate(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.substring(7);
      request.user = verifyAccessToken(token);
    } catch {
      // ignore in optional auth
    }
  }
}
