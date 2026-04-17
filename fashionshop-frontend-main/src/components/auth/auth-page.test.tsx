import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: vi.fn(),
  }),
}));

import { AuthPage } from './auth-page';

describe('AuthPage', () => {
  it('renders the login form by default and switches tabs', async () => {
    const user = userEvent.setup();

    render(<AuthPage />);

    expect(screen.getByText('ACCOUNT')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.queryByText('Full Name')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Register' }));

    expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.queryByText('Google')).not.toBeInTheDocument();
    expect(screen.queryByText('Apple')).not.toBeInTheDocument();
  });

  it('shows validation errors for the login form', async () => {
    const user = userEvent.setup();

    render(<AuthPage />);

    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(screen.getByText('Email address is required.')).toBeInTheDocument();
    expect(screen.getByText('Password is required.')).toBeInTheDocument();
  });
});