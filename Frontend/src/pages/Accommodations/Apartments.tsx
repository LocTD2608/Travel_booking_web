import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Slider } from 'antd';

const MOCK_APARTMENTS = [
    {
        id: 'a1',
        name: 'Luxury City Center Studio',
        location: 'District 1, Ho Chi Minh City',
        rating: 9.1,
        ratingText: 'Superb',
        reviews: 420,
        price: 1200000,
        originalPrice: 1500000,
        badge: 'POPULAR',
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        facilities: ['Kitchen', 'Washing Machine', 'City View', 'Gym'],
        stars: 4,
    },
    {
        id: 'a2',
        name: 'Cozy Vintage Homestay',
        location: 'Hoan Kiem, Hanoi',
        rating: 8.5,
        ratingText: 'Very Good',
        reviews: 310,
        price: 850000,
        originalPrice: null,
        badge: '',
        image: 'https://images.unsplash.com/photo-1502672260266-1c1c24240f57?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        facilities: ['1 Bedroom', 'Balcony', 'Kitchen'],
        stars: 3,
    }
];

const ApartmentCard: React.FC<{ apartment: typeof MOCK_APARTMENTS[0]; onClick: () => void }> = ({ apartment, onClick }) => (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex shadow-sm hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
        <div className="relative w-1/3 min-w-[280px] h-60">
            <img src={apartment.image} alt={apartment.name} className="w-full h-full object-cover" />
            {apartment.badge && (
                <div className="absolute top-3 left-3 bg-white text-xs font-bold px-2 py-1 rounded shadow-sm text-purple-600">
                    {apartment.badge}
                </div>
            )}
        </div>
        <div className="flex-1 p-5 flex flex-col justify-between">
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{apartment.name}</h3>
                <div className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    {apartment.location}
                </div>
                <div className="flex items-center gap-2">
                    <span className="bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded text-sm">
                        {apartment.rating.toFixed(1)}
                    </span>
                    <span className="text-purple-700 font-semibold text-sm">{apartment.ratingText}</span>
                    <span className="text-gray-400 text-sm">({apartment.reviews} reviews)</span>
                </div>
            </div>
            <div className="flex justify-between items-end mt-4">
                <div className="flex flex-wrap gap-2">
                    {apartment.facilities.map(fac => (
                        <div key={fac} className="text-xs text-gray-500 bg-gray-50 border border-gray-200 px-2 py-1 rounded-full">
                            {fac}
                        </div>
                    ))}
                </div>
                <div className="text-right">
                    {apartment.originalPrice && (
                        <div className="text-xs text-gray-400 line-through mb-0.5 mt-2">
                            {apartment.originalPrice.toLocaleString()} VNĐ
                        </div>
                    )}
                    <div className="text-2xl font-black text-gray-900 mb-0">
                        {apartment.price.toLocaleString()} <span className="text-sm font-semibold text-gray-500">VNĐ</span>
                    </div>
                    <div className="text-xs text-gray-400 mb-3">/ night</div>
                    <button
                        className="bg-travel-blue text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors hover-scale"
                        onClick={(e) => { e.stopPropagation(); onClick(); }}
                    >
                        Select Room
                    </button>
                </div>
            </div>
        </div>
    </div>
);

