import React, { useState } from 'react';
import { Slider, DatePicker } from 'antd';
const { RangePicker } = DatePicker;

// Mock Data for Hotels
const MOCK_HOTELS = [
    {
        id: 'h1',
        name: 'InterContinental Danang Resort',
        location: 'Son Tra Peninsula, Da Nang',
        rating: 9.4,
        ratingText: 'Exceptional',
        reviews: 1248,
        price: 3850000,
        originalPrice: 4200000,
        badge: 'LIMITED DEAL',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        facilities: ['Pool', 'Beach', 'Spa'],
        stars: 5,
    },
    {
        id: 'h2',
        name: 'Novotel Danang Premier Han River',
        location: 'Hai Chau District, Da Nang',
        rating: 8.8,
        ratingText: 'Excellent',
        reviews: 3520,
        price: 2450000,
        originalPrice: null,
        badge: '',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        facilities: ['Gym', 'Bar', 'Free WiFi'],
        stars: 4,
    },
    {
        id: 'h3',
        name: 'Sheraton Grand Danang Resort',
        location: 'Non Nuoc Beach, Da Nang',
        rating: 8.9,
        ratingText: 'Excellent',
        reviews: 890,
        price: 3200000,
        originalPrice: null,
        badge: '',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        facilities: ['Pool', 'Free WiFi', 'Restaurant'],
        stars: 5,
    }
];

const HotelCard: React.FC<{ hotel: typeof MOCK_HOTELS[0] }> = ({ hotel }) => (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex shadow-sm hover:shadow-md transition-shadow">
        {/* Left Image */}
        <div className="relative w-1/3 min-w-[280px] h-60">
            <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
            {hotel.badge && (
                <div className="absolute top-3 left-3 bg-white text-xs font-bold px-2 py-1 rounded shadow-sm text-travel-blue">
                    {hotel.badge}
                </div>
            )}
        </div>

        {/* Right Content */}
        <div className="flex-1 p-5 flex flex-col justify-between">
            <div>
                <div className="flex gap-1 mb-1">
                    {Array.from({ length: hotel.stars }).map((_, i) => (
                        <span key={i} className="material-symbols-outlined text-yellow-500 text-[18px]">star</span>
                    ))}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{hotel.name}</h3>
                <div className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    {hotel.location}
                </div>

                <div className="flex items-center gap-2">
                    <span className="bg-[#EBF3FF] text-travel-blue font-bold px-2 py-0.5 rounded text-sm">
                        {hotel.rating.toFixed(1)}
                    </span>
                    <span className="text-travel-blue font-semibold text-sm">{hotel.ratingText}</span>
                    <span className="text-gray-400 text-sm">({hotel.reviews.toLocaleString()} reviews)</span>
                </div>
            </div>

            <div className="flex justify-between items-end mt-4">
                {/* Facilities */}
                <div className="flex gap-4">
                    {hotel.facilities.map(fac => {
                        let icon = 'check';
                        if (fac.toLowerCase().includes('pool')) icon = 'pool';
                        if (fac.toLowerCase().includes('wifi')) icon = 'wifi';
                        if (fac.toLowerCase().includes('gym')) icon = 'fitness_center';
                        if (fac.toLowerCase().includes('bar')) icon = 'local_bar';
                        if (fac.toLowerCase().includes('beach')) icon = 'beach_access';
                        if (fac.toLowerCase().includes('spa')) icon = 'spa';
                        if (fac.toLowerCase().includes('restaurant')) icon = 'restaurant';

                        return (
                            <div key={fac} className="flex items-center gap-1 text-xs text-gray-500">
                                <span className="material-symbols-outlined text-[16px] text-gray-400">{icon}</span>
                                {fac}
                            </div>
                        )
                    })}
                </div>

                {/* Price & Action */}
                <div className="text-right">
                    {hotel.originalPrice && (
                        <div className="text-xs text-gray-400 line-through mb-0.5 mt-2">
                            {hotel.originalPrice.toLocaleString()} VNĐ
                        </div>
                    )}
                    <div className="text-2xl font-black text-gray-900 mb-0">
                        {hotel.price.toLocaleString()} <span className="text-sm font-semibold text-gray-500">VNĐ</span>
                    </div>
                    <div className="text-xs text-gray-400 mb-3">incl. taxes & fees</div>
                    <button className="bg-travel-blue text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors hover-scale">
                        Select Room
                    </button>
                </div>
            </div>
        </div>
    </div>
);

