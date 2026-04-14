import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../../components/auth/AuthModal';

const APARTMENT_DETAILS: Record<string, {
    id: string; name: string; location: string; rating: number; ratingText: string;
    reviews: number; stars: number; description: string;
    facilities: { name: string; icon: string }[];
    images: string[];
    units: { id: string; name: string; size: number; bedrooms: number; maxGuests: number; price: number; originalPrice?: number; amenities: string[]; image: string; cancellation: string; breakfast: boolean; available: number }[];
    reviewList: { author: string; date: string; score: number; text: string; country: string }[];
}> = {
    'a1': {
        id: 'a1', name: 'Luxury City Center Studio', location: 'District 1, Ho Chi Minh City',
        rating: 9.1, ratingText: 'Superb', reviews: 420, stars: 4,
        description: 'A chic, fully-equipped studio apartment in the beating heart of Ho Chi Minh City. Enjoy stunning city and river views, access to a rooftop pool and gym, and be steps away from the city\'s best restaurants, cafés, and cultural attractions.',
        facilities: [
            { name: 'Rooftop Pool', icon: 'pool' }, { name: 'Fitness Center', icon: 'fitness_center' },
            { name: 'Full Kitchen', icon: 'kitchen' }, { name: 'City View', icon: 'location_city' },
            { name: 'Washing Machine', icon: 'local_laundry_service' }, { name: 'Free WiFi', icon: 'wifi' },
        ],
        images: [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1502672260266-1c1c24240f57?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        ],
        units: [
            { id: 'u1', name: 'Premium Studio — City View', size: 38, bedrooms: 0, maxGuests: 2, price: 1200000, originalPrice: 1500000, amenities: ['City View Balcony', 'Full Kitchen', 'Smart TV', 'Washing Machine', 'Free WiFi'], image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', cancellation: 'FREE CANCELLATION', breakfast: false, available: 2 },
            { id: 'u2', name: 'Standard Studio', size: 28, bedrooms: 0, maxGuests: 2, price: 900000, amenities: ['City View', 'Kitchenette', 'Smart TV', 'Free WiFi'], image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', cancellation: 'Non-refundable', breakfast: false, available: 5 },
        ],
        reviewList: [
            { author: 'Sophie Laurent', date: 'December 2024', score: 9, text: 'Perfect base for exploring HCMC. The apartment was immaculately clean, the view from the 24th floor is breathtaking, and the rooftop pool is a great bonus after a day of sightseeing.', country: 'France' },
            { author: 'Khoa Trần', date: 'November 2024', score: 9, text: 'Căn hộ sạch đẹp, vị trí đắc địa Quận 1, đi bộ đến mọi chỗ. Check-in nhanh, chủ nhà thân thiện. Sẽ quay lại.', country: 'Vietnam' },
        ],
    },
    'a2': {
        id: 'a2', name: 'Cozy Vintage Homestay', location: 'Hoan Kiem, Hanoi',
        rating: 8.5, ratingText: 'Very Good', reviews: 310, stars: 3,
        description: 'A characterful vintage-style apartment in the historic Old Quarter of Hanoi. Exposed brick walls, warm lighting, and eclectic décor create a homey atmosphere that perfectly complements the culture-rich neighborhood just outside your door.',
        facilities: [
            { name: 'Old Quarter Location', icon: 'location_city' }, { name: 'Vintage Décor', icon: 'palette' },
            { name: 'Balcony', icon: 'balcony' }, { name: 'Full Kitchen', icon: 'kitchen' },
            { name: 'Free WiFi', icon: 'wifi' }, { name: 'Air Conditioning', icon: 'ac_unit' },
        ],
        images: [
            'https://images.unsplash.com/photo-1502672260266-1c1c24240f57?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        ],
        units: [
            { id: 'u1', name: '1 Bedroom with Balcony', size: 45, bedrooms: 1, maxGuests: 2, price: 850000, amenities: ['Old Quarter View Balcony', 'Full Kitchen', 'Free WiFi', 'Air Conditioning'], image: 'https://images.unsplash.com/photo-1502672260266-1c1c24240f57?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', cancellation: 'FREE CANCELLATION', breakfast: false, available: 1 },
            { id: 'u2', name: 'Cozy Twin Room', size: 25, bedrooms: 1, maxGuests: 2, price: 600000, amenities: ['Street View', 'Free WiFi', 'Air Conditioning', 'Shared Kitchen'], image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', cancellation: 'Non-refundable', breakfast: true, available: 3 },
        ],
        reviewList: [
            { author: 'Yuki Tanaka', date: 'January 2025', score: 9, text: 'Loved the vintage atmosphere! The balcony looking over the Old Quarter rooftops was the perfect place for morning coffee. Very authentic Hanoi experience.', country: 'Japan' },
            { author: 'Lan Anh', date: 'December 2024', score: 8, text: 'Homestay ấm cúng, decor vintage rất thú vị. Vị trí ngay Hoàn Kiếm, đi bộ ra Hồ Gươm chỉ 5 phút. Chủ nhà dễ thương, sẽ giới thiệu bạn bè.', country: 'Vietnam' },
        ],
    },
};

const UnitCard: React.FC<{ unit: typeof APARTMENT_DETAILS['a1']['units'][0]; onSelect: () => void }> = ({ unit, onSelect }) => (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex shadow-sm hover:shadow-md transition-shadow">
        <div className="w-44 h-36 flex-shrink-0">
            <img src={unit.image} alt={unit.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 p-4 flex gap-4">
            <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-base mb-1">{unit.name}</h4>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-2">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">straighten</span>{unit.size} m²</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">bed</span>{unit.bedrooms === 0 ? 'Studio' : `${unit.bedrooms} Bedroom${unit.bedrooms > 1 ? 's' : ''}`}</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">person</span>Max {unit.maxGuests} guests</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                    {unit.amenities.slice(0, 4).map(a => <span key={a} className="bg-purple-50 text-purple-700 text-[11px] px-2 py-0.5 rounded-full">{a}</span>)}
                    {unit.amenities.length > 4 && <span className="bg-gray-100 text-gray-500 text-[11px] px-2 py-0.5 rounded-full">+{unit.amenities.length - 4} more</span>}
                </div>
                <div className={`text-xs font-semibold ${unit.cancellation === 'FREE CANCELLATION' ? 'text-green-600' : 'text-red-500'}`}>{unit.cancellation}</div>
                {unit.breakfast && <div className="text-xs text-orange-500 font-semibold mt-0.5">🍳 BREAKFAST INCLUDED</div>}
            </div>
            <div className="flex flex-col items-end justify-between min-w-[140px]">
                <div className="text-right">
                    {unit.originalPrice && <div className="text-xs text-gray-400 line-through">{unit.originalPrice.toLocaleString()} VNĐ</div>}
                    <div className="text-xl font-black text-gray-900">{unit.price.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">VNĐ / night</div>
                </div>
                <div>
                    {unit.available <= 3 && <div className="text-[11px] text-orange-500 text-right mb-1">Only {unit.available} left!</div>}
                    <button onClick={onSelect} className="bg-purple-600 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-purple-700 transition-colors w-full">Select</button>
                </div>
            </div>
        </div>
    </div>
);

const ApartmentDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [selectedImageIdx, setSelectedImageIdx] = useState(0);
    const [showAllImages, setShowAllImages] = useState(false);

    const apt = id ? APARTMENT_DETAILS[id] : null;
    if (!apt) return (
        <div className="flex flex-col items-center justify-center min-h-screen text-gray-400">
            <span className="material-symbols-outlined text-6xl mb-4">apartment</span>
            <p className="font-bold text-xl">Apartment not found</p>
            <button onClick={() => navigate('/apartments')} className="mt-4 text-purple-600 hover:underline">← Back to Apartments</button>
        </div>
    );

    const handleSelect = (unit?: typeof APARTMENT_DETAILS['a1']['units'][0]) => {
        if (!isAuthenticated) {
            setIsAuthModalOpen(true);
        } else {
            const selectedUnit = unit || apt!.units[0];
            const params = new URLSearchParams({
                type: 'apartment',
                name: apt!.name,
                image: selectedUnit.image,
                price: String(selectedUnit.price),
                detail1: apt!.location,
                detail2: selectedUnit.name,
            });
            navigate(`/booking?${params.toString()}`);
        }
    };

    return (
        <div className="bg-[#f5f7fa] min-h-screen font-['Plus_Jakarta_Sans']">
            <div className="bg-white border-b border-gray-100 py-6">
                <div className="max-w-[1200px] mx-auto px-4">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-purple-600 font-semibold text-sm mb-4 hover:opacity-80 transition">
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>Back to results
                    </button>
                    <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[420px] rounded-2xl overflow-hidden cursor-pointer" onClick={() => setShowAllImages(true)}>
                        <div className="col-span-2 row-span-2">
                            <img src={apt.images[0]} alt={apt.name} className="w-full h-full object-cover hover:brightness-90 transition-all" />
                        </div>
                        {apt.images.slice(1, 5).map((img, i) => (
                            <div key={i} className="relative overflow-hidden">
                                <img src={img} alt="" className="w-full h-full object-cover hover:brightness-90 transition-all" />
                                {i === 3 && apt.images.length > 5 && <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-lg">+{apt.images.length - 5}</div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 py-8 flex gap-8">
                <div className="flex-1 min-w-0">
                    {/* Info */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                        <div className="flex gap-0.5 mb-2">{Array.from({ length: apt.stars }).map((_, i) => <span key={i} className="material-symbols-outlined text-yellow-500 text-[20px]">star</span>)}</div>
                        <h1 className="text-2xl font-black text-gray-900 mb-1">{apt.name}</h1>
                        <div className="flex items-center gap-1 text-sm text-gray-500 mb-4"><span className="material-symbols-outlined text-[16px]">location_on</span>{apt.location}</div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-purple-600 text-white font-black px-3 py-1.5 rounded-lg text-base">{apt.rating.toFixed(1)}</span>
                            <div><div className="font-bold text-gray-900">{apt.ratingText}</div><div className="text-sm text-gray-500">Based on {apt.reviews.toLocaleString()} reviews</div></div>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{apt.description}</p>
                    </div>

                    {/* Facilities */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                        <h2 className="font-bold text-lg text-gray-900 mb-4">Apartment Facilities</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4">
                            {apt.facilities.map(f => (
                                <div key={f.name} className="flex items-center gap-2 text-sm text-gray-700">
                                    <span className="material-symbols-outlined text-[20px] text-purple-600">{f.icon}</span>{f.name}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Units */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                        <h2 className="font-bold text-xl text-gray-900 mb-4">Available Units</h2>
                        {!isAuthenticated && (
                            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-purple-600 text-2xl">lock</span>
                                    <div>
                                        <div className="font-bold text-gray-900 text-sm">Sign in for member rates</div>
                                        <div className="text-xs text-gray-500">Get up to 30% off on selected apartments.</div>
                                    </div>
                                </div>
                                <button onClick={() => setIsAuthModalOpen(true)} className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-purple-700 transition-colors whitespace-nowrap">Sign In Now</button>
                            </div>
                        )}
                        <div className="flex flex-col gap-4">{apt.units.map(u => <UnitCard key={u.id} unit={u} onSelect={() => handleSelect(u)} />)}</div>
                    </div>

                    {/* Reviews */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold text-xl text-gray-900">Guest Reviews</h2>
                            <span className="bg-purple-600 text-white font-black px-3 py-1 rounded-lg">{apt.rating.toFixed(1)}</span>
                        </div>
                        <div className="flex flex-col gap-5">
                            {apt.reviewList.map((r, i) => (
                                <div key={i} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-purple-700 flex items-center justify-center text-white font-bold text-sm">{r.author[0]}</div>
                                            <div><div className="font-bold text-sm text-gray-900">{r.author}</div><div className="text-xs text-gray-400">{r.country} · {r.date}</div></div>
                                        </div>
                                        <span className="bg-purple-600 text-white font-bold text-sm px-2 py-0.5 rounded">{r.score}/10</span>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed pl-12">"{r.text}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sticky Sidebar */}
                <div className="w-72 flex-shrink-0">
                    <div className="bg-white rounded-xl border border-purple-400 shadow-lg p-5 sticky top-24">
                        <div className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Starting from</div>
                        <div className="text-3xl font-black text-purple-600 mb-1">{Math.min(...apt.units.map(u => u.price)).toLocaleString()}</div>
                        <div className="text-sm text-gray-500 mb-4">VNĐ / night</div>
                        <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-gray-500">Check-in</span><span className="font-bold">Dec 01, 2024</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Check-out</span><span className="font-bold">Dec 05, 2024</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Guests</span><span className="font-bold">2 Adults</span></div>
                        </div>
                        <button onClick={() => handleSelect()} className="w-full mt-5 bg-purple-600 text-white py-3 rounded-xl font-bold text-base hover:bg-purple-700 transition-colors">
                            {isAuthenticated ? 'Select Unit' : 'Sign In to Book'}
                        </button>
                        {!isAuthenticated && <p className="text-center text-xs text-gray-400 mt-2">Sign in to unlock member rates</p>}
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            {showAllImages && (
                <div className="fixed inset-0 z-[200] bg-black/90 flex flex-col items-center justify-center" onClick={() => setShowAllImages(false)}>
                    <button className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300" onClick={() => setShowAllImages(false)}>✕</button>
                    <div className="max-w-3xl w-full px-4" onClick={e => e.stopPropagation()}>
                        <img src={apt.images[selectedImageIdx]} alt="Apartment" className="w-full h-auto max-h-[70vh] object-contain rounded-xl mb-4" />
                        <div className="flex gap-2 justify-center overflow-x-auto pb-2">
                            {apt.images.map((img, i) => (
                                <img key={i} src={img} alt="" onClick={() => setSelectedImageIdx(i)}
                                    className={`w-20 h-14 object-cover rounded-lg cursor-pointer border-2 transition-all flex-shrink-0 ${i === selectedImageIdx ? 'border-purple-500' : 'border-transparent opacity-60 hover:opacity-100'}`} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialView="login" />
        </div>
    );
};

export default ApartmentDetail;
