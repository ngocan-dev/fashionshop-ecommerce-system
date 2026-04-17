'use client';

import Link from 'next/link';
import { EmptyState } from '@/components/common/empty-state';
import { LoadingState } from '@/components/common/loading-state';
import { DataTable } from '@/components/common/data-table';
import { Button } from '@/components/ui/button';
import { useMyOrdersQuery } from '@/features/orders/hooks';
import { useState } from 'react';

type FilterStatus = 'all' | 'pending' | 'shipped' | 'delivered';

export default function OrdersPage() {
  const ordersQuery = useMyOrdersQuery();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const hasBackendError = ordersQuery.isError;

  // Show loading state
  if (ordersQuery.isPending) {
    return <LoadingState />;
  }

  if (!hasBackendError && (!ordersQuery.data || ordersQuery.data.length === 0)) {
    return (
      <EmptyState
        title="No orders yet"
        description="Your order history will appear here."
        actionLabel="Browse products"
        actionHref="/products"
      />
    );
  }

  const orders = ordersQuery.data ?? [];

  // Filter orders based on status
  const filteredOrders = orders.filter((order) => {
    if (filterStatus === 'all') return true;
    return order.status.toLowerCase() === filterStatus;
  });

  // Status badge styling
  const getStatusBadgeClass = () => 'bg-[#e8e8e8] text-[#1a1c1c]';

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-10 font-body text-[#1a1c1c] md:px-12 lg:px-24 lg:py-14">
      <section className="mb-16">
        <h1 className="font-headline mb-4 text-5xl font-black tracking-[-0.06em] md:text-7xl">Orders.</h1>
        <p className="max-w-lg font-medium tracking-tight text-[#5e5e5e]">
          Track your acquisitions and curated selections. Manage your recent deliveries and upcoming shipments.
        </p>
        {hasBackendError && (
          <div className="mt-4 rounded-lg bg-[#f3f3f4] p-4 text-sm text-[#7a7a7a]">
            Unable to load orders data. Showing layout while content is unavailable.
          </div>
        )}
      </section>

      <nav className="mb-12 flex flex-wrap gap-4">
        {(['all', 'pending', 'shipped', 'delivered'] as const).map((status) => (
          <Button
            key={status}
            onClick={() => setFilterStatus(status)}
            variant={filterStatus === status ? 'default' : 'outline'}
            className={`rounded-md px-6 py-2 text-sm font-bold uppercase tracking-[0.24em] transition-all duration-200 ${filterStatus === status ? 'bg-black !text-white hover:scale-105 hover:bg-black' : 'border-0 bg-[#e2e2e2] text-[#1a1c1c] hover:bg-[#d8d8d8]'}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </nav>

      {hasBackendError ? (
        <div className="grid grid-cols-1 gap-8 pb-24 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={`skeleton-${i}`} className="space-y-4 rounded-lg bg-[#f3f3f4] p-6">
              <div className="h-4 w-32 rounded bg-[#e8e8e8]"></div>
              <div className="flex gap-2">
                {[...Array(3)].map((__, j) => (
                  <div key={j} className="h-16 w-16 rounded bg-[#e8e8e8]"></div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2">
                {[...Array(3)].map((__, j) => (
                  <div key={j} className="space-y-1">
                    <div className="h-3 w-12 rounded bg-[#e8e8e8]"></div>
                    <div className="h-4 w-16 rounded bg-[#e8e8e8]"></div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <div className="h-9 flex-1 rounded bg-[#1a1c1c]"></div>
                <div className="h-9 flex-1 rounded border border-[#e8e8e8]"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="pb-24">
          <DataTable
            data={filteredOrders}
            emptyLabel={filterStatus === 'all' ? 'No orders found' : `No ${filterStatus} orders found`}
            columns={[
              {
                header: 'Order',
                cell: (order) => (
                  <div>
                    <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.24em] text-[#777777]">Reference</span>
                    <p className="font-headline text-base font-bold">#{order.orderNumber ?? order.id}</p>
                  </div>
                ),
              },
              {
                header: 'Status',
                cell: (order) => <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] ${getStatusBadgeClass()}`}>{order.status}</span>,
              },
              {
                header: 'Placed',
                cell: (order) => new Date(order.createdAt || new Date()).toLocaleDateString(),
              },
              {
                header: 'Total',
                cell: (order) => `$${order.total.toFixed(2)}`,
              },
              {
                header: 'Action',
                cell: (order) => (
                  <Button asChild size="sm" className="rounded-md bg-black !text-white hover:bg-[#474747]">
                    <Link href={`/orders/${order.id}`}>View Details</Link>
                  </Button>
                ),
              },
            ]}
          />
        </div>
      )}

      {!hasBackendError && filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="mb-4 text-[#5e5e5e]">No {filterStatus !== 'all' ? filterStatus : ''} orders found.</p>
          <button
            onClick={() => setFilterStatus('all')}
            className="border-b-2 border-black pb-2 text-sm font-bold uppercase tracking-[0.24em] transition-opacity hover:opacity-50"
          >
            View All Orders
          </button>
        </div>
      )}

      {hasBackendError && (
        <div className="mb-8 text-center">
          <Button asChild className="rounded-md bg-black px-8 py-3 text-sm font-bold uppercase tracking-[0.24em] !text-white hover:bg-[#474747]">
            <Link href="/products" style={{ color: '#ffffff' }}>Browse Items</Link>
          </Button>
        </div>
      )}

    </main>
  );
}
