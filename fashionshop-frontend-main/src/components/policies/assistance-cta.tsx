import Link from 'next/link';

export function AssistanceCta() {
  return (
    <section className="mt-20 border-t border-zinc-200 py-20 text-center md:mt-24 md:py-24">
      <h2 className="text-4xl font-black tracking-tight text-zinc-900 md:text-6xl">Need Further Assistance?</h2>
      <p className="mx-auto mt-5 max-w-3xl text-base text-zinc-500 md:text-lg">
        Our concierge team is available Monday through Friday to assist with bespoke inquiries and stylistic consultations.
      </p>
      <Link
        href="/contact"
        className="mt-8 inline-flex h-12 items-center justify-center border border-zinc-900 bg-zinc-900 px-8 text-xs font-semibold uppercase tracking-[0.22em] !text-white transition hover:bg-zinc-800"
      >
        Email Concierge
      </Link>
    </section>
  );
}
