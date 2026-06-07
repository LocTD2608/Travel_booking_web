const fs = require("fs");
const path = require("path");
const db = require("../models");
const sendMail = require("../utils/sendMail");

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
    const isRealBooking = /^\d+$/.test(request.bookingId);
    if (isRealBooking) {
      const bookingIdNum = parseInt(request.bookingId, 10);
      try {
        const booking = await db.Booking.findByPk(bookingIdNum);
        if (booking) {
          const newBookingStatus = status === "approved" ? "Đã hoàn tiền" : "Đã thanh toán";
          await booking.update({ TrangThaiBooking: newBookingStatus });
          console.log(`[SYNC] Updated real booking #${bookingIdNum} status to: ${newBookingStatus}`);

          // Gửi email thông báo cho user
          const user = await db.User.findByPk(booking.UserID);
          if (user && user.Email) {
            const isApproved = status === "approved";
            const subject = isApproved 
              ? `[Travel Booking] Xác nhận hoàn tiền thành công cho đơn đặt chỗ #${bookingIdNum}`
              : `[Travel Booking] Từ chối yêu cầu hủy đơn đặt chỗ #${bookingIdNum}`;
            
            const html = `
              <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
                <h2 style="color: ${isApproved ? '#16a34a' : '#dc2626'}; border-bottom: 2px solid ${isApproved ? '#16a34a' : '#dc2626'}; padding-bottom: 10px;">
                  Yêu cầu hủy đặt chỗ ${isApproved ? 'Đã được phê duyệt' : 'Bị từ chối'}
                </h2>
                <p>Xin chào <strong>${user.HoTen || user.Ten || 'Khách hàng'}</strong>,</p>
                <p>Yêu cầu hủy đặt chỗ và hoàn tiền đối với mã đơn hàng <strong>#${bookingIdNum}</strong> của bạn đã được quản trị viên xử lý.</p>
                
                <div style="background-color: #f8fafc; border-left: 4px solid ${isApproved ? '#16a34a' : '#dc2626'}; padding: 15px; margin: 20px 0; border-radius: 4px;">
                  <p style="margin: 5px 0;"><strong>Dịch vụ:</strong> ${request.bookingDetail} (${request.bookingClass || 'N/A'})</p>
                  <p style="margin: 5px 0;"><strong>Kết quả:</strong> ${isApproved ? '<span style="color:#16a34a; font-weight:bold;">Đồng ý hoàn tiền</span>' : '<span style="color:#dc2626; font-weight:bold;">Từ chối hủy (Vé/Phòng giữ nguyên)</span>'}</p>
                  <p style="margin: 5px 0;"><strong>Lý do hủy gửi lên:</strong> "${request.reason}"</p>
                  <p style="margin: 5px 0;"><strong>Trạng thái giao dịch mới:</strong> ${newBookingStatus}</p>
                </div>
                
                ${isApproved ? '<p><i>* Tiền sẽ được hoàn trả lại tài khoản thanh toán của quý khách trong vòng 3 - 5 ngày làm việc.</i></p>' : ''}
                
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
                <p>Cảm ơn bạn đã tin tưởng sử dụng dịch vụ của Travel Booking.</p>
              </div>
            `;
            sendMail({ to: user.Email, subject, html }).catch((mailErr) => {
              console.error("[MAIL ERROR] Failed to send cancellation status email:", mailErr.message);
            });
          }
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

// User tạo yêu cầu hủy đặt vé/phòng
exports.requestCancellation = async (req, res) => {
  try {
    const { bookingId, reason } = req.body;
    const userId = req.user.UserID;

    if (!bookingId || !reason) {
      return res.status(400).json({ message: "Mã đặt chỗ và lý do hủy là bắt buộc." });
    }

    // 1. Kiểm tra booking trong DB
    const booking = await db.Booking.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Không tìm thấy đơn đặt vé này." });
    }

    if (booking.UserID !== userId) {
      return res.status(403).json({ message: "Bạn không có quyền thực hiện thao tác trên đơn đặt vé này." });
    }

    const isValidStatus = booking.TrangThaiBooking === "Đã thanh toán" || booking.TrangThaiBooking === "DA_THANH_TOAN";
    if (!isValidStatus) {
      return res.status(400).json({ message: "Chỉ đơn hàng đã thanh toán thành công mới được phép yêu cầu hủy hoàn tiền." });
    }

    // 2. Kiểm tra yêu cầu hủy trùng lặp (chỉ trùng nếu có yêu cầu pending và booking cũng đang ở trạng thái Yêu cầu hủy)
    const data = readData();
    const existing = data.find(
      (c) => c.bookingId === String(bookingId) && 
             c.status === "pending" && 
             booking.TrangThaiBooking === "Yêu cầu hủy"
    );
    if (existing) {
      return res.status(400).json({ message: "Đơn đặt chỗ này đã có yêu cầu hủy trước đó." });
    }

    // 3. Lấy chi tiết dịch vụ của Booking
    const details = await db.ChiTietBooking.findAll({ where: { MaBooking: bookingId } });
    const detail = details[0] || {};
    let extraInfo = {};
    try {
      if (detail.ThongTinThem) {
        extraInfo = JSON.parse(detail.ThongTinThem);
      }
    } catch (e) {}

    // 4. Tạo ID CRxxx mới
    const maxNum = data.reduce((max, item) => {
      const num = parseInt(item.id.replace("CR", ""), 10);
      return isNaN(num) ? max : Math.max(max, num);
    }, 7); // Default base max is 7 from existing CR007
    const nextId = "CR" + String(maxNum + 1).padStart(3, "0");

    const newRequest = {
      id: nextId,
      bookingId: String(bookingId),
      customerName: `${req.user.Ho || req.user.ho || ''} ${req.user.Ten || req.user.ten || ''}`.trim() || "Khách hàng",
      customerEmail: req.user.Email || "",
      bookingType: detail.LoaiDoiTuong || "hotel",
      bookingDetail: detail.TenDichVu || "N/A",
      bookingClass: extraInfo.detail1 || "",
      reason: reason,
      requestedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      status: "pending",
      userId: userId,
      acknowledged: false
    };

    data.push(newRequest);
    writeData(data);

    // 5. Cập nhật trạng thái booking sang "Yêu cầu hủy"
    await booking.update({ TrangThaiBooking: "Yêu cầu hủy" });

    res.status(201).json({ success: true, message: "Đã gửi yêu cầu hủy thành công. Đang chờ phê duyệt.", request: newRequest });
  } catch (error) {
    console.error("Error creating cancellation request:", error);
    res.status(500).json({ message: "Lỗi hệ thống khi tạo yêu cầu hủy", error: error.message });
  }
};

// Lấy danh sách các thông báo phê duyệt hoàn tiền của user (chưa acknowledged)
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.UserID;
    const data = readData();

    // Lọc ra các yêu cầu hủy của user mà đã được duyệt/từ chối và chưa thông báo cho user (acknowledged === false)
    const userNotifications = data.filter(
      (c) => c.userId === userId && c.acknowledged === false && c.status !== "pending"
    );

    res.json(userNotifications);
  } catch (error) {
    res.status(500).json({ message: "Không thể lấy thông tin thông báo", error: error.message });
  }
};

// Xác nhận đã xem thông báo
exports.acknowledgeNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.UserID;

    const data = readData();
    const index = data.findIndex((c) => c.id === id);

    if (index === -1) {
      return res.status(404).json({ message: "Không tìm thấy thông báo cần xác nhận" });
    }

    const request = data[index];
    if (request.userId !== userId) {
      return res.status(403).json({ message: "Bạn không có quyền xác nhận thông báo này" });
    }

    request.acknowledged = true;
    writeData(data);

    res.json({ success: true, message: "Đã ghi nhận đã đọc thông báo" });
  } catch (error) {
    res.status(500).json({ message: "Không thể xác nhận thông báo", error: error.message });
  }
};

exports.getUserCancellations = async (req, res) => {
  try {
    const userId = req.user.UserID;
    const data = readData();
    const userCancellations = data.filter((c) => c.userId === userId);
    res.json(userCancellations);
  } catch (error) {
    res.status(500).json({ message: "Không thể lấy danh sách yêu cầu hủy của bạn", error: error.message });
  }
};

