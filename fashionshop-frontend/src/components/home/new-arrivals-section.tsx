import Image from 'next/image';
import Link from 'next/link';
import { newArrivals } from '@/data/homepage-data';

export function NewArrivalsSection() {
  return (
    <section className="bg-zinc-100 py-12 md:py-16">
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8 lg:px-12">
        <div className="mb-8 flex items-center gap-4 md:mb-10 md:gap-6">
          <span className="h-px w-10 bg-zinc-400" />
          <h2 className="text-3xl font-black uppercase tracking-tight text-zinc-900 md:text-5xl">NEW ARRIVALS</h2>
          <span className="hidden h-px flex-1 bg-zinc-300 md:block" />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {newArrivals.map((item) => (
            <Link key={item.id} href={item.href} className="group block">
              <div className="relative overflow-hidden border border-zinc-200 bg-white">
                <div className="relative aspect-[4/5]">
                  <Image src={item.image} alt={item.name} fill className="object-cover grayscale transition duration-500 group-hover:scale-[1.03]" />
                </div>
              </div>
              <div className="mt-4 space-y-1">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-2xl font-semibold tracking-tight text-zinc-900">{item.name}</h3>
                  <p className="pt-1 text-base font-semibold text-zinc-900">{item.price}</p>
                </div>
                <p className="text-[0.62rem] font-medium uppercase tracking-[0.19em] text-zinc-500">{item.category}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}