const fs = require("fs");
const path = require("path");
const db = require("../models");

const dataFilePath = path.join(__dirname, "../data/cancellations.json");

// Helper to read data
const readData = () => {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return [];
    }
    const raw = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("Error reading cancellations database:", error);
    return [];
  }
};

// Helper to write data
const writeData = (data) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing cancellations database:", error);
  }
};

exports.getCancellations = async (req, res) => {
  try {
    const data = readData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Không thể lấy danh sách yêu cầu hủy", error: error.message });
  }
};

exports.updateCancellationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'approved' | 'rejected'

    if (!status || !["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ. Phải là 'approved' hoặc 'rejected'" });
    }

    const data = readData();
    const index = data.findIndex((c) => c.id === id);
    if (index === -1) {
      return res.status(404).json({ message: "Không tìm thấy yêu cầu hủy" });
    }

    const request = data[index];
    request.status = status;
    writeData(data);

    // Đồng bộ trạng thái sang bảng Booking thực tế nếu đó là ID số (real DB booking)
    const bookingIdNum = parseInt(request.bookingId.replace(/\D/g, ""), 10);
    if (!isNaN(bookingIdNum)) {
      try {
        const booking = await db.Booking.findByPk(bookingIdNum);
        if (booking) {
          const newBookingStatus = status === "approved" ? "Đã hoàn tiền" : "Đã thanh toán";
          await booking.update({ TrangThaiBooking: newBookingStatus });
          console.log(`[SYNC] Updated real booking #${bookingIdNum} status to: ${newBookingStatus}`);
        }
      } catch (dbErr) {
        console.error(`[SYNC ERROR] Could not sync status for booking #${bookingIdNum}:`, dbErr.message);
      }
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: "Không thể cập nhật yêu cầu hủy", error: error.message });
  }
};
