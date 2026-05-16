require('dotenv').config();
const db = require('./src/models');

async function resetAndTest() {
  try {
    console.log('🔄 Kết nối database...');
    await db.sequelize.authenticate();
    console.log('✅ Kết nối thành công');

    console.log('\n🗑️  Xoá dữ liệu booking cũ...');
    // Xoá theo thứ tự để tránh lỗi foreign key
    await db.ThanhToan.destroy({ where: {} });
    console.log('  ✅ Xoá thanh toán');

    await db.ChiTietBooking.destroy({ where: {} });
    console.log('  ✅ Xoá chi tiết booking');

    await db.Booking.destroy({ where: {} });
    console.log('  ✅ Xoá booking');

    console.log('\n✨ Database sạch sẽ!');
    console.log('\n📝 Bây giờ test API:\n');

    console.log('1️⃣  TẠO BOOKING:');
    console.log('   curl -X POST http://localhost:3000/booking/create \\');
    console.log('     -H "Content-Type: application/json" \\');
    console.log('     -d \'{"UserID":1,"TongTien":500000}\'\n');

    console.log('2️⃣  THANH TOÁN (thay MaBooking=1):');
    console.log('   curl -X POST http://localhost:3000/booking/pay/1 \\');
    console.log('     -H "Content-Type: application/json" \\');
    console.log('     -d \'{"amount":500000,"method":"vnpay"}\'\n');

    console.log('3️⃣  KIỂM TRA BOOKING (thay MaBooking=1):');
    console.log('   curl http://localhost:3000/booking/1\n');

    console.log('4️⃣  PAYMENT SUCCESS CALLBACK (thay MaBooking=1):');
    console.log('   curl "http://localhost:3000/api/payment/success?MaBooking=1&amount=500000&method=vnpay"\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  }
}

resetAndTest();
