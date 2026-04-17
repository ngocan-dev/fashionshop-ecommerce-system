# FashionShop

Ứng dụng web full-stack cho hệ thống bán hàng thời trang, gồm storefront cho khách hàng, khu vực vận hành cho staff, và dashboard quản trị cho admin.

## Mục lục

- [Mô tả dự án](#mô-tả-dự-án)
- [Tính năng chính](#tính-năng-chính)
- [Tech stack](#tech-stack)
- [Kiến trúc tổng quan](#kiến-trúc-tổng-quan)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Yêu cầu môi trường](#yêu-cầu-môi-trường)
- [Hướng dẫn cài đặt](#hướng-dẫn-cài-đặt)
- [Cấu hình file `.env`](#cấu-hình-file-env)
- [Hướng dẫn chạy local](#hướng-dẫn-chạy-local)
- [Hướng dẫn build production](#hướng-dẫn-build-production)
- [API overview](#api-overview)
- [Quy trình phát triển / scripts hữu ích](#quy-trình-phát-triển--scripts-hữu-ích)
- [Troubleshooting](#troubleshooting)
- [Hướng dẫn đóng góp](#hướng-dẫn-đóng-góp)
- [License](#license)

## Mô tả dự án

`FashionShop` là monorepo cho một hệ thống e-commerce thời trang với hai phần chính:

- `fashionshop-frontend`: frontend Next.js cho guest, customer, staff, admin
- `fashionshop-backend`: backend Spring Boot cung cấp REST API, authentication, business logic và truy cập dữ liệu
- `database`: SQL dump để dựng dữ liệu mẫu local

Hệ thống hỗ trợ các luồng chính như đăng ký/đăng nhập, duyệt sản phẩm, giỏ hàng, wishlist, checkout, thanh toán, theo dõi đơn hàng, quản lý sản phẩm, quản lý người dùng và dashboard vận hành.

## Tính năng chính

- Xác thực bằng JWT với các vai trò `CUSTOMER`, `STAFF`, `ADMIN`
- Storefront cho khách vãng lai và khách hàng: xem sản phẩm, chi tiết sản phẩm, cart, wishlist, checkout
- Quản lý đơn hàng và trạng thái đơn hàng cho customer/staff/admin
- Quản lý sản phẩm và danh mục cho staff/admin
- Quản lý tài khoản staff/customer và dashboard tổng quan cho admin
- Thanh toán mock qua các gateway như `MOMO`, `VNPAY` và online payment abstraction
- Xem invoice và lịch sử giao dịch theo đơn hàng

## Tech stack

| Layer | Công nghệ |
| --- | --- |
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4 |
| UI / State | Radix UI, TanStack Query, Zustand, React Hook Form, Zod, Sonner |
| Backend | Spring Boot 3.3.4, Java 21, Spring Web, Spring Data JPA, Spring Security |
| Authentication | JWT |
| Database | MySQL 8 |
| Testing | Vitest, Testing Library, JUnit 5, Spring Boot Test, H2 |
| Package manager frontend | npm |
| Build tools | Maven Wrapper (`mvnw`, `mvnw.cmd`) và Next.js build |

## Kiến trúc tổng quan

### Monorepo layout

- Frontend chạy độc lập tại `http://localhost:3000`
- Backend API chạy mặc định tại `http://localhost:8081`
- Frontend gọi backend qua `NEXT_PUBLIC_API_BASE_URL`
- Database local dùng MySQL với schema `ecommerce_db`

### Backend architecture

Backend được tổ chức theo kiểu modular monolith, chia theo domain:

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

Mỗi module đi theo flow quen thuộc:

```text
controller -> service -> repository -> entity
```

### Frontend architecture

Frontend dùng Next.js App Router, chia route theo role:

- `(public)`: trang công khai như home, products, login, register
- `(customer)`: cart, checkout, orders, invoices, account
- `(staff)`: quản lý products, categories, orders
- `(admin)`: dashboard, customer accounts, staff accounts

Business logic phía frontend nằm chủ yếu trong `src/features`, UI tái sử dụng trong `src/components`, helper/API nằm trong `src/lib`.

## Cấu trúc thư mục

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

## Yêu cầu môi trường

| Thành phần | Phiên bản khuyến nghị |
| --- | --- |
| Node.js | `>= 18` |
| npm | `>= 9` |
| Java | `21` |
| MySQL | `8.x` |
| Maven | Không bắt buộc nếu dùng Maven Wrapper |

Gợi ý cho Windows:

- Có `mysql` trong `PATH` nếu muốn dùng `start.bat`
- Nếu không có, chỉnh lại đường dẫn MySQL hoặc chạy backend/frontend thủ công

## Hướng dẫn cài đặt

### 1. Clone repository

```bash
git clone TODO: your-repository-url
cd ecommerce-system-se
```

### 2. Chuẩn bị database

Tạo database:

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

Import dữ liệu mẫu:

```bash
mysql -u root -p ecommerce_db < database/ecommerce_db.sql
```

### 3. Cài dependencies cho frontend

```bash
cd fashionshop-frontend
npm install
cd ..
```

### 4. Kiểm tra cấu hình backend

File backend hiện dùng:

`fashionshop-backend/src/main/resources/application.properties`

Bạn cần kiểm tra lại tối thiểu:

- `spring.datasource.url`
- `spring.datasource.username`
- `spring.datasource.password`
- `server.port`
- `jwt.secret`

## Cấu hình file `.env`

## Frontend

Frontend dùng file `.env.local`.

Tạo file:

`fashionshop-frontend/.env.local`

Nội dung mẫu:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8081
```

Lưu ý:

- `env.example` hiện đang để `http://localhost:8080`
- Backend thực tế trong repo đang chạy ở `8081`
- Nếu dùng `start.bat`, script sẽ tự tạo `.env.local` với giá trị `http://localhost:8081`

## Backend

Backend hiện chưa dùng file `.env` riêng. Cấu hình local đang nằm trong:

`fashionshop-backend/src/main/resources/application.properties`

Ví dụ các biến tương ứng nếu bạn muốn externalize bằng environment variables:

| Environment variable | Ý nghĩa |
| --- | --- |
| `SPRING_DATASOURCE_URL` | JDBC URL tới MySQL |
| `SPRING_DATASOURCE_USERNAME` | Username MySQL |
| `SPRING_DATASOURCE_PASSWORD` | Password MySQL |
| `SERVER_PORT` | Port backend |
| `JWT_SECRET` | Secret ký JWT |
| `JWT_EXPIRATION_MS` | Thời gian hết hạn token |

Ví dụ:

```env
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/ecommerce_db?createDatabaseIfNotExist=true&serverTimezone=Asia/Ho_Chi_Minh
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=TODO: your-mysql-password
SERVER_PORT=8081
JWT_SECRET=TODO: base64-encoded-secret
JWT_EXPIRATION_MS=86400000
```

## Hướng dẫn chạy local

## Cách 1: Chạy nhanh bằng `start.bat`

File `start.bat` hỗ trợ:

- hỏi mật khẩu MySQL root
- tạo/import database
- cập nhật password vào `application.properties`
- tạo `.env.local` cho frontend
- cài `npm install` nếu cần
- mở 2 cửa sổ riêng để chạy backend và frontend

Chạy trên Windows:

```bat
start.bat
```

Sau khi chạy:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8081`

Demo accounts được script hiển thị:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@gmail.com` | `123456` |
| Staff | `staff@gmail.com` | `123456` |
| Customer | `customer@gmail.com` | `123456` |

Lưu ý quan trọng:

- Script hiện đang trỏ tới `ecommerce_db.sql` ở repo root, trong khi file SQL thực tế nằm ở `database/ecommerce_db.sql`
- Nếu `start.bat` báo không tìm thấy file SQL, hãy sửa biến `SQLFILE` trong script hoặc import database thủ công theo hướng dẫn bên dưới

## Cách 2: Chạy thủ công từng phần

### Chạy backend

```bash
cd fashionshop-backend
mvnw.cmd spring-boot:run
```

Hoặc nếu dùng shell Unix-like:

```bash
cd fashionshop-backend
./mvnw spring-boot:run
```

Backend mặc định chạy tại:

```text
http://localhost:8081
```

### Chạy frontend

```bash
cd fashionshop-frontend
npm run dev
```

Frontend mặc định chạy tại:

```text
http://localhost:3000
```

## Hướng dẫn build production

## Build backend

```bash
cd fashionshop-backend
mvnw.cmd clean package
```

Artifact đầu ra sẽ nằm trong:

```text
fashionshop-backend/target/
```

Chạy file JAR sau khi build:

```bash
java -jar target/fashionshop-0.0.1-SNAPSHOT.jar
```

## Build frontend

```bash
cd fashionshop-frontend
npm run build
npm run start
```

## Gợi ý deploy cơ bản

- Frontend có thể deploy lên Vercel hoặc một Node server
- Backend có thể deploy lên VM/container chạy Java 21
- MySQL nên được provision riêng cho môi trường staging/production
- Cần externalize cấu hình thay vì hard-code credential trong `application.properties`

TODO: bổ sung tài liệu deploy chính thức cho môi trường production/staging nếu dự án có hạ tầng cụ thể

## API overview

Base URL local:

```text
http://localhost:8081
```

Response envelope chung:

```json
{
  "success": true,
  "message": "OK",
  "data": {}
}
```

### Authentication

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Đăng ký |
| `POST` | `/api/auth/login` | Đăng nhập |
| `POST` | `/api/auth/logout` | Đăng xuất |

### Storefront / catalog

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| `GET` | `/api/home` | Dữ liệu trang chủ |
| `GET` | `/api/store/products` | Danh sách sản phẩm storefront |
| `GET` | `/api/store/products/{idOrSlug}` | Chi tiết sản phẩm storefront |
| `GET` | `/api/categories` | Danh sách danh mục |

### Customer flows

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| `GET` | `/api/cart` | Lấy giỏ hàng |
| `POST` | `/api/cart/items` | Thêm sản phẩm vào giỏ |
| `PUT` | `/api/cart/items/{itemId}` | Cập nhật item trong giỏ |
| `DELETE` | `/api/cart/items/{itemId}` | Xóa item khỏi giỏ |
| `GET` | `/api/wishlist` | Lấy wishlist |
| `POST` | `/api/wishlist/items` | Thêm vào wishlist |
| `GET` | `/api/orders/checkout-summary` | Tóm tắt checkout |
| `POST` | `/api/orders` | Tạo đơn hàng |
| `GET` | `/api/orders/my` | Danh sách đơn của tôi |
| `GET` | `/api/orders/my/{orderId}` | Chi tiết đơn hàng |
| `PATCH` | `/api/orders/my/{orderId}/cancel` | Hủy đơn hàng |
| `POST` | `/api/payments/orders/{orderId}/pay` | Thanh toán cho đơn |
| `GET` | `/api/invoices/my/{invoiceId}` | Xem invoice của tôi |

### Staff / admin flows

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| `GET` | `/api/products/manage` | Danh sách sản phẩm để quản lý |
| `POST` | `/api/products` | Tạo sản phẩm |
| `PUT` | `/api/products/manage/{id}` | Cập nhật sản phẩm |
| `DELETE` | `/api/products/manage/{id}` | Xóa sản phẩm |
| `GET` | `/api/orders/manage` | Danh sách đơn hàng để xử lý |
| `PATCH` | `/api/orders/manage/{orderId}/status` | Cập nhật trạng thái đơn |
| `GET` | `/api/dashboard` | Dashboard tổng quan |
| `GET` | `/api/admin/staff-accounts` | Danh sách tài khoản staff |
| `GET` | `/api/admin/customer-accounts` | Danh sách tài khoản customer |

Tài liệu mapping đầy đủ frontend <-> backend có tại:

`fashionshop-frontend/docs/endpoint-mapping.md`

## Quy trình phát triển / scripts hữu ích

## Frontend scripts

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

## Backend scripts

```bash
cd fashionshop-backend
mvnw.cmd spring-boot:run
mvnw.cmd test
mvnw.cmd clean package
mvnw.cmd verify
```

## Quy trình làm việc gợi ý

1. Khởi động MySQL và import dữ liệu mẫu
2. Chạy backend trước
3. Cấu hình `.env.local` cho frontend trỏ đúng backend port
4. Chạy frontend
5. Chạy test trước khi tạo PR

## Troubleshooting

### 1. Frontend không gọi được backend

Kiểm tra:

- file `fashionshop-frontend/.env.local`
- giá trị `NEXT_PUBLIC_API_BASE_URL`
- backend đang chạy ở `8081` hay `8080`

Hiện trạng repo:

- `application.properties` dùng `8081`
- `env.example` fallback là `8080`

Nếu bị lệch port, hãy sửa `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8081
```

### 2. `start.bat` không import được database

Nguyên nhân thường gặp:

- MySQL chưa chạy
- sai mật khẩu `root`
- `mysql` chưa có trong `PATH`
- script đang tìm `ecommerce_db.sql` ở sai vị trí

Khắc phục nhanh:

- import thủ công bằng `database/ecommerce_db.sql`
- hoặc sửa dòng `set SQLFILE=...` trong `start.bat`

### 3. Backend không kết nối được MySQL

Kiểm tra file:

`fashionshop-backend/src/main/resources/application.properties`

Đảm bảo đúng:

- host
- port
- username
- password
- tên database `ecommerce_db`

### 4. Lỗi CORS khi gọi API

Backend hiện cho phép origin:

```text
http://localhost:3000
```

Nếu frontend chạy ở origin khác, cần cập nhật cấu hình CORS trong backend.

### 5. Test backend lỗi khác database local

Backend test đang dùng H2 in-memory trong:

`fashionshop-backend/src/test/resources/application.properties`

Vì vậy test không cần MySQL thật cho phần lớn test cases.

## Hướng dẫn đóng góp

1. Tạo branch mới từ `main`
2. Giữ thay đổi nhỏ, rõ phạm vi
3. Chạy test/lint liên quan trước khi push
4. Cập nhật docs nếu thay đổi API, config hoặc flow chính
5. Tạo pull request với mô tả ngắn gọn, cách test và ảnh chụp nếu có UI change

Quy ước khuyến nghị:

- branch: `feature/...`, `fix/...`, `docs/...`, `chore/...`
- commit: ưu tiên Conventional Commits, ví dụ `feat(order): add order status tracking`

## License

Dự án sử dụng giấy phép `MIT`.

Chi tiết xem tại file `LICENSE`.

TODO: cập nhật dòng `Copyright (c)` trong `LICENSE` theo tên cá nhân, nhóm hoặc tổ chức sở hữu dự án.
