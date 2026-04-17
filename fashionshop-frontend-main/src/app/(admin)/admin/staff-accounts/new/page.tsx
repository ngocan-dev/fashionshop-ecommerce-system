'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { StaffForm } from '@/features/users/components/admin/staff-form';

export default function AddStaffPage() {
  const router = useRouter();

  return (
    <div className="max-w-6xl mx-auto py-12">
      {/* Header */}
      <header className="flex justify-between items-center w-full mb-12">
        <div>
          <nav className="flex items-center gap-2 text-[10px] text-neutral-400 uppercase tracking-widest mb-4 font-bold">
            <Link href="/admin/staff-accounts" className="hover:text-black transition-colors">Staff Accounts</Link>
            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            <span className="text-black">New Staff</span>
          </nav>
          <h2 className="text-3xl font-extrabold tracking-tighter text-black font-headline">Add Staff Member</h2>
          <p className="text-sm text-neutral-500 font-body">Register a new member to the 18 Studio internal portal.</p>
        </div>
      </header>
      <StaffForm />
    </div>
  );
}
