/**
 * Mock data for frontend testing without a backend.
 * Remove this file (and the imports in services) once the real API is available.
 */

import type { AuthUser } from '@/types/common';
import type { Cart } from '@/types/cart';
import type { Order } from '@/types/order';
import type { Product } from '@/types/product';
import type { WishlistItem } from '@/types/wishlist';
import type { CustomerAccount, StaffAccount } from '@/types/user';

//  Products (reused across cart & orders) 

export const mockProducts: Product[] = [
    {
        id: 'prod_001',
        slug: '18studio-sculpted-blazer',
        name: '18.STUDIO Sculpted Blazer',
        description: 'A precisely tailored blazer with architectural shoulders and a subtly nipped waist.',
        price: 1450.0,
        stockQuantity: 12,
        categoryId: 6,
        categoryName: 'Ready-to-Wear',
        imageUrl: '/images/product-blazer.svg',
        isActive: true,
        isFeatured: true,
    },
    {
        id: 'prod_002',
        slug: 'kinetic-pleat-trousers',
        name: 'Kinetic Pleat Trousers',
        description: 'Wide-leg trousers featuring a single front pleat and fluid drape.',
        price: 890.0,
        stockQuantity: 24,
        categoryId: 3,
        categoryName: 'Bottoms',
        imageUrl: '/images/product-trousers.svg',
        isActive: true,
        isFeatured: false,
    },
    {
        id: 'prod_003',
        slug: 'draped-cotton-poplin',
        name: 'Draped Cotton Poplin',
        description: 'Relaxed-fit shirt in washed cotton poplin with asymmetric hem.',
        price: 620.0,
        stockQuantity: 36,
        categoryId: 6,
        categoryName: 'Ready-to-Wear',
        imageUrl: '/images/product-shirt.svg',
        isActive: true,
        isFeatured: false,
    },
    {
        id: 'prod_004',
        slug: 'artisan-leather-tote',
        name: 'Artisan Leather Tote',
        description: 'Hand-stitched vegetable-tanned leather tote with interior zip pocket.',
        price: 1120.0,
        stockQuantity: 8,
        categoryId: 5,
        categoryName: 'Accessories',
        imageUrl: '/images/category-accessories.svg',
        isActive: true,
        isFeatured: true,
    },
    {
        id: 'prod_005',
        slug: 'minimal-wool-overcoat',
        name: 'Minimal Wool Overcoat',
        description: 'Double-faced wool overcoat with clean, collarless silhouette.',
        price: 2200.0,
        stockQuantity: 5,
        categoryId: 1,
        categoryName: 'Outerwear',
        imageUrl: '/images/category-outerwear.svg',
        isActive: true,
        isFeatured: false,
    },
];

//  Mock User 
export const mockUser: AuthUser = {
    id: 'usr_001',
    email: 'jane.doe@18studio.com',
    fullName: 'Jane Doe',
    role: 'CUSTOMER',
    phoneNumber: '+1 555-012-3456',
    avatarUrl: undefined,
};

//  Mock Cart 
export const mockCart: Cart = {
    cartId: 1,
    items: [
        {
            itemId: 1,
            productId: 1,
            productName: '18.STUDIO Sculpted Blazer',
            productImage: '/images/product-blazer.svg',
            price: 1450.0,
            quantity: 1,
            lineTotal: 1450.0,
        },
        {
            itemId: 2,
            productId: 2,
            productName: 'Kinetic Pleat Trousers',
            productImage: '/images/product-trousers.svg',
            price: 890.0,
            quantity: 2,
            lineTotal: 1780.0,
        },
    ],
    totalItems: 3,
    distinctItemCount: 2,
    subtotal: 3230.0,
    totalPrice: 3230.0,
    empty: false,
};

//  Mock Orders 

