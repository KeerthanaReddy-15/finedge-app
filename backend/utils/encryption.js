import crypto from 'crypto';

// Use a 32-byte key for AES-256-CBC. In production, this MUST come from process.env.ENCRYPTION_KEY
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'finedge_super_secret_key_32_bytes_long_!!'; // Must be 32 bytes
const IV_LENGTH = 16; // For AES, this is always 16

const ensure32ByteKey = (key) => {
    return crypto.createHash('sha256').update(String(key)).digest('base64').substring(0, 32);
};

export const encryptData = (text) => {
    if (!text) return text;
    try {
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ensure32ByteKey(ENCRYPTION_KEY)), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    } catch (err) {
        console.error('Encryption failed:', err);
        return text;
    }
};

export const decryptData = (text) => {
    if (!text || !text.includes(':')) return text; // Not encrypted
    try {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ensure32ByteKey(ENCRYPTION_KEY)), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (err) {
        console.error('Decryption failed:', err);
        return text; // Return original if decryption fails
    }
};
