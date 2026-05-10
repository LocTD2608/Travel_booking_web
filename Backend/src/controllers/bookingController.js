const db = require("../models");
const bookingQueue = require("../queues/bookingQueue");

// Đặt vé
exports.createBooking = async (req, res) => {
  try {
    const { UserID, TongTien, details } = req.body;

    const booking = await db.Booking.create({
      UserID: UserID || 1,
      ThoiDiemDat: new Date(),
      TongTien: parseFloat(TongTien) || 100000,
      TrangThaiBooking: "Chưa thanh toán",
    });

    if (details && Array.isArray(details) && details.length > 0) {
      const lastCT = await db.ChiTietBooking.findOne({
        order: [['MaCTBooking', 'DESC']]
      });
      let nextId = lastCT ? lastCT.MaCTBooking + 1 : 1;

      const chiTietPromises = details.map(d => {
        const ctBooking = db.ChiTietBooking.create({
          MaCTBooking: nextId,
          MaBooking: booking.MaBooking,
          SoLuongNguoi: d.nights || 1, // Using SoLuongNguoi for nights/quantity
          DonGia: d.price || 0,
          LoaiDoiTuong: d.type || 'unknown',
          TenDichVu: d.name || '',
          HinhAnh: d.image || '',
          ThongTinThem: JSON.stringify({
            detail1: d.detail1,
            detail2: d.detail2,
            detail3: d.detail3,
            detail4: d.detail4
          })
        });
        nextId++;
        return ctBooking;
      });
      await Promise.all(chiTietPromises);
    }

    console.log("Created booking:", booking.MaBooking);

    try {
      await bookingQueue.add(
        "autoCancel",
        { bookingId: booking.MaBooking },
        { delay: 10 * 60 * 1000 } // 10 phút
      );
    } catch (queueErr) {
      console.warn("[Queue] Redis không khả dụng, bỏ qua autoCancel:", queueErr.message);
    }

    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Thanh toán
exports.payBooking = async (req, res) => {
  try {
    const { amount, method } = req.body;
    const booking = await db.Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.TrangThaiBooking = "DA_THANH_TOAN";
    booking.ThoiDiemThanhToan = new Date();

    await booking.save();

    await db.ThanhToan.create({
      MaBooking: booking.MaBooking,
      PhuongThucThanhToan: method || "manual",
      SoTien: parseFloat(amount) || booking.TongTien,
      TrangThaiTT: "success",
      ThoiDiemThanhToan: new Date(),
    });

    res.json({ message: "Đã thanh toán", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getBooking = async (req, res) => {
  try {
    const booking = await db.Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const details = await db.ChiTietBooking.findAll({ where: { MaBooking: booking.MaBooking } });
    const payments = await db.ThanhToan.findAll({ where: { MaBooking: booking.MaBooking } });

    res.json({ booking, details, payments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    const { count, rows: bookings } = await db.Booking.findAndCountAll({
      where: { UserID: userId },
      order: [['ThoiDiemDat', 'DESC']],
      limit: limit,
      offset: offset
    });

    if (bookings.length === 0) {
      return res.json({ message: "No bookings found", data: [], totalItems: count, totalPages: 0, currentPage: page });
    }

    const bookingsWithDetails = await Promise.all(
      bookings.map(async (booking) => {
        const details = await db.ChiTietBooking.findAll({
          where: { MaBooking: booking.MaBooking }
        });
        const payments = await db.ThanhToan.findAll({
          where: { MaBooking: booking.MaBooking }
        });

        return {
          booking,
          details,
          payments
        };
      })
    );

    res.json({
      message: `Found ${bookings.length} booking(s)`,
      data: bookingsWithDetails,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};