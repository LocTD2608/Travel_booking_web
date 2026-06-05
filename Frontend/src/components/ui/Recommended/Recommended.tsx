import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchRecommendations, fetchHotels } from '../../../services/searchApi';
import styles from './Recommended.module.css';

interface RecommendedItem {
    id: string;
    title: string;
    location: string;
    image: string;
    oldPrice?: number;
    newPrice: number;
    rating: number;
    badge: string;
    linkTo: string;
}

const CITY_IMAGES: Record<string, string> = {
    'ha noi': 'https://images.unsplash.com/photo-1555921015-5532091f6026?q=80&w=800&auto=format&fit=crop',
    'hanoi': 'https://images.unsplash.com/photo-1555921015-5532091f6026?q=80&w=800&auto=format&fit=crop',
    'da nang': 'https://images.unsplash.com/photo-1597047084897-51e81819a499?q=80&w=800&auto=format&fit=crop',
    'danang': 'https://images.unsplash.com/photo-1597047084897-51e81819a499?q=80&w=800&auto=format&fit=crop',
    'phu quoc': 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?q=80&w=800&auto=format&fit=crop',
    'phuquoc': 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?q=80&w=800&auto=format&fit=crop',
    'ho chi minh': 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=800&auto=format&fit=crop',
    'saigon': 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=800&auto=format&fit=crop',
    'hcm': 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=800&auto=format&fit=crop',
    'tokyo': 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800&auto=format&fit=crop',
    'bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop',
    'singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=800&auto=format&fit=crop',
    'nha trang': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    'bangkok': 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=800&auto=format&fit=crop',
    'seoul': 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800&auto=format&fit=crop',
    'kuala lumpur': 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=800&auto=format&fit=crop',
    'taipei': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800&auto=format&fit=crop',
    'london': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop',
    'paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop',
};

const getCityImage = (locationStr: string): string => {
    const locLower = locationStr.toLowerCase();
    for (const [key, value] of Object.entries(CITY_IMAGES)) {
        if (locLower.includes(key)) {
            return value;
        }
    }
    return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop';
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export const Recommended: React.FC = () => {
    const [type, setType] = useState<'hotels' | 'flights'>('hotels');
    const [items, setItems] = useState<RecommendedItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadRecommendations = async () => {
            try {
                setLoading(true);
                setError(null);
                
                if (type === 'hotels') {
                    // Fetch hotels from the search API to find those with room types / detail pages
                    const res = await fetchHotels({ limit: 100 } as any);
                    if (res.success && res.data) {
                        // Filter hotels that have a valid price (meaning they have rooms/details)
                        const validHotels = res.data.filter((h: any) => h.min_price && Number(h.min_price) > 0);
                        
                        // Shuffle and pick 3 random hotels
                        const shuffled = [...validHotels].sort(() => 0.5 - Math.random());
                        const selectedHotels = shuffled.slice(0, 3);
                        
                        const mappedData: RecommendedItem[] = selectedHotels.map((item: any) => {
                            const newPrice = Number(item.min_price);
                            const stars = Number(item.stars || 4);
                            return {
                                id: item.MaKS.toString(),
                                title: item.name,
                                location: item.address,
                                image: getCityImage(item.address),
                                newPrice,
                                oldPrice: newPrice * 1.15, // Simulate 15% discount
                                rating: stars,
                                badge: stars >= 5 ? 'Luxury' : 'Great Deal',
                                linkTo: `/hotels/${item.MaKS}` // Direct link to detail page!
                            };
                        });
                        setItems(mappedData);
                    } else {
                        setItems([]);
                    }
                } else {
                    const res = await fetchRecommendations(type, 3);
                    if (res.success && res.data) {
                        const mappedData: RecommendedItem[] = res.data.map((item: any) => {
                            const newPrice = Number(item.price || 1000000);
                            const destinationName = item.to_name || 'Da Nang';
                            return {
                                id: item.MaChuyenBay.toString(),
                                title: `Flight to ${destinationName} (${item.HangBay})`,
                                location: `${item.from_name} ➔ ${item.to_name}`,
                                image: getCityImage(destinationName),
                                newPrice,
                                oldPrice: newPrice * 1.10, // Simulate 10% discount
                                rating: 4.8,
                                badge: item.HangBay || 'Direct',
                                linkTo: `/flights?from=${encodeURIComponent(item.from_name)}&to=${encodeURIComponent(item.to_name)}`
                            };
                        });
                        setItems(mappedData);
                    } else {
                        setItems([]);
                    }
                }
            } catch (err: any) {
                console.error('Failed to load recommendations:', err);
                setError('Could not load recommendation data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        loadRecommendations();
    }, [type]);

    return (
        <section className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>Recommended For You</h2>
                    <p className={styles.subtitle}>Discover incredible destinations with the best exclusive deals</p>
                    
                    {/* Tab Switcher */}
                    <div className={styles.tabContainer}>
                        <button 
                            onClick={() => setType('hotels')}
                            className={`${styles.tabBtn} ${type === 'hotels' ? styles.activeTab : ''}`}
                        >
                            <span className="material-symbols-outlined text-[18px]">hotel</span>
                            Khách sạn nổi bật
                        </button>
                        <button 
                            onClick={() => setType('flights')}
                            className={`${styles.tabBtn} ${type === 'flights' ? styles.activeTab : ''}`}
                        >
                            <span className="material-symbols-outlined text-[18px]">flight</span>
                            Vé máy bay giá tốt
                        </button>
                    </div>
                </div>
                <Link to={type === 'hotels' ? '/hotels' : '/flights'} className={styles.viewAll}>
                    View All ➔
                </Link>
            </div>

            {error ? (
                <div className="text-center py-10 text-gray-500 font-semibold">{error}</div>
            ) : loading ? (
                <div className={styles.grid}>
                    {[1, 2, 3].map((n) => (
                        <div key={n} className={styles.skeletonCard}>
                            <div className={styles.skeletonImage} />
                            <div className={styles.skeletonContent}>
                                <div className={styles.skeletonText} style={{ width: '40%' }} />
                                <div className={styles.skeletonTitle} />
                                <div className={styles.skeletonPrice} />
                                <div className={styles.skeletonButton} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : items.length === 0 ? (
                <div className="text-center py-10 text-gray-500 font-semibold">No recommendations found.</div>
            ) : (
                <div className={styles.grid}>
                    {items.map((item) => (
                        <Link to={item.linkTo} key={item.id} className={styles.card}>
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
                                    {item.oldPrice && item.oldPrice > item.newPrice && (
                                        <span className={styles.oldPrice}>{formatCurrency(item.oldPrice)}</span>
                                    )}
                                </div>
                                <button className={styles.actionBtn}>Book Now</button>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
};
