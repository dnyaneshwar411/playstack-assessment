import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);

const KEY_LENGTH = 64;
const SALT_LENGTH = 16;

export async function hashString(plainText: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH).toString('hex');
  const derivedKey = await scryptAsync(plainText, salt, KEY_LENGTH);
  return `${salt}:${(derivedKey as Buffer).toString('hex')}`;
}

export async function validateHash(plainText: string, storedHash: string): Promise<boolean> {
  const [salt, hash] = storedHash.split(':');
  if (!salt || !hash) return false;

  const derivedKey = await scryptAsync(plainText, salt, KEY_LENGTH);
  const currentHashBuffer = derivedKey as Buffer;
  const originalHashBuffer = Buffer.from(hash, 'hex');

  if (currentHashBuffer.length !== originalHashBuffer.length) {
    return false;
  }
  return timingSafeEqual(currentHashBuffer, originalHashBuffer);
}