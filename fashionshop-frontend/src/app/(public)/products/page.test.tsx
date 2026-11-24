import { screen } from '@testing-library/react';
import { renderWithQueryClient as render } from '@/test/render';
import { describe, expect, it, vi } from 'vitest';
import { fetchStoreProducts } from '@/features/products/services';
import { fetchCategories } from '@/features/categories/services';

vi.mock('@/features/products/services', () => ({ fetchStoreProducts: vi.fn() }));
vi.mock('@/features/categories/services', () => ({ fetchCategories: vi.fn() }));

import ProductsPage from './page';

describe('ProductsPage', () => {
  it('renders products returned by the API and offers the next page', async () => {
    vi.mocked(fetchCategories).mockResolvedValue([]);
    vi.mocked(fetchStoreProducts).mockResolvedValue({
      items: [{ id: 1, name: 'Modular Tech Parka', price: 100, imageUrl: null,
        categoryName: 'Outerwear', shortDescription: null, inStock: true, productDetailUrl: '/products/1' }],
      page: 0, size: 20, totalItems: 21, totalPages: 2,
    });
    render(<ProductsPage />);

    expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
    expect(screen.getByText(/Results Found/i)).toBeInTheDocument();
    expect(await screen.findByText('Modular Tech Parka')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Load More Products' })).toBeInTheDocument();
    expect(fetchStoreProducts).toHaveBeenCalledWith(expect.objectContaining({ page: 0, size: 20 }));
  });
});
