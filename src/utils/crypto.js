const crypto = require('crypto');
const bcrypt = require('bcryptjs');

/**
 * Generate a random string
 * @param {number} length - Length of the string
 * @returns {string} Random string
 */
const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Generate a secure token
 * @param {number} length - Length of the token
 * @returns {string} Secure token
 */
const generateSecureToken = (length = 32) => {
  return crypto.randomBytes(length).toString('base64url');
};

/**
 * Hash a password
 * @param {string} password - Plain text password
 * @param {number} saltRounds - Number of salt rounds
 * @returns {Promise<string>} Hashed password
 */
const hashPassword = async (password, saltRounds = 12) => {
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(password, salt);
};

/**
 * Compare password with hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} Match result
 */
const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

/**
 * Generate OTP (One Time Password)
 * @param {number} length - Length of OTP
 * @returns {string} OTP
 */
const generateOTP = (length = 6) => {
  const digits = '0123456789';
  let otp = '';

  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }

  return otp;
};

/**
 * Generate UUID v4
 * @returns {string} UUID
 */
const generateUUID = () => {
  return crypto.randomUUID();
};

/**
 * Hash data using SHA256
 * @param {string} data - Data to hash
 * @returns {string} Hashed data
 */
const hashSHA256 = data => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

/**
 * Create HMAC signature
 * @param {string} data - Data to sign
 * @param {string} secret - Secret key
 * @returns {string} HMAC signature
 */
const createHMAC = (data, secret) => {
  return crypto.createHmac('sha256', secret).update(data).digest('hex');
};

/**
 * Verify HMAC signature
 * @param {string} data - Original data
 * @param {string} signature - Signature to verify
 * @param {string} secret - Secret key
 * @returns {boolean} Verification result
 */
const verifyHMAC = (data, signature, secret) => {
  const expectedSignature = createHMAC(data, secret);
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
};

/**
 * Encrypt data using AES-256-GCM
 * @param {string} text - Text to encrypt
 * @param {string} key - Encryption key
 * @returns {object} Encrypted data with IV and tag
 */
const encrypt = (text, key) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher('aes-256-gcm', key);
  cipher.setAAD(Buffer.from('additional data'));

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const tag = cipher.getAuthTag();

  return {
    encrypted,
    iv: iv.toString('hex'),
    tag: tag.toString('hex')
  };
};

/**
 * Decrypt data using AES-256-GCM
 * @param {object} encryptedData - Encrypted data object
 * @param {string} key - Decryption key
 * @returns {string} Decrypted text
 */
const decrypt = (encryptedData, key) => {
  const { encrypted, tag } = encryptedData;

  const decipher = crypto.createDecipher('aes-256-gcm', key);
  decipher.setAAD(Buffer.from('additional data'));
  decipher.setAuthTag(Buffer.from(tag, 'hex'));

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};

module.exports = {
  generateRandomString,
  generateSecureToken,
  hashPassword,
  comparePassword,
  generateOTP,
  generateUUID,
  hashSHA256,
  createHMAC,
  verifyHMAC,
  encrypt,
  decrypt
};
