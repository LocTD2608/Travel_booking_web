import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../../components/auth/AuthModal';

const VILLA_DETAILS: Record<string, {
    id: string; name: string; location: string; rating: number; ratingText: string;
    reviews: number; stars: number; description: string;
    facilities: { name: string; icon: string }[];
    images: string[];
    suites: { id: string; name: string; size: number; bedrooms: number; maxGuests: number; price: number; originalPrice?: number; amenities: string[]; image: string; cancellation: string; breakfast: boolean; available: number }[];
    reviewList: { author: string; date: string; score: number; text: string; country: string }[];
}> = {
    'v1': {
        id: 'v1', name: 'Ocean View Pool Villa', location: 'Cam Hai Dong, Khanh Hoa',
        rating: 9.6, ratingText: 'Exceptional', reviews: 214, stars: 5,
        description: 'A breathtaking oceanfront villa with a private infinity pool that seems to merge with the sea. Surrounded by lush tropical gardens, this 4-bedroom sanctuary offers unparalleled privacy, luxury amenities, and direct beach access in the heart of Khanh Hoa province.',
        facilities: [
            { name: 'Private Infinity Pool', icon: 'pool' }, { name: 'Direct Beach Access', icon: 'beach_access' },
            { name: 'BBQ Grill Area', icon: 'outdoor_grill' }, { name: 'Free High-Speed WiFi', icon: 'wifi' },
            { name: 'Chef on Request', icon: 'restaurant' }, { name: 'Concierge Service', icon: 'support_agent' },
        ],
        images: [
            'https://images.unsplash.com/photo-1542314831-c6a4d14ce8a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        ],
        suites: [
            { id: 's1', name: 'Entire Villa (4 Bedrooms)', size: 350, bedrooms: 4, maxGuests: 8, price: 8500000, originalPrice: 10000000, amenities: ['Private Pool', 'Full Kitchen', 'BBQ Area', 'Beach Access', 'Free WiFi', '4 Bathrooms'], image: 'https://images.unsplash.com/photo-1490750967868-88df5691cc2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', cancellation: 'FREE CANCELLATION', breakfast: false, available: 1 },
            { id: 's2', name: 'Garden Suite (2 Bedrooms)', size: 160, bedrooms: 2, maxGuests: 4, price: 4500000, amenities: ['Shared Pool Access', 'Kitchenette', 'Garden Terrace', 'Free WiFi', '2 Bathrooms'], image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', cancellation: 'FREE CANCELLATION', breakfast: true, available: 2 },
        ],
        reviewList: [
            { author: 'David Park', date: 'November 2024', score: 10, text: 'Absolutely stunning! The pool overlooks the ocean directly and watching the sunset from there was a once-in-a-lifetime experience. The villa staff thought of everything.', country: 'South Korea' },
            { author: 'Anh Nguyen', date: 'October 2024', score: 10, text: 'Tuyệt vời không thể tả được! Villa sạch bóng, hồ bơi view biển cực đẹp, đội ngũ phục vụ rất chuyên nghiệp. Nhất định sẽ quay lại!', country: 'Vietnam' },
        ],
    },
    'v2': {
        id: 'v2', name: 'Hilltop Retreat Villa', location: 'Tam Dao, Vinh Phuc',
        rating: 9.2, ratingText: 'Superb', reviews: 180, stars: 4,
        description: 'Perched at 900m altitude amidst misty pine forests, this Hilltop Retreat Villa offers a cool escape from urban life. Experience breathtaking mountain panoramas, a cozy fireplace, and pure tranquility — only 80km from Hanoi.',
        facilities: [
            { name: 'Mountain Panorama', icon: 'landscape' }, { name: 'Fireplace', icon: 'fireplace' },
            { name: 'Forest Trekking Access', icon: 'hiking' }, { name: 'Free WiFi', icon: 'wifi' },
            { name: 'Outdoor Jacuzzi', icon: 'hot_tub' }, { name: 'BBQ Terrace', icon: 'outdoor_grill' },
        ],
        images: [
            'https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1542314831-c6a4d14ce8a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1506974210756-8e1b8985d348?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        ],
        suites: [
            { id: 's1', name: 'Entire Villa (3 Bedrooms)', size: 220, bedrooms: 3, maxGuests: 6, price: 4200000, amenities: ['Outdoor Jacuzzi', 'Fireplace', 'Full Kitchen', 'Mountain View Terrace', 'Free WiFi'], image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', cancellation: 'FREE CANCELLATION', breakfast: true, available: 1 },
            { id: 's2', name: 'Master Room Only', size: 45, bedrooms: 1, maxGuests: 2, price: 1800000, amenities: ['Mountain View', 'Private Bathroom', 'Free WiFi', 'Breakfast'], image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', cancellation: 'Non-refundable', breakfast: true, available: 3 },
        ],
        reviewList: [
            { author: 'Thu Hà', date: 'December 2024', score: 9, text: 'Không khí mát mẻ, yên tĩnh tuyệt vời. Ngồi uống cà phê nhìn ra rừng thông mà cảm thấy thật bình yên. Lò sưởi hoạt động tốt, rất cần thiết vào mùa đông.', country: 'Vietnam' },
            { author: 'Thomas Müller', date: 'November 2024', score: 10, text: 'An incredible mountain experience. The fog rolling through the pine forest in the morning is like something out of a fairy tale. Perfect for a complete digital detox.', country: 'Germany' },
        ],
    },
};

const SuiteCard: React.FC<{ suite: typeof VILLA_DETAILS['v1']['suites'][0]; onSelect: () => void }> = ({ suite, onSelect }) => (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex shadow-sm hover:shadow-md transition-shadow">
        <div className="w-44 h-36 flex-shrink-0">
            <img src={suite.image} alt={suite.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 p-4 flex gap-4">
            <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-base mb-1">{suite.name}</h4>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-2">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">straighten</span>{suite.size} m²</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">bedroom_parent</span>{suite.bedrooms} Bedroom{suite.bedrooms > 1 ? 's' : ''}</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">person</span>Max {suite.maxGuests} guests</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                    {suite.amenities.slice(0, 4).map(a => <span key={a} className="bg-gray-100 text-gray-600 text-[11px] px-2 py-0.5 rounded-full">{a}</span>)}
                    {suite.amenities.length > 4 && <span className="bg-gray-100 text-gray-500 text-[11px] px-2 py-0.5 rounded-full">+{suite.amenities.length - 4} more</span>}
                </div>
                <div className={`text-xs font-semibold ${suite.cancellation === 'FREE CANCELLATION' ? 'text-green-600' : 'text-red-500'}`}>{suite.cancellation}</div>
                {suite.breakfast && <div className="text-xs text-orange-500 font-semibold mt-0.5">🍳 BREAKFAST INCLUDED</div>}
            </div>
            <div className="flex flex-col items-end justify-between min-w-[140px]">
                <div className="text-right">
                    {suite.originalPrice && <div className="text-xs text-gray-400 line-through">{suite.originalPrice.toLocaleString()} VNĐ</div>}
                    <div className="text-xl font-black text-gray-900">{suite.price.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">VNĐ / night</div>
                </div>
                <div>
                    {suite.available <= 2 && <div className="text-[11px] text-orange-500 text-right mb-1">Only {suite.available} left!</div>}
                    <button onClick={onSelect} className="bg-[#005CE6] text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors w-full">Book Now</button>
                </div>
            </div>
        </div>
    </div>
);

const VillaDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [selectedImageIdx, setSelectedImageIdx] = useState(0);
    const [showAllImages, setShowAllImages] = useState(false);

    const villa = id ? VILLA_DETAILS[id] : null;
    if (!villa) return (
        <div className="flex flex-col items-center justify-center min-h-screen text-gray-400">
            <span className="material-symbols-outlined text-6xl mb-4">villa</span>
            <p className="font-bold text-xl">Villa not found</p>
            <button onClick={() => navigate('/villas')} className="mt-4 text-blue-600 hover:underline">← Back to Villas</button>
        </div>
    );

    const handleBook = (suite?: typeof VILLA_DETAILS['v1']['suites'][0]) => {
        if (!isAuthenticated) {
            setIsAuthModalOpen(true);
        } else {
            const selectedSuite = suite || villa!.suites[0];
            const params = new URLSearchParams({
                type: 'villa',
                name: villa!.name,
                image: selectedSuite.image,
                price: String(selectedSuite.price),
                detail1: villa!.location,
                detail2: selectedSuite.name,
            });
            navigate(`/booking?${params.toString()}`);
        }
    };

    return (
        <div className="bg-[#f5f7fa] min-h-screen font-['Plus_Jakarta_Sans']">
            <div className="bg-white border-b border-gray-100 py-6">
                <div className="max-w-[1200px] mx-auto px-4">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-[#005CE6] font-semibold text-sm mb-4 hover:opacity-80 transition">
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>Back to results
                    </button>
                    <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[420px] rounded-2xl overflow-hidden cursor-pointer" onClick={() => setShowAllImages(true)}>
                        <div className="col-span-2 row-span-2 relative">
                            <img src={villa.images[0]} alt={villa.name} className="w-full h-full object-cover hover:brightness-90 transition-all" />
                        </div>
                        {villa.images.slice(1, 5).map((img, i) => (
                            <div key={i} className="relative overflow-hidden">
                                <img src={img} alt="" className="w-full h-full object-cover hover:brightness-90 transition-all" />
                                {i === 3 && villa.images.length > 5 && <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-lg">+{villa.images.length - 5} Photos</div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 py-8 flex gap-8">
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                        <div className="flex gap-0.5 mb-2">{Array.from({ length: villa.stars }).map((_, i) => <span key={i} className="material-symbols-outlined text-yellow-500 text-[20px]">star</span>)}</div>
                        <h1 className="text-2xl font-black text-gray-900 mb-1">{villa.name}</h1>
                        <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                            <span className="material-symbols-outlined text-[16px]">location_on</span>{villa.location}
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-green-600 text-white font-black px-3 py-1.5 rounded-lg text-base">{villa.rating.toFixed(1)}</span>
                            <div><div className="font-bold text-gray-900">{villa.ratingText}</div><div className="text-sm text-gray-500">Based on {villa.reviews.toLocaleString()} reviews</div></div>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{villa.description}</p>
                    </div>

                    {/* Facilities */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                        <h2 className="font-bold text-lg text-gray-900 mb-4">Villa Amenities</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4">
                            {villa.facilities.map(f => (
                                <div key={f.name} className="flex items-center gap-2 text-sm text-gray-700">
                                    <span className="material-symbols-outlined text-[20px] text-green-600">{f.icon}</span>{f.name}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Suites */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                        <h2 className="font-bold text-xl text-gray-900 mb-4">Available Options</h2>
                        {!isAuthenticated && (
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-green-600 text-2xl">lock</span>
                                    <div>
                                        <div className="font-bold text-gray-900 text-sm">Sign in for exclusive member rates</div>
                                        <div className="text-xs text-gray-500">Unlock prices up to 30% lower on selected villas.</div>
                                    </div>
                                </div>
                                <button onClick={() => setIsAuthModalOpen(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-green-700 transition-colors whitespace-nowrap">Sign In Now</button>
                            </div>
                        )}
                        <div className="flex flex-col gap-4">{villa.suites.map(s => <SuiteCard key={s.id} suite={s} onSelect={() => handleBook(s)} />)}</div>
                    </div>

                    {/* Reviews */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold text-xl text-gray-900">Guest Reviews</h2>
                            <span className="bg-green-600 text-white font-black px-3 py-1 rounded-lg">{villa.rating.toFixed(1)}</span>
                        </div>
                        <div className="flex flex-col gap-5">
                            {villa.reviewList.map((r, i) => (
                                <div key={i} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">{r.author[0]}</div>
                                            <div><div className="font-bold text-sm text-gray-900">{r.author}</div><div className="text-xs text-gray-400">{r.country} · {r.date}</div></div>
                                        </div>
                                        <span className="bg-green-600 text-white font-bold text-sm px-2 py-0.5 rounded">{r.score}/10</span>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed pl-12">"{r.text}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sticky Sidebar */}
                <div className="w-72 flex-shrink-0">
                    <div className="bg-white rounded-xl border border-green-400 shadow-lg p-5 sticky top-24">
                        <div className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Starting from</div>
                        <div className="text-3xl font-black text-green-600 mb-1">{Math.min(...villa.suites.map(s => s.price)).toLocaleString()}</div>
                        <div className="text-sm text-gray-500 mb-4">VNĐ / night · entire villa</div>
                        <div className="bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-lg mb-4 inline-block">✓ Best price guaranteed</div>
                        <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-gray-500">Check-in</span><span className="font-bold">Nov 20, 2024</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Check-out</span><span className="font-bold">Nov 22, 2024</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Guests</span><span className="font-bold">6 Adults</span></div>
                        </div>
                        <button onClick={() => handleBook()} className="w-full mt-5 bg-green-600 text-white py-3 rounded-xl font-bold text-base hover:bg-green-700 transition-colors">
                            {isAuthenticated ? 'Book This Villa' : 'Sign In to Book'}
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
                        <img src={villa.images[selectedImageIdx]} alt="Villa" className="w-full h-auto max-h-[70vh] object-contain rounded-xl mb-4" />
                        <div className="flex gap-2 justify-center overflow-x-auto pb-2">
                            {villa.images.map((img, i) => (
                                <img key={i} src={img} alt="" onClick={() => setSelectedImageIdx(i)}
                                    className={`w-20 h-14 object-cover rounded-lg cursor-pointer border-2 transition-all flex-shrink-0 ${i === selectedImageIdx ? 'border-green-500' : 'border-transparent opacity-60 hover:opacity-100'}`} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialView="login" />
        </div>
    );
};

export default VillaDetail;
