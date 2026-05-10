const {
    createVNPayPaymentUrl,
    saveTransaction,
    getTransaction,
    updateTransactionStatus,
    handleVNPayCallback,
    processDirectPayment,
    TRANSACTION_STATUS
} = require('../services/payment.service');
const { setHold, releaseHold } = require('../services/reservation.service');

/**
 * POST /api/payments/create - Tạo đơn hàng thanh toán
 */
const createPayment = async (req, res) => {
    try {
        const {
            amount,
            orderId,
            orderInfo,
            userId,
            paymentMethod,
            bookingData,
            ipAddress
        } = req.body;

        // Validate
        if (!amount || !orderId || !userId || !paymentMethod) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Lưu transaction vào Redis
        const transactionId = await saveTransaction({
            orderId,
            userId,
            amount,
            paymentMethod,
            bookingData,
            status: TRANSACTION_STATUS.PENDING
        });

        // Tạo hold booking nếu là khách sạn (600s = 10 phút)
        if (bookingData?.hotelId) {
            await setHold('hotel', bookingData.hotelId, userId, 600);
        }

        let paymentData = {
            success: true,
            transactionId,
            orderId,
            amount,
            paymentMethod,
            status: TRANSACTION_STATUS.PENDING,
            message: 'Payment created successfully'
        };

        // Nếu dùng VNPay, tạo payment URL
        if (paymentMethod === 'vnpay') {
            const paymentUrl = createVNPayPaymentUrl({
                amount,
                orderId: transactionId,
                orderInfo: orderInfo || `Booking order ${orderId}`,
                customerId: userId,
                ipAddress: ipAddress || '127.0.0.1'
            });
            paymentData.paymentUrl = paymentUrl.paymentUrl;
        }

        res.status(200).json(paymentData);
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating payment',
            error: error.message
        });
    }
};

/**
 * GET /api/payments/:transactionId - Lấy thông tin transaction
 */
const getPayment = async (req, res) => {
    try {
        const { transactionId } = req.params;

        const transaction = await getTransaction(transactionId);
        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        res.status(200).json({
            success: true,
            transaction
        });
    } catch (error) {
        console.error('Error getting payment:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting payment',
            error: error.message
        });
    }
};

/**
 * POST /api/payments/vnpay-callback - Callback từ VNPay
 */
const vnpayCallback = async (req, res) => {
    try {
        const vnpParams = req.query;

        const result = await handleVNPayCallback(vnpParams);

        if (result.success) {
            return res.status(200).json({
                success: true,
                message: 'Payment verified successfully',
                transactionId: result.transactionId
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed'
            });
        }
    } catch (error) {
        console.error('Error in VNPay callback:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing callback',
            error: error.message
        });
    }
};

/**
 * POST /api/payments/process-direct - Xử lý thanh toán Mock trực tiếp (cho testing)
 */
const processDirectPaymentEndpoint = async (req, res) => {
    try {
        const { transactionId, paymentMethod, amount } = req.body;

        if (!transactionId || !paymentMethod) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        const result = await processDirectPayment({
            transactionId,
            paymentMethod,
            amount
        });

        res.status(200).json({
            success: result.success,
            transactionId: result.transactionId,
            status: result.status,
            message: result.success ? 'Payment processed successfully' : 'Payment failed',
            transaction: result.transaction
        });
    } catch (error) {
        console.error('Error processing direct payment:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing payment',
            error: error.message
        });
    }
};

/**
 * POST /api/payments/confirm - Xác nhận thanh toán thành công (sau khi user hoàn tất)
 */
const confirmPayment = async (req, res) => {
    try {
        const { transactionId, userId } = req.body;

        if (!transactionId) {
            return res.status(400).json({
                success: false,
                message: 'Transaction ID is required'
            });
        }

        const transaction = await getTransaction(transactionId);
        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        // Cập nhật trạng thái thành SUCCESS
        const updated = await updateTransactionStatus(
            transactionId,
            TRANSACTION_STATUS.SUCCESS,
            {
                confirmedAt: new Date().toISOString(),
                confirmedBy: userId
            }
        );

        // Release hold sau khi thanh toán thành công
        if (transaction.bookingData?.hotelId && userId) {
            await releaseHold('hotel', transaction.bookingData.hotelId, userId);
        }

        res.status(200).json({
            success: true,
            message: 'Payment confirmed successfully',
            transaction: updated
        });
    } catch (error) {
        console.error('Error confirming payment:', error);
        res.status(500).json({
            success: false,
            message: 'Error confirming payment',
            error: error.message
        });
    }
};

/**
 * POST /api/payments/cancel - Hủy thanh toán
 */
const cancelPayment = async (req, res) => {
    try {
        const { transactionId, userId, reason } = req.body;

        if (!transactionId) {
            return res.status(400).json({
                success: false,
                message: 'Transaction ID is required'
            });
        }

        const transaction = await getTransaction(transactionId);
        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        // Cập nhật trạng thái thành CANCELLED
        const updated = await updateTransactionStatus(
            transactionId,
            TRANSACTION_STATUS.CANCELLED,
            {
                cancelledAt: new Date().toISOString(),
                cancelledBy: userId,
                cancelReason: reason || 'User cancelled'
            }
        );

        // Release hold khi hủy
        if (transaction.bookingData?.hotelId && userId) {
            await releaseHold('hotel', transaction.bookingData.hotelId, userId);
        }

        res.status(200).json({
            success: true,
            message: 'Payment cancelled successfully',
            transaction: updated
        });
    } catch (error) {
        console.error('Error cancelling payment:', error);
        res.status(500).json({
            success: false,
            message: 'Error cancelling payment',
            error: error.message
        });
    }
};

module.exports = {
    createPayment,
    getPayment,
    vnpayCallback,
    processDirectPaymentEndpoint,
    confirmPayment,
    cancelPayment
};
