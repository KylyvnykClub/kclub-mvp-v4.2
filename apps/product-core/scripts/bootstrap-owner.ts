import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@kclub/database';
import { createCipheriv, createHash, randomBytes } from 'node:crypto';

const required = (name: string): string => {
  const value = process.env[name];
  if (value === undefined || value.length === 0) throw new Error(`${name} is required`);
  return value;
};
const digest = (value: string): string => createHash('sha256').update(value).digest('hex');
const phone = required('ADMIN_BOOTSTRAP_OWNER_PHONE');
if (!/^\+[1-9]\d{7,14}$/.test(phone)) throw new Error('ADMIN_BOOTSTRAP_OWNER_PHONE must be E.164');
const encryptionKey = Buffer.from(required('STAFF_AUTH_ENCRYPTION_KEY'), 'base64');
if (encryptionKey.length !== 32)
  throw new Error('STAFF_AUTH_ENCRYPTION_KEY must be 32 bytes in base64');
const iv = randomBytes(12);
const cipher = createCipheriv('aes-256-gcm', encryptionKey, iv);
const phoneCiphertext = Buffer.concat([cipher.update(phone, 'utf8'), cipher.final()]);
const phoneCipher = [iv, cipher.getAuthTag(), phoneCiphertext]
  .map((part) => part.toString('base64url'))
  .join('.');
const phoneHash = digest(`${required('STAFF_AUTH_PHONE_PEPPER')}:${phone}`);
const database = new PrismaClient({
  adapter: new PrismaPg({ connectionString: required('DATABASE_URL') }),
});
const inviteToken = randomBytes(32).toString('base64url');

async function main(): Promise<void> {
  try {
    const staff = await database.staffUser.upsert({
      where: { phoneHash },
      create: { phoneHash, phoneCipher, role: 'OWNER' },
      update: { isActive: true, role: 'OWNER' },
    });
    const existing = await database.staffInvite.findFirst({
      where: { staffId: staff.id, consumedAt: null, expiresAt: { gt: new Date() } },
    });
    if (existing !== null)
      throw new Error(
        'An active bootstrap invitation already exists; revoke it before issuing another.',
      );
    await database.staffInvite.create({
      data: {
        staffId: staff.id,
        tokenHash: digest(inviteToken),
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      },
    });
    process.stdout.write(`${inviteToken}\n`);
  } finally {
    await database.$disconnect();
  }
}

void main();
