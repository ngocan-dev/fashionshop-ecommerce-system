'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useManageOrdersQuery } from '@/features/orders/hooks';
import { AdminOrdersFilters } from '@/features/orders/components/admin/admin-orders-filters';
import { Pagination } from '@/components/common/pagnition';
import type { OrderStatus } from '@/types/order';

export default function StaffOrdersPage() {
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<OrderStatus | ''>('');
  const pageSize = 10;

  const { data, isLoading } = useManageOrdersQuery({
    page,
    size: pageSize,
    keyword: searchTerm,
    status: status || undefined,
  });

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-10 bg-white min-h-screen">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-black/20" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-neutral-400">Order Fulfillment</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase font-headline text-black">
            Staff Orders
          </h1>
        </div>
      </header>

      {/* Filters */}
      <AdminOrdersFilters 
        statusFilter={status}
        onStatusChange={(val) => {
          setStatus(val);
          setPage(0);
        }}
        searchTerm={searchTerm}
        onSearch={(val) => {
          setSearchTerm(val);
          setPage(0);
        }}
      />

      {/* Orders Table */}
      <div className="bg-surface-container-lowest overflow-hidden rounded-xl border border-neutral-100 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container-low border-b border-neutral-200">
            <tr>
              <th className="px-6 py-4 text-[10px] tracking-widest uppercase font-bold text-neutral-500 font-label">Order info</th>
              <th className="px-6 py-4 text-[10px] tracking-widest uppercase font-bold text-neutral-500 font-label">Customer</th>
              <th className="px-6 py-4 text-[10px] tracking-widest uppercase font-bold text-neutral-500 font-label">Status</th>
              <th className="px-6 py-4 text-[10px] tracking-widest uppercase font-bold text-neutral-500 font-label">Total</th>
              <th className="px-6 py-4 text-[10px] tracking-widest uppercase font-bold text-neutral-500 font-label text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 font-body">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={5} className="px-6 py-8 bg-neutral-50/50" />
                </tr>
              ))
            ) : data?.items.map((order) => (
              <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="font-bold text-black font-mono">#{order.orderNumber || order.id.substring(0, 8)}</span>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-tighter">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-black">{order.customerName}</span>
                    <span className="text-xs text-neutral-400">{order.customerEmail}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                    order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <span className="font-bold text-neutral-900">${order.total.toLocaleString()}</span>
                </td>
                <td className="px-6 py-5 text-right">
                  <Link 
                    href={`/staff/orders/${order.id}`}
                    className="text-[10px] tracking-widest uppercase font-bold text-neutral-400 hover:text-black transition-all underline underline-offset-4"
                  >
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {data?.items.length === 0 && !isLoading && (
          <div className="py-20 text-center">
            <p className="text-neutral-400 text-sm italic">No matching orders found.</p>
          </div>
        )}
      </div>

      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center pt-8">
          <Pagination 
            page={page + 1}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={data?.total || 0}
            onPageChange={(p) => setPage(p - 1)}
          />
        </div>
      )}

      {/* Footer */}
      <footer className="pt-12 border-t border-neutral-100 text-center">
        <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-300">
          Studio 18 • Staff Portal • Fulfillment Center
        </p>
      </footer>
    </div>
  );
}
