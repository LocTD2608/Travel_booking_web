import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../../components/auth/AuthModal';
import { Slider } from 'antd';
import { TrainCard } from '../../components/ui/cards/transport/TrainCard';
import { HeroSearch } from '../../components/ui/HeroSearch/HeroSearch';

const MOCK_TRAINS = [
    {
        id: 't1',
        operator: 'Vietnam Railways',
        trainNumber: 'SE3',
        departureTime: '19:25',
        arrivalTime: '10:45',
        duration: '15h 20m',
        from: 'Hanoi',
        to: 'Da Nang',
        price: 850000,
        originalPrice: 950000,
        type: 'Express',
        class: 'Soft Bed',
    },
    {
        id: 't2',
        operator: 'Vietnam Railways',
        trainNumber: 'SE1',
        departureTime: '22:15',
        arrivalTime: '13:30',
        duration: '15h 15m',
        from: 'Hanoi',
        to: 'Da Nang',
        price: 650000,
        originalPrice: null,
        type: 'Express',
        class: 'Soft Seat',
    }
];

const Trains: React.FC = () => {
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

    const handleSelect = (train: typeof MOCK_TRAINS[0]) => {
        if (!isAuthenticated) { setIsAuthModalOpen(true); return; }
        const params = new URLSearchParams({
            type: 'train',
            name: `${train.operator} · Train ${train.trainNumber}`,
            price: String(train.price),
            detail2: train.class,
            detail3: `${train.from} → ${train.to}`,
            detail4: `${train.departureTime} – ${train.arrivalTime}`,
        });
        navigate(`/booking?${params.toString()}`);
    };

    const [priceRange, setPriceRange] = useState<[number, number]>([100000, 2000000]);
    const [sortBy, setSortBy] = useState('price_asc');

    return (
        <>
            <div className="bg-[#f5f7fa] min-h-screen pb-10 font-['Plus_Jakarta_Sans']">
                <div className="bg-white border-b border-gray-200 py-4 mb-6 sticky z-30 flex justify-center shadow-sm" style={{ top: '64px' }}>
                    <div className="w-full max-w-[1200px] px-4 flex items-center justify-between">
                        <div className="flex gap-10">
                            <div>
                                <div className="text-xs text-gray-500 font-bold mb-0.5 tracking-wider">TRAIN</div>
                                <div className="text-[15px] font-bold text-gray-900">Hanoi ➔ Da Nang</div>
                            </div>
                            <div className="w-px h-10 bg-gray-200"></div>
                            <div>
                                <div className="text-xs text-gray-500 font-bold mb-0.5 tracking-wider">DEPARTURE</div>
                                <div className="text-[15px] font-bold text-gray-900">Nov 10, 2024</div>
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
                                <Slider range min={0} max={2000000} step={50000} value={priceRange} onChange={(val: number[]) => setPriceRange(val as [number, number])} trackStyle={[{ backgroundColor: '#005CE6', height: 4 }]} handleStyle={[{ borderColor: '#005CE6' }, { borderColor: '#005CE6' }]} />
                            </div>
                            <div className="mb-6">
                                <h4 className="font-semibold text-[15px] mb-3">Seat Type</h4>
                                {['Hard Seat', 'Soft Seat', 'Hard Bed', 'Soft Bed'].map(type => (
                                    <label key={type} className="flex justify-between items-center mb-3 cursor-pointer group">
                                        <div className="flex items-center gap-3">
                                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-travel-blue" />
                                            <span className="text-sm font-medium text-gray-700">{type}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col gap-4">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold text-gray-600 text-sm">Sắp xếp theo:</span>
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-white border border-gray-200 rounded-lg pl-3 pr-10 py-2 text-[15px] font-bold text-gray-900 outline-none min-w-[220px]">
                                <option value="price_asc">Giá: Thấp đến Cao</option>
                                <option value="duration">Thời gian đi</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-4">
                            {MOCK_TRAINS.filter(t => t.price >= priceRange[0] && t.price <= priceRange[1])
                                .map((train) => <TrainCard key={train.id} train={train} onSelect={() => handleSelect(train)} />)}
                        </div>
                    </div>
                </div>
            </div>
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialView="login" />
        </>
    );
};
export default Trains;
