import { NextRequest, NextResponse } from 'next/server';

type Role = 'GUEST' | 'CUSTOMER' | 'STAFF' | 'ADMIN';

const publicPaths = ['/', '/login', '/register', '/products', '/forbidden', '/not-found'];
const customerPaths = ['/account', '/cart', '/wishlist', '/checkout', '/orders', '/invoices'];
const staffPaths = ['/staff/products', '/staff/categories', '/staff/orders'];
const adminPaths = ['/admin'];

function isPublicPath(pathname: string) {
  return publicPaths.some((path) => pathname === path || pathname.startsWith('/products/'));
}

function hasAccess(role: Role, pathname: string) {
  if (isPublicPath(pathname)) return true;
  if (role === 'ADMIN') return true;
  if (role === 'STAFF') return staffPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  if (role === 'CUSTOMER') return customerPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  return isPublicPath(pathname);
}

function roleHome(role: Role) {
  if (role === 'ADMIN') return '/admin/dashboard';
  if (role === 'STAFF') return '/staff/products';
  if (role === 'CUSTOMER') return '/account';
  return '/';
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get('fashionshop.token')?.value;
  const role = (request.cookies.get('fashionshop.role')?.value as Role | undefined) ?? 'GUEST';

  if (isPublicPath(pathname) && token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL(roleHome(role), request.url));
  }

  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  if (adminPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    if (!token) return NextResponse.redirect(new URL('/login', request.url));
    if (role !== 'ADMIN') return NextResponse.redirect(new URL('/forbidden', request.url));
  }

  if (staffPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    if (!token) return NextResponse.redirect(new URL('/login', request.url));
    if (role !== 'STAFF' && role !== 'ADMIN') return NextResponse.redirect(new URL('/forbidden', request.url));
  }

  if (customerPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    if (!token) return NextResponse.redirect(new URL('/login', request.url));
    if (!['CUSTOMER', 'ADMIN'].includes(role)) return NextResponse.redirect(new URL('/forbidden', request.url));
  }

  if (!isPublicPath(pathname) && !pathname.startsWith('/staff') && !pathname.startsWith('/admin') && !pathname.startsWith('/cart') && !pathname.startsWith('/wishlist') && !pathname.startsWith('/checkout') && !pathname.startsWith('/orders') && !pathname.startsWith('/account') && !pathname.startsWith('/invoices')) {
    return NextResponse.next();
  }

  if (!token && !isPublicPath(pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (!hasAccess(role, pathname) && token) {
    return NextResponse.redirect(new URL('/forbidden', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets).*)'],
};
