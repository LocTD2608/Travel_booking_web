import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { HeroSearch } from '../../components/ui/HeroSearch/HeroSearch';
import { Recommended } from '../../components/ui/Recommended/Recommended';
import { fetchDestinations, fetchPromotions } from '../../services/searchApi';
import type { DestinationResult } from '../../types/search';
import { useLanguage } from '../../context';
import styles from './HomePage.module.css';


const faqData = [
    {
        q: 'How to book a hotel on Booking Travel?',
        a: 'Simply use the hotel search tool at the top of the page by entering your destination, check-in and check-out dates, number of rooms, and number of guests. After clicking "Search Hotels", you can use filters to narrow down results by price, star rating, amenities, and more.'
    },
    {
        q: 'How do I get the best hotel deals on Booking Travel?',
        a: 'Use the sorting options or the price range filter to find hotels that fit your budget. For extra savings, browse our latest promo codes and special campaigns. If you are a new Booking Travel user, you can also get exclusive discounts on your first booking using the code BKTVLNEW.'
    },
    {
        q: 'How many hotels are listed on Booking Travel?',
        a: 'Booking Travel lists more than 1,000,000+ accommodations globally, including luxury hotels, villas, apartments, resorts, and unique homestays.'
    },
    {
        q: 'Where in the world can I book a hotel with Booking Travel?',
        a: 'Anywhere! We help you secure accommodations globally. Popular international destinations include Bali, Jakarta, Bangkok, Phuket, Singapore, Kuala Lumpur, Tokyo, Seoul, as well as major Australian cities like Sydney, Melbourne, Brisbane, and Perth.'
    },
    {
        q: 'What types of accommodation are available on Booking Travel?',
        a: 'Whatever your travel style, we have it. Choose from a wide range of hotels, hostels, villas, resorts, apartments, guest houses, glamping, and cozy homestays.'
    },
    {
        q: 'How do I find hotels near me?',
        a: 'Need a last-minute room or planning a local staycation? Simply visit our "Hotels Near Me" page to instantly discover and book the top-rated accommodations located in your immediate vicinity.'
    },
    {
        q: 'Can I change or cancel my hotel booking on Booking Travel?',
        a: 'Hotels that support rescheduling or free cancellation are clearly marked during booking, along with their deadlines. If your booking is eligible for a refund, the amount will be returned to your original payment method.'
    },
    {
        q: 'How do I contact Booking Travel customer support?',
        a: 'You can easily reach our customer care team through the Booking Travel Help Center. If your question is not resolved, you can submit a support request. Depending on your location, phone support or live chat may also be available.'
    },
    {
        q: 'What payment methods are supported on Booking Travel?',
        a: 'We support a variety of safe, convenient payment methods including major credit/debit cards (Visa, Mastercard, JCB), popular e-wallets (MoMo, VNPay), and secure local bank transfers.'
    },
    {
        q: 'What major hotel chains are available on Booking Travel?',
        a: 'We list all your favorite leading international and local hotel chains including Marriott, Hilton, Accor, Wyndham, Best Western, and InterContinental. High-end boutique and artistic hotels are also available.'
    }
];

