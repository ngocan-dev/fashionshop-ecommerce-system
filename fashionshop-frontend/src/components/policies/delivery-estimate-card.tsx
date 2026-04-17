export function DeliveryEstimateCard() {
  return (
    <aside className="rounded-xl border border-zinc-200 bg-zinc-100 p-6 text-zinc-700">
      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-700">Delivery Estimates</h3>
      <dl className="mt-6 space-y-4 text-sm uppercase tracking-[0.08em]">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
          <dt className="text-zinc-500">European Union</dt>
          <dd className="font-semibold text-zinc-900">2-3 Days</dd>
        </div>
        <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
          <dt className="text-zinc-500">North America</dt>
          <dd className="font-semibold text-zinc-900">4-6 Days</dd>
        </div>
        <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
          <dt className="text-zinc-500">Asia Pacific</dt>
          <dd className="font-semibold text-zinc-900">5-8 Days</dd>
        </div>
      </dl>
      <p className="mt-5 text-sm italic text-zinc-400">Note: Custom orders may require additional processing time in our Vietnam atelier.</p>
    </aside>
  );
}
