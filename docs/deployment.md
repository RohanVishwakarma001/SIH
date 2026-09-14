# MediKiosk Backend Deployment Guide (Render & Cloud Production)

This guide provides step-by-step instructions for deploying the **MediKiosk AI Clinical Core Backend** to production on [Render](https://render.com) or equivalent container environments (AWS ECS, Google Cloud Run, Railway, DigitalOcean).

---

## 1. Production Architecture Overview

- **Runtime**: Node.js v20+ / Alpine Linux container
- **Web Framework**: Fastify + TypeScript
- **Database**: PostgreSQL (v15+) managed database
- **ORM**: Prisma (with automated migration on deploy)
- **Networking**: Binds to `0.0.0.0` and listens on `process.env.PORT` (Render dynamic port)
- **Security**: Strict CORS for frontend Vercel domain, Helmet headers, Sliding JWT auth with refresh tokens, In-memory rate limiting, non-root user execution in Docker.

---

## 2. Environment Variables

Configure these variables in your Render Dashboard (**Environment** tab):

| Variable | Type | Example / Description |
|---|---|---|
| `NODE_ENV` | String | `production` |
| `PORT` | Number | Automatically assigned by Render (default `4000` fallback) |
| `HOST` | String | `0.0.0.0` |
| `DATABASE_URL` | String | PostgreSQL Connection string (e.g. `postgresql://medikiosk:pass@ep-cool-db.us-east-1.aws.neon.tech/neondb?sslmode=require`) |
| `JWT_SECRET` | String | High-entropy random secret (min 32 chars) for short-lived access tokens |
| `JWT_REFRESH_SECRET` | String | High-entropy random secret for 7-day sliding refresh tokens |
| `CORS_ORIGIN` | String | Frontend Vercel URL, e.g. `https://medikiosk.vercel.app` (or comma-separated) |
| `LOG_LEVEL` | String | `info` (or `warn` in high-throughput production) |
| `AI_PROVIDER` | String | `openrouter` (recommended), `openai`, or `mock` |
| `OPENROUTER_API_KEY` | String | Required when `AI_PROVIDER=openrouter` — from [openrouter.ai/keys](https://openrouter.ai/keys) |
| `OPENAI_API_KEY` | String | *(Optional)* If using OpenAI GPT-4o directly instead |
| `STORAGE_DRIVER` | String | `cloudinary` (recommended), `s3`, or `local` (not durable on ephemeral hosts) |
| `CLOUDINARY_CLOUD_NAME` | String | Required when `STORAGE_DRIVER=cloudinary` — from your Cloudinary Dashboard |
| `CLOUDINARY_API_KEY` | String | Required when `STORAGE_DRIVER=cloudinary` |
| `CLOUDINARY_API_SECRET` | String | Required when `STORAGE_DRIVER=cloudinary` |
| `STORAGE_ENDPOINT` | String | *(s3 only)* Cloudflare R2 / AWS S3 S3-compatible endpoint |
| `STORAGE_BUCKET` | String | *(s3 only)* `medikiosk-records` |
| `STORAGE_ACCESS_KEY` | String | *(s3 only)* S3 Access Key ID |
| `STORAGE_SECRET_KEY` | String | *(s3 only)* S3 Secret Access Key |
| `ENABLE_SWAGGER` | String | `true` or `false` (enables `/docs` OpenAPI UI) |

---

## 3. Deploying on Render (Native Web Service)

### Step 1: Create a PostgreSQL Database on Render
1. Navigate to your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** → **PostgreSQL**.
3. Name: `medikiosk-postgres`.
4. Region: Choose the region closest to your users (e.g., `Singapore` or `Frankfurt`).
5. Plan: `Free` or `Starter`.
6. Copy the **Internal Database URL** (or External Database URL if deploying across accounts).

### Step 2: Create the Web Service
1. Click **New +** → **Web Service**.
2. Connect your Git repository (`final-hackathon` or `medikiosk`).
3. Set the **Root Directory** to `backend`.
4. **Environment**: `Node`.
5. **Build Command**:
   ```bash
   npm install && npx prisma generate && npm run build
   ```
6. **Start Command**:
   ```bash
   npx prisma migrate deploy && npm run seed && npm run start
   ```
   *(Note: `npm run seed` populates AIIMS demo credentials, departments, and simulated patients for initial presentation).*

7. **Plan**: `Free` or `Starter`.

### Step 3: Add Environment Variables
Under the **Environment** tab of your new Web Service, add the variables listed in Section 2 above.

---

## 4. Deploying via Docker (Render Docker Service)

Render can build and run the provided multi-stage `Dockerfile`:

1. Click **New +** → **Web Service**.
2. Connect your Git repository.
3. Select **Docker** environment.
4. Set **Docker Context**: `backend`.
5. Set **Dockerfile Path**: `backend/Dockerfile`.
6. Add your environment variables.
7. Click **Create Web Service**.

The Dockerfile incorporates:
- Multi-stage build for minimal image size (< 150 MB)
- Non-root runtime user (`medikiosk`, UID 1001) for strict healthcare data isolation
- Embedded OpenSSL libraries for Prisma query engine

---

## 5. Automated CI/CD & Production Health Check

Once deployed, verify the service is running and accepting traffic:

### 1. Health Probe
```bash
curl -i https://<your-render-app>.onrender.com/health
```
Response:
```json
{
  "status": "HEALTHY",
  "service": "MediKiosk Clinical Core API",
  "version": "1.0.0",
  "timestamp": "2026-09-14T00:00:00.000Z",
  "database": "connected"
}
```

### 2. Interactive API Documentation (Swagger)
Open in your browser:
`https://<your-render-app>.onrender.com/docs`

---

## 6. Zero-Downtime Database Migrations

When pushing schema updates:
1. Develop locally: `npx prisma migrate dev --name <migration_name>`
2. Commit `prisma/migrations/` to Git.
3. On Render deploy, the pre-deploy or release hook runs `npx prisma migrate deploy`, which applies migrations safely without data loss.
