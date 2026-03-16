const express = require("express");
const router = express.Router();

const jwtAuth = require("../middlewares/jwtAuth");

router.get("/protected", jwtAuth, (req, res) => {

  res.json({
    message: "Protected route working",
    user: req.user
  });

});

module.exports = router;