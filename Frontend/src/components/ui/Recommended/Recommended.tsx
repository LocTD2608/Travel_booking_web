import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Recommended.module.css';

interface RecommendedItem {
    id: string;
    title: string;
    location: string;
    image: string;
    oldPrice: number;
    newPrice: number;
    rating: number;
    badge: string;
}

const mockData: RecommendedItem[] = [
    {
        id: '1',
        title: 'Maldives 4D3N Vacation - Luxury Overwater Villa',
        location: 'Maldives',
        image: '/images/maldives.png',
        oldPrice: 35000000,
        newPrice: 28500000,
        rating: 4.9,
        badge: '20% OFF'
    },
    {
        id: '2',
        title: 'Japan Cherry Blossom Tour - Mt. Fuji Viewing',
        location: 'Tokyo, Japan',
        image: '/images/fuji.png',
        oldPrice: 28000000,
        newPrice: 24900000,
        rating: 4.8,
        badge: 'Seasonal Hot'
    },
    {
        id: '3',
        title: 'Explore Bustling Tokyo by Night - Izakaya Tour',
        location: 'Tokyo, Japan',
        image: '/images/tokyo.png',
        oldPrice: 15000000,
        newPrice: 12500000,
        rating: 4.7,
        badge: 'Best Seller'
    }
];

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export const Recommended: React.FC = () => {
    return (
        <section className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>Recommended For You</h2>
                    <p className={styles.subtitle}>Discover incredible destinations with the best exclusive deals</p>
                </div>
                <Link to="/offers" className={styles.viewAll}>View All ➔</Link>
            </div>

            <div className={styles.grid}>
                {mockData.map((item) => (
                    <Link to={`/tour/${item.id}`} key={item.id} className={styles.card}>
                        <div className={styles.imageWrapper}>
                            {item.badge && <div className={styles.badge}>{item.badge}</div>}
                            <img src={item.image} alt={item.title} className={styles.image} />
                            <div className={styles.rating}>
                                <span className={`material-symbols-outlined ${styles.ratingIcon}`}>star</span>
                                {item.rating}
                            </div>
                        </div>
                        <div className={styles.content}>
                            <div className={styles.location}>
                                <span className={`material-symbols-outlined ${styles.locationIcon}`}>location_on</span>
                                {item.location}
                            </div>
                            <h3 className={styles.cardTitle}>{item.title}</h3>
                            <div className={styles.priceWrapper}>
                                <span className={styles.newPrice}>{formatCurrency(item.newPrice)}</span>
                                {item.oldPrice > item.newPrice && (
                                    <span className={styles.oldPrice}>{formatCurrency(item.oldPrice)}</span>
                                )}
                            </div>
                            <button className={styles.actionBtn}>Book Now</button>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};
