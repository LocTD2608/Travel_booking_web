import React from 'react';
import styles from './Careers.module.css';

const Careers: React.FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.hero}>
                <h1>Join the Booking Travel Team</h1>
                <p>Empowering discovery and shaping the future of travel</p>
            </div>

            <div className={styles.section}>
                <h2>Why Work With Us</h2>
                <div className={styles.values}>
                    <div className={styles.valueCard}>
                        <span className={`material-symbols-outlined ${styles.valueIcon}`}>public</span>
                        <h3>Global Impact</h3>
                        <p>Build products that help millions of people across the world explore new destinations.</p>
                    </div>
                    <div className={styles.valueCard}>
                        <span className={`material-symbols-outlined ${styles.valueIcon}`}>group</span>
                        <h3>Inspiring Team</h3>
                        <p>Work with talented, passionate individuals who are dedicated to excellence.</p>
                    </div>
                    <div className={styles.valueCard}>
                        <span className={`material-symbols-outlined ${styles.valueIcon}`}>trending_up</span>
                        <h3>Growth Opportunities</h3>
                        <p>Continuous learning, mentoring, and clear paths for career progression.</p>
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <h2>Open Positions</h2>
                <div className={styles.openings}>
                    <div className={styles.jobCard}>
                        <div className={styles.jobInfo}>
                            <h3>Frontend Engineer (React)</h3>
                            <div className={styles.jobMeta}>
                                <span className={styles.metaItem}>
                                    <span className={`material-symbols-outlined ${styles.metaIcon}`}>location_on</span>
                                    Ho Chi Minh City, Vietnam
                                </span>
                                <span className={styles.metaItem}>
                                    <span className={`material-symbols-outlined ${styles.metaIcon}`}>work</span>
                                    Full-time
                                </span>
                            </div>
                        </div>
                        <a href="#" className={styles.applyBtn}>Apply Now</a>
                    </div>

                    <div className={styles.jobCard}>
                        <div className={styles.jobInfo}>
                            <h3>Senior UX Designer</h3>
                            <div className={styles.jobMeta}>
                                <span className={styles.metaItem}>
                                    <span className={`material-symbols-outlined ${styles.metaIcon}`}>location_on</span>
                                    Remote
                                </span>
                                <span className={styles.metaItem}>
                                    <span className={`material-symbols-outlined ${styles.metaIcon}`}>work</span>
                                    Full-time
                                </span>
                            </div>
                        </div>
                        <a href="#" className={styles.applyBtn}>Apply Now</a>
                    </div>

                    <div className={styles.jobCard}>
                        <div className={styles.jobInfo}>
                            <h3>Product Manager</h3>
                            <div className={styles.jobMeta}>
                                <span className={styles.metaItem}>
                                    <span className={`material-symbols-outlined ${styles.metaIcon}`}>location_on</span>
                                    Singapore
                                </span>
                                <span className={styles.metaItem}>
                                    <span className={`material-symbols-outlined ${styles.metaIcon}`}>work</span>
                                    Full-time
                                </span>
                            </div>
                        </div>
                        <a href="#" className={styles.applyBtn}>Apply Now</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Careers;
