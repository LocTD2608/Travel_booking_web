import React from 'react';
import styles from './Card.module.css';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    hoverable?: boolean;
    clickable?: boolean;
    onClick?: () => void;
    className?: string;
    noPadding?: boolean; 
}

export const Card: React.FC<CardProps> = ({
    children,
    hoverable = false,
    clickable = false,
    noPadding = false, 
    onClick,
    className,
    ...props 
}) => {
    const cardClass = [
        styles.card,
        hoverable || clickable ? styles.hoverable : '',
        clickable ? styles.clickable : '',
        noPadding ? styles.noPadding : '',
        className || ''
    ].filter(Boolean).join(' ');

    return (
        <div 
            className={cardClass} 
            onClick={clickable ? onClick : undefined}
            {...props} 
        >
            {children}
        </div>
    );
};

export default Card;