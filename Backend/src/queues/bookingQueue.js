const connection = require("../configs/redis");

let bookingQueue = null;

if (connection) {
  try {
    const { Queue } = require("bullmq");
    bookingQueue = new Queue("bookingQueue", { connection });
  } catch (e) {
    console.warn("⚠️  BookingQueue skipped (Redis not available)");
  }
}

module.exports = bookingQueue;