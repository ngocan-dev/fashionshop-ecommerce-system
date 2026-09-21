# FashionShop E-Commerce System

Hệ thống thương mại điện tử thời trang gồm giao diện **Next.js**, REST API **Spring Boot** và cơ sở dữ liệu **MySQL**. Dự án hỗ trợ luồng mua sắm của khách hàng và các màn hình quản lý dành cho nhân viên, quản trị viên.

## Mục lục

- [Tổng quan và chức năng](#tong-quan)
- [Công nghệ](#cong-nghe)
- [Kiến trúc và cấu trúc thư mục](#kien-truc)
- [Yêu cầu môi trường](#yeu-cau)
- [Cài đặt và chạy local](#cai-dat)
- [Cấu hình môi trường](#cau-hinh)
- [Tài khoản và luồng dùng thử](#dung-thu)
- [API](#api)
- [Kiểm thử và build](#kiem-thu)
- [Xử lý lỗi thường gặp](#xu-ly-loi)
- [Phạm vi hiện tại](#pham-vi)
- [Tài liệu và đóng góp](#tai-lieu)

<a id="tong-quan"></a>
## Tổng quan và chức năng

| Vai trò | Chức năng chính |
| --- | --- |
| Khách truy cập | Xem trang chủ, danh sách và chi tiết sản phẩm; tìm kiếm; đăng ký, đăng nhập. |
| Khách hàng (`CUSTOMER`) | Quản lý hồ sơ, giỏ hàng và danh sách yêu thích; checkout, đặt hàng, thanh toán; xem lịch sử, chi tiết, trạng thái đơn hàng và hóa đơn; hủy đơn theo điều kiện nghiệp vụ. |
| Nhân viên (`STAFF`) | Quản lý sản phẩm, danh mục; xem và xử lý đơn hàng trong khu vực nhân viên. |
| Quản trị viên (`ADMIN`) | Dashboard, quản lý sản phẩm, danh mục, đơn hàng, tài khoản nhân viên và khách hàng. |

Backend xác thực bằng JWT, mã hóa mật khẩu bằng BCrypt và kiểm soát truy cập theo vai trò. Các module nghiệp vụ gồm xác thực, người dùng, sản phẩm, danh mục, giỏ hàng, wishlist, đơn hàng, thanh toán, hóa đơn và dashboard.

<a id="cong-nghe"></a>
## Công nghệ

| Thành phần | Công nghệ trong mã nguồn |
| --- | --- |
| Frontend | Next.js 16.2.x, React 19.2, TypeScript 5, App Router |
| Giao diện | Tailwind CSS 4, Radix UI, Lucide React, Sonner |
| Dữ liệu và trạng thái | TanStack Query 5, Axios, Zustand 5 |
| Biểu mẫu | React Hook Form 7, Zod 4 |
| Backend | Java 17, Spring Boot 3.3.4, Maven Wrapper |
| Persistence và bảo mật | Spring Data JPA, Spring Security, Jakarta Validation, JJWT 0.12.6, Lombok |
| Cơ sở dữ liệu | MySQL 8; H2 cho kiểm thử backend |
| Kiểm thử | Vitest 3, Testing Library, Spring Boot Test |

Phiên bản dependency frontend được khai báo trong `package.json` và khóa trong `package-lock.json`; backend dùng `pom.xml`.

<a id="kien-truc"></a>
## Kiến trúc và cấu trúc thư mục

```text
Trình duyệt
    │
    ▼
Next.js (:3000) ── HTTP /api/* + JWT ──► Spring Boot (:8081)
                                              │
                                              ▼
                                         MySQL (:3306)
```

Backend tổ chức theo module nghiệp vụ, với các lớp controller, service, repository, entity và DTO. Frontend sử dụng App Router cho các nhóm trang và thư mục `features` để gom dịch vụ, hook, logic theo chức năng.

```text
fashionshop-ecommerce-system/
├── README.md
├── LICENSE
├── database/
│   └── ecommerce_db.sql          # Schema và dữ liệu mẫu
├── fashionshop-backend/
│   ├── docs/                     # Tài liệu nghiệp vụ và test case
│   ├── src/main/java/com/example/fashionshop/
│   │   ├── common/               # Enum, exception, mapper, response
│   │   ├── config/               # Security, CORS, khởi tạo dữ liệu
│   │   ├── modules/              # Các module nghiệp vụ
│   │   └── security/             # JWT, filter, user details
│   ├── src/main/resources/application.properties
│   ├── src/test/                 # Kiểm thử và cấu hình H2
│   ├── pom.xml
│   ├── mvnw
│   └── mvnw.cmd
└── fashionshop-frontend/
    ├── docs/endpoint-mapping.md
    ├── public/
    ├── src/
    │   ├── app/                  # Trang public, customer, staff, admin
    │   ├── components/           # Thành phần giao diện
    │   ├── features/             # Logic theo chức năng
    │   ├── lib/                  # API client và tiện ích
    │   ├── styles/
    │   └── types/
    ├── env.example
    ├── package.json
    └── package-lock.json
```

<a id="yeu-cau"></a>
## Yêu cầu môi trường

- **JDK 17** và biến `JAVA_HOME` trỏ đúng thư mục JDK.
- **Node.js 22.12+ thuộc nhánh 22**, kèm npm, để đáp ứng yêu cầu của Next.js và công cụ kiểm thử trong lockfile.
- **MySQL 8.0+**, có MySQL client hoặc MySQL Workbench. SQL dump dùng collation `utf8mb4_0900_ai_ci`.
- **Git** để tải mã nguồn.
- Kết nối Internet trong lần đầu cài npm dependencies và chạy Maven Wrapper.

Không cần cài Maven riêng khi sử dụng wrapper đi kèm dự án.

```sh
java -version
node --version
npm --version
mysql --version
```

<a id="cai-dat"></a>
## Cài đặt và chạy local

### 1. Tải mã nguồn

```sh
git clone https://github.com/ngocan-dev/fashionshop-ecommerce-system.git
cd fashionshop-ecommerce-system
```

Nếu đã có mã nguồn, mở terminal tại thư mục gốc dự án.

### 2. Khởi tạo cơ sở dữ liệu

Khởi động MySQL, sau đó chạy từ thư mục gốc repository:

```sh
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p ecommerce_db -e "source database/ecommerce_db.sql"
```

Nhập mật khẩu MySQL khi được hỏi. Cách import trên dùng được cả trong PowerShell, không cần toán tử chuyển hướng `<`.

**Lưu ý:** file SQL chứa `DROP TABLE IF EXISTS`, sẽ xóa và tạo lại các bảng tương ứng. Chỉ import vào database local dành cho dự án; sao lưu dữ liệu cần giữ trước khi import lại.

Hibernate đang dùng `ddl-auto=update` để cập nhật schema khi backend khởi động. Cơ chế này không thay thế việc import dữ liệu mẫu.

### 3. Cấu hình và chạy backend

Mở terminal thứ nhất từ thư mục gốc dự án.

**Windows PowerShell:**

```powershell
cd fashionshop-backend
$env:SPRING_DATASOURCE_USERNAME = "root"
$env:SPRING_DATASOURCE_PASSWORD = "your_mysql_password"
.\mvnw.cmd spring-boot:run
```

**macOS / Linux:**

```bash
cd fashionshop-backend
export SPRING_DATASOURCE_USERNAME='root'
export SPRING_DATASOURCE_PASSWORD='your_mysql_password'
sh ./mvnw spring-boot:run
```

Thay `your_mysql_password` bằng mật khẩu MySQL của bạn. Các biến trên chỉ áp dụng trong terminal đang mở. Backend mặc định chạy tại [http://localhost:8081](http://localhost:8081).

### 4. Cấu hình và chạy frontend

Mở terminal thứ hai từ thư mục gốc dự án:

```sh
cd fashionshop-frontend
npm ci
```

Tạo file `.env.local` trong thư mục frontend với nội dung:

```dotenv
NEXT_PUBLIC_API_BASE_URL=http://localhost:8081
```

`env.example` và giá trị fallback trong API client hiện dùng cổng **8080**, nên cần đặt lại thành **8081** để khớp backend. URL này không có hậu tố `/api`, vì các service đã khai báo đường dẫn API.

```sh
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000). Giữ cả hai terminal chạy trong lúc sử dụng ứng dụng.

### 5. Kiểm tra kết nối

Mở [API trang chủ](http://localhost:8081/api/home), hoặc chạy trong PowerShell:

```powershell
Invoke-RestMethod -Uri "http://localhost:8081/api/home"
```

Sau đó kiểm tra danh sách sản phẩm trên frontend và thử đăng nhập. Chỉ mở URL gốc backend không đủ để kiểm tra API nghiệp vụ.

<a id="cau-hinh"></a>
## Cấu hình môi trường

Backend đọc cấu hình từ [application.properties](fashionshop-backend/src/main/resources/application.properties). Có thể ghi đè bằng biến môi trường của tiến trình; backend không tự đọc `.env.local` của frontend.

| Biến | Giá trị mặc định / cách dùng |
| --- | --- |
| `SPRING_DATASOURCE_URL` | JDBC tới `localhost:3306/ecommerce_db`; cấu hình hiện tại có thêm tham số timezone và SQL mode. Chỉ ghi đè khi cần đổi host, port hoặc database. |
| `SPRING_DATASOURCE_USERNAME` | Mặc định `root`; thay bằng tài khoản MySQL của bạn. |
| `SPRING_DATASOURCE_PASSWORD` | Đặt theo môi trường local; không sao chép mật khẩu được lưu trong mã nguồn. |
| `SERVER_PORT` | `8081` |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | `update` |
| `JWT_SECRET` | Khóa ký JWT dạng Base64; dùng khóa riêng cho môi trường triển khai. |
| `JWT_EXPIRATION_MS` | `86400000` mili giây, tương đương 24 giờ. |
| `NEXT_PUBLIC_API_BASE_URL` | Biến frontend: đặt `http://localhost:8081` trong `.env.local`. |

CORS hiện cho phép origin `http://localhost:3000` trong cả `SecurityConfig.java` và `CorsConfig.java`. Khi đổi cổng frontend hoặc dùng domain khác, cập nhật cấu hình CORS tương ứng. Sau khi đổi biến frontend, khởi động lại dev server; với production, build lại để áp dụng giá trị `NEXT_PUBLIC_*`.

<a id="dung-thu"></a>
## Tài khoản và luồng dùng thử

SQL seed chứa ba tài khoản:

| Vai trò | Email | Mật khẩu demo theo README trước đó |
| --- | --- | --- |
| ADMIN | `admin@gmail.com` | `123456` |
| STAFF | `staff@gmail.com` | `123456` |
| CUSTOMER | `customer@gmail.com` | `123456` |

SQL chỉ lưu mật khẩu BCrypt; mật khẩu demo trên được giữ từ tài liệu trước, chưa được xác nhận bằng đăng nhập trong lần cập nhật README này. Các tài khoản chỉ có sau khi import SQL; khởi động backend không tự tạo chúng.

Luồng dùng thử:

1. Vào `/products`, xem và tìm kiếm sản phẩm.
2. Đăng ký tài khoản tại `/register` hoặc đăng nhập tại `/login`.
3. Thêm sản phẩm vào giỏ hàng hoặc wishlist.
4. Vào `/cart`, điều chỉnh số lượng, rồi đến `/checkout` để đặt hàng.
5. Kiểm tra `/orders`, chi tiết đơn và trạng thái thanh toán.
6. Dùng tài khoản nhân viên tại `/staff/products`, `/staff/categories`, `/staff/orders`.
7. Dùng tài khoản quản trị tại `/admin/dashboard`, `/admin/products`, `/admin/orders`, `/admin/staff-accounts`, `/admin/customers`.

<a id="api"></a>
## API

API local dùng base URL `http://localhost:8081`. Các nhóm đường dẫn chính:

| Nhóm | Đường dẫn |
| --- | --- |
| Đăng ký, đăng nhập, đăng xuất | `/api/auth/*` |
| Trang chủ | `/api/home` |
| Sản phẩm, danh mục, storefront | `/api/products/*`, `/api/categories/*`, `/api/store/*` |
| Hồ sơ người dùng | `/api/me`, `/api/users/*` |
| Giỏ hàng và wishlist | `/api/cart/*`, `/api/wishlist/*` |
| Đơn hàng, thanh toán, hóa đơn | `/api/orders/*`, `/api/payments/*`, `/api/invoices/*` |
| Dashboard và quản trị | `/api/dashboard/*`, `/api/admin/*` |

Endpoint được bảo vệ yêu cầu header:

```http
Authorization: Bearer <access_token>
```

Response dùng envelope chung dạng:

```json
{
  "success": true,
  "message": "Homepage loaded successfully",
  "data": {}
}
```

`data` thay đổi tùy endpoint; ví dụ trên chỉ minh họa cấu trúc. Tham khảo [bảng ánh xạ API](fashionshop-frontend/docs/endpoint-mapping.md) và các controller để biết HTTP method, payload và quyền cụ thể. Một số đường dẫn màn hình trong bảng ánh xạ có thể chưa theo cấu trúc route hiện tại.

<a id="kiem-thu"></a>
## Kiểm thử và build

### Frontend

Chạy trong `fashionshop-frontend`:

| Lệnh | Mục đích |
| --- | --- |
| `npm ci` | Cài dependency theo lockfile. |
| `npm run dev` | Chạy development server. |
| `npm run lint` | Kiểm tra bằng ESLint. |
| `npm run test` | Chạy Vitest ở chế độ watch. |
| `npm run test:run` | Chạy toàn bộ test một lần. |
| `npm run test:ui` | Mở Vitest UI nếu có dependency `@vitest/ui` tương thích. |
| `npm run build` | Tạo production build. |
| `npm run start` | Chạy production server sau khi build thành công. |

Script `test:ui` đã được khai báo nhưng `@vitest/ui` chưa có trong `package.json`; dùng `test:run` cho quy trình kiểm thử hiện có.

### Backend

Chạy trong `fashionshop-backend`:

| Windows PowerShell | macOS / Linux | Mục đích |
| --- | --- | --- |
| `.\mvnw.cmd test` | `sh ./mvnw test` | Chạy test. |
| `.\mvnw.cmd clean package` | `sh ./mvnw clean package` | Chạy test và đóng gói JAR. |
| `.\mvnw.cmd verify` | `sh ./mvnw verify` | Chạy lifecycle đến bước verify. |

Test backend dùng H2 in-memory trong `src/test/resources/application.properties`, với `ddl-auto=create-drop`. H2 không thay thế việc kiểm tra tích hợp thực tế với MySQL.

Sau khi đóng gói, chạy JAR trong cùng terminal đã cấu hình biến môi trường:

```sh
java -jar target/fashionshop-0.0.1-SNAPSHOT.jar
```

<a id="xu-ly-loi"></a>
## Xử lý lỗi thường gặp

| Hiện tượng | Cách kiểm tra / xử lý |
| --- | --- |
| Frontend không tải được dữ liệu | Kiểm tra backend đang chạy, `.env.local` trỏ đến cổng `8081`, rồi restart frontend. |
| Lỗi CORS | Dùng `http://localhost:3000`; `127.0.0.1` hoặc cổng khác là origin khác, cần cập nhật CORS backend. |
| MySQL `Access denied` | Kiểm tra username, password và quyền truy cập database; đặt lại biến môi trường trong terminal chạy backend. |
| MySQL `Communications link failure` | Kiểm tra MySQL service, host và cổng `3306`. |
| Import báo không hỗ trợ collation | Kiểm tra đang dùng MySQL 8.0+ phù hợp với SQL dump. |
| Không có sản phẩm / tài khoản mẫu | Kiểm tra đã import SQL vào đúng database; không import lại trên dữ liệu cần giữ nếu chưa sao lưu. |
| API trả `401` | Đăng nhập lại; kiểm tra JWT còn hạn và header Authorization. |
| API trả `403` | Kiểm tra vai trò của tài khoản và quyền endpoint. |
| Cổng `3000` hoặc `8081` bị chiếm | Dừng tiến trình đang chiếm cổng hoặc đổi cổng, đồng thời cập nhật API URL và CORS. |
| Maven không chạy được | Kiểm tra `JAVA_HOME`, `java -version` và kết nối tải dependency. |
| npm báo engine không phù hợp | Kiểm tra phiên bản Node theo phần yêu cầu; chạy lại `npm ci` sau khi đổi Node. |

<a id="pham-vi"></a>
## Phạm vi hiện tại

- Thanh toán có các implementation **mock** cho MoMo, VNPay và banking; chưa phải kết nối giao dịch thật với nhà cung cấp.
- `NotificationServiceImpl` hiện ghi log thông báo đơn hàng; chưa gửi email, SMS hay push notification.
- `DataInitializer` tự đặt tồn kho thành **50** cho từng sản phẩm đang hoạt động có tồn kho `0` hoặc `null` mỗi lần ứng dụng sẵn sàng. Cần điều chỉnh hành vi này trước khi dùng cho tồn kho thực tế.
- Cấu hình hiện tại hướng đến local development: CORS cố định, Hibernate `update`, tài khoản mẫu và cấu hình JWT mặc định. Khi triển khai cần cấu hình riêng cho môi trường, quản lý secret và schema phù hợp.
- Dự án sử dụng giấy phép [MIT](LICENSE). Xem file giấy phép để biết điều kiện sử dụng và phân phối.

<a id="tai-lieu"></a>
## Tài liệu và đóng góp

- [Tài liệu frontend](fashionshop-frontend/README.md)
- [Tài liệu backend](fashionshop-backend/README.md)
- [Ánh xạ endpoint với frontend](fashionshop-frontend/docs/endpoint-mapping.md)
- [Thiết kế phân hệ đơn hàng](fashionshop-backend/docs/order-subsystem.md)
- [Test case lịch sử đơn hàng](fashionshop-backend/docs/uc33-order-history-testcase.md)
- [Test case theo dõi đơn hàng](fashionshop-backend/docs/uc34-track-order-status-testcase.md)

README gốc này mô tả cấu trúc repository và cổng backend `8081` hiện tại. Nếu tài liệu thành phần còn khác biệt về đường dẫn hoặc phiên bản, đối chiếu với `package.json`, `pom.xml`, cấu hình và controller trong mã nguồn.

Khi đóng góp, tạo nhánh riêng, mô tả rõ thay đổi và cách kiểm chứng, chạy các kiểm tra liên quan trước khi mở pull request. Không commit `.env.local`, thông tin đăng nhập hoặc dữ liệu cá nhân vào repository.
