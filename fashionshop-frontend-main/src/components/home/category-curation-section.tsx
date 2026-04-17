import Image from 'next/image';
import Link from 'next/link';
import { categories } from '@/data/homepage-data';

export function CategoryCurationSection() {
  return (
    <section className="bg-zinc-100 py-16 md:py-20">
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8 lg:px-12">
        <div className="mb-10 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <h2 className="text-4xl font-black uppercase leading-none tracking-tight text-zinc-900 md:text-6xl">THE CURATION</h2>
          <p className="max-w-sm text-xs uppercase leading-relaxed tracking-[0.16em] text-zinc-500">
            Architectural precision in every stitch, exploring the intersection of utility and elegance.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group relative block overflow-hidden border border-zinc-200 bg-zinc-200"
            >
              <div className="relative aspect-[4/5]">
                <Image src={category.image} alt={category.title} fill className="object-cover grayscale transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-3xl font-bold tracking-tight text-white">{category.title}</p>
                <p className="mt-1 text-[0.62rem] font-medium tracking-[0.2em] text-zinc-200">{category.collectionLabel}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}