'use client';

import Image from 'next/image';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { LoadingState } from '@/components/common/loading-state';
import { EmptyState } from '@/components/common/empty-state';
import { useCheckoutSummaryQuery, useCreateOrderMutation } from '@/features/orders/hooks';
import { CheckoutForm } from '@/features/orders/components/checkout-form';

export default function CheckoutPage() {
  const router = useRouter();
  const summaryQuery = useCheckoutSummaryQuery();
  const createOrderMutation = useCreateOrderMutation();

  if (summaryQuery.isLoading) return <LoadingState label="Loading checkout" />;
  if (!summaryQuery.data) return <EmptyState title="Checkout unavailable" description="Add items to your cart first." actionLabel="Go to cart" actionHref="/cart" />;

  const summary = summaryQuery.data;

  return (
    <main className="min-h-screen bg-[#fafafa] font-body text-[#1a1c1c]">
      <div className="mx-auto max-w-6xl px-6 py-10 md:px-12 lg:px-0 lg:py-14">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
          {/* Left Column — Form */}
          <CheckoutForm
            summary={summary}
            onSubmit={(values) =>
              createOrderMutation.mutate(values, {
                onSuccess: () => {
                  toast.success('Order placed successfully');
                  if (values.paymentMethod === 'COD' || values.paymentMethod === 'MOMO') {
                    const orderNumber = `FS-${Date.now().toString().slice(-8)}`;
                    sessionStorage.setItem('lastOrder', JSON.stringify({
                      orderNumber,
                      method: values.paymentMethod,
                      shippingAddress: values.shippingAddress,
                      items: summary.items,
                      subtotal: summary.subtotal,
                      shippingFee: summary.shippingFee,
                      discount: summary.discountAmount,
                      total: summary.finalTotal,
                    }));
                    router.push(`/checkout/success?method=${values.paymentMethod}`);
                  } else {
                    router.push('/orders');
                  }
                },
              })
            }
          />

          {/* Right Column — Order Summary Sidebar */}
          <div className="h-fit lg:sticky lg:top-24">
            <div className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-[#f0f0f0]">
              <h2 className="font-headline mb-6 text-lg font-black tracking-tight">Order Summary</h2>

              <div className="space-y-5 border-b border-[#f0f0f0] pb-6">
                {summary.items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-4">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-[#f5f5f5]">
                      {item.imageUrl ? (
                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <span className="material-symbols-outlined text-xl text-[#cccccc]">checkroom</span>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">{item.name}</p>
                      <p className="mt-0.5 text-xs text-[#aaaaaa]">Qty: {item.quantity}</p>
                    </div>
                    <p className="flex-shrink-0 text-sm font-bold">${item.total.toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#888888]">Subtotal</span>
                  <span className="font-medium">${summary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#888888]">Shipping</span>
                  <span className="font-medium">{summary.shippingFee === 0 ? 'Complimentary' : `$${summary.shippingFee.toFixed(2)}`}</span>
                </div>
                {summary.discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#888888]">Discount</span>
                    <span className="font-medium text-green-700">-${summary.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="mt-4 flex justify-between border-t border-[#f0f0f0] pt-4">
                  <span className="font-headline text-base font-black">Total</span>
                  <span className="font-headline text-base font-black">${summary.finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                className="mt-6 h-14 w-full rounded-lg bg-black text-sm font-bold tracking-wide text-white transition-colors hover:bg-[#333333] active:bg-[#555555]"
              >
                Place Order
              </button>

              <p className="mt-4 text-center text-[11px] leading-relaxed text-[#bbbbbb]">
                By placing your order, you agree to the 18 Studio Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
