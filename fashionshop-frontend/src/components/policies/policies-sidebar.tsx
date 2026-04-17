'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import type { PolicyAnchor } from './policy-data';

type PoliciesSidebarProps = {
  anchors: PolicyAnchor[];
};

export function PoliciesSidebar({ anchors }: PoliciesSidebarProps) {
  const [activeSection, setActiveSection] = useState(anchors[0]?.id ?? '');

  useEffect(() => {
    const elements = anchors
      .map((anchor) => document.getElementById(anchor.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          setActiveSection(visible.target.id);
        }
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: [0.2, 0.4, 0.6],
      },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [anchors]);

  return (
    <>
      <aside className="hidden lg:block">
        <nav aria-label="Policies navigation" className="sticky top-28">
          <ul className="space-y-5">
            {anchors.map((anchor) => {
              const active = activeSection === anchor.id;
              return (
                <li key={anchor.id}>
                  <Link
                    href={`#${anchor.id}`}
                    className={cn(
                      'inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.14em] text-zinc-400 transition-colors hover:text-zinc-700',
                      active && 'text-zinc-900',
                    )}
                  >
                    <span className={cn('h-4 w-px bg-zinc-300', active && 'bg-zinc-900')} />
                    {anchor.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <nav aria-label="Policies navigation" className="-mx-4 mb-8 overflow-x-auto border-y border-zinc-200 px-4 py-3 lg:hidden">
        <ul className="flex min-w-max items-center gap-6">
          {anchors.map((anchor) => {
            const active = activeSection === anchor.id;
            return (
              <li key={anchor.id}>
                <Link
                  href={`#${anchor.id}`}
                  className={cn(
                    'whitespace-nowrap pb-1 text-xs font-bold uppercase tracking-[0.12em] text-zinc-400 transition-colors hover:text-zinc-700',
                    active && 'border-b border-zinc-900 text-zinc-900',
                  )}
                >
                  {anchor.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