const Hotels: React.FC = () => {
    // Top Search State
    const [searchState, setSearchState] = useState({
        destination: 'Da Nang, Vietnam',
        dates: '',
        guests: '2 Adults, 1 Room'
    });

    const [priceRange, setPriceRange] = useState<[number, number]>([500000, 5000000]);
    const [sortBy, setSortBy] = useState('popularity');

    // Filtering & Sorting Logic
    const filteredHotels = MOCK_HOTELS.filter((hotel) => {
        return hotel.price >= priceRange[0] && hotel.price <= priceRange[1];
    }).sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'rating_desc') return b.rating - a.rating;
        // Popularity: default mock order or by reviews
        return b.reviews - a.reviews;
    });

    return (
        <div className="bg-[#f5f7fa] min-h-screen pb-10 font-['Plus_Jakarta_Sans']">
            {/* Top Search Info Bar */}
            <div className="bg-white border-b border-gray-200 py-4 mb-6 sticky z-30 flex justify-center shadow-sm" style={{ top: '64px' }}>
                <div className="w-full max-w-[1200px] px-4 flex items-center justify-between">
                    <div className="flex gap-10">
                        <div>
                            <div className="text-xs text-gray-500 font-bold mb-0.5 tracking-wider">DESTINATION</div>
                            <div className="text-[15px] font-bold text-gray-900">{searchState.destination}</div>
                        </div>
                        <div className="w-px h-10 bg-gray-200"></div>
                        <div>
                            <div className="text-xs text-gray-500 font-bold mb-0.5 tracking-wider">DATES</div>
                            <div className="text-[15px] font-bold text-gray-900">Oct 12 - Oct 15, 2024</div>
                        </div>
                        <div className="w-px h-10 bg-gray-200"></div>
                        <div>
                            <div className="text-xs text-gray-500 font-bold mb-0.5 tracking-wider">GUESTS</div>
                            <div className="text-[15px] font-bold text-gray-900">{searchState.guests}</div>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 border border-blue-200 text-travel-blue font-bold px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                        Change Search
                    </button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="max-w-[1200px] mx-auto px-4 flex gap-6">

                {/* Left Column (Filters) */}
                <div className="w-[280px] flex-shrink-0">
                    <div className="bg-white border text-gray-800 border-gray-200 rounded-xl p-5 mb-4 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg">Filters</h3>
                            <button className="text-travel-blue font-semibold text-sm hover:underline" onClick={() => { setPriceRange([500000, 5000000]); setSortBy('popularity'); }}>Reset</button>
                        </div>

                        {/* Price Filter */}
                        <div className="mb-6">
                            <h4 className="font-semibold text-[15px] mb-4">Price per night</h4>
                            <Slider
                                range
                                min={0}
                                max={10000000}
                                step={100000}
                                value={priceRange}
                                onChange={(val: number[]) => setPriceRange(val as [number, number])}
                                tooltip={{ formatter: (val) => `${val?.toLocaleString()} VNĐ` }}
                                trackStyle={[{ backgroundColor: '#005CE6', height: 4 }]}
                                handleStyle={[{ borderColor: '#005CE6', width: 16, height: 16, marginTop: -6 }, { borderColor: '#005CE6', width: 16, height: 16, marginTop: -6 }]}
                            />
                            <div className="flex justify-between text-xs font-semibold text-gray-400 mt-2">
                                <span>{priceRange[0].toLocaleString()}đ</span>
                                <span>{priceRange[1].toLocaleString()}đ</span>
                            </div>
                        </div>

                        {/* Star Rating */}
                        <div className="mb-6">
                            <h4 className="font-semibold text-[15px] mb-3">Star Rating</h4>
                            {[5, 4, 3, 2, 1].map(star => (
                                <label key={star} className="flex items-center gap-3 mb-2 cursor-pointer group">
                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-travel-blue focus:ring-travel-blue cursor-pointer" />
                                    <span className="flex text-yellow-500">
                                        {Array.from({ length: star }).map((_, i) => <span key={i} className="material-symbols-outlined text-[20px] leading-none">star</span>)}
                                        {Array.from({ length: 5 - star }).map((_, i) => <span key={i} className="material-symbols-outlined text-[20px] text-gray-200 leading-none">star</span>)}
                                    </span>
                                </label>
                            ))}
                        </div>

                        {/* Amenities */}
                        <div className="mb-2">
                            <h4 className="font-semibold text-[15px] mb-3">Facilities</h4>
                            {[
                                { name: 'Pool', icon: 'pool' },
                                { name: 'WiFi', icon: 'wifi' },
                                { name: 'Restaurant', icon: 'restaurant' },
                                { name: 'Gym', icon: 'fitness_center' }
                            ].map(amenity => (
                                <label key={amenity.name} className="flex items-center gap-3 mb-3 cursor-pointer group">
                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-travel-blue focus:ring-travel-blue cursor-pointer" />
                                    <span className="material-symbols-outlined text-[20px] text-gray-400 group-hover:text-gray-600 transition-colors">{amenity.icon}</span>
                                    <span className="text-sm font-medium text-gray-600">{amenity.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Promotion Box */}
                    <div className="bg-[#0064D2] text-white rounded-xl p-5 shadow-sm relative overflow-hidden">
                        <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] text-black/10 rotate-12">local_offer</span>
                        <h4 className="font-bold text-lg mb-2 relative z-10">Unlock Private Deals</h4>
                        <p className="text-sm text-blue-100 mb-4 relative z-10">Sign in to see prices up to 30% lower on selected hotels.</p>
                        <button className="bg-white text-[#0064D2] px-4 py-2 rounded-lg font-bold text-sm w-full relative z-10 hover:bg-gray-100 hover-scale transition-all">
                            Sign In Now
                        </button>
                    </div>
                </div>

                {/* Right Column (Results) */}
                <div className="flex-1 flex flex-col gap-4">

                    {/* Sort Bar */}
                    <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-gray-600 text-sm">Sắp xếp theo:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-[15px] font-bold text-gray-900 outline-none cursor-pointer focus:border-travel-blue shadow-sm min-w-[150px]"
                        >
                            <option value="popularity">Phù hợp nhất</option>
                            <option value="price_asc">Giá: Thấp đến Cao</option>
                            <option value="price_desc">Giá: Cao đến Thấp</option>
                            <option value="rating_desc">Đánh giá cao nhất</option>
                        </select>

                        <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden ml-auto shadow-sm">
                            <button className="px-3 py-2 flex items-center justify-center hover:bg-gray-50 border-r border-gray-200 text-travel-blue">
                                <span className="material-symbols-outlined text-[22px]">format_list_bulleted</span>
                            </button>
                            <button className="px-3 py-2 flex items-center justify-center hover:bg-gray-50 text-gray-400">
                                <span className="material-symbols-outlined text-[20px]">grid_view</span>
                            </button>
                            <button className="px-3 py-2 flex items-center justify-center hover:bg-gray-50 border-l border-gray-200 text-gray-400">
                                <span className="material-symbols-outlined text-[20px]">map</span>
                            </button>
                        </div>
                    </div>

                    {/* Check if no results */}
                    {filteredHotels.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-10 bg-white border border-gray-200 border-dashed rounded-xl text-gray-400 mt-4 h-64">
                            <span className="material-symbols-outlined text-5xl mb-3 text-gray-300">travel_explore</span>
                            <p className="font-bold text-gray-500">No results to display</p>
                            <p className="text-sm">Try adjusting your filters.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {filteredHotels.map((hotel) => (
                                <HotelCard key={hotel.id} hotel={hotel} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Hotels;
