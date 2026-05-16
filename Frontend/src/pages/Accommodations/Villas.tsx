import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Slider } from 'antd';
import { VillaCard } from '../../components/ui/cards/accommodations/VillaCard';

const MOCK_VILLAS = [
    {
        id: 'v1',
        name: 'Ocean View Pool Villa',
        location: 'Cam Hai Dong, Khanh Hoa',
        rating: 9.6,
        ratingText: 'Exceptional',
        reviews: 214,
        price: 8500000,
        originalPrice: 10000000,
        badge: 'TOP CHOICE',
        image: 'https://images.unsplash.com/photo-1542314831-c6a4d14ce8a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        facilities: ['Private Pool', '4 Bedrooms', 'Ocean View', 'BBQ Grill'],
        stars: 5,
    },
    {
        id: 'v2',
        name: 'Hilltop Retreat Villa',
        location: 'Tam Dao, Vinh Phuc',
        rating: 9.2,
        ratingText: 'Superb',
        reviews: 180,
        price: 4200000,
        originalPrice: null,
        badge: '',
        image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        facilities: ['3 Bedrooms', 'Mountain View', 'Fireplace'],
        stars: 4,
    }
];

const Villas: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [priceRange, setPriceRange] = useState<[number, number]>([2000000, 20000000]);
    const [sortBy, setSortBy] = useState('popularity');
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

    const toggleType = (type: string) => {
        setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
    };

    const filteredVillas = MOCK_VILLAS.filter(villa => {
        const matchesPrice = villa.price >= priceRange[0] && villa.price <= priceRange[1];
        const matchesTypes = selectedTypes.length === 0 || selectedTypes.some(type => {
            const tl = type.toLowerCase();
            const keyword = tl.includes('pool') ? 'pool' : tl.includes('beach') ? 'ocean' : tl.includes('family') ? 'bedroom' : tl;
            return villa.name.toLowerCase().includes(keyword) || villa.facilities.some(f => f.toLowerCase().includes(keyword));
        });
        return matchesPrice && matchesTypes;
    }).sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        return b.reviews - a.reviews; // popularity
    });

    return (
        <div className="bg-[#f5f7fa] min-h-screen pb-10 font-['Plus_Jakarta_Sans']">
            <div className="bg-white border-b border-gray-200 py-4 mb-6 sticky z-30 flex justify-center shadow-sm" style={{ top: '64px' }}>
                <div className="w-full max-w-[1200px] px-4 flex items-center justify-between">
                    <div className="flex gap-10">
                        <div>
                            <div className="text-xs text-gray-500 font-bold mb-0.5 tracking-wider">DESTINATION</div>
                            <div className="text-[15px] font-bold text-gray-900">Nha Trang, Vietnam</div>
                        </div>
                        <div className="w-px h-10 bg-gray-200"></div>
                        <div>
                            <div className="text-xs text-gray-500 font-bold mb-0.5 tracking-wider">DATES</div>
                            <div className="text-[15px] font-bold text-gray-900">Nov 20 - Nov 22, 2024</div>
                        </div>
                        <div className="w-px h-10 bg-gray-200"></div>
                        <div>
                            <div className="text-xs text-gray-500 font-bold mb-0.5 tracking-wider">GUESTS</div>
                            <div className="text-[15px] font-bold text-gray-900">6 Adults, 1 Entire Villa</div>
                        </div>
                    </div>
                    <button 
                        className="flex items-center gap-2 border border-blue-200 text-travel-blue font-bold px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                        onClick={() => navigate('/')}
                    >
                        <span className="material-symbols-outlined text-[18px]">edit</span> Change Search
                    </button>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 flex gap-6">
                <div className="w-[280px] flex-shrink-0">
                    <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg">Filters</h3>
                            <button className="text-travel-blue font-semibold text-sm hover:underline" onClick={() => { setPriceRange([2000000, 20000000]); setSortBy('popularity'); setSelectedTypes([]); }}>Reset</button>
                        </div>
                        <div className="mb-6">
                            <h4 className="font-semibold text-[15px] mb-4">Price per night</h4>
                            <Slider range min={0} max={20000000} step={500000} value={priceRange} onChange={(val: number[]) => setPriceRange(val as [number, number])} trackStyle={[{ backgroundColor: '#005CE6', height: 4 }]} handleStyle={[{ borderColor: '#005CE6' }, { borderColor: '#005CE6' }]} />
                        </div>
                        <div className="mb-6">
                            <h4 className="font-semibold text-[15px] mb-3">Villa Type</h4>
                            {['Pool Villa', 'Beachfront', 'Mountain View', 'Family Friendly'].map(type => (
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
                        <div className="bg-green-700 text-white rounded-xl p-5 shadow-sm relative overflow-hidden">
                            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] text-black/10 rotate-12">local_offer</span>
                            <h4 className="font-bold text-lg mb-2 relative z-10">Exclusive Villa Rates</h4>
                            <p className="text-sm text-green-100 mb-4 relative z-10">Sign in to see prices up to 30% lower on selected villas.</p>
                            <button className="bg-white text-green-700 px-4 py-2 rounded-lg font-bold text-sm w-full relative z-10 hover:bg-gray-100 transition-all">
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
                        {filteredVillas.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-10 bg-white border border-gray-200 border-dashed rounded-xl text-gray-400 mt-4 h-64">
                                <span className="material-symbols-outlined text-5xl mb-3 text-gray-300">travel_explore</span>
                                <p className="font-bold text-gray-500">No results to display</p>
                                <p className="text-sm">Try adjusting your filters.</p>
                            </div>
                        ) : (
                            filteredVillas.map((villa) => <VillaCard key={villa.id} villa={villa} onClick={() => navigate(`/villas/${villa.id}`)} />)
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Villas;
