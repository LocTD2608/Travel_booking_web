import React from 'react';

export interface ApartmentCardProps {
    id: string;
    name: string;
    location: string;
    rating: number;
    ratingText: string;
    reviews: number;
    price: number;
    originalPrice: number | null;
    badge: string;
    image: string;
    facilities: string[];
    stars: number;
}

export const ApartmentCard: React.FC<{ apartment: ApartmentCardProps; onClick?: () => void }> = ({ apartment, onClick }) => (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
        <div className="relative w-1/3 min-w-[280px] h-60">
            <img src={apartment.image} alt={apartment.name} className="w-full h-full object-cover" />
            {apartment.badge && (
                <div className="absolute top-3 left-3 bg-white text-xs font-bold px-2 py-1 rounded shadow-sm text-purple-600">
                    {apartment.badge}
                </div>
            )}
        </div>
        <div className="flex-1 p-5 flex flex-col justify-between">
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{apartment.name}</h3>
                <div className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    {apartment.location}
                </div>
                <div className="flex items-center gap-2">
                    <span className="bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded text-sm">
                        {apartment.rating.toFixed(1)}
                    </span>
                    <span className="text-purple-700 font-semibold text-sm">{apartment.ratingText}</span>
                    <span className="text-gray-400 text-sm">({apartment.reviews} reviews)</span>
                </div>
            </div>
            <div className="flex justify-between items-end mt-4">
                <div className="flex flex-wrap gap-2">
                    {apartment.facilities.map(fac => (
                        <div key={fac} className="text-xs text-gray-500 bg-gray-50 border border-gray-200 px-2 py-1 rounded-full">
                            {fac}
                        </div>
                    ))}
                </div>
                <div className="text-right">
                    {apartment.originalPrice && (
                        <div className="text-xs text-gray-400 line-through mb-0.5 mt-2">
                            {apartment.originalPrice.toLocaleString()} VNĐ
                        </div>
                    )}
                    <div className="text-2xl font-black text-gray-900 mb-0">
                        {apartment.price.toLocaleString()} <span className="text-sm font-semibold text-gray-500">VNĐ</span>
                    </div>
                    <div className="text-xs text-gray-400 mb-3">/ night</div>
                    <button className="bg-travel-blue text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors hover-scale" onClick={onClick ? (e) => { e.stopPropagation(); onClick(); } : undefined}>
                        Select Room
                    </button>
                </div>
            </div>
        </div>
    </div>
);
