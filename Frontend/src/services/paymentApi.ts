import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/payment` : 'http://localhost:3000/api/payment';

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
 * Tạo URL thanh toán VNPay
 */
export const createVNPayUrl = async (amount: number, orderId: string): Promise<{ success: boolean; paymentUrl: string }> => {
    try {
        const returnUrl = `${window.location.origin}/payment-return`;
        const response = await axios.post(`${API_BASE_URL}/create-vnpay`, { amount, orderId, returnUrl });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to create VNPay URL');
    }
};

/**
 * Kiểm tra callback từ VNPay
 */
export const verifyVNPayReturn = async (queryString: string): Promise<any> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/vnpay-return${queryString}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to verify VNPay return');
    }
};

/**
 * Tạo đơn hàng thanh toán (Mock / Khác)
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
 * Lấy thông tin transaction (Mock / Khác)
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
 * Xác nhận thanh toán thành công (Mock / Khác)
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
