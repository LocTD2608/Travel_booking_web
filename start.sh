#!/bin/bash

echo "🚀 Bật Docker containers (MySQL & Redis)..."
docker start booking-mysql booking-redis

echo "========================================="
echo "⚙️  Khởi chạy Backend (Port 3000)..."
echo "========================================="
# Chạy backend ở chế độ background
(cd Backend && npm run dev) &
BACKEND_PID=$!

echo "========================================="
echo "🎨 Khởi chạy Frontend..."
echo "========================================="
# Chạy frontend ở chế độ background
(cd Frontend && npm run dev) &
FRONTEND_PID=$!

# Hàm dọn dẹp khi bấm Ctrl+C
cleanup() {
    echo ""
    echo "🛑 Đang tắt các dịch vụ Frontend và Backend..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
    wait $BACKEND_PID 2>/dev/null
    wait $FRONTEND_PID 2>/dev/null
    echo "✅ Đã tắt hoàn tất."
    exit 0
}

# Lắng nghe sự kiện Ctrl+C
trap cleanup SIGINT SIGTERM

echo "✨ Mọi thứ đã sẵn sàng! Bấm Ctrl+C để dừng cả Frontend và Backend."
echo "Bạn có thể xem log ở bên dưới:"
echo "========================================="

# Chờ tiến trình
wait
