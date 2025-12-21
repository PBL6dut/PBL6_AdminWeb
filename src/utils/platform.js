/**
 * Platform Detection Utility
 * Detects if user is on web/mobile/tablet
 */

/**
 * Detect user platform
 * @returns {'web' | 'mobile' | 'tablet'}
 */
export function detectPlatform() {
  const ua = navigator.userAgent || navigator.vendor || window.opera;

  // Check for mobile
  if (/android/i.test(ua)) {
    return /mobile/i.test(ua) ? 'mobile' : 'tablet';
  }

  if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
    return /iPad/.test(ua) ? 'tablet' : 'mobile';
  }

  // Default to web
  return 'web';
}
