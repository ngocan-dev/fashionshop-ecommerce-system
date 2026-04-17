import type { Role } from './roles';

export const publicRoutes = ['/', '/products', '/products/', '/login', '/register', '/forbidden', '/not-found'] as const;

export const authRoutes = ['/login', '/register'] as const;

export const roleRoutes: Record<Exclude<Role, 'GUEST'>, string[]> = {
  CUSTOMER: ['/account', '/account/edit', '/cart', '/wishlist', '/checkout', '/orders', '/invoices'],
  STAFF: ['/staff/products', '/staff/categories', '/staff/orders'],
  ADMIN: ['/admin'],
};

export const routePaths = {
  home: '/',
  products: '/products',
  login: '/login',
  register: '/register',
  forbidden: '/forbidden',
  account: '/account',
  cart: '/cart',
  wishlist: '/wishlist',
  checkout: '/checkout',
  orders: '/orders',
  staffProducts: '/staff/products',
  staffCategories: '/staff/categories',
  staffOrders: '/staff/orders',
  adminDashboard: '/admin/dashboard',
  adminStaff: '/admin/staff-accounts',
  adminCustomers: '/admin/customers',
} as const;
