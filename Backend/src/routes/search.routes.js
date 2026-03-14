const express = require("express");
const router = express.Router();
const searchController = require("../controllers/search.controller");

router.get("/flights", searchController.searchFlights);
router.get("/hotels", searchController.searchHotels);

module.exports = router;