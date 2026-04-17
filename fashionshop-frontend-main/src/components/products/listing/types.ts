export type ProductCategory = 'Outerwear' | 'Tailoring' | 'Knitwear' | 'Accessories' | 'Bottoms';

export type ProductListingItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  imageSrc: string;
  imageAlt: string;
  color: string;
  size: string;
};

export type ProductSortOption = 'Newest Arrivals' | 'Price: Low to High' | 'Price: High to Low' | 'Category';