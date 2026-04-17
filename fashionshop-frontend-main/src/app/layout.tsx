import type { Metadata } from 'next';
import { AppProviders } from '@/components/layout/app-providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'FashionShop',
  description: 'FashionShop frontend for storefront, customer, staff, and admin flows',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}