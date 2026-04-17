'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { clearSessionAndRedirect, useAuthSession } from '@/features/auth/store';

const navigationByRole = {
  STAFF: [
    { href: '/staff/products', label: 'Products', icon: 'inventory_2' },
    //{ href: '/staff/categories', label: 'Categories', icon: 'warehouse' },
    { href: '/staff/orders', label: 'Orders', icon: 'shopping_bag' },
  ],
  ADMIN: [
    //{ href: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { href: '/admin/products', label: 'Products', icon: 'inventory_2' },
    { href: '/admin/orders', label: 'Orders', icon: 'shopping_bag' },
    { href: '/admin/customers', label: 'Customers', icon: 'group' },
    { href: '/admin/staff-accounts', label: 'Staff', icon: 'badge' },
  ],
} as const;

export function RoleShell({ role, children }: { role: 'STAFF' | 'ADMIN'; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const session = useAuthSession();

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface">
      <div className="flex min-h-screen">
        {/* SIDE NAV BAR */}
        <aside className="fixed left-0 top-0 h-screen w-64 border-r border-outline-variant bg-surface-container-low flex flex-col py-8 font-headline tracking-tighter text-sm z-50">
          <div className="px-6 mb-12">
            <h1 className="text-xl font-bold tracking-widest text-primary uppercase">18 Studio</h1>
            <p className="text-[10px] tracking-[0.2em] opacity-50 uppercase mt-1">Shop Console</p>
          </div>
          
          <nav className="flex-1 space-y-1">
            {navigationByRole[role].map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-6 py-3 transition-colors duration-200 scale-98 active:opacity-80',
                    active 
                      ? 'text-primary font-bold border-r-2 border-primary bg-surface-variant' 
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                  )}
                >
                  <span className={cn("material-symbols-outlined", active && "fill-current")} style={{ fontVariationSettings: active ? "'FILL' 1" : undefined }}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="px-6 mt-auto">
            <div className="flex items-center gap-3 p-3 bg-surface-container rounded-lg mb-4">
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-[10px] text-white font-bold">
                {session.user?.fullName?.split(' ').map(n => n[0]).join('') ?? 'AD'}
              </div>
              <div>
                <p className="text-xs font-bold">{session.user?.fullName ?? 'Admin User'}</p>
                <p className="text-[10px] opacity-60 uppercase">{role}</p>
              </div>
            </div>
            
            <button
              type="button"
              className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-error hover:bg-error-container/20 transition-colors rounded-md"
              onClick={() => clearSessionAndRedirect(router)}
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              Log out
            </button>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col ml-64">
          {/* TOP NAV BAR */}
          {/* <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 bg-white/70 backdrop-blur-xl flex justify-between items-center px-8 z-40 font-body text-sm tracking-tight border-b border-surface-container">
            <div className="flex items-center gap-4 w-1/3">
              <div className="relative w-full focus-within:ring-1 focus-within:ring-primary transition-all rounded-md">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
                <input 
                  className="w-full bg-surface-container-low border-none rounded-md py-2 pl-10 text-xs focus:ring-0" 
                  placeholder="Search orders, products, or customers..." 
                  type="text"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <button className="text-on-surface-variant hover:text-primary transition-all">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button className="text-on-surface-variant hover:text-primary transition-all">
                <span className="material-symbols-outlined">settings</span>
              </button>
              <div className="h-4 w-[1px] bg-outline-variant"></div>
              <a className="text-on-surface-variant hover:text-primary font-medium" href="#">Support</a>
              <button className="bg-primary text-on-primary px-4 py-1.5 rounded-md font-semibold text-xs transition-transform hover:scale-105 active:scale-95">
                Profile
              </button>
            </div>
          </header> */}

          <main className="flex-1 mt-16 p-10 min-h-screen bg-surface">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

