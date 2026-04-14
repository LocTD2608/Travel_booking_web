import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../../components/auth/AuthModal';
import { Slider } from 'antd';

const MOCK_BUSES = [
    {
        id: 'b1',
        operator: 'Phuong Trang (FUTA)',
        departureTime: '10:00',
        arrivalTime: '18:30',
        duration: '8h 30m',
        from: 'Ho Chi Minh',
        to: 'Da Lat',
        price: 280000,
        type: 'Sleeper',
    },
    {
        id: 'b2',
        operator: 'Thanh Buoi',
        departureTime: '22:00',
        arrivalTime: '06:00',
        duration: '8h 00m',
        from: 'Ho Chi Minh',
        to: 'Da Lat',
        price: 350000,
        type: 'Limousine',
    }
];

const BusCard: React.FC<{ bus: typeof MOCK_BUSES[0]; onSelect: () => void }> = ({ bus, onSelect }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#d97706]"></div>
        <div className="flex justify-between items-center mb-4 pl-2">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex justify-center items-center font-bold text-white shadow-sm bg-[#d97706]">
                    BUS
                </div>
                <div>
                    <h3 className="font-bold text-gray-900">{bus.operator}</h3>
                    <div className="text-xs text-gray-500">{bus.type} Bus</div>
                </div>
            </div>
        </div>
        <div className="flex justify-between items-center pl-2">
            <div className="flex items-center gap-6 flex-1 pr-6">
                <div className="text-right">
                    <div className="text-2xl font-black text-gray-900">{bus.departureTime}</div>
                    <div className="text-sm font-semibold text-gray-500">{bus.from}</div>
                </div>
                <div className="flex-1 flex flex-col items-center px-4 relative">
                    <div className="text-xs text-gray-400 font-semibold mb-1">{bus.duration}</div>
                    <div className="w-full flex items-center justify-center relative">
                        <div className="w-2 h-2 rounded-full border-2 border-gray-300 bg-white z-10"></div>
                        <div className="h-[2px] bg-gray-200 flex-1 relative"></div>
                        <div className="w-2 h-2 rounded-full border-2 border-gray-300 bg-white z-10 text-travel-blue">
                            <span className="material-symbols-outlined text-[16px] absolute -top-5 left-1/2 -ml-2 bg-white px-1 text-gray-400">directions_bus</span>
                        </div>
                    </div>
                </div>
                <div className="text-left">
                    <div className="text-2xl font-black text-gray-900">{bus.arrivalTime}</div>
                    <div className="text-sm font-semibold text-gray-500">{bus.to}</div>
                </div>
            </div>
            <div className="text-right border-l border-gray-100 pl-6 min-w-[200px]">
                <div className="text-2xl font-black text-[#FF5E1F] mb-3 leading-none">
                    {bus.price.toLocaleString()} <span className="text-sm font-semibold text-gray-500">VNĐ</span>
                </div>
                <button
                    className="bg-[#FF5E1F] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#E64B0E] transition-colors hover-scale w-full shadow-sm"
                    onClick={onSelect}
                >
                    Select
                </button>
            </div>
        </div>
    </div>
);

const BusShuttle: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const handleSelect = (bus: typeof MOCK_BUSES[0]) => {
        if (!isAuthenticated) { setIsAuthModalOpen(true); return; }
        const params = new URLSearchParams({
            type: 'bus',
            name: `${bus.operator} · ${bus.type} Bus`,
            price: String(bus.price),
            detail2: bus.type,
            detail3: `${bus.from} → ${bus.to}`,
            detail4: `${bus.departureTime} – ${bus.arrivalTime}`,
        });
        navigate(`/booking?${params.toString()}`);
    };

    const [priceRange, setPriceRange] = useState<[number, number]>([100000, 1000000]);
    const [sortBy, setSortBy] = useState('price_asc');

    return (
        <>
            <div className="bg-[#f5f7fa] min-h-screen pb-10 font-['Plus_Jakarta_Sans']">
                <div className="bg-white border-b border-gray-200 py-4 mb-6 sticky z-30 flex justify-center shadow-sm" style={{ top: '64px' }}>
                    <div className="w-full max-w-[1200px] px-4 flex items-center justify-between">
                        <div className="flex gap-10">
                            <div>
                                <div className="text-xs text-gray-500 font-bold mb-0.5 tracking-wider">BUS</div>
                                <div className="text-[15px] font-bold text-gray-900">Ho Chi Minh ➔ Da Lat</div>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 border border-blue-200 text-travel-blue font-bold px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                            <span className="material-symbols-outlined text-[18px]">edit</span> Change Search
                        </button>
                    </div>
                </div>

                <div className="max-w-[1200px] mx-auto px-4 flex gap-6">
                    <div className="w-[280px] flex-shrink-0">
                        <div className="bg-white border text-gray-800 border-gray-200 rounded-xl p-5 mb-4 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-lg">Filters</h3>
                                <button className="text-travel-blue font-semibold text-sm hover:underline">Reset</button>
                            </div>
                            <div className="mb-6">
                                <h4 className="font-semibold text-[15px] mb-4">Price / Passenger</h4>
                                <Slider range min={0} max={1000000} step={20000} value={priceRange} onChange={(val: number[]) => setPriceRange(val as [number, number])} trackStyle={[{ backgroundColor: '#005CE6', height: 4 }]} handleStyle={[{ borderColor: '#005CE6' }, { borderColor: '#005CE6' }]} />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col gap-4">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold text-gray-600 text-sm">Sắp xếp theo:</span>
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-[15px] font-bold text-gray-900 outline-none">
                                <option value="price_asc">Giá: Thấp đến Cao</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-4">
                            {MOCK_BUSES.filter(b => b.price >= priceRange[0] && b.price <= priceRange[1])
                                .map((bus) => <BusCard key={bus.id} bus={bus} onSelect={() => handleSelect(bus)} />)}
                        </div>
                    </div>
                </div>
            </div>
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialView="login" />
        </>
    );
};
export default BusShuttle;
