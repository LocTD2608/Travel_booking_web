# ✈️ Travel Booking Web - Hệ Thống Đặt Vé & Quản Lý Dịch Vụ Du Lịch

> **🌐 Link Deploy Demo (Netlify):** [https://glistening-griffin-134eb9.netlify.app/](https://glistening-griffin-134eb9.netlify.app/)
>
> **⚙️ Link API Backend (Render):** `https://travel-booking-web-backend.onrender.com/api`

---

## 📝 Giới thiệu Dự án

**Travel Booking Web** là ứng dụng đặt dịch vụ du lịch trực tuyến toàn diện (SPA - Single Page Application), giúp người dùng dễ dàng tìm kiếm, đặt chỗ và thanh toán cho các dịch vụ: **Vé máy bay, Phòng khách sạn (Hotel/Villa/Apartment), Tour du lịch**. Ngoài ra, hệ thống tích hợp phân hệ **Thanh toán hóa đơn tiện ích** (nạp thẻ, mua data, đóng tiền điện) cùng với cổng quản trị **Admin CMS** trực quan dành cho người vận hành hệ thống.

---

## ✨ Các Tính Năng Cốt Lõi

### 1. Phân hệ Khách hàng (User Portal)
* **Xác thực tài khoản:** Đăng ký, đăng nhập JWT, khôi phục mật khẩu thông qua xác thực mã OTP gửi về Email.
* **Hồ sơ cá nhân (Profile):** Quản lý thông tin cá nhân, thay đổi mật khẩu và cập nhật thông tin CCCD/Hộ chiếu.
* **Tìm kiếm đa dịch vụ:** Tìm kiếm chuyến bay, khách sạn, tour du lịch tích hợp bộ gợi ý Autocomplete thông minh và đồng bộ liên kết URL.
* **Bộ lọc kết quả:** Lọc và sắp xếp dịch vụ nâng cao (theo khoảng giá, hãng bay, giờ bay, số sao, tiện ích đi kèm).
* **Quy trình đặt chỗ thời gian thực:**
  * **Chuyến bay:** Sơ đồ chọn ghế ngồi trực quan (chọn thủ công hoặc tự động xếp ghế).
  * **Khách sạn:** Chọn phòng (Hotels, Villas, Apartments) dựa trên ngày nhận/trả phòng và số lượng trống thực tế trong kho.
  * **Tour & Hoạt động:** Đặt chỗ trải nghiệm vui chơi giải trí theo ngày khởi hành.
* **Khuyến mãi (Promo Codes):** Xem các chương trình ưu đãi hiện hành, sao chép nhanh mã coupon bằng Clipboard API và dán áp dụng chiết khấu tại Checkout.
* **Thanh toán trực tuyến:** Tích hợp cổng thanh toán trực tuyến **VNPay (Sandbox)** và cổng thanh toán giả lập **Mock Payment** (Thẻ tín dụng, ví điện tử MoMo, ngân hàng nội địa).
* **Lịch sử đặt vé:** Quản lý danh sách dịch vụ đã đặt và theo dõi các trạng thái đơn hàng (Chưa thanh toán, Đã thanh toán, Đã hủy).
* **Yêu cầu hủy đặt vé & Hoàn tiền:** Gửi lý do hủy đơn hàng đối với các vé/phòng đã thanh toán thành công để chờ Admin phê duyệt.
* **Thanh toán hóa đơn tiện ích (Utility Bills):** Nạp tiền điện thoại (Mobile Credit), gói Data di động, và đóng tiền điện sinh hoạt trực tiếp.
* **Giao diện đa ngôn ngữ:** Chuyển đổi linh hoạt song ngữ Tiếng Việt và Tiếng Anh.

### 2. Phân hệ Quản trị (Admin Portal)
* **Dashboard Thống kê:** Báo cáo tổng doanh thu doanh số (vẽ biểu đồ trực quan), số lượng đơn hàng mới và lượng người dùng đăng ký.
* **Quản lý người dùng:** Danh sách tài khoản thành viên hệ thống, hỗ trợ Khóa/Mở khóa tài khoản (ngăn chặn Admin tự khóa chính mình).
* **Quản lý dịch vụ bay:** Thêm mới lịch bay, cập nhật lịch trình bay, điều chỉnh giá vé cơ bản và thay đổi trạng thái hoãn/hủy chuyến bay.
* **Quản lý cơ sở lưu trú:** Quản lý danh mục khách sạn/villa/apartments và phân cấp cấu hình loại phòng (Room Types) đi kèm giá/số lượng phòng trống.
* **Quy trình duyệt hủy hoàn tiền:** Tiếp nhận, phê duyệt/từ chối yêu cầu hủy của khách và tự động khôi phục số lượng phòng trống hoặc ghế máy bay trống trả về hệ thống.

---

## 🛠️ Công Nghệ Sử Dụng

### Frontend (Client-side)
* **Framework:** React 19 (Vite), TypeScript.
* **Styling:** Vanilla CSS, CSS Modules, Tailwind CSS.
* **Thư viện UI:** Ant Design (AntD), Framer Motion (Animation mượt mà).
* **Biểu đồ:** Recharts.
* **Kết nối API:** Axios, Fetch API.

### Backend (Server-side)
* **Framework:** Node.js, Express (API RESTful).
* **Database & ORM:** MySQL, Sequelize ORM.
* **Bảo mật:** JSON Web Token (JWT), bcryptjs (băm mật khẩu salt=10).
* **Hàng đợi & Caching:** Redis, BullMQ (xử lý hủy phòng tự động sau 10 phút nếu chưa thanh toán).
* **Truyền thông:** Nodemailer (Gửi hóa đơn, gửi mã OTP khôi phục mật khẩu).

---

## 📁 Cấu Trúc Thư Mục Chính

```text
Travel_booking_web/
├── Frontend/               # Mã nguồn ứng dụng Client (React)
│   ├── src/
│   │   ├── components/     # UI Components dùng chung (Header, Footer, AuthModal...)
│   │   ├── context/        # Quản lý State toàn cục (Auth, Language)
│   │   ├── pages/          # Các trang chính (Home, Booking, Profile, Admin Portal...)
│   │   ├── services/       # Tích hợp API (userApi, paymentApi, cancellationApi...)
│   │   └── App.tsx         # Định tuyến Router (React Router Dom v7)
│   └── package.json
│
├── Backend/                # Mã nguồn ứng dụng Server (Express API)
│   ├── src/
│   │   ├── config/         # Cấu hình Database & các service
│   │   ├── controllers/    # Xử lý logic API (user, booking, payment, cancellation...)
│   │   ├── middlewares/    # Middleware xác thực & phân quyền (jwtAuth, isAdmin)
│   │   ├── models/         # Khai báo cấu trúc bảng cơ sở dữ liệu Sequelize
│   │   └── routes/         # Định nghĩa các đường dẫn URL API
│   ├── server.js           # Điểm khởi chạy server chính
│   └── package.json
│
└── Database/               # Chứa các file SQL backup và hạt giống dữ liệu (Seeds)
```

---

## 💻 Hướng Dẫn Cài Đặt & Chạy Dưới Local

### 1. Yêu cầu hệ thống
* Node.js (phiên bản v18 trở lên)
* MySQL Server đang hoạt động
* Redis Server (để chạy hàng đợi BullMQ đặt giữ chỗ)

### 2. Cấu hình cơ sở dữ liệu (MySQL)
1. Tạo một cơ sở dữ liệu mới trong MySQL:
   ```sql
   CREATE DATABASE travel_booking_db;
   ```
2. Cấu hình thông tin kết nối trong file `.env` của Backend.

### 3. Cài đặt Backend
1. Di chuyển vào thư mục Backend:
   ```bash
   cd Backend
   ```
2. Cài đặt các thư viện:
   ```bash
   npm install
   ```
3. Tạo file `.env` trong thư mục `Backend/` và điền cấu hình:
   ```env
   PORT=3000
   DB_HOST=127.0.0.1
   DB_USER=root
   DB_PASS=your_password
   DB_NAME=travel_booking_db
   DB_PORT=3306
   JWT_SECRET=your_jwt_secret_key
   REDIS_HOST=127.0.0.1
   REDIS_PORT=6379
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```
4. Khởi chạy dữ liệu hạt giống (Seed) và chạy server ở chế độ phát triển:
   ```bash
   npm run dev
   ```

### 4. Cài đặt Frontend
1. Di chuyển vào thư mục Frontend:
   ```bash
   cd ../Frontend
   ```
2. Cài đặt các thư viện:
   ```bash
   npm install
   ```
3. Khởi chạy dev server:
   ```bash
   npm run dev
   ```
4. Truy cập website local tại địa chỉ hiển thị: `http://localhost:5173/`

---

## 🧑‍💻 Tài Khoản Thử Nghiệm Giao Diện
* **Tài khoản Thành viên (User):** `hoangnguyen@gmail.com` / `password123`
* **Tài khoản Quản trị viên (Admin):** `admin_van@gmail.com` / `password123`
