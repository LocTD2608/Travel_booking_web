import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// Cấu hình URL Backend chung của dự án
const API_URL = 'http://localhost:3000/api/auth';

// Types
export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    phone?: string;
    role?: 'user' | 'admin';
}

export interface LoginCredentials {
    email: string; 
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    phone?: string;
}

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
    forgotPassword: (email: string) => Promise<void>;
    verifyOtp: (email: string, otp: string, newPassword: string) => Promise<void>;
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const loadUser = () => {
            try {
                const storedUser = localStorage.getItem('user');
                const storedToken = localStorage.getItem('token');

                if (storedUser && storedToken) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error('Error loading user from storage:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    // Hàm gọi API Đăng nhập
    const login = async (credentials: LoginCredentials): Promise<void> => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    identifier: credentials.email, 
                    password: credentials.password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Đăng nhập thất bại!');
            }

            const loggedInUser: User = {
                id: data.user.id || data.user._id, 
                email: data.user.email,
                name: data.user.fullName || data.user.full_name, 
                phone: data.user.phoneNumber || data.user.phone_number,
                role: data.user.role || 'user',
                avatar: data.user.avatar
            };

            setUser(loggedInUser);
            localStorage.setItem('user', JSON.stringify(loggedInUser));
            localStorage.setItem('token', data.token); 

        } catch (error: any) {
            console.error('Login error:', error);
            throw new Error(error.message || 'Sai tài khoản hoặc mật khẩu.');
        } finally {
            setIsLoading(false);
        }
    };

    // Hàm gọi API Đăng ký
    const register = async (data: RegisterData): Promise<void> => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName: data.name,
                    email: data.email,
                    phoneNumber: data.phone,
                    password: data.password
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Đăng ký thất bại!');
            }

            if (result.token && result.user) {
                const newUser: User = {
                    id: result.user.id || result.user._id,
                    email: result.user.email,
                    name: result.user.fullName || result.user.full_name,
                    phone: result.user.phoneNumber || result.user.phone_number,
                    role: result.user.role || 'user',
                    avatar: result.user.avatar
                };
                
                setUser(newUser);
                localStorage.setItem('user', JSON.stringify(newUser));
                localStorage.setItem('token', result.token);
            }

        } catch (error: any) {
            console.error('Register error:', error);
            throw new Error(error.message || 'Đăng ký không thành công. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const updateUser = (userData: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...userData };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
    };

    // Hàm yêu cầu gửi OTP về Email (Đã được chuyển lên đây)
    const forgotPassword = async (email: string): Promise<void> => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Không thể gửi OTP');
        } catch (error: any) {
            throw new Error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Hàm xác thực OTP và đổi mật khẩu mới (Đã được chuyển lên đây)
    const verifyOtp = async (email: string, otp: string, newPassword: string): Promise<void> => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, newPassword }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Xác thực thất bại');
        } catch (error: any) {
            throw new Error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Khai báo cục value ở MÃI DƯỚI CÙNG để gom hết các hàm ở trên vào
    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        forgotPassword, // Bây giờ nó đã hiểu rồi
        verifyOtp,      // Cả cái này nữa
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom Hook
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};