const crypto = require('crypto');
const { redisClient } = require('../configs/redis');

/**
 * Payment Service - Xử lý thanh toán với Mock VNPay Sandbox
 */

// Mock VNPay Sandbox Configuration
const VNPAY_CONFIG = {
    TMN_CODE: 'TMNCODE123', // Mock TMN Code
    HASH_SECRET: 'SECRETKEY1234567890', // Mock Secret Key
    RETURN_URL: 'http://localhost:5173/payment-callback',
    API_URL: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html', // Sandbox URL
};

// Transaction Status
const TRANSACTION_STATUS = {
    PENDING: 'pending',
    SUCCESS: 'success',
    FAILED: 'failed',
    CANCELLED: 'cancelled'
};

/**
 * Tạo URL thanh toán VNPay Mock
 * @param {Object} orderData - Dữ liệu đơn hàng
 * @returns {Object} - URL thanh toán và orderId
 */
const createVNPayPaymentUrl = (orderData) => {
    const {
        amount,           // Số tiền (VND)
        orderId,          // ID đơn hàng
        orderInfo,        // Mô tả đơn hàng
        customerId,       // ID khách hàng
        customerEmail,    // Email khách hàng
        ipAddress = '127.0.0.1'
    } = orderData;

    // Tạo timestamp
    const createDate = new Date();
    const createDateString = createDate.getFullYear() +
        String(createDate.getMonth() + 1).padStart(2, '0') +
        String(createDate.getDate()).padStart(2, '0') +
        String(createDate.getHours()).padStart(2, '0') +
        String(createDate.getMinutes()).padStart(2, '0') +
        String(createDate.getSeconds()).padStart(2, '0');

    // Xây dựng VNPay Request
    const vnpParams = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: VNPAY_CONFIG.TMN_CODE,
        vnp_Locale: 'vn',
        vnp_CurrCode: 'VND',
        vnp_TxnRef: orderId,
        vnp_OrderInfo: orderInfo,
        vnp_OrderType: 'hotel', // Loại đơn hàng
        vnp_Amount: amount * 100, // VNPay yêu cầu x100
        vnp_ReturnUrl: VNPAY_CONFIG.RETURN_URL,
        vnp_IpAddr: ipAddress,
        vnp_CreateDate: createDateString,
        vnp_ExpireDate: createDateString // Hết hạn sau 15 phút (mặc định)
    };

    // Sắp xếp tham số theo thứ tự alphabet
    const sortedParams = Object.keys(vnpParams)
        .sort()
        .reduce((acc, key) => {
            acc[key] = vnpParams[key];
            return acc;
        }, {});

    // Tạo query string
    const queryString = Object.keys(sortedParams)
        .map(key => `${key}=${encodeURIComponent(sortedParams[key])}`)
        .join('&');

    // Tạo checksum
    const hmac = crypto.createHmac('sha512', VNPAY_CONFIG.HASH_SECRET);
    hmac.update(queryString);
    const secureHash = hmac.digest('hex');

    // URL thanh toán
    const paymentUrl = `${VNPAY_CONFIG.API_URL}?${queryString}&vnp_SecureHash=${secureHash}`;

    return {
        orderId,
        paymentUrl,
        amount,
        orderInfo,
        createdAt: new Date()
    };
};

/**
 * Lưu Transaction vào Redis
 * @param {Object} transactionData
 * @returns {Promise<string>} - Transaction ID
 */
