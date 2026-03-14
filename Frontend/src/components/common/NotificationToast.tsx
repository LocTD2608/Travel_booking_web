import React from 'react';
import { useNotification } from '../context';
import styles from './NotificationToast.module.css';

export const NotificationToast: React.FC = () => {
    const { notifications, removeNotification } = useNotification();

    if (notifications.length === 0) return null;

    return (
        <div className={styles.container}>
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`${styles.toast} ${styles[notification.type]}`}
                >
                    <div className={styles.content}>
                        <span className={`material-symbols-outlined ${styles.icon}`}>
                            {notification.type === 'success' && 'check_circle'}
                            {notification.type === 'error' && 'error'}
                            {notification.type === 'warning' && 'warning'}
                            {notification.type === 'info' && 'info'}
                        </span>
                        <span className={styles.message}>{notification.message}</span>
                    </div>
                    <button
                        className={styles.closeButton}
                        onClick={() => removeNotification(notification.id)}
                        aria-label="Close notification"
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
};
