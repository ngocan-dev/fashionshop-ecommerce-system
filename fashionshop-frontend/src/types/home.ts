import type { Category } from './category';

export type HomeProduct = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  categoryName?: string | null;
};

export type HomeBanner = {
  id: number;
  title: string;
  imageUrl?: string | null;
  linkUrl?: string | null;
};

export type HomePayload = {
  featuredProducts: HomeProduct[];
  newArrivals: HomeProduct[];
  categories: Category[];
  banners: HomeBanner[];
};
