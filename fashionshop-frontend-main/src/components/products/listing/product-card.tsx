import Link from 'next/link';
import type { ProductListingItem } from './types';

function formatPrice(value: number) {
  return `$${value.toLocaleString()}`;
}

export function ProductCard({ product }: { product: ProductListingItem }) {
  return (
    <Link href={`/products/${product.id}`} className="block">
      <article className="group">
        <div className="overflow-hidden bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.05)] transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
          <div className="aspect-[4/5] bg-zinc-100">
            <img
              src={product.imageSrc}
              alt={product.imageAlt}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
              loading="lazy"
            />
          </div>
        </div>

        <div className="mt-3 space-y-1.5">
          <div className="flex items-start justify-between gap-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-zinc-400">{product.category}</p>
            <span className="whitespace-nowrap text-sm font-semibold text-zinc-800">{formatPrice(product.price)}</span>
          </div>
          <h3 className="max-w-[14rem] text-[0.95rem] font-semibold uppercase leading-[1.08] tracking-[0.04em] text-zinc-900">
            {product.name}
          </h3>
        </div>
      </article>
    </Link>
  );
}