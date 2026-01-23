import React, { useState } from 'react';
import styles from './HeroSearch.module.css';

interface HeroSearchProps {
    onSearch?: (searchData: any) => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({ onSearch }) => {
    const [activeTab, setActiveTab] = useState<'hotels' | 'flights' | 'package' | 'experience'>('hotels');
    const [searchParams, setSearchParams] = useState({
        destination: '',
        checkIn: '',
        duration: '1',
        guests: '2 Adults, 1 Room'
    });

    const handleSearch = () => {
        if (onSearch) {
            onSearch({ ...searchParams, type: activeTab });
        }
    };

    return (
        <section className={styles.heroSection}>
            <div className={styles.heroBackground} />

            <div className={styles.heroContent}>
                <div className={styles.heroText}>
                    <h1>Dream. Explore. Discover.</h1>
                    <p>Your next great adventure is just a click away.</p>
                </div>

                <div className={styles.searchCard}>
                    {/* Tab Buttons */}
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tab} ${activeTab === 'hotels' ? styles.active : ''}`}
                            onClick={() => setActiveTab('hotels')}
                        >
                            <span className="material-symbols-outlined">hotel</span>
                            Hotels
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'flights' ? styles.active : ''}`}
                            onClick={() => setActiveTab('flights')}
                        >
                            <span className="material-symbols-outlined">flight</span>
                            Flights
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'package' ? styles.active : ''}`}
                            onClick={() => setActiveTab('package')}
                        >
                            <span className="material-symbols-outlined">luggage</span>
                            Flight + Hotel
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'experience' ? styles.active : ''}`}
                            onClick={() => setActiveTab('experience')}
                        >
                            <span className="material-symbols-outlined">attractions</span>
                            Xperience
                        </button>
                    </div>

                    {/* Search Form */}
                    <div className={styles.searchForm}>
                        <div className={styles.inputGroup}>
                            <label>City, Destination, or Hotel</label>
                            <div className={styles.inputWithIcon}>
                                <span className="material-symbols-outlined">location_on</span>
                                <input
                                    type="text"
                                    placeholder="Where do you want to stay?"
                                    value={searchParams.destination}
                                    onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Check-in</label>
                            <div className={styles.inputWithIcon}>
                                <span className="material-symbols-outlined">calendar_month</span>
                                <input
                                    type="date"
                                    value={searchParams.checkIn}
                                    onChange={(e) => setSearchParams({ ...searchParams, checkIn: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Duration</label>
                            <div className={styles.inputWithIcon}>
                                <span className="material-symbols-outlined">nights_stay</span>
                                <select
                                    value={searchParams.duration}
                                    onChange={(e) => setSearchParams({ ...searchParams, duration: e.target.value })}
                                >
                                    <option value="1">1 Night</option>
                                    <option value="2">2 Nights</option>
                                    <option value="3">3 Nights</option>
                                    <option value="7">1 Week</option>
                                </select>
                            </div>
                        </div>

                        <div className={styles.inputGroupWithButton}>
                            <div className={styles.inputGroup}>
                                <label>Guests</label>
                                <div className={styles.inputWithIcon}>
                                    <span className="material-symbols-outlined">group</span>
                                    <input
                                        type="text"
                                        value={searchParams.guests}
                                        readOnly
                                    />
                                </div>
                            </div>
                            <button className={styles.searchButton} onClick={handleSearch}>
                                <span className="material-symbols-outlined">search</span>
                            </button>
                        </div>
                    </div>

                    {/* Features */}
                    <div className={styles.features}>
                        <span>
                            <span className="material-symbols-outlined">check_circle</span>
                            Pay at Hotel Available
                        </span>
                        <span>
                            <span className="material-symbols-outlined">check_circle</span>
                            Free Cancellation
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};
