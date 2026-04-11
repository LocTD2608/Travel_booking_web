import React, { useState } from 'react';
import { Slider } from 'antd';

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

const VillaCard: React.FC<{ villa: typeof MOCK_VILLAS[0] }> = ({ villa }) => (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex shadow-sm hover:shadow-md transition-shadow">
        <div className="relative w-1/3 min-w-[280px] h-60">
            <img src={villa.image} alt={villa.name} className="w-full h-full object-cover" />
            {villa.badge && (
                <div className="absolute top-3 left-3 bg-white text-xs font-bold px-2 py-1 rounded shadow-sm text-green-600">
                    {villa.badge}
                </div>
            )}
        </div>
        <div className="flex-1 p-5 flex flex-col justify-between">
            <div>
                <div className="flex gap-1 mb-1">
                    {Array.from({ length: villa.stars }).map((_, i) => (
                        <span key={i} className="material-symbols-outlined text-yellow-500 text-[18px]">star</span>
                    ))}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{villa.name}</h3>
                <div className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    {villa.location}
                </div>
                <div className="flex items-center gap-2">
                    <span className="bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded text-sm">
                        {villa.rating.toFixed(1)}
                    </span>
                    <span className="text-green-700 font-semibold text-sm">{villa.ratingText}</span>
                    <span className="text-gray-400 text-sm">({villa.reviews} reviews)</span>
                </div>
            </div>
            <div className="flex justify-between items-end mt-4">
                <div className="flex flex-wrap gap-3">
                    {villa.facilities.map(fac => (
                        <div key={fac} className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                            <span className="material-symbols-outlined text-[14px]">check_circle</span>
                            {fac}
                        </div>
                    ))}
                </div>
                <div className="text-right">
                    {villa.originalPrice && (
                        <div className="text-xs text-gray-400 line-through mb-0.5 mt-2">
                            {villa.originalPrice.toLocaleString()} VNĐ
                        </div>
                    )}
                    <div className="text-2xl font-black text-gray-900 mb-0">
                        {villa.price.toLocaleString()} <span className="text-sm font-semibold text-gray-500">VNĐ</span>
                    </div>
                    <div className="text-xs text-gray-400 mb-3">/ night / entire villa</div>
                    <button className="bg-travel-blue text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors hover-scale">
                        Book Villa
                    </button>
                </div>
            </div>
        </div>
    </div>
);

const Villas: React.FC = () => {
    const [priceRange, setPriceRange] = useState<[number, number]>([2000000, 20000000]);
    const [sortBy, setSortBy] = useState('popularity');

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
                            <button className="text-travel-blue font-semibold text-sm hover:underline">Reset</button>
                        </div>
                        <div className="mb-6">
                            <h4 className="font-semibold text-[15px] mb-4">Price per night</h4>
                            <Slider range min={0} max={20000000} step={500000} value={priceRange} onChange={(val: number[]) => setPriceRange(val as [number, number])} trackStyle={[{ backgroundColor: '#005CE6', height: 4 }]} handleStyle={[{ borderColor: '#005CE6' }, { borderColor: '#005CE6' }]} />
                        </div>
                        <div className="mb-6">
                            <h4 className="font-semibold text-[15px] mb-3">Villa Type</h4>
                            {['Pool Villa', 'Beachfront', 'Mountain View', 'Family Friendly'].map(type => (
                                <label key={type} className="flex items-center gap-3 mb-2 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-travel-blue" />
                                    <span className="text-sm font-medium text-gray-700">{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>
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
                        {MOCK_VILLAS.map((villa) => <VillaCard key={villa.id} villa={villa} />)}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Villas;
