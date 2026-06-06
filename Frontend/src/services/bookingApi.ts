const BASE_API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';
const API_URL = `${BASE_API_URL}/booking`;

export interface BookingDetails {
    booking: any;
    details: any[];
    payments: any[];
}

export interface BookingHistoryResponse {
    message: string;
    data: BookingDetails[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
}

export const bookingApi = {
    getUserBookings: async (userId: string | number, page: number = 1, limit: number = 5): Promise<BookingHistoryResponse> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/user/${userId}?page=${page}&limit=${limit}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : '',
            },
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.message || 'Không thể lấy danh sách vé');
        }

        return response.json();
    },

    createBooking: async (data: any): Promise<any> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.message || 'Không thể tạo đặt phòng');
        }
        
        return response.json();
    },

    getBookingDetail: async (bookingId: string | number): Promise<any> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/detail/${bookingId}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : '',
            },
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.message || 'Không thể lấy thông tin chi tiết giao dịch');
        }

        return response.json();
    }
};
