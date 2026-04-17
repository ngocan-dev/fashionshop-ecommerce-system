import Link from 'next/link';
import type { ReactNode } from 'react';

export interface SiteNavItem {
  label: string;
  href: string;
  active?: boolean;
}

interface SiteHeaderProps {
  brand: ReactNode;
  navItems: SiteNavItem[];
  actions?: ReactNode;
  className?: string;
  containerClassName?: string;
  navClassName?: string;
  activeClassName?: string;
  inactiveClassName?: string;
}

export function SiteHeader({
  brand,
  navItems,
  actions,
  className = '',
  containerClassName = '',
  navClassName = '',
  activeClassName = 'text-zinc-900',
  inactiveClassName = 'text-zinc-500 hover:text-zinc-900',
}: SiteHeaderProps) {
  return (
    <header className={className}>
      <div className={containerClassName}>
        {typeof brand === 'string' ? <span>{brand}</span> : brand}

        <nav className={navClassName} aria-label="Primary">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className={item.active ? activeClassName : inactiveClassName}>
              {item.label}
            </Link>
          ))}
        </nav>

        {actions ?? <div />}
      </div>
    </header>
  );
}