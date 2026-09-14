# Multi-stage Dockerfile for MediKiosk Production Backend
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies needed for native modules (if any) and OpenSSL for Prisma
RUN apk add --no-cache openssl libc6-compat

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY tsconfig.json ./
COPY src ./src/

# Generate Prisma Client & compile TypeScript
RUN npx prisma generate
RUN npm run build

# Production runtime stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000
ENV HOST=0.0.0.0

RUN apk add --no-cache openssl libc6-compat

# Copy production node_modules and built assets
COPY package*.json ./
RUN npm ci --only=production

COPY prisma ./prisma/
RUN npx prisma generate

COPY --from=builder /app/dist ./dist

# Non-root user for healthcare security compliance
RUN addgroup -g 1001 -S nodejs && adduser -S medikiosk -u 1001
USER medikiosk

EXPOSE 4000

CMD ["node", "dist/server.js"]
