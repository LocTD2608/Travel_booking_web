const { Queue } = require("bullmq");

let bookingQueue = null;

if (process.env.REDIS_URL) {
  try {
    bookingQueue = new Queue("bookingQueue", {
      connection: {
        url: process.env.REDIS_URL,
      },
    });
  } catch (e) {
    console.warn("BookingQueue failed:", e.message);
    bookingQueue = null;
  }
} else {
  console.warn("REDIS_URL not defined, bookingQueue disabled");
}

module.exports = bookingQueue;