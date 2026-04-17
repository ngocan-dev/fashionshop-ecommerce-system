import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/features/orders/hooks', () => ({
  useMyOrdersQuery: () => ({ data: [], isLoading: false }),
}));

import OrdersPage from './page';

describe('OrdersPage', () => {
  it('renders the orders page empty state', () => {
    render(<OrdersPage />);
    expect(screen.getByText('No orders yet')).toBeInTheDocument();
  });
});
