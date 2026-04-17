import Link from 'next/link';
import Image from 'next/image';

const links = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'Pinterest', href: 'https://pinterest.com' },
  { label: 'Journal', href: '/about' },
];

export function ConnectLinks() {
  return (
    <section className="space-y-4">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">Connect</p>
      <div className="flex flex-wrap gap-6">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            target={link.href.startsWith('http') ? '_blank' : undefined}
            rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
            className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-700 transition-colors hover:text-zinc-900"
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div className="overflow-hidden rounded-md border border-zinc-200">
        <div className="relative aspect-[16/10]">
          <Image src="/images/contact-texture.png" alt="HCMIU Pasteur campus" fill className="object-cover" />
        </div>
      </div>
    </section>
  );
}
