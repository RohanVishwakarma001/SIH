import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import { AppError } from '../shared/errors/app.error.js';
import { sendError } from '../shared/utils/response.js';
import { logger } from '../config/logger.js';

export function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
  const requestId = request.id;

  // Handle Domain AppErrors
  if (error instanceof AppError) {
    logger.warn({
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
      requestId,
      url: request.raw.url,
    }, 'Operational domain error');

    return sendError(
      reply,
      error.code,
      error.message,
      error.statusCode,
      error.details,
      requestId
    );
  }

  // Handle Zod Validation Errors
  if (error instanceof ZodError) {
    logger.warn({
      errors: error.flatten(),
      requestId,
    }, 'Validation error');

    return sendError(
      reply,
      'VALIDATION_ERROR',
      'Request input validation failed',
      422,
      error.flatten().fieldErrors,
      requestId
    );
  }

  // Handle Fastify Schema Validation Errors
  if (error.validation) {
    return sendError(
      reply,
      'SCHEMA_VALIDATION_ERROR',
      error.message,
      400,
      error.validation,
      requestId
    );
  }

  // Unhandled internal errors
  logger.error({
    error: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    requestId,
  }, 'Unhandled internal server error');

  return sendError(
    reply,
    'INTERNAL_SERVER_ERROR',
    process.env.NODE_ENV === 'production' ? 'An unexpected clinical server error occurred' : error.message,
    500,
    undefined,
    requestId
  );
}
