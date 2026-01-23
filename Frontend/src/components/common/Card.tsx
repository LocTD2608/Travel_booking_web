import React from 'react';
import styles from './Card.module.css';

interface CardProps {
    children: React.ReactNode;
    hoverable?: boolean;
    clickable?: boolean;
    onClick?: () => void;
    className?: string;
}

export const Card: React.FC<CardProps> = ({
    children,
    hoverable = false,
    clickable = false,
    onClick,
    className
}) => {
    const cardClass = [
        styles.card,
        hoverable || clickable ? styles.hoverable : '',
        clickable ? styles.clickable : '',
        className || ''
    ].filter(Boolean).join(' ');

    return (
        <div className={cardClass} onClick={clickable ? onClick : undefined}>
            {children}
        </div>
    );
};
