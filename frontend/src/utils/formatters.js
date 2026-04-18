/**
 * utils/formatters.js
 *
 * Pure utility functions — no side-effects, no imports.
 * Keeps formatting logic out of components and easily unit-testable.
 */

'use strict';

/**
 * Format a numeric price to a localised currency string.
 *
 * @param {number|string} amount   Raw price value (e.g. 649, "649.00")
 * @param {string}        currency ISO 4217 currency code (default: "USD")
 * @param {string}        locale   BCP 47 locale tag (default: "en-US")
 * @returns {string}               Formatted string e.g. "$649.00"
 */
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  const n = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(n)) return '—';

  return new Intl.NumberFormat(locale, {
    style:                 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
};

/**
 * Truncate a string to a maximum character count, appending an ellipsis.
 *
 * @param {string} str    Source string
 * @param {number} limit  Maximum characters (default: 120)
 * @returns {string}
 */
export const truncate = (str, limit = 120) => {
  if (!str || str.length <= limit) return str ?? '';
  return str.slice(0, limit).trimEnd() + '…';
};

/**
 * Convert a category slug into a display-friendly label.
 * "knitwear" → "Knitwear" | "new-arrivals" → "New Arrivals"
 *
 * @param {string} slug
 * @returns {string}
 */
export const categoryLabel = (slug) => {
  if (!slug) return '';
  return slug
    .split(/[-_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Pad a product id into a display-friendly reference code.
 * 7 → "HX-0007"
 *
 * @param {number} id
 * @returns {string}
 */
export const productRef = (id) =>
  `HX-${String(id).padStart(4, '0')}`;
