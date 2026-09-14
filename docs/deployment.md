# MediKiosk Deployment Guide (Render + Vercel, no Docker)

This guide deploys the backend to [Render](https://render.com) as a native Node web service (no containers) and the frontend to [Vercel](https://vercel.com).

---

## 0. What's real vs. simulated in this deployment

Before going live, know what's actually wired to a real vendor and what isn't:

- **Real**: authentication, database, patient records, consent, drug-interaction checking, and (once you set `AI_PROVIDER`/an API key below) LLM-based clinical summarization and document entity extraction.
- **Simulated ("sandbox")**: OCR text extraction, voice/ASR transcription, and ABDM/Aadhaar OTP verification. These need vendor credentials this project doesn't have out of the box — a real OCR vendor (Google Cloud Vision, AWS Textract, Azure Document Intelligence), a real speech API (Bhashini/AI4Bharat), and an NHA ABDM HIP/HIU sandbox or production registration (an organizational onboarding process, not just an API key). The UI labels these honestly (e.g. "ABDM Sandbox", "OTP gateway not yet connected") rather than pretending they're live. To make them real, implement the corresponding provider in `backend/src/ai/providers/` (OCR/speech) or `backend/src/integrations/abha/` (ABDM) once you have credentials, following the existing `LLMProvider`/`OCRProvider` interface pattern.

---

## 1. Production Architecture Overview

- **Runtime**: Node.js 20+, native (no Docker)
- **Web Framework**: Fastify + TypeScript
- **Database**: PostgreSQL (Neon, Supabase, or any managed Postgres — see note in step 3)
- **ORM**: Prisma, with `prisma migrate deploy` run automatically before each start
- **File storage**: Cloudinary or S3-compatible (local disk storage does not persist across Render deploys/restarts — do not use `STORAGE_DRIVER=local` in production)
- **Security**: Strict CORS allow-listing the Vercel frontend domain, Helmet headers, JWT auth with refresh tokens, rate limiting

---

## 2. Backend Environment Variables (Render)

| Variable | Required | Description |
|---|---|---|
| `NODE_ENV` | Yes | `production` |
| `HOST` | Yes | `0.0.0.0` |
| `DATABASE_URL` | Yes | Your Postgres connection string |
| `JWT_SECRET` | Yes | High-entropy secret (generate with `openssl rand -hex 32`) |
| `JWT_REFRESH_SECRET` | Yes | Different high-entropy secret |
| `BOOTSTRAP_ADMIN_KEY` | Yes | High-entropy secret gating the one-time admin-creation endpoint (see step 5) |
| `FRONTEND_URL` | Yes | Your deployed Vercel URL, e.g. `https://medikiosk.vercel.app` |
| `CORS_ORIGIN` | No | Extra comma-separated allowed origins (any `*.vercel.app` / `*.onrender.com` origin is always allowed) |
| `AI_PROVIDER` | Yes | `openrouter` (recommended) or `openai` — real LLM summarization. `mock` disables real AI and simulates it instead. |
| `OPENROUTER_API_KEY` | If using openrouter | From [openrouter.ai/keys](https://openrouter.ai/keys) |
| `OPENAI_API_KEY` | If using openai | From platform.openai.com |
| `STORAGE_DRIVER` | Yes | `cloudinary` (recommended) or `s3` |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | If cloudinary | From your Cloudinary dashboard |
| `STORAGE_BUCKET` / `STORAGE_ACCESS_KEY` / `STORAGE_SECRET_KEY` / `STORAGE_ENDPOINT` / `STORAGE_REGION` | If s3 | Your S3-compatible bucket credentials |
| `LOG_LEVEL` | No | `info` |
| `ENABLE_SWAGGER` | No | `false` recommended in production |

The server refuses to start in production with a missing/placeholder `JWT_SECRET`, `JWT_REFRESH_SECRET`, `DATABASE_URL`, or `BOOTSTRAP_ADMIN_KEY` — this is enforced by `backend/src/config/env.ts`, not just documentation.

---

## 3. Deploy the Backend to Render

**Option A — Blueprint (fastest):** this repo includes `render.yaml` at the root. In the Render dashboard, choose **New + → Blueprint**, connect this repository, and Render will read `render.yaml` and create the web service for you. You'll still need to fill in the `sync: false` variables (database URL, frontend URL, AI/storage keys) in the dashboard after it's created.

**Option B — Manual:**
1. In the [Render Dashboard](https://dashboard.render.com), click **New + → Web Service** and connect this repository.
2. Set **Root Directory** to `backend`.
3. **Environment**: `Node` (not Docker).
4. **Build Command**: `npm install && npx prisma generate && npm run build`
5. **Start Command**: `npx prisma migrate deploy && npm run start`
6. **Health Check Path**: `/health`
7. Add the environment variables from the table above.

**Database**: point `DATABASE_URL` at a real managed Postgres. [Neon](https://neon.tech) and [Supabase](https://supabase.com) both have durable free tiers and work well here. Avoid Render's own free Postgres for anything beyond a quick test — it is deleted after 30 days.

---

## 4. Deploy the Frontend to Vercel

1. In the [Vercel Dashboard](https://vercel.com/new), import this repository.
2. Set **Root Directory** to `frontend` (this repo is a monorepo — frontend and backend are siblings).
3. Framework preset: Vite (auto-detected).
4. Environment variable: `VITE_API_URL` = `https://<your-render-service>.onrender.com/api/v1`
5. Deploy. `frontend/vercel.json` (already in the repo) rewrites all routes to `index.html` so client-side routing (React Router) works on refresh/deep links.
6. Once deployed, go back to Render and set `FRONTEND_URL` (and optionally `CORS_ORIGIN`) to this Vercel URL, then redeploy the backend so CORS allows it.

---

## 5. Create Your First Real Admin Account

There are no seeded demo accounts — `prisma/seed.ts` only creates operational reference data (hospital/departments/kiosk terminals), never patients or staff logins. After your first successful deploy, create your real admin account with the one-time bootstrap endpoint:

```bash
curl -X POST https://<your-render-service>.onrender.com/api/v1/auth/bootstrap-admin \
  -H "Content-Type: application/json" \
  -H "X-Bootstrap-Key: <your BOOTSTRAP_ADMIN_KEY>" \
  -d '{
    "email": "you@yourhospital.org",
    "password": "<a strong real password>",
    "firstName": "Your",
    "lastName": "Name"
  }'
```

This endpoint automatically and permanently disables itself the moment any admin account exists — a leaked `BOOTSTRAP_ADMIN_KEY` after that point is harmless. Sign in with these credentials at `/login`, then create your real doctor and staff accounts from the Admin console (or extend the admin API to do so, if you haven't built that screen yet).

---

## 6. Verify the Deployment

```bash
curl -i https://<your-render-service>.onrender.com/health
```

Expected:
```json
{
  "status": "HEALTHY",
  "service": "MediKiosk Clinical Core API",
  "database": "connected"
}
```

If `ENABLE_SWAGGER=true`, interactive API docs are at `/docs`.

---

## 7. Ongoing Schema Migrations

1. Change `backend/prisma/schema.prisma` locally and run `npx prisma migrate dev --name <migration_name>`.
2. Commit the generated `prisma/migrations/` folder.
3. On the next Render deploy, the start command's `npx prisma migrate deploy` applies it automatically before the server boots.
