import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;

const getSecretKey = (): Buffer => {
  const secret = process.env.JWT_SECRET || process.env.ENCRYPTION_KEY || 'default_ultra_secure_refayet_key_32bytes!!';
  return crypto.createHash('sha256').update(secret).digest();
};

/**
 * Encrypts any text using bank-grade AES-256-GCM algorithm with dynamic IV and Auth Tag
 */
export const encryptAES256 = (text: string): string => {
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = getSecretKey();
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag().toString('hex');
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  } catch (err) {
    console.error('AES-256 Encryption Error:', err);
    return text;
  }
};

/**
 * Decrypts AES-256-GCM cipher string back to original text
 */
export const decryptAES256 = (cipherText: string): string => {
  try {
    const parts = cipherText.split(':');
    if (parts.length !== 3) return cipherText; // Return original if not encrypted format

    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encryptedText = parts[2];
    const key = getSecretKey();

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    console.error('AES-256 Decryption Error:', err);
    return cipherText;
  }
};
