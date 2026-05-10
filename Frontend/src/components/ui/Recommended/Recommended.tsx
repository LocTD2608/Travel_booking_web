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
        title: 'Kỳ nghỉ dưỡng Maldives 4N3Đ - Overwater Villa',
        location: 'Maldives',
        image: '/images/maldives.png',
        oldPrice: 35000000,
        newPrice: 28500000,
        rating: 4.9,
        badge: 'Giảm 20%'
    },
    {
        id: '2',
        title: 'Tour Nhật Bản mùa Hoa Anh Đào - Ngắm núi Phú Sĩ',
        location: 'Tokyo, Nhật Bản',
        image: '/images/fuji.png',
        oldPrice: 28000000,
        newPrice: 24900000,
        rating: 4.8,
        badge: 'Hot nhất mùa'
    },
    {
        id: '3',
        title: 'Khám phá thủ đô Tokyo phồn hoa về đêm',
        location: 'Tokyo, Nhật Bản',
        image: '/images/tokyo.png',
        oldPrice: 15000000,
        newPrice: 12500000,
        rating: 4.7,
        badge: 'Bán chạy'
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
                    <h2 className={styles.title}>Gợi ý dành riêng cho bạn</h2>
                    <p className={styles.subtitle}>Khám phá những điểm đến tuyệt vời với ưu đãi tốt nhất</p>
                </div>
                <Link to="/offers" className={styles.viewAll}>Xem tất cả ➔</Link>
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
                            <button className={styles.actionBtn}>Đặt Ngay</button>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};
