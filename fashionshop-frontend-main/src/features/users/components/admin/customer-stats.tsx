'use client';

import { cn } from "@/lib/utils/cn";

type Props = {
  totalActive: number;
  avgSpend: number;
  newRegistrations: number;
};

export function CustomerStats({ totalActive, avgSpend, newRegistrations }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {/* Total Active */}
      <div className="bg-surface-container-lowest p-6 border-b-2 border-primary rounded-md shadow-sm">
        <p className="text-[10px] tracking-widest uppercase text-neutral-400 font-bold mb-1 font-label">
          Total Active
        </p>
        <p className="text-3xl font-headline font-bold">
          {totalActive.toLocaleString()}
        </p>
        <div className="flex items-center gap-1 text-xs text-green-600 mt-2">
          <span className="material-symbols-outlined text-xs">trending_up</span>
          <span>+12% this month</span>
        </div>
      </div>

      {/* Avg Life Spend */}
      <div className="bg-surface-container-lowest p-6 rounded-md shadow-sm border border-neutral-50">
        <p className="text-[10px] tracking-widest uppercase text-neutral-400 font-bold mb-1 font-label">
          Avg. Life Spend
        </p>
        <p className="text-3xl font-headline font-bold">
          ${avgSpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <div className="flex items-center gap-1 text-xs text-neutral-400 mt-2">
          <span>Across all segments</span>
        </div>
      </div>

      {/* New Registrations */}
      <div className="bg-surface-container-lowest p-6 rounded-md shadow-sm border border-neutral-50">
        <p className="text-[10px] tracking-widest uppercase text-neutral-400 font-bold mb-1 font-label">
          New Registrations
        </p>
        <p className="text-3xl font-headline font-bold">
          {newRegistrations}
        </p>
        <div className="flex items-center gap-1 text-xs text-neutral-400 mt-2">
          <span>Past 7 days</span>
        </div>
      </div>
    </div>
  );
}
