# Vercel Deployment Guide for EstateOS

This guide covers deploying EstateOS to Vercel. Since EstateOS is a monorepo with separate frontend and API, we'll deploy the web app to Vercel and the API to a suitable backend service.

## Architecture

```
Frontend (Next.js) → Vercel
API (Next.js API Routes) → Vercel Serverless Functions
Database → Railway MySQL (or your existing MySQL)
Webhook Worker → Railway Worker (or similar)
```

## Prerequisites

- Vercel account
- GitHub repository with EstateOS code
- Railway account (for MySQL and worker) OR existing MySQL database
- Meta WhatsApp Cloud API credentials

## Step 1: Deploy Database

### Option A: Use Railway (Recommended)

1. Go to [railway.app](https://railway.app)
2. Create new project
3. Add MySQL database
4. Get connection string (format: `mysql://user:password@host:port/database`)
5. Add to Vercel environment variables as `DATABASE_URL`

### Option B: Use Existing MySQL

If you already have MySQL (e.g., from your local setup):
- Use your existing connection string
- Ensure it's accessible from Vercel (not localhost)

## Step 2: Deploy Web App to Vercel

### 2.1 Install Vercel CLI

```bash
npm install -g vercel
```

### 2.2 Login to Vercel

```bash
vercel login
```

### 2.3 Deploy from Root Directory

```bash
cd "D:\WORK\DUBAI RE"
vercel
```

Follow the prompts:
- **Set up and deploy?** Yes
- **Which scope?** Your account
- **Link to existing project?** No (create new)
- **Project name:** estateos (or your choice)
- **In which directory is your code located?** ./
- **Want to override the settings?** No

### 2.4 Configure Environment Variables in Vercel

Go to your Vercel project → Settings → Environment Variables

Add these variables:

```bash
# Database
DATABASE_URL=mysql://user:password@host:port/database

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# API Configuration
NEXT_PUBLIC_API_URL=https://your-vercel-domain.vercel.app/api
BACKEND_URL=https://your-vercel-domain.vercel.app

# AI
AI_PROVIDER_CHAIN=gemini,openai,anthropic,mock
GEMINI_API_KEY=your_gemini_key
GEMINI_MODEL=gemini-1.5-pro
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-api03-...

# Meta WhatsApp Cloud API
META_APP_SECRET=your_meta_app_secret
META_WEBHOOK_VERIFY_TOKEN=estateos_live_whatsapp_webhook_2026
META_PHONE_NUMBER_ID=your_phone_number_id
META_BUSINESS_ACCOUNT_ID=your_business_account_id
META_ACCESS_TOKEN=your_system_user_token
WHATSAPP_TOKEN_ENCRYPTION_KEY=your_base64_32_byte_key
WHATSAPP_API_VERSION=v21.0

# Rate Limiting
WEBHOOK_RATE_LIMIT_PER_MINUTE=120

# Monitoring (Optional)
SENTRY_DSN=your_sentry_dsn
SENTRY_ENVIRONMENT=production
```

### 2.5 Update vercel.json

Create or update `vercel.json` in the root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "apps/web/.next",
  "installCommand": "npm install",
  "framework": "nextjs",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

### 2.6 Deploy Again

```bash
vercel --prod
```

## Step 3: Configure Meta Webhook

1. Go to Meta Developer Console > Your App > WhatsApp > Configuration
2. Webhook URL: `https://your-vercel-domain.vercel.app/api/communication/webhook`
3. Verify Token: `estateos_live_whatsapp_webhook_2026`
4. Subscribe to: `messages` and `message_status`

## Step 4: Deploy Webhook Worker

The webhook worker needs to run continuously. Options:

### Option A: Railway Worker (Recommended)

1. Create a new Railway project
2. Add a new service → Select "Dockerfile"
3. Point to `apps/api/Dockerfile`
4. Command: `npm run worker --workspace=api`
5. Add environment variables (same as Vercel)
6. Deploy

### Option B: Vercel Cron Jobs

For simple setups, you can use Vercel Cron Jobs to trigger periodic processing:

Create `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/workers/webhook",
      "schedule": "*/1 * * * *"
    }
  ]
}
```

Create API route: `apps/api/src/app/api/workers/webhook/route.ts`

## Step 5: Run Database Migrations

Since Vercel doesn't have a build process for database migrations:

### Option A: Run Locally with Remote Database

```bash
# Update your local .env to use Railway MySQL DATABASE_URL
npm run db:push
```

### Option B: Use Railway's CLI

```bash
railway run npm run db:push
```

### Option C: Create a Migration API Endpoint

Create a protected API endpoint that runs migrations when called (for initial setup only).

## Step 6: Verify Deployment

### Check Web App

```bash
curl https://your-vercel-domain.vercel.app
```

### Check API Health

```bash
curl https://your-vercel-domain.vercel.app/api/health
```

### Test Webhook Verification

```bash
curl "https://your-vercel-domain.vercel.app/api/communication/webhook?hub.mode=subscribe&hub.verify_token=estateos_live_whatsapp_webhook_2026&hub.challenge=test123"
```

Expected response: `test123`

## Step 7: Configure Clerk

1. Go to Clerk Dashboard
2. Add your Vercel domain to Allowed Origins
3. Configure JWT templates if needed
4. Update Clerk environment variables in Vercel

## Step 8: Monitor and Scale

### Vercel Analytics

Enable Vercel Analytics in project settings.

### Error Tracking

Set up Sentry:

```bash
npm install @sentry/nextjs
```

Add to `apps/web/next.config.ts`:

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT,
});
```

## Troubleshooting

### Build Fails

- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify `DATABASE_URL` is correct

### Webhook Not Receiving Events

- Verify webhook URL is accessible: `curl https://your-domain/api/communication/webhook`
- Check Meta webhook status in Developer Console
- Verify `META_WEBHOOK_VERIFY_TOKEN` matches exactly

### Database Connection Issues

- Ensure database allows connections from Vercel IPs
- Check `DATABASE_URL` format
- Verify database is running

### Worker Not Processing Events

- Check worker logs (Railway dashboard)
- Verify worker has access to database
- Ensure environment variables match API

## Cost Estimates

**Vercel (Hobby):**
- Free for personal projects
- 100GB bandwidth/month
- 6,000 minutes of execution/month

**Railway MySQL:**
- ~$5/month for small database

**Railway Worker:**
- ~$5/month for basic worker

**Total: ~$10/month** for small deployment

## Production Checklist

- [ ] Database deployed and accessible
- [ ] Web app deployed to Vercel
- [ ] All environment variables configured
- [ ] Database migrations run
- [ ] Meta webhook configured with correct URL
- [ ] Webhook worker deployed and running
- [ ] Clerk configured with Vercel domain
- [ ] Health check endpoint returning healthy
- [ ] Test message sent and received
- [ ] Error monitoring configured
- [ ] Custom domain configured (optional)

## Alternative: Full Vercel Deployment

If you want everything on Vercel (including database):

### Use Vercel Postgres

1. Add Vercel Postgres to your project
2. Update Prisma schema to use PostgreSQL instead of MySQL
3. Update `DATABASE_URL` to Vercel Postgres connection string
4. Migrate schema to PostgreSQL

This simplifies deployment but requires schema changes.

## Next Steps

1. Deploy database (Railway or existing MySQL)
2. Deploy web app to Vercel
3. Configure environment variables
4. Update Meta webhook URL
5. Deploy webhook worker
6. Test end-to-end

For detailed Vercel documentation: https://vercel.com/docs
