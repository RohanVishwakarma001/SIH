import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import multipart from '@fastify/multipart';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { corsConfig } from './config/cors.js';
import { env } from './config/env.js';
import { prisma } from './config/database.js';
import { errorHandler } from './middleware/error.middleware.js';
import { requestIdMiddleware } from './middleware/request-id.middleware.js';

// Module Routes
import { authRoutes } from './modules/auth/auth.routes.js';
import { sessionRoutes } from './modules/patient-sessions/session.routes.js';
import { consentRoutes } from './modules/consents/consent.routes.js';
import { interviewRoutes } from './modules/interviews/interview.routes.js';
import { redFlagRoutes } from './modules/red-flags/red-flag.routes.js';
import { documentRoutes } from './modules/documents/document.routes.js';
import { ocrRoutes } from './modules/ocr/ocr.routes.js';
import { timelineRoutes } from './modules/timeline/timeline.routes.js';
import { clinicalHistoryRoutes } from './modules/clinical-history/history.routes.js';
import { summaryRoutes } from './modules/summaries/summary.routes.js';
import { doctorRoutes } from './modules/doctor/doctor.routes.js';
import { consultationRoutes } from './modules/consultations/consultation.routes.js';
import { staffRoutes } from './modules/staff/staff.routes.js';
import { adminRoutes } from './modules/admin/admin.routes.js';
import { notificationRoutes } from './modules/notifications/notification.routes.js';

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: false, // Managed via Pino in logger.ts
    disableRequestLogging: true,
  });

  // Security & Utility Plugins
  await app.register(cors, corsConfig);
  await app.register(helmet, {
    contentSecurityPolicy: false, // For Swagger UI
  });
  await app.register(multipart, {
    limits: {
      fileSize: 15 * 1024 * 1024, // 15MB max document upload
    },
  });
  await app.register(rateLimit, {
    max: 1000,
    timeWindow: '1 minute',
  });

  // Support empty JSON bodies gracefully across POST/PATCH endpoints
  app.addContentTypeParser('application/json', { parseAs: 'string' }, (_req, body: string, done) => {
    if (!body || body.trim() === '') {
      done(null, {});
      return;
    }
    try {
      done(null, JSON.parse(body));
    } catch (err: any) {
      done(err, undefined);
    }
  });

  // Swagger Documentation (on by default in development, off in production unless ENABLE_SWAGGER=true)
  if (env.ENABLE_SWAGGER) {
    await app.register(swagger, {
      openapi: {
        info: {
          title: 'MediKiosk Clinical History-Taking & Triage API',
          description: 'Production API specification for high-volume Indian OPD AI triage platform',
          version: '1.0.0',
        },
        servers: [
          { url: `http://${env.HOST}:${env.PORT}`, description: env.NODE_ENV === 'production' ? 'Production Server' : 'Local Development Server' },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
      },
    });

    await app.register(swaggerUi, {
      routePrefix: '/docs',
    });
  }

  // Hooks & Error Handler
  app.addHook('onRequest', requestIdMiddleware);
  app.setErrorHandler(errorHandler);

  // Health Check Endpoint
  app.get('/health', async (request, reply) => {
    let databaseStatus: 'connected' | 'unavailable' = 'connected';
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      databaseStatus = 'unavailable';
    }

    const healthy = databaseStatus === 'connected';
    return reply.status(healthy ? 200 : 503).send({
      status: healthy ? 'HEALTHY' : 'UNHEALTHY',
      service: 'MediKiosk Clinical Core API',
      version: '1.0.0',
      database: databaseStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // Register API v1 Module Routes
  await app.register(async (api) => {
    await api.register(authRoutes, { prefix: '/auth' });
    await api.register(sessionRoutes, { prefix: '/patient-sessions' });
    await api.register(consentRoutes, { prefix: '/consents' });
    await api.register(interviewRoutes, { prefix: '/interviews' });
    await api.register(redFlagRoutes, { prefix: '/red-flags' });
    await api.register(documentRoutes, { prefix: '/documents' });
    await api.register(ocrRoutes, { prefix: '/ocr' });
    await api.register(timelineRoutes, { prefix: '/timeline' });
    await api.register(clinicalHistoryRoutes, { prefix: '/clinical-history' });
    await api.register(summaryRoutes, { prefix: '/summaries' });
    await api.register(doctorRoutes, { prefix: '/doctor' });
    await api.register(consultationRoutes, { prefix: '/consultations' });
    await api.register(staffRoutes, { prefix: '/staff' });
    await api.register(adminRoutes, { prefix: '/admin' });
    await api.register(notificationRoutes, { prefix: '/notifications' });
  }, { prefix: '/api/v1' });

  return app;
}
