const express = require("express");
const router = express.Router();
const roomController = require("../controllers/room.controller");

router.get("/rooms/:id", roomController.getRoomDetail);

module.exports = router;