export const mockOrders: Order[] = [
    {
        id: 'ord_001',
        orderNumber: 'FS-8829',
        status: 'PROCESSING',
        paymentMethod: 'COD',
        customerName: 'Alexander Thorne',
        customerEmail: 'a.thorne@example.com',
        customerTotalOrders: 12,
        items: [
            {
                productId: mockProducts[0].id,
                name: 'Signature Leather Bomber',
                quantity: 1,
                price: 850.0,
                total: 850.0,
                imageUrl: '/images/product-blazer.svg'
            },
            {
                productId: mockProducts[1].id,
                name: 'Essential Heavy Tee',
                quantity: 2,
                price: 120.0,
                total: 240.0,
                imageUrl: '/images/product-trousers.svg'
            },
        ],
        subtotal: 1090.0,
        shippingFee: 25.0,
        discount: 0,
        total: 1115.0,
        createdAt: '2023-10-24T14:45:00Z',
        shippingAddress: '724 Fifth Avenue, Floor 12, New York, NY 10019, United States',
        activityLog: [
            { status: 'Payment Verified', timestamp: 'Oct 24, 2023 • 02:47 PM', isPrimary: true },
            { status: 'Order Confirmed', timestamp: 'Oct 24, 2023 • 02:45 PM', isPrimary: false }
        ]
    },
    {
        id: 'ord_002',
        orderNumber: 'FS-8828',
        status: 'SHIPPED',
        paymentMethod: 'MOMO',
        customerName: 'Elena Rostova',
        customerEmail: 'elena@example.com',
        customerTotalOrders: 3,
        items: [
            {
                productId: mockProducts[1].id,
                name: mockProducts[1].name,
                quantity: 1, price: 890.0,
                total: 890.0,
                imageUrl: '/images/product-blazer.svg'
            },
            {
                productId: mockProducts[2].id,
                name: mockProducts[2].name,
                quantity: 2,
                price: 620.0,
                total: 1240.0,
                imageUrl: '/images/product-blazer.svg'
            },
        ],
        subtotal: 2130.0,
        shippingFee: 0,
        discount: 150.0,
        total: 1980.0,
        createdAt: '2026-03-18T14:22:00Z',
    },
];

// Shop Catalog Products (matches the listing page IDs) 

export const mockCatalogProducts: Product[] = [
    { id: 'modular-tech-parka', slug: 'modular-tech-parka', name: 'Modular Tech Parka', description: 'A storm-ready parka with detachable quilted liner and articulated hood.', price: 840, stockQuantity: 15, categoryId: 1, categoryName: 'Outerwear', imageUrl: '/images/product-blazer.svg', isActive: true, isFeatured: false },
    { id: 'boxy-sculptural-blazer', slug: 'boxy-sculptural-blazer', name: 'Boxy Sculptural Blazer', description: 'Oversized blazer in structured gray wool.', price: 1250, stockQuantity: 10, categoryId: 2, categoryName: 'Tailoring', imageUrl: '/images/product-blazer.svg', isActive: true, isFeatured: true },
    { id: 'archival-cargo-trousers', slug: 'archival-cargo-trousers', name: 'Archival Cargo Trousers', description: 'Relaxed cargo trousers in washed green denim.', price: 560, stockQuantity: 20, categoryId: 3, categoryName: 'Bottoms', imageUrl: '/images/product-trousers.svg', isActive: true, isFeatured: false },
    { id: 'oversized-ribbed-knit', slug: 'oversized-ribbed-knit', name: 'Oversized Ribbed Knit', description: 'Deep teal oversized knit.', price: 720, stockQuantity: 18, categoryId: 4, categoryName: 'Knitwear', imageUrl: '/images/product-shirt.svg', isActive: true, isFeatured: false },
    { id: 'tactical-layering-vest', slug: 'tactical-layering-vest', name: 'Tactical Layering Vest', description: 'High-visibility vest with technical panelling.', price: 440, stockQuantity: 22, categoryId: 1, categoryName: 'Outerwear', imageUrl: '/images/product-blazer.svg', isActive: true, isFeatured: false },
    { id: 'fluid-silk-shirt', slug: 'fluid-silk-shirt', name: 'Fluid Silk Shirt', description: 'A muted rose satin shirt.', price: 380, stockQuantity: 30, categoryId: 2, categoryName: 'Tailoring', imageUrl: '/images/product-shirt.svg', isActive: true, isFeatured: false },
    { id: 'architectural-shell-coat', slug: 'architectural-shell-coat', name: 'Architectural Shell Coat', description: 'Sharp-silhouette shell coat.', price: 1180, stockQuantity: 8, categoryId: 1, categoryName: 'Outerwear', imageUrl: '/images/product-blazer.svg', isActive: true, isFeatured: false },
    { id: 'narrow-pleat-trousers', slug: 'narrow-pleat-trousers', name: 'Narrow Pleat Trousers', description: 'Slim-cut trousers in dark green wool blend.', price: 610, stockQuantity: 16, categoryId: 3, categoryName: 'Bottoms', imageUrl: '/images/product-trousers.svg', isActive: true, isFeatured: false },
];

