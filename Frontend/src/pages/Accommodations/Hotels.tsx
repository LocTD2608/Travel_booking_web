import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Slider } from 'antd';
import { HotelCard, type HotelCardProps } from '../../components/ui/cards/accommodations/HotelCard';
import { useLanguage } from '../../context';
import { fetchHotels } from '../../services/searchApi';
import { HeroSearch } from '../../components/ui/HeroSearch/HeroSearch';

const normalizeSearchText = (text: string) =>
    text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '');

const Hotels: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { isAuthenticated } = useAuth();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { t, translateGuests } = useLanguage();

    const handleSearchClick = (searchData: Record<string, string>) => {
        const params = new URLSearchParams();
        Object.entries(searchData).forEach(([key, value]) => {
            if (value && key !== 'type') {
                params.append(key, value);
            }
        });

        const typeToPath: Record<string, string> = {
            hotels: '/hotels',
            flights: '/flights',
            package: '/search',
            experience: '/experience',
        };

        const path = typeToPath[searchData.type] || '/search';
        navigate(`${path}?${params.toString()}`);
        setIsSearchOpen(false);
    };
    
    // Top Search State
    const searchState = {
        destination: searchParams.get('destination') || 'Da Nang, Vietnam',
        dates: searchParams.get('checkIn') ? `${searchParams.get('checkIn')} - ${searchParams.get('checkOut') || 'Unknown'}` : 'Oct 12 - Oct 15, 2024',
        guests: searchParams.get('guests') || '2 Adults, 1 Room'
    };

    const [hotels, setHotels] = useState<HotelCardProps[]>([]);
    const [loading, setLoading] = useState(true);

    // Map dynamic high-quality resort & hotel images based on hotel name
    const getHotelImage = (name: string, location: string) => {
        const text = (name + ' ' + location).toLowerCase();
        if (text.includes('beach') || text.includes('sea') || text.includes('marina') || text.includes('ocean') || text.includes('cát bà') || text.includes('sông hàn')) {
            return 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80';
        }
        if (text.includes('intercontinental') || text.includes('marriott') || text.includes('palace') || text.includes('grand') || text.includes('sheraton')) {
            return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';
        }
        if (text.includes('villa') || text.includes('resort') || text.includes('spa') || text.includes('retreat')) {
            return 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80';
        }
        if (text.includes('đà nẵng') || text.includes('da nang')) {
            return 'https://images.unsplash.com/photo-1597047084897-51e81819a499?auto=format&fit=crop&w=800&q=80';
        }
        if (text.includes('hà nội') || text.includes('hanoi')) {
            return 'https://images.unsplash.com/photo-1555921015-5532091f6026?auto=format&fit=crop&w=800&q=80';
        }
        return 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80';
    };

    useEffect(() => {
        const loadHotels = async () => {
            try {
                setLoading(true);
                const city = searchState.destination.split(',')[0].trim();
                const res = await fetchHotels({ city });
                if (res.success) {
                    const mapped = res.data.map(h => ({
                        id: h.MaKS.toString(),
                        name: h.name,
                        location: h.address,
                        rating: 8.5,
                        ratingText: 'Tuyệt vời',
                        reviews: Math.floor(Math.random() * 800) + 120,
                        price: Number(h.min_price || 0),
                        originalPrice: h.min_price ? Math.round(Number(h.min_price) * 1.2 / 50000) * 50000 : null,
                        badge: h.stars >= 5 ? 'Lựa chọn hàng đầu' : 'Phổ biến',
                        image: getHotelImage(h.name, h.address),
                        facilities: ['Free WiFi', 'Pool', 'Restaurant', 'Gym'],
                        stars: h.stars,
                    }));
                    setHotels(mapped);
                }
            } catch (err) {
                console.error("Failed to fetch hotels:", err);
            } finally {
                setLoading(false);
            }
        };
        loadHotels();
    }, [searchState.destination]);

    const [priceRange, setPriceRange] = useState<[number, number]>([500000, 5000000]);
    const [sortBy, setSortBy] = useState('popularity');
    const [selectedStars, setSelectedStars] = useState<number[]>([]);
    const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);

    const handleStarToggle = (star: number) => {
        setSelectedStars(prev => prev.includes(star) ? prev.filter(s => s !== star) : [...prev, star]);
    };

    const handleFacilityToggle = (facility: string) => {
        setSelectedFacilities(prev => prev.includes(facility) ? prev.filter(f => f !== facility) : [...prev, facility]);
    };

    // Filtering & Sorting Logic
    const filteredHotels = hotels.filter((hotel) => {
        const matchesPrice = hotel.price >= priceRange[0] && hotel.price <= priceRange[1];
        const matchesStars = selectedStars.length === 0 || selectedStars.includes(hotel.stars);
        const matchesFacilities = selectedFacilities.length === 0 || selectedFacilities.every(fac =>
            hotel.facilities.some(hFac => hFac.toLowerCase().includes(fac.toLowerCase()))
        );
        const destinationCity = searchState.destination.split(',')[0].trim();
        const normalizedDestinationCity = normalizeSearchText(destinationCity);
        const normalizedHotelLocation = normalizeSearchText(hotel.location);
        const normalizedHotelName = normalizeSearchText(hotel.name);
        const matchesDestination = normalizedHotelLocation.includes(normalizedDestinationCity) || normalizedHotelName.includes(normalizedDestinationCity);
        
        return matchesPrice && matchesStars && matchesFacilities && matchesDestination;
    }).sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'rating_desc') {
            if (b.stars !== a.stars) return b.stars - a.stars;
            return b.reviews - a.reviews;
        }
        // Popularity: default mock order or by reviews
        return b.reviews - a.reviews;
    });

    return (
        <div className="bg-[#f5f7fa] min-h-screen pb-10 font-display">
            {/* Top Search Info Bar */}
            <div className="bg-white border-b border-gray-200 py-4 mb-6 sticky z-30 flex justify-center shadow-sm" style={{ top: '64px' }}>
                <div className="w-full max-w-[1200px] px-4 flex items-center justify-between">
                    <div className="flex gap-10">
                        <div>
                            <div className="text-xs text-gray-500 font-bold mb-0.5 tracking-wider">{t('search.destination', 'DESTINATION').toUpperCase()}</div>
                            <div className="text-[15px] font-bold text-gray-900">{searchState.destination}</div>
                        </div>
                        <div className="w-px h-10 bg-gray-200"></div>
                        <div>
                            <div className="text-xs text-gray-500 font-bold mb-0.5 tracking-wider">{t('search.dates', 'DATES').toUpperCase()}</div>
                            <div className="text-[15px] font-bold text-gray-900">{searchState.dates}</div>
                        </div>
                        <div className="w-px h-10 bg-gray-200"></div>
                        <div>
                            <div className="text-xs text-gray-500 font-bold mb-0.5 tracking-wider">{t('search.guests', 'GUESTS').toUpperCase()}</div>
                            <div className="text-[15px] font-bold text-gray-900">{translateGuests(searchState.guests)}</div>
                        </div>
                    </div>
                    <button 
                        className="flex items-center gap-2 border border-blue-200 text-travel-blue font-bold px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                    >
                        <span className="material-symbols-outlined text-[18px]">{isSearchOpen ? 'close' : 'edit'}</span>
                        {isSearchOpen ? t('booking.close', 'Close') : t('booking.changeSearch', 'Change Search')}
                    </button>
                </div>
            </div>

            {isSearchOpen && (
                <div className="w-full bg-white border-b border-gray-200 py-6 flex justify-center animate-fade-in shadow-inner relative z-30 mb-6">
                    <div className="w-full max-w-[1200px] px-4">
                        <HeroSearch isCompact={true} initialTab="hotels" onSearch={handleSearchClick} />
                    </div>
                </div>
            )}

            {/* Main Content Grid */}
            <div className="max-w-[1200px] mx-auto px-4 flex gap-6">

                {/* Left Column (Filters) */}
                <div className="w-[280px] flex-shrink-0">
                    <div className="bg-white border text-gray-800 border-gray-200 rounded-xl p-5 mb-4 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg">{t('search.filters', 'Filters')}</h3>
                            <button className="text-travel-blue font-semibold text-sm hover:underline" onClick={() => { setPriceRange([500000, 5000000]); setSortBy('popularity'); setSelectedStars([]); setSelectedFacilities([]); }}>{t('search.reset', 'Reset')}</button>
                        </div>

                        {/* Popular Cities */}
                        <div className="mb-6">
                            <h4 className="font-semibold text-[15px] mb-3">{t('search.popularCities', 'Popular Cities')}</h4>
                            {['Da Nang, Vietnam', 'Hanoi, Vietnam', 'Phu Quoc, Vietnam', 'Ho Chi Minh, Vietnam'].map(city => {
                                const cityDisplayName = city.includes('Da Nang') ? t('city.danang', 'Da Nang, Vietnam')
                                    : city.includes('Hanoi') ? t('city.hanoi', 'Hanoi, Vietnam')
                                    : city.includes('Phu Quoc') ? t('city.phuquoc', 'Phu Quoc, Vietnam')
                                    : city.includes('Ho Chi Minh') ? t('city.saigon', 'Ho Chi Minh, Vietnam')
                                    : city;
                                return (
                                    <button
                                        key={city}
                                        onClick={() => navigate(`/hotels?destination=${encodeURIComponent(city)}`)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold mb-1.5 transition-all flex items-center justify-between ${
                                            searchState.destination.toLowerCase().includes(city.split(',')[0].toLowerCase())
                                                ? 'bg-blue-50 text-travel-blue border border-blue-100'
                                                : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                                        }`}
                                    >
                                        <span>{cityDisplayName}</span>
                                        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Price Filter */}
                        <div className="mb-6">
                            <h4 className="font-semibold text-[15px] mb-4">{t('search.pricePerNight', 'Price per night')}</h4>
                            <Slider
                                range
                                min={0}
                                max={10000000}
                                step={100000}
                                value={priceRange}
                                onChange={(val: number[]) => setPriceRange(val as [number, number])}
                                tooltip={{ formatter: (val) => `${val?.toLocaleString('vi-VN')} VNĐ` }}
                                trackStyle={[{ backgroundColor: '#005CE6', height: 4 }]}
                                handleStyle={[{ borderColor: '#005CE6', width: 16, height: 16, marginTop: -6 }, { borderColor: '#005CE6', width: 16, height: 16, marginTop: -6 }]}
                            />
                            <div className="flex justify-between text-xs font-semibold text-gray-400 mt-2">
                                <span>{priceRange[0].toLocaleString('vi-VN')} VNĐ</span>
                                <span>{priceRange[1].toLocaleString('vi-VN')} VNĐ</span>
                            </div>
                        </div>

                        {/* Star Rating */}
                        <div className="mb-6">
                            <h4 className="font-semibold text-[15px] mb-3">{t('search.starRating', 'Star Rating')}</h4>
                            {[5, 4, 3, 2, 1].map(star => (
                                <label key={star} className="flex items-center gap-3 mb-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-gray-300 text-travel-blue focus:ring-travel-blue cursor-pointer"
                                        checked={selectedStars.includes(star)}
                                        onChange={() => handleStarToggle(star)}
                                    />
                                    <span className="flex text-yellow-500">
                                        {Array.from({ length: star }).map((_, i) => <span key={i} className="material-symbols-outlined text-[20px] leading-none">star</span>)}
                                        {Array.from({ length: 5 - star }).map((_, i) => <span key={i} className="material-symbols-outlined text-[20px] text-gray-200 leading-none">star</span>)}
                                    </span>
                                </label>
                            ))}
                        </div>

                        {/* Amenities */}
                        <div className="mb-2">
                            <h4 className="font-semibold text-[15px] mb-3">{t('search.facilities', 'Facilities')}</h4>
                            {[
                                { name: 'Pool', displayName: t('amenity.pool', 'Hồ bơi'), icon: 'pool' },
                                { name: 'WiFi', displayName: t('amenity.wifi', 'WiFi'), icon: 'wifi' },
                                { name: 'Restaurant', displayName: t('amenity.restaurant', 'Nhà hàng'), icon: 'restaurant' },
                                { name: 'Gym', displayName: t('amenity.gym', 'Phòng gym'), icon: 'fitness_center' }
                            ].map(amenity => (
                                <label key={amenity.name} className="flex items-center gap-3 mb-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-gray-300 text-travel-blue focus:ring-travel-blue cursor-pointer"
                                        checked={selectedFacilities.includes(amenity.name)}
                                        onChange={() => handleFacilityToggle(amenity.name)}
                                    />
                                    <span className="material-symbols-outlined text-[20px] text-gray-400 group-hover:text-gray-600 transition-colors">{amenity.icon}</span>
                                    <span className="text-sm font-medium text-gray-600">{amenity.displayName}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Promotion Box — only show when not authenticated */}
                    {!isAuthenticated && (
                        <div className="bg-[#0064D2] text-white rounded-xl p-5 shadow-sm relative overflow-hidden">
                            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] text-black/10 rotate-12">local_offer</span>
                            <h4 className="font-bold text-lg mb-2 relative z-10">{t('hotel.unlockPrivateDeals', 'Unlock Private Deals')}</h4>
                            <p className="text-sm text-blue-100 mb-4 relative z-10">{t('hotel.signInDesc', 'Sign in to see prices up to 30% lower on selected hotels.')}</p>
                            <button className="bg-white text-[#0064D2] px-4 py-2 rounded-lg font-bold text-sm w-full relative z-10 hover:bg-gray-100 hover-scale transition-all">
                                {t('hotel.signInNow', 'Sign In Now')}
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Column (Results) */}
                <div className="flex-1 flex flex-col gap-4">

                    {/* Sort Bar */}
                    <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-gray-600 text-sm">{t('search.sortBy', 'Sắp xếp theo:')}</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-white border border-gray-200 rounded-lg pl-3 pr-10 py-2 text-[15px] font-bold text-gray-900 outline-none cursor-pointer focus:border-travel-blue shadow-sm min-w-[200px]"
                        >
                            <option value="popularity">{t('search.sort.popularity', 'Phù hợp nhất')}</option>
                            <option value="price_asc">{t('search.sort.priceAsc', 'Giá: Thấp đến Cao')}</option>
                            <option value="price_desc">{t('search.sort.priceDesc', 'Giá: Cao đến Thấp')}</option>
                            <option value="rating_desc">{t('search.sort.ratingDesc', 'Đánh giá cao nhất')}</option>
                        </select>
                    </div>

                    {/* Check if no results */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center p-10 bg-white border border-gray-200 rounded-xl text-gray-400 mt-4 h-64 shadow-sm">
                            <div className="w-8 h-8 border-4 border-travel-blue border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="font-bold text-gray-500">{t('search.searchingHotels', 'Searching hotels...')}</p>
                        </div>
                    ) : filteredHotels.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-10 bg-white border border-gray-200 border-dashed rounded-xl text-gray-400 mt-4 h-64">
                            <span className="material-symbols-outlined text-5xl mb-3 text-gray-300">travel_explore</span>
                            <p className="font-bold text-gray-500">{t('search.noResults', 'No results to display')}</p>
                            <p className="text-sm">{t('search.adjustFilters', 'Try adjusting your filters.')}</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {filteredHotels.map((hotel) => (
                                <HotelCard key={hotel.id} hotel={hotel} onClick={() => navigate(`/hotels/${hotel.id}`)} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Hotels;
