const express = require("express");
const router = express.Router();

const hotelController = require("../controllers/hotel.controller");

// GET all hotels
router.get("/", hotelController.getAllHotels);

// GET hotel detail by ID
router.get("/:id", hotelController.getHotelDetail);

// CREATE hotel
router.post("/", hotelController.createHotel);

// UPDATE hotel
router.put("/:id", hotelController.updateHotel);

// DELETE hotel
router.delete("/:id", hotelController.deleteHotel);

module.exports = router;