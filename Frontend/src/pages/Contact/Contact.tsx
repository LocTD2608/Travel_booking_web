import React from 'react';
import styles from './Contact.module.css';

const Contact: React.FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.hero}>
                <h1>Contact Us</h1>
                <p>We'd love to hear from you. Please fill out the form below or reach out to us using the contact details provided.</p>
            </div>
            <div className={styles.content}>
                <div className={styles.info}>
                    <h2>Get in Touch</h2>
                    <div className={styles.infoItem}>
                        <span className="material-symbols-outlined">location_on</span>
                        <p>123 Traveloka Street, Ho Chi Minh City, Vietnam</p>
                    </div>
                    <div className={styles.infoItem}>
                        <span className="material-symbols-outlined">phone</span>
                        <p>+84 123 456 789</p>
                    </div>
                    <div className={styles.infoItem}>
                        <span className="material-symbols-outlined">mail</span>
                        <p>support@traveloka.com</p>
                    </div>
                </div>
                <form className={styles.form}>
                    <h2>Send a Message</h2>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" placeholder="Your Name" required />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" placeholder="Your Email" required />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="subject">Subject</label>
                        <input type="text" id="subject" placeholder="Subject" required />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="message">Message</label>
                        <textarea id="message" rows={5} placeholder="Your Message" required></textarea>
                    </div>
                    <button type="submit" className={styles.submitBtn}>Send Message</button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
