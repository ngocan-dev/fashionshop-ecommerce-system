import Link from 'next/link';

export default function ForbiddenPage() {
  return (
    <div className="container-shell flex min-h-[70vh] flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-semibold">Forbidden</h1>
      <p className="mt-3 text-muted-foreground">You do not have permission to access this page.</p>
      <Link href="/" className="mt-6 rounded-2xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white">Go home</Link>
    </div>
  );
}
