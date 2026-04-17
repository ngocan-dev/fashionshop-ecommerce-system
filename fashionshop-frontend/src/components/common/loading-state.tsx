export function LoadingState({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="rounded-3xl border border-border bg-card px-6 py-10">
      <div className="space-y-4">
        <div className="h-6 w-40 animate-pulse rounded-full bg-muted" />
        <div className="h-4 w-full animate-pulse rounded-full bg-muted" />
        <div className="h-4 w-5/6 animate-pulse rounded-full bg-muted" />
        <p className="text-sm text-muted-foreground">{label}…</p>
      </div>
    </div>
  );
}
