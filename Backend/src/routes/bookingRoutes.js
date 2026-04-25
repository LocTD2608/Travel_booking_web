const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

router.post("/create", bookingController.createBooking);
router.post("/pay/:id", bookingController.payBooking);
router.get("/user/:userId", bookingController.getUserBookings);
router.get("/:id", bookingController.getBooking);

module.exports = router;