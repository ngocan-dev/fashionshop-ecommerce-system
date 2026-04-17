import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AccountMenu } from './account-menu';

const customerMenuItems = [
  { label: 'Profile', href: '/account', testId: 'customer-menu-profile' },
  { label: 'Cart', href: '/cart', testId: 'customer-menu-cart' },
  { label: 'Wishlist', href: '/wishlist', testId: 'customer-menu-wishlist' },
  { label: 'Order', href: '/orders', testId: 'customer-menu-order' },
] as const;

vi.mock('next/link', () => ({
  default: ({ href, children, onClick, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: ReactNode }) => (
    <a
      href={href}
      onClick={(event) => {
        event.preventDefault();
        onClick?.(event);
      }}
      {...props}
    >
      {children}
    </a>
  ),
}));

describe('AccountMenu', () => {
  const onLogout = vi.fn();

  beforeEach(() => {
    onLogout.mockReset();
  });

  it('renders the customer menu, shows all items, supports each menu action, and logs out correctly', async () => {
    const user = userEvent.setup();
    const openMenu = () => user.click(screen.getByRole('button', { name: 'Open account menu' }));

    render(<AccountMenu isLoggedIn onLogout={onLogout} />);

    await openMenu();

    expect(screen.getByTestId('customer-menu')).toBeInTheDocument();

    const logoutItem = screen.getByTestId('customer-menu-logout');

    for (const item of customerMenuItems) {
      const menuItem = screen.getByTestId(item.testId);

      expect(menuItem).toBeVisible();
      expect(menuItem).toHaveTextContent(item.label);
      expect(menuItem).toHaveAttribute('href', item.href);
    }

    expect(logoutItem).toBeVisible();
    expect(logoutItem).toHaveTextContent('Logout');

    for (const item of customerMenuItems) {
      await user.click(screen.getByTestId(item.testId));
      expect(screen.queryByTestId('customer-menu')).not.toBeInTheDocument();
      await openMenu();
    }

    await user.click(screen.getByTestId('customer-menu-logout'));

    expect(onLogout).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId('customer-menu')).not.toBeInTheDocument();
  });
});
