import { FastifyCorsOptions } from '@fastify/cors';
import { logger } from './logger.js';
import { env } from './env.js';

const extraOrigins = env.CORS_ORIGIN.split(',').map(o => o.trim()).filter(Boolean);
const allowedOrigins = [env.FRONTEND_URL, ...extraOrigins];

export const corsConfig: FastifyCorsOptions = {
  origin: (origin, cb) => {
    // Requests with no Origin header (server-to-server, curl, mobile apps) are always allowed.
    if (!origin) return cb(null, true);

    // Development/test: allow any origin so local tooling (Vite dev server, Postman, etc.) works freely.
    if (env.NODE_ENV !== 'production') return cb(null, true);

    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app') || origin.endsWith('.onrender.com')) {
      return cb(null, true);
    }

    logger.warn({ origin }, 'Blocked cross-origin request from a non-allowlisted origin');
    return cb(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Request-Id'],
};
