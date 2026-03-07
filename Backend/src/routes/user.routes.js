const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { isAdmin, isUserOrAdmin } = require("../middlewares/auth");

// Base: /api/users

router.post("/", isAdmin, userController.createUser);
router.get("/", isAdmin, userController.getAllUsers);
router.get("/:id", isUserOrAdmin, userController.getUserById);
router.put("/:id", isUserOrAdmin, userController.updateUser);
router.delete("/:id", isAdmin, userController.deleteUser);

module.exports = router;
