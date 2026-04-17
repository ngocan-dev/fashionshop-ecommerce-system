import { roleRoutes } from '@/lib/constants/routes';
import type { Role } from '@/lib/constants/roles';

export function isAuthenticated(role: Role | null | undefined) {
  return role && role !== 'GUEST';
}

export function canAccessPath(role: Role | null | undefined, path: string) {
  if (!role || role === 'GUEST') {
    return ['/','/products','/login','/register','/forbidden','/not-found'].some((allowed) => path === allowed || path.startsWith('/products/'));
  }

  if (role === 'ADMIN') {
    return true;
  }

  const allowedPrefixes = roleRoutes[role].concat(['/forbidden']);
  return allowedPrefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

export function redirectForRole(role: Role | null | undefined) {
  if (role === 'ADMIN') return '/admin/dashboard';
  if (role === 'STAFF') return '/staff/products';
  if (role === 'CUSTOMER') return '/account';
  return '/';
}

export function isRoleAtLeast(role: Role | null | undefined, target: Role) {
  const order: Role[] = ['GUEST', 'CUSTOMER', 'STAFF', 'ADMIN'];
  return (role ? order.indexOf(role) : 0) >= order.indexOf(target);
}
