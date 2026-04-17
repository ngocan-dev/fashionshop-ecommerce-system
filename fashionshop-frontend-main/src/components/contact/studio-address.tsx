import Image from 'next/image';

export function StudioAddress() {
  return (
    <section className="space-y-5">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">Studio Address</p>
      <address className="not-italic text-4xl font-semibold leading-tight tracking-tight text-zinc-900 md:text-5xl">
        Rue du Faubourg Saint-Honore 18
        <br />
        75008 Paris, France
      </address>
      <div className="overflow-hidden rounded-md border border-zinc-200">
        <div className="relative aspect-[16/10]">
          <Image src="/images/contact-studio.png" alt="HCMIU Thu Duc campus" fill className="object-cover" />
        </div>
      </div>
    </section>
  );
}
