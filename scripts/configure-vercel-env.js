#!/usr/bin/env node

/**
 * Configure Vercel Environment Variables
 * This script creates a .vercel.env file for easy copy-paste to Vercel
 */

const fs = require('fs');
const path = require('path');

const ENV_FILE = path.join(__dirname, '..', '.env');
const VERCEL_ENV_FILE = path.join(__dirname, '..', '.vercel.env');

// Read current .env
let envContent = fs.readFileSync(ENV_FILE, 'utf8');

// Extract only the variables we need for Vercel
const varsToKeep = [
  'DATABASE_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'AI_PROVIDER_CHAIN',
  'GEMINI_API_KEY',
  'GEMINI_MODEL',
  'OPENAI_API_KEY',
  'ANTHROPIC_API_KEY',
  'META_APP_SECRET',
  'META_WEBHOOK_VERIFY_TOKEN',
  'META_PHONE_NUMBER_ID',
  'META_BUSINESS_ACCOUNT_ID',
  'META_ACCESS_TOKEN',
  'WHATSAPP_TOKEN_ENCRYPTION_KEY',
  'WHATSAPP_API_VERSION',
  'NEXT_PUBLIC_API_URL',
  'BACKEND_URL',
];

const vercelEnv = envContent.split('\n')
  .filter(line => {
    const varName = line.split('=')[0];
    return varsToKeep.includes(varName) && line.trim() && !line.startsWith('#');
  })
  .join('\n');

fs.writeFileSync(VERCEL_ENV_FILE, vercelEnv);

console.log('✅ Vercel environment variables extracted to:', VERCEL_ENV_FILE);
console.log('\n📋 Copy these to Vercel Dashboard > Settings > Environment Variables:');
console.log('   https://vercel.com/akshatvassras-projects/estateos/settings/environment-variables\n');
console.log(vercelEnv);
