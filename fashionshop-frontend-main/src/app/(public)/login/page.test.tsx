import { describe, expect, it, vi } from 'vitest';
import { redirect } from 'next/navigation';

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

import LoginPage from './page';

describe('LoginPage', () => {
  it('redirects to the combined auth page', () => {
    LoginPage();
    expect(redirect).toHaveBeenCalledWith('/auth');
  });
});
