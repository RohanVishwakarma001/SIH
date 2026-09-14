import { buildApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';

async function startServer() {
  try {
    // Database connectivity is required at startup — there is no mock fallback for
    // clinical data, so a server that can't reach Postgres must not accept traffic.
    const connected = await connectDatabase();
    if (!connected) {
      throw new Error('Database connection failed at startup');
    }

    const app = await buildApp();

    const address = await app.listen({
      port: env.PORT,
      host: env.HOST,
    });

    logger.info(`🚀 MediKiosk API Server running at: ${address}`);
    if (env.ENABLE_SWAGGER) {
      logger.info(`📄 Swagger API Documentation: ${address}/docs`);
    }
    logger.info(`🏥 Environment: ${env.NODE_ENV} | AI Provider: ${env.AI_PROVIDER} | Storage: ${env.STORAGE_DRIVER}`);

    if (env.NODE_ENV === 'production' && env.STORAGE_DRIVER === 'local') {
      logger.warn(
        'STORAGE_DRIVER is "local" in production — uploaded documents are written to local disk and will be LOST on redeploy or container restart on most hosts (Render, Railway, etc). Set STORAGE_DRIVER=s3 with a real bucket for durable storage.'
      );
    }

    // Graceful Shutdown Handlers
    const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
    signals.forEach((signal) => {
      process.on(signal, async () => {
        logger.info(`Received ${signal}. Gracefully terminating MediKiosk API...`);
        try {
          await app.close();
          await disconnectDatabase();
          logger.info('Server and database connections successfully closed.');
          process.exit(0);
        } catch (err: any) {
          logger.error({ error: err.message }, 'Error during graceful shutdown');
          process.exit(1);
        }
      });
    });
  } catch (err: any) {
    logger.fatal({ error: err.message }, 'Fatal error starting MediKiosk server');
    process.exit(1);
  }
}

startServer();
