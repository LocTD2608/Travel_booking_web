const Booking = require("../models/Booking");
const bookingQueue = require("../queues/bookingQueue");

// Đặt vé
exports.createBooking = async (req, res) => {
  try {
    const booking = await Booking.create({
      UserID: 1, // test 
      ThoiDiemDat: new Date(),
      TongTien: 100000,
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
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Not found" });
    }

    booking.TrangThaiBooking = "DA_THANH_TOAN";
    booking.ThoiDiemThanhToan = new Date();

    await booking.save();

    res.json({ message: "Đã thanh toán" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};