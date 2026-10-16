#!/bin/bash

# Vercel Deployment Script for EstateOS
# This script deploys the web app to Vercel

set -e

echo "🚀 Starting Vercel deployment for EstateOS..."
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if logged in
echo "🔐 Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    echo "Please login to Vercel:"
    vercel login
fi

# Build the project
echo "🔨 Building project..."
npm run build:web

# Deploy to Vercel
echo "📦 Deploying to Vercel..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Go to Vercel dashboard to configure environment variables"
echo "2. Update Meta webhook URL to your new Vercel domain"
echo "3. Deploy webhook worker (see VERCEL_DEPLOYMENT_GUIDE.md)"
echo ""
