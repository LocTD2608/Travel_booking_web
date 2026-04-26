const Booking = require("../models/Booking");
// const bookingQueue = require("../queues/bookingQueue");
const sequelize = require("../configs/database");

// Đặt vé
exports.createBooking = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const booking = await Booking.create(
      {
        UserID: 1,
        ThoiDiemDat: new Date(),
        TongTien: 100000,
        TrangThaiBooking: "Chưa thanh toán",
      },
      { transaction: t }
    );

    console.log("Created booking:", booking.MaBooking);

    // auto cancel (tạm tắt để test Transaction Rollback)
    // await bookingQueue.add(
    //   "autoCancel",
    //   { bookingId: booking.MaBooking },
    //   { delay: 10000 }
    // );

    await t.commit();

    res.json({
      success: true,
      data: booking,
    });

  } catch (err) {
    await t.rollback();

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Thanh toán
exports.payBooking = async (req, res) => {
  let t;
  try {
    t = await sequelize.transaction();

    const booking = await Booking.findByPk(req.params.id, {
      transaction: t,
      lock: true
    });

    if (!booking) {
      await t.rollback();
      return res.status(404).json({ success: false, message: "Not found" });
    }

    // Kiểm tra thanh toán
    if (booking.TrangThaiBooking === "Đã thanh toán") {
        await t.rollback();
        return res.status(400).json({ success: false, message: "Booking này đã được thanh toán trước đó" });
    }

    await booking.update(
      {
        TrangThaiBooking: "Đã thanh toán",
        ThoiDiemThanhToan: new Date(),
      },
      { transaction: t }
    );
    // Test
    // throw new Error("Lỗi để test rollback");

    console.log("Paid booking:", booking.MaBooking);

    await t.commit();
    res.json({ success: true, message: "Đã thanh toán", data: booking });

  } catch (err) {
    if (t) await t.rollback();
    res.status(500).json({ success: false, message: err.message });
  }
};