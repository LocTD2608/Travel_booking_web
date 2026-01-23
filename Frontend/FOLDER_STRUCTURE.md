# Cấu trúc thư mục Frontend - Booking Travel (Simplified Version)
> 💡 **Phiên bản đơn giản cho dự án nhỏ - Team 2 người - MVP/Giả lập**

## 📁 Cấu trúc tổng quan

```
Frontend/
├── public/
│   ├── images/                    # Hình ảnh tĩnh
│   │   ├── airlines/             # Logo hãng bay
│   │   ├── hotels/               # Hình khách sạn
│   │   └── icons/                # Icons
│   └── favicon.ico
│
├── src/
│   ├── assets/
│   │   └── styles/
│   │       ├── global.css        # Global styles
│   │       ├── variables.css     # CSS variables (colors, fonts)
│   │       └── animations.css    # Animations
│   │
│   ├── components/               # Tất cả components ở đây
│   │   ├── common/              # Components dùng chung
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── DatePicker.tsx
│   │   │   ├── Dropdown.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── Rating.tsx
│   │   │
│   │   ├── layout/              # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navbar.tsx
│   │   │
│   │   ├── flight/              # Flight components
│   │   │   ├── FlightSearchForm.tsx
│   │   │   ├── FlightCard.tsx
│   │   │   ├── FlightFilter.tsx
│   │   │   └── SeatSelection.tsx
│   │   │
│   │   ├── hotel/               # Hotel components
│   │   │   ├── HotelSearchForm.tsx
│   │   │   ├── HotelCard.tsx
│   │   │   ├── HotelFilter.tsx
│   │   │   ├── RoomSelection.tsx
│   │   │   └── HotelGallery.tsx
│   │   │
│   │   ├── bus/                 # Bus components (optional - nếu làm)
│   │   │   ├── BusSearchForm.tsx
│   │   │   ├── BusCard.tsx
│   │   │   └── SeatMap.tsx
│   │   │
│   │   └── booking/             # Booking & Payment
│   │       ├── BookingSummary.tsx
│   │       ├── PriceBreakdown.tsx
│   │       ├── PaymentForm.tsx
│   │       └── BookingConfirmation.tsx
│   │
│   ├── pages/                   # Pages (Routes)
│   │   ├── HomePage.tsx
│   │   ├── FlightSearchPage.tsx
│   │   ├── FlightResultsPage.tsx
│   │   ├── HotelSearchPage.tsx
│   │   ├── HotelResultsPage.tsx
│   │   ├── HotelDetailsPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── PaymentPage.tsx
│   │   ├── MyBookingsPage.tsx
│   │   ├── LoginPage.tsx
│   │   └── NotFoundPage.tsx
│   │
│   ├── hooks/                   # Custom hooks
│   │   ├── useLocalStorage.ts
│   │   ├── useDebounce.ts
│   │   └── useAuth.ts (nếu cần đăng nhập)
│   │
│   ├── services/                # API & Data
│   │   ├── mockData/           # 🎯 MOCK DATA cho giả lập
│   │   │   ├── flights.json
│   │   │   ├── hotels.json
│   │   │   ├── buses.json
│   │   │   └── users.json
│   │   │
│   │   ├── flightService.ts    # Flight logic
│   │   ├── hotelService.ts     # Hotel logic
│   │   └── bookingService.ts   # Booking logic
│   │
│   ├── utils/                   # Utilities
│   │   ├── dateFormat.ts
│   │   ├── priceFormat.ts
│   │   ├── validation.ts
│   │   └── constants.ts
│   │
│   ├── types/                   # TypeScript types (nếu dùng TS)
│   │   ├── flight.ts
│   │   ├── hotel.ts
│   │   ├── booking.ts
│   │   └── common.ts
│   │
│   ├── context/                 # Context (optional)
│   │   ├── AuthContext.tsx     
│   │   └── BookingContext.tsx  
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── router.tsx              # Routes config
│
├── .env.example
├── .gitignore
├── package.json
├── vite.config.ts              # Vite config
├── tsconfig.json               # TypeScript config (nếu dùng TS)
└── README.md
```

---


### 1. **Components theo feature**
```
components/
  common/        → Buttons, Inputs, Cards (dùng chung)
  layout/        → Header, Footer
  flight/        → Flight-specific components
  hotel/         → Hotel-specific components
  booking/       → Checkout flow
```

### 2. **Pages = Routes**
Mỗi page = 1 màn hình:
- `HomePage` - Trang chủ
- `FlightSearchPage` - Tìm vé bay
- `FlightResultsPage` - Kết quả tìm kiếm
- `HotelSearchPage` - Tìm khách sạn
- `CheckoutPage` - Thanh toán
- `MyBookingsPage` - Lịch sử đặt chỗ

