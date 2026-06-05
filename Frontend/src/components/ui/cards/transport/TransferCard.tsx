import React from 'react';

export interface TransferCardProps {
    id: string;
    provider: string;
    carName: string;
    seats: number;
    baggage: number;
    from: string;
    to: string;
    price: number;
    originalPrice: number | null;
    image: string;
    badge: string;
}

export const TransferCard: React.FC<{ transfer: TransferCardProps }> = ({ transfer }) => (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex shadow-sm hover:shadow-md transition-shadow">
        <div className="relative w-1/3 min-w-[240px] max-w-[280px] h-48">
            <img src={transfer.image} alt={transfer.carName} className="w-full h-full object-cover" />
            {transfer.badge && (
                <div className="absolute top-3 left-3 bg-white text-xs font-bold px-2 py-1 rounded shadow-sm text-yellow-600">
                    {transfer.badge}
                </div>
            )}
        </div>
        <div className="flex-1 p-5 flex flex-col justify-between">
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{transfer.carName}</h3>
                <div className="text-sm text-gray-500 mb-3">{transfer.provider}</div>
                <div className="flex items-center gap-4 text-sm font-medium text-gray-600">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">person</span> {transfer.seats} Seats</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">work</span> {transfer.baggage} Bags</span>
                </div>
            </div>
            <div className="flex justify-between items-end mt-4">
                <div className="text-sm text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded">
                    Free Cancellation
                </div>
                <div className="text-right">
                    {transfer.originalPrice && (
                        <div className="text-xs text-gray-400 line-through mb-0.5 mt-2">
                            {transfer.originalPrice.toLocaleString()} VNĐ
                        </div>
                    )}
                    <div className="text-2xl font-black text-gray-900 mb-0">
                        {transfer.price.toLocaleString()} <span className="text-sm font-semibold text-gray-500">VNĐ</span>
                    </div>
                    <button className="bg-travel-blue text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors hover-scale mt-3">
                        Book Transfer
                    </button>
                </div>
            </div>
        </div>
    </div>
);
