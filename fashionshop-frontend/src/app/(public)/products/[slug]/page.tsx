'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Heart, ShoppingCart, ArrowLeft } from 'lucide-react';
import { EmptyState } from '@/components/common/empty-state';
import { LoadingState } from '@/components/common/loading-state';
import { Button } from '@/components/ui/button';
import { useStoreProductQuery } from '@/features/products/hooks';
import { useAddCartItemMutation } from '@/features/cart/hooks';
import { useAddWishlistItemMutation } from '@/features/wishlist/hooks';
import { useState } from 'react';

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const { data, isPending, isError } = useStoreProductQuery(params.slug);
  const addToCart = useAddCartItemMutation();
  const addToWishlist = useAddWishlistItemMutation();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  if (isPending)
    return (
      <main className="mx-auto min-h-screen max-w-7xl px-6 py-10 md:px-12 lg:px-24 lg:py-14">
        <LoadingState label="Loading product" />
      </main>
    );

  if (isError || !data)
    return (
      <main className="mx-auto min-h-screen max-w-7xl px-6 py-10 md:px-12 lg:px-24 lg:py-14">
        <EmptyState
          title="Product unavailable"
          description="The requested product could not be loaded."
          actionLabel="Browse products"
          actionHref="/products"
        />
      </main>
    );

  const product = data;

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-10 font-body text-[#1a1c1c] md:px-12 lg:px-24 lg:py-14">
      {/* Back link */}
      <Link
        href="/products"
        className="mb-10 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#777777] transition-opacity hover:opacity-60"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Shop
      </Link>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Product Image */}
        <div className="overflow-hidden rounded-xl bg-[#f3f3f4]">
          <div className="aspect-[4/5]">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[0].url}
                alt={product.images[0].alt ?? product.name}
                width={600}
                height={750}
                className="h-full w-full object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-6xl font-black uppercase text-[#c6c6c6]">
                {product.name.charAt(0)}
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center">
          <span className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[#777777]">
            {product.categoryName ?? 'Fashion'}
          </span>

          <h1 className="font-headline mb-4 text-4xl font-black uppercase tracking-[-0.04em] md:text-5xl">
            {product.name}
          </h1>

          <div className="mb-6 flex items-baseline gap-4">
            <span className="font-headline text-3xl font-black">${product.price.toFixed(2)}</span>
            {product.compareAtPrice && (
              <span className="text-lg text-[#777777] line-through">${product.compareAtPrice.toFixed(2)}</span>
            )}
          </div>

          {product.description && (
            <p className="mb-8 max-w-lg text-sm leading-relaxed text-[#5e5e5e]">{product.description}</p>
          )}

          {/* Color selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[#777777]">Color</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`rounded-md border px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] transition-all ${selectedColor === color ? 'border-black bg-black !text-white' : 'border-[#e6e6e6] bg-white text-[#1a1c1c] hover:border-[#999]'}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-8">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[#777777]">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`h-11 w-11 rounded-md border text-xs font-bold uppercase tracking-[0.16em] transition-all ${selectedSize === size ? 'border-black bg-black !text-white' : 'border-[#e6e6e6] bg-white text-[#1a1c1c] hover:border-[#999]'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock indicator */}
          <p className="mb-8 text-[10px] font-bold uppercase tracking-[0.3em] text-[#777777]">
            {(product.stockQuantity ?? 0) > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
          </p>

          {/* Action buttons */}
          <div className="space-y-3">
            <Button
              type="button"
              className="h-14 w-full rounded-md bg-black text-sm font-bold uppercase tracking-[0.24em] !text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#474747] active:scale-95"
              disabled={(product.stockQuantity ?? 0) === 0}
                onClick={() => {
                addToCart.mutate(
                  { productId: Number(product.id), quantity: 1 },
                  { onSuccess: () => toast.success('Added to cart') },
                );
              }}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-14 w-full rounded-md border-[#1a1c1c] text-sm font-bold uppercase tracking-[0.24em] text-[#1a1c1c] transition-all duration-200 hover:bg-[#1a1c1c] hover:!text-white"
              onClick={() => {
                addToWishlist.mutate(Number(product.id), {
                  onSuccess: () => toast.success('Added to wishlist'),
                });
              }}
            >
              <Heart className="mr-2 h-4 w-4" />
              Add to Wishlist
            </Button>
          </div>

          {/* Product meta */}
          <div className="mt-12 space-y-4 border-t border-[#efefef] pt-8">
            <div className="flex justify-between text-sm">
              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#777777]">Category</span>
              <span className="font-medium">{product.categoryName ?? 'Uncategorized'}</span>
            </div>
            {product.slug && (
              <div className="flex justify-between text-sm">
                <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#777777]">SKU</span>
                <span className="font-medium uppercase">{product.slug}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