### 3. **Services với Mock Data** 🎯
```javascript
// services/mockData/flights.json
[
  {
    "id": "VN123",
    "airline": "Vietnam Airlines",
    "from": "HAN",
    "to": "SGN",
    "departure": "2026-02-01T08:00:00",
    "arrival": "2026-02-01T10:15:00",
    "price": 1500000,
    "seatClass": "Economy"
  }
]

// services/flightService.ts
import flightData from './mockData/flights.json';

export const searchFlights = (from, to, date) => {
  // Giả lập delay API
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = flightData.filter(f => 
        f.from === from && f.to === to
      );
      resolve(results);
    }, 500);
  });
};
```

### 4. **Utils đơn giản**
```typescript
// utils/priceFormat.ts
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

// utils/dateFormat.ts
export const formatDate = (date: Date) => {
  return date.toLocaleDateString('vi-VN');
};
```

---

## 📦 Tech Stack đề xuất (Đơn giản)

### Core
- ✅ **React** + **TypeScript** (hoặc JavaScript nếu quen hơn)
- ✅ **Vite** (fast, modern build tool)
- ✅ **React Router** (routing)

### UI
- ✅ **Ant Design** hoặc **MUI** (component library có sẵn)
  - Không cần tự code Button, Input, DatePicker từ đầu
  - Save thời gian rất nhiều!
- ✅ **CSS Modules** hoặc **Tailwind CSS** (styling)

### State Management
- ✅ **React Context** (đủ cho dự án nhỏ)
- ❌ **KHÔNG cần Redux** (overkill)

### Forms
- ✅ **React Hook Form** (nhẹ, dễ dùng)

### Date & Time
- ✅ **date-fns** hoặc **Day.js** (nhẹ hơn moment.js)

### Mock Data
- ✅ **JSON files** trong `src/services/mockData/`
- ✅ Hoặc **JSON Server** (fake REST API nhanh)

### Icons
- ✅ **React Icons** (có sẵn mọi icon)

---

## 🚀 Workflow làm việc (2 người)

### 👤 Person 1 - Frontend Developer A
**Focus**: Flight + Hotel Search & Results
- `HomePage.tsx`
- `FlightSearchPage.tsx`, `FlightResultsPage.tsx`
- `components/flight/*`
- `HotelSearchPage.tsx`, `HotelResultsPage.tsx`
- `components/hotel/*`

### 👤 Person 2 - Frontend Developer B
**Focus**: Booking Flow + Payment + User
- `CheckoutPage.tsx`
- `PaymentPage.tsx`
- `MyBookingsPage.tsx`
- `components/booking/*`
- `Header.tsx`, `Footer.tsx`

### 🤝 Shared
- `components/common/*` - Ai cần component nào thì tạo
- `mockData/*` - Cùng maintain
- `App.tsx`, `router.tsx` - Setup ban đầu

---

## 📝 Example File Structure

### Component đơn giản
```typescript
// components/flight/FlightCard.tsx
import React from 'react';
import './FlightCard.css'; // hoặc .module.css

interface FlightCardProps {
  flight: {
    id: string;
    airline: string;
    from: string;
    to: string;
    price: number;
  };
  onSelect: (id: string) => void;
}

export const FlightCard: React.FC<FlightCardProps> = ({ flight, onSelect }) => {
  return (
    <div className="flight-card">
      <h3>{flight.airline}</h3>
      <p>{flight.from} → {flight.to}</p>
      <p>{formatPrice(flight.price)}</p>
      <button onClick={() => onSelect(flight.id)}>Chọn</button>
    </div>
  );
};
```

### Page đơn giản
```typescript
// pages/FlightSearchPage.tsx
import React from 'react';
import { FlightSearchForm } from '../components/flight/FlightSearchForm';

export const FlightSearchPage = () => {
  const handleSearch = (searchParams) => {
    // Navigate to results page
  };

  return (
    <div className="page">
      <h1>Tìm vé máy bay</h1>
      <FlightSearchForm onSearch={handleSearch} />
    </div>
  );
};
```

---

## 🎨 Styling Strategy (Choose one)

### Option 1: Ant Design (Recommended cho MVP nhanh)
```bash
npm install antd
```
- Có sẵn DatePicker, Form, Button, Card, Modal...
- Design đẹp, responsive
- Save thời gian coding

### Option 2: Tailwind CSS (Flexible)
```bash
npm install -D tailwindcss postcss autoprefixer
```
- Utility-first
- Customize dễ
- File size nhỏ

