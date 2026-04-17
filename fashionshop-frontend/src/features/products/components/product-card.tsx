import Link from 'next/link';
import type { Product } from '@/types/product';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function ProductCard({ product }: { product: Product }) {
  const primaryImage = product.images?.[0];

  return (
    <Card className="overflow-hidden">
      <div className="aspect-[4/5] bg-gradient-to-br from-brand-50 to-muted">
        {primaryImage ? <img src={primaryImage.url} alt={primaryImage.alt ?? product.name} className="h-full w-full object-cover" /> : null}
      </div>
      <CardContent className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-medium">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.categoryName ?? 'Fashion'}</p>
          </div>
          <Badge>${product.price.toFixed(2)}</Badge>
        </div>
        <Link href={`/products/${product.slug ?? product.id}`} className="inline-flex text-sm font-medium text-brand-700">
          View details
        </Link>
      </CardContent>
    </Card>
  );
}
