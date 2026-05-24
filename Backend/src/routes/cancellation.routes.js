const express = require("express");
const router = express.Router();
const cancellationController = require("../controllers/cancellation.controller");
const jwtAuth = require("../middlewares/jwtAuth");
const { isAdmin } = require("../middlewares/auth");

router.get("/", jwtAuth, isAdmin, cancellationController.getCancellations);
router.put("/:id", jwtAuth, isAdmin, cancellationController.updateCancellationStatus);

module.exports = router;
