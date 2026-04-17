'use client';

import { use } from 'react';
import Link from 'next/link';
import { useAdminStaffAccountsQuery } from '@/features/users/hooks';
import { StaffForm } from '@/features/users/components/admin/staff-form';
import { LoadingState } from '@/components/common/loading-state';
import { EmptyState } from '@/components/common/empty-state';

export default function EditStaffPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: staffList, isLoading } = useAdminStaffAccountsQuery();

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-20 flex justify-center">
        <LoadingState label="Loading account details..." />
      </div>
    );
  }

  const staff = staffList?.find((s) => s.id === id);

  if (!staff) {
    return (
      <div className="max-w-6xl mx-auto py-20">
        <EmptyState 
          title="Staff Account Not Found" 
          description="The account you are trying to edit does not exist."
          actionLabel="Back to Staff"
          actionHref="/admin/staff-accounts"
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12">
      {/* Header */}
      <header className="flex justify-between items-center w-full mb-12">
        <div>
          <nav className="flex items-center gap-2 text-[10px] text-neutral-400 uppercase tracking-widest mb-4 font-bold">
            <Link href="/admin/staff-accounts" className="hover:text-black transition-colors">Staff Accounts</Link>
            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            <Link href={`/admin/staff-accounts/${id}`} className="hover:text-black transition-colors">{staff.fullName}</Link>
            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            <span className="text-black uppercase">Edit Profile</span>
          </nav>
          <h2 className="text-3xl font-extrabold tracking-tighter text-black font-headline">Edit Staff Profile</h2>
          <p className="text-sm text-neutral-500 font-body">Modify administrative access and personal information for this account.</p>
        </div>
      </header>

      <StaffForm initialData={staff} />
    </div>
  );
}
