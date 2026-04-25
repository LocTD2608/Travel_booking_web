const db = require("../models");
const bookingQueue = require("../queues/bookingQueue");

// Đặt vé
exports.createBooking = async (req, res) => {
  try {
    const { UserID, TongTien } = req.body;

    const booking = await db.Booking.create({
      UserID: UserID || 1,
      ThoiDiemDat: new Date(),
      TongTien: parseFloat(TongTien) || 100000,
      TrangThaiBooking: "Chưa thanh toán",
    });

    console.log("Created booking:", booking.MaBooking);

    await bookingQueue.add(
      "autoCancel",
      { bookingId: booking.MaBooking },
      { delay: 10000 }
    );

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

    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    const bookings = await db.Booking.findAll({
      where: { UserID: userId },
      order: [['ThoiDiemDat', 'DESC']]
    });

    if (bookings.length === 0) {
      return res.json({ message: "No bookings found", data: [] });
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
      data: bookingsWithDetails
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};