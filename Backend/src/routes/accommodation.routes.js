const express = require("express");
const router = express.Router();
const accommodationController = require("../controllers/accommodation.controller");
const jwtAuth = require("../middlewares/jwtAuth");
const { isAdmin } = require("../middlewares/auth");

// Accommodations Routes
router.get("/", jwtAuth, accommodationController.getAccommodations);
router.get("/:id", jwtAuth, accommodationController.getAccommodationById);
router.post("/", jwtAuth, isAdmin, accommodationController.createAccommodation);
router.put("/:id", jwtAuth, isAdmin, accommodationController.updateAccommodation);
router.delete("/:id", jwtAuth, isAdmin, accommodationController.deleteAccommodation);

// Rooms Routes under Accommodation
router.get("/:id/rooms", jwtAuth, accommodationController.getRooms);
router.post("/:id/rooms", jwtAuth, isAdmin, accommodationController.addRoom);
router.put("/:id/rooms/:roomId", jwtAuth, isAdmin, accommodationController.updateRoom);
router.delete("/:id/rooms/:roomId", jwtAuth, isAdmin, accommodationController.deleteRoom);

module.exports = router;
