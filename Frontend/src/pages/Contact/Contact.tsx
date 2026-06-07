import React from 'react';
import { useLanguage } from '../../context';
import styles from './Contact.module.css';

const Contact: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className={styles.container}>
            <div className={styles.hero}>
                <h1>{t('contact.title', 'Contact Us')}</h1>
                <p>{t('contact.subtitle', "We'd love to hear from you. Please fill out the form below or reach out to us using the contact details provided.")}</p>
            </div>
            <div className={styles.content}>
                <div className={styles.info}>
                    <h2>{t('contact.getInTouch', 'Get in Touch')}</h2>
                    <div className={styles.infoItem}>
                        <span className="material-symbols-outlined">location_on</span>
                        <p>123 Booking Travel Street, Ho Chi Minh City, Vietnam</p>
                    </div>
                    <div className={styles.infoItem}>
                        <span className="material-symbols-outlined">phone</span>
                        <p>+84 123 456 789</p>
                    </div>
                    <div className={styles.infoItem}>
                        <span className="material-symbols-outlined">mail</span>
                        <p>support@bookingtravel.com</p>
                    </div>
                </div>
                <form className={styles.form}>
                    <h2>{t('contact.sendMsg', 'Send a Message')}</h2>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">{t('contact.name', 'Name')}</label>
                        <input type="text" id="name" placeholder={t('contact.namePlaceholder', 'Your Name')} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">{t('contact.email', 'Email')}</label>
                        <input type="email" id="email" placeholder={t('contact.emailPlaceholder', 'Your Email')} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="subject">{t('contact.subject', 'Subject')}</label>
                        <input type="text" id="subject" placeholder={t('contact.subjectPlaceholder', 'Subject')} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="message">{t('contact.message', 'Message')}</label>
                        <textarea id="message" rows={5} placeholder={t('contact.messagePlaceholder', 'Your Message')} required></textarea>
                    </div>
                    <button type="submit" className={styles.submitBtn}>{t('contact.submit', 'Send Message')}</button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
