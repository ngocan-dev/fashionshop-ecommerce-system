import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function AuthCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <Card className="mx-auto w-full max-w-lg border-brand-100/60 shadow-xl shadow-brand-100/40">
      <CardHeader>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
