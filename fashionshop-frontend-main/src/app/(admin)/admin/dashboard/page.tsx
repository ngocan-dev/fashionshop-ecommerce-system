'use client';

import { useState } from 'react';
//import { LoadingState } from '@/components/common/loading-state';
//import { EmptyState } from '@/components/common/empty-state';
import { useDashboardQuery } from '@/features/dashboard/hooks';
import { DashboardView } from '@/features/dashboard/components/dashboard-view';

function currentDate(offsetDays = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

export default function AdminDashboardPage() {
  const [from, setFrom] = useState(currentDate(-30));
  const [to, setTo] = useState(currentDate());
  const query = useDashboardQuery(from, to);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="font-headline text-4xl font-extrabold tracking-tighter text-on-surface uppercase">Dashboard</h2>
          <p className="text-on-surface-variant font-label tracking-widest text-[10px] mt-2">OVERVIEW & CORE METRICS</p>
        </div>
        
        <div className="flex gap-3 items-center">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-lowest text-[10px] font-semibold rounded-md border border-outline-variant">
            <span className="material-symbols-outlined text-xs">calendar_today</span>
            <div className="flex gap-2 items-center">
              <input 
                type="date" 
                value={from} 
                onChange={(event) => setFrom(event.target.value)} 
                className="bg-transparent border-none p-0 focus:ring-0 text-[10px] cursor-pointer"
              />
              <span className="opacity-40">→</span>
              <input 
                type="date" 
                value={to} 
                onChange={(event) => setTo(event.target.value)} 
                className="bg-transparent border-none p-0 focus:ring-0 text-[10px] cursor-pointer"
              />
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary text-xs font-semibold rounded-md hover:opacity-90 transition-all active:scale-95">
            <span className="material-symbols-outlined text-sm">download</span>
            Export Report
          </button>
        </div>
      </div>

      <DashboardView data={query.data} isLoading={query.isLoading} />
    </div>
  );
}

