const express = require("express");
const router = express.Router();
const cancellationController = require("../controllers/cancellation.controller");
const jwtAuth = require("../middlewares/jwtAuth");
const { isAdmin } = require("../middlewares/auth");

router.get("/", jwtAuth, isAdmin, cancellationController.getCancellations);
router.put("/:id", jwtAuth, isAdmin, cancellationController.updateCancellationStatus);

// User-facing routes
router.post("/", jwtAuth, cancellationController.requestCancellation);
router.get("/my-cancellations", jwtAuth, cancellationController.getUserCancellations);
router.get("/notifications", jwtAuth, cancellationController.getNotifications);
router.post("/acknowledge/:id", jwtAuth, cancellationController.acknowledgeNotification);

module.exports = router;
