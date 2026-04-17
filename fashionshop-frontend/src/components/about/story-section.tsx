import Image from 'next/image';

export function StorySection() {
  return (
    <section className="grid items-center gap-8 md:gap-10 lg:grid-cols-2 lg:gap-14">
      <div className="order-2 max-w-2xl space-y-5 lg:order-1">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-zinc-500">Our Story</p>
        <h2 className="text-5xl font-black leading-[0.9] tracking-tight text-zinc-900 md:text-7xl">
          BORN FROM THE
          <br />
          NEED FOR LESS.
        </h2>
        <div className="space-y-4 text-base leading-relaxed text-zinc-600 md:text-lg">
          <p>
            Founded in 2018, our journey began with a single objective: to eliminate excess in fashion. We believe
            style is a byproduct of careful selection and intentional living.
          </p>
          <p>
            Each piece in our collection is treated as a study in form. We do not release seasons; we release
            evolutions. Our archive is a living testament to the endurance of monochromatic design.
          </p>
        </div>
      </div>

      <div className="order-1 relative overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 lg:order-2">
        <div className="relative aspect-[4/5]">
          <Image src="/images/about-story.jpg" alt="18.STUDIO story close-up" fill className="object-cover" />
        </div>
      </div>
    </section>
  );
}
