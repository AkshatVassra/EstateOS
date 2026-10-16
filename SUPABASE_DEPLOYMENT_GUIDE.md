# Supabase Edge Functions Deployment Guide

## Step 1: Link Local Supabase to Your Project

Open your terminal and run:

```bash
cd "D:\WORK\DUBAI RE"
npx supabase login
```

This will open a browser window. Sign in to your Supabase account.

## Step 2: Link to Your Project

After logging in, run:

```bash
npx supabase link --project-ref bgucdmceppcshpnwdqqp
```

## Step 3: Deploy Edge Functions

Once linked, deploy the functions:

```bash
npx supabase functions deploy leads
npx supabase functions deploy properties
npx supabase functions deploy dashboard
npx supabase functions deploy webhook
```

## Step 4: Set Environment Variables for Edge Functions

You need to set environment variables for each function:

```bash
npx supabase secrets set META_APP_SECRET=your_meta_app_secret
npx supabase secrets set META_WEBHOOK_VERIFY_TOKEN=estateos_live_whatsapp_webhook_2026
npx supabase secrets set SUPABASE_URL=https://bgucdmceppcshpnwdqqp.supabase.co
npx supabase secrets set SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJndWNkbWNlcHBjc2hwbndkcXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3MzcxMDgsImV4cCI6MjEwNzMxMzEwOH0.vWCMoWYgLP-teXy6pcBx7HF_qF5U0OSUgzwXie4TH0w
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZi6ImJndWNkbWNlcHBjc2hwbndkcXFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTczNzEwOCwiZXhwIjoyMTA3MzEzMTA4fQ.AqIxGzGB1vA8b_kKupY23qrV3ZOHxSd9WcOXYcS6P_A
```

## Step 5: Update Vercel Environment Variables

Go to Vercel: https://vercel.com/akshatvassras-projects/estateos/settings/environment-variables

Update this variable:
```
NEXT_PUBLIC_API_URL=https://bgucdmceppcshpnwdqqp.supabase.co/functions/v1
```

## Step 6: Redeploy Vercel

Run this to redeploy your frontend:
```bash
cd "D:\WORK\DUBAI RE"
vercel --prod
```

## What's Been Created

I've created 4 Supabase Edge Functions:

1. **leads** - `/api/leads` (GET, POST)
2. **properties** - `/api/properties` (GET)
3. **dashboard** - `/api/dashboard` (GET)
4. **webhook** - `/api/communication/webhook` (GET, POST)

These functions will connect directly to your Supabase database and handle API requests without needing a separate backend.

## Next Steps After Deployment

1. Deploy more functions as needed (AI endpoints, messaging, etc.)
2. Get Meta credentials for WhatsApp
3. Configure Meta webhook URL to: `https://bgucdmceppcshpnwdqqp.supabase.co/functions/v1/webhook`
