import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../../components/auth/AuthModal';
import { Slider } from 'antd';
import { BusCard } from '../../components/ui/cards/transport/BusCard';
import { HeroSearch } from '../../components/ui/HeroSearch/HeroSearch';

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

const BusShuttle: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

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
                        <button 
                            className="flex items-center gap-2 border border-blue-200 text-travel-blue font-bold px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                        >
                            <span className="material-symbols-outlined text-[18px]">{isSearchOpen ? 'close' : 'edit'}</span> 
                            {isSearchOpen ? 'Close' : 'Change Search'}
                        </button>
                    </div>
                </div>

                {isSearchOpen && (
                    <div className="w-full bg-white border-b border-gray-200 py-6 flex justify-center animate-fade-in shadow-inner relative z-30 mb-6">
                        <div className="w-full max-w-[1200px] px-4">
                            <HeroSearch isCompact={true} initialTab="flights" onSearch={handleSearchClick} />
                        </div>
                    </div>
                )}

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
