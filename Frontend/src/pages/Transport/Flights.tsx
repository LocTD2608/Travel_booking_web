import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../../components/auth/AuthModal';
import { Slider } from 'antd';

// Mock Data for Flights
const MOCK_FLIGHTS = [
    {
        id: 'f1',
        airline: 'Vietnam Airlines',
        airlineLogo: 'Lotus', // Placeholder for text logo
        flightNumber: 'VN-128',
        departureTime: '06:00',
        arrivalTime: '08:15',
        duration: '2h 15m',
        from: 'Hanoi (HAN)',
        to: 'Da Nang (DAD)',
        price: 1850000,
        originalPrice: 2200000,
        type: 'Direct',
        class: 'Economy',
        baggage: '23kg Checked',
    },
    {
        id: 'f2',
        airline: 'Bamboo Airways',
        airlineLogo: 'Bamboo',
        flightNumber: 'QH-102',
        departureTime: '09:30',
        arrivalTime: '11:50',
        duration: '2h 20m',
        from: 'Hanoi (HAN)',
        to: 'Da Nang (DAD)',
        price: 1450000,
        originalPrice: null,
        type: 'Direct',
        class: 'Economy',
        baggage: '20kg Checked',
    },
    {
        id: 'f3',
        airline: 'Vietjet Air',
        airlineLogo: 'VJ',
        flightNumber: 'VJ-509',
        departureTime: '14:00',
        arrivalTime: '16:10',
        duration: '2h 10m',
        from: 'Hanoi (HAN)',
        to: 'Da Nang (DAD)',
        price: 950000,
        originalPrice: null,
        type: 'Direct',
        class: 'Promo',
        baggage: '7kg Cabin',
    }
];

const FlightCard: React.FC<{ flight: typeof MOCK_FLIGHTS[0]; onSelect: () => void }> = ({ flight, onSelect }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
        {/* Left Color Strip for Airline */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${flight.airline === 'Vietnam Airlines' ? 'bg-[#005F6E]' : flight.airline === 'Bamboo Airways' ? 'bg-[#00A14B]' : 'bg-[#ED1B24]'}`}></div>

        <div className="flex justify-between items-center mb-4 pl-2">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex justify-center items-center font-bold text-white shadow-sm ${flight.airline === 'Vietnam Airlines' ? 'bg-[#005F6E]' : flight.airline === 'Bamboo Airways' ? 'bg-[#00A14B]' : 'bg-[#ED1B24]'}`}>
                    {flight.airlineLogo.substring(0, 2).toUpperCase()}
                </div>
                <div>
                    <h3 className="font-bold text-gray-900">{flight.airline}</h3>
                    <div className="text-xs text-gray-500">{flight.flightNumber}</div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <span className="bg-[#EBF3FF] text-travel-blue font-bold px-2 py-0.5 rounded text-xs">
                    {flight.class}
                </span>
            </div>
        </div>

        <div className="flex justify-between items-center pl-2">

            {/* Route & Time */}
            <div className="flex items-center gap-6 flex-1 pr-6">
                <div className="text-right">
                    <div className="text-2xl font-black text-gray-900">{flight.departureTime}</div>
                    <div className="text-sm font-semibold text-gray-500">{flight.from}</div>
                </div>

                <div className="flex-1 flex flex-col items-center px-4 relative">
                    <div className="text-xs text-gray-400 font-semibold mb-1">{flight.duration}</div>
                    <div className="w-full flex items-center justify-center relative">
                        <div className="w-2 h-2 rounded-full border-2 border-gray-300 bg-white z-10"></div>
                        <div className="h-[2px] bg-gray-200 flex-1 relative">
                            {/* Line */}
                        </div>
                        <div className="w-2 h-2 rounded-full border-2 border-gray-300 bg-white z-10 text-travel-blue">
                            <span className="material-symbols-outlined text-[16px] absolute -top-5 left-1/2 -ml-2 bg-white px-1 text-gray-400 rotate-90">flight</span>
                        </div>
                    </div>
                    <div className="text-xs text-travel-blue font-bold mt-1 bg-blue-50 px-2 py-0.5 rounded">{flight.type}</div>
                </div>

                <div className="text-left">
                    <div className="text-2xl font-black text-gray-900">{flight.arrivalTime}</div>
                    <div className="text-sm font-semibold text-gray-500">{flight.to}</div>
                </div>
            </div>

            {/* Price & Action */}
            <div className="text-right border-l border-gray-100 pl-6 min-w-[200px]">
                {flight.originalPrice && (
                    <div className="text-xs text-gray-400 line-through mb-0.5">
                        {flight.originalPrice.toLocaleString()} VNĐ
                    </div>
                )}
                <div className="text-2xl font-black text-[#FF5E1F] mb-0 leading-none">
                    {flight.price.toLocaleString()} <span className="text-sm font-semibold text-gray-500">VNĐ</span>
                </div>
                <div className="text-xs text-gray-400 mb-3 mt-1 flex justify-end items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">work</span>
                    {flight.baggage}
                </div>
                <button
                    className="bg-[#FF5E1F] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#E64B0E] transition-colors hover-scale w-full shadow-sm"
                    onClick={(e) => { e.stopPropagation(); onSelect(); }}
                >
                    Select
                </button>
            </div>
        </div>
    </div>
);

