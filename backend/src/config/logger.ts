import pino from 'pino';
import { env } from './env.js';

export const logger = pino({
  level: env.LOG_LEVEL,
  transport: env.NODE_ENV === 'development' ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss Z',
      ignore: 'pid,hostname',
    }
  } : undefined,
  // Ensure Protected Health Information (PHI) is redacted
  redact: {
    paths: [
      'req.headers.authorization',
      'req.body.password',
      'password',
      '*.password',
      '*.token'
    ],
    remove: true
  }
});
