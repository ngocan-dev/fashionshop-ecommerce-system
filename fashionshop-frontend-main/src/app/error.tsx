'use client';

import Link from 'next/link';

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="container-shell flex min-h-[70vh] flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-semibold">Something went wrong</h1>
      <p className="mt-3 text-muted-foreground">Please retry the action or return to the storefront.</p>
      <div className="mt-6 flex gap-3">
        <button className="rounded-2xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white" onClick={reset}>Try again</button>
        <Link href="/" className="rounded-2xl border border-border px-4 py-2.5 text-sm font-medium">Home</Link>
      </div>
    </div>
  );
}
