import React from 'react';

export interface FlightCardProps {
    id: string;
    airline: string;
    airlineLogo: string;
    flightNumber: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    from: string;
    to: string;
    price: number;
    originalPrice: number | null;
    type: string;
    class: string;
    baggage: string;
}

export const FlightCard: React.FC<{ flight: FlightCardProps; onSelect?: () => void }> = ({ flight, onSelect }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden cursor-pointer" onClick={onSelect}>
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
                    <div className="h-5"></div>
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
                <button className="bg-[#FF5E1F] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#E64B0E] transition-colors hover-scale w-full shadow-sm" onClick={onSelect ? (e) => { e.stopPropagation(); onSelect(); } : undefined}>
                    Select
                </button>
            </div>
        </div>
    </div>
);
