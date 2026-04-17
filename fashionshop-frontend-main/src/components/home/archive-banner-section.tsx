import Link from 'next/link';

export function ArchiveBannerSection() {
  return (
    <section className="bg-zinc-100 py-12 md:py-16">
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8 lg:px-12">
        <div className="border border-zinc-900 bg-black px-6 py-18 text-center text-white md:px-8 md:py-24">
          <p className="text-[0.62rem] font-medium uppercase tracking-[0.4em] text-zinc-300">LIMITED RELEASE</p>
          <h2 className="mx-auto mt-4 max-w-xl text-5xl font-black uppercase leading-[0.92] tracking-tight md:text-7xl">
            THE ARCHIVE
            <br />
            COLLECTION
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-base text-zinc-300 md:text-xl">
            Re-discovering our seminal silhouettes from the past decade. Restored and re-imagined for the modern curator.
          </p>
          <Link
            href="/shop?collection=archive"
            className="mt-9 inline-flex min-h-12 items-center justify-center border border-zinc-200 bg-black px-8 text-[0.68rem] font-semibold tracking-[0.2em] text-black transition hover:bg-zinc-200"
          >
            EXPLORE THE VAULT
          </Link>
        </div>
      </div>
    </section>
  );
}