# FashionShop Frontend

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](#license)

Modern, role-based e-commerce frontend built with Next.js App Router for a fashion retail platform.

This application supports customer shopping flows, staff operations, and admin management in a single frontend codebase, integrated with a backend API.

## 1. Project Title and Description

FashionShop Frontend is a production-oriented web client for a fashion commerce system.

Key use cases:
- Guest users can browse products and register/login.
- Customers can manage account details, cart, wishlist, checkout, orders, payments, and invoices.
- Staff can manage products, categories, and orders.
- Admin users can monitor dashboard data and manage platform accounts.

## 2. Demo and Preview

- Live demo: Not available yet.
- Local preview: Run the project locally using the Installation section below.

UI summary:
- Clean storefront experience for product discovery and shopping.
- Role-based dashboards and management views for staff and admin.
- Protected routes with middleware-based access control.

## 3. Tech Stack

Core framework:
- Next.js 16 (App Router)
- React 19
- TypeScript

State, data, and forms:
- TanStack Query
- Axios
- Zustand
- React Hook Form
- Zod

UI and styling:
- Tailwind CSS v4
- Radix UI
- Lucide React icons
- Sonner (toast notifications)

Quality and tooling:
- ESLint
- Vitest
- Testing Library

## 4. Features

- Multi-role access model: GUEST, CUSTOMER, STAFF, ADMIN.
- Route protection and role redirects via middleware.
- Storefront product list and product detail flows.
- Customer cart, wishlist, and checkout flows.
- Order lifecycle with payment and invoice pages.
- Staff tools for product, category, and order management.
- Admin dashboard and account management screens.
- Structured API integration through feature-based service modules.

## 5. Folder Structure

Main project layout:

```text
.
|- docs/                      # Architecture and endpoint mapping docs
|- public/                    # Static assets
|- src/
|  |- app/                    # Next.js App Router routes and layouts
|  |  |- (public)/            # Public-facing routes (home, products, auth pages)
|  |  |- (customer)/          # Customer routes (account, cart, checkout, orders)
|  |  |- (staff)/             # Staff routes (catalog and order operations)
|  |  |- (admin)/             # Admin routes (dashboard and account management)
|  |- components/             # Reusable UI and page-level components
|  |- features/               # Domain modules (services, hooks, business logic)
|  |- lib/                    # Shared utilities, constants, API/auth helpers
|  |- data/                   # Static or seed data used by views
|  |- styles/                 # Design tokens and global styling primitives
|  |- types/                  # TypeScript domain types
|  |- middleware.ts           # Role-based route guard and redirect logic
|- env.example                # Environment variable template
```

## 6. Installation

1. Clone the repository.

```bash
git clone [<your-repo-url>](https://github.com/ngocan-dev/fashionshop-frontend.git)
cd fashionshop-frontend
```

2. Install dependencies.

```bash
npm install
```

3. Create environment file.

```bash
cp env.example .env.local
```

If your shell does not support cp on Windows, create .env.local manually and copy values from env.example.

4. Start the development server.

```bash
npm run dev
```

5. Open the application at http://localhost:3000.

## 7. Usage

- Start the app in development mode with npm run dev.
- Use public routes for browsing and authentication.
- Sign in with role-specific accounts to access customer, staff, or admin sections.
- Ensure backend API is running and reachable via NEXT_PUBLIC_API_BASE_URL.

## 8. Environment Variables

Required variables:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

Notes:
- NEXT_PUBLIC_API_BASE_URL should point to your backend service base URL.
- Variables prefixed with NEXT_PUBLIC_ are exposed to client-side code by design.

## 9. Scripts

- npm run dev: Start Next.js development server.
- npm run build: Create production build.
- npm run start: Start production server from the build output.
- npm run lint: Run ESLint checks.
- npm run test: Start Vitest in interactive mode.
- npm run test:run: Run tests once in CI-friendly mode.
- npm run test:ui: Run tests with Vitest UI.

## 10. Deployment

Production build:

```bash
npm run build
npm run start
```

Deployment options:
- Vercel (recommended for Next.js): connect repository, set environment variables, deploy.
- Container or VM hosting: run npm run build during CI and npm run start in production.

Before deploying:
- Set production value for NEXT_PUBLIC_API_BASE_URL.
- Validate role-based flows and API connectivity in a staging environment.

## 11. Contributing

Contributions are welcome.

Suggested workflow:
1. Fork the repository.
2. Create a feature branch.
3. Keep changes focused and follow existing code style.
4. Run lint and tests locally.
5. Open a pull request with clear context and screenshots for UI changes.

Quality checklist:
- Use TypeScript types for new models and APIs.
- Keep feature logic in src/features and shared UI in src/components.
- Update docs/endpoint-mapping.md when API contract usage changes.

## 12. License

MIT License.

If you want to enforce a different license, update this section and add a LICENSE file at the repository root.
