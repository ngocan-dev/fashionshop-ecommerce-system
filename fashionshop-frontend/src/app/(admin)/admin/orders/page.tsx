"use client";

import { useState } from "react";
//import Link from "next/link";
import { useManageOrdersQuery } from "@/features/orders/hooks";
import { useDebounce } from "@/hooks/use-debounce";
//import { cn } from "@/lib/utils/cn";
import type { OrderStatus } from "@/types/order";
import { Pagination } from "@/components/common/pagnition";
import { AdminOrdersTable } from "@/features/orders/components/admin/admin-orders-table";
import { AdminOrdersFilters } from "@/features/orders/components/admin/admin-orders-filters";
import { AdminOrdersInsights } from "@/features/orders/components/admin/admin-orders-insights";

// ── Component ────────────────────────────────────────────────────────────────

export default function AdminOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const debouncedSearch = useDebounce(searchTerm, 500);

  // Reset to page 1 when filter/search changes
  const handleStatusChange = (status: OrderStatus | "") => {
    setStatusFilter(status);
    setPage(1);
  };
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPage(1);
  };

  const { data: response, isLoading } = useManageOrdersQuery({
    keyword: debouncedSearch || undefined,
    status: statusFilter || undefined,
    page: page - 1, // 0-indexed
    size: pageSize,
  });

  const orders = response?.items ?? [];
  const totalItems = response?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const pendingCount = orders.filter(o => o.status === 'PENDING').length;

const fulfilled = orders.filter(
  o => o.status === 'DELIVERED' || o.status === 'SHIPPED'
).length;

const fulfillmentRate =
  orders.length > 0 ? Math.round((fulfilled / orders.length) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto">
      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-headline font-extrabold tracking-tighter uppercase">
            Order Management
          </h2>
        </div>
      </div>

      {/* ── Status Filter Bar ─────────────────────────────────────────────── */}
      <AdminOrdersFilters
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        searchTerm={searchTerm}
        onSearch={handleSearch}
      />

      {/* ── Orders Table ──────────────────────────────────────────────────── */}
      <div className="bg-surface-container-lowest rounded-xl overflow-hidden border border-neutral-100">
        <AdminOrdersTable orders={orders} isLoading={isLoading} />

        {/* ── Pagination ────────────────────────────────────────────────── */}
        <Pagination
          page={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={setPage}
        />
      </div>

      {/* ── Order Insights ────────────────────────────────────────────────── */}
      <AdminOrdersInsights
        pendingCount={pendingCount}
        fulfillmentRate={fulfillmentRate}
        onGoToPending={() => handleStatusChange("PENDING")}
      />
    </div>
  );
}