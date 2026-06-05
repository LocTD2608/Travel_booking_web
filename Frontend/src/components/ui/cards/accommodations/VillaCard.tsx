import React from 'react';
import { useLanguage } from '../../../../context';

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

export const VillaCard: React.FC<{ villa: VillaCardProps; onClick?: () => void }> = ({ villa, onClick }) => {
    const { t, translateRating } = useLanguage();
    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
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
                        <span className="text-green-700 font-semibold text-sm">{translateRating(villa.ratingText)}</span>
                        <span className="text-gray-400 text-sm">({villa.reviews} {t('search.reviewsCount', 'reviews')})</span>
                    </div>
                </div>
                <div className="flex justify-between items-end mt-4 gap-8">
                    <div className="flex flex-wrap gap-3">
                        {villa.facilities.map(fac => {
                            let icon = 'check_circle';
                            const text = fac.toLowerCase();
                            if (text.includes('pool')) icon = 'pool';
                            if (text.includes('wifi')) icon = 'wifi';
                            if (text.includes('gym')) icon = 'fitness_center';
                            if (text.includes('bar')) icon = 'local_bar';
                            if (text.includes('beach')) icon = 'beach_access';
                            if (text.includes('spa')) icon = 'spa';
                            if (text.includes('restaurant')) icon = 'restaurant';
                            if (text.includes('kitchen')) icon = 'countertops';
                            if (text.includes('wash')) icon = 'local_laundry_service';
                            if (text.includes('bbq')) icon = 'outdoor_grill';
                            if (text.includes('fireplace')) icon = 'fireplace';
                            if (text.includes('view')) icon = 'visibility';
                            if (text.includes('bedroom')) icon = 'bed';

                            const translateFacility = (facilityName: string) => {
                                const text = facilityName.toLowerCase();
                                if (text.includes('private pool')) return t('facility.privatePool', 'Private Pool');
                                if (text.includes('pool')) return t('facility.pool', 'Pool');
                                if (text.includes('wifi')) return t('facility.wifi', 'WiFi');
                                if (text.includes('gym')) return t('facility.gym', 'Gym');
                                if (text.includes('bar')) return t('facility.bar', 'Bar');
                                if (text.includes('beach')) return t('facility.beach', 'Beach Access');
                                if (text.includes('spa')) return t('facility.spa', 'Spa');
                                if (text.includes('restaurant')) return t('facility.restaurant', 'Restaurant');
                                if (text.includes('kitchen')) return t('facility.kitchen', 'Kitchen');
                                if (text.includes('wash')) return t('facility.washer', 'Washing Machine');
                                if (text.includes('city view')) return t('facility.cityView', 'City View');
                                if (text.includes('ocean view')) return t('facility.oceanView', 'Ocean View');
                                if (text.includes('bbq')) return t('facility.bbq', 'BBQ Grill');
                                if (text.includes('mountain view')) return t('facility.mountainView', 'Mountain View');
                                if (text.includes('fireplace')) return t('facility.fireplace', 'Fireplace');

                                const bedroomMatch = facilityName.match(/^(\d+)\s+Bedrooms?$/i);
                                if (bedroomMatch) {
                                    return t('facility.bedrooms', '{count} Bedrooms').replace('{count}', bedroomMatch[1]);
                                }

                                return facilityName;
                            };

                            return (
                                <div key={fac} className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded whitespace-nowrap">
                                    <span className="material-symbols-outlined text-[16px] text-gray-400">{icon}</span>
                                    {translateFacility(fac)}
                                </div>
                            );
                        })}
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
                        <div className="text-xs text-gray-400 mb-3">/ {t('detail.nightUnit', 'night')} / {t('search.entireVilla', 'entire villa')}</div>
                        <button className="bg-travel-blue text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors hover-scale" onClick={onClick ? (e) => { e.stopPropagation(); onClick(); } : undefined}>
                            {t('search.bookVilla', 'Book Villa')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
