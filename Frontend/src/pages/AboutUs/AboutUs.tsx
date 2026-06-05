import React from 'react';
import { useLanguage } from '../../context';
import styles from './AboutUs.module.css';

const AboutUs: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className={styles.container}>
            <div className={styles.hero}>
                <h1>{t('about.title', 'About Booking Travel')}</h1>
                <p>{t('about.subtitle', 'Empowering Discovery, One Journey at a Time')}</p>
            </div>

            <div className={styles.content}>
                <section className={styles.missionSection}>
                    <h2>{t('about.missionTitle', 'Our Mission')}</h2>
                    <p>
                        {t('about.missionText', 'At Booking Travel, we believe that traveling should be an accessible, seamless, and joyous experience for everyone. Our mission is to empower people to discover and explore the world around them by providing a comprehensive, easy-to-use platform for all their travel and lifestyle needs.')}
                    </p>
                </section>

                <section className={styles.statsSection}>
                    <div className={styles.statBox}>
                        <h3>50M+</h3>
                        <p>{t('about.statUsers', 'Active Users')}</p>
                    </div>
                    <div className={styles.statBox}>
                        <h3>100+</h3>
                        <p>{t('about.statPartners', 'Airline Partners')}</p>
                    </div>
                    <div className={styles.statBox}>
                        <h3>1M+</h3>
                        <p>{t('about.statAccommodations', 'Acclaimed Accommodations')}</p>
                    </div>
                </section>

                <section className={styles.storySection}>
                    <h2>{t('about.storyTitle', 'Our Story')}</h2>
                    <div className={styles.storyGrid}>
                        <div className={styles.storyText}>
                            <p>
                                {t('about.storyP1', "Founded in 2012, Booking Travel started as a flight search engine to make it easier for people to find cheaper flights back home. By 2013, we evolved into a ticket booking application, and we haven't stopped innovating since.")}
                            </p>
                            <br />
                            <p>
                                {t('about.storyP2', "Today, we are Southeast Asia's leading travel platform. From flights and hotels to trains, buses, car rentals, and even lifestyle activities like Xperience and spa vouchers, we are here to ensure your journey is planned effortlessly.")}
                            </p>
                        </div>
                        <div className={styles.storyImage}>
                            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOUxGIqRVbUdCmNozeycTjPhDt_WulULzmrpwAYNT23GLnTpMZIjQx3_lMKlzxDiPhxyoPNv94FFLJ1h5LsFyBY9HCq9S1hDbYRY4rn8cJQUil7v5O8Ii3aJSaS5-tLEvLTVfgYcbBKlyuGWlxWvtpPur_Vl4dqHseFqq9iJIkY4t1srjZcnCy0hJyD_el7_KKlhpACaERsV-cfTdy2YQ-KFLzUobD6DqOpaGzJIm44DDbz1bmqcOOD4IUT7525OZGvfKAZTKNxE0" alt="Booking Travel Journey" />
                        </div>
                    </div>
                </section>

                <section className={styles.valuesSection}>
                    <h2>{t('about.valuesTitle', 'Our Core Values')}</h2>
                    <div className={styles.valuesGrid}>
                        <div className={styles.valueCard}>
                            <span className="material-symbols-outlined">favorite</span>
                            <h4>{t('about.valueCustomerTitle', 'Customer First')}</h4>
                            <p>{t('about.valueCustomerText', "We build our products around our users' needs, ensuring an intuitive and reliable experience.")}</p>
                        </div>
                        <div className={styles.valueCard}>
                            <span className="material-symbols-outlined">lightbulb</span>
                            <h4>{t('about.valueInnovationTitle', 'Innovation')}</h4>
                            <p>{t('about.valueInnovationText', 'We continuously innovate to provide better solutions and more comprehensive choices.')}</p>
                        </div>
                        <div className={styles.valueCard}>
                            <span className="material-symbols-outlined">handshake</span>
                            <h4>{t('about.valueTrustTitle', 'Trust & Security')}</h4>
                            <p>{t('about.valueTrustText', 'Your data and transactions are safe with us. Integrity is the foundation of everything we do.')}</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AboutUs;
