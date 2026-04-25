const express = require("express");
const router = express.Router();

const testController = require("../controllers/test.controller");
const jwtAuth = require("../middlewares/jwtAuth");

// route test tạo booking
router.get("/create-booking", testController.createTestBooking);
//route test jwt
router.get("/protected", jwtAuth, (req, res) => {

  res.json({
    message: "Protected route working",
    user: req.user
  });

});

module.exports = router;