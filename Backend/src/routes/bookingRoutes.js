const express = require("express");
const router = express.Router();
const jwtAuth = require("../middlewares/jwtAuth");
const { isAdmin } = require("../middlewares/auth");
const bookingController = require("../controllers/bookingController");

router.post("/create", bookingController.createBooking);
router.post("/pay/:id", bookingController.payBooking);
router.post("/cancel/:id", bookingController.cancelBooking);
router.get("/stats", jwtAuth, isAdmin, bookingController.getBookingStats);
router.get("/user/:userId", bookingController.getUserBookings);
router.get("/all", bookingController.getAllBookings);
router.get("/detail/:id", bookingController.getBookingDetail);

module.exports = router;