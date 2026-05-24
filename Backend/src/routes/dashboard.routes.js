const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");
const jwtAuth = require("../middlewares/jwtAuth");
const { isAdmin } = require("../middlewares/auth");

router.get("/", dashboardController.getDashboardStats);
router.get("/top-destinations", jwtAuth, isAdmin, dashboardController.getTopDestinations);

module.exports = router;