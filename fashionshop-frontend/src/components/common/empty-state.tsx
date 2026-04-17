import Link from 'next/link';

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
};

export function EmptyState({ title, description, actionLabel, actionHref, onAction, icon }: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-card px-6 py-14 text-center">
      {icon ? <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">{icon}</div> : null}
      <h3 className="text-lg font-semibold">{title}</h3>
      {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
      
      {actionLabel && (
        <div className="mt-6">
          {actionHref ? (
            <Link href={actionHref} className="inline-flex rounded-2xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90">
              {actionLabel}
            </Link>
          ) : onAction ? (
            <button 
              onClick={onAction}
              className="inline-flex rounded-2xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              {actionLabel}
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
