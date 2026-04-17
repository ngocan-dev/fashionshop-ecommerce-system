import Link from 'next/link';

export function SustainabilitySection() {
  return (
    <section className="rounded-xl border border-black bg-black px-6 py-10 text-white md:px-10 md:py-12 lg:px-14 lg:py-14">
      <div className="max-w-3xl space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-zinc-400">Sustainability</p>
        <h2 className="text-5xl font-black leading-[0.9] tracking-tight md:text-7xl">
          CIRCULAR BY
          <br />
          CONVICTION.
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-zinc-300 md:text-lg">
          We don&apos;t believe in &quot;green&quot; as a trend. Sustainability is the baseline. 95% of our packaging is
          biodegradable, and our production cycle follows a zero-waste philosophy. We design for longevity, ensuring
          our garments stay in circulation for decades, not seasons.
        </p>
        <Link
          href="/policies"
          className="inline-flex h-12 items-center justify-center rounded-sm border border-zinc-200 bg-zinc-100 px-8 text-xs !text-black font-semibold uppercase tracking-[0.2em] text-zinc-900 transition hover:bg-white"
        >
          Read The 2026 Report
        </Link>
      </div>
    </section>
  );
}
