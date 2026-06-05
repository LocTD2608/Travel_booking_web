# 📋 Mock Payment Feature - Hướng Dẫn Chi Tiết

## ✨ Các Feature Đã Hoàn Thành

### 1. **Backend - Payment Service** (`Backend/src/services/payment.service.js`)
- ✅ `createVNPayPaymentUrl()` - Tạo URL thanh toán VNPay với checksum
- ✅ `saveTransaction()` - Lưu transaction vào Redis với TTL 24h
- ✅ `getTransaction()` - Lấy thông tin transaction từ Redis
- ✅ `updateTransactionStatus()` - Cập nhật trạng thái transaction
- ✅ `handleVNPayCallback()` - Xử lý callback từ VNPay
- ✅ `verifyVNPayChecksum()` - Kiểm tra checksum SHA512
- ✅ `processDirectPayment()` - Xử lý thanh toán Mock trực tiếp

### 2. **Backend - Payment Controller** (`Backend/src/controllers/payment.controller.js`)
- ✅ `POST /api/payments/create` - Tạo đơn hàng thanh toán
- ✅ `GET /api/payments/:transactionId` - Lấy thông tin transaction
- ✅ `POST /api/payments/vnpay-callback` - Callback từ VNPay
- ✅ `POST /api/payments/process-direct` - Thanh toán Mock
- ✅ `POST /api/payments/confirm` - Xác nhận thanh toán thành công
- ✅ `POST /api/payments/cancel` - Hủy thanh toán

### 3. **Backend - Payment Routes** (`Backend/src/routes/payment.routes.js`)
- ✅ Tất cả routes đã được kết nối

### 4. **Frontend - Payment API Service** (`Frontend/src/services/paymentApi.ts`)
- ✅ `createPayment()` - Tạo payment
- ✅ `getPayment()` - Lấy thông tin payment
- ✅ `confirmPayment()` - Xác nhận payment
- ✅ `cancelPayment()` - Hủy payment
- ✅ `processDirectPayment()` - Thanh toán Mock
- ✅ `redirectToVNPay()` - Chuyển hướng tới VNPay

### 5. **Frontend - Payment Pages**
- ✅ `PaymentCallback/PaymentCallback.tsx` - Xử lý callback từ VNPay
- ✅ `PaymentSuccess/PaymentSuccess.tsx` - Trang thành công
- ✅ Checkout component đã tích hợp payment

---

## 🧪 Hướng Dẫn Test Feature

### **Bước 1: Khởi động các service**

**Terminal 1 - Redis:**
```bash
redis-cli
# hoặc khởi động Redis server của bạn
```

**Terminal 2 - Backend:**
```bash
cd c:\Booking Travel Web\Backend
npm install
npm run dev
```
Backend sẽ chạy tại `http://localhost:5000`

**Terminal 3 - Frontend:**
```bash
cd c:\Booking Travel Web\Frontend
npm install
npm run dev
```
Frontend sẽ chạy tại `http://localhost:5173`

---

### **Bước 2: Test Backend Payment API (Sử dụng Postman hoặc cURL)**

#### **2.1 Test 1: Tạo Payment (MoMo)**

```bash
curl -X POST http://localhost:5000/api/payments/create \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 2500000,
    "orderId": "ORD-2024-001",
    "orderInfo": "Booking Vinpearl Hotel - 2 nights",
    "userId": "user_123",
    "paymentMethod": "momo",
    "bookingData": {
      "hotelId": 1,
      "roomTypeId": 101,
      "checkIn": "2024-05-01",
      "checkOut": "2024-05-03",
      "nights": 2
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "transactionId": "TXN-1713401234567-ABC123",
  "orderId": "ORD-2024-001",
  "amount": 2500000,
  "paymentMethod": "momo",
  "status": "pending",
  "message": "Payment created successfully"
}
```

#### **2.2 Test 2: Lấy Thông Tin Transaction**

```bash
curl -X GET http://localhost:5000/api/payments/TXN-1713401234567-ABC123
```

**Response:**
```json
{
  "success": true,
  "transaction": {
    "transactionId": "TXN-1713401234567-ABC123",
    "orderId": "ORD-2024-001",
    "userId": "user_123",
    "amount": 2500000,
    "paymentMethod": "momo",
    "status": "pending",
    "bookingData": {...},
    "createdAt": "2024-04-18T10:00:00.000Z",
    "updatedAt": "2024-04-18T10:00:00.000Z"
  }
}
```

#### **2.3 Test 3: Xử Lý Thanh Toán Mock Trực Tiếp**

```bash
curl -X POST http://localhost:5000/api/payments/process-direct \
  -H "Content-Type: application/json" \
  -d '{
    "transactionId": "TXN-1713401234567-ABC123",
    "paymentMethod": "momo",
    "amount": 2500000
  }'
```

