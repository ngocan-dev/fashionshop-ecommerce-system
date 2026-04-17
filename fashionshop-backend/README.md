# FashionShop Backend

![CI](https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?logo=githubactions&logoColor=white)
![Java](https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk&logoColor=white)
![License](https://img.shields.io/badge/license-Unlicensed-lightgrey)

> RESTful e-commerce backend for customers, staff, and admins to manage catalog, cart, orders, payments, invoices, and dashboards.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
  - [Running with Docker](#running-with-docker)
- [API Reference](#api-reference)
- [Database](#database)
  - [Schema Overview](#schema-overview)
  - [Migrations](#migrations)
  - [Seeding](#seeding)
- [Testing](#testing)
- [Deployment](#deployment)
  - [CI/CD](#cicd)
  - [Production Checklist](#production-checklist)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Overview
- **Problem solved:** Provides one backend service for storefront browsing, account management, cart/wishlist flows, checkout, payment processing, invoice management, and internal staff/admin operations.
- **High-level architecture:** Modular monolith organized by domain (`auth`, `user`, `product`, `category`, `cart`, `wishlist`, `order`, `payment`, `invoice`, `dashboard`). Each module follows layered design: `controller -> service -> repository -> entity`, with shared utilities in `common/`, security in `security/`, and app-level config in `config/`.
- **Tech stack (from source):**
  - Java 21
  - Spring Boot 3.3.4
  - Spring Web (REST API)
  - Spring Data JPA + Hibernate
  - Spring Security + JWT (JJWT 0.12.6)
  - Bean Validation (Jakarta Validation)
  - MySQL Connector/J
  - Lombok
  - Maven Wrapper (`mvnw`)

## Features
- JWT-based authentication with login, registration, and token invalidation support.
- Role-based authorization for `CUSTOMER`, `STAFF`, and `ADMIN`.
- Product and category browsing/management APIs.
- Cart lifecycle APIs: add item, update quantity, remove item, view summary.
- Wishlist APIs with duplicate protection.
- Checkout, order placement, order history, detail, tracking, and cancellation.
- Payment module with gateway abstraction and mock gateway implementations (`MOMO`, `VNPAY`, generic online gateway).
- Invoice retrieval and internal invoice management APIs.
- Dashboard and homepage APIs for operational and storefront data.
- Unified API envelope format: `{ success, message, data }`.

**Notable design decisions**
- **Modular monolith** by domain package.
- **Stateless security** (`SessionCreationPolicy.STATELESS`) with JWT filter.
- **Gateway strategy/factory pattern** for payment providers (`PaymentGateway` + `PaymentGatewayFactory`).
- **Exception mapping layer** via centralized `GlobalExceptionHandler` and domain-specific exceptions.

## Prerequisites
- Java 21
- Maven 3.9+ (or use `./mvnw`)
- MySQL 8+ (or compatible MySQL server)
- Git

## Getting Started

### Installation
```bash
git clone [<your-repo-url>](https://github.com/ngocan-dev/fashionshop-backend)
cd fashionshop-backend
chmod +x mvnw
./mvnw -v
```

### Environment Variables
This project uses Spring properties in `src/main/resources/application.properties`. In production, set these through environment variables or externalized config.

| Variable | Required | Default | Description |
|---|---|---|---|
| `SPRING_APPLICATION_NAME` | No | `fashionshop` | Service name in Spring context. |
| `SPRING_DATASOURCE_URL` | Yes | `jdbc:mysql://localhost:3306/ecommerce_db` | JDBC URL for MySQL database. |
| `SPRING_DATASOURCE_USERNAME` | Yes | `root` | Database username. |
| `SPRING_DATASOURCE_PASSWORD` | Yes | `your_password` | Database password. |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | No | `update` | Schema handling mode (`update`, `validate`, `none`, etc.). |
| `SPRING_JPA_SHOW_SQL` | No | `true` | Enables SQL logging. |
| `SPRING_JPA_PROPERTIES_HIBERNATE_FORMAT_SQL` | No | `true` | Formats SQL logs. |
| `SPRING_JPA_OPEN_IN_VIEW` | No | `false` | Disables Open Session In View. |
| `SERVER_PORT` | No | `8080` | HTTP server port. |
| `JWT_SECRET` | Yes | `cmVwbGFjZS13aXRoLXlvdXIt...` | JWT signing secret (Base64-encoded). Replace with a secure Base64-encoded value in production. |
| `JWT_EXPIRATION_MS` | No | `86400000` | Access token expiration in milliseconds (24h). |

### Running Locally
```bash
# 1) Create the database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS ecommerce_db;"

# 2) Start the application
./mvnw spring-boot:run
```

### Running with Docker
```bash
# Run the app in a Maven + JDK container (uses host networked MySQL)
docker run --rm -it \
  --name fashionshop-backend \
  -p 8080:8080 \
  -e SPRING_DATASOURCE_URL='jdbc:mysql://host.docker.internal:3306/ecommerce_db' \
  -e SPRING_DATASOURCE_USERNAME='root' \
  -e SPRING_DATASOURCE_PASSWORD='your_password' \
  -e JWT_SECRET='replace-with-your-very-strong-secret-key-for-fashionshop-jwt-token' \
  -v "$PWD":/workspace \
  -w /workspace \
  maven:3.9.10-eclipse-temurin-17 \
  ./mvnw spring-boot:run
```

## API Reference
Base URL: `http://localhost:8080`

Response envelope:
```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

### Authentication (`/api/auth`)
| Method | Path | Auth | Request body | Response data |
|---|---|---|---|---|
| POST | `/api/auth/register` | Public | `RegisterRequest` (`email`, `password`, `verifiedPassword`, optional `fullName`) | `AuthResponse` |
| POST | `/api/auth/login` | Public | `LoginRequest` (`email`, `password`) | `AuthResponse` |
| POST | `/api/auth/logout` | Public (optional Bearer token) | none | `null` |

### User & account APIs
| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/users/profile` | Authenticated | Returns current user profile. |
| PUT | `/api/users/profile` | Authenticated | Updates current user profile. |
| GET | `/api/users/me` | Authenticated | Returns current customer profile DTO. |
| GET | `/api/me` | Authenticated | Returns current user profile. |
| PUT | `/api/me` | Authenticated | Updates current user profile. |
| GET | `/api/me/orders` | CUSTOMER | Returns paginated current customer order history. |
| POST | `/api/admin/users/staff` | ADMIN | Creates staff account. |
| GET | `/api/admin/users/staff` | ADMIN | Lists staff accounts. |
| GET | `/api/admin/users/customers` | ADMIN | Lists customer accounts. |
| DELETE | `/api/admin/users/{userId}` | ADMIN | Deactivates user. |
| GET | `/api/admin/staff-accounts` | ADMIN | Lists staff account summaries. |
| GET | `/api/admin/customer-accounts` | ADMIN | Lists customer account summaries. |
| DELETE | `/api/admin/accounts/{id}` | ADMIN | Deletes account by ID (optional confirmation body). |
| DELETE | `/api/admin/accounts/by-email?email=` | ADMIN | Deletes account by email (optional confirmation body). |

### Catalog APIs
| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/categories` | Public | Lists categories. |
| POST | `/api/categories` | STAFF/ADMIN | Creates category. |
| GET | `/api/products` | Public | Lists products with paging and optional keyword. |
| GET | `/api/products/{id}` | Public | Returns product detail. |
| GET | `/api/products/search?keyword=` | Public | Keyword search. |
| POST | `/api/products` | STAFF/ADMIN | Creates product. |
| PUT | `/api/products/{id}` | STAFF/ADMIN | Updates product. |
| DELETE | `/api/products/{id}` | STAFF/ADMIN | Deletes product. |
| GET | `/api/products/manage` | STAFF/ADMIN | Product management list. |
| GET | `/api/products/manage/{id}` | STAFF/ADMIN | Product management detail. |
| PUT | `/api/products/manage/{id}` | STAFF/ADMIN | Product management update. |
| DELETE | `/api/products/manage/{id}` | STAFF/ADMIN | Product management delete. |
| GET | `/api/store/products` | Public | Storefront product browse (`page`, `size`). |
| GET | `/api/store/products/{idOrSlug}` | Public | Storefront product detail. |

### Cart & wishlist APIs
| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/cart` | CUSTOMER | Gets current customer cart. |
| GET | `/api/cart/summary` | CUSTOMER | Gets total cart item count. |
| POST | `/api/cart/items` | CUSTOMER | Adds item to cart. |
| PUT | `/api/cart/items/{itemId}` | CUSTOMER | Updates cart item quantity. |
| PUT | `/api/cart/items/{itemId}/quantity` | CUSTOMER | Updates cart item quantity (alternate route). |
| DELETE | `/api/cart/items/{itemId}` | CUSTOMER | Removes item from cart. |
| GET | `/api/wishlist` | CUSTOMER | Gets wishlist. |
| GET | `/api/wishlist/items/contains/{productId}` | CUSTOMER | Checks if product is in wishlist. |
| POST | `/api/wishlist/items` | CUSTOMER | Adds product to wishlist. |
| DELETE | `/api/wishlist/items/{productId}` | CUSTOMER | Removes product from wishlist. |

### Order, payment, invoice APIs
| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/orders/checkout-summary` | CUSTOMER | Gets checkout summary from current cart. |
| PATCH | `/api/orders/checkout/payment-method` | CUSTOMER | Sets selected checkout payment method. |
| POST | `/api/orders` | CUSTOMER | Places order (`PlaceOrderRequest`). |
| GET | `/api/orders/my` | CUSTOMER | Gets current customer order list. |
| GET | `/api/orders/my/history` | CUSTOMER | Gets paginated order history. |
| GET | `/api/orders/my/{orderId}` | CUSTOMER | Gets own order detail. |
| GET | `/api/orders/my/{orderId}/payment` | CUSTOMER | Gets own payment status summary. |
| GET | `/api/orders/my/{orderId}/status` | CUSTOMER | Gets own order tracking status. |
| PATCH | `/api/orders/my/{orderId}/cancel` | CUSTOMER | Cancels own order. |
| GET | `/api/orders` | STAFF/ADMIN | Gets paginated order summaries for management. |
| GET | `/api/orders/manage` | STAFF/ADMIN | Gets order list (non-paginated DTO list). |
| GET | `/api/orders/manage/{orderId}` | STAFF/ADMIN | Gets order detail. |
| GET | `/api/orders/{orderId}` | STAFF/ADMIN | Gets order detail. |
| PATCH | `/api/orders/{orderId}/status` | STAFF/ADMIN | Updates order status. |
| PATCH | `/api/orders/manage/{orderId}/status` | STAFF/ADMIN | Updates order status (alternate route). |
| POST | `/api/payments/orders/{orderId}/pay` | CUSTOMER | Processes payment for specific order. |
| POST | `/api/payments` | CUSTOMER | Processes payment (deprecated generic route). |
| GET | `/api/payments/orders/{orderId}` | CUSTOMER | Gets payment status. |
| GET | `/api/payments/orders/{orderId}/summary` | CUSTOMER | Gets customer-facing payment summary. |
| GET | `/api/invoices/orders/{orderId}` | CUSTOMER/STAFF/ADMIN | Gets invoice by order ID. |
| GET | `/api/invoices/{invoiceId}` | CUSTOMER/STAFF/ADMIN | Gets invoice by invoice ID. |
| GET | `/api/invoices/my/{invoiceId}` | CUSTOMER | Gets own invoice detail. |
| GET | `/api/invoices/manage` | STAFF/ADMIN | Gets paginated invoice management list. |
| GET | `/api/invoices/manage/{invoiceId}` | STAFF/ADMIN | Gets invoice management detail. |

### Dashboard & home APIs
| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/home` | Public | Returns homepage data. |
| GET | `/api/dashboard?from=YYYY-MM-DD&to=YYYY-MM-DD` | STAFF/ADMIN | Returns dashboard aggregates. |

## Database

### Schema Overview
Main tables generated by JPA entities:
- `users`: account identity, profile data, role, active status.
- `categories`: product taxonomy.
- `products`: catalog items linked to categories and creator/updater users.
- `carts`: one cart per user.
- `cart_items`: items in a cart (`cart_id`, `product_id`, unique pair).
- `wishlists`: user-product favorites (`user_id`, `product_id`, unique pair).
- `orders`: order header linked to customer user and optional manager user.
- `order_items`: line items linked to order + product.
- `payments`: payment attempts/results linked to order.
- `invoices`: one-to-one billing record per order.
- `banners`: homepage banner records used by dashboard/home module.

Key relationships:
- `User (1) -> (1) Cart`
- `Cart (1) -> (N) CartItem`
- `Category (1) -> (N) Product`
- `User (1) -> (N) Order`
- `Order (1) -> (N) OrderItem`
- `Order (1) -> (N) Payment`
- `Order (1) -> (1) Invoice`

### Migrations
This project currently uses Hibernate schema management (`spring.jpa.hibernate.ddl-auto=update`) instead of versioned SQL migration tooling.

```bash
# Apply schema changes by starting the app
./mvnw spring-boot:run
```

### Seeding
No dedicated seed framework is configured. Seed data can be loaded with plain SQL.

```bash
mysql -u root -p ecommerce_db < seed.sql
```

## Testing
```bash
# Unit + slice tests
./mvnw test

# Full verification lifecycle (tests + packaging)
./mvnw verify
```

- Test strategy uses JUnit 5 + Spring Boot Test with module-focused controller/service tests.
- Existing tests cover auth, product, cart, order, payment, invoice, dashboard, and user flows.
- Coverage thresholds are not enforced in build configuration at this time.

## Deployment

### CI/CD
- CI is defined in `.github/workflows/maven.yml`.
- Triggered on pushes and pull requests to the `main` branch.
- Pipeline steps:
  1. Checkout repository.
  2. Set up Temurin JDK 17.
  3. Run Maven package build (`mvn -B package --file pom.xml`).
  4. Submit Maven dependency graph.

Environments configured in repository code:
- `local` development via `application.properties`.
- `staging` and `production` require externalized configuration (recommended via env vars/secrets).

### Production Checklist
- [ ] Environment variables set
- [ ] Database migrated
- [ ] Health check endpoint verified
- [ ] Monitoring configured

## Project Structure
```text
.
├── .github/workflows/maven.yml              # GitHub Actions CI pipeline
├── .mvn/wrapper/                            # Maven wrapper binaries/properties
├── mvnw                                     # Maven wrapper launcher (Unix)
├── mvnw.cmd                                 # Maven wrapper launcher (Windows)
├── pom.xml                                  # Build/dependency configuration
├── src/main/java/com/example/fashionshop/
│   ├── FashionShopApplication.java          # Spring Boot entry point
│   ├── common/                              # Shared responses, mappers, enums, exceptions, utils
│   ├── config/                              # Security and application configuration
│   ├── security/                            # JWT filter, token service, auth entry point, UserDetailsService
│   └── modules/
│       ├── auth/                            # Authentication API/service/dto
│       ├── user/                            # User profile + admin account management
│       ├── category/                        # Category APIs and persistence
│       ├── product/                         # Product browse/manage APIs and business logic
│       ├── cart/                            # Cart domain, APIs, and quantity rules
│       ├── wishlist/                        # Wishlist APIs and persistence
│       ├── order/                           # Checkout/order placement/history/status management
│       ├── payment/                         # Payment domain + gateway abstraction/implementations
│       ├── invoice/                         # Invoice APIs and management flows
│       ├── dashboard/                       # Dashboard and homepage aggregate data
│       └── notification/                    # Notification service abstraction
├── src/main/resources/application.properties # Local runtime configuration
└── src/test/java/com/example/fashionshop/   # Unit/slice tests by module
```

## Contributing
- **Branch naming:** Use `feature/<scope>`, `fix/<scope>`, `chore/<scope>`, or `docs/<scope>`.
- **Commit format:** Prefer Conventional Commits (e.g., `feat(order): add cancellation reason validation`).
- **PR process:**
  1. Create a branch from `main`.
  2. Implement and test changes locally.
  3. Update documentation and API contracts when behavior changes.
  4. Open a PR with summary, test evidence, and migration/config notes.
  5. Require at least one reviewer approval before merge.

## License
No `LICENSE` file is present in this repository. By default, the project is unlicensed and all rights are reserved by the repository owner.
