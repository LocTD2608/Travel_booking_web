import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HeroSearch } from '../../components/ui/HeroSearch/HeroSearch';
import { Recommended } from '../../components/ui/Recommended/Recommended';
import { fetchDestinations } from '../../services/searchApi';
import type { DestinationResult } from '../../types/search';
import styles from './HomePage.module.css';

const faqData = [
    {
        q: 'How to book a hotel on Traveloka?',
        a: 'Simply use the hotel search tool at the top of the page by entering your destination, check-in and check-out dates, number of rooms, and number of guests. After clicking "Search Hotels", you can use filters to narrow down results by price, star rating, amenities, and more.'
    },
    {
        q: 'How do I get the best hotel deals on Traveloka?',
        a: 'Use the sorting options or the price range filter to find hotels that fit your budget. For extra savings, browse our latest promo codes and special campaigns. If you are a new Traveloka user, you can also get exclusive discounts on your first booking using the code TVLKBANMOI.'
    },
    {
        q: 'How many hotels are listed on Traveloka?',
        a: 'Traveloka lists more than 1,000,000+ accommodations globally, including luxury hotels, villas, apartments, resorts, and unique homestays.'
    },
    {
        q: 'Where in the world can I book a hotel with Traveloka?',
        a: 'Anywhere! We help you secure accommodations globally. Popular international destinations include Bali, Jakarta, Bangkok, Phuket, Singapore, Kuala Lumpur, Tokyo, Seoul, as well as major Australian cities like Sydney, Melbourne, Brisbane, and Perth.'
    },
    {
        q: 'What types of accommodation are available on Traveloka?',
        a: 'Whatever your travel style, we have it. Choose from a wide range of hotels, hostels, villas, resorts, apartments, guest houses, glamping, and cozy homestays.'
    },
    {
        q: 'How do I find hotels near me?',
        a: 'Need a last-minute room or planning a local staycation? Simply visit our "Hotels Near Me" page to instantly discover and book the top-rated accommodations located in your immediate vicinity.'
    },
    {
        q: 'Can I change or cancel my hotel booking on Traveloka?',
        a: 'Hotels that support rescheduling or free cancellation are clearly marked during booking, along with their deadlines. If your booking is eligible for a refund, the amount will be returned to your original payment method.'
    },
    {
        q: 'How do I contact Traveloka customer support?',
        a: 'You can easily reach our customer care team through the Traveloka Help Center. If your question is not resolved, you can submit a support request. Depending on your location, phone support or live chat may also be available.'
    },
    {
        q: 'What payment methods are supported on Traveloka?',
        a: 'We support a variety of safe, convenient payment methods including major credit/debit cards (Visa, Mastercard, JCB), popular e-wallets (MoMo, VNPay), and secure local bank transfers.'
    },
    {
        q: 'What major hotel chains are available on Traveloka?',
        a: 'We list all your favorite leading international and local hotel chains including Marriott, Hilton, Accor, Wyndham, Best Western, and InterContinental. High-end boutique and artistic hotels are also available.'
    }
];

