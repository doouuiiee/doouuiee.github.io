// ============================================
// ENCRYPTION UTILITIES
// ============================================

const crypto = require('crypto');

// Encryption configuration
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const ITERATIONS = 100000;

// Get encryption key from environment or generate
const getEncryptionKey = () => {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    console.warn('⚠️  ENCRYPTION_KEY not set in environment. Using default (NOT SECURE FOR PRODUCTION)');
    return crypto.scryptSync('default-key-change-in-production', 'salt', KEY_LENGTH);
  }
  return crypto.scryptSync(key, 'salt', KEY_LENGTH);
};

const ENCRYPTION_KEY = getEncryptionKey();

/**
 * Encrypt sensitive data
 * @param {string} text - Plain text to encrypt
 * @returns {string} - Encrypted text with IV and auth tag
 */
function encrypt(text) {
  if (!text) return text;
  
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    // Return: iv:authTag:encryptedData
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Encryption failed');
  }
}

/**
 * Decrypt encrypted data
 * @param {string} encryptedText - Encrypted text with IV and auth tag
 * @returns {string} - Decrypted plain text
 */
function decrypt(encryptedText) {
  if (!encryptedText) return encryptedText;
  
  try {
    const parts = encryptedText.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Decryption failed');
  }
}

/**
 * Hash sensitive data (one-way)
 * @param {string} data - Data to hash
 * @returns {string} - Hashed data
 */
function hash(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Generate secure random token
 * @param {number} length - Token length in bytes
 * @returns {string} - Random token
 */
function generateToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Generate secure random password
 * @param {number} length - Password length
 * @returns {string} - Random password
 */
function generatePassword(length = 16) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  const randomBytes = crypto.randomBytes(length);
  
  for (let i = 0; i < length; i++) {
    password += charset[randomBytes[i] % charset.length];
  }
  
  return password;
}

/**
 * Encrypt object (for storing sensitive JSON data)
 * @param {object} obj - Object to encrypt
 * @returns {string} - Encrypted JSON string
 */
function encryptObject(obj) {
  const jsonString = JSON.stringify(obj);
  return encrypt(jsonString);
}

/**
 * Decrypt object
 * @param {string} encryptedString - Encrypted JSON string
 * @returns {object} - Decrypted object
 */
function decryptObject(encryptedString) {
  const jsonString = decrypt(encryptedString);
  return JSON.parse(jsonString);
}

/**
 * Encrypt file buffer
 * @param {Buffer} buffer - File buffer
 * @returns {object} - Encrypted buffer with metadata
 */
function encryptFile(buffer) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  
  const encrypted = Buffer.concat([
    cipher.update(buffer),
    cipher.final()
  ]);
  
  const authTag = cipher.getAuthTag();
  
  return {
    data: encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  };
}

/**
 * Decrypt file buffer
 * @param {object} encryptedFile - Encrypted file with metadata
 * @returns {Buffer} - Decrypted file buffer
 */
function decryptFile(encryptedFile) {
  const iv = Buffer.from(encryptedFile.iv, 'hex');
  const authTag = Buffer.from(encryptedFile.authTag, 'hex');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  decipher.setAuthTag(authTag);
  
  return Buffer.concat([
    decipher.update(encryptedFile.data),
    decipher.final()
  ]);
}

/**
 * Create HMAC signature
 * @param {string} data - Data to sign
 * @param {string} secret - Secret key
 * @returns {string} - HMAC signature
 */
function createSignature(data, secret = process.env.HMAC_SECRET) {
  return crypto.createHmac('sha256', secret || 'default-secret')
    .update(data)
    .digest('hex');
}

/**
 * Verify HMAC signature
 * @param {string} data - Original data
 * @param {string} signature - Signature to verify
 * @param {string} secret - Secret key
 * @returns {boolean} - True if valid
 */
function verifySignature(data, signature, secret = process.env.HMAC_SECRET) {
  const expectedSignature = createSignature(data, secret);
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * Mask sensitive data for display
 * @param {string} data - Data to mask
 * @param {number} visibleChars - Number of visible characters
 * @returns {string} - Masked data
 */
function maskData(data, visibleChars = 4) {
  if (!data || data.length <= visibleChars) return data;
  
  const visible = data.slice(-visibleChars);
  const masked = '*'.repeat(data.length - visibleChars);
  return masked + visible;
}

/**
 * Encrypt database field
 * @param {string} value - Value to encrypt
 * @returns {string} - Encrypted value for database storage
 */
function encryptDBField(value) {
  if (!value) return null;
  return encrypt(value);
}

/**
 * Decrypt database field
 * @param {string} encryptedValue - Encrypted value from database
 * @returns {string} - Decrypted value
 */
function decryptDBField(encryptedValue) {
  if (!encryptedValue) return null;
  try {
    return decrypt(encryptedValue);
  } catch (error) {
    console.error('Failed to decrypt database field');
    return null;
  }
}

/**
 * Generate API key
 * @returns {string} - API key
 */
function generateAPIKey() {
  const prefix = 'cccs';
  const key = generateToken(32);
  return `${prefix}_${key}`;
}

/**
 * Validate API key format
 * @param {string} apiKey - API key to validate
 * @returns {boolean} - True if valid format
 */
function validateAPIKeyFormat(apiKey) {
  return /^cccs_[a-f0-9]{64}$/.test(apiKey);
}

module.exports = {
  encrypt,
  decrypt,
  hash,
  generateToken,
  generatePassword,
  encryptObject,
  decryptObject,
  encryptFile,
  decryptFile,
  createSignature,
  verifySignature,
  maskData,
  encryptDBField,
  decryptDBField,
  generateAPIKey,
  validateAPIKeyFormat
};
