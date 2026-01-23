import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    icon,
    fullWidth = false,
    className,
    ...props
}) => {
    const wrapperClass = [
        styles.wrapper,
        fullWidth ? styles.fullWidth : '',
        error ? styles.hasError : ''
    ].filter(Boolean).join(' ');

    return (
        <div className={wrapperClass}>
            {label && <label className={styles.label}>{label}</label>}
            <div className={styles.inputWrapper}>
                {icon && <span className={styles.icon}>{icon}</span>}
                <input
                    className={`${styles.input} ${icon ? styles.withIcon : ''} ${className || ''}`}
                    {...props}
                />
            </div>
            {error && <span className={styles.error}>{error}</span>}
        </div>
    );
};
