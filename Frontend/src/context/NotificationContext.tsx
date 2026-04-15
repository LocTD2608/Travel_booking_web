/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

// Types
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
    id: string;
    type: NotificationType;
    message: string;
    duration?: number;
}

interface NotificationContextType {
    notifications: Notification[];
    showSuccess: (message: string, duration?: number) => void;
    showError: (message: string, duration?: number) => void;
    showWarning: (message: string, duration?: number) => void;
    showInfo: (message: string, duration?: number) => void;
    removeNotification: (id: string) => void;
    clearAll: () => void;
}

// Create Context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Provider Component
export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const removeNotification = useCallback((id: string) => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, []);

    const addNotification = useCallback(
        (type: NotificationType, message: string, duration: number = 5000) => {
            const id = `notification-${Date.now()}-${Math.random()}`;

            const notification: Notification = {
                id,
                type,
                message,
                duration,
            };

            setNotifications((prev) => [...prev, notification]);

            if (duration > 0) {
                setTimeout(() => {
                    removeNotification(id);
                }, duration);
            }

            return id;
        },
        [removeNotification]
    );

    const clearAll = useCallback(() => {
        setNotifications([]);
    }, []);

    const showSuccess = useCallback(
        (message: string, duration?: number) => {
            addNotification('success', message, duration);
        },
        [addNotification]
    );

    const showError = useCallback(
        (message: string, duration?: number) => {
            addNotification('error', message, duration);
        },
        [addNotification]
    );

    const showWarning = useCallback(
        (message: string, duration?: number) => {
            addNotification('warning', message, duration);
        },
        [addNotification]
    );

    const showInfo = useCallback(
        (message: string, duration?: number) => {
            addNotification('info', message, duration);
        },
        [addNotification]
    );

    const value: NotificationContextType = {
        notifications,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        removeNotification,
        clearAll,
    };

    return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

// Custom Hook
export const useNotification = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within NotificationProvider');
    }
    return context;
};
