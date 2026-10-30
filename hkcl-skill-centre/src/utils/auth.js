/**
 * AUTHENTICATION UTILITIES FOR ADMIN & STAFF PORTALS
 * ---------------------------------------------------------------------------
 * Provides isolated token and session management for:
 * 1. Admin accounts (`role: 'admin'`)
 * 2. Staff accounts (`role: 'staff'`)
 *
 * IMPORTANT: Normal student authentication is completely separate and remains
 * managed through AdmissionContext and Student Reference IDs.
 */

const ADMIN_TOKEN_KEY = 'hkcl_admin_jwt_token';
const ADMIN_USER_KEY = 'hkcl_admin_user_data';
const STAFF_TOKEN_KEY = 'hkcl_staff_jwt_token';
const STAFF_USER_KEY = 'hkcl_staff_user_data';

// --- ADMIN SESSION ---

export function getAdminToken() {
  try {
    return localStorage.getItem(ADMIN_TOKEN_KEY) || sessionStorage.getItem(ADMIN_TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

export function getAdminUser() {
  try {
    const raw = localStorage.getItem(ADMIN_USER_KEY) || sessionStorage.getItem(ADMIN_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAdminSession(token, adminData, remember = true) {
  try {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(ADMIN_TOKEN_KEY, token);
    storage.setItem(ADMIN_USER_KEY, JSON.stringify(adminData));
    // Clear other storage to avoid stale data
    const alt = remember ? sessionStorage : localStorage;
    alt.removeItem(ADMIN_TOKEN_KEY);
    alt.removeItem(ADMIN_USER_KEY);
  } catch (err) {
    console.warn('Storage error setting admin session:', err);
  }
}

export function clearAdminSession() {
  try {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    sessionStorage.removeItem(ADMIN_USER_KEY);
  } catch {}
}

export function isAdminAuthenticated() {
  const token = getAdminToken();
  const user = getAdminUser();
  return Boolean(token && user && user.role === 'admin');
}

// --- STAFF SESSION ---

export function getStaffToken() {
  try {
    return localStorage.getItem(STAFF_TOKEN_KEY) || sessionStorage.getItem(STAFF_TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

export function getStaffUser() {
  try {
    const raw = localStorage.getItem(STAFF_USER_KEY) || sessionStorage.getItem(STAFF_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStaffSession(token, staffData, remember = true) {
  try {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(STAFF_TOKEN_KEY, token);
    storage.setItem(STAFF_USER_KEY, JSON.stringify(staffData));
    const alt = remember ? sessionStorage : localStorage;
    alt.removeItem(STAFF_TOKEN_KEY);
    alt.removeItem(STAFF_USER_KEY);
  } catch (err) {
    console.warn('Storage error setting staff session:', err);
  }
}

export function clearStaffSession() {
  try {
    localStorage.removeItem(STAFF_TOKEN_KEY);
    localStorage.removeItem(STAFF_USER_KEY);
    sessionStorage.removeItem(STAFF_TOKEN_KEY);
    sessionStorage.removeItem(STAFF_USER_KEY);
    sessionStorage.removeItem('hkcl_staff_access_key');
  } catch {}
}

export function isStaffAuthenticated() {
  const token = getStaffToken();
  const user = getStaffUser();
  if (token && user && (user.role === 'staff' || user.role === 'admin')) {
    return true;
  }
  // Fallback for legacy access key
  return Boolean(sessionStorage.getItem('hkcl_staff_access_key'));
}

// Request header helpers
export function getAdminHeaders() {
  const token = getAdminToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export function getStaffHeaders() {
  const token = getStaffToken();
  const legacyKey = sessionStorage.getItem('hkcl_staff_access_key');
  const user = getStaffUser();

  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (legacyKey) {
    headers['x-staff-key'] = legacyKey;
  }
  if (user?.name) {
    headers['x-staff-name'] = user.name;
  }

  return headers;
}
