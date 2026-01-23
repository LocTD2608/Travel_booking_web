import React from 'react';
import styles from './Header.module.css';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
    return (
        <header className={styles.header}>
            {/* Top Bar */}
            <div className={styles.topBar}>
                <Link to="/" className={styles.logo}>
                    <span className="material-symbols-outlined">flight_takeoff</span>
                    <h2>Traveloka</h2>
                </Link>

                <div className={styles.rightSection}>
                    <div className={styles.navLinks}>
                        <a href="#">EN | USD</a>
                        <a href="#">Help</a>
                        <Link to="/my-bookings">My Booking</Link>
                    </div>

                    <div className={styles.authButtons}>
                        <Link to="/login" className={styles.btnLogin}>
                            Log In
                        </Link>
                        <Link to="/register" className={styles.btnRegister}>
                            Register
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className={styles.mainNav}>
                <Link to="/hotels" className={`${styles.navItem} ${styles.active}`}>
                    <span className="material-symbols-outlined">hotel</span>
                    <span>Accommodations</span>
                </Link>
                <Link to="/flights" className={styles.navItem}>
                    <span className="material-symbols-outlined">directions_car</span>
                    <span>Transport</span>
                </Link>
                <Link to="/experience" className={styles.navItem}>
                    <span className="material-symbols-outlined">local_activity</span>
                    <span>Xperience</span>
                </Link>
                <a href="#" className={styles.navItem}>
                    <span className="material-symbols-outlined">credit_card</span>
                    <span>Bills & Top-up</span>
                </a>
            </nav>

            {/* Sub Navigation */}
            <div className={styles.subNav}>
                <a href="#">Hotels</a>
                <a href="#">Villas</a>
                <a href="#">Apartments</a>
                <Link to="/flights">Flights</Link>
                <a href="#">Trains</a>
                <a href="#">Bus & Shuttle</a>
                <a href="#">Airport Transfer</a>
                <a href="#">Car Rental</a>
            </div>
        </header>
    );
};
