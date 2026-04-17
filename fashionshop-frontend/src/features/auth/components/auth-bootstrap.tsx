'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../store';
import { hydrateSessionFromStorage } from '@/lib/auth/session';
import { setStoredSession } from '@/lib/auth/storage';
import { mockUser } from '@/data/mock-data';

const USE_MOCK = false;

function seedMockSession() {
  setStoredSession({
    accessToken: 'mock-jwt-token',
    refreshToken: 'mock-refresh-token',
    user: mockUser,
  });
}

export function AuthBootstrap() {
  const setSession = useAuthStore((state) => state.setSession);
  const setHydrated = useAuthStore((state) => state.setHydrated);

  useEffect(() => {
    // Seed a fake session when no real backend exists
    if (USE_MOCK) {
      const existing = hydrateSessionFromStorage();
      if (!existing) {
        seedMockSession();
      }
    }

    const session = hydrateSessionFromStorage();
    if (session) {
      setSession({
        accessToken: session.accessToken,
        user: session.user,
      });
    }
    setHydrated(true);
  }, [setHydrated, setSession]);

  return null;
}
