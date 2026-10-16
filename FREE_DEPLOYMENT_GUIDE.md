# Free Deployment Guide - EstateOS

## Current Status

✅ **Frontend deployed to Vercel:** https://estateos-eight-puce.vercel.app  
⏳ **Database:** Needs setup (PlanetScale - Free)  
⏳ **API:** Needs deployment (Vercel - Free)  
⏳ **Worker:** Needs deployment (Vercel Cron - Free)

## Step 1: Set Up PlanetScale MySQL (Free)

1. Go to: https://planetscale.com
2. Sign up for free account
3. Create new database:
   - Name: `estateos`
   - Region: Select closest to your users (AWS Frankfurt for Dubai)
   - Plan: Free (Scaler Pro Free)
4. Get connection string:
   - Go to database > Connect
   - Select "General" > "Connect with"
   - Choose "@prisma/client" or "MySQL"
   - Copy the connection string

**Connection string format:**
```
mysql://xxx:pscale_pw_xxx@aws.connect.psdb.cloud:3306/estateos?sslaccept=strict
```

## Step 2: Update Vercel Environment Variables

Go to: https://vercel.com/akshatvassras-projects/estateos/settings/environment-variables

Add these variables:

```bash
# Database (from PlanetScale)
DATABASE_URL=mysql://xxx:pscale_pw_xxx@aws.connect.psdb.cloud:3306/estateos?sslaccept=strict

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_cHJlcGFyZWQtaGF3ay0zLmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_zoaU3yUt8tR1mzNVIR8sVYNPF82mYQ9HrAuS2D3DsW

# Meta WhatsApp (get from your Meta app)
META_APP_SECRET=your_meta_app_secret
META_WEBHOOK_VERIFY_TOKEN=estateos_live_whatsapp_webhook_2026
META_PHONE_NUMBER_ID=your_phone_number_id
META_BUSINESS_ACCOUNT_ID=your_business_account_id
META_ACCESS_TOKEN=your_system_user_token
WHATSAPP_TOKEN_ENCRYPTION_KEY=oDV4aT7ei83uYD1OX9ofUrNWqVCk6PWMP0drrxU0UME=
WHATSAPP_API_VERSION=v21.0

# AI
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.5-flash

# API URLs
NEXT_PUBLIC_API_URL=https://estateos-eight-puce.vercel.app/api
BACKEND_URL=https://estateos-eight-puce.vercel.app
```

## Step 3: Deploy API to Separate Vercel Project

The API needs to be deployed separately. Since it's a monorepo, we'll need to:

### Option A: Use Railway for API (Simpler)

1. Go to: https://railway.app
2. Create new project
3. Add service → Select "Dockerfile"
4. Point to `apps/api/Dockerfile`
5. Add environment variables (same as above)
6. Deploy

**Cost:** Free tier available

### Option B: Deploy API to Vercel (Complex)

Due to monorepo structure, this requires:
1. Creating a separate repository for `apps/api`
2. Or using Vercel's monorepo support with turborepo

**I recommend Option A (Railway) for simplicity.**

## Step 4: Configure Webhook Worker

For now, the webhook worker can run on the same API server. The API routes in `apps/api/src/app/api/communication/webhook` will handle webhooks.

## Step 5: Update Meta Webhook URL

Go to Meta Developer Console > WhatsApp > Configuration:
- **Webhook URL:** `https://estateos-eight-puce.vercel.app/api/communication/webhook`
- **Verify Token:** `estateos_live_whatsapp_webhook_2026`

## Cost Summary

- **Vercel (Frontend):** Free
- **PlanetScale (Database):** Free
- **Railway (API + Worker):** Free tier
- **Total:** $0/month

## What I Need From You

1. **Set up PlanetScale** and get the connection string
2. **Share the connection string** so I can update the configuration
3. **Get Meta credentials** from your Meta app (App ID: 1094605773102329)
4. **Let me know** if you want to deploy API to Railway or continue with Vercel

## Next Steps After Database Setup

Once you have the PlanetScale connection string:

1. I'll update the Prisma schema to use PlanetScale
2. Run database migrations
3. Deploy API to Railway
4. Configure all environment variables
5. Test the full application

**Can you set up PlanetScale and share the connection string?**