const Flights: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const handleSelectFlight = (flight: typeof MOCK_FLIGHTS[0]) => {
        if (!isAuthenticated) { setIsAuthModalOpen(true); return; }
        const params = new URLSearchParams({
            type: 'flight',
            name: `${flight.airline} ${flight.flightNumber}`,
            price: String(flight.price),
            detail2: flight.class,
            detail3: `${flight.from} → ${flight.to}`,
            detail4: `${flight.departureTime} – ${flight.arrivalTime}`,
        });
        navigate(`/booking?${params.toString()}`);
    };

    // Top Search State
    const [searchState] = useState({
        from: 'Hanoi (HAN)',
        to: 'Da Nang (DAD)',
        date: 'Oct 12, 2024',
        passengers: '1 Adult, Economy'
    });

    const [priceRange, setPriceRange] = useState<[number, number]>([500000, 5000000]);
    const [sortBy, setSortBy] = useState('price_asc');

    // Filtering & Sorting Logic
    const filteredFlights = MOCK_FLIGHTS.filter((flight) => {
        return flight.price >= priceRange[0] && flight.price <= priceRange[1];
    }).sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'duration') {
            // "2h 15m" parsing (mock parsing)
            const getMins = (d: string) => {
                const parts = d.split('h ');
                const h = parseInt(parts[0]) || 0;
                const m = parseInt(parts[1]?.replace('m', '')) || 0;
                return h * 60 + m;
            };
            return getMins(a.duration) - getMins(b.duration);
        }
        if (sortBy === 'departure') {
            // "06:00" string compare
            return a.departureTime.localeCompare(b.departureTime);
        }
        return 0;
    });

    return (
        <>
            <div className="bg-[#f5f7fa] min-h-screen pb-10 font-['Plus_Jakarta_Sans']">
                {/* Top Search Info Bar */}
                <div className="bg-white border-b border-gray-200 py-4 mb-6 sticky z-30 flex justify-center shadow-sm" style={{ top: '64px' }}>
                    <div className="w-full max-w-[1200px] px-4 flex items-center justify-between">
                        <div className="flex gap-10">
                            <div>
                                <div className="text-xs text-gray-500 font-bold mb-0.5 tracking-wider">FLIGHT</div>
                                <div className="text-[15px] font-bold text-gray-900">{searchState.from} ➔ {searchState.to}</div>
                            </div>
                            <div className="w-px h-10 bg-gray-200"></div>
                            <div>
                                <div className="text-xs text-gray-500 font-bold mb-0.5 tracking-wider">DEPARTURE RATE</div>
                                <div className="text-[15px] font-bold text-gray-900">{searchState.date}</div>
                            </div>
                            <div className="w-px h-10 bg-gray-200"></div>
                            <div>
                                <div className="text-xs text-gray-500 font-bold mb-0.5 tracking-wider">PASSENGERS & CLASS</div>
                                <div className="text-[15px] font-bold text-gray-900">{searchState.passengers}</div>
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
                                <button
                                    className="text-travel-blue font-semibold text-sm hover:underline"
                                    onClick={() => { setPriceRange([500000, 5000000]); setSortBy('price_asc'); }}
                                >
                                    Reset
                                </button>
                            </div>

                            {/* Price Filter */}
                            <div className="mb-6">
                                <h4 className="font-semibold text-[15px] mb-4">Price / Passenger</h4>
                                <Slider
                                    range
                                    min={0}
                                    max={5000000}
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

                            {/* Airlines */}
                            <div className="mb-6">
                                <h4 className="font-semibold text-[15px] mb-3">Airlines</h4>
                                {[
                                    { name: 'Vietnam Airlines', count: 12, code: '#005F6E' },
                                    { name: 'Bamboo Airways', count: 8, code: '#00A14B' },
                                    { name: 'Vietjet Air', count: 24, code: '#ED1B24' }
                                ].map(airline => (
                                    <label key={airline.name} className="flex justify-between items-center mb-3 cursor-pointer group">
                                        <div className="flex items-center gap-3">
                                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-travel-blue focus:ring-travel-blue cursor-pointer" />
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: airline.code }}></div>
                                            <span className="text-sm font-medium text-gray-700">{airline.name}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>

                            {/* Departure Time */}
                            <div className="mb-2">
                                <h4 className="font-semibold text-[15px] mb-3">Departure Time</h4>
                                {[
                                    { name: 'Morning', icon: 'wb_sunny', desc: '06:00 - 12:00' },
                                    { name: 'Afternoon', icon: 'partly_cloudy_day', desc: '12:00 - 18:00' },
                                    { name: 'Evening', icon: 'nightlight', desc: '18:00 - 24:00' },
                                ].map(time => (
                                    <label key={time.name} className="flex items-center gap-3 mb-3 cursor-pointer group">
                                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-travel-blue focus:ring-travel-blue cursor-pointer" />
                                        <span className="material-symbols-outlined text-[20px] text-yellow-500 group-hover:text-yellow-600 transition-colors">{time.icon}</span>
                                        <div>
                                            <div className="text-sm font-medium text-gray-700">{time.name}</div>
                                            <div className="text-[11px] text-gray-400">{time.desc}</div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Promotion Box – hidden when logged in */}
                        {!isAuthenticated && (
                            <div className="bg-[#FF5E1F] text-white rounded-xl p-5 shadow-sm relative overflow-hidden">
                                <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] text-black/10 rotate-12">loyalty</span>
                                <h4 className="font-bold text-lg mb-2 relative z-10">Fly Cheaper</h4>
                                <p className="text-sm text-orange-100 mb-4 relative z-10">Login to unlock special flight discounts up to 20% on selected routes.</p>
                                <button onClick={() => setIsAuthModalOpen(true)} className="bg-white text-[#FF5E1F] px-4 py-2 rounded-lg font-bold text-sm w-full relative z-10 hover:bg-gray-100 hover-scale transition-all">
                                    Sign In Now
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right Column (Results) */}
                    <div className="flex-1 flex flex-col gap-4">

                        {/* Sort Bar */}
                        <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold text-gray-600 text-sm">Sắp xếp theo:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-[15px] font-bold text-gray-900 outline-none cursor-pointer focus:border-travel-blue shadow-sm min-w-[200px]"
                            >
                                <option value="price_asc">Giá: Thấp đến Cao</option>
                                <option value="price_desc">Giá: Cao đến Thấp</option>
                                <option value="duration">Thời gian bay</option>
                                <option value="departure">Giờ khởi hành sớm nhất</option>
                            </select>
                        </div>

                        {/* Content */}
                        {filteredFlights.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-10 bg-white border border-gray-200 border-dashed rounded-xl text-gray-400 mt-4 h-64">
                                <span className="material-symbols-outlined text-5xl mb-3 text-gray-300">flight_off</span>
                                <p className="font-bold text-gray-500">No flights available</p>
                                <p className="text-sm">Try adjusting your dates or routes.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {filteredFlights.map((flight) => (
                                    <FlightCard key={flight.id} flight={flight} onSelect={() => handleSelectFlight(flight)} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialView="login" />
        </>
    );
};

export default Flights;
