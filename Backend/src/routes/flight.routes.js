const express = require("express");
const router = express.Router();
const flightController = require("../controllers/flight.controller");

// GET flight detail
router.get("/:id", flightController.getFlightDetail);

module.exports = router;