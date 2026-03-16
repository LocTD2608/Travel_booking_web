import React from 'react';
import styles from './HowToBook.module.css';

const HowToBook: React.FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>How to Book on Traveloka</h1>
                <p>Follow these simple steps to book your next trip</p>
            </div>

            <div className={styles.steps}>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                        <h3>Search</h3>
                        <p>Fill in your destination, travel dates, and number of passengers.</p>
                    </div>
                </div>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                        <h3>Select</h3>
                        <p>Choose the best flight, hotel, or activity from our variety of options.</p>
                    </div>
                </div>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                        <h3>Book</h3>
                        <p>Enter passenger details and complete your payment securely.</p>
                    </div>
                </div>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>4</div>
                    <div className={styles.stepContent}>
                        <h3>E-ticket</h3>
                        <p>Receive your e-ticket or voucher via email within minutes.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowToBook;
