// src/services/secretId.service.js
import { createHash } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generate secret ID in format: POLL-A-0001
 * @param {string} electionTitle - Election title for prefix
 * @param {number} sequenceNumber - Sequential number (1, 2, 3...)
 * @returns {string} Format: ELEC-0001
 */
export const generateSecretId = (electionTitle, sequenceNumber) => {
  // Get first 4 letters of election title, uppercase
  const prefix = electionTitle
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .substring(0, 4)
    .padEnd(4, 'X');

  // Pad sequence number to 4 digits
  const seq = String(sequenceNumber).padStart(4, '0');

  return `${prefix}-${seq}`;
};

/**
 * Hash secret ID for secure storage
 * @param {string} secretId - Plain secret ID
 * @param {string} salt - JWT secret as salt
 * @returns {string} SHA-256 hash
 */
export const hashSecretId = (secretId, salt = process.env.JWT_SECRET) => {
  return createHash('sha256')
    .update(secretId + salt)
    .digest('hex');
};

/**
 * Generate vote token from secret ID (used as anonymous vote identifier)
 * This is deterministic — same secret ID + election always produces same token
 * @param {string} secretId - Plain secret ID
 * @param {string} electionId - Election UUID
 * @param {string} salt - JWT secret as salt
 * @returns {string} Vote token (hex hash)
 */
export const generateVoteToken = (secretId, electionId, salt = process.env.JWT_SECRET) => {
  return createHash('sha256')
    .update(secretId + electionId + salt)
    .digest('hex');
};

/**
 * Verify secret ID against stored hash
 * @param {string} plainSecretId - Plain secret ID to verify
 * @param {string} storedHash - Stored hash from database
 * @param {string} salt - JWT secret as salt
 * @returns {boolean}
 */
export const verifySecretId = (plainSecretId, storedHash, salt = process.env.JWT_SECRET) => {
  const hash = hashSecretId(plainSecretId, salt);
  return hash === storedHash;
};
