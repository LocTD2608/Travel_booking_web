import React from 'react';
import { HeroSearch } from '../components/common/HeroSearch';
import styles from './HomePage.module.css';

export const HomePage: React.FC = () => {
    const quickLinks = [
        { icon: 'airplane_ticket', title: 'Best Price', subtitle: 'Flights', color: 'blue' },
        { icon: 'hotel_class', title: 'Luxury', subtitle: 'Hotels', color: 'orange' },
        { icon: 'train', title: 'JR Pass', subtitle: '& Trains', color: 'green' },
        { icon: 'local_activity', title: 'Xperience', subtitle: 'Activities', color: 'purple' },
        { icon: 'directions_bus', title: 'Bus &', subtitle: 'Shuttle', color: 'pink' },
        { icon: 'airport_shuttle', title: 'Airport', subtitle: 'Transfer', color: 'teal' },
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

    const destinations = [
        {
            name: 'Tokyo, Japan',
            price: '$450',
            rating: '4.9',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdIV-mcWLwmgavcRXse7Xu5pvGA6xrII2tYUSEJUDtH6r1X0EYvCzK6jaITBHixVwjwHOjepyqniZP4xajDAV4R4b-MGdCGGYYNTVZpFqorBX7m6c3YfNx1lLqR3uWFd07bTrOhHMgJxcH_hith4VAsY8laM965IrnTgm9ALmDhm7jrMUzf1iiTTVc1p2PcJdKInp8a0GKxC5AFfsIc6sM3N-DclU6C86m9b7QztHAj7PzqNrRRP13H0_LY7PhfWfus5GBLzfFlbs'
        },
        {
            name: 'Singapore',
            price: '$120',
            rating: '4.8',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_5N2Dv89LlDMJ7n4dzrgLjruOvWtdG-qZn_JVaVNZ2kcU4AlTczvFregIREZOVIMrNlBSZ4UZ7y0F5luXx5rNESKq2m6hHoSBkoBqiboHBc_1iH8yH2rUa_FKaLHQU_J0JCe9fmhz7UZPXMO6svI-iieAtKEGKgJ0pffB6AqECSLYwJgZbhlsQv9XgSbt9dWzOoRjdVFa7Zjdb0X2evvQlqmFgp98U8D_YKyqws0atT4jhwBD2v6t70zhUBaksGE3IREamA1v3bI'
        },
        {
            name: 'Bali, Indonesia',
            price: '$35/night',
            rating: '4.7',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDO0goVIhlbzeMQ61KemMzFFfQg_FQ_z1GzQ57JVeVMDoBGucZbxu_YbKTx75nbC5aUAg3eX9QjFbQtfTPDOUqVyVO7cZYXb-I-oB2Waz07aPGFNRMpVYcp1tDH7uDFKGll-jjBKQ5d4Xtbrj4ipxfBCIJfdmh4NKd66ri6iPL4TosDQ83xAnVgnCfZ8Yy9sF-SSJ3gj0Vfa9RO1GDkz9YiJnwU1Cf8xB4TrqA5MgzpTM_mSYS7xElyHuGyRLqlRGBpu6CQ5PeO1zg'
        },
        {
            name: 'London, UK',
            price: '$680',
            rating: '4.6',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCw2DlHzNi0lXvZmUjh0Xp0VVa5rBowR5WjMyANtP9j16j8BeTuuzMTbZTl1qDO1ZjOius3qXLoJpMhlXGchoCdcouKoiaAp2DLxAuOG8e5BcKyP22I3k8PhnpyPZA78EJEK88rZNfqnlqLeAVQ0PhnoEi2xsHWz13TBKtgjDQm8s6_V_LvMce2Pb_ndFYRPKgvd5tUkvdbnBrOBJ_J1aWbMqdULQfn8cF7Dnbqz6dGTAzyhIE_dj65GkC6V5sB0-Xa9fQdSf6gqY8'
        },
    ];

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
            <HeroSearch />

            {/* Main Content */}
            <main className={styles.mainContent}>
                {/* Quick Links */}
                <div className={styles.quickLinks}>
                    {quickLinks.map((link, index) => (
                        <a key={index} href="#" className={styles.quickLink}>
                            <div className={`${styles.iconCircle} ${styles[link.color]}`}>
                                <span className="material-symbols-outlined">{link.icon}</span>
                            </div>
                            <span className={styles.linkText}>
                                {link.title}<br />{link.subtitle}
                            </span>
                        </a>
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
                            <div key={index} className={styles.destinationCard}>
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
