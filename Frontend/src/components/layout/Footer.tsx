import React from 'react';
import styles from './Footer.module.css';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.gridContainer}>
                    {/* Brand Section */}
                    <div className={styles.brandSection}>
                        <div className={styles.logo}>
                            <span className="material-symbols-outlined">flight_takeoff</span>
                            <h2>Traveloka</h2>
                        </div>
                        <p className={styles.description}>
                            Traveloka is Southeast Asia's leading travel platform, providing diverse travel needs in one platform. We are here to help you discover the world.
                        </p>
                        <div className={styles.socialLinks}>
                            <a href="#" aria-label="Facebook">
                                <span>FB</span>
                            </a>
                            <a href="#" aria-label="Instagram">
                                <span>IG</span>
                            </a>
                            <a href="#" aria-label="Twitter">
                                <span>TW</span>
                            </a>
                        </div>
                    </div>

                    {/* About Section */}
                    <div className={styles.linkSection}>
                        <h4>About Traveloka</h4>
                        <ul>
                            <li><a href="#">How to Book</a></li>
                            <li><a href="#">Contact Us</a></li>
                            <li><a href="#">Help Center</a></li>
                            <li><a href="#">Careers</a></li>
                            <li><a href="#">About Us</a></li>
                        </ul>
                    </div>

                    {/* Products Section */}
                    <div className={styles.linkSection}>
                        <h4>Products</h4>
                        <ul>
                            <li><Link to="/hotels">Hotels</Link></li>
                            <li><Link to="/flights">Flights</Link></li>
                            <li><a href="#">Apartments</a></li>
                            <li><a href="#">Trains</a></li>
                            <li><Link to="/experience">Xperience</Link></li>
                        </ul>
                    </div>

                    {/* Others Section */}
                    <div className={styles.linkSection}>
                        <h4>Others</h4>
                        <ul>
                            <li><a href="#">Traveloka Affiliate</a></li>
                            <li><a href="#">Blog</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms & Conditions</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className={styles.bottomBar}>
                    <p>© 2024 Traveloka. All rights reserved.</p>
                    <div className={styles.paymentLogos}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg" alt="Amex" />
                    </div>
                </div>
            </div>
        </footer>
    );
};
