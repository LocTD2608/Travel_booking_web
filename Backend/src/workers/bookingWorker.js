const connection = require("../configs/redis");

if (connection) {
  try {
    const { Worker } = require("bullmq");

    const db = require("../models");

    const worker = new Worker(
      "bookingQueue",
      async (job) => {
        const { bookingId } = job.data;

        const booking = await db.Booking.findByPk(bookingId);

        if (!booking) return;

        if (booking.TrangThaiBooking === "Chưa thanh toán") {
          await booking.update({
            TrangThaiBooking: "Đã hủy",
          });

          console.log("Auto cancelled:", bookingId);
        }
      },
      { connection }
    );

    module.exports = worker;
  } catch (e) {
    console.warn("BookingWorker failed to start:", e.message);
    module.exports = null;
  }
} else {
  console.warn("BookingWorker skipped (Redis not available)");
  module.exports = null;
}