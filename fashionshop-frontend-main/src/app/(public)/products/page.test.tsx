import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ProductsPage from './page';

describe('ProductsPage', () => {
  it('renders the product listing page', () => {
    render(<ProductsPage />);

    expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
    expect(screen.getByText(/Results Found/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Load More Products' })).toBeInTheDocument();
    expect(screen.getByText('Modular Tech Parka')).toBeInTheDocument();
  });
});
