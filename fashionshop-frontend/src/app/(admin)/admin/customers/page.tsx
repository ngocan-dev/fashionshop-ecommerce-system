'use client';

import { useState, useMemo } from 'react';
import { useAdminCustomerAccountsQuery, useDeleteAdminUserMutation } from '@/features/users/hooks';
//import { LoadingState } from '@/components/common/loading-state';
import { EmptyState } from '@/components/common/empty-state';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { Pagination } from '@/components/common/pagnition';
import { CustomerStats } from '@/features/users/components/admin/customer-stats';
import { CustomerTable } from '@/features/users/components/admin/customer-table';
//import { CustomerInsights } from '@/features/users/components/admin/customer-insights';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils/cn';
import { useActivateAdminUserMutation } from '@/features/users/hooks';

export default function AdminCustomersPage() {
  const { data: customers = [], isLoading } = useAdminCustomerAccountsQuery();
  const deleteMutation = useDeleteAdminUserMutation();
  const activateMutation = useActivateAdminUserMutation();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 300);

  const handleActivate = (id: string) => {
    activateMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Customer account restored successfully');
      },
      onError: () => {
        toast.error('Failed to restore customer account');
      }
    });
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchSearch =
        customer.fullName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        customer.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        customer.id.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && customer.isActive !== false) ||
        (statusFilter === 'inactive' && customer.isActive === false);

      return matchSearch && matchStatus;
    });
  }, [customers, debouncedSearch, statusFilter]);

  const totalItems = filteredCustomers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const paginatedCustomers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredCustomers.slice(start, start + pageSize);
  }, [filteredCustomers, page, pageSize]);

  const stats = {
    totalActive: customers.length,
    avgSpend: 0,
    newRegistrations: Math.floor(customers.length * 0.1),
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        toast.success('Customer account deleted successfully');
        setDeleteId(null);
      },
      onError: () => {
        toast.error('Failed to delete customer account');
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Page Header */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tighter font-headline mb-2 uppercase">
            Customers
          </h2>
          <p className="text-neutral-500 text-sm font-body">
            Manage your studio's client base and order history.
          </p>
        </div>
      </div>

      <CustomerStats
        totalActive={stats.totalActive}
        avgSpend={stats.avgSpend}
        newRegistrations={stats.newRegistrations}
      />

      {/* Filters & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-[10px] tracking-widest uppercase font-bold text-neutral-400 mr-2 font-label">
            Filter by:
          </span>
          <button
            onClick={() => setStatusFilter('all')}
            className={cn(
              "px-4 py-1.5 text-xs font-semibold rounded-full transition-all",
              statusFilter === 'all'
                ? "bg-primary text-on-primary"
                : "bg-surface-container-highest text-on-surface hover:bg-neutral-300"
            )}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={cn(
              "px-4 py-1.5 text-xs font-semibold rounded-full transition-all",
              statusFilter === 'active'
                ? "bg-primary text-on-primary"
                : "bg-surface-container-highest text-on-surface hover:bg-neutral-300"
            )}
          >
            Active
          </button>
          <button
            onClick={() => setStatusFilter('inactive')}
            className={cn(
              "px-4 py-1.5 text-xs font-semibold rounded-full transition-all",
              statusFilter === 'inactive'
                ? "bg-primary text-on-primary"
                : "bg-surface-container-highest text-on-surface hover:bg-neutral-300"
            )}
          >
            Inactive
          </button>
        </div>

        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-lg">
              search
            </span>
            <input
              className="w-full bg-surface-container-lowest border border-neutral-100 rounded-md pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-black transition-all placeholder:text-neutral-400 font-body"
              placeholder="Search customers by name or email..."
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Table & Pagination Container */}
      <div className="space-y-4">
        {totalItems === 0 && !isLoading ? (
          <EmptyState
            title="No customers found"
            description="Try adjusting your search or filters to find what you're looking for."
            actionLabel="Reset filters"
            onAction={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}
          />
        ) : (
          <>
            <CustomerTable
              customers={paginatedCustomers}
              onDelete={setDeleteId}
              onActivate={handleActivate}
              isLoading={isLoading}
            />

            <Pagination
              page={page}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      {/* <CustomerInsights /> */}

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete customer account?"
        description="Are you sure you want to delete this customer account? This action cannot be undone and will remove all associated data."
        destructive
        confirmLabel="Delete"
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}