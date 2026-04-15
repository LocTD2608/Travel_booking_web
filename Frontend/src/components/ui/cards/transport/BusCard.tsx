import React from 'react';

export interface BusCardProps {
    id: string;
    operator: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    from: string;
    to: string;
    price: number;
    type: string;
}

export const BusCard: React.FC<{ bus: BusCardProps; onSelect?: () => void }> = ({ bus, onSelect }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden cursor-pointer" onClick={onSelect}>
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
                <button className="bg-[#FF5E1F] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#E64B0E] transition-colors hover-scale w-full shadow-sm" onClick={onSelect ? (e) => { e.stopPropagation(); onSelect(); } : undefined}>
                    Select
                </button>
            </div>
        </div>
    </div>
);
