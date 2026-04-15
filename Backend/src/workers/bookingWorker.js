const { Worker } = require("bullmq");
const connection = require("../configs/redis");
const Booking = require("../models/Booking");

const worker = new Worker(
  "bookingQueue",
  async (job) => {
    const { bookingId } = job.data;

    const booking = await Booking.findByPk(bookingId);

    if (booking && booking.TrangThaiBooking === "Chưa thanh toán") {
      booking.TrangThaiBooking = "DA_HUY";
      await booking.save();

      console.log("Auto cancelled:", bookingId);
    }
  },
  { connection }
);

module.exports = worker;