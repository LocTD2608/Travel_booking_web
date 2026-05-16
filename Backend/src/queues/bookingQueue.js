const { Queue } = require("bullmq");
const connection = require("../configs/redis");

const bookingQueue = new Queue("bookingQueue", {
  connection,
});

module.exports = bookingQueue;