const express = require("express");
const router = express.Router();
const roomController = require("../controllers/room.controller");

// Route lấy chi tiết phòng
router.get("/rooms/:id", roomController.getRoomDetail);
// Route xử lý đặt phòng và trừ số lượng
router.post("/rooms/book", roomController.handleRoomBooking);

module.exports = router;