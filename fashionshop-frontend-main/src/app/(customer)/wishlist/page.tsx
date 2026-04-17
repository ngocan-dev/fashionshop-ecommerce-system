'use client';

import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { Heart, Trash2 } from 'lucide-react';
import { EmptyState } from '@/components/common/empty-state';
import { LoadingState } from '@/components/common/loading-state';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useDeleteWishlistItemMutation, useWishlistQuery } from '@/features/wishlist/hooks';
import { useState } from 'react';

export default function WishlistPage() {
  const wishlistQuery = useWishlistQuery();
  const deleteMutation = useDeleteWishlistItemMutation();
  const [confirmProductId, setConfirmProductId] = useState<number | null>(null);

  if (wishlistQuery.isPending) return <LoadingState label="Loading wishlist" />;
  if (!wishlistQuery.data || wishlistQuery.data.length === 0)
    return (
      <EmptyState
        title="Wishlist is empty"
        description="Save products you want to revisit later."
        actionLabel="Browse products"
        actionHref="/products"
        icon={<Heart className="h-5 w-5" />}
      />
    );

  const items = wishlistQuery.data;

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-10 font-body text-[#1a1c1c] md:px-12 lg:px-24 lg:py-14">
      <header className="mb-16">
        <h1 className="font-headline mb-4 text-5xl font-black uppercase tracking-[-0.06em] md:text-7xl">Wishlist.</h1>
        <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#5e5e5e]">
          {items.length} Saved Item{items.length !== 1 ? 's' : ''}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <Card key={item.productId} className="group overflow-hidden rounded-xl border-[#c6c6c633] bg-white">
            <Link href={`/products/${item.productId}`}>
              <div className="aspect-[4/5] overflow-hidden bg-[#f3f3f4]">
                {item.imageUrl ? (
                  <Image
                    alt={item.productName}
                    src={item.imageUrl}
                    width={400}
                    height={500}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl font-black uppercase text-[#c6c6c6]">
                    {item.productName.charAt(0)}
                  </div>
                )}
              </div>
            </Link>
            <CardContent className="space-y-4 p-6">
              <div>
                <h3 className="font-headline text-lg font-bold tracking-tight">{item.productName}</h3>
                <p className="mt-1 font-headline text-base font-bold">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex gap-3">
                <Button asChild className="flex-1 rounded-md bg-black text-xs font-bold uppercase tracking-[0.24em] !text-white hover:bg-[#474747]">
                  <Link href={`/products/${item.productId}`}>View Product</Link>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-11 w-11 shrink-0 rounded-md border-[#e6e6e6] hover:border-red-300 hover:text-red-600"
                  onClick={() => setConfirmProductId(item.productId)}
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Link
          href="/products"
          className="inline-block border-b-2 border-black pb-2 text-sm font-bold uppercase tracking-[0.24em] transition-opacity hover:opacity-50"
        >
          Continue Shopping
        </Link>
      </div>

      <ConfirmDialog
        open={Boolean(confirmProductId)}
        title="Remove from wishlist?"
        description="This item will be removed from your saved products."
        confirmLabel="Remove"
        destructive
        onOpenChange={(open) => !open && setConfirmProductId(null)}
        onConfirm={() => {
          if (!confirmProductId) return;
          deleteMutation.mutate(confirmProductId, { onSuccess: () => toast.success('Removed from wishlist') });
          setConfirmProductId(null);
        }}
      />
    </main>
  );
}
