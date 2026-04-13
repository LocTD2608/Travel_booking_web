import React from 'react';

export interface VillaCardProps {
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

export const VillaCard: React.FC<{ villa: VillaCardProps }> = ({ villa }) => (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex shadow-sm hover:shadow-md transition-shadow">
        <div className="relative w-1/3 min-w-[280px] h-60">
            <img src={villa.image} alt={villa.name} className="w-full h-full object-cover" />
            {villa.badge && (
                <div className="absolute top-3 left-3 bg-white text-xs font-bold px-2 py-1 rounded shadow-sm text-green-600">
                    {villa.badge}
                </div>
            )}
        </div>
        <div className="flex-1 p-5 flex flex-col justify-between">
            <div>
                <div className="flex gap-1 mb-1">
                    {Array.from({ length: villa.stars }).map((_, i) => (
                        <span key={i} className="material-symbols-outlined text-yellow-500 text-[18px]">star</span>
                    ))}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{villa.name}</h3>
                <div className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    {villa.location}
                </div>
                <div className="flex items-center gap-2">
                    <span className="bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded text-sm">
                        {villa.rating.toFixed(1)}
                    </span>
                    <span className="text-green-700 font-semibold text-sm">{villa.ratingText}</span>
                    <span className="text-gray-400 text-sm">({villa.reviews} reviews)</span>
                </div>
            </div>
            <div className="flex justify-between items-end mt-4">
                <div className="flex flex-wrap gap-3">
                    {villa.facilities.map(fac => (
                        <div key={fac} className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                            <span className="material-symbols-outlined text-[14px]">check_circle</span>
                            {fac}
                        </div>
                    ))}
                </div>
                <div className="text-right">
                    {villa.originalPrice && (
                        <div className="text-xs text-gray-400 line-through mb-0.5 mt-2">
                            {villa.originalPrice.toLocaleString()} VNĐ
                        </div>
                    )}
                    <div className="text-2xl font-black text-gray-900 mb-0">
                        {villa.price.toLocaleString()} <span className="text-sm font-semibold text-gray-500">VNĐ</span>
                    </div>
                    <div className="text-xs text-gray-400 mb-3">/ night / entire villa</div>
                    <button className="bg-travel-blue text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors hover-scale">
                        Book Villa
                    </button>
                </div>
            </div>
        </div>
    </div>
);
