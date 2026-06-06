import React from 'react';
import { useLanguage } from '../../context';
import styles from './Careers.module.css';

const Careers: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className={styles.container}>
            <div className={styles.hero}>
                <h1>{t('careers.title', 'Join the Booking Travel Team')}</h1>
                <p>{t('careers.subtitle', 'Empowering discovery and shaping the future of travel')}</p>
            </div>

            <div className={styles.section}>
                <h2>{t('careers.whyWorkTitle', 'Why Work With Us')}</h2>
                <div className={styles.values}>
                    <div className={styles.valueCard}>
                        <span className={`material-symbols-outlined ${styles.valueIcon}`}>public</span>
                        <h3>{t('careers.valueGlobalTitle', 'Global Impact')}</h3>
                        <p>{t('careers.valueGlobalDesc', 'Build products that help millions of people across the world explore new destinations.')}</p>
                    </div>
                    <div className={styles.valueCard}>
                        <span className={`material-symbols-outlined ${styles.valueIcon}`}>group</span>
                        <h3>{t('careers.valueTeamTitle', 'Inspiring Team')}</h3>
                        <p>{t('careers.valueTeamDesc', 'Work with talented, passionate individuals who are dedicated to excellence.')}</p>
                    </div>
                    <div className={styles.valueCard}>
                        <span className={`material-symbols-outlined ${styles.valueIcon}`}>trending_up</span>
                        <h3>{t('careers.valueGrowthTitle', 'Growth Opportunities')}</h3>
                        <p>{t('careers.valueGrowthDesc', 'Continuous learning, mentoring, and clear paths for career progression.')}</p>
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <h2>{t('careers.openPositions', 'Open Positions')}</h2>
                <div className={styles.openings}>
                    <div className={styles.jobCard}>
                        <div className={styles.jobInfo}>
                            <h3>{t('careers.job.frontend', 'Frontend Engineer (React)')}</h3>
                            <div className={styles.jobMeta}>
                                <span className={styles.metaItem}>
                                    <span className={`material-symbols-outlined ${styles.metaIcon}`}>location_on</span>
                                    {t('careers.location.hcm', 'Ho Chi Minh City, Vietnam')}
                                </span>
                                <span className={styles.metaItem}>
                                    <span className={`material-symbols-outlined ${styles.metaIcon}`}>work</span>
                                    {t('careers.jobTime', 'Full-time')}
                                </span>
                            </div>
                        </div>
                        <a href="#" className={styles.applyBtn}>{t('careers.apply', 'Apply Now')}</a>
                    </div>

                    <div className={styles.jobCard}>
                        <div className={styles.jobInfo}>
                            <h3>{t('careers.job.ux', 'Senior UX Designer')}</h3>
                            <div className={styles.jobMeta}>
                                <span className={styles.metaItem}>
                                    <span className={`material-symbols-outlined ${styles.metaIcon}`}>location_on</span>
                                    {t('careers.location.remote', 'Remote')}
                                </span>
                                <span className={styles.metaItem}>
                                    <span className={`material-symbols-outlined ${styles.metaIcon}`}>work</span>
                                    {t('careers.jobTime', 'Full-time')}
                                </span>
                            </div>
                        </div>
                        <a href="#" className={styles.applyBtn}>{t('careers.apply', 'Apply Now')}</a>
                    </div>

                    <div className={styles.jobCard}>
                        <div className={styles.jobInfo}>
                            <h3>{t('careers.job.pm', 'Product Manager')}</h3>
                            <div className={styles.jobMeta}>
                                <span className={styles.metaItem}>
                                    <span className={`material-symbols-outlined ${styles.metaIcon}`}>location_on</span>
                                    {t('careers.location.singapore', 'Singapore')}
                                </span>
                                <span className={styles.metaItem}>
                                    <span className={`material-symbols-outlined ${styles.metaIcon}`}>work</span>
                                    {t('careers.jobTime', 'Full-time')}
                                </span>
                            </div>
                        </div>
                        <a href="#" className={styles.applyBtn}>{t('careers.apply', 'Apply Now')}</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Careers;
