import { prisma } from "@estateos/database";
import { encryptWhatsAppToken, isEncryptedWhatsAppToken } from "../modules/communication/token-crypto";

async function run(): Promise<void> {
  const accounts = await prisma.whatsAppAccount.findMany({
    select: { id: true, accessTokenEncrypted: true },
  });

  let migrated = 0;
  for (const account of accounts) {
    if (isEncryptedWhatsAppToken(account.accessTokenEncrypted)) continue;

    await prisma.whatsAppAccount.update({
      where: { id: account.id },
      data: { accessTokenEncrypted: encryptWhatsAppToken(account.accessTokenEncrypted) },
    });
    migrated += 1;
  }

  console.log(`Encrypted ${migrated} WhatsApp access token${migrated === 1 ? "" : "s"}.`);
}

run()
  .catch((error) => {
    console.error("WhatsApp token migration failed.", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
