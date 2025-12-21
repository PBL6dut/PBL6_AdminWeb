/**
 * Anonymous ID Management
 * Generates and stores unique ID for tracking AI searches
 */

const STORAGE_KEY = 'pbl6_anonymous_id';

/**
 * Generate or retrieve anonymous user ID
 * @returns {string} Anonymous ID
 */
export function getAnonymousId() {
  let anonymousId = localStorage.getItem(STORAGE_KEY);

  if (!anonymousId) {
    anonymousId = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(STORAGE_KEY, anonymousId);
  }

  return anonymousId;
}

/**
 * Clear anonymous ID (e.g., when user logs in)
 */
export function clearAnonymousId() {
  localStorage.removeItem(STORAGE_KEY);
}
