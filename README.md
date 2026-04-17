# FashionShop

A fashion e-commerce web application — Software Engineering course project.

## Tech Stack

| Layer | Stack | Port |
|-------|-------|------|
| Backend | Spring Boot 3.3 · Java 21 · MySQL 8 | `8081` |
| Frontend | Next.js 16 · TypeScript · TailwindCSS | `3000` |

## Requirements

- Java 21+
- Node.js 18+
- MySQL 8.0

## Quick Start

Double-click **`start.bat`** — the script will automatically:
1. Ask for your MySQL password, create the database, and import sample data
2. Create `.env.local` for the frontend
3. Run `npm install` if needed
4. Open 2 terminals: Backend (port 8081) and Frontend (port 3000)

Once started, open your browser:
- **Storefront:** http://localhost:3000
- **Admin panel:** http://localhost:3000/admin/dashboard

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@gmail.com` | `123456` |
| Staff | `staff@gmail.com` | `123456` |
| Customer | `customer@gmail.com` | `123456` |

## Running Tests

```bash
# Backend (JUnit)
cd fashionshop-backend-main
mvnw test

# Frontend (Vitest)
cd fashionshop-frontend-main
npx vitest run
```

## Project Structure

```
Project_Root/
├── start.bat                      # One-click startup script
├── ecommerce_db.sql               # Sample database data
├── fashionshop-backend-main/      # Spring Boot API
│   └── src/main/java/.../modules/ # auth, cart, order, product, ...
└── fashionshop-frontend-main/     # Next.js App
    └── src/
        ├── app/                   # Pages (App Router)
        ├── features/              # Business logic by module
        └── components/            # UI components
```

## Main API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| GET | `/api/store/products` | Product listing |
| GET | `/api/store/products/{id}` | Product detail |
| GET | `/api/cart` | Shopping cart |
| POST | `/api/orders` | Place order |
| GET | `/api/admin/dashboard` | Admin dashboard |
