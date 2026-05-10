import React, { useState } from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import styles from './HeroSearch.module.css';

const { RangePicker } = DatePicker;

interface HeroSearchProps {
    onSearch?: (searchData: Record<string, string>) => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({ onSearch }) => {
    const [activeTab, setActiveTab] = useState<'hotels' | 'flights' | 'package' | 'experience'>('hotels');
    const [searchParams, setSearchParams] = useState({
        destination: '',
        checkIn: '',
        checkOut: '',
        duration: '1',
        guests: '2 Adults, 1 Room',
        origin: '',
        departureDate: '',
        returnDate: '',
        passengers: '1 Adult, Economy',
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
                    <div className={`${styles.searchForm} ${styles[activeTab]}`}>
                        {activeTab === 'hotels' && (
                            <>
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
                                    <label>Check-in - Check-out</label>
                                    <div className={styles.datePickerWrapper}>
                                        <span className="material-symbols-outlined">calendar_month</span>
                                        <RangePicker
                                            className={styles.rangePicker}
                                            format="YYYY-MM-DD"
                                            onChange={(dates, dateStrings) => {
                                                setSearchParams({
                                                    ...searchParams,
                                                    checkIn: dateStrings[0],
                                                    checkOut: dateStrings[1],
                                                });
                                            }}
                                            value={[
                                                searchParams.checkIn ? dayjs(searchParams.checkIn) : null,
                                                searchParams.checkOut ? dayjs(searchParams.checkOut) : null
                                            ]}
                                            allowClear={false}
                                            suffixIcon={null}
                                            separator={<span className="material-symbols-outlined" style={{fontSize: 16}}>arrow_forward</span>}
                                        />
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
                            </>
                        )}

                        {activeTab === 'flights' && (
                            <>
                                <div className={styles.inputGroup}>
                                    <label>Origin</label>
                                    <div className={styles.inputWithIcon}>
                                        <span className="material-symbols-outlined">flight_takeoff</span>
                                        <input
                                            type="text"
                                            placeholder="Where from?"
                                            value={searchParams.origin}
                                            onChange={(e) => setSearchParams({ ...searchParams, origin: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Destination</label>
                                    <div className={styles.inputWithIcon}>
                                        <span className="material-symbols-outlined">flight_land</span>
                                        <input
                                            type="text"
                                            placeholder="Where to?"
                                            value={searchParams.destination}
                                            onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Departure - Return Date</label>
                                    <div className={styles.datePickerWrapper}>
                                        <span className="material-symbols-outlined">calendar_month</span>
                                        <RangePicker
                                            className={styles.rangePicker}
                                            format="YYYY-MM-DD"
                                            onChange={(dates, dateStrings) => {
                                                setSearchParams({
                                                    ...searchParams,
                                                    departureDate: dateStrings[0],
                                                    returnDate: dateStrings[1],
                                                });
                                            }}
                                            value={[
                                                searchParams.departureDate ? dayjs(searchParams.departureDate) : null,
                                                searchParams.returnDate ? dayjs(searchParams.returnDate) : null
                                            ]}
                                            allowClear={false}
                                            suffixIcon={null}
                                            separator={<span className="material-symbols-outlined" style={{fontSize: 16}}>arrow_forward</span>}
                                        />
                                    </div>
                                </div>

                                <div className={styles.inputGroupWithButton}>
                                    <div className={styles.inputGroup}>
                                        <label>Passengers</label>
                                        <div className={styles.inputWithIcon}>
                                            <span className="material-symbols-outlined">airline_seat_recline_normal</span>
                                            <input
                                                type="text"
                                                value={searchParams.passengers}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <button className={styles.searchButton} onClick={handleSearch}>
                                        <span className="material-symbols-outlined">search</span>
                                    </button>
                                </div>
                            </>
                        )}

                        {activeTab === 'package' && (
                            <>
                                <div className={styles.inputGroup}>
                                    <label>Origin</label>
                                    <div className={styles.inputWithIcon}>
                                        <span className="material-symbols-outlined">flight_takeoff</span>
                                        <input
                                            type="text"
                                            placeholder="Where from?"
                                            value={searchParams.origin}
                                            onChange={(e) => setSearchParams({ ...searchParams, origin: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Destination</label>
                                    <div className={styles.inputWithIcon}>
                                        <span className="material-symbols-outlined">location_on</span>
                                        <input
                                            type="text"
                                            placeholder="Where to?"
                                            value={searchParams.destination}
                                            onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Departure - Return Date</label>
                                    <div className={styles.datePickerWrapper}>
                                        <span className="material-symbols-outlined">calendar_month</span>
                                        <RangePicker
                                            className={styles.rangePicker}
                                            format="YYYY-MM-DD"
                                            onChange={(dates, dateStrings) => {
                                                setSearchParams({
                                                    ...searchParams,
                                                    departureDate: dateStrings[0],
                                                    returnDate: dateStrings[1],
                                                });
                                            }}
                                            value={[
                                                searchParams.departureDate ? dayjs(searchParams.departureDate) : null,
                                                searchParams.returnDate ? dayjs(searchParams.returnDate) : null
                                            ]}
                                            allowClear={false}
                                            suffixIcon={null}
                                            separator={<span className="material-symbols-outlined" style={{fontSize: 16}}>arrow_forward</span>}
                                        />
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
                            </>
                        )}

                        {activeTab === 'experience' && (
                            <>
                                <div className={styles.inputGroup} style={{ flex: 2 }}>
                                    <label>Destination / Activity</label>
                                    <div className={styles.inputWithIcon}>
                                        <span className="material-symbols-outlined">location_on</span>
                                        <input
                                            type="text"
                                            placeholder="What do you want to do?"
                                            value={searchParams.destination}
                                            onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className={styles.inputGroupWithButton} style={{ flex: 1 }}>
                                    <div className={styles.inputGroup}>
                                        <label>Date</label>
                                        <div className={styles.datePickerWrapper}>
                                            <span className="material-symbols-outlined">calendar_month</span>
                                            <DatePicker
                                                className={styles.singleDatePicker}
                                                format="YYYY-MM-DD"
                                                onChange={(date, dateString) => {
                                                    setSearchParams({
                                                        ...searchParams,
                                                        checkIn: typeof dateString === 'string' ? dateString : dateString[0],
                                                    });
                                                }}
                                                value={searchParams.checkIn ? dayjs(searchParams.checkIn) : null}
                                                allowClear={false}
                                                suffixIcon={null}
                                            />
                                        </div>
                                    </div>
                                    <button className={styles.searchButton} onClick={handleSearch}>
                                        <span className="material-symbols-outlined">search</span>
                                    </button>
                                </div>
                            </>
                        )}
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
