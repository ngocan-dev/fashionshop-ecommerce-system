'use client';

import Link from 'next/link';

import { useMemo, useState } from 'react';
import { StaffTable } from '@/features/users/components/admin/staff-table';
import { LoadingState } from '@/components/common/loading-state';
import { EmptyState } from '@/components/common/empty-state';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { useAdminStaffAccountsQuery, useDeleteAdminUserMutation, useActivateAdminUserMutation } from '@/features/users/hooks';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils/cn';

export default function AdminStaffAccountsPage() {
  const { data: staff = [], isLoading } = useAdminStaffAccountsQuery();
  const deleteMutation = useDeleteAdminUserMutation();
  const activateMutation = useActivateAdminUserMutation();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 300);

  const handleActivate = (id: string) => {
    activateMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Staff account restored successfully');
      },
      onError: () => {
        toast.error('Failed to restore staff account');
      }
    });
  };

  const filteredStaff = useMemo(() => {
    return staff.filter((s) => {
      const matchSearch =
        s.fullName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        s.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        s.id.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchStatus = 
        statusFilter === 'all' || 
        (statusFilter === 'active' && s.isActive !== false) ||
        (statusFilter === 'inactive' && s.isActive === false);

      return matchSearch && matchStatus;
    });
  }, [staff, debouncedSearch, statusFilter]);

  const handleDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        toast.success('Account deactivated');
        setDeleteId(null);
      },
      onError: () => {
        toast.error('Failed to deactivate account');
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tighter font-headline mb-2 uppercase text-black">
            Staff Accounts
          </h2>
          <p className="text-neutral-500 text-sm font-body">
            Manage your store's administrative and staff access.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/admin/staff-accounts/new"
            className="flex items-center gap-2 px-8 py-3 bg-black text-white hover:bg-zinc-800 transition-all active:scale-95 rounded-md"
          >
            <span className="material-symbols-outlined text-lg text-white">add</span>
            <span className="font-label text-xs tracking-widest uppercase font-bold text-white">Add Staff Member</span>
          </Link>
        </div>
      </div>

      {/* Filters & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          <span className="text-[10px] tracking-widest uppercase font-bold text-neutral-400 mr-2 font-label">
            Filter by:
          </span>
          {(['all', 'active', 'inactive'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                "px-4 py-1.5 text-xs font-semibold rounded-full transition-all uppercase tracking-wider",
                statusFilter === status
                  ? "bg-black text-white shadow-md"
                  : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
              )}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-lg">
              search
            </span>
            <input
              className="w-full bg-white border border-neutral-200 rounded-md pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-black outline-none transition-all placeholder:text-neutral-400 font-body"
              placeholder="Search staff by name, email or ID..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <StaffTable
        isLoading={isLoading}
        staffRows={filteredStaff}
        onDelete={setDeleteId}
        onActivate={handleActivate}
      />

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Deactivate staff account?"
        description="Are you sure you want to deactivate this account? Access will be revokedImmediately but data will be preserved."
        destructive
        confirmLabel="Deactivate"
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
