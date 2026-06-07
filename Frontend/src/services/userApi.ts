const BASE_API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';
const API_URL = `${BASE_API_URL}/users`;

export interface UserProfile {
    UserID: string;
    Ho: string;
    Ten: string;
    Email: string;
    SDT?: string;
    CCCD?: string;
    Role?: string;
    TrangThai?: string;
    TinhTrangXacMinh?: string;
}

export const userApi = {
    getProfile: async (id: string) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : '',
            },
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Không thể lấy thông tin người dùng');
        }

        return response.json() as Promise<UserProfile>;
    },

    updateProfile: async (id: string, data: Partial<UserProfile>) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Cập nhật profile thất bại');
        }

        return response.json();
    },
};
