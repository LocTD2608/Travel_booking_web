const BASE_URL = "http://127.0.0.1:3000/api/cancellations";

export interface CancellationRequest {
    id: string;
    bookingId: string;
    customerName: string;
    customerEmail: string;
    bookingType: 'flight' | 'hotel' | 'tour';
    bookingDetail: string;
    bookingClass: string;
    reason: string;
    requestedAt: string;
    status: 'pending' | 'approved' | 'rejected';
    userId: number;
    acknowledged: boolean;
}

export const cancellationApi = {
    requestCancellation: async (bookingId: string | number, reason: string): Promise<{ success: boolean; message: string; request: CancellationRequest }> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify({ bookingId, reason }),
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.message || 'Không thể gửi yêu cầu hủy vé/phòng');
        }

        return response.json();
    },

    getNotifications: async (): Promise<CancellationRequest[]> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/notifications`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : '',
            },
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.message || 'Không thể lấy thông báo hủy');
        }

        return response.json();
    },

    acknowledgeNotification: async (id: string): Promise<{ success: boolean; message: string }> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/acknowledge/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : '',
            },
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.message || 'Không thể xác nhận thông báo');
        }

        return response.json();
    },

    getUserCancellations: async (): Promise<CancellationRequest[]> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/my-cancellations`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : '',
            },
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.message || 'Không thể lấy danh sách yêu cầu hủy');
        }

        return response.json();
    }
};
