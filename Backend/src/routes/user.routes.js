const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const jwtAuth = require("../middlewares/jwtAuth");
const { isAdmin, isUserOrAdmin } = require("../middlewares/auth");

// Base: /api/users
// Admin xem toàn bộ user
router.get("/", jwtAuth, isAdmin, userController.getAllUsers);

// param bắt buộc
router.get("/:id", jwtAuth, isUserOrAdmin, userController.getUserById);

// user sửa chính mình / admin sửa ai cũng được
router.put("/:id", jwtAuth, isUserOrAdmin, userController.updateUser);

// chỉ admin xóa
router.delete("/:id", jwtAuth, isAdmin, userController.deleteUser);

module.exports = router;