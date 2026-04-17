import Image from 'next/image';
import Link from 'next/link';

export interface FooterLinkItem {
  label: string;
  href?: string;
  external?: boolean;
}

export interface FooterColumn {
  title: string;
  links: FooterLinkItem[];
}

interface FooterProps {
  brand?: string;
  description?: string;
  copyright?: string;
  columns?: FooterColumn[];
  className?: string;
  containerClassName?: string;
  logoSrc?: string;
  logoAlt?: string;
}

const defaultColumns: FooterColumn[] = [
  {
    title: 'Navigation',
    links: [
      { label: 'Collections', href: '/collections' },
      { label: 'Lookbook', href: '/lookbook' },
      { label: 'Journal', href: '/journal' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Sustainability', href: '/policies#sustainability' },
      { label: 'Policies', href: '/policies' },
      { label: 'Privacy Policy', href: '/policies#privacy-policy' },
    ],
  },
  {
    title: 'Contact',
    links: [
      { label: 'Email Us', href: '/contact' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
];

export function Footer({
  brand = '18.STUDIO',
  description = 'MODERN COLLECTOR, CONTEMPORARY ERA.',
  copyright = '© 2026 18 STUDIO. ALL RIGHTS RESERVED.',
  columns = defaultColumns,
  logoSrc = '/images/logo.png',
  logoAlt = '18 Studio logo',
  className = 'bg-[#f3f3f1] py-6 lg:py-8',
  containerClassName = 'mx-auto w-full px-16 sm:px-8 lg:px-12',
}: FooterProps) {
  return (
    <footer className={className}>
      <div className={containerClassName}>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-x-20 xl:gap-x-24">
          <div className="flex items-start gap-4">
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={120}
              height={40}
              className="shrink-0 object-contain"
            />

            <div className="flex flex-col space-y-2">
              <h2 className="text-[22px] font-semibold uppercase tracking-[-0.02em] text-zinc-950">
                {brand}
              </h2>

              <p className="max-w-[220px] text-[12px] leading-[1.9] uppercase tracking-[0.16em] text-zinc-400">
                {description}
              </p>
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title} className="space-y-6">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-700">
                {column.title}
              </h3>

              <ul className="space-y-5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href ?? '#'}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noreferrer' : undefined}
                      className="text-[12px] uppercase tracking-[0.18em] text-zinc-400 transition-colors hover:text-zinc-900"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-zinc-200 pt-6">
          <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-400">
            {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;