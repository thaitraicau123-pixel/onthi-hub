import { ADMIN_EMAIL } from './wallet';

export const PRIMARY_ADMIN_EMAIL = ADMIN_EMAIL || 'thaitraicau123@gmail.com';

/**
 * Get active Admin email
 */
export function getAdminEmail() {
  const envEmail = import.meta.env?.VITE_ADMIN_EMAIL;
  if (envEmail && typeof envEmail === 'string' && envEmail.trim()) {
    return envEmail.trim().toLowerCase();
  }
  return PRIMARY_ADMIN_EMAIL.toLowerCase().trim();
}

/**
 * Strict Admin check - ONLY 1 authorized account can access Admin Portal
 */
export function isUserAdmin(user) {
  if (!user || !user.email) return false;
  const currentEmail = String(user.email).trim().toLowerCase();
  const targetAdminEmail = getAdminEmail();
  return currentEmail === targetAdminEmail;
}

/**
 * Mask sensitive API Key for UI display (e.g., AIzaSy... -> AIzaSy••••••••11VUA)
 */
export function maskApiKey(key) {
  if (!key || typeof key !== 'string') return '';
  const trimmed = key.trim();
  if (trimmed.length <= 10) return '••••••••••••';
  const prefix = trimmed.slice(0, 7);
  const suffix = trimmed.slice(-4);
  return `${prefix}••••••••••••••••${suffix}`;
}
