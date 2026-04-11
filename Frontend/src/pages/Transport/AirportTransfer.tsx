import React, { useState } from 'react';
import { Slider } from 'antd';

const MOCK_TRANSFERS = [
    {
        id: 'tr1',
        provider: 'Nha Trang Private Cars',
        carName: 'Toyota Fortuner or similar',
        seats: 7,
        baggage: 4,
        from: 'Cam Ranh Airport (CXR)',
        to: 'Nha Trang City Center',
        price: 350000,
        originalPrice: 400000,
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        badge: 'BEST SELLER',
    },
    {
        id: 'tr2',
        provider: 'Premium Limo Services',
        carName: 'Ford Transit Limousine',
        seats: 9,
        baggage: 6,
        from: 'Cam Ranh Airport (CXR)',
        to: 'Nha Trang City Center',
        price: 850000,
        originalPrice: null,
        image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        badge: '',
    }
];

const TransferCard: React.FC<{ transfer: typeof MOCK_TRANSFERS[0] }> = ({ transfer }) => (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex shadow-sm hover:shadow-md transition-shadow">
        <div className="relative w-1/3 min-w-[240px] max-w-[280px] h-48">
            <img src={transfer.image} alt={transfer.carName} className="w-full h-full object-cover" />
            {transfer.badge && (
                <div className="absolute top-3 left-3 bg-white text-xs font-bold px-2 py-1 rounded shadow-sm text-yellow-600">
                    {transfer.badge}
                </div>
            )}
        </div>
        <div className="flex-1 p-5 flex flex-col justify-between">
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{transfer.carName}</h3>
                <div className="text-sm text-gray-500 mb-3">{transfer.provider}</div>
                <div className="flex items-center gap-4 text-sm font-medium text-gray-600">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">person</span> {transfer.seats} Seats</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">work</span> {transfer.baggage} Bags</span>
                </div>
            </div>
            <div className="flex justify-between items-end mt-4">
                <div className="text-sm text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded">
                    Free Cancellation
                </div>
                <div className="text-right">
                    {transfer.originalPrice && (
                        <div className="text-xs text-gray-400 line-through mb-0.5 mt-2">
                            {transfer.originalPrice.toLocaleString()} VNĐ
                        </div>
                    )}
                    <div className="text-2xl font-black text-gray-900 mb-0">
                        {transfer.price.toLocaleString()} <span className="text-sm font-semibold text-gray-500">VNĐ</span>
                    </div>
                    <button className="bg-travel-blue text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors hover-scale mt-3">
                        Book Transfer
                    </button>
                </div>
            </div>
        </div>
    </div>
);

const AirportTransfer: React.FC = () => {
    const [priceRange, setPriceRange] = useState<[number, number]>([100000, 2000000]);

    return (
        <div className="bg-[#f5f7fa] min-h-screen pb-10 font-['Plus_Jakarta_Sans']">
            <div className="bg-white border-b border-gray-200 py-4 mb-6 sticky z-30 flex justify-center shadow-sm" style={{ top: '64px' }}>
                <div className="w-full max-w-[1200px] px-4 flex items-center justify-between">
                    <div className="flex gap-10">
                        <div>
                            <div className="text-xs text-gray-500 font-bold mb-0.5 tracking-wider">AIRPORT TRANSFER</div>
                            <div className="text-[15px] font-bold text-gray-900">Cam Ranh Airport ➔ Nha Trang City</div>
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
                        </div>
                        <div className="mb-6">
                            <h4 className="font-semibold text-[15px] mb-4">Price Range</h4>
                            <Slider range min={0} max={2000000} step={50000} value={priceRange} onChange={(val: number[]) => setPriceRange(val as [number, number])} trackStyle={[{ backgroundColor: '#005CE6', height: 4 }]} handleStyle={[{ borderColor: '#005CE6' }, { borderColor: '#005CE6' }]} />
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-4">
                    <div className="flex flex-col gap-4">
                        {MOCK_TRANSFERS.map((transfer) => <TransferCard key={transfer.id} transfer={transfer} />)}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AirportTransfer;
