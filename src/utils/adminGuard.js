import { ADMIN_EMAIL } from './wallet.js';

export const PRIMARY_ADMIN_EMAIL = ADMIN_EMAIL || 'thaitraicau123@gmail.com';
export const ADMIN_MASTER_PASSWORD = 'Caypiece123!';
export const ADMIN_AUTH_SESSION_KEY = 'onthi_admin_session_auth_v1';

/**
 * Check if the active browser session has been authenticated via secret password
 */
export function isAdminSessionAuthenticated() {
  try {
    if (typeof sessionStorage !== 'undefined') {
      const sAuth = sessionStorage.getItem(ADMIN_AUTH_SESSION_KEY);
      if (sAuth === 'true') return true;
    }
    if (typeof localStorage !== 'undefined') {
      const lAuth = localStorage.getItem(ADMIN_AUTH_SESSION_KEY);
      if (lAuth === 'true') return true;
    }
  } catch (e) {}
  return false;
}

/**
 * Verify secret password (Caypiece123!) to grant admin session
 */
export function verifyAdminPassword(inputPassword) {
  if (!inputPassword || typeof inputPassword !== 'string') return false;
  const isMatch = inputPassword.trim() === ADMIN_MASTER_PASSWORD;
  if (isMatch) {
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(ADMIN_AUTH_SESSION_KEY, 'true');
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(ADMIN_AUTH_SESSION_KEY, 'true');
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('onthi-admin-auth-change', { detail: { authenticated: true } }));
      }
    } catch (e) {}
    return true;
  }
  return false;
}

/**
 * Clear admin authenticated session and lock admin window
 */
export function logoutAdminSession() {
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(ADMIN_AUTH_SESSION_KEY);
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(ADMIN_AUTH_SESSION_KEY);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('onthi-admin-auth-change', { detail: { authenticated: false } }));
    }
  } catch (e) {}
}

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
 * Strict Admin check - verifies either active authenticated session or authorized admin account
 */
export function isUserAdmin(user) {
  if (isAdminSessionAuthenticated()) return true;
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
