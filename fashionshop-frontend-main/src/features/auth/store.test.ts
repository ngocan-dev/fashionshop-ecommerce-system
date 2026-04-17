import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/auth/storage', () => ({
  clearStoredSession: vi.fn(),
  setStoredSession: vi.fn(),
}));

import { useAuthStore } from './store';

describe('auth store', () => {
  it('stores and clears the session', () => {
    useAuthStore.getState().setSession({
      accessToken: 'token',
      user: { id: '1', email: 'test@example.com', fullName: 'Test User', role: 'CUSTOMER' },
    });

    expect(useAuthStore.getState().token).toBe('token');
    useAuthStore.getState().clearSession();
    expect(useAuthStore.getState().token).toBeNull();
  });
});
