type Props = {
  pendingCount: number;
  fulfillmentRate: number;
  onGoToPending: () => void;
};

export function AdminOrdersInsights({
  pendingCount,
  fulfillmentRate,
  onGoToPending,
}: Props) {
  return (
     <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Pending */}
      {/* <div className="p-8 bg-surface-container-low rounded-xl border border-outline/5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-6">
          Pending Orders
        </p>
        <div className="flex items-end gap-4">
          <h3 className="text-3xl font-headline font-extrabold tracking-tighter">
            {pendingCount}
          </h3>
          <span className="text-amber-600 text-[10px] font-bold mb-1">
            This page
          </span>
        </div>
      </div> */}

      {/* Fulfillment */}
      {/* <div className="p-8 bg-surface-container-low rounded-xl border border-outline/5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-6">
          Fulfillment Rate
        </p>
        <div className="flex items-end gap-4">
          <h3 className="text-3xl font-headline font-extrabold tracking-tighter">
            {fulfillmentRate}%
          </h3>
          <span className="text-emerald-600 text-[10px] font-bold mb-1">
            Target 95%
          </span>
        </div>

        <div className="mt-8 w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-primary h-full rounded-full transition-all duration-700"
            style={{ width: `${fulfillmentRate}%` }}
          />
        </div>
      </div> */}

      {/* CTA */}
      {/* <div className="p-8 bg-black text-white rounded-xl">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-6">
          Priority Support
        </p>
        <h3 className="text-xl font-headline font-bold leading-tight mb-4">
          {pendingCount} Orders Awaiting Action
        </h3>
        <button
          onClick={onGoToPending}
          className="text-xs font-bold uppercase tracking-widest border-b border-white"
        >
          Go to Pending Queue →
        </button>
      </div> */}
    </section>
  );
}