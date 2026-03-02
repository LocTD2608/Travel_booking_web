import React from 'react';
import styles from './Rating.module.css';

interface RatingProps {
    value: number;
    max?: number;
    size?: 'small' | 'medium' | 'large';
    showValue?: boolean;
    readonly?: boolean;
    onChange?: (value: number) => void;
}

export const Rating: React.FC<RatingProps> = ({
    value,
    max = 5,
    size = 'medium',
    showValue = false,
    readonly = true,
    onChange
}) => {
    const handleClick = (index: number) => {
        if (!readonly && onChange) {
            onChange(index + 1);
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={`${styles.rating} ${styles[size]}`}>
                {Array.from({ length: max }, (_, index) => {
                    const filled = index < Math.floor(value);
                    const partial = index < value && index >= Math.floor(value);
                    const percentage = partial ? ((value % 1) * 100).toFixed(0) : '0';

                    return (
                        <span
                            key={index}
                            className={`${styles.star} ${!readonly ? styles.interactive : ''}`}
                            onClick={() => handleClick(index)}
                        >
                            {partial ? (
                                <span className={styles.starContainer}>
                                    <span className={styles.starEmpty}>★</span>
                                    <span
                                        className={styles.starFilled}
                                        style={{ width: `${percentage}%` }}
                                    >
                                        ★
                                    </span>
                                </span>
                            ) : (
                                <span className={filled ? styles.starFilled : styles.starEmpty}>
                                    ★
                                </span>
                            )}
                        </span>
                    );
                })}
            </div>
            {showValue && (
                <span className={styles.value}>
                    {value.toFixed(1)} / {max}
                </span>
            )}
        </div>
    );
};
