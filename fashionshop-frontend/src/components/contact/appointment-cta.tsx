import Link from 'next/link';

export function AppointmentCta() {
  return (
    <section className="space-y-5">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">Visit Our Space</p>
      <h3 className="text-5xl font-black leading-[0.95] tracking-tight text-zinc-900 md:text-6xl">Experience 18.STUDIO in person.</h3>
      <p className="max-w-xl text-lg leading-relaxed text-zinc-500">
        Private appointments available for seasonal collection previews and bespoke fittings.
      </p>
      <Link
        href="/contact"
        className="inline-flex border-b border-zinc-900 pb-1 text-xs font-bold uppercase tracking-[0.18em] text-zinc-900 transition-opacity hover:opacity-70"
      >
        Book Appointment
      </Link>
    </section>
  );
}
