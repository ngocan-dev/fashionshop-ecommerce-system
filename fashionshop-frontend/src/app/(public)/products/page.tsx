'use client';

import { useMemo, useState } from 'react';
import { ProductFilters } from '@/components/products/listing/product-filters';
import { ProductGrid } from '@/components/products/listing/product-grid';
import { ProductToolbar } from '@/components/products/listing/product-toolbar';
import type { ProductListingItem, ProductSortOption } from '@/components/products/listing/types';
import { useStoreProductsQuery } from '@/features/products/hooks';

function sortProducts(products: ProductListingItem[], sortBy: ProductSortOption) {
  const list = [...products];
  if (sortBy === 'Price: Low to High') return list.sort((a, b) => a.price - b.price);
  if (sortBy === 'Price: High to Low') return list.sort((a, b) => b.price - a.price);
  if (sortBy === 'Category') return list.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
  return list;
}

export default function ProductsPage() {
  const { data: storeProducts, isPending } = useStoreProductsQuery();

  const productCatalog: ProductListingItem[] = useMemo(() => {
    if (!storeProducts) return [];
    return storeProducts.map((item) => ({
      id: String(item.id),
      name: item.name,
      category: item.categoryName ?? 'Other',
      price: item.price,
      imageSrc: item.imageUrl ?? '/images/product-blazer.svg',
      imageAlt: item.name,
      color: 'black',
      size: 'M',
    }));
  }, [storeProducts]);

  const categories = useMemo(() => [...new Set(productCatalog.map((p) => p.category))], [productCatalog]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Products');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [priceRange, setPriceRange] = useState(2000);
  const [sortBy, setSortBy] = useState<ProductSortOption>('Newest Arrivals');
  const [visibleCount, setVisibleCount] = useState(6);

  const filteredProducts = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    const filtered = productCatalog.filter((product) => {
      const matchesSearch = !keyword || [product.name, product.category].some((v) => v.toLowerCase().includes(keyword));
      const matchesCategory = selectedCategory === 'All Products' || product.category === selectedCategory;
      const matchesPrice = product.price <= priceRange;
      return matchesSearch && matchesCategory && matchesPrice;
    });
    return sortProducts(filtered, sortBy);
  }, [priceRange, searchTerm, selectedCategory, sortBy, productCatalog]);

  const visibleProducts = useMemo(() => filteredProducts.slice(0, visibleCount), [filteredProducts, visibleCount]);
  const hasMore = visibleCount < filteredProducts.length;

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
              categories={categories}
              onCategoryChange={(value) => { setSelectedCategory(value); setVisibleCount(6); }}
              onSizeChange={(value) => { setSelectedSize(value); setVisibleCount(6); }}
              onColorChange={(value) => { setSelectedColor(value); setVisibleCount(6); }}
              onPriceChange={(value) => { setPriceRange(value); setVisibleCount(6); }}
            />
          </div>

          <section className="space-y-8 pt-1">
            <ProductToolbar
              searchTerm={searchTerm}
              resultCount={filteredProducts.length}
              sortBy={sortBy}
              onSearchChange={(value) => { setSearchTerm(value); setVisibleCount(6); }}
              onSortChange={(value) => { setSortBy(value); setVisibleCount(6); }}
            />

            {isPending ? (
              <div className="flex min-h-[20rem] items-center justify-center text-sm uppercase tracking-[0.22em] text-zinc-400">
                Loading products...
              </div>
            ) : filteredProducts.length > 0 ? (
              <ProductGrid
                products={visibleProducts}
                visibleCount={visibleCount}
                onLoadMore={() => setVisibleCount((c) => Math.min(c + 6, filteredProducts.length))}
                hasMore={hasMore}
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
