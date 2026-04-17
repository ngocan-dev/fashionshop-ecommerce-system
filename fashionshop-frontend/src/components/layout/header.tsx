import Link from 'next/link';

const navItems = [
  { label: 'SHOP', href: '/product' },
  { label: 'CONTACT', href: '/contact' },
  { label: 'ABOUT US', href: '/about' },
  { label: 'POLICIES', href: '/policies' },
];

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16L21 21" />
    </svg>
  );
}

function AccountIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="currentColor">
      <path d="M12 12a4 4 0 1 0-4-4a4 4 0 0 0 4 4Zm0 2c-3.33 0-6 1.67-6 4v1h12v-1c0-2.33-2.67-4-6-4Z" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 8h10l-1 11H8L7 8Z" />
      <path d="M9 9V7a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

export function Header() {
  return (
    <header className="border-b border-zinc-200 bg-[#f3f3f3]">
      <div className="mx-auto flex h-24 w-full max-w-[1600px] items-center justify-between px-6 md:px-10 xl:px-14">
        {/* LEFT: LOGO */}
        <div className="shrink-0">
          <Link href="/" className="flex items-center">
            <img
              src="/images/logo.png"
              alt="18 Studio"
              className="h-16 w-auto object-contain"
            />
          </Link>
        </div>

        {/* CENTER: MENU */}
        <nav className="hidden flex-1 items-center justify-center lg:flex">
          <ul className="flex items-center gap-8 xl:gap-10">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-[15px] font-semibold uppercase tracking-tight text-zinc-800 transition hover:text-black"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* RIGHT: SEARCH + ICONS + LANG */}
        <div className="flex shrink-0 items-center gap-4">

          <Link href="/account" aria-label="Account" className="text-zinc-800 hover:text-black">
            <AccountIcon />
          </Link>

          <Link href="/cart" aria-label="Cart" className="relative text-zinc-800 hover:text-black">
            <BagIcon />
            <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-sm bg-black px-1 text-[10px] font-semibold text-white">
              0
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}