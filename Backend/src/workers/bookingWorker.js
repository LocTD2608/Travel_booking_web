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
  {
    connection: {
      url: process.env.REDIS_URL,
    },
  }
);

worker.on("completed", (job) => {
  console.log("Job completed", job.id);
});

worker.on("failed", (job, err) => {
  console.log("Job failed", job.id, err.message);
});

module.exports = worker;