const saveTransaction = async (transactionData) => {
    const {
        orderId,
        userId,
        amount,
        paymentMethod,
        bookingData,
        status = TRANSACTION_STATUS.PENDING
    } = transactionData;

    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const transactionKey = `transaction:${transactionId}`;

    const transaction = {
        transactionId,
        orderId,
        userId,
        amount,
        paymentMethod,
        status,
        bookingData: JSON.stringify(bookingData),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    // Lưu vào Redis với TTL 24 giờ - ioredis hset có thể nhận object
    await redisClient.hset(transactionKey, transaction);
    await redisClient.expire(transactionKey, 86400); // 24 hours

    return transactionId;
};

/**
 * Lấy thông tin Transaction
 * @param {string} transactionId
 * @returns {Promise<Object>}
 */
const getTransaction = async (transactionId) => {
    const transactionKey = `transaction:${transactionId}`;
    const transaction = await redisClient.hgetall(transactionKey);

    if (Object.keys(transaction).length === 0) {
        return null;
    }

    return {
        ...transaction,
        bookingData: JSON.parse(transaction.bookingData)
    };
};

/**
 * Cập nhật trạng thái Transaction
 * @param {string} transactionId
 * @param {string} status
 * @param {Object} additionalData
 * @returns {Promise<Object>}
 */
const updateTransactionStatus = async (transactionId, status, additionalData = {}) => {
    const transactionKey = `transaction:${transactionId}`;
    const transaction = await getTransaction(transactionId);

    if (!transaction) {
        throw new Error('Transaction not found');
    }

    const updatedTransaction = {
        ...transaction,
        ...additionalData,
        status,
        updatedAt: new Date().toISOString()
    };

    await redisClient.del(transactionKey);
    await redisClient.hset(transactionKey, updatedTransaction);
    await redisClient.expire(transactionKey, 86400);

    return updatedTransaction;
};

/**
 * Mock xử lý callback từ VNPay
 * Trong thực tế, VNPay sẽ gửi callback tới endpoint này
 * @param {Object} vnpParams - Tham số từ VNPay
 * @returns {Object} - Kết quả xử lý
 */
const handleVNPayCallback = async (vnpParams) => {
    try {
        const { vnp_TxnRef, vnp_ResponseCode, vnp_Amount } = vnpParams;

        // Kiểm tra checksum
        const isValidChecksum = verifyVNPayChecksum(vnpParams);
        if (!isValidChecksum) {
            throw new Error('Invalid checksum');
        }

        // vnp_ResponseCode = '00' là thành công
        const isSuccess = vnp_ResponseCode === '00';

        // Cập nhật trạng thái Transaction
        const transaction = await getTransaction(vnp_TxnRef);
        if (!transaction) {
            throw new Error('Transaction not found');
        }

        const newStatus = isSuccess ? TRANSACTION_STATUS.SUCCESS : TRANSACTION_STATUS.FAILED;
        const updatedTransaction = await updateTransactionStatus(
            vnp_TxnRef,
            newStatus,
            {
                vnpayResponseCode: vnp_ResponseCode,
                processedAt: new Date().toISOString()
            }
        );

        return {
            success: isSuccess,
            transactionId: vnp_TxnRef,
            message: isSuccess ? 'Payment successful' : 'Payment failed',
            transaction: updatedTransaction
        };
    } catch (error) {
        console.error('Error handling VNPay callback:', error);
        throw error;
    }
};

/**
 * Kiểm tra checksum từ VNPay
 * @param {Object} vnpParams
 * @returns {boolean}
 */
const verifyVNPayChecksum = (vnpParams) => {
    const secureHash = vnpParams.vnp_SecureHash;

    // Xóa SecureHash khỏi params
    const { vnp_SecureHash, ...params } = vnpParams;

    // Sắp xếp params
    const sortedParams = Object.keys(params)
        .sort()
        .reduce((acc, key) => {
            acc[key] = params[key];
            return acc;
        }, {});

    // Tạo query string
    const queryString = Object.keys(sortedParams)
        .map(key => `${key}=${encodeURIComponent(sortedParams[key])}`)
        .join('&');

    // Tạo checksum
    const hmac = crypto.createHmac('sha512', VNPAY_CONFIG.HASH_SECRET);
    hmac.update(queryString);
    const calculatedHash = hmac.digest('hex');

    return calculatedHash === secureHash;
};

/**
 * Xử lý thanh toán Mock (không qua VNPay thực)
 * Dùng cho testing trực tiếp
 * @param {Object} paymentData
 * @returns {Promise<Object>}
 */
const processDirectPayment = async (paymentData) => {
    const {
        transactionId,
        paymentMethod,
        amount
    } = paymentData;

    try {
        // Simulate payment processing (50% success rate for demo)
        const isSuccess = Math.random() > 0.5;

        const status = isSuccess ? TRANSACTION_STATUS.SUCCESS : TRANSACTION_STATUS.FAILED;
        const transaction = await updateTransactionStatus(
            transactionId,
            status,
            {
                paymentMethod,
                processedAt: new Date().toISOString(),
                mockProcessed: true
            }
        );

        return {
            success: isSuccess,
            transactionId,
            status,
            transaction
        };
    } catch (error) {
        console.error('Error processing direct payment:', error);
        throw error;
    }
};

module.exports = {
    createVNPayPaymentUrl,
    saveTransaction,
    getTransaction,
    updateTransactionStatus,
    handleVNPayCallback,
    verifyVNPayChecksum,
    processDirectPayment,
    TRANSACTION_STATUS,
    VNPAY_CONFIG
};
