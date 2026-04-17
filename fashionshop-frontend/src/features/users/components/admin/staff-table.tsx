'use client';

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import type { StaffAccount } from "@/types/user";

type Props = {
  staffRows: StaffAccount[];
  onDelete: (id: string) => void;
  onActivate?: (id: string) => void;
  isLoading?: boolean;
};

export function StaffTable({ staffRows, onDelete, onActivate, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4 p-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-neutral-100 rounded-md" />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest overflow-hidden rounded-md border border-neutral-100 shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead className="bg-surface-container-low border-b border-neutral-200">
          <tr>
            <th className="px-6 py-4 text-[10px] tracking-widest uppercase font-bold text-neutral-500 font-label">
              Staff Member
            </th>
            <th className="px-6 py-4 text-[10px] tracking-widest uppercase font-bold text-neutral-500 font-label">
              Contact
            </th>
            <th className="px-6 py-4 text-[10px] tracking-widest uppercase font-bold text-neutral-500 font-label">
              Status
            </th>
            <th className="px-6 py-4 text-[10px] tracking-widest uppercase font-bold text-neutral-500 font-label text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100 font-body">
          {staffRows.map((staff) => (
            <tr
              key={staff.id}
              className="hover:bg-neutral-50/50 transition-colors group"
            >
              {/* Staff Member Info */}
              <td className="px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className="relative w-10 h-10 overflow-hidden rounded-md border border-neutral-100">
                    {staff.avatarUrl ? (
                      <Image
                        src={staff.avatarUrl}
                        alt={staff.fullName}
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                         <span className="material-symbols-outlined text-xl">person</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-black lowercase first-letter:uppercase">
                      {staff.fullName}
                    </span>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-tighter">
                      ID: #{staff.id.substring(0, 8)}
                    </span>
                  </div>
                </div>
              </td>
              
              {/* Contact */}
              <td className="px-6 py-5">
                <span className="text-sm text-neutral-600">{staff.email}</span>
              </td>
              
              {/* Status */}
              <td className="px-6 py-5">
                <span className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                  staff.isActive !== false
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                )}>
                  {staff.isActive !== false ? 'Active' : 'Inactive'}
                </span>
              </td>
              
              {/* Actions */}
              <td className="px-6 py-5 text-right space-x-4">
                {staff.isActive !== false ? (
                  <Link 
                    href={`/admin/staff-accounts/${staff.id}`}
                    className="text-[10px] tracking-widest uppercase font-bold text-neutral-400 hover:text-black transition-all"
                  >
                    View Profile
                  </Link>
                ) : (
                  <button 
                    onClick={() => onActivate?.(staff.id)}
                    className="text-[10px] tracking-widest uppercase font-bold text-green-600 hover:text-green-800 transition-all underline underline-offset-4"
                  >
                    Activate
                  </button>
                )}
                <button 
                  onClick={() => onDelete(staff.id)}
                  className="text-[10px] tracking-widest uppercase font-bold text-error border-b-2 border-transparent hover:border-error transition-all"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
