/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/authApi';

export interface User { id: string; Ho: string; Ten: string; Email: string; Role?: string; }

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isLoading: boolean;
    login: (credentials: Record<string, unknown>) => Promise<void>;
    register: (data: Record<string, unknown>) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (storedUser && token) setUser(JSON.parse(storedUser));
        setIsLoading(false);
    }, []);

    const login = async (credentials: Record<string, unknown>) => {
        setIsLoading(true);
        try {
            const data = await authApi.login(credentials);
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);

            // Redirect admin to admin dashboard
            if (data.user.Role === 'ADMIN') {
                navigate('/admin');
            }
        } finally { setIsLoading(false); }
    };

    const register = async (data: Record<string, unknown>) => {
        setIsLoading(true);
        try {
            const result = await authApi.register(data);
            setUser(result.user);
            localStorage.setItem('user', JSON.stringify(result.user));
            localStorage.setItem('token', result.token);
        } finally { setIsLoading(false); }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/');
    };

    const isAdmin = user?.Role === 'ADMIN';

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isAdmin, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
