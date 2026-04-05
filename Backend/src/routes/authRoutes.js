const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Chỉ chứa router, KHÔNG chứa app.use ở đây
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-otp', authController.verifyOtp);

module.exports = router;