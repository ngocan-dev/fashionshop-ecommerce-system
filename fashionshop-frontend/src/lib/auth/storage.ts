import type { Role } from '@/lib/constants/roles';

const TOKEN_KEY = 'fashionshop.token';
const REFRESH_TOKEN_KEY = 'fashionshop.refresh-token';
const ROLE_KEY = 'fashionshop.role';
const USER_KEY = 'fashionshop.user';

function setCookie(name: string, value: string, maxAgeSeconds = 60 * 60 * 24 * 7) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; samesite=lax`;
}

function deleteCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
}

export type StoredAuthUser = {
  id: string;
  email: string;
  fullName: string;
  role: Role;
};

export type StoredAuthSession = {
  accessToken: string;
  refreshToken?: string;
  user: StoredAuthUser;
};

export function getStoredToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function getStoredRole(): Role | null {
  if (typeof window === 'undefined') return null;
  const value = window.localStorage.getItem(ROLE_KEY);
  return value as Role | null;
}

export function getStoredUser() {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as StoredAuthUser) : null;
}

export function setStoredSession(session: StoredAuthSession) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(TOKEN_KEY, session.accessToken);
  window.localStorage.setItem(ROLE_KEY, session.user.role);
  window.localStorage.setItem(USER_KEY, JSON.stringify(session.user));
  if (session.refreshToken) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
  }
  setCookie(TOKEN_KEY, session.accessToken);
  setCookie(ROLE_KEY, session.user.role);
}

export function clearStoredSession() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    window.localStorage.removeItem(ROLE_KEY);
    window.localStorage.removeItem(USER_KEY);
  }
  deleteCookie(TOKEN_KEY);
  deleteCookie(ROLE_KEY);
}

export function getCookieValue(name: string) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function getStoredTokenFromCookie() {
  return getCookieValue(TOKEN_KEY);
}

export function getStoredRoleFromCookie() {
  return getCookieValue(ROLE_KEY) as Role | null;
}
