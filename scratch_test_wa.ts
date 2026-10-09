import { prisma } from './apps/api/src/lib/prisma';
import { decryptWhatsAppToken, isEncryptedWhatsAppToken } from './apps/api/src/modules/communication/token-crypto';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
dotenv.config({ path: './apps/api/.env' });

async function main() {
  const accounts = await prisma.whatsAppAccount.findMany();
  console.log('Total WhatsApp Accounts:', accounts.length);
  for (const acc of accounts) {
    console.log({
      id: acc.id,
      agencyId: acc.agencyId,
      phoneNumberId: acc.phoneNumberId,
      status: acc.status,
      tokenLength: acc.accessTokenEncrypted?.length,
      isEncrypted: isEncryptedWhatsAppToken(acc.accessTokenEncrypted || ''),
      rawToken: acc.accessTokenEncrypted,
    });
  }

  console.log('ENV META_ACCESS_TOKEN length:', process.env.META_ACCESS_TOKEN?.length);
  console.log('ENV GEMINI_MODEL:', process.env.GEMINI_MODEL);
  console.log('ENV GEMINI_API_KEY prefix:', process.env.GEMINI_API_KEY?.substring(0, 10));

  // Test Gemini
  try {
    const apiKey = process.env.GEMINI_API_KEY || '';
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await res.json();
    console.log('Available models:', data.models?.map((m: any) => m.name));
  } catch (err: any) {
    console.error('Gemini Test Error:', err.message || err);
  }
}

main().catch(console.error).finally(() => process.exit(0));