export const HomePage: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

    const handleSearchClick = (searchData: Record<string, string>) => {
        const params = new URLSearchParams();
        Object.entries(searchData).forEach(([key, value]) => {
            if (value && key !== 'type') {
                params.append(key, value);
            }
        });

        const typeToPath: Record<string, string> = {
            hotels: '/hotels',
            flights: '/flights',
            package: '/search', // Use /search since /flight-hotel is not yet implemented
            experience: '/experience',
        };

        const path = typeToPath[searchData.type] || '/search';
        navigate(`${path}?${params.toString()}`);
    };

    const quickLinks = [
        { icon: 'airplane_ticket', title: 'Best Price', subtitle: 'Flights', color: 'blue', to: '/flights' },
        { icon: 'hotel_class', title: 'Luxury', subtitle: 'Hotels', color: 'orange', to: '/hotels' },
        { icon: 'train', title: 'JR Pass', subtitle: '& Trains', color: 'green', to: '/trains' },
        { icon: 'local_activity', title: 'Xperience', subtitle: 'Activities', color: 'purple', to: '/experience' },
        { icon: 'directions_bus', title: 'Bus &', subtitle: 'Shuttle', color: 'pink', to: '/bus' },
        { icon: 'airport_shuttle', title: 'Airport', subtitle: 'Transfer', color: 'teal', to: '/airport-transfer' },
        ...(isAuthenticated ? [{ icon: 'person', title: 'My', subtitle: 'Profile', color: 'cyan', to: '/profile' }] : []),
    ];

    const promos = [
        {
            badge: 'LIMITED TIME',
            badgeColor: 'yellow',
            title: 'Up to 20% Off\nDining Vouchers',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUh0E7h4kKz315MnHIzv_UTPH9iYSAgKp5u59CVwebESS8qSBsR-xoVQ2FnLHoG5zZJl_Fogvhc8S0JhBWbxmRMBY0e2ehHNkC1z1VcRZGaNtQxLDWBvFPsZxf9nlwpRZ4fC5oBPlOw-cT8QWF6VVE7zimKRvocqbiKSv5f4cA9S9W8vrQIgFuW7Yk5ktPwbIWZaPyOG527-J3nX-IawG9l7rUMl5xXTHdd5FRn9LzMkLbuXDkUyImJ5mM6g3gCN9PAqVNmcLU47c'
        },
        {
            badge: 'FLIGHT DEAL',
            badgeColor: 'blue',
            title: 'International Flights\nStarting from $199',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMv7gS5O3bc8_67hLa_ydpldx0r7L-BjMVVuBXmPyPgxNAKGl4T3lEVXH7yom2ylDE7ZXpw0ydLkviVAoRUd3fiznhTZOp1e_anYolCVExsN7jbxyhTLXMBiuIIsrjUTR1rSLBebaqGKiWZ57YKgfPR-owgYKTWy1qgRIoFXWfU7YIMmjoBYyH7qnu0j629oPlTus3NFbKsejq68LMsWL2MnMHMmI2TFvTAgPLJkHPb0SJvQoQZNRzy3xC3MbkUjXzR81uOH4M0-g'
        },
        {
            badge: 'STAYCATION',
            badgeColor: 'purple',
            title: 'Weekend Getaway\nPackages',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOUxGIqRVbUdCmNozeycTjPhDt_WulULzmrpwAYNT23GLnTpMZIjQx3_lMKlzxDiPhxyoPNv94FFLJ1h5LsFyBY9HCq9S1hDbYRY4rn8cJQUil7v5O8Ii3aJSaS5-tLEvLTVfgYcbBKlyuGWlxWvtpPur_Vl4dqHseFqq9iJIkY4t1srjZcnCy0hJyD_el7_KKlhpACaERsV-cfTdy2YQ-KFLzUobD6DqOpaGzJIm44DDbz1bmqcOOD4IUT7525OZGvfKAZTKNxE0'
        },
    ];

    const coupons = [
        {
            icon: 'flight_takeoff',
            color: 'blue',
            discount: 'Save $50',
            title: 'International Flights',
            terms: 'Min. spend $500 • Valid until Dec 31',
            code: 'FLYHIGH'
        },
        {
            icon: 'hotel',
            color: 'orange',
            discount: '15% OFF',
            title: 'First Hotel Booking',
            terms: 'Max discount $30 • New users only',
            code: 'STAYLUXE'
        },
        {
            icon: 'local_activity',
            color: 'purple',
            discount: '10% Back',
            title: 'Xperience Activity',
            terms: 'Cashback in points • All activities',
            code: 'FUNTIME'
        },
    ];

    const [destinations, setDestinations] = useState<DestinationResult[]>([
        {
            id: 1,
            name: 'Ha Noi',
            subtitle: 'Flights & stays from 752.000 VND',
            price: '752.000 VND',
            rating: 4.6,
            image: 'https://images.unsplash.com/photo-1555921015-5532091f6026?q=80&w=1200&auto=format&fit=crop'
        },
        {
            id: 2,
            name: 'Da Nang',
            subtitle: 'Flights & stays from 814.000 VND',
            price: '814.000 VND',
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1597047084897-51e81819a499?q=80&w=1200&auto=format&fit=crop'
        },
        {
            id: 3,
            name: 'Phu Quoc',
            subtitle: 'Flights & stays from 876.000 VND',
            price: '876.000 VND',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?q=80&w=1200&auto=format&fit=crop'
        },
        {
            id: 4,
            name: 'HCM',
            subtitle: 'Flights & stays from 566.000 VND',
            price: '566.000 VND',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=1200&auto=format&fit=crop'
        },
    ]);

    useEffect(() => {
        const loadDestinations = async () => {
            try {
                const response = await fetchDestinations();
                if (response.success && response.data?.length) {
                    setDestinations(response.data);
                }
            } catch (error) {
                console.error('Không thể tải destinations từ backend:', error);
            }
        };

        loadDestinations();
    }, []);

    const features = [
        {
            icon: 'verified_user',
            title: 'Secure Transactions',
            description: 'Your security is our priority. We use advanced encryption to protect your payments.'
        },
        {
            icon: 'savings',
            title: 'Best Price Guarantee',
            description: "Find a lower price elsewhere? We'll match it and give you a discount on your next booking."
        },
        {
            icon: 'support_agent',
            title: '24/7 Customer Support',
            description: 'Our team is available round the clock to assist you with any questions or issues.'
        },
    ];

    return (
        <div className={styles.homePage}>
            {/* Hero Section với Search */}
            <HeroSearch onSearch={handleSearchClick} />

            {/* Main Content */}
            <main className={styles.mainContent}>
                {/* Quick Links */}
                <div className={styles.quickLinks}>
                    {quickLinks.map((link, index) => (
                        <Link key={index} to={link.to ?? '/'} className={styles.quickLink}>
                            <div className={`${styles.iconCircle} ${styles[link.color]}`}>
                                <span className="material-symbols-outlined">{link.icon}</span>
                            </div>
                            <span className={styles.linkText}>
                                {link.title}<br />{link.subtitle}
                            </span>
                        </Link>
                    ))}
                </div>

                {/* Ongoing Promos */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <div>
                            <h3>Ongoing Promos</h3>
                            <p>Don't miss out on these limited time offers</p>
                        </div>
                        <a href="#" className={styles.seeAll}>
                            See All Promos <span className="material-symbols-outlined">arrow_forward</span>
                        </a>
                    </div>
                    <div className={styles.promosGrid}>
                        {promos.map((promo, index) => (
                            <div key={index} className={styles.promoCard}>
                                <div
                                    className={styles.promoImage}
                                    style={{ backgroundImage: `url(${promo.image})` }}
                                />
                                <div className={styles.promoOverlay}>
                                    <span className={`${styles.promoBadge} ${styles[promo.badgeColor]}`}>
                                        {promo.badge}
                                    </span>
                                    <h4>{promo.title.split('\n').map((line, i) => (
                                        <React.Fragment key={i}>
                                            {line}{i < promo.title.split('\n').length - 1 && <br />}
                                        </React.Fragment>
                                    ))}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Exclusive Offers */}
                <section className={`${styles.section} ${styles.couponsSection}`}>
                    <div className={styles.sectionHeader}>
                        <div>
                            <h3>Exclusive Offers</h3>
                            <p>Grab these coupons for extra savings</p>
                        </div>
                        <a href="#" className={styles.seeAll}>
                            View All Coupons <span className="material-symbols-outlined">arrow_forward</span>
                        </a>
                    </div>
                    <div className={styles.couponsGrid}>
                        {coupons.map((coupon, index) => (
                            <div key={index} className={styles.couponCard}>
                                <div className={styles.couponLeft}>
                                    <div className={`${styles.couponIcon} ${styles[coupon.color]}`}>
                                        <span className="material-symbols-outlined">{coupon.icon}</span>
                                    </div>
                                    <div>
                                        <span className={`${styles.couponDiscount} ${styles[coupon.color]}`}>
                                            {coupon.discount}
                                        </span>
                                        <h4>{coupon.title}</h4>
                                        <p>{coupon.terms}</p>
                                    </div>
                                </div>
                                <div className={styles.couponDivider}>
                                    <div className={styles.dividerCircleTop} />
                                    <div className={styles.dividerCircleBottom} />
                                </div>
                                <div className={styles.couponRight}>
                                    <span className={styles.codeLabel}>Promo Code</span>
                                    <div className={styles.codeBox}>{coupon.code}</div>
                                    <button className={styles.copyButton}>
                                        Copy <span className="material-symbols-outlined">content_copy</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Popular Destinations */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <div>
                            <h3>Popular Destinations</h3>
                            <p>Trending spots for travelers from your region</p>
                        </div>
                    </div>
                    <div className={styles.destinationsGrid}>
                        {destinations.map((dest, index) => (
                            <div key={index} className={styles.destinationCard} onClick={() => navigate(`/hotels?destination=${dest.name}`)}>
                                <div className={styles.destinationImage}>
                                    <div
                                        className={styles.destImageBg}
                                        style={{ backgroundImage: `url(${dest.image})` }}
                                    />
                                    <div className={styles.rating}>
                                        {dest.rating} ★
                                    </div>
                                </div>
                                <div>
                                    <h4>{dest.name}</h4>
                                    <p>
                                        Flights from <span className={styles.price}>{dest.price}</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Gợi ý cho bạn */}
                <Recommended />

                {/* Frequently Asked Questions (FAQ) */}
                <section className={styles.faqSection}>
                    <div className={styles.sectionHeader}>
                        <div>
                            <h3>Frequently Asked Questions</h3>
                            <p>Get answers to your common questions about hotel bookings and travel services on Traveloka</p>
                        </div>
                    </div>
                    <div className={styles.faqList}>
                        {faqData.map((faq, index) => {
                            const isOpen = openFaqIdx === index;
                            return (
                                <div key={index} className={styles.faqCard}>
                                    <button
                                        className={styles.faqHeader}
                                        onClick={() => setOpenFaqIdx(isOpen ? null : index)}
                                        aria-expanded={isOpen}
                                    >
                                        <h4>{faq.q}</h4>
                                        <div className={`${styles.faqArrowCircle} ${isOpen ? styles.open : ''}`}>
                                            <span className="material-symbols-outlined text-[20px]">
                                                keyboard_arrow_down
                                            </span>
                                        </div>
                                    </button>
                                    <div className={`${styles.faqAnswerWrapper} ${isOpen ? styles.open : ''}`}>
                                        <div className={styles.faqAnswerContent}>
                                            {faq.a}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Why Book With Traveloka */}
                <section className={styles.featuresSection}>
                    <h3>Why Book With Traveloka?</h3>
                    <div className={styles.featuresGrid}>
                        {features.map((feature, index) => (
                            <div key={index} className={styles.featureCard}>
                                <div className={styles.featureIcon}>
                                    <span className="material-symbols-outlined">{feature.icon}</span>
                                </div>
                                <h4>{feature.title}</h4>
                                <p>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};