export const HomePage: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const { showSuccess, showError } = useNotification();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const translateCoupon = (coupon: any) => {
        const titleMap: Record<string, string> = {
            'International Flights': t('home.coupon.intlFlights', 'Chuyến bay quốc tế'),
            'First Hotel Booking': t('home.coupon.firstHotel', 'Đặt khách sạn đầu tiên'),
            'Xperience Activity': t('home.coupon.xperience', 'Trải nghiệm vui chơi giải trí')
        };
        const discountMap: Record<string, string> = {
            'Save $50': t('home.coupon.save50', 'Tiết kiệm $50'),
            '15% OFF': t('home.coupon.off15', 'Giảm 15%'),
            '10% Back': t('home.coupon.back10', 'Hoàn tiền 10%')
        };
        const termsMap: Record<string, string> = {
            'Min. spend $500 • Valid until Dec 31': t('home.coupon.termsIntl', 'Chi tiêu tối thiểu $500 • Hạn đến 31 thg 12'),
            'Max discount $30 • New users only': t('home.coupon.termsHotel', 'Giảm tối đa $30 • Chỉ người dùng mới'),
            'Cashback in points • All activities': t('home.coupon.termsXperience', 'Hoàn điểm tích lũy • Tất cả hoạt động')
        };

        return {
            ...coupon,
            title: titleMap[coupon.title] || coupon.title,
            discount: discountMap[coupon.discount] || coupon.discount,
            terms: termsMap[coupon.terms] || coupon.terms
        };
    };

    const translatePromo = (promo: any) => {
        const titleMap: Record<string, string> = {
            'Up to 20% Off\nDining Vouchers': t('home.promo.dining', 'Giảm tới 20%\n Voucher ăn uống'),
            'International Flights\nStarting from $199': t('home.promo.flights', 'Chuyến bay quốc tế\n Chỉ từ $199'),
            'Weekend Getaway\nPackages': t('home.promo.getaway', 'Gói du lịch nghỉ dưỡng\n Cuối tuần')
        };
        const badgeMap: Record<string, string> = {
            'LIMITED TIME': t('home.promo.limitedTime', 'ƯU ĐÃI CÓ HẠN'),
            'FLIGHT DEAL': t('home.promo.flightDeal', 'GIÁ TỐT MÁY BAY'),
            'STAYCATION': t('home.promo.staycation', 'DU LỊCH TRONG NƯỚC')
        };

        return {
            ...promo,
            title: titleMap[promo.title] || promo.title,
            badge: badgeMap[promo.badge] || promo.badge
        };
    };
    const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);
    const [promos, setPromos] = useState<any[]>([]);
    const [coupons, setCoupons] = useState<any[]>([]);

    useEffect(() => {
        const loadPromotions = async () => {
            try {
                const response = await fetchPromotions();
                if (response.success && response.data) {
                    const allItems = response.data;
                    setPromos(allItems.filter((item: any) => item.type === 'PROMO'));
                    setCoupons(allItems.filter((item: any) => item.type === 'COUPON'));
                }
            } catch (error) {
                console.error('Không thể tải promotions từ backend:', error);
            }
        };
        loadPromotions();
    }, []);

    const handleCopyCode = (code: string) => {
        if (!code) return;
        navigator.clipboard.writeText(code).then(() => {
            showSuccess(`${t('home.copied', 'Successfully copied promo code: ')}${code}`);
        }).catch((err) => {
            console.error('Không thể copy code:', err);
            showError(t('home.copyFailed', 'Failed to copy promo code'));
        });
    };

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
        { icon: 'airplane_ticket', title: t('home.quickLinks.flightsTitle', 'Best Price'), subtitle: t('home.quickLinks.flightsSub', 'Flights'), color: 'blue', to: '/flights' },
        { icon: 'hotel_class', title: t('home.quickLinks.hotelsTitle', 'Luxury'), subtitle: t('home.quickLinks.hotelsSub', 'Hotels'), color: 'orange', to: '/hotels' },
        { icon: 'train', title: t('home.quickLinks.trainsTitle', 'JR Pass'), subtitle: t('home.quickLinks.trainsSub', '& Trains'), color: 'green', to: '/trains' },
        { icon: 'local_activity', title: t('home.quickLinks.experienceTitle', 'Xperience'), subtitle: t('home.quickLinks.experienceSub', 'Activities'), color: 'purple', to: '/experience' },
        { icon: 'directions_bus', title: t('home.quickLinks.busTitle', 'Bus &'), subtitle: t('home.quickLinks.busSub', 'Shuttle'), color: 'pink', to: '/bus' },
        { icon: 'airport_shuttle', title: t('home.quickLinks.airportTitle', 'Airport'), subtitle: t('home.quickLinks.airportSub', 'Transfer'), color: 'teal', to: '/airport-transfer' },
        ...(isAuthenticated ? [{ icon: 'person', title: t('home.quickLinks.profileTitle', 'My'), subtitle: t('home.quickLinks.profileSub', 'Profile'), color: 'cyan', to: '/profile' }] : []),
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
            title: t('features.secure.title', 'Secure Transactions'),
            description: t('features.secure.desc', 'Your security is our priority. We use advanced encryption to protect your payments.')
        },
        {
            icon: 'savings',
            title: t('features.bestPrice.title', 'Best Price Guarantee'),
            description: t('features.bestPrice.desc', "Find a lower price elsewhere? We'll match it and give you a discount on your next booking.")
        },
        {
            icon: 'support_agent',
            title: t('features.support.title', '24/7 Customer Support'),
            description: t('features.support.desc', 'Our team is available round the clock to assist you with any questions or issues.')
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
                            <h3>{t('home.ongoingPromos', 'Ongoing Promos')}</h3>
                            <p>{t('home.promosSub', "Don't miss out on these limited time offers")}</p>
                        </div>
                        <a href="#" className={styles.seeAll}>
                            {t('home.seeAllPromos', 'See All Promos')} <span className="material-symbols-outlined">arrow_forward</span>
                        </a>
                    </div>
                    <div className={styles.promosGrid}>
                        {promos.map(translatePromo).map((promo, index) => (
                            <div key={index} className={styles.promoCard} onClick={() => promo.targetUrl && navigate(promo.targetUrl)}>
                                <div
                                    className={styles.promoImage}
                                    style={{ backgroundImage: `url(${promo.image})` }}
                                />
                                <div className={styles.promoOverlay}>
                                    <span className={`${styles.promoBadge} ${styles[promo.badgeColor]}`}>
                                        {promo.badge}
                                    </span>
                                    <h4>{((promo.title || '') as string).split('\n').map((line: string, i: number) => (
                                        <React.Fragment key={i}>
                                            {line}{i < ((promo.title || '') as string).split('\n').length - 1 && <br />}
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
                            <h3>{t('home.exclusiveOffers', 'Exclusive Offers')}</h3>
                            <p>{t('home.couponsSub', 'Grab these coupons for extra savings')}</p>
                        </div>
                        <a href="#" className={styles.seeAll}>
                            {t('home.viewAllCoupons', 'View All Coupons')} <span className="material-symbols-outlined">arrow_forward</span>
                        </a>
                    </div>
                    <div className={styles.couponsGrid}>
                        {coupons.map(translateCoupon).map((coupon, index) => (
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
                                    <span className={styles.codeLabel}>{t('home.promoCode', 'Promo Code')}</span>
                                    <div className={styles.codeBox}>{coupon.code}</div>
                                    <button 
                                        className={styles.copyButton}
                                        onClick={() => handleCopyCode(coupon.code)}
                                    >
                                        {t('home.copy', 'Copy')} <span className="material-symbols-outlined">content_copy</span>
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
                            <h3>{t('home.popularDestinations', 'Popular Destinations')}</h3>
                            <p>{t('home.destinationsSub', 'Trending spots for travelers from your region')}</p>
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
                                        {t('home.flightsFrom', 'Flights & stays from')} <span className={styles.price}>{dest.price}</span>
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
                            <h3>{t('home.faqTitle', 'Frequently Asked Questions')}</h3>
                            <p>{t('home.faqSub', 'Get answers to your common questions about hotel bookings and travel services on Booking Travel')}</p>
                        </div>
                    </div>
                    <div className={styles.faqList}>
                        {faqData.map((faq, index) => {
                            const isOpen = openFaqIdx === index;
                            const faqQ = t(`faq.q${index + 1}`, faq.q);
                            const faqA = t(`faq.a${index + 1}`, faq.a);
                            return (
                                <div key={index} className={styles.faqCard}>
                                    <button
                                        className={styles.faqHeader}
                                        onClick={() => setOpenFaqIdx(isOpen ? null : index)}
                                        aria-expanded={isOpen}
                                    >
                                        <h4>{faqQ}</h4>
                                        <div className={`${styles.faqArrowCircle} ${isOpen ? styles.open : ''}`}>
                                            <span className="material-symbols-outlined text-[20px]">
                                                keyboard_arrow_down
                                            </span>
                                        </div>
                                    </button>
                                    <div className={`${styles.faqAnswerWrapper} ${isOpen ? styles.open : ''}`}>
                                        <div className={styles.faqAnswerContent}>
                                            {faqA}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Why Book With Booking Travel */}
                <section className={styles.featuresSection}>
                    <h3>{t('home.whyBook', 'Why Book With Booking Travel?')}</h3>
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
