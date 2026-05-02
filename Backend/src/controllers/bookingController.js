const Booking = require("../models/Booking");
const bookingQueue = require("../queues/bookingQueue");

// Đặt vé
exports.createBooking = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const booking = await Booking.create({
      UserID: 1, // test 
      ThoiDiemDat: new Date(),
      TongTien: 100000,
      TrangThaiBooking: "Chưa thanh toán",
    });

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
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Not found" });
    }

    booking.TrangThaiBooking = "DA_THANH_TOAN";
    booking.ThoiDiemThanhToan = new Date();

    await booking.save();

    res.json({ message: "Đã thanh toán" });
  } catch (err) {
    if (t) await t.rollback();
    res.status(500).json({ success: false, message: err.message });
  }
};