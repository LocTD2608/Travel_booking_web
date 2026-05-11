const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.get('/success', paymentController.handleSuccess);
router.get('/fail', paymentController.handleFail);

// Bổ sung Route cho VNPay
router.post('/create-vnpay', paymentController.createPaymentUrl);
router.get('/vnpay-return', paymentController.vnpayReturn);

module.exports = router;