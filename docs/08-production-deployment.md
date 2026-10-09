# EstateOS – Phase 4: Production Containerization & Deployment Guide

## 1. Overview
EstateOS has been fully containerized using Docker and Docker Compose for seamless deployment to AWS ECS, DigitalOcean App Platform, Google Cloud Run, or on-premise production servers.

## 2. Docker Architecture
The container architecture uses multi-stage Alpine Linux builds for minimal image size and enhanced security:
- `estateos-mysql`: MySQL 8.0 server with persistent volume storage and automated healthchecks.
- `estateos-api`: Node 20 Alpine server running the Next.js API server (`apps/api`) on port 3001 with pre-generated Prisma client.
- `estateos-web`: Node 20 Alpine server running the frontend Next.js application (`apps/web`) on port 3000, communicating with the backend over the Docker bridge network via `BACKEND_URL=http://api:3001`.

## 3. Quick Start with Docker Compose
To launch the entire stack in production mode on any server with Docker installed:

```bash
# 1. Clone or copy the repository
git clone https://github.com/your-org/estateos.git
cd estateos

# 2. Build and start all services in detached mode
docker-compose up -d --build

# 3. Verify container health and logs
docker-compose ps
docker-compose logs -f
```

## 4. Local Development Server Configuration
When running locally without Docker, EstateOS uses a concurrent development runner so both the API and Web servers start simultaneously:
```bash
# Start both Backend API (port 3001) and Web Frontend (port 3000) concurrently
npm run dev
```

## 5. Environment Variables & Clerk Auth
Ensure your production `.env` files or Docker environment secrets contain:
- `DATABASE_URL`: Connection string to the MySQL database instance.
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk authentication public key.
- `CLERK_SECRET_KEY`: Clerk authentication secret key.