/** All mock products combined (original + shop catalog) */
export const allMockProducts: Product[] = [...mockProducts, ...mockCatalogProducts];

//  Mock Wishlist 

export const mockWishlist: WishlistItem[] = [
    { wishlistId: 1, productId: 5, productName: 'Minimal Wool Overcoat', price: 2200.0, imageUrl: '/images/category-outerwear.svg' },
    { wishlistId: 2, productId: 6, productName: 'Boxy Sculptural Blazer', price: 1250.0, imageUrl: '/images/product-blazer.svg' },
    { wishlistId: 3, productId: 7, productName: 'Fluid Silk Shirt', price: 380.0, imageUrl: '/images/product-shirt.svg' },
    { wishlistId: 4, productId: 8, productName: 'Archival Cargo Trousers', price: 560.0, imageUrl: '/images/product-trousers.svg' },
];

// ─── Mock Customers (Admin View) ──────────────────────────────────────────

export const mockCustomers: CustomerAccount[] = [
    { id: 'cust_001', fullName: 'Alexander McQueen', email: 'alex@mcqueen.com', role: 'CUSTOMER', loyaltyPoints: 1250, isActive: true },
    { id: 'cust_002', fullName: 'Vivienne Westwood', email: 'vivienne@westwood.com', role: 'CUSTOMER', loyaltyPoints: 850, isActive: true },
    { id: 'cust_003', fullName: 'Yohji Yamamoto', email: 'yohji@yamamoto.com', role: 'CUSTOMER', loyaltyPoints: 2100, isActive: true },
    { id: 'cust_004', fullName: 'Rei Kawakubo', email: 'rei@comme.com', role: 'CUSTOMER', loyaltyPoints: 450, isActive: true },
    { id: 'cust_005', fullName: 'Rick Owens', email: 'rick@drkshdw.com', role: 'CUSTOMER', loyaltyPoints: 1700, isActive: true },
];

// ─── Mock Staff (Admin View) ──────────────────────────────────────────────

export const mockStaff: StaffAccount[] = [
    { id: 'stf_001', fullName: 'Admin User', email: 'admin@18studio.com', role: 'ADMIN', department: 'Management', isActive: true },
    { id: 'stf_002', fullName: 'Sarah Jones', email: 'sarah.j@18studio.com', role: 'STAFF', department: 'Curation', isActive: true },
    { id: 'stf_003', fullName: 'Michael Chen', email: 'm.chen@18studio.com', role: 'STAFF', department: 'Logistics', isActive: true },
];

// ─── Mock Data Helpers ──────────────────────────────────────────────────────

export const getMockProduct = (idOrSlug: string): Product | undefined => {
    return allMockProducts.find(p => p.id === idOrSlug || p.slug === idOrSlug);
};

export const addMockProduct = (request: any): Product => {
    const newProduct: Product = {
        id: `prod_${Math.random().toString(36).substr(2, 9)}`,
        ...request,
    };
    allMockProducts.unshift(newProduct);
    return newProduct;
};

export const getMockOrder = (id: string): Order | undefined => {
    return mockOrders.find(o => o.id === id);
};

