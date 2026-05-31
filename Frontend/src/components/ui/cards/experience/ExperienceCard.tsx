import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { ExperienceResult } from '../../../../types/search';

const fmt = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

export const ExperienceCard: React.FC<{ item: ExperienceResult }> = ({ item }) => {
    const navigate = useNavigate();

    // Map high-quality images based on attraction name
    const getExperienceImage = (attraction: string) => {
        const text = attraction.toLowerCase();
        if (text.includes('maldives')) {
            return 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80';
        }
        if (text.includes('nhật bản') || text.includes('tokyo') || text.includes('phú sĩ')) {
            return 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80';
        }
        if (text.includes('hà nội') || text.includes('tràng an') || text.includes('hạ long')) {
            return 'https://images.unsplash.com/photo-1555921015-5532091f6026?auto=format&fit=crop&w=800&q=80';
        }
        if (text.includes('đà nẵng') || text.includes('bà nà') || text.includes('hội an')) {
            return 'https://images.unsplash.com/photo-1597047084897-51e81819a499?auto=format&fit=crop&w=800&q=80';
        }
        if (text.includes('phú quốc')) {
            return 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=800&q=80';
        }
        // Fallback natural travel destination
        return 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80';
    };

    const handleSelectTour = () => {
        // Construct query parameters so that ExperienceDetail can fall back gracefully
        const params = new URLSearchParams({
            attraction: item.attraction || item.description,
            price: String(item.price),
            desc: item.description || '',
            pickup: item.pickup || '',
        });
        navigate(`/tour/${item.MaDV}?${params.toString()}`);
    };

    // Randomize rating & reviews for realistic high-fidelity feel
    const mockRating = (item.MaDV % 3 === 0) ? 4.9 : (item.MaDV % 3 === 1) ? 4.8 : 4.7;
    const mockReviews = Math.floor((item.MaDV * 23) % 450) + 68;
    const ratingText = mockRating >= 4.9 ? 'Tuyệt vời' : 'Rất tốt';

    return (
        <div 
            onClick={handleSelectTour}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden flex shadow-sm hover:shadow-md transition-shadow cursor-pointer font-['Plus_Jakarta_Sans']"
        >
            {/* Left Image */}
            <div className="relative w-1/3 min-w-[260px] h-52">
                <img 
                    src={getExperienceImage(item.attraction || '')} 
                    alt={item.attraction} 
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" 
                />
                <div className="absolute top-3 left-3 bg-[#7c3aed] text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                    Khám phá mới
                </div>
            </div>

            {/* Right Content */}
            <div className="flex-1 p-5 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-[#7c3aed] uppercase tracking-wider">
                            Trải nghiệm & Tour
                        </span>
                        <div className="flex items-center gap-1">
                            <span className="bg-[#ede9fe] text-[#7c3aed] font-bold px-2 py-0.5 rounded text-xs">
                                {mockRating.toFixed(1)}
                            </span>
                            <span className="text-[#7c3aed] font-semibold text-xs">{ratingText}</span>
                            <span className="text-gray-400 text-[11px]">({mockReviews} đánh giá)</span>
                        </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                        {item.attraction || item.description}
                    </h3>

                    {item.pickup && (
                        <div className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                            <span className="material-symbols-outlined text-[14px] text-gray-400">location_on</span>
                            Điểm đón: <strong>{item.pickup}</strong>
                        </div>
                    )}

                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                        {item.description}
                    </p>
                </div>

                <div className="flex justify-between items-end mt-3 pt-3 border-t border-gray-50">
                    {/* Tour inclusions icons */}
                    <div className="flex gap-3">
                        <div className="flex items-center gap-1 text-[11px] text-gray-500">
                            <span className="material-symbols-outlined text-[14px] text-gray-400">directions_bus</span>
                            Xe đưa đón
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-gray-500">
                            <span className="material-symbols-outlined text-[14px] text-gray-400">confirmation_number</span>
                            Vé vào cổng
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-gray-500">
                            <span className="material-symbols-outlined text-[14px] text-gray-400">restaurant</span>
                            Ăn trưa
                        </div>
                    </div>

                    {/* Price & Action */}
                    <div className="text-right flex-shrink-0">
                        <div className="text-xl font-black text-gray-900 mb-0">
                            {fmt(item.price)}
                        </div>
                        <div className="text-[10px] text-gray-400 mb-2">/ {item.unit || 'người'} · trọn gói</div>
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleSelectTour(); }}
                            className="bg-[#7c3aed] text-white px-5 py-1.5 rounded-lg text-xs font-bold hover:bg-[#6d28d9] transition-colors hover-scale"
                        >
                            Xem Chi Tiết
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
