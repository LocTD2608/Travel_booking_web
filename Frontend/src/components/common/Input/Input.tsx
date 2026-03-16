import React, { forwardRef, useId } from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    fullWidth?: boolean;
    wrapperClassName?: string; 
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
    label,
    error,
    icon,
    fullWidth = false,
    className,
    id,
    ...props
}, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    const wrapperClass = [
        styles.wrapper,
        fullWidth ? styles.fullWidth : '',
        error ? styles.hasError : '',
        className 
    ].filter(Boolean).join(' ');

    return (
        <div className={wrapperClass}>
            {label && (
                <label htmlFor={inputId} className={styles.label}>
                    {label}
                </label>
            )}
            
            <div className={styles.inputWrapper}>
                {icon && <span className={styles.icon}>{icon}</span>}
                <input
                    ref={ref}
                    id={inputId} 
                    className={`${styles.input} ${icon ? styles.withIcon : ''}`}
                    {...props}
                />
            </div>
            
            {error && <span className={styles.error}>{error}</span>}
        </div>
    );
});

Input.displayName = "Input"; 

export default Input;