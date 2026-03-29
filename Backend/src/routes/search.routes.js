const express = require("express");
const router = express.Router();
const searchController = require("../controllers/search.controller");

// Base: /api/search
router.get("/flights", searchController.searchFlights);
router.get("/hotels", searchController.searchHotels);
router.get("/trains", searchController.searchTrains);
router.get("/experiences", searchController.searchExperiences);
router.get("/availability", searchController.checkAvailability);

module.exports = router;