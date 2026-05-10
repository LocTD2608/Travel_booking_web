const Booking = require("../models/Booking");
const bookingQueue = require("../queues/bookingQueue");
const sequelize = require("../configs/database");

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

    await t.commit();

    // auto cancel
    await bookingQueue.add(
      "autoCancel",
      { bookingId: booking.MaBooking },
      { delay: 10000 }
    );

    res.json({
      success: true,
      data: booking,
    });

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

    if (booking.TrangThaiBooking === "Đã thanh toán") {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Booking này đã được thanh toán trước đó"
      });
    }

    if (booking.TrangThaiBooking === "Đã hủy") {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Booking đã bị hủy, không thể thanh toán"
      });
    }

    await booking.update(
      {
        TrangThaiBooking: "Đã thanh toán",
        ThoiDiemThanhToan: new Date(),
      },
      { transaction: t }
    );

    console.log("Paid booking:", booking.MaBooking);

    await t.commit();

    res.json({
      success: true,
      message: "Đã thanh toán",
      data: booking
    });

    res.json({ message: "Đã thanh toán", booking });
  } catch (err) {
    if (t) await t.rollback();

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Hủy booking hoàn tiền
exports.cancelBooking = async (req, res) => {
  let t;
  try {
    t = await sequelize.transaction();

    const booking = await Booking.findByPk(req.params.id, {
      transaction: t,
      lock: true
    });

    if (!booking) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Booking không tồn tại"
      });
    }

    if (booking.TrangThaiBooking === "Đã hủy") {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Booking đã bị hủy trước đó"
      });
    }

    let hoanTien = 0;

    // Hoàn tiền nếu đã thanh toán
    if (booking.TrangThaiBooking === "Đã thanh toán") {
      console.log("Hoàn tiền booking:", booking.MaBooking);

      hoanTien = booking.TongTien;

      // test rollback
      // throw new Error("Lỗi khi hoàn tiền");
    }

    await booking.update(
      {
        TrangThaiBooking: "Đã hủy"
      },
      { transaction: t }
    );

    console.log("Cancelled booking:", booking.MaBooking);

    await t.commit();

    res.json({
      success: true,
      message: "Đã hủy booking",
      data: {
        MaBooking: booking.MaBooking,
        TrangThaiBooking: "Đã hủy",
        HoanTien: hoanTien
      }
    });

  } catch (err) {
    if (t) await t.rollback();

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};