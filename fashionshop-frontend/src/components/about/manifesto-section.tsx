import Image from 'next/image';

export function ManifestoSection() {
  return (
    <section className="grid items-center gap-8 md:gap-10 lg:grid-cols-2 lg:gap-14">
      <div className="relative overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
        <div className="relative aspect-[4/5]">
          <Image
            src="/images/about-manifesto.jpg"
            alt="18.STUDIO manifesto portrait"
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="max-w-2xl space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-zinc-500">Manifesto</p>
        <h2 className="text-5xl font-black leading-[0.9] tracking-tight text-zinc-900 md:text-7xl">
          THE ART OF
          <br />
          CURATION.
        </h2>
        <p className="max-w-xl text-base leading-relaxed text-zinc-600 md:text-lg">
          Defining the intersection of architecture and garment, 18 Studio is an editorial atelier dedicated to the
          pursuit of the perfect silhouette.
        </p>
      </div>
    </section>
  );
}
