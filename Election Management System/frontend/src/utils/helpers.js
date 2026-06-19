// src/utils/cn.js
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with proper override behavior
 * @param {...any} inputs - Class names to merge
 * @returns {string} Merged class string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to readable string
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date
 */
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Format date and time
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date and time
 */
export function formatDateTime(date) {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Check if date is in the future
 * @param {Date|string} date - Date to check
 * @returns {boolean}
 */
export function isFuture(date) {
  return new Date(date) > new Date();
}

/**
 * Check if date is in the past
 * @param {Date|string} date - Date to check
 * @returns {boolean}
 */
export function isPast(date) {
  return new Date(date) < new Date();
}

/**
 * Get time remaining text (e.g., "2 days, 3 hours")
 * @param {Date|string} endDate - End date
 * @returns {string} Time remaining text
 */
export function getTimeRemaining(endDate) {
  const now = new Date();
  const end = new Date(endDate);
  const diff = end - now;

  if (diff <= 0) return 'Ended';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
