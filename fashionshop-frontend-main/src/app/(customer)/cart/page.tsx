'use client';

import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { EmptyState } from '@/components/common/empty-state';
import { LoadingState } from '@/components/common/loading-state';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useCartQuery, useDeleteCartItemMutation, useUpdateCartItemQuantityMutation } from '@/features/cart/hooks';
import { useState } from 'react';

export default function CartPage() {
  const cartQuery = useCartQuery();
  const [confirmItemId, setConfirmItemId] = useState<number | null>(null);
  const deleteMutation = useDeleteCartItemMutation();
  const quantityMutation = useUpdateCartItemQuantityMutation();
  const hasBackendError = cartQuery.isError;

  // Show loading state
  if (cartQuery.isPending) {
    return <LoadingState />;
  }

  if (!hasBackendError && (!cartQuery.data || cartQuery.data.items.length === 0)) {
    return (
      <EmptyState
        title="Cart is empty"
        description="Add products from the catalog to begin checkout."
        actionLabel="Browse products"
        actionHref="/products"
        icon={<ShoppingCart className="h-5 w-5" />}
      />
    );
  }

  const cart = cartQuery.data ?? { items: [], totalPrice: 0, cartId: 0, totalItems: 0, distinctItemCount: 0, empty: true };

  const itemCount = cart.items.length;
  const subtotal = cart.totalPrice;
  const tax = subtotal * 0.08; // Estimated 8% tax
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + tax + shipping;

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-10 font-body text-[#1a1c1c] md:px-12 lg:px-24 lg:py-14">
      <header className="mb-16">
        <h1 className="font-headline mb-4 text-5xl font-black uppercase tracking-[-0.06em] md:text-7xl">Your Bag</h1>
        <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#5e5e5e]">
          {itemCount} Item{itemCount !== 1 ? 's' : ''} Selected{shipping === 0 ? ' — Complimentary Shipping Applied' : ''}
        </p>
        {hasBackendError && (
          <div className="mt-4 rounded-lg bg-[#f3f3f4] p-4 text-sm text-[#7a7a7a]">
            Unable to load cart data. Showing layout while content is unavailable.
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          {hasBackendError && cart.items.length === 0 &&
            [...Array(3)].map((_, i) => (
              <Card key={`skeleton-${i}`} className="rounded-lg border-0 bg-[#f3f3f4]">
                <CardContent className="flex gap-4 p-4">
                  <div className="h-24 w-24 rounded bg-[#e8e8e8]"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-32 rounded bg-[#e8e8e8]"></div>
                    <div className="h-4 w-24 rounded bg-[#e8e8e8]"></div>
                    <div className="h-6 w-20 rounded bg-[#e8e8e8]"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          {cart.items.map((item) => (
            <Card key={item.itemId} className="group rounded-xl border-[#c6c6c633] bg-white">
              <CardContent className="flex flex-col gap-8 p-6 md:flex-row">
                <div className="aspect-[4/5] w-full flex-shrink-0 overflow-hidden bg-[#f3f3f4] md:w-48">
                  {item.productImage ? (
                    <Image
                      alt={item.productName}
                      src={item.productImage}
                      width={192}
                      height={240}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#f3f3f4] text-4xl font-black uppercase">
                      {item.productName.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between py-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-headline text-2xl font-bold tracking-tight">{item.productName}</h3>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-[#777777]">
                        Studio Essential
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        if (hasBackendError) {
                          toast.info('Cart data is unavailable right now.');
                          return;
                        }
                        setConfirmItemId(item.itemId);
                      }}
                      className="hover:text-red-600 transition-colors ml-4"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-8 flex items-end justify-between">
                    <div className="flex items-center space-x-6 rounded-md bg-[#f3f3f4] px-4 py-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (hasBackendError) {
                            toast.info('Cart data is unavailable right now.');
                            return;
                          }
                          quantityMutation.mutate({ itemId: item.itemId, quantity: Math.max(1, item.quantity - 1) });
                        }}
                        className="h-auto rounded-md p-1 hover:opacity-50"
                        aria-label="Decrease quantity"
                      >
                        <span className="material-symbols-outlined text-sm">remove</span>
                      </Button>
                      <span className="w-8 text-center text-sm font-bold tabular-nums">{item.quantity.toString().padStart(2, '0')}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (hasBackendError) {
                            toast.info('Cart data is unavailable right now.');
                            return;
                          }
                          quantityMutation.mutate({ itemId: item.itemId, quantity: item.quantity + 1 });
                        }}
                        className="h-auto rounded-md p-1 hover:opacity-50"
                        aria-label="Increase quantity"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                      </Button>
                    </div>
                    <div className="font-headline text-xl font-bold">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-start">
            <Link href="/products">
              <button className="border-b border-black pb-1 text-xs font-bold uppercase tracking-[0.24em] transition-opacity hover:opacity-60">
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>

        <div className="lg:col-span-4">
          <Card className="editorial-shadow sticky top-32 overflow-hidden rounded-xl border-0 bg-white">
            <CardHeader className="border-b border-[#efefef] px-8 py-6">
              <h2 className="font-headline text-xl font-black uppercase tracking-[-0.04em]">Summary</h2>
            </CardHeader>
            <CardContent className="space-y-8 px-8 py-8">

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#5e5e5e]">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#5e5e5e]">Shipping</span>
                  <span className="font-medium">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#5e5e5e]">Estimated Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="mt-4 flex justify-between border-t border-[#c6c6c633] pt-4">
                  <span className="font-headline text-lg font-black uppercase tracking-[-0.04em]">Total</span>
                  <span className="font-headline text-lg font-black">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3">
                {hasBackendError && (
                  <Button asChild className="h-11 w-full rounded-md bg-black text-xs font-bold uppercase tracking-[0.24em] !text-white hover:bg-[#474747]">
                    <Link href="/products" style={{ color: '#ffffff' }}>Browse Items</Link>
                  </Button>
                )}
                <Button asChild className="h-11 w-full rounded-md bg-black text-xs font-bold uppercase tracking-[0.24em] !text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#474747] active:scale-95">
                  <Link href="/checkout" style={{ color: '#ffffff' }}>Checkout</Link>
                </Button>
                <Button type="button" variant="outline" className="h-11 w-full rounded-md border-[#c6c6c64d] bg-white text-xs font-bold uppercase tracking-[0.24em] text-black hover:bg-[#f3f3f4]">
                  Update Cart
                </Button>
              </div>


            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={Boolean(confirmItemId)}
        title="Remove item from cart?"
        description="This action will update your cart immediately."
        confirmLabel="Remove"
        destructive
        onOpenChange={(open) => !open && setConfirmItemId(null)}
        onConfirm={() => {
          if (!confirmItemId) return;
          deleteMutation.mutate(confirmItemId, { onSuccess: () => toast.success('Item removed from cart') });
          setConfirmItemId(null);
        }}
      />
    </main>
  );
}
