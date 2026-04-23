'use client';

import { useMemo, useState } from 'react';
import { ProductFilters } from '@/components/products/listing/product-filters';
import { ProductGrid } from '@/components/products/listing/product-grid';
import { ProductToolbar } from '@/components/products/listing/product-toolbar';
import type { ProductListingItem, ProductSortOption } from '@/components/products/listing/types';
import { useStoreProductsQuery } from '@/features/products/hooks';
import { useCategoriesQuery } from '@/features/categories/hooks';

function sortProducts(products: ProductListingItem[], sortBy: ProductSortOption) {
  const list = [...products];
  if (sortBy === 'Price: Low to High') return list.sort((a, b) => a.price - b.price);
  if (sortBy === 'Price: High to Low') return list.sort((a, b) => b.price - a.price);
  if (sortBy === 'Category') return list.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
  return list;
}

export default function ProductsPage() {
  const PAGE_SIZE = 20;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Products');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<ProductSortOption>('Newest Arrivals');
  const categoriesQuery = useCategoriesQuery();

  const selectedCategoryId = useMemo(() => {
    if (selectedCategory === 'All Products') return undefined;
    const matched = categoriesQuery.data?.find((category) => category.name === selectedCategory);
    return matched ? Number(matched.id) : undefined;
  }, [categoriesQuery.data, selectedCategory]);

  const {
    data: storeProducts,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useStoreProductsQuery({
    keyword: searchTerm.trim() || undefined,
    categoryId: selectedCategoryId,
    size: PAGE_SIZE,
  });

  const storeItems = useMemo(
    () => storeProducts?.pages.flatMap((page) => page.items) ?? [],
    [storeProducts],
  );

  const totalResults = storeProducts?.pages[0]?.totalItems ?? 0;

  const productCatalog: ProductListingItem[] = useMemo(() => {
    return storeItems.map((item) => ({
      id: String(item.id),
      name: item.name,
      category: item.categoryName ?? 'Other',
      price: item.price,
      imageSrc: item.imageUrl ?? '/images/product-blazer.svg',
      imageAlt: item.name,
    }));
  }, [storeItems]);

  const maxAvailablePrice = useMemo(() => {
    const prices = productCatalog
      .map((product) => product.price)
      .filter((price) => Number.isFinite(price));

    if (prices.length === 0) return 2000;
    return Math.max(...prices);
  }, [productCatalog]);

  const categories = useMemo(
    () => categoriesQuery.data?.map((category) => category.name) ?? [...new Set(productCatalog.map((p) => p.category))],
    [categoriesQuery.data, productCatalog],
  );

  const filteredProducts = useMemo(() => {
    const filtered = productCatalog.filter((product) => {
      const matchesPrice = priceRange == null || !Number.isFinite(product.price) || product.price <= priceRange;
      return matchesPrice;
    });
    return sortProducts(filtered, sortBy);
  }, [priceRange, sortBy, productCatalog]);

  const resultCount = priceRange == null ? totalResults : filteredProducts.length;

  return (
    <main className="min-h-screen bg-[#f6f6f3] text-zinc-900">
      <div className="mx-auto max-w-[1520px] px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-12">
          <div className="lg:sticky lg:top-8 lg:self-start">
            <ProductFilters
              selectedCategory={selectedCategory}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              priceRange={priceRange}
              maxPrice={maxAvailablePrice}
              categories={categories}
              onCategoryChange={setSelectedCategory}
              onSizeChange={setSelectedSize}
              onColorChange={setSelectedColor}
              onPriceChange={setPriceRange}
            />
          </div>

          <section className="space-y-8 pt-1">
            <ProductToolbar
              searchTerm={searchTerm}
              resultCount={resultCount}
              sortBy={sortBy}
              onSearchChange={setSearchTerm}
              onSortChange={setSortBy}
            />

            {isPending ? (
              <div className="flex min-h-[20rem] items-center justify-center text-sm uppercase tracking-[0.22em] text-zinc-400">
                Loading products...
              </div>
            ) : filteredProducts.length > 0 ? (
              <ProductGrid
                products={filteredProducts}
                visibleCount={filteredProducts.length}
                onLoadMore={() => fetchNextPage()}
                hasMore={Boolean(hasNextPage)}
                isLoadingMore={isFetchingNextPage}
              />
            ) : (
              <div className="flex min-h-[20rem] items-center justify-center border border-dashed border-zinc-300 bg-white/60 text-sm uppercase tracking-[0.22em] text-zinc-400">
                No products match the current filters.
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
