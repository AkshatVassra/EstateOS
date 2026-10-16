#!/usr/bin/env node

/**
 * Setup Supabase Environment Variables
 * This script updates your .env file with Supabase credentials
 */

const fs = require('fs');
const path = require('path');

const ENV_FILE = path.join(__dirname, '..', '.env');
const BACKUP_FILE = path.join(__dirname, '..', '.env.backup.local');

const SUPABASE_CONFIG = {
  PROJECT_URL: 'https://bgucdmceppcshpnwdqqp.supabase.co',
  ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJndWNkbWNlcHBjc2hwbndkcXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3MzcxMDgsImV4cCI6MjEwNzMxMzEwOH0.vWCMoWYgLP-teXy6pcBx7HF_qF5U0OSUgzwXie4TH0w',
  SERVICE_ROLE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJndWNkbWNlcHBjc2hwbndkcXFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTczNzEwOCwiZXhwIjoyMTA3MzEzMTA4fQ.AqIxGzGB1vA8b_kKupY23qrV3ZOHxSd9WcOXYcS6P_A',
};

console.log('🔄 Setting up Supabase environment variables...\n');

// Check if .env exists
if (!fs.existsSync(ENV_FILE)) {
  console.error('❌ Error: .env file not found at:', ENV_FILE);
  console.log('Please ensure you have a .env file in the project root.');
  process.exit(1);
}

// Read current .env
let envContent = fs.readFileSync(ENV_FILE, 'utf8');

// Create backup
fs.writeFileSync(BACKUP_FILE, envContent);
console.log('✅ Backup created at:', BACKUP_FILE);

// Remove old database and Clerk variables
const varsToRemove = [
  'DATABASE_URL',
  'MYSQL_ROOT_PASSWORD',
  'MYSQL_USER',
  'MYSQL_PASSWORD',
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
  'CLERK_PUBLISHABLE_KEY',
];

varsToRemove.forEach(varName => {
  const regex = new RegExp(`^${varName}=.*$`, 'gm');
  envContent = envContent.replace(regex, '');
  console.log(`🗑️  Removed: ${varName}`);
});

// Add Supabase variables
const supabaseVars = `
# Supabase Configuration
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@bgucdmceppcshpnwdqqp.supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_CONFIG.PROJECT_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_CONFIG.ANON_KEY}
SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_CONFIG.SERVICE_ROLE_KEY}
`;

envContent = envContent.trimEnd() + supabaseVars;

// Write updated .env
fs.writeFileSync(ENV_FILE, envContent);

console.log('\n' + '='.repeat(50));
console.log('✅ Supabase configuration complete!');
console.log('='.repeat(50));
console.log('\n📝 Added variables:');
console.log('   NEXT_PUBLIC_SUPABASE_URL');
console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY');
console.log('   SUPABASE_SERVICE_ROLE_KEY');
console.log('\n⚠️  IMPORTANT:');
console.log('   You need to add your database password to DATABASE_URL');
console.log('   Get it from: Supabase Dashboard > Database > Reset password');
console.log('   Format: postgresql://postgres:[PASSWORD]@bgucdmceppcshpnwdqqp.supabase.co:5432/postgres');
console.log('\n📝 Removed variables:');
console.log('   DATABASE_URL (MySQL)');
console.log('   Clerk variables (replaced with Supabase Auth)');
console.log('\n📋 Next steps:');
console.log('   1. Get database password from Supabase');
console.log('   2. Update DATABASE_URL in .env with your password');
console.log('   3. I will migrate the schema to PostgreSQL');
console.log('   4. I will replace Clerk with Supabase Auth');
console.log('   5. Deploy to Vercel\n');
