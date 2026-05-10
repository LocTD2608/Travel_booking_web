const express = require("express");
const router = express.Router();
const hotelController = require("../controllers/hotel.controller");

// GET hotel detail by ID
router.get("/:id", hotelController.getHotelDetail);

module.exports = router;
