import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="container-shell flex min-h-[70vh] flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-semibold">Page not found</h1>
      <p className="mt-3 text-muted-foreground">The page you requested does not exist.</p>
      <Link href="/" className="mt-6 rounded-2xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white">Return home</Link>
    </div>
  );
}
