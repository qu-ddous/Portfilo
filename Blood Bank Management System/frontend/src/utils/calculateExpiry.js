/**
 * calculateExpiry.js — Blood expiry & eligibility date calculations
 */

/**
 * Calculate expiry date for blood: collection_date + 42 days
 * @param {string|Date} collectionDate
 * @returns {Date}
 */
export const calculateBloodExpiry = (collectionDate) => {
  const date = new Date(collectionDate);
  date.setDate(date.getDate() + 42);
  return date;
};

/**
 * Calculate next eligible donation date: last_donation + 90 days
 * @param {string|Date} lastDonationDate
 * @returns {Date}
 */
export const calculateNextEligibleDate = (lastDonationDate) => {
  const date = new Date(lastDonationDate);
  date.setDate(date.getDate() + 90);
  return date;
};

/**
 * Calculate blocked date after failed test: today + 30 days
 * @returns {Date}
 */
export const calculateTestFailBlockDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date;
};

/**
 * Calculate tattoo/piercing block: today + 180 days (6 months)
 * @returns {Date}
 */
export const calculateTattooBlockDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 180);
  return date;
};

/**
 * Check if blood unit is expired
 * @param {string|Date} expiryDate
 * @returns {boolean}
 */
export const isExpired = (expiryDate) => {
  if (!expiryDate) return false;
  return new Date(expiryDate) < new Date();
};

/**
 * Get days until expiry (negative = already expired)
 * @param {string|Date} expiryDate
 * @returns {number}
 */
export const daysUntilExpiry = (expiryDate) => {
  if (!expiryDate) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  return Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
};

/**
 * Check if donor is eligible to donate again
 * @param {string|Date} nextEligibleDate
 * @returns {boolean}
 */
export const isDonorEligible = (nextEligibleDate) => {
  if (!nextEligibleDate) return true;
  return new Date(nextEligibleDate) <= new Date();
};

/**
 * Get expiry status label and color
 * @param {string|Date} expiryDate
 * @returns {{ label: string, color: string }}
 */
export const getExpiryStatus = (expiryDate) => {
  const days = daysUntilExpiry(expiryDate);
  if (days === null) return { label: 'Unknown', color: 'neutral' };
  if (days < 0) return { label: 'Expired', color: 'danger' };
  if (days <= 5) return { label: `${days}d left`, color: 'danger' };
  if (days <= 14) return { label: `${days}d left`, color: 'warning' };
  return { label: `${days}d left`, color: 'success' };
};
