import { ProductCard } from './product-card';
import type { ProductListingItem } from './types';

type ProductGridProps = {
  products: ProductListingItem[];
  visibleCount: number;
  onLoadMore: () => void;
  hasMore: boolean;
};

export function ProductGrid({ products, visibleCount, onLoadMore, hasMore }: ProductGridProps) {
  const visibleProducts = products.slice(0, visibleCount);

  return (
    <div className="space-y-12">
      <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {hasMore ? (
        <div className="flex justify-center pb-8 pt-2">
          <button
            type="button"
            onClick={onLoadMore}
            className="h-12 min-w-[220px] border border-zinc-900 bg-zinc-950 px-6 text-xs font-semibold uppercase tracking-[0.3em] text-white transition duration-200 hover:-translate-y-0.5 hover:bg-zinc-800"
          >
            Load More Products
          </button>
        </div>
      ) : null}
    </div>
  );
}