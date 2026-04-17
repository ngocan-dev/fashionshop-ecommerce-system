export type Category = {
  id: string;
  title: string;
  collectionLabel: string;
  image: string;
  href: string;
};

export type NewArrival = {
  id: string;
  name: string;
  category: string;
  price: string;
  image: string;
  href: string;
};

export const categories: Category[] = [
  {
    id: 'tops',
    title: 'Tops',
    collectionLabel: '01 / COLLECTION',
    image: '/images/category-tops.jpg',
    href: '/products?category=tops',
  },
  {
    id: 'bottoms',
    title: 'Bottoms',
    collectionLabel: '02 / COLLECTION',
    image: '/images/category-bottoms.jpg',
    href: '/products?category=bottoms',
  },
  {
    id: 'accessories',
    title: 'Accessories',
    collectionLabel: '03 / COLLECTION',
    image: '/images/category-accessories.jpg',
    href: '/products?category=accessories',
  },
  {
    id: 'outerwear',
    title: 'Outerwear',
    collectionLabel: '04 / COLLECTION',
    image: '/images/category-outerwear.jpg',
    href: '/products?category=outerwear',
  },
];

export const newArrivals: NewArrival[] = [];