const Apartments: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [priceRange, setPriceRange] = useState<[number, number]>([300000, 5000000]);
    const [sortBy, setSortBy] = useState('popularity');
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

    const toggleType = (type: string) => {
        setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
    };

    const filteredApartments = MOCK_APARTMENTS.filter(a => {
        const matchesPrice = a.price >= priceRange[0] && a.price <= priceRange[1];
        const matchesTypes = selectedTypes.length === 0 || selectedTypes.some(type => {
            const tl = type.toLowerCase();
            const keyword = tl.includes('studio') ? 'studio' : tl.includes('1 bedroom') ? '1 bedroom' : tl.includes('house') ? 'house' : tl;
            return a.name.toLowerCase().includes(keyword) || a.facilities.some(f => f.toLowerCase().includes(keyword));
        });
        return matchesPrice && matchesTypes;
    }).sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        return b.reviews - a.reviews;
    });

    return (
        <div className="bg-[#f5f7fa] min-h-screen pb-10 font-['Plus_Jakarta_Sans']">
            <div className="bg-white border-b border-gray-200 py-4 mb-6 sticky z-30 flex justify-center shadow-sm" style={{ top: '64px' }}>
                <div className="w-full max-w-[1200px] px-4 flex items-center justify-between">
                    <div className="flex gap-10">
                        <div>
                            <div className="text-xs text-gray-500 font-bold mb-0.5 tracking-wider">DESTINATION</div>
                            <div className="text-[15px] font-bold text-gray-900">Ho Chi Minh City</div>
                        </div>
                        <div className="w-px h-10 bg-gray-200"></div>
                        <div>
                            <div className="text-xs text-gray-500 font-bold mb-0.5 tracking-wider">DATES</div>
                            <div className="text-[15px] font-bold text-gray-900">Dec 01 - Dec 05, 2024</div>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 border border-blue-200 text-travel-blue font-bold px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                        <span className="material-symbols-outlined text-[18px]">edit</span> Change Search
                    </button>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 flex gap-6">
                <div className="w-[280px] flex-shrink-0">
                    <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg">Filters</h3>
                            <button className="text-travel-blue font-semibold text-sm hover:underline" onClick={() => { setPriceRange([300000, 5000000]); setSortBy('popularity'); setSelectedTypes([]); }}>Reset</button>
                        </div>
                        <div className="mb-6">
                            <h4 className="font-semibold text-[15px] mb-4">Price per night</h4>
                            <Slider range min={0} max={5000000} step={100000} value={priceRange} onChange={(val: number[]) => setPriceRange(val as [number, number])} trackStyle={[{ backgroundColor: '#005CE6', height: 4 }]} handleStyle={[{ borderColor: '#005CE6' }, { borderColor: '#005CE6' }]} />
                        </div>
                        <div className="mb-6">
                            <h4 className="font-semibold text-[15px] mb-3">Room Type</h4>
                            {['Studio', '1 Bedroom', '2 Bedrooms', 'Entire House'].map(type => (
                                <label key={type} className="flex items-center gap-3 mb-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="w-4 h-4 rounded border-gray-300 text-travel-blue" 
                                        checked={selectedTypes.includes(type)}
                                        onChange={() => toggleType(type)}
                                    />
                                    <span className="text-sm font-medium text-gray-700">{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Promo Box — hidden when authenticated */}
                    {!isAuthenticated && (
                        <div className="bg-purple-700 text-white rounded-xl p-5 shadow-sm relative overflow-hidden">
                            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] text-black/10 rotate-12">apartment</span>
                            <h4 className="font-bold text-lg mb-2 relative z-10">Member Rates</h4>
                            <p className="text-sm text-purple-100 mb-4 relative z-10">Sign in to unlock exclusive rates on apartments.</p>
                            <button className="bg-white text-purple-700 px-4 py-2 rounded-lg font-bold text-sm w-full relative z-10 hover:bg-gray-100 transition-all">
                                Sign In Now
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex-1 flex flex-col gap-4">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-gray-600 text-sm">Sắp xếp theo:</span>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-white border rounded-lg px-3 py-2 text-[15px] font-bold outline-none cursor-pointer">
                            <option value="popularity">Phù hợp nhất</option>
                            <option value="price_asc">Giá: Thấp đến Cao</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-4">
                        {filteredApartments.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-10 bg-white border border-gray-200 border-dashed rounded-xl text-gray-400 mt-4 h-64">
                                <span className="material-symbols-outlined text-5xl mb-3 text-gray-300">apartment</span>
                                <p className="font-bold text-gray-500">No results to display</p>
                                <p className="text-sm">Try adjusting your filters.</p>
                            </div>
                        ) : (
                            filteredApartments.map((apt) => <ApartmentCard key={apt.id} apartment={apt} onClick={() => navigate(`/apartments/${apt.id}`)} />)
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Apartments;
