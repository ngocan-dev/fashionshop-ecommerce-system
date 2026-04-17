import Image from 'next/image';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="border-b border-zinc-300 bg-zinc-100">
      <div className="relative mx-auto min-h-[70svh] w-full max-w-[1440px] px-6 py-10 md:min-h-[82svh] md:px-8 lg:px-12">
        <Image
          src="/images/hero-fashion.jpg"
          alt="18 STUDIO campaign look"
          fill
          priority
          className="object-cover object-center grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/20 to-white/10" />

        <div className="relative z-10 flex h-full max-w-3xl flex-col justify-center py-8 md:py-14">
          <h1 className="text-[3.2rem] font-black uppercase leading-[0.88] tracking-tight text-zinc-50 sm:text-[4.6rem] md:text-[7.2rem] lg:text-[8.5rem]">
            THE NEW
            <br />
            ERA OF
            <br />
            FORM
          </h1>

          <div className="mt-8 flex flex-wrap gap-3 md:mt-10">
            <Link
              href="/products"
              className="inline-flex min-h-12 items-center justify-center border border-zinc-950 bg-zinc-950 px-6 text-[0.68rem] font-semibold tracking-[0.2em] !text-white transition hover:bg-zinc-800"
            >
              SHOP THE COLLECTION
            </Link>
            <Link
              href="/products"
              className="inline-flex min-h-12 items-center justify-center border border-zinc-100/50 bg-white/8 px-6 text-[0.68rem] font-semibold tracking-[0.2em] text-white backdrop-blur-sm transition hover:bg-white/15"
            >
              VIEW LOOKBOOK
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}