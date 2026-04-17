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

export const newArrivals: NewArrival[] = [
  {
    id: '18studio-sculpted-blazer',
    name: '18.STUDIO Sculpted Blazer',
    category: 'READY-TO-WEAR / FW24',
    price: '$1,450.00',
    image: '/images/product-blazer.svg',
    href: '/products/18studio-sculpted-blazer',
  },
  {
    id: 'kinetic-pleat-trousers',
    name: 'Kinetic Pleat Trousers',
    category: 'READY-TO-WEAR / FW24',
    price: '$890.00',
    image: '/images/product-trousers.svg',
    href: '/products/kinetic-pleat-trousers',
  },
  {
    id: 'draped-cotton-poplin',
    name: 'Draped Cotton Poplin',
    category: 'READY-TO-WEAR / FW24',
    price: '$620.00',
    image: '/images/product-shirt.svg',
    href: '/products/draped-cotton-poplin',
  }
];