import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/payments';

export interface CreatePaymentRequest {
    amount: number;
    orderId: string;
    orderInfo?: string;
    userId: string;
    paymentMethod: 'momo' | 'vnpay' | 'credit' | 'bank';
    bookingData?: {
        hotelId?: number | string;
        roomTypeId?: number;
        checkIn: string;
        checkOut: string;
        nights: number;
    };
    ipAddress?: string;
}

export interface PaymentResponse {
    success: boolean;
    transactionId: string;
    orderId: string;
    amount: number;
    paymentMethod: string;
    status: string;
    paymentUrl?: string;
    message: string;
}

export interface TransactionData {
    transactionId: string;
    orderId: string;
    userId: string;
    amount: number;
    paymentMethod: string;
    status: string;
    bookingData: any;
    createdAt: string;
    updatedAt: string;
}

/**
 * Tạo đơn hàng thanh toán
 */
export const createPayment = async (data: CreatePaymentRequest): Promise<PaymentResponse> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/create`, data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to create payment');
    }
};

/**
 * Lấy thông tin transaction
 */
export const getPayment = async (transactionId: string): Promise<{ success: boolean; transaction: TransactionData }> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${transactionId}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to get payment');
    }
};

/**
 * Xác nhận thanh toán thành công
 */
export const confirmPayment = async (transactionId: string, userId: string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/confirm`, {
            transactionId,
            userId
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to confirm payment');
    }
};

/**
 * Hủy thanh toán
 */
export const cancelPayment = async (transactionId: string, userId: string, reason?: string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/cancel`, {
            transactionId,
            userId,
            reason
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to cancel payment');
    }
};

/**
 * Xử lý thanh toán Mock trực tiếp (cho testing)
 */
export const processDirectPayment = async (
    transactionId: string,
    paymentMethod: string,
    amount: number
) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/process-direct`, {
            transactionId,
            paymentMethod,
            amount
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to process payment');
    }
};

/**
 * Chuyển hướng tới VNPay Sandbox
 */
export const redirectToVNPay = (paymentUrl: string) => {
    window.location.href = paymentUrl;
};
