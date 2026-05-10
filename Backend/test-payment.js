/**
 * Test Mock Payment Feature
 * Chạy: node test-payment.js
 */

require('dotenv').config();
const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api/payments';

// Mock data
const mockPaymentData = {
    amount: 2500000, // 2.5 triệu VND
    orderId: `ORD-${Date.now()}`,
    orderInfo: 'Test booking Vinpearl Hotel - 2 nights',
    userId: 'user_123',
    paymentMethod: 'momo', // momo, vnpay, credit, bank
    bookingData: {
        hotelId: 1,
        roomTypeId: 101,
        checkIn: '2024-05-01',
        checkOut: '2024-05-03',
        nights: 2,
        guests: {
            adults: 2,
            children: 0,
            rooms: 1
        }
    }
};

// Test functions
const testCreatePayment = async () => {
    console.log('\n=== TEST 1: Tạo Payment ===');
    try {
        const response = await axios.post(`${API_BASE_URL}/create`, mockPaymentData);
        console.log('✅ Success:', response.data);
        return response.data.transactionId;
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
        throw error;
    }
};

const testGetPayment = async (transactionId) => {
    console.log('\n=== TEST 2: Lấy thông tin Payment ===');
    try {
        const response = await axios.get(`${API_BASE_URL}/${transactionId}`);
        console.log('✅ Success:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
};

const testProcessDirectPayment = async (transactionId) => {
    console.log('\n=== TEST 3: Xử lý thanh toán Direct (Mock) ===');
    try {
        const response = await axios.post(`${API_BASE_URL}/process-direct`, {
            transactionId,
            paymentMethod: mockPaymentData.paymentMethod,
            amount: mockPaymentData.amount
        });
        console.log('✅ Success:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
};

const testConfirmPayment = async (transactionId) => {
    console.log('\n=== TEST 4: Xác nhận Payment ===');
    try {
        const response = await axios.post(`${API_BASE_URL}/confirm`, {
            transactionId,
            userId: mockPaymentData.userId
        });
        console.log('✅ Success:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
};

const testCancelPayment = async (transactionId) => {
    console.log('\n=== TEST 5: Hủy Payment ===');
    try {
        const response = await axios.post(`${API_BASE_URL}/cancel`, {
            transactionId,
            userId: mockPaymentData.userId,
            reason: 'Customer changed mind'
        });
        console.log('✅ Success:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
};

const testVNPayPayment = async () => {
    console.log('\n=== TEST 6: VNPay Payment URL ===');
    try {
        const vnpayData = {
            ...mockPaymentData,
            paymentMethod: 'vnpay'
        };
        const response = await axios.post(`${API_BASE_URL}/create`, vnpayData);
        console.log('✅ Success:');
        console.log('Transaction ID:', response.data.transactionId);
        console.log('Payment URL:', response.data.paymentUrl);
        return response.data;
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
};

// Run tests
const runTests = async () => {
    try {
        console.log('🚀 Bắt đầu test Mock Payment Feature...\n');

        // Test 1: Tạo payment
        const txnId = await testCreatePayment();

        // Test 2: Lấy thông tin payment
        await testGetPayment(txnId);

        // Test 3: Xử lý direct payment
        await testProcessDirectPayment(txnId);

        // Test 4: Xác nhận payment
        await testConfirmPayment(txnId);

        // Test 5: Tạo payment khác để test hủy
        const txnId2 = await testCreatePayment();
        await testCancelPayment(txnId2);

        // Test 6: VNPay payment
        await testVNPayPayment();

        console.log('\n✅ Tất cả tests hoàn thành!');
    } catch (error) {
        console.error('\n❌ Test thất bại:', error.message);
        process.exit(1);
    }
};

runTests();
