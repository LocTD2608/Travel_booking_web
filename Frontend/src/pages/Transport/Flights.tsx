import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../../components/auth/AuthModal';
import { Slider } from 'antd';
import { FlightCard, type FlightCardProps } from '../../components/ui/cards/transport/FlightCard';
import { fetchFlights } from '../../services/searchApi';
import FlightSelectionModal from '../../components/ui/modal/FlightSelectionModal';
import { HeroSearch } from '../../components/ui/HeroSearch/HeroSearch';

const Flights: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { isAuthenticated } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isFlightModalOpen, setIsFlightModalOpen] = useState(false);
    const [selectedFlight, setSelectedFlight] = useState<FlightCardProps | null>(null);
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

    // Top Search State
    const searchState = {
        from: searchParams.get('origin') || searchParams.get('from') || 'Hanoi (HAN)',
        to: searchParams.get('destination') || searchParams.get('to') || 'Da Nang (DAD)',
        date: searchParams.get('departureDate') || searchParams.get('date') || 'Oct 12, 2024',
        passengers: searchParams.get('passengers') || '1 Adult, Economy'
    };

    const handleSelectFlight = (flight: FlightCardProps) => {
        if (!isAuthenticated) { setIsAuthModalOpen(true); return; }
        setSelectedFlight(flight);
        setIsFlightModalOpen(true);
    };

    // Parse passenger count from search parameters
    const getPassengerCount = () => {
        const passengersStr = searchState.passengers;
        const match = passengersStr.match(/^(\d+)/);
        return match ? parseInt(match[1]) : 1;
    };
    const passengerCount = getPassengerCount();

    const handleConfirmFlight = (finalData: any) => {
        setIsFlightModalOpen(false);
        const seatsText = finalData.isAutoAssigned 
            ? `${passengerCount} Seats (Auto-assigned)`
            : `${finalData.outbound.seats.length} Seats (${finalData.outbound.seats.map((s: any) => s.id).join(', ')})`;
            
        const params = new URLSearchParams({
            type: 'flight',
            name: `${finalData.outbound.flight.airline} ${finalData.outbound.flight.flightNumber}`,
            price: String(finalData.grandTotal),
            detail2: seatsText + (finalData.isRoundTrip ? ` & Return ${finalData.return.flight.flightNumber}` : ''),
            detail3: `${finalData.outbound.flight.from} → ${finalData.outbound.flight.to}`,
            detail4: `${finalData.outbound.flight.departureTime} – ${finalData.outbound.flight.arrivalTime}`,
        });
        navigate(`/booking?${params.toString()}`);
    };

    const [flights, setFlights] = useState<FlightCardProps[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFlights = async () => {
            try {
                setLoading(true);
                const fromCity = searchState.from.split('(')[0].trim();
                const toCity = searchState.to.split('(')[0].trim();
                const res = await fetchFlights({ from: fromCity, to: toCity });
                if (res.success) {
                    const mapped = res.data.map(f => {
                        const dep = new Date(`1970-01-01T${f.departure_time}`);
                        const arr = new Date(`1970-01-01T${f.arrival_time}`);
                        let diffMins = Math.round((arr.getTime() - dep.getTime()) / 60000);
                        if (diffMins < 0) diffMins += 24 * 60;
                        const h = Math.floor(diffMins / 60);
                        const m = diffMins % 60;
                        const duration = `${h}h ${m}m`;

                        return {
                            id: f.MaChuyenBay.toString(),
                            airline: f.HangBay,
                            airlineLogo: f.HangBay,
                            flightNumber: `${f.HangBay.substring(0, 2).toUpperCase()}-${f.MaChuyenBay}`,
                            departureTime: f.departure_time.substring(0, 5),
                            arrivalTime: f.arrival_time.substring(0, 5),
                            duration,
                            from: f.from_name,
                            to: f.to_name,
                            price: f.price,
                            originalPrice: null,
                            type: 'Direct',
                            class: f.HangGhe,
                            baggage: '20kg Checked',
                        };
                    });
                    setFlights(mapped);
                }
            } catch (err) {
                console.error("Failed to fetch flights:", err);
            } finally {
                setLoading(false);
            }
        };
        loadFlights();
    }, [searchState.from, searchState.to]);

    const [priceRange, setPriceRange] = useState<[number, number]>([500000, 5000000]);
    const [sortBy, setSortBy] = useState('price_asc');

    // Filtering & Sorting Logic
    const filteredFlights = flights.filter((flight) => {
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

                            {/* Popular Routes */}
                            <div className="mb-6">
                                <h4 className="font-semibold text-[15px] mb-3">Popular Routes</h4>
                                {[
                                    { name: 'Hanoi ➔ Da Nang', from: 'Hanoi (HAN)', to: 'Da Nang (DAD)' },
                                    { name: 'Ho Chi Minh ➔ Hanoi', from: 'Ho Chi Minh (SGN)', to: 'Hanoi (HAN)' },
                                    { name: 'Da Nang ➔ Ho Chi Minh', from: 'Da Nang (DAD)', to: 'Ho Chi Minh (SGN)' },
                                ].map(route => (
                                    <button
                                        key={route.name}
                                        onClick={() => navigate(`/flights?origin=${encodeURIComponent(route.from)}&destination=${encodeURIComponent(route.to)}`)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold mb-1.5 transition-all flex items-center justify-between ${
                                            searchState.from.toLowerCase().includes(route.from.split(' ')[0].toLowerCase()) &&
                                            searchState.to.toLowerCase().includes(route.to.split(' ')[0].toLowerCase())
                                                ? 'bg-orange-50 text-[#FF5E1F] border border-orange-100'
                                                : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                                        }`}
                                    >
                                        <span>{route.name}</span>
                                        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                                    </button>
                                ))}
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
                        {loading ? (
                            <div className="flex flex-col items-center justify-center p-10 bg-white border border-gray-200 rounded-xl text-gray-400 mt-4 h-64 shadow-sm">
                                <div className="w-8 h-8 border-4 border-travel-blue border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="font-bold text-gray-500">Searching flights...</p>
                            </div>
                        ) : filteredFlights.length === 0 ? (
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
            <FlightSelectionModal 
                isOpen={isFlightModalOpen} 
                onClose={() => setIsFlightModalOpen(false)} 
                outboundFlight={selectedFlight}
                onConfirm={handleConfirmFlight}
                passengerCount={passengerCount}
            />
        </>
    );
};

export default Flights;
