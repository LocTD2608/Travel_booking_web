const cron = require("node-cron");
const { Op } = require("sequelize");
const { Booking } = require("../models");

cron.schedule("*/2 * * * *", async () => {
  console.log("Running cron...");

  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

  const bookings = await Booking.findAll({
    where: {
      TrangThaiBooking: "Chưa thanh toán",
      ThoiDiemDat: {
        [Op.lt]: tenMinutesAgo,
      },
    },
  });

  for (let b of bookings) {
    b.TrangThaiBooking = "DA_HUY";
    await b.save();
  }
});