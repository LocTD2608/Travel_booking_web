const express = require("express");
const router = express.Router();
const tourController = require("../controllers/tour.controller");

// Search tours with multiple criteria (MUST be before /:id)
router.get("/search/all", tourController.searchTours);

// GET tours by price range
router.get("/search/price", tourController.getToursByPrice);

// GET tours by pickup point
router.get("/search/pickup", tourController.getToursByPickup);

// GET tours by destination
router.get("/search/destination", tourController.getToursByDestination);

// GET all tours
router.get("/", tourController.getAllTours);

// GET tour detail by ID (MUST be last)
router.get("/:id", tourController.getTourDetail);

module.exports = router;
