import React, { useState, useEffect } from 'react';
import { type FlightCardProps } from '../cards/transport/FlightCard';
import { fetchFlightSeats } from '../../../services/searchApi';
import { useLanguage } from '../../../context';

interface FlightSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (selectedData: any) => void;
    outboundFlight: FlightCardProps | null;
    passengerCount?: number;
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

const FlightSelectionModal: React.FC<FlightSelectionModalProps> = ({ isOpen, onClose, onConfirm, outboundFlight, passengerCount = 1 }) => {
    const { t } = useLanguage();
    const [isRoundTrip, setIsRoundTrip] = useState(false);
    const [activeTab, setActiveTab] = useState<'outbound' | 'return'>('outbound');
    const [selectionMode, setSelectionMode] = useState<'ask' | 'choose' | 'auto'>('ask');
    
    // State for Seats from API
    const [seatData, setSeatData] = useState<any[]>([]);
    const [zones, setZones] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            setSelectionMode('ask');
            loadSeats(outboundFlight.id.toString());
        }
    }, [isOpen, outboundFlight]);

    const loadSeats = async (flightId: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetchFlightSeats(flightId);
            const rawSeats = res.data || [];
            
            // Synthesize a full cabin seat layout for rows 1 to 10 to make it look like a real plane
            const generatedSeats: any[] = [];
            
            for (let row = 1; row <= 10; row++) {
                let seatClass = 'eco';
                let priceAddition = 0;
                let cols = ['A', 'B', 'C', 'D', 'E', 'F'];
                
                if (row <= 2) {
                    seatClass = 'business';
                    priceAddition = 500000;
                    cols = ['A', 'C', 'D', 'F'];
                } else if (row <= 4) {
                    seatClass = 'premium';
                    priceAddition = 200000;
                    cols = ['A', 'B', 'C', 'D', 'E', 'F'];
                } else {
                    seatClass = 'eco';
                    priceAddition = 0;
                    cols = ['A', 'B', 'C', 'D', 'E', 'F'];
                }
                
                // Check if DB has any seat status for column A of this row
                const dbSeatA = rawSeats.find((s: any) => {
                    const match = s.SoGhe.match(/^([A-Z])(\d+)$/);
                    return match && parseInt(match[2]) === row;
                });
                
                const rowAIsOccupied = dbSeatA && dbSeatA.TrangThaiGhe !== 'TRONG';
                
                cols.forEach(col => {
                    const seatId = `${row}${col}`;
                    
                    // Determine occupied status
                    let status = 'TRONG';
                    if (col === 'A') {
                        status = rowAIsOccupied ? 'DA_DAT' : 'TRONG';
                    } else {
                        // Pseudo-random occupancy based on row, column code, and flightId
                        const hash = (row * 7 + col.charCodeAt(0) * 13 + parseInt(flightId || '0') * 3) % 100;
                        status = hash < 40 ? 'DA_DAT' : 'TRONG'; // ~40% seats occupied
                    }
                    
                    generatedSeats.push({
                        id: seatId,
                        SoGhe: seatId,
                        HangGhe: seatClass,
                        GiaPhuPhi: priceAddition,
                        TrangThaiGhe: status
                    });
                });
            }

            setSeatData(generatedSeats);
            
            // Build groups (business, premium, eco)
            const grouped = [
                { id: 'business', name: t('flight.class.business', 'Business Class'), bg: 'bg-[#FDF7E3]', borderColor: 'border-[#F4D03F]', items: [] as any[] },
                { id: 'premium', name: t('flight.class.premium', 'Premium Economy'), bg: 'bg-[#EAF2F8]', borderColor: 'border-[#5DADE2]', items: [] as any[] },
                { id: 'eco', name: t('flight.class.economy', 'Economy Class'), bg: 'bg-[#F2F4F4]', borderColor: 'border-[#BDC3C7]', items: [] as any[] }
            ];

            generatedSeats.forEach((seat: any) => {
                const classId = seat.HangGhe ? seat.HangGhe.toLowerCase().trim() : '';
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
                    const rawSeats = rowMap[rowNum].sort();
                    let config: string[] = [];
                    
                    if (group.id === 'business') {
                        config = ['A', 'C', 'space', 'D', 'F'].map(c => 
                            c === 'space' ? 'space' : (rawSeats.find(s => s.endsWith(c)) ? c : 'space')
                        );
                    } else {
                        config = ['A', 'B', 'C', 'space', 'D', 'E', 'F'].map(c => 
                            c === 'space' ? 'space' : (rawSeats.find(s => s.endsWith(c)) ? c : 'space')
                        );
                    }
                    
                    return { row: rowNum, classId: group.id, config };
                });
            });

            setZones(grouped.filter(g => (g as any).rows.length > 0));

        } catch (err: any) {
            console.error('Error fetching seats:', err);
            setError(err.message || 'Không thể tải sơ đồ ghế lúc này. Vui lòng đăng nhập lại hoặc thử lại sau.');
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
        } else {
            if (selectionMode === 'auto') {
                setSelectedSeats(prev => ({
                    ...prev,
                    return: prev.outbound
                }));
            }
        }
    };

    const handleSelectAutoAssign = () => {
        setSelectionMode('auto');
        
        // Find available seats in Eco class
        const availableEco = seatData.filter(s => s.HangGhe === 'eco' && s.TrangThaiGhe === 'TRONG');
        
        // If not enough eco seats, just take any available seats
        const pool = availableEco.length >= passengerCount 
            ? availableEco 
            : seatData.filter(s => s.TrangThaiGhe === 'TRONG');
            
        // Select the first passengerCount seats
        const assigned: Seat[] = pool.slice(0, passengerCount).map(s => ({
            id: s.SoGhe,
            classId: s.HangGhe,
            className: s.HangGhe === 'business' ? t('flight.class.business', 'Business Class') : s.HangGhe === 'premium' ? t('flight.class.premium', 'Premium Economy') : t('flight.class.economy', 'Economy Class'),
            priceAddition: 0
        }));
        
        setSelectedSeats({
            outbound: assigned,
            return: isRoundTrip ? assigned : []
        });
    };

    // --- SEAT SELECTION LOGIC ---
    const toggleSeat = (seatId: string, classId: string) => {
        // Find seat data from API
        const seatObj = seatData.find(s => s.SoGhe === seatId);
        if (!seatObj || seatObj.TrangThaiGhe !== 'TRONG') return; // Prevent clicking occupied seats

        const currentSeats = selectedSeats[activeTab];
        const isAlreadySelected = currentSeats.some(s => s.id === seatId);

        if (!isAlreadySelected && currentSeats.length >= passengerCount) {
            alert(t('flight.alreadySelectedMax', 'Bạn đã chọn đủ số lượng ghế cho {count} hành khách.').replace('{count}', String(passengerCount)));
            return;
        }

        const priceAddition = parseFloat(seatObj.GiaPhuPhi || '0');
        const className = classId === 'business' ? t('flight.class.business', 'Business Class') : classId === 'premium' ? t('flight.class.premium', 'Premium Economy') : t('flight.class.economy', 'Economy Class');

        const newSeat: Seat = {
            id: seatId, // '1A'
            classId,
            className,
            priceAddition
        };

        setSelectedSeats(prev => {
            const current = prev[activeTab];
            const isSel = current.some(s => s.id === seatId);
            if (isSel) {
                // Deselect
                return { ...prev, [activeTab]: current.filter(s => s.id !== seatId) };
            } else {
                // Select
                return { ...prev, [activeTab]: [...current, newSeat] };
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
    const pCount = passengerCount;
    const outboundBasePrice = outboundFlight.price;
    const outboundBase = pCount * outboundBasePrice;
    const outboundSurcharges = selectionMode === 'auto' 
        ? 0 
        : selectedSeats.outbound.reduce((sum, seat) => sum + seat.priceAddition, 0);
    const outboundTotal = outboundBase + outboundSurcharges;

    const returnBasePrice = MOCK_RETURN_FLIGHT.basePrice;
    const returnBase = isRoundTrip ? (pCount * returnBasePrice) : 0;
    const returnSurcharges = (isRoundTrip && selectionMode !== 'auto')
        ? selectedSeats.return.reduce((sum, seat) => sum + seat.priceAddition, 0)
        : 0;
    const returnTotal = returnBase + returnSurcharges;

    const grandTotal = outboundTotal + returnTotal;

    const canContinue = selectionMode === 'auto' 
        ? true 
        : (isRoundTrip 
            ? (selectedSeats.outbound.length === pCount && selectedSeats.return.length === pCount)
            : selectedSeats.outbound.length === pCount);

    const handleConfirmClick = () => {
        if (!canContinue) return;
        const finalData = {
            isRoundTrip,
            isAutoAssigned: selectionMode === 'auto',
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
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('flight.seatMap', 'Seat Map')}</h2>

                        {isRoundTrip && selectionMode === 'choose' && (
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setActiveTab('outbound')}
                                    className={`pb-3 px-2 font-bold text-[15px] flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'outbound' ? 'border-travel-blue text-travel-blue' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                                >
                                    <span className="material-symbols-outlined text-[18px]">flight_takeoff</span>
                                    {t('flight.outbound', 'Outbound')} ({outboundFlight.from.split(' ')[0]} ➔ {outboundFlight.to.split(' ')[0]})
                                    {selectedSeats.outbound.length > 0 && <span className="bg-blue-100 text-travel-blue text-xs py-0.5 px-2 rounded-full ml-1">{selectedSeats.outbound.length}</span>}
                                </button>
                                <button 
                                    onClick={() => setActiveTab('return')}
                                    className={`pb-3 px-2 font-bold text-[15px] flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'return' ? 'border-travel-blue text-travel-blue' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                                >
                                    <span className="material-symbols-outlined text-[18px]">flight_land</span>
                                    {t('flight.return', 'Return')} ({outboundFlight.to.split(' ')[0]} ➔ {outboundFlight.from.split(' ')[0]})
                                    {selectedSeats.return.length > 0 && <span className="bg-blue-100 text-travel-blue text-xs py-0.5 px-2 rounded-full ml-1">{selectedSeats.return.length}</span>}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center custom-scrollbar bg-gray-50 relative">
                        
                        {selectionMode === 'ask' && (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-2xl mx-auto">
                                <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">{t('flight.selectMethod', 'Seat Selection Method')}</h3>
                                <p className="text-sm text-gray-500 mb-8 text-center">
                                    {t('flight.selectMethodDesc', 'Please select seat selection method for passenger(s).').replace('hành khách', `${passengerCount} hành khách`).replace('passenger(s)', `${passengerCount} passenger(s)`)}
                                </p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-4">
                                    {/* Option A: Select seats yourself */}
                                    <button 
                                        type="button"
                                        onClick={() => setSelectionMode('choose')}
                                        className="flex flex-col items-center p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-travel-blue hover:shadow-lg transition-all text-center focus:outline-none cursor-pointer"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                                            <span className="material-symbols-outlined text-[28px] text-travel-blue">airline_seat_recline_extra</span>
                                        </div>
                                        <span className="text-lg font-bold text-gray-800 mb-2">{t('flight.chooseSelf', 'Tự chọn ghế ngồi')}</span>
                                        <span className="text-xs text-gray-500 leading-relaxed">
                                            {t('flight.chooseSelfDesc', 'Choose preferred seats (window, aisle or front rows). Additional fee applies depending on seat type.')}
                                        </span>
                                    </button>

                                    {/* Option B: Airline auto-assigns */}
                                    <button 
                                        type="button"
                                        onClick={handleSelectAutoAssign}
                                        className="flex flex-col items-center p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-green-500 hover:shadow-lg transition-all text-center focus:outline-none cursor-pointer"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-4">
                                            <span className="material-symbols-outlined text-[28px] text-green-500">casino</span>
                                        </div>
                                        <span className="text-lg font-bold text-gray-800 mb-2">{t('flight.autoAssign', 'Hãng bay tự xếp chỗ')}</span>
                                        <span className="text-xs text-gray-500 leading-relaxed">
                                            {t('flight.autoAssignDesc', 'The airline will automatically assign random empty seats during check-in. Completely free.')}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {selectionMode === 'auto' && (
                            <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto p-6">
                                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
                                    <span className="material-symbols-outlined text-green-600 text-4xl">check_circle</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-850 mb-2">{t('flight.autoSuccess', 'Đã tự động gán ghế thành công')}</h3>
                                <div className="bg-white border border-gray-200 rounded-xl p-4 w-full mb-6 text-left shadow-sm">
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('flight.yourSeats', 'Ghế ngồi của bạn')}</div>
                                    <div className="flex flex-col gap-1.5">
                                        <div className="text-sm font-bold text-gray-850 flex justify-between">
                                            <span>{t('flight.outbound', 'Chiều đi')}:</span>
                                            <span className="text-travel-blue font-mono bg-blue-50 px-2 py-0.5 rounded">{selectedSeats.outbound.map(s => s.id).join(', ')}</span>
                                        </div>
                                        {isRoundTrip && (
                                            <div className="text-sm font-bold text-gray-850 flex justify-between">
                                                <span>{t('flight.return', 'Chiều về')}:</span>
                                                <span className="text-purple-600 font-mono bg-purple-50 px-2 py-0.5 rounded">{selectedSeats.return.map(s => s.id).join(', ')}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                                    {t('flight.freeAutoNote', 'Lựa chọn tự động xếp chỗ này hoàn toàn miễn phí và không làm phát sinh thêm phụ phí ghế ngồi.')}
                                </p>
                                <button 
                                    onClick={() => {
                                        setSelectionMode('choose');
                                        setSelectedSeats({ outbound: [], return: [] });
                                    }}
                                    className="text-travel-blue hover:text-blue-700 font-bold text-sm flex items-center gap-1.5 transition-colors border border-travel-blue/30 px-4 py-2 rounded-xl bg-white hover:bg-blue-50"
                                >
                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                    {t('flight.changeToSelf', 'Thay đổi sang tự chọn ghế ngồi')}
                                </button>
                            </div>
                        )}

                        {selectionMode === 'choose' && (
                            <>
                                <button
                                    onClick={() => {
                                        setSelectionMode('ask');
                                        setSelectedSeats({ outbound: [], return: [] });
                                    }}
                                    className="mb-6 mr-auto flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                                    {t('flight.goBack', 'Quay lại chọn phương thức khác')}
                                </button>

                                {error ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm text-gray-500 px-4 my-10">
                                        <span className="material-symbols-outlined text-red-500 text-5xl mb-4">error</span>
                                        <p className="font-bold text-gray-800 text-lg mb-2">{t('flight.cannotLoad', 'Không thể tải sơ đồ ghế')}</p>
                                        <p className="text-sm text-gray-500 mb-6">{error}</p>
                                        <button
                                            onClick={() => loadSeats(outboundFlight?.id?.toString() || '')}
                                            className="bg-travel-blue hover:bg-blue-600 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-all duration-150"
                                        >
                                            {t('flight.tryAgain', 'Thử lại')}
                                        </button>
                                    </div>
                                ) : isLoading ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                                        <span className="material-symbols-outlined animate-spin text-4xl mb-4 text-travel-blue">progress_activity</span>
                                        <p className="font-semibold">{t('flight.loadingSeats', 'Loading seat map...')}</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Legend */}
                                        <div className="w-full max-w-[400px] flex justify-center gap-6 text-xs font-bold text-gray-600 mb-8 bg-white py-3 px-6 rounded-full shadow-sm border border-gray-100 sticky top-0 z-20">
                                            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-md bg-white border border-gray-300"></div> {t('flight.available', 'Available')}</div>
                                            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-md bg-green-500 border border-green-600"></div> {t('flight.selected', 'Selected')}</div>
                                            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-md bg-[#d1d5db] border border-gray-400"></div> {t('flight.occupied', 'Occupied')}</div>
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
                                                                                className={`w-11 h-11 rounded-[10px] flex items-center justify-center text-[13px] font-bold border transition-all duration-150 ${getSeatStyle(seatId)} relative group cursor-pointer`}
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
                            {t('flight.oneWay', 'One-way')}
                        </button>
                        <button 
                            onClick={() => handleToggleRoundTrip(true)}
                            className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${isRoundTrip ? 'bg-travel-blue text-white shadow' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            {t('flight.roundTrip', 'Round-trip')}
                        </button>
                    </div>

                    {/* Summary List */}
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        <h3 className="font-bold text-gray-800 mb-4 tracking-wider text-sm flex justify-between items-center">
                            {t('flight.detailTitle', 'Chi tiết đặt chỗ')}
                        </h3>
                        
                        {/* Outbound Summary */}
                        <div className="bg-white rounded-xl p-4 shadow-sm mb-4 border border-gray-100">
                            <div className="flex justify-between items-center mb-3 border-b border-gray-100 pb-2">
                                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{t('flight.outbound', 'OUTBOUND').toUpperCase()}</span>
                                <span className="text-xs font-bold text-gray-500">{outboundFlight.airline}</span>
                            </div>
                            <div className="text-[14px] font-bold text-gray-900 mb-1">
                                {outboundFlight.from.split(' ')[0]} ➔ {outboundFlight.to.split(' ')[0]}
                            </div>
                            <div className="text-xs text-gray-500 mb-3">
                                {outboundFlight.departureTime} - {outboundFlight.arrivalTime}
                            </div>
                            
                            {/* Selected Seats for Outbound */}
                            {selectionMode === 'auto' ? (
                                <div className="text-xs font-bold text-green-600 bg-green-50 p-2.5 rounded-lg border border-green-100 flex flex-col gap-1">
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[16px]">shuffle</span>
                                        {t('flight.autoFreeTag', 'Ghế tự sắp xếp (Miễn phí)')}
                                    </div>
                                    <div className="text-gray-500 font-semibold mt-1">
                                        {t('flight.seat', 'Ghế')}: {selectedSeats.outbound.map(s => s.id).join(', ')}
                                    </div>
                                </div>
                            ) : selectedSeats.outbound.length === 0 ? (
                                <div className="text-sm text-red-500 font-medium italic mt-2">{t('flight.noSeatSelected', 'Chưa chọn ghế')}</div>
                            ) : (
                                <div className="mt-3 flex flex-col gap-2">
                                    {selectedSeats.outbound.map((s, idx) => (
                                        <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
                                            <div>
                                                <div className="text-sm font-bold text-gray-800">{t('flight.seat', 'Ghế')} {s.id}</div>
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
                                    <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded">{t('flight.return', 'RETURN').toUpperCase()}</span>
                                    <span className="text-xs font-bold text-gray-500">{MOCK_RETURN_FLIGHT.airline}</span>
                                </div>
                                <div className="text-[14px] font-bold text-gray-900 mb-1">
                                    {MOCK_RETURN_FLIGHT.from.split(' ')[0]} ➔ {MOCK_RETURN_FLIGHT.to.split(' ')[0]}
                                </div>
                                <div className="text-xs text-gray-500 mb-3">
                                    {MOCK_RETURN_FLIGHT.departureTime} - {MOCK_RETURN_FLIGHT.arrivalTime}
                                </div>
                                
                                {/* Selected Seats for Return */}
                                {selectionMode === 'auto' ? (
                                    <div className="text-xs font-bold text-green-600 bg-green-50 p-2.5 rounded-lg border border-green-100 flex flex-col gap-1">
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[16px]">shuffle</span>
                                            {t('flight.autoFreeTag', 'Ghế tự sắp xếp (Miễn phí)')}
                                        </div>
                                        <div className="text-gray-500 font-semibold mt-1">
                                            {t('flight.seat', 'Ghế')}: {selectedSeats.return.map(s => s.id).join(', ')}
                                        </div>
                                    </div>
                                ) : selectedSeats.return.length === 0 ? (
                                    <div className="text-sm text-red-500 font-medium italic mt-2">{t('flight.noSeatSelected', 'Chưa chọn ghế')}</div>
                                ) : (
                                    <div className="mt-3 flex flex-col gap-2">
                                        {selectedSeats.return.map((s, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
                                                <div>
                                                    <div className="text-sm font-bold text-gray-800">{t('flight.seat', 'Ghế')} {s.id}</div>
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
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t('flight.totalPriceLabel', 'Tổng tiền thanh toán')}</span>
                            <span className="text-[28px] leading-none font-black text-travel-blue">{grandTotal.toLocaleString()} <span className="text-lg">VND</span></span>
                        </div>
                        
                        {selectionMode === 'ask' ? (
                            <div className="flex flex-col gap-2">
                                <div className="text-center text-xs font-semibold text-gray-400 py-3.5 bg-gray-100 border border-gray-200 rounded-xl mb-1">
                                    {t('flight.selectSeatsLeft', 'Vui lòng chọn phương thức xếp chỗ bên trái')}
                                </div>
                                <button 
                                    type="button"
                                    onClick={onClose}
                                    className="w-full font-bold py-3.5 rounded-xl border border-gray-300 text-gray-600 bg-white hover:bg-gray-50 transition-all flex justify-center items-center gap-2 cursor-pointer shadow-sm text-sm"
                                >
                                    <span className="material-symbols-outlined text-[18px]">close</span>
                                    {t('flight.exit', 'Thoát')}
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-3">
                                <button 
                                    type="button"
                                    onClick={() => {
                                        setSelectionMode('ask');
                                        setSelectedSeats({ outbound: [], return: [] });
                                    }}
                                    className="flex-1 font-bold py-4 rounded-xl border border-gray-300 text-gray-600 bg-white hover:bg-gray-50 transition-all flex justify-center items-center gap-2 cursor-pointer shadow-sm text-sm"
                                >
                                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                                    {t('flight.back', 'Quay lại')}
                                </button>
                                <button 
                                    type="button"
                                    onClick={handleConfirmClick}
                                    disabled={!canContinue}
                                    className={`flex-[2] font-bold py-4 rounded-xl transition-all shadow-md flex justify-center items-center gap-2 cursor-pointer text-sm ${
                                        canContinue 
                                        ? 'bg-travel-blue hover:bg-blue-700 text-white hover:shadow-lg hover:-translate-y-0.5' 
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    {selectionMode === 'auto' 
                                        ? t('flight.continue', 'Tiếp tục') 
                                        : (canContinue 
                                            ? t('flight.confirm', 'Xác nhận') 
                                            : (t('flight.selectCountSeats', 'Select seats') === 'Chọn ghế' ? `Chọn ${passengerCount} ghế` : `Select ${passengerCount} seats`)
                                        )
                                    }
                                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                </button>
                            </div>
                        )}
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
