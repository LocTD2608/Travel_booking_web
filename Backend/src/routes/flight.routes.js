const express = require("express");
const router = express.Router();
const flightController = require("../controllers/flight.controller");
const jwtAuth = require("../middlewares/jwtAuth");
const { isAdmin } = require("../middlewares/auth");

// Flight CRUD
router.get("/", jwtAuth, flightController.getFlights);
router.get("/:id", jwtAuth, flightController.getFlightDetail);
router.get("/:id/seats", jwtAuth, flightController.getFlightSeats);
router.post("/", jwtAuth, isAdmin, flightController.createFlight);
router.put("/:id", jwtAuth, isAdmin, flightController.updateFlight);
router.delete("/:id", jwtAuth, isAdmin, flightController.deleteFlight);

module.exports = router;