**Response:**
```json
{
  "success": true,
  "transactionId": "TXN-1713401234567-ABC123",
  "status": "success",
  "message": "Payment processed successfully",
  "transaction": {...}
}
```

#### **2.4 Test 4: Xác Nhận Thanh Toán**

```bash
curl -X POST http://localhost:5000/api/payments/confirm \
  -H "Content-Type: application/json" \
  -d '{
    "transactionId": "TXN-1713401234567-ABC123",
    "userId": "user_123"
  }'
```

#### **2.5 Test 5: Hủy Thanh Toán**

```bash
curl -X POST http://localhost:5000/api/payments/cancel \
  -H "Content-Type: application/json" \
  -d '{
    "transactionId": "TXN-1713401234567-ABC123",
    "userId": "user_123",
    "reason": "Customer changed mind"
  }'
```

#### **2.6 Test 6: VNPay Payment URL**

```bash
curl -X POST http://localhost:5000/api/payments/create \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 2500000,
    "orderId": "ORD-2024-002",
    "orderInfo": "Booking Marriott Hotel - 3 nights",
    "userId": "user_123",
    "paymentMethod": "vnpay",
    "bookingData": {...}
  }'
```

**Response:**
```json
{
  "success": true,
  "transactionId": "TXN-1713401234567-DEF456",
  "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Version=2.1.0&vnp_Command=pay&...",
  "amount": 2500000,
  "status": "pending"
}
```

---

### **Bước 3: Test Node.js Test File**

Chạy file test tự động:

```bash
cd c:\Booking Travel Web\Backend
node test-payment.js
```

**Output:**
```
🚀 Bắt đầu test Mock Payment Feature...

=== TEST 1: Tạo Payment ===
✅ Success: { success: true, transactionId: 'TXN-1713401234567-ABC123', ... }

=== TEST 2: Lấy thông tin Payment ===
✅ Success: { success: true, transaction: {...} }

=== TEST 3: Xử lý thanh toán Direct (Mock) ===
✅ Success: { success: true, transactionId: '...', status: 'success' }

=== TEST 4: Xác nhận Payment ===
✅ Success: { success: true, message: 'Payment confirmed successfully' }

=== TEST 5: Hủy Payment ===
✅ Success: { success: true, message: 'Payment cancelled successfully' }

=== TEST 6: VNPay Payment URL ===
✅ Success:
Transaction ID: TXN-1713401234567-DEF456
Payment URL: https://sandbox.vnpayment.vn/...

✅ Tất cả tests hoàn thành!
```

---

### **Bước 4: Test Frontend (UI Testing)**

#### **Phương thức 1: Test Checkout Page**

1. Mở browser: `http://localhost:5173`
2. Tìm kiếm khách sạn → Chọn phòng
3. Nhấn "Đặt phòng" → Checkout page
4. Điền thông tin khách hàng
5. Chọn phương thức thanh toán:
   - **MoMo** → Nhấn "Xác nhận & Thanh toán" → Simulate thành công/thất bại
   - **VNPay** → Nhấn "Xác nhận & Thanh toán" → Chuyển hướng tới VNPay Sandbox
   - **Credit Card** → Nhấn "Xác nhận & Thanh toán" → Simulate thành công
   - **Bank Transfer** → Nhấn "Xác nhận & Thanh toán" → Simulate thành công

#### **Phương thức 2: Test Mock Payment Trực Tiếp**

Dùng Postman/cURL gọi API từ Frontend service:

```typescript
// Trong console browser:
import { createPayment, processDirectPayment } from './src/services/paymentApi';

// Tạo payment
const response = await createPayment({
  amount: 2500000,
  orderId: 'ORD-TEST-001',
  userId: 'user_123',
  paymentMethod: 'momo',
  bookingData: {
    hotelId: 1,
    roomTypeId: 101,
    checkIn: '2024-05-01',
    checkOut: '2024-05-03',
    nights: 2
  }
});

// Xử lý thanh toán
const result = await processDirectPayment(
  response.transactionId,
  'momo',
  2500000
);

console.log(result);
```

---

### **Bước 5: Kiểm Tra Redis Data**

```bash
# Mở Redis CLI
redis-cli

# Liệt kê tất cả keys
KEYS *

# Lấy transaction data
HGETALL transaction:TXN-1713401234567-ABC123

# Xem booking hold key
KEYS booking:hold:*
```

---

## 🔍 Chi Tiết Từng Transaction Status

