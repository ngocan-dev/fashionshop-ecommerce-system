export type ProductImage = {
  id?: string;
  url: string;
  alt?: string;
};

export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  categoryId?: number;
  categoryName?: string;
  imageUrl?: string;
  images?: ProductImage[];
  isActive: boolean;
  isFeatured: boolean;
  slug?: string;
  stock?: number;
  compareAtPrice?: number;
  colors?: string[];
  sizes?: string[];
};

export type ProductFilter = {
  keyword?: string;
  categoryId?: number;
  sortBy?: string;
  page?: number;
  size?: number;
};

export type UpsertProductRequest = {
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  categoryId?: number;
  imageUrl?: string;
  isActive: boolean;
  isFeatured: boolean;
  slug?: string;
};
