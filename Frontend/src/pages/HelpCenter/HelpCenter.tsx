import React from 'react';
import styles from './HelpCenter.module.css';

const HelpCenter: React.FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Hello, how can we help you?</h1>
                <p>Find answers, guides and policies here</p>
            </div>

            <div className={styles.searchBox}>
                <input
                    type="text"
                    placeholder="Search for guides, topics, or FAQs"
                    className={styles.searchInput}
                />
                <button className={styles.searchButton}>Search</button>
            </div>

            <div className={styles.topics}>
                <div className={styles.topicCard}>
                    <span className={`material-symbols-outlined ${styles.topicIcon}`}>flight</span>
                    <h3>Flights</h3>
                    <p>Booking, Check-in, Reschedule & Refunds</p>
                </div>
                <div className={styles.topicCard}>
                    <span className={`material-symbols-outlined ${styles.topicIcon}`}>hotel</span>
                    <h3>Accommodations</h3>
                    <p>Hotel & Villa bookings, Cancellation</p>
                </div>
                <div className={styles.topicCard}>
                    <span className={`material-symbols-outlined ${styles.topicIcon}`}>account_circle</span>
                    <h3>Account Info</h3>
                    <p>Managing profile, Password, Email</p>
                </div>
                <div className={styles.topicCard}>
                    <span className={`material-symbols-outlined ${styles.topicIcon}`}>payments</span>
                    <h3>Payment</h3>
                    <p>Payment methods, Failed transactions</p>
                </div>
            </div>
        </div>
    );
};

export default HelpCenter;
