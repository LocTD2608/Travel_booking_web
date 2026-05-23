require('dotenv').config();
const { Booking } = require("./src/models");
const sequelize = require("./src/configs/database");

async function fixDB() {
  try {
    // Kết nối database
    await sequelize.authenticate();
    console.log("Connected to DB.");

    // Lấy tất cả bookings
    const bookings = await Booking.findAll();
    let count = 0;

    for (let b of bookings) {
      let currentStatus = b.TrangThaiBooking;
      let newStatus = currentStatus;

      // Sửa lỗi font (Mojibake) hoặc các mã tiếng Anh
      if (currentStatus.includes("thanh to") || currentStatus === "DA_THANH_TOAN" || currentStatus === "SUCCESS") {
        newStatus = "Đã thanh toán";
      } else if (currentStatus.includes("h") && currentStatus.includes("y") && !currentStatus.includes("thanh") || currentStatus === "DA_HUY" || currentStatus === "CANCELLED") {
        newStatus = "Đã hủy";
      } else if (currentStatus.includes("Ch") || currentStatus === "pending" || currentStatus === "PENDING") {
        newStatus = "Chưa thanh toán";
      }

      if (newStatus !== currentStatus) {
        b.TrangThaiBooking = newStatus;
        await b.save();
        count++;
        console.log(`Updated booking ${b.MaBooking} from '${currentStatus}' to '${newStatus}'`);
      }
    }

    console.log(`Successfully fixed ${count} bookings!`);
    process.exit(0);
  } catch (error) {
    console.error("Error fixing DB:", error);
    process.exit(1);
  }
}

fixDB();
