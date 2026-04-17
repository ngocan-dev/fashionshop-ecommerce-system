import type { Category } from './category';
import type { Product } from './product';

export type HomePayload = {
  featuredProducts: Product[];
  newArrivals: Product[];
  categories: Category[];
  banners: Array<{ title: string; description: string; ctaLabel: string; href: string }>;
};
