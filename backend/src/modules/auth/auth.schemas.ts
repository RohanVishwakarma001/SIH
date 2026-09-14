import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['DOCTOR', 'STAFF', 'ADMIN', 'PATIENT']).optional(),
});

export const refreshSchema = z.object({
  refreshToken: z.string(),
});

export const abhaVerifySchema = z.object({
  abhaId: z.string().min(10),
  otp: z.string().min(4).max(6),
  sessionId: z.string().optional(),
});

export const mobileVerifySchema = z.object({
  mobile: z.string().min(10).max(13),
  otp: z.string().min(4).max(6),
  sessionId: z.string().optional(),
});

export const walkinSchema = z.object({
  name: z.string().min(2),
  age: z.number().int().min(1).max(125),
  gender: z.enum(['Male', 'Female', 'Other']),
  mobile: z.string().optional(),
  sessionId: z.string().optional(),
});
