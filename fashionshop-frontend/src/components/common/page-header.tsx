import Link from 'next/link';

type PageHeaderProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  action?: React.ReactNode;
};

export function PageHeader({ title, description, actionLabel, actionHref, action }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-border bg-card px-5 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action ?? (actionHref && actionLabel ? <Link href={actionHref} className="rounded-2xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white">{actionLabel}</Link> : null)}
    </div>
  );
}
