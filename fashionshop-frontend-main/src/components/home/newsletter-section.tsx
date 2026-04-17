export function NewsletterSection() {
  return (
    <section className="bg-zinc-100 py-20 md:py-28">
      <div className="mx-auto w-full max-w-3xl px-6 text-center md:px-8">
        <h2 className="text-5xl font-black uppercase tracking-tight text-zinc-900 md:text-7xl">JOIN 18.STUDIO</h2>
        <p className="mx-auto mt-4 max-w-2xl text-xs uppercase tracking-[0.16em] text-zinc-500 md:text-sm">
          Receive exclusive access to private launches and editorial insights.
        </p>

        <form className="mx-auto mt-9 flex max-w-2xl flex-col gap-3 sm:flex-row" action="#" method="post">
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="ENTER YOUR EMAIL"
            className="h-12 flex-1 border border-zinc-300 bg-transparent px-4 text-xs tracking-[0.14em] text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none"
          />
          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center border border-zinc-900 bg-zinc-900 px-8 text-[0.68rem] font-semibold tracking-[0.2em] text-white transition hover:bg-zinc-800"
          >
            SUBSCRIBE
          </button>
        </form>
      </div>
    </section>
  );
}