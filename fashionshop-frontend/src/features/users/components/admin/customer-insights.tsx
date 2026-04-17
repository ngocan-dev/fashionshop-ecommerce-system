'use client';

export function CustomerInsights() {
  return (
    <div className="mt-16 grid grid-cols-12 gap-8 items-start mb-12">
      <div className="col-span-12 lg:col-span-4 bg-neutral-900 text-white p-8 rounded-md">
        <h4 className="font-headline font-bold text-xl mb-4 uppercase tracking-tight">Segment Insight</h4>
        <p className="text-neutral-400 text-sm leading-relaxed mb-6 font-body">
          Your most profitable customers are "Active Creatives" aged 24-28, with a repeat purchase rate of 4.2x above average.
        </p>
        <div className="pt-6 border-t border-neutral-800">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] tracking-widest uppercase font-bold text-neutral-400">Retention Score</span>
            <span className="text-2xl font-headline font-bold">88%</span>
          </div>
          <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-white h-full w-[88%]"></div>
          </div>
        </div>
      </div>
      
      <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-container-low p-6 rounded-md border border-neutral-100">
          <span className="material-symbols-outlined text-primary mb-4">mail</span>
          <h5 className="font-bold text-sm mb-2 uppercase tracking-widest font-label">Bulk Outreach</h5>
          <p className="text-xs text-neutral-500 mb-4 leading-relaxed font-body">
            Engage with 142 customers who haven't purchased in the last 3 months.
          </p>
          <button className="text-[10px] font-bold uppercase tracking-widest text-primary border-b border-primary hover:opacity-70 transition-opacity">
            Draft Campaign
          </button>
        </div>
        
        <div className="bg-surface-container-low p-6 rounded-md border border-neutral-100">
          <span className="material-symbols-outlined text-primary mb-4">loyalty</span>
          <h5 className="font-bold text-sm mb-2 uppercase tracking-widest font-label">Loyalty Program</h5>
          <p className="text-xs text-neutral-500 mb-4 leading-relaxed font-body">
            5 new customers reached the Platinum tier this week.
          </p>
          <button className="text-[10px] font-bold uppercase tracking-widest text-primary border-b border-primary hover:opacity-70 transition-opacity">
            View Tier Changes
          </button>
        </div>
      </div>
    </div>
  );
}
