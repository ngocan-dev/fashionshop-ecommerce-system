import Image from 'next/image';

type MaterialItem = {
  id: string;
  title: string;
  description: string;
  image: string;
};

const materials: MaterialItem[] = [
  {
    id: 'silk-gauze',
    title: '01 - Silk Gauze',
    description: 'Floating silhouettes achieved through 100% organic mulberry silk.',
    image: '/images/about-material-silk.jpg',
  },
  {
    id: 'architectural-cotton',
    title: '02 - Architectural Cotton',
    description: 'A dense, structural weave that holds shape even after years of wear.',
    image: '/images/about-material-cotton.jpg',
  },
  {
    id: 'merino-wool',
    title: '03 - Merino Wool',
    description: 'Temperature-regulating fibers treated with a carbon-neutral wash.',
    image: '/images/about-material-wool.jpg',
  },
];

export function MaterialsSection() {
  return (
    <section className="space-y-8 md:space-y-10">
      <div className="max-w-3xl space-y-4">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-zinc-500">The Craft</p>
        <h2 className="text-5xl font-black leading-[0.9] tracking-tight text-zinc-900 md:text-7xl">
          UNCOMPROMISING
          <br />
          MATERIALS.
        </h2>
        <p className="text-base leading-relaxed text-zinc-600 md:text-lg">
          Sourced from historic mills across Europe and Asia, our textiles are the foundation of our design language.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-7">
        {materials.map((material) => (
          <article key={material.id} className="group overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image src={material.image} alt={material.title} fill className="object-cover transition duration-500 group-hover:scale-[1.03]" />
            </div>
            <div className="space-y-3 p-5">
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-700">{material.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-600 md:text-base">{material.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
