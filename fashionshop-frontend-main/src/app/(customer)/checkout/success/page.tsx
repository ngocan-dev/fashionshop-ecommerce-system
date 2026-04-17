'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { OrderSummaryItem } from '@/types/order';

type StoredOrder = {
    orderNumber: string;
    method: string;
    shippingAddress: string;
    items: OrderSummaryItem[];
    subtotal: number;
    shippingFee: number;
    discount: number;
    total: number;
};

const STEPS = ['Placed', 'Processing', 'Shipped', 'Delivered'];

export default function CheckoutSuccessPage() {
    const searchParams = useSearchParams();
    const method = searchParams.get('method');
    const [order, setOrder] = useState<StoredOrder | null>(null);

    useEffect(() => {
        try {
            const raw = sessionStorage.getItem('lastOrder');
            if (raw) setOrder(JSON.parse(raw));
        } catch {
            /* ignore */
        }
    }, []);

    const isMomo = method === 'MOMO';
    const paymentLabel = isMomo ? 'Momo E-Wallet' : 'Cash on Delivery';
    const orderNumber = order?.orderNumber ?? `FS-${Date.now().toString().slice(-8)}`;

    return (
        <main className="min-h-screen font-body text-[#1a1c1c]">
            {/* ── Hero Banner ── */}
            <header className="bg-white px-6 py-20 text-center text-black md:py-28">
                <p className="mb-2 text-sm italic tracking-wide text-black/40">Order Confirmation</p>
                <h1 className="font-headline text-6xl font-black uppercase tracking-[-0.03em] md:text-9xl">
                    Successful.
                </h1>
                <p className="mt-4 text-sm tracking-wide text-black/40">
                    Your order has been placed at 18 Studio.&nbsp;&nbsp;
                    <span className="font-bold text-black/70">#{orderNumber}</span>
                </p>
            </header>

            <div className="mx-auto max-w-6xl px-6 py-14 md:px-12 lg:px-0">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
                    {/* ── Left Column ── */}
                    <div className="space-y-8">
                        {/* Estimated Arrival */}
                        <div className="rounded-xl border border-[#e8e8e8] bg-white p-8">
                            <div className="mb-6 flex items-start justify-between">
                                <div>
                                    <h2 className="text-sm font-bold">Estimated Arrival</h2>
                                    <p className="mt-1 text-xs text-[#999999]">
                                        {new Date(Date.now() + 7 * 86400000).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                                        {' – '}
                                        {new Date(Date.now() + 14 * 86400000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                                <span className="rounded-full bg-black px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                                    Processing
                                </span>
                            </div>

                            {/* Dot progress */}
                            <div className="flex items-center gap-0">
                                {STEPS.map((step, i) => (
                                    <div key={step} className="flex flex-1 items-center">
                                        <div
                                            className={`h-3 w-3 rounded-full ${i === 0 ? 'bg-black' : 'bg-[#e0e0e0]'
                                                }`}
                                        />
                                        {i < STEPS.length - 1 && (
                                            <div className="h-[2px] flex-1 bg-[#e0e0e0]" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping & Payment */}
                        <div className="grid grid-cols-1 gap-0 divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0 rounded-xl border border-[#e8e8e8] bg-white">
                            <div className="p-8">
                                <p className="mb-3 text-xs text-[#999999]">Shipping Address</p>
                                <p className="text-sm font-medium leading-relaxed whitespace-pre-line">
                                    {order?.shippingAddress ?? 'Address provided at checkout'}
                                </p>
                            </div>
                            <div className="p-8">
                                <p className="mb-3 text-xs text-[#999999]">Payment Method</p>
                                <p className="text-sm font-bold">{paymentLabel}</p>
                                <p className="mt-0.5 text-xs text-[#aaaaaa]">
                                    {isMomo ? 'Paid via Momo' : 'Billing address same as shipping'}
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <Link
                                href="/orders"
                                className="flex h-14 flex-1 items-center justify-center gap-2 rounded-lg bg-black text-sm font-bold tracking-wide !text-white transition-colors hover:bg-[#333333]"
                            >
                                Track Order
                                <span className="material-symbols-outlined text-base">arrow_forward</span>
                            </Link>
                            <Link
                                href="/products"
                                className="flex h-14 flex-1 items-center justify-center rounded-lg border-2 border-[#e0e0e0] text-sm font-bold tracking-wide text-[#1a1c1c] transition-colors hover:border-black"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>

                    {/* ── Right Column — Summary ── */}
                    <div className="h-fit lg:sticky lg:top-24">
                        <div className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-[#f0f0f0]">
                            <h2 className="font-headline mb-6 text-lg font-black tracking-tight">Summary</h2>

                            {order?.items && order.items.length > 0 ? (
                                <div className="space-y-5 border-b border-[#f0f0f0] pb-6">
                                    {order.items.map((item) => (
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
                            ) : (
                                <div className="border-b border-[#f0f0f0] pb-6">
                                    <p className="text-sm text-[#aaaaaa]">Order items confirmed</p>
                                </div>
                            )}

                            <div className="mt-6 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#888888]">Subtotal</span>
                                    <span className="font-medium">${(order?.subtotal ?? 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#888888]">Shipping</span>
                                    <span className="font-medium">{!order?.shippingFee ? 'Complimentary' : `$${order.shippingFee.toFixed(2)}`}</span>
                                </div>
                                {order && order.discount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#888888]">Discount</span>
                                        <span className="font-medium text-green-700">-${order.discount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="mt-4 flex justify-between border-t border-[#f0f0f0] pt-4">
                                    <span className="font-headline text-base font-black">Total</span>
                                    <span className="font-headline text-base font-black">${(order?.total ?? 0).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 rounded-xl border border-[#e8e8e8] bg-[#fafafa] px-6 py-4">
                            <p className="text-xs leading-relaxed text-[#999999]">
                                A confirmation email has been sent to your inbox. Please keep it for your records.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
