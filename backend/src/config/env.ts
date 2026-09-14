import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const DEV_JWT_SECRET = 'medikiosk_jwt_secret_development_key_super_secure_2026';
const DEV_JWT_REFRESH_SECRET = 'medikiosk_jwt_refresh_secret_key_super_secure_2026';
const DEV_DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/medikiosk?schema=public';

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.string().transform(Number).default('4000'),
    HOST: z.string().default('0.0.0.0'),
    DATABASE_URL: z.string().default(DEV_DATABASE_URL),
    JWT_SECRET: z.string().default(DEV_JWT_SECRET),
    JWT_REFRESH_SECRET: z.string().default(DEV_JWT_REFRESH_SECRET),
    FRONTEND_URL: z.string().default('http://localhost:5173'),
    // Comma-separated list of additional allowed CORS origins in production
    // (FRONTEND_URL is always allowed). Ignored in development, where all origins are allowed.
    CORS_ORIGIN: z.string().optional().default(''),
    // "true" / "false" to force Swagger UI on or off; unset picks the environment default.
    ENABLE_SWAGGER: z.enum(['true', 'false']).optional(),
    AI_PROVIDER: z.enum(['mock', 'openrouter', 'openai']).default('mock'),
    OPENROUTER_API_KEY: z.string().optional().default(''),
    OPENAI_API_KEY: z.string().optional().default(''),
    STORAGE_DRIVER: z.enum(['local', 's3', 'cloudinary']).default('local'),
    STORAGE_PATH: z.string().default('./uploads'),
    STORAGE_ENDPOINT: z.string().optional().default(''),
    STORAGE_BUCKET: z.string().optional().default(''),
    STORAGE_ACCESS_KEY: z.string().optional().default(''),
    STORAGE_SECRET_KEY: z.string().optional().default(''),
    STORAGE_REGION: z.string().optional().default('auto'),
    CLOUDINARY_CLOUD_NAME: z.string().optional().default(''),
    CLOUDINARY_API_KEY: z.string().optional().default(''),
    CLOUDINARY_API_SECRET: z.string().optional().default(''),
    LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  })
  .superRefine((config, ctx) => {
    if (config.NODE_ENV !== 'production') return;

    if (config.JWT_SECRET === DEV_JWT_SECRET) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['JWT_SECRET'], message: 'JWT_SECRET must be set to a real high-entropy secret in production (the development default cannot be used).' });
    }
    if (config.JWT_REFRESH_SECRET === DEV_JWT_REFRESH_SECRET) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['JWT_REFRESH_SECRET'], message: 'JWT_REFRESH_SECRET must be set to a real high-entropy secret in production (the development default cannot be used).' });
    }
    if (config.DATABASE_URL === DEV_DATABASE_URL) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['DATABASE_URL'], message: 'DATABASE_URL must be set to a real production database connection string.' });
    }
    if (config.AI_PROVIDER !== 'mock') {
      const key = config.AI_PROVIDER === 'openai' ? config.OPENAI_API_KEY : config.OPENROUTER_API_KEY;
      if (!key) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['AI_PROVIDER'], message: `AI_PROVIDER is "${config.AI_PROVIDER}" but its API key is not configured.` });
      }
    }
    if (config.STORAGE_DRIVER === 's3' && (!config.STORAGE_BUCKET || !config.STORAGE_ACCESS_KEY || !config.STORAGE_SECRET_KEY)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['STORAGE_DRIVER'], message: 'STORAGE_DRIVER is "s3" but STORAGE_BUCKET / STORAGE_ACCESS_KEY / STORAGE_SECRET_KEY are not fully configured.' });
    }
    if (config.STORAGE_DRIVER === 'cloudinary' && (!config.CLOUDINARY_CLOUD_NAME || !config.CLOUDINARY_API_KEY || !config.CLOUDINARY_API_SECRET)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['STORAGE_DRIVER'], message: 'STORAGE_DRIVER is "cloudinary" but CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET are not fully configured.' });
    }
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

const data = parsed.data;

export const env = {
  ...data,
  // Swagger defaults on in development/test, off in production unless explicitly enabled.
  ENABLE_SWAGGER: data.ENABLE_SWAGGER === undefined ? data.NODE_ENV !== 'production' : data.ENABLE_SWAGGER === 'true',
};
