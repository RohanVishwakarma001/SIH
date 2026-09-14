import { PrismaClient } from '@prisma/client';
import { logger } from './logger.js';

export const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'error' },
    { emit: 'event', level: 'info' },
    { emit: 'event', level: 'warn' },
  ],
});

prisma.$on('error', (e) => {
  logger.error({ error: e.message }, 'Database error');
});

export async function connectDatabase() {
  try {
    await prisma.$connect();
    logger.info('✅ PostgreSQL connected successfully via Prisma');
    return true;
  } catch (err: any) {
    logger.error({ error: err.message }, '❌ Could not connect to PostgreSQL. Check DATABASE_URL and that the database is running/migrated.');
    return false;
  }
}

export async function disconnectDatabase() {
  await prisma.$disconnect();
  logger.info('Database connection closed');
}
