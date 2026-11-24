import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CheckoutSuccessPage from './page';

vi.mock('next/navigation', () => ({ useSearchParams: () => new URLSearchParams() }));

describe('CheckoutSuccessPage', () => {
  beforeEach(() => sessionStorage.clear());

  it('shows the stored order number without inventing a new identifier', () => {
    sessionStorage.setItem('lastOrder', JSON.stringify({ orderNumber: 'FS-123', items: [], subtotal: 0, shippingFee: 0, discount: 0, total: 0 }));
    render(<CheckoutSuccessPage />);
    expect(screen.getByText('#FS-123')).toBeInTheDocument();
    expect(screen.getByText('7–14 days after your order is placed')).toBeInTheDocument();
  });

  it('handles invalid stored JSON without crashing or inventing an order number', () => {
    sessionStorage.setItem('lastOrder', 'invalid json');
    render(<CheckoutSuccessPage />);
    expect(screen.getByText('#Unavailable')).toBeInTheDocument();
  });
});
