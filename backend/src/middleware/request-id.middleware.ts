import { FastifyRequest, FastifyReply } from 'fastify';
import { v4 as uuidv4 } from 'uuid';

export async function requestIdMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const requestId = (request.headers['x-request-id'] as string) || uuidv4();
  request.id = requestId;
  reply.header('X-Request-Id', requestId);
}
