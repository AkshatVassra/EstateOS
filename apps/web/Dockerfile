# Base image
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl

# Dependencies stage
FROM base AS deps
COPY package.json package-lock.json* ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY packages/database/package.json ./packages/database/
RUN npm ci || npm install

# Builder stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Generate Prisma Client (needed for shared types/packages)
RUN npm run db:generate --workspace=@estateos/database || npx prisma generate --schema=packages/database/prisma/schema.prisma
# Build Web app
ENV BACKEND_URL=http://api:3001
RUN npm run build --workspace=@estateos/web

# Production Runner stage
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV BACKEND_URL=http://api:3001
EXPOSE 3000

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web ./apps/web
COPY --from=builder /app/packages ./packages

USER node
CMD ["npm", "run", "start", "--workspace=@estateos/web"]
