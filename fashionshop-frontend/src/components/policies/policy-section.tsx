import { cn } from '@/lib/utils/cn';

type PolicySectionProps = {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
};

export function PolicySection({ id, title, children, className }: PolicySectionProps) {
  return (
    <section id={id} className={cn('scroll-mt-28', className)}>
      <h2 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-5xl">{title}</h2>
      <div className="mt-7 space-y-6 text-base leading-relaxed text-zinc-600 md:text-lg">{children}</div>
    </section>
  );
}
