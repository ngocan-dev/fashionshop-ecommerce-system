'use client';

import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useManageOrderQuery, useUpdateManageOrderStatusMutation } from '@/features/orders/hooks';
import { LoadingState } from '@/components/common/loading-state';
import { EmptyState } from '@/components/common/empty-state';
import { toast } from 'sonner';
import { cn } from '@/lib/utils/cn';

export default function AdminOrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;

  const { data: order, isLoading } = useManageOrderQuery(id);
  const statusMutation = useUpdateManageOrderStatusMutation(id);

  const handleCancelOrder = () => {
    statusMutation.mutate('CANCELLED', {
      onSuccess: () => {
        toast.success('Order cancelled successfully');
      },
      onError: (err: any) => {
        toast.error(err.message || 'Failed to cancel order');
      }
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto h-[70vh] flex flex-col justify-center items-center">
        <LoadingState label="Loading order details..." />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto py-20">
        <EmptyState
          title="Order Not Found"
          description={`We couldn't find an order with the ID: ${id}`}
          actionLabel="Back to Orders"
          actionHref="/admin/orders"
        />
      </div>
    );
  }

  const isCancelled = order.status === 'CANCELLED';

  return (
    <div className="max-w-7xl mx-auto">
      {/* Order Header Actions */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <nav className="flex items-center gap-2 text-[10px] text-neutral-400 uppercase tracking-widest mb-4 font-bold">
            <Link href="/admin/orders" className="hover:text-black transition-colors">Orders</Link>
            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            <span className="text-black">{order.orderNumber || order.id}</span>
          </nav>
          <h2 className="font-headline text-5xl font-black tracking-tighter text-black">
            Order {order.orderNumber || order.id}
          </h2>
          <p className="text-sm text-neutral-500 mt-3 font-body">
            Placed on {new Date(order.createdAt || new Date()).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
            {' • '}
            <span className={cn(
              "font-semibold uppercase text-xs",
              isCancelled ? "text-red-600" : "text-black"
            )}>{order.status}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleCancelOrder}
            disabled={isCancelled || statusMutation.isPending}
            className={cn(
              "px-6 py-3 border text-xs font-bold uppercase tracking-widest transition-colors rounded-md",
              isCancelled 
                ? "bg-neutral-50 border-neutral-100 text-neutral-300 cursor-not-allowed"
                : "bg-surface-container-lowest border-neutral-200 text-neutral-600 hover:bg-neutral-50"
            )}
          >
            {statusMutation.isPending ? 'Processing...' : isCancelled ? 'Order Cancelled' : 'Cancel Order'}
          </button>
          <button 
            disabled={isCancelled || statusMutation.isPending}
            className={cn(
              "px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:scale-105 active:opacity-80 transition-all rounded-md flex items-center gap-2",
              isCancelled && "opacity-20 grayscale cursor-not-allowed"
            )}
          >
            <span className="material-symbols-outlined text-sm">local_shipping</span>
            Ship Items
          </button>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-10 pb-20">
        {/* Left Area: Summary & Logistics (8 cols) */}
        <div className="col-span-12 lg:col-span-8 space-y-12">
          
          {/* Order Summary */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-headline text-xl font-bold tracking-tight">
                Order Items <span className="text-neutral-400 font-normal ml-2">({order.items.length})</span>
              </h3>
            </div>
            
            <div className="bg-surface-container-lowest rounded-xl p-2 border border-neutral-100">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 border-b border-neutral-100">
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Quantity</th>
                    <th className="px-6 py-4 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {order.items.map((item, index) => (
                    <tr key={`${item.productId}-${index}`} className="group hover:bg-neutral-50/50 transition-colors">
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-24 bg-surface-container-low rounded-lg overflow-hidden flex-shrink-0 relative border border-neutral-100">
                            {item.imageUrl ? (
                              <img 
                                src={item.imageUrl} 
                                alt={item.name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-neutral-300">image</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-black">{item.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-sm font-medium text-black">{item.quantity}</td>
                      <td className="px-6 py-6 text-sm font-bold text-right text-black">
                        ${item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Shipping & Timeline Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Shipping Address */}
            <section className="bg-surface-container-lowest border border-neutral-100 p-8 rounded-xl shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-black">location_on</span>
                <h4 className="font-headline text-lg font-bold text-black">Shipping Address</h4>
              </div>
              {order.shippingAddress ? (
                <div className="text-sm text-neutral-600 leading-relaxed font-body">
                  <p>{order.shippingAddress}</p>
                </div>
              ) : (
                <p className="text-sm text-neutral-400 italic">No shipping details provided.</p>
              )}
            </section>

            {/* Timeline / Activity Log */}
            <section className="bg-surface-container-lowest border border-neutral-100 p-8 rounded-xl shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-black">history</span>
                <h4 className="font-headline text-lg font-bold text-black">Activity Log</h4>
              </div>
              
              <div className="space-y-6 relative before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-px before:bg-neutral-200">
                {order.activityLog && order.activityLog.length > 0 ? (
                  order.activityLog.map((log, index) => (
                    <div key={index} className="relative pl-8">
                      {log.isPrimary ? (
                        <div className="absolute left-0 top-1.5 w-5 h-5 bg-black rounded-full flex items-center justify-center outline outline-4 outline-white">
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        </div>
                      ) : (
                        <div className="absolute left-[0.3rem] top-2 w-3 h-3 bg-neutral-200 border border-white rounded-full"></div>
                      )}
                      <p className={`text-xs ${log.isPrimary ? 'font-bold text-black mb-0.5' : 'font-medium text-neutral-600 mb-0.5'}`}>
                        {log.status}
                      </p>
                      <p className="text-[10px] text-neutral-400 uppercase tracking-widest">{log.timestamp}</p>
                    </div>
                  ))
                ) : (
                  <div className="pl-4 text-sm text-neutral-400 italic">Order placed successfully.</div>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* Right Sidebar: Financials & Customer (4 cols) */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          
          {/* Customer Snippet */}
          <section className="bg-surface-container-lowest p-8 rounded-xl border border-neutral-100 shadow-sm">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-6">Customer Details</h4>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200 flex-shrink-0">
                {order.customerAvatar ? (
                  <Image src={order.customerAvatar} alt={order.customerName || 'Customer'} fill className="object-cover" />
                ) : (
                  <span className="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-neutral-400">person</span>
                )}
              </div>
              <div>
                <p className="font-bold text-base text-black">{order.customerName || 'Unknown Customer'}</p>
                <p className="text-xs text-neutral-500 mt-1">{order.customerEmail || 'No email provided'}</p>
              </div>
            </div>
            {order.customerTotalOrders !== undefined && (
              <div className="pt-6 border-t border-neutral-100 flex justify-between items-center">
                <span className="text-xs text-neutral-500 font-medium">Total Orders</span>
                <span className="text-sm font-bold text-black">{order.customerTotalOrders} Orders</span>
              </div>
            )}
            <button className="w-full mt-6 py-3 border border-neutral-200 text-[10px] font-bold uppercase tracking-widest hover:border-black hover:bg-black hover:text-white transition-all rounded-md">
              View Full Profile
            </button>
          </section>

          {/* Payment Info */}
          <section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-neutral-100">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-6">Payment Information</h4>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-6 bg-neutral-900 rounded flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-[12px]">credit_card</span>
                </div>
                <span className="text-sm font-bold text-black uppercase tracking-wider">{order.paymentMethod}</span>
              </div>
              <span className="material-symbols-outlined text-green-600 text-lg icon-fill">check_circle</span>
            </div>
            <p className="text-[10px] text-neutral-400 leading-tight">
              Status: <span className="font-bold uppercase">{order.paymentStatus || 'COMPLETED'}</span>
            </p>
          </section>

          {/* Financial Breakdown */}
          <section className="bg-black text-white p-8 rounded-xl shadow-2xl relative overflow-hidden">
            {/* Subtle background element */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl"></div>
            
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-8">Financial Summary</h4>
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center text-sm opacity-80">
                <span>Subtotal</span>
                <span>${order.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center text-sm opacity-80">
                <span>Shipping</span>
                <span>${order.shippingFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center text-sm opacity-80">
                <span>Discount</span>
                <span className={order.discount > 0 ? "text-green-400" : ""}>
                   -${order.discount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              
              <div className="h-px bg-white/10 my-6"></div>
              
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">Total Amount</p>
                  <p className="text-3xl font-headline font-black tracking-tighter">
                    ${order.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <span className="bg-white/10 px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider mb-1">USD</span>
              </div>
            </div>
          </section>

          {/* Help/Notes */}
          <div className="p-5 border border-dashed border-neutral-300 rounded-xl bg-surface-container-lowest">
            <p className="text-[10px] text-neutral-500 text-center uppercase tracking-widest font-bold">Internal Order Notes</p>
            <textarea 
              className="w-full mt-4 bg-transparent border-none text-xs focus:ring-0 italic placeholder:text-neutral-400 h-24 resize-none" 
              placeholder="Add a private note for the fulfillment team..."
              defaultValue={order.note || ''}
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}
