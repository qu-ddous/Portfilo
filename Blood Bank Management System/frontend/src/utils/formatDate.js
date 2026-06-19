/**
 * formatDate.js — Date formatting utilities for BloodLink
 */

/**
 * Format a date to readable string e.g. "May 5, 2026"
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format a date to short form e.g. "05 May 2026"
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDateShort = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
};

/**
 * Format date + time e.g. "May 5, 2026 at 9:30 PM"
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDateTime = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get relative time e.g. "2 days ago"
 * @param {string|Date} date
 * @returns {string}
 */
export const formatRelativeTime = (date) => {
  if (!date) return '—';
  const now = new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 30) return `${diffDays} days ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

/**
 * Get days remaining until a future date
 * @param {string|Date} futureDate
 * @returns {number} positive = days remaining, negative = overdue
 */
export const daysUntil = (futureDate) => {
  if (!futureDate) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(futureDate);
  target.setHours(0, 0, 0, 0);
  const diffMs = target - now;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

/**
 * Format date into YYYY-MM-DD string for input[type=date]
 * @param {string|Date} date
 * @returns {string}
 */
export const toInputDate = (date) => {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
};
