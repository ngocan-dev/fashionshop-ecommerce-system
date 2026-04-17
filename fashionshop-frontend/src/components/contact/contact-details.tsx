export function ContactDetails() {
  return (
    <section className="space-y-7">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">Customer Care</p>
      </div>

      <div className="space-y-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">Email</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">care@18studio.com</p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">Phone</p>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-zinc-900">+1 (800) 1818-18</p>
        </div>

        <div className="space-y-1 text-lg text-zinc-500">
          <p>Monday - Friday: 09:00 - 18:00 CET</p>
          <p>Saturday: 10:00 - 16:00 CET</p>
        </div>
      </div>
    </section>
  );
}