| Status | Mô Tả | Khi nào |
|--------|-------|--------|
| `pending` | Đang chờ thanh toán | Vừa tạo payment |
| `success` | Thanh toán thành công | Sau khi xác nhận thành công |
| `failed` | Thanh toán thất bại | Xử lý payment thất bại |
| `cancelled` | Đã hủy | Người dùng hủy thanh toán |

---

## 📊 Flow Thanh Toán

### **MoMo / Credit / Bank Transfer (Mock Direct)**

```
User fills form
    ↓
Click "Xác nhận & Thanh toán"
    ↓
Frontend → API: createPayment()
    ↓
Backend: saveTransaction() to Redis
    ↓
Backend: Create Redis hold key (10 mins)
    ↓
Frontend → API: processDirectPayment()
    ↓
Backend: Simulate payment (50% success rate)
    ↓
Backend: updateTransactionStatus()
    ↓
Frontend: Show success/failed
    ↓
If success → Navigate to PaymentSuccess page
    ↓
Display booking confirmation
```

### **VNPay Sandbox**

```
User fills form
    ↓
Select "VNPay"
    ↓
Click "Xác nhận & Thanh toán"
    ↓
Frontend → API: createPayment()
    ↓
Backend: Create VNPay payment URL with SHA512 checksum
    ↓
Backend: Save transaction to Redis
    ↓
Frontend: Redirect to VNPay Sandbox
    ↓
User complete payment on VNPay
    ↓
VNPay callback → Backend: /api/payments/vnpay-callback
    ↓
Backend: Verify checksum & update transaction
    ↓
VNPay redirect → Frontend: /payment-callback
    ↓
Frontend: confirmPayment() → Show success
    ↓
Navigate to PaymentSuccess page
```

---

## 🎯 Test Scenarios

### **Scenario 1: Thanh Toán Thành Công (MoMo)**
1. Điền thông tin → Chọn MoMo → Nhấn thanh toán
2. ✅ Kỳ vọng: Hiển thị success message → Chuyển tới PaymentSuccess page
3. ✅ Redis: Transaction status = `success`

### **Scenario 2: Thanh Toán Thất Bại (Credit)**
1. Điền thông tin → Chọn Credit Card → Nhấn thanh toán
2. ✅ Kỳ vọng: ~50% thất bại, hiển thị error message
3. ✅ Redis: Transaction status = `failed`

### **Scenario 3: Hủy Thanh Toán**
1. Tạo payment → Nhấn hủy (cancel button)
2. ✅ Kỳ vọng: Release Redis hold key
3. ✅ Redis: Transaction status = `cancelled`

### **Scenario 4: VNPay Flow**
1. Điền thông tin → Chọn VNPay → Nhấn thanh toán
2. ✅ Kỳ vọng: Redirect tới VNPay Sandbox
3. ✅ Simulate payment trên VNPay
4. ✅ VNPay callback → PaymentCallback page
5. ✅ Confirm → PaymentSuccess page

### **Scenario 5: Countdown Hold (10 mins)**
1. Tạo payment
2. ✅ Kỳ vọng: CountdownHold component hiển thị đếm ngược
3. ✅ Sau 10 phút: Auto release hold, hiển thị modal cảnh báo
4. ✅ Redis: Hold key tự động expired

---

## 🚨 Troubleshooting

| Lỗi | Nguyên Nhân | Giải Pháp |
|-----|-----------|----------|
| Redis connection failed | Redis không chạy | Khởi động Redis server |
| Payment not found | Transaction ID sai | Kiểm tra lại transaction ID |
| Checksum invalid | Secret key không khớp | Đảm bảo HASH_SECRET đúng |
| Hold key not created | Booking data thiếu hotelId | Thêm hotelId vào bookingData |
| CORS error | Frontend port sai | Kiểm tra CORS config |

---

## 📌 API Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/payments/create` | Tạo payment |
| GET | `/api/payments/:txnId` | Lấy thông tin |
| POST | `/api/payments/process-direct` | Mock payment |
| POST | `/api/payments/confirm` | Xác nhận thanh toán |
| POST | `/api/payments/cancel` | Hủy thanh toán |
| POST | `/api/payments/vnpay-callback` | VNPay callback |

---

## ✅ Checklist Hoàn Thành

- ✅ Backend Payment Service (VNPay + Mock)
- ✅ Backend Payment Controller (6 endpoints)
- ✅ Backend Payment Routes
- ✅ Frontend Payment API Service
- ✅ Payment Callback page
- ✅ Payment Success page
- ✅ Checkout integration
- ✅ Redis transaction storage
- ✅ Booking hold + countdown (10 mins)
- ✅ Test file (test-payment.js)
- ✅ Documentation

---

## 📧 Contact & Support

Nếu cần hỗ trợ, vui lòng liên hệ:
- Email: dev@bookingtravelweb.com
- Hotline: 1900-1234