### Option 3: Plain CSS/SCSS
- Tự do hoàn toàn
- Mất thời gian hơn

---

## 🗂️ Mock Data Strategy

### Cách 1: JSON Files (Simplest)
```
services/mockData/
  flights.json
  hotels.json
  bookings.json
```

### Cách 2: JSON Server (Better)
```bash
npm install -g json-server
json-server --watch db.json --port 3001
```

`db.json`:
```json
{
  "flights": [...],
  "hotels": [...],
  "bookings": [...]
}
```

Sau đó call API như thật:
```javascript
fetch('http://localhost:3001/flights')
```

---

## ⚡ Quick Start

### 1. Setup project
```bash
npm create vite@latest booking-travel-web -- --template react-ts
cd booking-travel-web
npm install
```

### 2. Install dependencies
```bash
# UI Library
npm install antd

# Routing
npm install react-router-dom

# Forms
npm install react-hook-form

# Date
npm install date-fns

# Icons
npm install react-icons

# (Optional) Mock API
npm install -D json-server
```

### 3. Create folder structure
```bash
mkdir -p src/{components,pages,services,hooks,utils,types,context}
mkdir -p src/components/{common,layout,flight,hotel,booking}
mkdir -p src/services/mockData
mkdir -p public/images/{airlines,hotels,icons}
```

### 4. Start coding! 🚀

---

## 📋 Phân chia công việc gợi ý

### Sprint 1 (Week 1-2): Foundation
- [ ] Setup project, folder structure
- [ ] Create mock data (flights, hotels)
- [ ] Common components (Button, Card, Input)
- [ ] Header, Footer, Router
- [ ] HomePage với hero section

### Sprint 2 (Week 3-4): Flight Module
- [ ] FlightSearchForm
- [ ] FlightResultsPage với mock data
- [ ] FlightCard component
- [ ] Basic filtering

### Sprint 3 (Week 5-6): Hotel Module
- [ ] HotelSearchForm
- [ ] HotelResultsPage
- [ ] HotelCard, HotelDetailsPage
- [ ] Gallery, reviews (mock)

### Sprint 4 (Week 7-8): Booking & Payment
- [ ] CheckoutPage
- [ ] BookingSummary
- [ ] Payment form (giả lập)
- [ ] MyBookingsPage
- [ ] Booking confirmation

### Sprint 5 (Week 9-10): Polish
- [ ] Responsive design
- [ ] Loading states
- [ ] Error handling
- [ ] Form validation
- [ ] Final touches

---

## 🎯 Core Features (MVP)

### Must Have ✅
1. **Flight Search & Booking**
   - Search form (from, to, date)
   - Results list với mock data
   - Flight details
   - Simple booking flow

2. **Hotel Search & Booking**
   - Search form (location, dates, guests)
   - Results list với mock data
   - Hotel details với gallery
   - Room selection

3. **Checkout**
   - Booking summary
   - Contact form
   - Payment form (giả lập)
   - Confirmation page

4. **My Bookings**
   - List bookings
   - View booking details

### Nice to Have (Nếu còn thời gian)
- User authentication (simple)
- Bus booking module
- Filters & sorting
- Wishlist
- Reviews & ratings

---

## 🔑 Key Differences from Enterprise Version

| Enterprise | Small Project (2 people) |
|-----------|------------------------|
| Complex folder nesting | Flat, simple structure |
| Separate files per component | Single file components |
| API integrations | Mock JSON data |
| Testing suite | Manual testing |
| i18n | Single language |
| Redux/complex state | React Context |
| 50+ components | 20-30 components |
| CI/CD pipeline | Simple deployment |

---

## 💡 Tips cho team 2 người

1. **Dùng Component Library** (Ant Design/MUI) - Save 50% thời gian
2. **Mock data trước** - Không cần backend ngay
3. **Git branching đơn giản**: `main`, `dev`, feature branches
4. **Daily sync 15 phút** - Tránh conflict
5. **Code review nhẹ** - Quick review trước khi merge
6. **Focus MVP first** - Feature đẹp hơn là nhiều
7. **Responsive sau** - Desktop first, mobile sau
8. **Deploy early** - Vercel/Netlify free & nhanh

---

Với cấu trúc này:
- ✅ **Đủ dùng** cho MVP/Demo
- ✅ **Không over-engineering**
- ✅ **2 người làm thoải mái** không đụng code nhau
- ✅ **Dễ maintain**, dễ hiểu
- ✅ **Scale được** nếu sau muốn mở rộng

Chúc team làm dự án thành công! 🚀
