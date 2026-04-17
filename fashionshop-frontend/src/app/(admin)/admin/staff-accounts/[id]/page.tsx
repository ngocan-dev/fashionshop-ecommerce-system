'use client';

import { use } from 'react';
import Link from 'next/link';
import { useAdminStaffAccountsQuery } from '@/features/users/hooks';
import { EmptyState } from '@/components/common/empty-state';
import { LoadingState } from '@/components/common/loading-state';

export default function AdminStaffDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: staffList, isLoading } = useAdminStaffAccountsQuery();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
        <LoadingState label="Loading staff profile..." />
      </div>
    );
  }

  const staff = staffList?.find(s => s.id === id);

  if (!staff) {
    return (
      <div className="max-w-7xl mx-auto py-20">
        <EmptyState
          title="Staff Member Not Found"
          description="The requested staff account does not exist or has been removed."
          actionLabel="Back to Staff"
          actionHref="/admin/staff-accounts"
        />
      </div>
    );
  }

  const roleName = staff.role === 'ADMIN' ? 'Administrator' : 'Staff Member';

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-[10px] text-neutral-400 uppercase tracking-widest mb-8 font-bold">
        <Link href="/admin/staff-accounts" className="hover:text-black transition-colors">Staff Accounts</Link>
        <span className="material-symbols-outlined text-[10px]">chevron_right</span>
        <span className="text-black uppercase">{staff.fullName}</span>
      </nav>

      {/* Header Section */}
      <section className="mb-16 grid grid-cols-12 gap-8 items-end">
        <div className="col-span-12 md:col-span-8 flex flex-col md:flex-row items-start md:items-center gap-10">
          <div className="w-48 h-60 bg-surface-container-high overflow-hidden rounded-md flex-shrink-0 relative">
            {staff.avatarUrl ? (
              <img
                className="w-full h-full object-cover grayscale brightness-90"
                src={staff.avatarUrl}
                alt={staff.fullName}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-neutral-100">
                <span className="material-symbols-outlined text-6xl text-neutral-300">person</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-highest rounded-full">
              <span className={`w-1.5 h-1.5 rounded-full ${staff.isActive !== false ? 'bg-black' : 'bg-red-500'}`}></span>
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-black">
                {staff.isActive !== false ? 'Active' : 'Deactivated'}
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black font-headline tracking-tighter text-black lowercase first-letter:uppercase">
              {staff.fullName}
            </h2>
            <p className="text-xl text-neutral-500 font-light tracking-tight">{roleName}</p>
            <div className="flex flex-wrap gap-6 text-sm text-neutral-400 font-medium">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">mail</span>
                {staff.email}
              </span>
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">calendar_today</span>
                Joined 2024
              </span>
            </div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-4 flex flex-col gap-3 justify-end items-start md:items-end w-full">
          <div className="flex gap-4">
            <Link
              href={`/admin/staff-accounts/${staff.id}/edit`}
              className="flex items-center gap-2 px-8 py-3 bg-black text-white hover:bg-zinc-800 transition-all active:scale-95 rounded-md"
            >
              <span className="material-symbols-outlined text-lg text-white">edit</span>
              <span className="font-label text-xs tracking-widest uppercase font-bold text-white">Edit Profile</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Information Grid */}
      <div className="grid grid-cols-12 gap-8">

        {/* Personal Info Card */}
        <div className="col-span-12 lg:col-span-7 bg-surface-container-lowest p-10 rounded-md border border-neutral-100/50 shadow-sm">
          <div className="flex justify-between items-start mb-8">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">Personal Information</h3>
            <span className="material-symbols-outlined text-neutral-300">person</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-8">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Full Name</label>
              <p className="text-lg font-headline font-semibold text-black lowercase first-letter:uppercase">{staff.fullName}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Email Address</label>
              <p className="text-lg font-headline font-semibold text-black">{staff.email}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Account ID</label>
              <p className="text-lg font-headline font-semibold text-black uppercase">{staff.id.substring(0, 8)}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Role Access</label>
              <p className="text-lg font-headline font-semibold text-black uppercase">{staff.role}</p>
            </div>
          </div>
        </div>

        {/* Role & Permissions Card */}
        <div className="col-span-12 lg:col-span-5 bg-surface-container-low p-10 rounded-md shadow-sm">
          <div className="flex justify-between items-start mb-8">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">Role & Permissions</h3>
            <span className="material-symbols-outlined text-neutral-300">verified_user</span>
          </div>

          <div className="space-y-8">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-2 block">Assigned Role</label>
              <div className="inline-block px-4 py-2 bg-black text-white rounded-md text-sm font-bold tracking-tight">
                {roleName}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold block">Active Capabilities</label>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm font-medium">
                  <span className="material-symbols-outlined text-black text-lg fill-current">check_circle</span>
                  Manage Product Catalog
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-neutral-600">
                  <span className="material-symbols-outlined text-black text-lg fill-current">check_circle</span>
                  View & Fulfill Orders
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-neutral-600">
                  <span className="material-symbols-outlined text-black text-lg fill-current">check_circle</span>
                  View Customers
                </li>
                {staff.role === 'ADMIN' ? (
                  <li className="flex items-center gap-3 text-sm font-medium text-neutral-600">
                    <span className="material-symbols-outlined text-black text-lg fill-current">check_circle</span>
                    Manage Staff Accounts
                  </li>
                ) : (
                  <li className="flex items-center gap-3 text-sm font-medium text-neutral-400">
                    <span className="material-symbols-outlined text-lg">radio_button_unchecked</span>
                    Manage Staff Accounts (Restricted)
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Visual Element */}
      <div className="mt-20 flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-300">
        <span>Staff ID: {staff.id.substring(0, 12)}</span>
        <span className="hidden sm:inline">Internal Access Only © {new Date().getFullYear()} 18 Studio</span>
      </div>
    </div>
  );
}
