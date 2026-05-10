const express = require('express');
const {
    createPayment,
    getPayment,
    vnpayCallback,
    processDirectPaymentEndpoint,
    confirmPayment,
    cancelPayment
} = require('../controllers/payment.controller');

const router = express.Router();

/**
 * Payment Routes
 */

// POST /api/payments/create - Tạo đơn hàng thanh toán
router.post('/create', createPayment);

// GET /api/payments/:transactionId - Lấy thông tin transaction
router.get('/:transactionId', getPayment);

// POST /api/payments/vnpay-callback - Callback từ VNPay
router.post('/vnpay-callback', vnpayCallback);

// POST /api/payments/process-direct - Xử lý thanh toán Mock trực tiếp (cho testing)
router.post('/process-direct', processDirectPaymentEndpoint);

// POST /api/payments/confirm - Xác nhận thanh toán thành công
router.post('/confirm', confirmPayment);

// POST /api/payments/cancel - Hủy thanh toán
router.post('/cancel', cancelPayment);

module.exports = router;
