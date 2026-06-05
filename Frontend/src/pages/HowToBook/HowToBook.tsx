import React from 'react';
import { useLanguage } from '../../context';
import styles from './HowToBook.module.css';

const HowToBook: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>{t('how.title', 'How to Book on Booking Travel')}</h1>
                <p>{t('how.subtitle', 'Follow these simple steps to book your next trip')}</p>
            </div>

            <div className={styles.steps}>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                        <h3>{t('how.step1Title', 'Search')}</h3>
                        <p>{t('how.step1Desc', 'Fill in your destination, travel dates, and number of passengers.')}</p>
                    </div>
                </div>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                        <h3>{t('how.step2Title', 'Select')}</h3>
                        <p>{t('how.step2Desc', 'Choose the best flight, hotel, or activity from our variety of options.')}</p>
                    </div>
                </div>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                        <h3>{t('how.step3Title', 'Book')}</h3>
                        <p>{t('how.step3Desc', 'Enter passenger details and complete your payment securely.')}</p>
                    </div>
                </div>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>4</div>
                    <div className={styles.stepContent}>
                        <h3>{t('how.step4Title', 'E-ticket')}</h3>
                        <p>{t('how.step4Desc', 'Receive your e-ticket or voucher via email within minutes.')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowToBook;
