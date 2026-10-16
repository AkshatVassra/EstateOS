#!/usr/bin/env node

/**
 * Migration Script: Remove Twilio, Add Meta Cloud API
 *
 * This script updates your .env file to:
 * 1. Remove all Twilio-related variables
 * 2. Add Meta Cloud API variables with placeholder values
 * 3. Keep all existing configuration intact
 *
 * Usage: node scripts/migrate-to-meta-api.js
 */

const fs = require('fs');
const path = require('path');

const ENV_FILE = path.join(__dirname, '..', '.env');
const BACKUP_FILE = path.join(__dirname, '..', '.env.backup.twilio');

// Variables to remove
const TWILIO_VARS = [
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_WHATSAPP_NUMBER',
  'WHATSAPP_VERIFY_TOKEN',
];

// Variables to add
const META_VARS = [
  {
    key: 'META_APP_SECRET',
    value: 'your_meta_app_secret',
    comment: '# Get from: Meta App Settings > Basic'
  },
  {
    key: 'META_PHONE_NUMBER_ID',
    value: 'your_phone_number_id',
    comment: '# Get from: WhatsApp > Phone Numbers > Select number'
  },
  {
    key: 'META_BUSINESS_ACCOUNT_ID',
    value: 'your_business_account_id',
    comment: '# Get from: Business Manager > WhatsApp Accounts'
  },
  {
    key: 'META_ACCESS_TOKEN',
    value: 'your_system_user_token',
    comment: '# Get from: App Settings > Advanced > System User > Generate Token'
  },
  {
    key: 'WHATSAPP_TOKEN_ENCRYPTION_KEY',
    value: 'your_base64_32_byte_key',
    comment: '# Generate with: openssl rand -base64 32'
  },
  {
    key: 'WHATSAPP_API_VERSION',
    value: 'v21.0',
    comment: '# WhatsApp API version'
  },
  {
    key: 'META_WEBHOOK_VERIFY_TOKEN',
    value: 'estateos_live_whatsapp_webhook_2026',
    comment: '# Webhook verification token (must match Meta app settings)'
  },
];

console.log('Starting migration from Twilio to Meta Cloud API...\n');

// Check if .env exists
if (!fs.existsSync(ENV_FILE)) {
  console.error('Error: .env file not found at:', ENV_FILE);
  console.log('Please ensure you have a .env file in the project root.');
  process.exit(1);
}

// Read current .env
let envContent = fs.readFileSync(ENV_FILE, 'utf8');

// Create backup
fs.writeFileSync(BACKUP_FILE, envContent);
console.log('Backup created at:', BACKUP_FILE);

// Remove Twilio variables
let removedCount = 0;
TWILIO_VARS.forEach(varName => {
  const regex = new RegExp(`^${varName}=.*$`, 'gm');
  const matches = envContent.match(regex);
  if (matches) {
    removedCount += matches.length;
    envContent = envContent.replace(regex, '');
    console.log('Removed:', varName);
  }
});

// Add Meta variables (check if they already exist)
let addedCount = 0;
const existingKeys = envContent
  .split('\n')
  .filter(line => line.trim() && !line.startsWith('#'))
  .map(line => line.split('=')[0].trim());

const metaSection = '\n# ==========================================\n# Meta WhatsApp Cloud API\n# ==========================================\n';

let metaVarsToAdd = '';
META_VARS.forEach(({ key, value, comment }) => {
  if (!existingKeys.includes(key)) {
    metaVarsToAdd += `${comment}\n${key}="${value}"\n`;
    addedCount++;
    console.log('Added:', key);
  } else {
    console.log('Skipped (already exists):', key);
  }
});

// Add Meta section if we have variables to add
if (metaVarsToAdd) {
  // Add before the file ends
  envContent = envContent.trimEnd() + metaSection;
}

// Write updated .env
fs.writeFileSync(ENV_FILE, envContent);

console.log('\n' + '='.repeat(50));
console.log('Migration complete!');
console.log('='.repeat(50));
console.log('\nSummary:');
console.log('   - Removed', removedCount, 'Twilio variable(s)');
console.log('   - Added', addedCount, 'Meta Cloud API variable(s)');
console.log('   - Backup saved to:', BACKUP_FILE);
console.log('\nNext steps:');
console.log('   1. Open your .env file');
console.log('   2. Replace placeholder values with actual Meta credentials');
console.log('   3. Run: openssl rand -base64 32 (for WHATSAPP_TOKEN_ENCRYPTION_KEY)');
console.log('   4. Run: npm run db:seed (to create WhatsApp account in database)');
console.log('   5. Restart your services: docker compose up');
console.log('\nFor detailed setup instructions, see: WHATSAPP_SETUP_GUIDE.md\n');
