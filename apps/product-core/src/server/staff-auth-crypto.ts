import 'server-only';

import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';

const key = (): Buffer => {
  const value = process.env.STAFF_AUTH_ENCRYPTION_KEY;
  if (value === undefined) throw new Error('STAFF_AUTH_ENCRYPTION_KEY is required');
  const decoded = Buffer.from(value, 'base64');
  if (decoded.length !== 32)
    throw new Error('STAFF_AUTH_ENCRYPTION_KEY must be 32 bytes in base64');
  return decoded;
};

export const hashSecret = (value: string): string =>
  createHash('sha256').update(value).digest('hex');

export const hashPhone = (phone: string): string => {
  const pepper = process.env.STAFF_AUTH_PHONE_PEPPER;
  if (pepper === undefined || pepper.length < 32)
    throw new Error('STAFF_AUTH_PHONE_PEPPER is required');
  return hashSecret(`${pepper}:${phone}`);
};

export const encryptSecret = (value: string): string => {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key(), iv);
  const ciphertext = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  return [iv, cipher.getAuthTag(), ciphertext].map((part) => part.toString('base64url')).join('.');
};

export const decryptSecret = (value: string): string => {
  const [ivValue, tagValue, ciphertextValue] = value.split('.');
  if (ivValue === undefined || tagValue === undefined || ciphertextValue === undefined) {
    throw new Error('Encrypted value is malformed');
  }
  const decipher = createDecipheriv('aes-256-gcm', key(), Buffer.from(ivValue, 'base64url'));
  decipher.setAuthTag(Buffer.from(tagValue, 'base64url'));
  return Buffer.concat([
    decipher.update(Buffer.from(ciphertextValue, 'base64url')),
    decipher.final(),
  ]).toString('utf8');
};

export const randomToken = (bytes = 32): string => randomBytes(bytes).toString('base64url');

export const createRecoveryCodes = (): readonly string[] =>
  Array.from({ length: 8 }, () => {
    const value = randomBytes(8).toString('hex').toUpperCase();
    return value.match(/.{4}/g)?.join('-') ?? value;
  });

export const maskPhone = (phone: string): string =>
  phone.length < 7 ? '••••' : `${phone.slice(0, 3)}••••${phone.slice(-3)}`;
