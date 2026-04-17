import Link from 'next/link';

export function ConciergeCard() {
  return (
    <aside className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-zinc-700">
      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-700">Concierge Access</h3>
      <p className="mt-3 text-sm text-zinc-500">Dedicated assistance for private collectors, fittings, and bespoke support.</p>
      <Link
        href="/contact"
        className="mt-6 inline-flex h-11 w-full items-center justify-center border border-zinc-900 bg-zinc-900 px-4 text-xs font-semibold uppercase tracking-[0.2em] !text-white transition hover:bg-zinc-800"
      >
        Contact Us
      </Link>
    </aside>
  );
}
