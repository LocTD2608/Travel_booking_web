const express = require("express");
const router = express.Router();
const tourController = require("../controllers/tour.controller");

// GET all tours
router.get("/", tourController.getAllTours);

// GET tour detail by ID
router.get("/:id", tourController.getTourDetail);

// Search tours with multiple criteria
router.get("/search/all", tourController.searchTours);

// GET tours by price range
router.get("/search/price", tourController.getToursByPrice);

// GET tours by pickup point
router.get("/search/pickup", tourController.getToursByPickup);

// GET tours by destination
router.get("/search/destination", tourController.getToursByDestination);

module.exports = router;
