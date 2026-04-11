// src/services/authApi.ts
const API_URL = "http://localhost:3000/api/auth";

export const authApi = {
    login: async (credentials: any) => {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || "Đăng nhập thất bại");
        }
        return response.json();
    },

    register: async (data: any) => {
        const payload = {
            Ho: data.fullName?.split(" ").slice(0, -1).join(" ") || "Khách",
            Ten: data.fullName?.split(" ").slice(-1).join("") || "Hàng",
            Email: data.email,
            SDT: data.phone,
            Password: data.password,
        };
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || "Đăng ký thất bại");
        }
        return response.json();
    },

    forgotPassword: async (email: string) => {
        const response = await fetch(`${API_URL}/forgot-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        if (!response.ok) throw new Error("Gửi OTP thất bại");
        return response.json();
    },

    verifyOtp: async (email: string, otp: string) => {
        const response = await fetch(`${API_URL}/verify-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp }),
        });
        if (!response.ok) throw new Error("Xác thực OTP thất bại");
        return response.json();
    },

    resetPassword: async (email: string, resetToken: string, newPassword: string) => {
        const response = await fetch(`${API_URL}/reset-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, resetToken, newPassword }),
        });
        if (!response.ok) throw new Error("Đổi mật khẩu thất bại");
        return response.json();
    },
};
