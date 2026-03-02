import React from 'react';
import styles from './Loading.module.css';

interface LoadingProps {
    size?: 'small' | 'medium' | 'large';
    fullScreen?: boolean;
    text?: string;
}

export const Loading: React.FC<LoadingProps> = ({
    size = 'medium',
    fullScreen = false,
    text
}) => {
    const Spinner = (
        <div className={styles.spinnerWrapper}>
            <div className={`${styles.spinner} ${styles[size]}`}></div>
            {text && <p className={styles.text}>{text}</p>}
        </div>
    );

    if (fullScreen) {
        return (
            <div className={styles.fullScreen}>
                {Spinner}
            </div>
        );
    }

    return Spinner;
};
