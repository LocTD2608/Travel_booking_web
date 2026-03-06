import React, { useState } from 'react';
import styles from './Header.module.css';
import { Link, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const location = useLocation();

    const isAccomActive = activeMenu === 'accommodations' || (!activeMenu && (location.pathname === '/' || location.pathname === '/hotels' || location.pathname === '/apartments'));
    const isTransportActive = activeMenu === 'transport' || (!activeMenu && (location.pathname === '/flights' || location.pathname === '/trains'));
    const isXperienceActive = activeMenu === 'xperience' || (!activeMenu && location.pathname === '/experience');
    const isBillsActive = activeMenu === 'bills';

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
            <div className={styles.mainNavContainer} onMouseLeave={() => setActiveMenu(null)}>
                <nav className={styles.mainNav}>
                    <Link to="/hotels" className={`${styles.navItem} ${isAccomActive ? styles.active : ''}`} onMouseEnter={() => setActiveMenu('accommodations')}>
                        <span className="material-symbols-outlined">hotel</span>
                        <span>Accommodations</span>
                    </Link>
                    <Link to="/flights" className={`${styles.navItem} ${isTransportActive ? styles.active : ''}`} onMouseEnter={() => setActiveMenu('transport')}>
                        <span className="material-symbols-outlined">directions_car</span>
                        <span>Transport</span>
                    </Link>
                    <Link to="/experience" className={`${styles.navItem} ${isXperienceActive ? styles.active : ''}`} onMouseEnter={() => setActiveMenu('xperience')}>
                        <span className="material-symbols-outlined">local_activity</span>
                        <span>Xperience</span>
                    </Link>
                    <a href="#" className={`${styles.navItem} ${isBillsActive ? styles.active : ''}`} onMouseEnter={() => setActiveMenu('bills')}>
                        <span className="material-symbols-outlined">credit_card</span>
                        <span>Bills & Top-up</span>
                    </a>
                </nav>

                {/* Sub Navigation */}
                <div
                    className={styles.subNav}
                    style={{
                        opacity: activeMenu ? 1 : 0,
                        visibility: activeMenu ? 'visible' : 'hidden',
                        height: activeMenu ? '36px' : '0',
                        padding: activeMenu ? '8px 16px' : '0 16px',
                        transition: 'all 0.3s ease',
                        overflow: 'hidden'
                    }}
                >
                    {activeMenu === 'accommodations' && (
                        <>
                            <Link to="/hotels">Hotels</Link>
                            <a href="#">Villas</a>
                            <Link to="/apartments">Apartments</Link>
                        </>
                    )}
                    {activeMenu === 'transport' && (
                        <>
                            <Link to="/flights">Flights</Link>
                            <Link to="/trains">Trains</Link>
                            <a href="#">Bus & Shuttle</a>
                            <a href="#">Airport Transfer</a>
                            <a href="#">Car Rental</a>
                        </>
                    )}
                    {activeMenu === 'xperience' && (
                        <Link to="/experience">Activities & Attractions</Link>
                    )}
                    {activeMenu === 'bills' && (
                        <>
                            <a href="#">Mobile Credit</a>
                            <a href="#">Data Plans</a>
                            <a href="#">Electricity</a>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};
