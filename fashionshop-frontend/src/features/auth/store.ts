'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import type { AuthSession } from '@/types/auth';
import type { AuthUser } from '@/types/common';
import { clearStoredSession, setStoredSession } from '@/lib/auth/storage';

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  hydrated: boolean;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
  setHydrated: (hydrated: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      hydrated: false,
      setSession: (session) => {
        setStoredSession({ accessToken: session.accessToken, refreshToken: session.refreshToken, user: session.user });
        set({ token: session.accessToken, user: session.user });
      },
      clearSession: () => {
        clearStoredSession();
        set({ token: null, user: null });
      },
      setHydrated: (hydrated) => set({ hydrated }),
    }),
    {
      name: 'fashionshop.auth.session',
      partialize: (state) => ({ token: state.token, user: state.user }),
    },
  ),
);

export function useAuthSession() {
  return useAuthStore(
    useShallow((state) => ({
      token: state.token,
      user: state.user,
      hydrated: state.hydrated,
    })),
  );
}

export function clearSessionAndRedirect(router?: { replace: (path: string) => void }) {
  useAuthStore.getState().clearSession();
  router?.replace('/login');
}
