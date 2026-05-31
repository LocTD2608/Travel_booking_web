import React, { useState, useEffect } from 'react';
import { type FlightCardProps } from '../cards/transport/FlightCard';
import { fetchFlightSeats } from '../../../services/searchApi';

interface FlightSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (selectedData: any) => void;
    outboundFlight: FlightCardProps | null;
}

interface Seat {
    id: string; 
    classId: string;
    className: string;
    priceAddition: number;
}

// MOCK DATA FOR RETURN FLIGHT (Vì chúng ta chưa làm API lấy chuyến về)
const MOCK_RETURN_FLIGHT = {
    airline: 'Vietnam Airlines',
    flightNumber: 'VN-456',
    departureTime: '15:00',
    arrivalTime: '17:15',
    from: 'Da Nang',
    to: 'Hanoi',
    basePrice: 1200000
};

const FlightSelectionModal: React.FC<FlightSelectionModalProps> = ({ isOpen, onClose, onConfirm, outboundFlight }) => {
    const [isRoundTrip, setIsRoundTrip] = useState(false);
    const [activeTab, setActiveTab] = useState<'outbound' | 'return'>('outbound');
    
    // State for Seats from API
    const [seatData, setSeatData] = useState<any[]>([]);
    const [zones, setZones] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Selected seats per tab
    const [selectedSeats, setSelectedSeats] = useState<{ outbound: Seat[], return: Seat[] }>({
        outbound: [],
        return: []
    });

    useEffect(() => {
        if (isOpen && outboundFlight?.id) {
            setIsRoundTrip(false);
            setActiveTab('outbound');
            setSelectedSeats({ outbound: [], return: [] });
            loadSeats(outboundFlight.id.toString());
        }
    }, [isOpen, outboundFlight]);

    const loadSeats = async (flightId: string) => {
        setIsLoading(true);
        try {
            const res = await fetchFlightSeats(flightId);
            const seats = res.data || [];
            setSeatData(seats);
            
            // Build groups (business, premium, eco)
            const grouped = [
                { id: 'business', name: 'Business Class', bg: 'bg-[#FDF7E3]', borderColor: 'border-[#F4D03F]', items: [] as any[] },
                { id: 'premium', name: 'Premium Economy', bg: 'bg-[#EAF2F8]', borderColor: 'border-[#5DADE2]', items: [] as any[] },
                { id: 'eco', name: 'Economy Class', bg: 'bg-[#F2F4F4]', borderColor: 'border-[#BDC3C7]', items: [] as any[] }
            ];

            seats.forEach((seat: any) => {
                const classId = seat.HangGhe;
                const group = grouped.find(g => g.id === classId);
                if (group) {
                    group.items.push(seat);
                }
            });

            // For each group, organize by row
            grouped.forEach(group => {
                const rowMap: Record<number, string[]> = {};
                group.items.forEach(seat => {
                    const match = seat.SoGhe.match(/^(\d+)([A-Z])$/);
                    if (match) {
                        const rowNum = parseInt(match[1]);
                        if (!rowMap[rowNum]) rowMap[rowNum] = [];
                        rowMap[rowNum].push(seat.SoGhe);
                    }
                });

                // Convert rowMap to sorted array
                (group as any).rows = Object.keys(rowMap).sort((a,b) => parseInt(a) - parseInt(b)).map(rStr => {
                    const rowNum = parseInt(rStr);
                    // Determine config based on class to insert 'space'
                    const rawSeats = rowMap[rowNum].sort();
                    let config: string[] = [];
                    
                    if (group.id === 'business') {
                        // Usually A,C - space - D,F
                        config = ['A', 'C', 'space', 'D', 'F'].map(c => c === 'space' ? 'space' : (rawSeats.find(s => s.endsWith(c)) ? c : 'space'));
                    } else {
                        // Usually A,B,C - space - D,E,F
                        config = ['A', 'B', 'C', 'space', 'D', 'E', 'F'].map(c => c === 'space' ? 'space' : (rawSeats.find(s => s.endsWith(c)) ? c : 'space'));
                    }
                    
                    return { row: rowNum, classId: group.id, config };
                });
            });

            setZones(grouped.filter(g => (g as any).rows.length > 0));

        } catch (error) {
            console.error('Error fetching seats:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen || !outboundFlight) return null;

    const handleToggleRoundTrip = (val: boolean) => {
        setIsRoundTrip(val);
        if (!val) {
            setActiveTab('outbound');
            setSelectedSeats(prev => ({ ...prev, return: [] }));
        }
    };

    // --- SEAT SELECTION LOGIC ---
    const toggleSeat = (seatId: string, classId: string) => {
        // Find seat data from API
        const seatObj = seatData.find(s => s.SoGhe === seatId);
        if (!seatObj || seatObj.TrangThaiGhe !== 'TRONG') return; // Prevent clicking occupied seats

        const priceAddition = parseFloat(seatObj.GiaPhuPhi || '0');
        const className = classId === 'business' ? 'Business' : classId === 'premium' ? 'Premium Economy' : 'Economy';

        const newSeat: Seat = {
            id: seatId, // '1A'
            classId,
            className,
            priceAddition
        };

        setSelectedSeats(prev => {
            const currentSeats = prev[activeTab];
            const isAlreadySelected = currentSeats.find(s => s.id === seatId);
            
            if (isAlreadySelected) {
                // Deselect
                return { ...prev, [activeTab]: currentSeats.filter(s => s.id !== seatId) };
            } else {
                // Select
                return { ...prev, [activeTab]: [...currentSeats, newSeat] };
            }
        });
    };

    // --- RENDER HELPERS ---
    const getSeatStyle = (seatId: string) => {
        if (selectedSeats[activeTab].some(s => s.id === seatId)) {
            return 'bg-green-500 text-white border-green-600 shadow-md scale-105 z-10'; // Xanh lá cây: đã chọn
        }
        
        const seatObj = seatData.find(s => s.SoGhe === seatId);
        if (seatObj && seatObj.TrangThaiGhe !== 'TRONG') {
            return 'bg-[#d1d5db] text-gray-500 border-gray-400 cursor-not-allowed opacity-70'; // Xám: người khác đặt
        }
        
        return 'bg-white text-gray-800 border-gray-300 hover:border-gray-400 hover:shadow-sm'; // Trắng: còn trống
    };

    // --- PRICING CALCULATION ---
    const outboundBasePrice = outboundFlight.price;
    const outboundTotal = selectedSeats.outbound.reduce((sum, seat) => sum + outboundBasePrice + seat.priceAddition, 0);

    const returnBasePrice = MOCK_RETURN_FLIGHT.basePrice;
    const returnTotal = isRoundTrip 
        ? selectedSeats.return.reduce((sum, seat) => sum + returnBasePrice + seat.priceAddition, 0)
        : 0;

    const grandTotal = outboundTotal + returnTotal;

    const canContinue = isRoundTrip 
        ? (selectedSeats.outbound.length > 0 && selectedSeats.return.length > 0)
        : selectedSeats.outbound.length > 0;

    const handleConfirmClick = () => {
        if (!canContinue) return;
        const finalData = {
            isRoundTrip,
            outbound: {
                flight: outboundFlight,
                seats: selectedSeats.outbound,
                totalPrice: outboundTotal
            },
            return: isRoundTrip ? {
                flight: MOCK_RETURN_FLIGHT,
                seats: selectedSeats.return,
                totalPrice: returnTotal
            } : null,
            grandTotal
        };
        onConfirm(finalData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="bg-[#f5f7fa] w-full max-w-[1100px] h-[90vh] rounded-2xl shadow-2xl flex overflow-hidden relative animate-fade-in-up">
                
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors shadow-sm"
                >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                </button>

                {/* LEFT COLUMN - 70% */}
                <div className="w-[70%] bg-white flex flex-col h-full relative border-r border-gray-200">
                    
                    {/* Header & Tabs */}
                    <div className="p-6 pb-0 border-b border-gray-200 shrink-0">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Seat Map</h2>

                        {isRoundTrip && (
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setActiveTab('outbound')}
                                    className={`pb-3 px-2 font-bold text-[15px] flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'outbound' ? 'border-travel-blue text-travel-blue' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                                >
                                    <span className="material-symbols-outlined text-[18px]">flight_takeoff</span>
                                    Outbound ({outboundFlight.from.split(' ')[0]} ➔ {outboundFlight.to.split(' ')[0]})
                                    {selectedSeats.outbound.length > 0 && <span className="bg-blue-100 text-travel-blue text-xs py-0.5 px-2 rounded-full ml-1">{selectedSeats.outbound.length}</span>}
                                </button>
                                <button 
                                    onClick={() => setActiveTab('return')}
                                    className={`pb-3 px-2 font-bold text-[15px] flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'return' ? 'border-travel-blue text-travel-blue' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                                >
                                    <span className="material-symbols-outlined text-[18px]">flight_land</span>
                                    Return ({outboundFlight.to.split(' ')[0]} ➔ {outboundFlight.from.split(' ')[0]})
                                    {selectedSeats.return.length > 0 && <span className="bg-blue-100 text-travel-blue text-xs py-0.5 px-2 rounded-full ml-1">{selectedSeats.return.length}</span>}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Scrollable Content Area - DIRECTLY SEATMAP */}
                    <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center custom-scrollbar bg-gray-50 relative">
                        
                        {isLoading ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                                <span className="material-symbols-outlined animate-spin text-4xl mb-4 text-travel-blue">progress_activity</span>
                                <p className="font-semibold">Loading seat map...</p>
                            </div>
                        ) : (
                            <>
                                {/* Legend */}
                                <div className="w-full max-w-[400px] flex justify-center gap-6 text-xs font-bold text-gray-600 mb-8 bg-white py-3 px-6 rounded-full shadow-sm border border-gray-100 sticky top-0 z-20">
                                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-md bg-white border border-gray-300"></div> Available</div>
                                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-md bg-green-500 border border-green-600"></div> Selected</div>
                                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-md bg-[#d1d5db] border border-gray-400"></div> Occupied</div>
                                </div>

                                {/* Aircraft Body */}
                                <div className="bg-white border border-gray-300 rounded-[80px] p-2 pb-16 relative w-[420px] shadow-sm">
                                    {/* Cockpit curve */}
                                    <div className="w-full h-[60px] rounded-t-[80px] border-b border-gray-200 opacity-50 mb-4 bg-gray-100 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-gray-300 text-3xl">flight</span>
                                    </div>
                                    
                                    <div className="flex flex-col gap-6 px-4">
                                        {zones.map((zone: any) => (
                                            <div key={zone.id} className={`${zone.bg} ${zone.borderColor} border-2 rounded-3xl p-6 relative`}>
                                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-sm border border-gray-200 whitespace-nowrap">
                                                    {zone.name}
                                                </div>
                                                
                                                <div className="flex flex-col gap-3 mt-2">
                                                    {zone.rows.map((rowData: any) => (
                                                        <div key={rowData.row} className="flex justify-center items-center gap-2 relative">
                                                            {/* Left side row number */}
                                                            <div className="w-6 text-[11px] text-gray-500 font-bold text-right absolute -left-7">{rowData.row}</div>
                                                            
                                                            {rowData.config.map((seatCol: string, idx: number) => {
                                                                if (seatCol === 'space') {
                                                                    return <div key={`space-${idx}`} className="w-8 flex justify-center items-center"><div className="w-px h-full bg-gray-200/50"></div></div>; // Aisle
                                                                }
                                                                const seatId = `${rowData.row}${seatCol}`;
                                                                return (
                                                                    <button
                                                                        key={seatId}
                                                                        onClick={() => toggleSeat(seatId, rowData.classId)}
                                                                        className={`w-11 h-11 rounded-[10px] flex items-center justify-center text-[13px] font-bold border transition-all duration-150 ${getSeatStyle(seatId)} relative group`}
                                                                    >
                                                                        {seatId}
                                                                    </button>
                                                                );
                                                            })}

                                                            {/* Right side row number */}
                                                            <div className="w-6 text-[11px] text-gray-500 font-bold text-left absolute -right-7">{rowData.row}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN - 30% */}
                <div className="w-[30%] bg-[#f5f7fa] p-6 flex flex-col h-full z-20">
                    
                    {/* Toggle Switch */}
                    <div className="bg-white rounded-lg p-1 flex mb-6 border border-gray-200 shadow-sm shrink-0">
                        <button 
                            onClick={() => handleToggleRoundTrip(false)}
                            className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${!isRoundTrip ? 'bg-travel-blue text-white shadow' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            One-way
                        </button>
                        <button 
                            onClick={() => handleToggleRoundTrip(true)}
                            className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${isRoundTrip ? 'bg-travel-blue text-white shadow' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            Round-trip
                        </button>
                    </div>

                    {/* Summary List */}
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        <h3 className="font-bold text-gray-800 mb-4 uppercase tracking-wider text-sm flex justify-between items-center">
                            Booking Summary
                        </h3>
                        
                        {/* Outbound Summary */}
                        <div className="bg-white rounded-xl p-4 shadow-sm mb-4 border border-gray-100">
                            <div className="flex justify-between items-center mb-3 border-b border-gray-100 pb-2">
                                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">OUTBOUND</span>
                                <span className="text-xs font-bold text-gray-500">{outboundFlight.airline}</span>
                            </div>
                            <div className="text-[14px] font-bold text-gray-900 mb-1">
                                {outboundFlight.from.split(' ')[0]} ➔ {outboundFlight.to.split(' ')[0]}
                            </div>
                            <div className="text-xs text-gray-500 mb-3">
                                {outboundFlight.departureTime} - {outboundFlight.arrivalTime}
                            </div>
                            
                            {/* Selected Seats for Outbound */}
                            {selectedSeats.outbound.length === 0 ? (
                                <div className="text-sm text-red-500 font-medium italic mt-2">No seats selected</div>
                            ) : (
                                <div className="mt-3 flex flex-col gap-2">
                                    {selectedSeats.outbound.map((s, idx) => (
                                        <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
                                            <div>
                                                <div className="text-sm font-bold text-gray-800">Seat {s.id}</div>
                                                <div className="text-[10px] uppercase font-bold text-gray-500">{s.className}</div>
                                            </div>
                                            <div className="text-sm font-semibold text-gray-700">
                                                {(outboundBasePrice + s.priceAddition).toLocaleString()} ₫
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Return Summary */}
                        {isRoundTrip && (
                            <div className="bg-white rounded-xl p-4 shadow-sm mb-4 border border-gray-100">
                                <div className="flex justify-between items-center mb-3 border-b border-gray-100 pb-2">
                                    <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded">RETURN</span>
                                    <span className="text-xs font-bold text-gray-500">{MOCK_RETURN_FLIGHT.airline}</span>
                                </div>
                                <div className="text-[14px] font-bold text-gray-900 mb-1">
                                    {MOCK_RETURN_FLIGHT.from.split(' ')[0]} ➔ {MOCK_RETURN_FLIGHT.to.split(' ')[0]}
                                </div>
                                <div className="text-xs text-gray-500 mb-3">
                                    {MOCK_RETURN_FLIGHT.departureTime} - {MOCK_RETURN_FLIGHT.arrivalTime}
                                </div>
                                
                                {/* Selected Seats for Return */}
                                {selectedSeats.return.length === 0 ? (
                                    <div className="text-sm text-red-500 font-medium italic mt-2">No seats selected</div>
                                ) : (
                                    <div className="mt-3 flex flex-col gap-2">
                                        {selectedSeats.return.map((s, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
                                                <div>
                                                    <div className="text-sm font-bold text-gray-800">Seat {s.id}</div>
                                                    <div className="text-[10px] uppercase font-bold text-gray-500">{s.className}</div>
                                                </div>
                                                <div className="text-sm font-semibold text-gray-700">
                                                    {(returnBasePrice + s.priceAddition).toLocaleString()} ₫
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Bottom Action */}
                    <div className="pt-4 border-t border-gray-200 mt-4 shrink-0 bg-[#f5f7fa]">
                        <div className="flex flex-col mb-4">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Amount</span>
                            <span className="text-[28px] leading-none font-black text-travel-blue">{grandTotal.toLocaleString()} <span className="text-lg">VND</span></span>
                        </div>
                        <button 
                            onClick={handleConfirmClick}
                            disabled={!canContinue}
                            className={`w-full font-bold py-4 rounded-xl transition-all shadow-md flex justify-center items-center gap-2 ${
                                canContinue 
                                ? 'bg-travel-blue hover:bg-blue-700 text-white hover:shadow-lg hover:-translate-y-0.5' 
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            {canContinue ? 'Continue to Payment' : 'Select Seats to Continue'}
                            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                        </button>
                    </div>

                </div>

            </div>
            
            <style>{`
                .animate-fade-in-up {
                    animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
        </div>
    );
};

export default FlightSelectionModal;
