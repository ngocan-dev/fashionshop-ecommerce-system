import { clearStoredSession, getStoredRoleFromCookie, getStoredTokenFromCookie, getStoredUser, setStoredSession, type StoredAuthSession } from '@/lib/auth/storage';

export function hydrateSessionFromStorage(): StoredAuthSession | null {
  const token = getStoredTokenFromCookie();
  const role = getStoredRoleFromCookie();
  const user = getStoredUser();

  if (!token || !role || !user) return null;

  return {
    accessToken: token,
    user,
  };
}

export { clearStoredSession, setStoredSession };
