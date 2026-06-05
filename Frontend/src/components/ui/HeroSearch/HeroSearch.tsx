import React, { useState } from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import styles from './HeroSearch.module.css';
import { filterDestinations } from '../../../utils/destinations';

const { RangePicker } = DatePicker;

interface HeroSearchProps {
    onSearch?: (searchData: Record<string, string>) => void;
    isCompact?: boolean;
    initialTab?: 'hotels' | 'flights' | 'package' | 'experience';
    hideTabs?: boolean;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({ onSearch, isCompact = false, initialTab = 'hotels', hideTabs = false }) => {
    const shouldHideTabs = hideTabs || isCompact;
    const [activeTab, setActiveTab] = useState<'hotels' | 'flights' | 'package' | 'experience'>(initialTab);
    const [showSuggestions, setShowSuggestions] = useState<'destination' | 'origin' | null>(null);

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

    React.useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const origin = urlParams.get('origin') || urlParams.get('from') || '';
        const destination = urlParams.get('destination') || urlParams.get('to') || '';
        const checkIn = urlParams.get('checkIn') || '';
        const checkOut = urlParams.get('checkOut') || '';
        const departureDate = urlParams.get('departureDate') || urlParams.get('date') || '';
        const returnDate = urlParams.get('returnDate') || '';
        const passengers = urlParams.get('passengers') || '';
        const guests = urlParams.get('guests') || '';

        setSearchParams(prev => ({
            ...prev,
            origin: origin || prev.origin,
            destination: destination || prev.destination,
            checkIn: checkIn || prev.checkIn,
            checkOut: checkOut || prev.checkOut,
            departureDate: departureDate || prev.departureDate,
            returnDate: returnDate || prev.returnDate,
            passengers: passengers || prev.passengers,
            guests: guests || prev.guests,
        }));
    }, []);

    const handleFocus = (field: 'destination' | 'origin') => {
        setShowSuggestions(field);
    };

    const handleBlur = () => {
        setTimeout(() => {
            setShowSuggestions(null);
        }, 250);
    };

    const selectSuggestion = (field: 'destination' | 'origin', value: string) => {
        setSearchParams(prev => ({
            ...prev,
            [field]: value
        }));
        setShowSuggestions(null);
    };

    const handleSearch = () => {
        if (onSearch) {
            onSearch({ ...searchParams, type: activeTab });
        }
    };

    const renderSuggestionsDropdown = (field: 'destination' | 'origin') => {
        const query = searchParams[field] || '';
        const filtered = filterDestinations(query);
        const title = field === 'destination' ? 'POPULAR DESTINATIONS' : 'POPULAR ORIGINS';
        const icon = field === 'destination' ? 'location_on' : 'flight_takeoff';
        
        return (
            <div 
                className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[999] overflow-hidden text-left"
                style={{ maxHeight: '240px', overflowY: 'auto' }}
            >
                <div className="px-3 py-2 text-xs font-bold text-gray-400 border-b border-gray-100 bg-gray-50 tracking-wider">{title}</div>
                {filtered.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-500 text-center font-semibold">No destinations found</div>
                ) : (
                    filtered.map((dest) => (
                        <button
                            key={dest.detail}
                            type="button"
                            className="w-full px-4 py-2 hover:bg-blue-50 text-sm text-gray-700 font-semibold flex items-center gap-3 transition-colors text-left border-none outline-none"
                            onClick={() => selectSuggestion(field, dest.detail)}
                        >
                            <span className="material-symbols-outlined text-gray-400 text-[18px]">{icon}</span>
                            <div>
                                <div className="text-gray-900 font-bold text-xs">{dest.city}</div>
                                <div className="text-[10px] text-gray-500 font-medium mt-0.5">{dest.detail}</div>
                            </div>
                        </button>
                    ))
                )}
            </div>
        );
    };

    const searchCardContent = (
        <div className={styles.searchCard} style={isCompact ? { boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', border: '1px solid #f3f4f6', maxWidth: '100%', borderRadius: '16px' } : undefined}>
            {/* Tab Buttons */}
            {!shouldHideTabs && (
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
            )}

            {/* Search Form */}
            <div className={`${styles.searchForm} ${styles[activeTab]}`}>
                {activeTab === 'hotels' && (
                    <>
                        <div className={styles.inputGroup} style={{ position: 'relative' }}>
                            <label>City, Destination, or Hotel</label>
                            <div className={styles.inputWithIcon}>
                                <span className="material-symbols-outlined">location_on</span>
                                <input
                                    type="text"
                                    placeholder="Where do you want to stay?"
                                    value={searchParams.destination}
                                    onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
                                    onFocus={() => handleFocus('destination')}
                                    onBlur={handleBlur}
                                />
                            </div>
                            {showSuggestions === 'destination' && renderSuggestionsDropdown('destination')}
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
                                    <select
                                        value={searchParams.guests}
                                        onChange={(e) => setSearchParams({ ...searchParams, guests: e.target.value })}
                                        className="cursor-pointer"
                                    >
                                        <option value="1 Adult, 1 Room">1 Adult, 1 Room</option>
                                        <option value="2 Adults, 1 Room">2 Adults, 1 Room</option>
                                        <option value="3 Adults, 1 Room">3 Adults, 1 Room</option>
                                        <option value="4 Adults, 2 Rooms">4 Adults, 2 Rooms</option>
                                        <option value="5 Adults, 2 Rooms">5 Adults, 2 Rooms</option>
                                        <option value="6 Adults, 3 Rooms">6 Adults, 3 Rooms</option>
                                    </select>
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
                        <div className={styles.inputGroup} style={{ position: 'relative' }}>
                            <label>Origin</label>
                            <div className={styles.inputWithIcon}>
                                <span className="material-symbols-outlined">flight_takeoff</span>
                                <input
                                    type="text"
                                    placeholder="Where from?"
                                    value={searchParams.origin}
                                    onChange={(e) => setSearchParams({ ...searchParams, origin: e.target.value })}
                                    onFocus={() => handleFocus('origin')}
                                    onBlur={handleBlur}
                                />
                            </div>
                            {showSuggestions === 'origin' && renderSuggestionsDropdown('origin')}
                        </div>

                        <div className={styles.inputGroup} style={{ position: 'relative' }}>
                            <label>Destination</label>
                            <div className={styles.inputWithIcon}>
                                <span className="material-symbols-outlined">flight_land</span>
                                <input
                                    type="text"
                                    placeholder="Where to?"
                                    value={searchParams.destination}
                                    onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
                                    onFocus={() => handleFocus('destination')}
                                    onBlur={handleBlur}
                                />
                            </div>
                            {showSuggestions === 'destination' && renderSuggestionsDropdown('destination')}
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
                                    <select
                                        value={searchParams.passengers}
                                        onChange={(e) => setSearchParams({ ...searchParams, passengers: e.target.value })}
                                        className="cursor-pointer"
                                    >
                                        <option value="1 Adult, Economy">1 Passenger, Economy</option>
                                        <option value="2 Passengers, Economy">2 Passengers, Economy</option>
                                        <option value="3 Passengers, Economy">3 Passengers, Economy</option>
                                        <option value="4 Passengers, Economy">4 Passengers, Economy</option>
                                        <option value="5 Passengers, Economy">5 Passengers, Economy</option>
                                    </select>
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
                        <div className={styles.inputGroup} style={{ position: 'relative' }}>
                            <label>Origin</label>
                            <div className={styles.inputWithIcon}>
                                <span className="material-symbols-outlined">flight_takeoff</span>
                                <input
                                    type="text"
                                    placeholder="Where from?"
                                    value={searchParams.origin}
                                    onChange={(e) => setSearchParams({ ...searchParams, origin: e.target.value })}
                                    onFocus={() => handleFocus('origin')}
                                    onBlur={handleBlur}
                                />
                            </div>
                            {showSuggestions === 'origin' && renderSuggestionsDropdown('origin')}
                        </div>

                        <div className={styles.inputGroup} style={{ position: 'relative' }}>
                            <label>Destination</label>
                            <div className={styles.inputWithIcon}>
                                <span className="material-symbols-outlined">location_on</span>
                                <input
                                    type="text"
                                    placeholder="Where to?"
                                    value={searchParams.destination}
                                    onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
                                    onFocus={() => handleFocus('destination')}
                                    onBlur={handleBlur}
                                />
                            </div>
                            {showSuggestions === 'destination' && renderSuggestionsDropdown('destination')}
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
                                    <select
                                        value={searchParams.guests}
                                        onChange={(e) => setSearchParams({ ...searchParams, guests: e.target.value })}
                                        className="cursor-pointer"
                                    >
                                        <option value="1 Adult, 1 Room">1 Adult, 1 Room</option>
                                        <option value="2 Adults, 1 Room">2 Adults, 1 Room</option>
                                        <option value="3 Adults, 1 Room">3 Adults, 1 Room</option>
                                        <option value="4 Adults, 2 Rooms">4 Adults, 2 Rooms</option>
                                        <option value="5 Adults, 2 Rooms">5 Adults, 2 Rooms</option>
                                        <option value="6 Adults, 3 Rooms">6 Adults, 3 Rooms</option>
                                    </select>
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
                        <div className={styles.inputGroup} style={{ flex: 2, position: 'relative' }}>
                            <label>Destination / Activity</label>
                            <div className={styles.inputWithIcon}>
                                <span className="material-symbols-outlined">location_on</span>
                                <input
                                    type="text"
                                    placeholder="What do you want to do?"
                                    value={searchParams.destination}
                                    onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
                                    onFocus={() => handleFocus('destination')}
                                    onBlur={handleBlur}
                                />
                            </div>
                            {showSuggestions === 'destination' && renderSuggestionsDropdown('destination')}
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
    );

    if (isCompact) {
        return searchCardContent;
    }

    return (
        <section className={styles.heroSection}>
            <div className={styles.heroBackground} />

            <div className={styles.heroContent}>
                <div className={styles.heroText}>
                    <h1>Dream. Explore. Discover.</h1>
                    <p>Your next great adventure is just a click away.</p>
                </div>

                {searchCardContent}
            </div>
        </section>
    );
};
