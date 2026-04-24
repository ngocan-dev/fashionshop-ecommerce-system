# FashionShop

Full-stack fashion e-commerce system with a customer storefront, staff operations area, and admin dashboard.

## Table of Contents

- [Project Overview](#project-overview)
- [Main Features](#main-features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Repository Structure](#repository-structure)
- [Requirements](#requirements)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running Locally](#running-locally)
- [Production Build](#production-build)
- [API Overview](#api-overview)
- [Useful Scripts](#useful-scripts)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

`FashionShop` is a monorepo for a fashion e-commerce platform with three main parts:

- `fashionshop-frontend`: Next.js frontend for guests, customers, staff, and admins
- `fashionshop-backend`: Spring Boot backend for REST APIs, authentication, business logic, and data access
- `database`: SQL files for local schema and seed data

The system supports common e-commerce flows such as:

- Registration and login
- Product browsing and product detail pages
- Cart and wishlist
- Checkout and order placement
- Payment flow
- Order tracking
- Invoice viewing
- Product and category management
- Customer and staff account management
- Operational dashboards

## Main Features

- JWT authentication with `CUSTOMER`, `STAFF`, and `ADMIN` roles
- Public storefront for browsing products and collections
- Customer flows for cart, checkout, orders, and invoices
- Staff and admin tools for product, category, and order management
- Admin tools for staff and customer account management
- Mock payment integrations such as `MOMO` and `VNPAY`
- Order and invoice tracking across the system

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4 |
| UI / State | Radix UI, TanStack Query, Zustand, React Hook Form, Zod, Sonner |
| Backend | Spring Boot 3.3.4, Java 21, Spring Web, Spring Data JPA, Spring Security |
| Authentication | JWT |
| Database | MySQL 8 |
| Testing | Vitest, Testing Library, JUnit 5, Spring Boot Test, H2 |
| Frontend package manager | npm |
| Build tools | Maven Wrapper (`mvnw`, `mvnw.cmd`) and Next.js build |

## Architecture Overview

### Monorepo Layout

- Frontend runs at `http://localhost:3000`
- Backend API runs at `http://localhost:8081`
- Frontend connects to backend through `NEXT_PUBLIC_API_BASE_URL`
- Local database uses MySQL schema `ecommerce_db`

### Backend Architecture

The backend follows a modular monolith structure organized by domain:

- `auth`
- `user`
- `product`
- `category`
- `cart`
- `wishlist`
- `order`
- `payment`
- `invoice`
- `dashboard`

Typical module flow:

```text
controller -> service -> repository -> entity
```

### Frontend Architecture

The frontend uses Next.js App Router and organizes routes by role:

- `(public)`: home, products, login, register
- `(customer)`: cart, checkout, orders, invoices, account
- `(staff)`: product, category, and order management
- `(admin)`: dashboard, customer accounts, staff accounts

Business logic mainly lives in `src/features`, reusable UI components live in `src/components`, and API/helpers live in `src/lib`.

## Repository Structure

```text
.
|-- start.bat
|-- database/
|   `-- ecommerce_db.sql
|-- fashionshop-backend/
|   |-- pom.xml
|   |-- mvnw
|   |-- mvnw.cmd
|   `-- src/
|       |-- main/
|       |   |-- java/com/example/fashionshop/
|       |   |   |-- config/
|       |   |   |-- security/
|       |   |   `-- modules/
|       |   `-- resources/application.properties
|       `-- test/
|           |-- java/
|           `-- resources/application.properties
|-- fashionshop-frontend/
|   |-- package.json
|   |-- env.example
|   |-- docs/
|   `-- src/
|       |-- app/
|       |-- components/
|       |-- features/
|       |-- lib/
|       |-- styles/
|       `-- types/
`-- README.md
```

## Requirements

| Component | Recommended Version |
| --- | --- |
| Node.js | `>= 18` |
| npm | `>= 9` |
| Java | `21` |
| MySQL | `8.x` |
| Maven | Not required if you use Maven Wrapper |

Windows notes:

- Add `mysql` to `PATH` if you want to use `start.bat`
- If `mysql` is not in `PATH`, either update the script or run backend/frontend manually

## Installation

### 1. Clone the Repository

```bash
git clone TODO: your-repository-url
cd ecommerce-system-se
```

### 2. Prepare the Database

Create the database:

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

Import sample data:

```bash
mysql -u root -p ecommerce_db < database/ecommerce_db.sql
```

### 3. Install Frontend Dependencies

```bash
cd fashionshop-frontend
npm install
cd ..
```

### 4. Verify Backend Configuration

The backend uses:

`fashionshop-backend/src/main/resources/application.properties`

At minimum, verify:

- `spring.datasource.url`
- `spring.datasource.username`
- `spring.datasource.password`
- `server.port`
- `jwt.secret`

## Environment Setup

## Frontend

The frontend uses `.env.local`.

Create:

`fashionshop-frontend/.env.local`

Example:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8081
```

Notes:

- `env.example` may still point to `http://localhost:8080`
- The backend in this repository runs on `8081`
- If you use `start.bat`, the script should generate `.env.local` automatically with `http://localhost:8081`

## Backend

The backend does not use a separate `.env` file by default. Local configuration currently lives in:

`fashionshop-backend/src/main/resources/application.properties`

If you want to externalize configuration later, these are the equivalent environment variables:

| Environment Variable | Purpose |
| --- | --- |
| `SPRING_DATASOURCE_URL` | JDBC URL for MySQL |
| `SPRING_DATASOURCE_USERNAME` | MySQL username |
| `SPRING_DATASOURCE_PASSWORD` | MySQL password |
| `SERVER_PORT` | Backend port |
| `JWT_SECRET` | JWT signing secret |
| `JWT_EXPIRATION_MS` | Token expiration time |

Example:

```env
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/ecommerce_db?createDatabaseIfNotExist=true&serverTimezone=Asia/Ho_Chi_Minh
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=TODO: your-mysql-password
SERVER_PORT=8081
JWT_SECRET=TODO: base64-encoded-secret
JWT_EXPIRATION_MS=86400000
```

## Running Locally

## Option 1: Quick Start with `start.bat`

The `start.bat` script is intended to:

- prompt for the MySQL root password
- create/import the database
- update the backend password in `application.properties`
- generate `.env.local` for the frontend
- run `npm install` if needed
- open separate windows for backend and frontend

Run it on Windows:

```bat
start.bat
```

Expected local URLs:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8081`

Demo accounts shown by the script:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@gmail.com` | `123456` |
| Staff | `staff@gmail.com` | `123456` |
| Customer | `customer@gmail.com` | `123456` |

Important note:

- The script may reference `ecommerce_db.sql` incorrectly depending on how it is configured
- If the script cannot find the SQL file, either fix the `SQLFILE` variable in `start.bat` or import the database manually

## Option 2: Run Manually

### Run the Backend

```bash
cd fashionshop-backend
mvnw.cmd spring-boot:run
```

On Unix-like shells:

```bash
cd fashionshop-backend
./mvnw spring-boot:run
```

Backend default URL:

```text
http://localhost:8081
```

### Run the Frontend

```bash
cd fashionshop-frontend
npm run dev
```

Frontend default URL:

```text
http://localhost:3000
```

## Production Build

## Build the Backend

```bash
cd fashionshop-backend
mvnw.cmd clean package
```

Build output:

```text
fashionshop-backend/target/
```

Run the built JAR:

```bash
java -jar target/fashionshop-0.0.1-SNAPSHOT.jar
```

## Build the Frontend

```bash
cd fashionshop-frontend
npm run build
npm run start
```

## Basic Deployment Notes

- Frontend can be deployed to Vercel or any Node.js hosting environment
- Backend can be deployed to a VM or container running Java 21
- MySQL should be provisioned separately for staging/production
- Sensitive configuration should be externalized instead of hard-coded in `application.properties`

TODO:

- Add official deployment instructions for staging/production if the project later adopts a specific infrastructure setup

## API Overview

Local base URL:

```text
http://localhost:8081
```

Standard response envelope:

```json
{
  "success": true,
  "message": "OK",
  "data": {}
}
```

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Register |
| `POST` | `/api/auth/login` | Log in |
| `POST` | `/api/auth/logout` | Log out |

### Storefront / Catalog

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/home` | Homepage data |
| `GET` | `/api/store/products` | Storefront product listing |
| `GET` | `/api/store/products/{idOrSlug}` | Storefront product detail |
| `GET` | `/api/categories` | Category list |

### Customer Flows

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/cart` | Get cart |
| `POST` | `/api/cart/items` | Add item to cart |
| `PUT` | `/api/cart/items/{itemId}` | Update cart item |
| `DELETE` | `/api/cart/items/{itemId}` | Remove cart item |
| `GET` | `/api/wishlist` | Get wishlist |
| `POST` | `/api/wishlist/items` | Add item to wishlist |
| `GET` | `/api/orders/checkout-summary` | Get checkout summary |
| `POST` | `/api/orders` | Create order |
| `GET` | `/api/orders/my` | Get my orders |
| `GET` | `/api/orders/my/{orderId}` | Get my order detail |
| `PATCH` | `/api/orders/my/{orderId}/cancel` | Cancel my order |
| `POST` | `/api/payments/orders/{orderId}/pay` | Pay for an order |
| `GET` | `/api/invoices/my/{invoiceId}` | View my invoice |

### Staff / Admin Flows

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/products/manage` | Product management list |
| `POST` | `/api/products` | Create product |
| `PUT` | `/api/products/manage/{id}` | Update product |
| `DELETE` | `/api/products/manage/{id}` | Delete product |
| `GET` | `/api/orders/manage` | Order management list |
| `PATCH` | `/api/orders/manage/{orderId}/status` | Update order status |
| `GET` | `/api/dashboard` | Dashboard summary |
| `GET` | `/api/admin/staff-accounts` | Staff account list |
| `GET` | `/api/admin/customer-accounts` | Customer account list |

Full frontend-to-backend mapping is documented in:

`fashionshop-frontend/docs/endpoint-mapping.md`

## Useful Scripts

## Frontend

```bash
cd fashionshop-frontend
npm run dev
npm run build
npm run start
npm run lint
npm run test
npm run test:run
npm run test:ui
```

## Backend

```bash
cd fashionshop-backend
mvnw.cmd spring-boot:run
mvnw.cmd test
mvnw.cmd clean package
mvnw.cmd verify
```

## Suggested Development Flow

1. Start MySQL and import sample data
2. Run the backend first
3. Set `.env.local` so the frontend points to the correct backend port
4. Run the frontend
5. Run tests before opening a pull request

## Troubleshooting

### 1. Frontend Cannot Reach Backend

Check:

- `fashionshop-frontend/.env.local`
- `NEXT_PUBLIC_API_BASE_URL`
- whether the backend is running on `8081` or `8080`

Current repository state:

- `application.properties` uses `8081`
- `env.example` may still fallback to `8080`

If the port is wrong, fix `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8081
```

### 2. `start.bat` Cannot Import the Database

Common causes:

- MySQL is not running
- wrong `root` password
- `mysql` is not in `PATH`
- the script is looking for `ecommerce_db.sql` in the wrong location

Quick fix:

- import manually with `database/ecommerce_db.sql`
- or update the `set SQLFILE=...` line in `start.bat`

### 3. Backend Cannot Connect to MySQL

Check:

`fashionshop-backend/src/main/resources/application.properties`

Make sure these are correct:

- host
- port
- username
- password
- database name `ecommerce_db`

### 4. CORS Errors

The backend currently allows:

```text
http://localhost:3000
```

If the frontend runs on a different origin, update the backend CORS configuration.

### 5. Backend Tests Differ from Local MySQL

Backend tests use H2 in-memory config from:

`fashionshop-backend/src/test/resources/application.properties`

That means most backend tests do not require a real MySQL instance.

## Contributing

1. Create a new branch from `main`
2. Keep changes small and focused
3. Run relevant tests/lint checks before pushing
4. Update docs if you change APIs, configuration, or key flows
5. Open a pull request with a short summary, testing steps, and screenshots for UI changes if needed

Recommended conventions:

- branch names: `feature/...`, `fix/...`, `docs/...`, `chore/...`
- commits: prefer Conventional Commits, for example `feat(order): add order status tracking`

## License

This project uses the `MIT` license.

See the `LICENSE` file for details.

TODO:

- Update the `Copyright (c)` line in `LICENSE` with the correct person, team, or organization name
