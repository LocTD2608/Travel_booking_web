import React from 'react';

export interface TrainCardProps {
    id: string;
    operator: string;
    trainNumber: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    from: string;
    to: string;
    price: number;
    originalPrice: number | null;
    type: string;
    class: string;
}

export const TrainCard: React.FC<{ train: TrainCardProps }> = ({ train }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1e40af]"></div>
        <div className="flex justify-between items-center mb-4 pl-2">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex justify-center items-center font-bold text-white shadow-sm bg-[#1e40af]">
                    VR
                </div>
                <div>
                    <h3 className="font-bold text-gray-900">{train.operator}</h3>
                    <div className="text-xs text-gray-500">Train {train.trainNumber}</div>
                </div>
            </div>
            <span className="bg-[#EBF3FF] text-travel-blue font-bold px-2 py-0.5 rounded text-xs">
                {train.class}
            </span>
        </div>
        <div className="flex justify-between items-center pl-2">
            <div className="flex items-center gap-6 flex-1 pr-6">
                <div className="text-right">
                    <div className="text-2xl font-black text-gray-900">{train.departureTime}</div>
                    <div className="text-sm font-semibold text-gray-500">{train.from}</div>
                </div>
                <div className="flex-1 flex flex-col items-center px-4 relative">
                    <div className="text-xs text-gray-400 font-semibold mb-1">{train.duration}</div>
                    <div className="w-full flex items-center justify-center relative">
                        <div className="w-2 h-2 rounded-full border-2 border-gray-300 bg-white z-10"></div>
                        <div className="h-[2px] bg-gray-200 flex-1 relative"></div>
                        <div className="w-2 h-2 rounded-full border-2 border-gray-300 bg-white z-10 text-travel-blue">
                            <span className="material-symbols-outlined text-[16px] absolute -top-5 left-1/2 -ml-2 bg-white px-1 text-gray-400">train</span>
                        </div>
                    </div>
                </div>
                <div className="text-left">
                    <div className="text-2xl font-black text-gray-900">{train.arrivalTime}</div>
                    <div className="text-sm font-semibold text-gray-500">{train.to}</div>
                </div>
            </div>
            <div className="text-right border-l border-gray-100 pl-6 min-w-[200px]">
                {train.originalPrice && (
                    <div className="text-xs text-gray-400 line-through mb-0.5">
                        {train.originalPrice.toLocaleString()} VNĐ
                    </div>
                )}
                <div className="text-2xl font-black text-[#FF5E1F] mb-3 leading-none">
                    {train.price.toLocaleString()} <span className="text-sm font-semibold text-gray-500">VNĐ</span>
                </div>
                <button className="bg-[#FF5E1F] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#E64B0E] transition-colors hover-scale w-full shadow-sm">
                    Select Waitlist
                </button>
            </div>
        </div>
    </div>
);
