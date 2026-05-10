const { Worker } = require("bullmq");
const connection = require("../configs/redis");
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