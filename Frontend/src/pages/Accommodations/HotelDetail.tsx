import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth, useLanguage } from '../../context';
import AuthModal from '../../components/auth/AuthModal';
import { fetchHotelDetail } from '../../services/searchApi';
import type { HotelDetailResult } from '../../types/search';

// ─── Mock Dataset ────────────────────────────────────────────────────────────
const HOTEL_DETAILS: Record<string, {
    id: string;
    name: string;
    location: string;
    rating: number;
    ratingText: string;
    reviews: number;
    stars: number;
    description: string;
    facilities: { name: string; icon: string }[];
    images: string[];
    rooms: {
        id: string;
        name: string;
        size: number;
        bedType: string;
        view: string;
        price: number;
        originalPrice?: number;
        maxGuests: number;
        amenities: string[];
        image: string;
        cancellation: string;
        breakfast: boolean;
        available: number;
    }[];
    reviewList: { author: string; date: string; score: number; text: string; country: string }[];
}> = {
    'h1': {
        id: 'h1',
        name: 'InterContinental Danang Resort',
        location: 'Son Tra Peninsula, Da Nang',
        rating: 9.4,
        ratingText: 'Exceptional',
        reviews: 1248,
        stars: 5,
        description: 'Perched on the Son Tra Peninsula surrounded by lush tropical forest, InterContinental Danang Sun Peninsula Resort is a sanctuary of elegance and serenity. Experience world-class dining, a private beach, and award-winning spa in a breathtaking natural setting.',
        facilities: [
            { name: 'Private Beach', icon: 'beach_access' },
            { name: 'Infinity Pool', icon: 'pool' },
            { name: 'World-class Spa', icon: 'spa' },
            { name: 'Free High-Speed WiFi', icon: 'wifi' },
            { name: 'Fine Dining', icon: 'restaurant' },
            { name: 'Fitness Center', icon: 'fitness_center' },
        ],
        images: [
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        ],
        rooms: [
            {
                id: 'r1',
                name: 'Ocean Deluxe Suite',
                size: 45,
                bedType: 'King Bed',
                view: 'Ocean View',
                price: 3850000,
                originalPrice: 4500000,
                maxGuests: 2,
                amenities: ['Free WiFi', 'Air Conditioning', 'Mini Bar', 'Bathtub', 'Ocean Balcony'],
                image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                cancellation: 'FREE CANCELLATION',
                breakfast: false,
                available: 3,
            },
            {
                id: 'r2',
                name: 'Cliffside Private Villa',
                size: 120,
                bedType: '2 King Beds',
                view: 'Forest & Sea View',
                price: 8500000,
                maxGuests: 4,
                amenities: ['Private Pool', 'Butler Service', 'Outdoor Jacuzzi', 'Kitchen', 'Free WiFi'],
                image: 'https://images.unsplash.com/photo-1506974210756-8e1b8985d348?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                cancellation: 'FREE CANCELLATION',
                breakfast: true,
                available: 1,
            },
            {
                id: 'r3',
                name: 'Garden View Room',
                size: 30,
                bedType: 'Queen Bed',
                view: 'Garden View',
                price: 2100000,
                maxGuests: 2,
                amenities: ['Free WiFi', 'Air Conditioning', 'Wardrobe', 'Smart TV'],
                image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                cancellation: 'Non-refundable',
                breakfast: false,
                available: 5,
            },
        ],
        reviewList: [
            { author: 'Elena Rodriguez', date: 'October 2024', score: 10, text: 'Simply breathtaking. The service at The Azure Peninsula is beyond words. They anticipated our every need. The private pool villa offered the most spectacular sunrise views we\'ve ever seen.', country: 'Spain' },
            { author: 'Marcus Chen', date: 'September 2024', score: 9, text: 'The definition of tranquility. I need to disconnect. The architecture blends seamlessly into the natural surroundings. Highly recommend for anyone true peace.', country: 'Singapore' },
            { author: 'Linh Nguyen', date: 'August 2024', score: 10, text: 'Tuyệt vời nhất! Nhân viên rất chu đáo và nhiệt tình. Bữa sáng view biển thật sự không thể quên.', country: 'Vietnam' },
        ],
    },
    'h2': {
        id: 'h2',
        name: 'Novotel Danang Premier Han River',
        location: 'Hai Chau District, Da Nang',
        rating: 8.8,
        ratingText: 'Excellent',
        reviews: 3520,
        stars: 4,
        description: 'Located in the heart of Da Nang with stunning views of the Han River, Novotel Danang Premier offers the perfect blend of urban convenience and comfort. Just minutes from major attractions, the beach, and the famous Dragon Bridge.',
        facilities: [
            { name: 'Rooftop Pool', icon: 'pool' },
            { name: 'Free WiFi', icon: 'wifi' },
            { name: 'Fitness Center', icon: 'fitness_center' },
            { name: 'Restaurant & Bar', icon: 'local_bar' },
            { name: 'Concierge Service', icon: 'support_agent' },
        ],
        images: [
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        ],
        rooms: [
            {
                id: 'r1',
                name: 'Superior River View Room',
                size: 36,
                bedType: 'King Bed',
                view: 'Han River View',
                price: 2450000,
                maxGuests: 2,
                amenities: ['Free WiFi', 'Air Conditioning', 'Coffee Machine', 'Smart TV', 'River Balcony'],
                image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                cancellation: 'FREE CANCELLATION',
                breakfast: false,
                available: 4,
            },
            {
                id: 'r2',
                name: 'Deluxe City Room',
                size: 32,
                bedType: '2 Twin Beds',
                view: 'City View',
                price: 1950000,
                maxGuests: 2,
                amenities: ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Work Desk'],
                image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                cancellation: 'Non-refundable',
                breakfast: true,
                available: 6,
            },
        ],
        reviewList: [
            { author: 'James Wilson', date: 'November 2024', score: 9, text: 'Great location, right by the Han River. The rooftop pool view is incredible at sunset. Staff were very friendly and helpful.', country: 'Australia' },
            { author: 'Minh Trần', date: 'October 2024', score: 8, text: 'Khách sạn sạch sẽ, view đẹp, dịch vụ tốt. Bữa sáng phong phú. Vị trí cực thuận tiện, đi bộ ra biển chỉ 15 phút.', country: 'Vietnam' },
        ],
    },
    'h3': {
        id: 'h3',
        name: 'Sheraton Grand Danang Resort',
        location: 'Non Nuoc Beach, Da Nang',
        rating: 8.9,
        ratingText: 'Excellent',
        reviews: 890,
        stars: 5,
        description: 'Set on the pristine Non Nuoc Beach with the Marble Mountains as a backdrop, the Sheraton Grand Danang Resort offers an unrivaled beachfront experience. The resort features multiple pools, signature dining options, and spacious rooms with breathtaking views.',
        facilities: [
            { name: 'Beachfront Access', icon: 'beach_access' },
            { name: 'Multiple Pools', icon: 'pool' },
            { name: 'Free WiFi', icon: 'wifi' },
            { name: 'Signature Restaurants', icon: 'restaurant' },
            { name: 'Kids Club', icon: 'child_care' },
            { name: 'Water Sports', icon: 'surfing' },
        ],
        images: [
            'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        ],
        rooms: [
            {
                id: 'r1',
                name: 'Beachfront Deluxe Room',
                size: 42,
                bedType: 'King Bed',
                view: 'Direct Beach View',
                price: 3200000,
                maxGuests: 2,
                amenities: ['Free WiFi', 'Beach Access', 'Air Conditioning', 'Balcony', 'Mini Bar'],
                image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                cancellation: 'FREE CANCELLATION',
                breakfast: false,
                available: 2,
            },
            {
                id: 'r2',
                name: 'Family Suite',
                size: 75,
                bedType: '1 King + 2 Twin',
                view: 'Ocean View',
                price: 5500000,
                maxGuests: 4,
                amenities: ['Free WiFi', 'Kitchen', 'Living Room', 'Private Balcony', '2 Bathrooms'],
                image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                cancellation: 'FREE CANCELLATION',
                breakfast: true,
                available: 3,
            },
        ],
        reviewList: [
            { author: 'Sarah Kim', date: 'October 2024', score: 9, text: 'Perfect beach resort! Woke up every morning to the sound of waves. The breakfast spread is incredible and the staff remembered our names by day 2.', country: 'USA' },
        ],
    },
};

interface RoomCardProps {
    room: {
        id: string;
        name: string;
        size: number;
        bedType: string;
        view: string;
        price: number;
        originalPrice?: number;
        maxGuests: number;
        amenities: string[];
        image: string;
        cancellation: string;
        breakfast: boolean;
        available: number;
    };
    onSelect: () => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onSelect }) => {
    const { t } = useLanguage();

    const translateFacility = (facilityName: string) => {
        const text = facilityName.toLowerCase();
        if (text.includes('private pool')) return t('facility.privatePool', 'Private Pool');
        if (text.includes('pool')) return t('facility.pool', 'Pool');
        if (text.includes('wifi')) return t('facility.wifi', 'WiFi');
        if (text.includes('gym')) return t('facility.gym', 'Gym');
        if (text.includes('bar')) return t('facility.bar', 'Bar');
        if (text.includes('beach')) return t('facility.beach', 'Beach Access');
        if (text.includes('spa')) return t('facility.spa', 'Spa');
        if (text.includes('restaurant') || text.includes('dining')) return t('facility.restaurant', 'Restaurant');
        if (text.includes('kitchen')) return t('facility.kitchen', 'Kitchen');
        if (text.includes('wash')) return t('facility.washer', 'Washing Machine');
        if (text.includes('city view')) return t('facility.cityView', 'City View');
        if (text.includes('ocean view')) return t('facility.oceanView', 'Ocean View');
        if (text.includes('bbq')) return t('facility.bbq', 'BBQ Grill');
        if (text.includes('mountain view')) return t('facility.mountainView', 'Mountain View');
        if (text.includes('fireplace')) return t('facility.fireplace', 'Fireplace');
        return facilityName;
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex gap-0 shadow-sm hover:shadow-md transition-shadow">
            {/* Room Image */}
            <div className="w-48 h-40 flex-shrink-0">
                <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
            </div>

            {/* Room Info */}
            <div className="flex-1 p-4 flex gap-4">
                <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-base mb-1">{room.name}</h4>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-2">
                        <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">straighten</span>
                            {room.size} m²
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">bed</span>
                            {room.bedType}
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">landscape</span>
                            {room.view}
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">person</span>
                            {t('detail.maxGuestsCount', 'Max {count} guests').replace('{count}', String(room.maxGuests))}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                        {room.amenities.slice(0, 4).map(a => (
                            <span key={a} className="bg-gray-100 text-gray-600 text-[11px] px-2 py-0.5 rounded-full">{translateFacility(a)}</span>
                        ))}
                        {room.amenities.length > 4 && (
                            <span className="bg-gray-100 text-gray-500 text-[11px] px-2 py-0.5 rounded-full">+{room.amenities.length - 4} {t('home.more', 'more')}</span>
                        )}
                    </div>
                    <div className={`text-xs font-semibold ${room.cancellation === 'FREE CANCELLATION' ? 'text-green-600' : 'text-red-500'}`}>
                        {room.cancellation === 'FREE CANCELLATION' ? t('detail.freeCancellation', 'FREE CANCELLATION') : t('detail.nonRefundable', 'Non-refundable')}
                    </div>
                    {room.breakfast && (
                        <div className="text-xs text-orange-500 font-semibold mt-0.5">{t('detail.breakfastIncluded', '🍳 BREAKFAST INCLUDED')}</div>
                    )}
                </div>

                {/* Price & Action */}
                <div className="flex flex-col items-end justify-between min-w-[140px]">
                    <div className="text-right">
                        {room.originalPrice && (
                            <div className="text-xs text-gray-400 line-through">{room.originalPrice.toLocaleString('vi-VN')} VNĐ</div>
                        )}
                        <div className="text-xl font-black text-gray-900">{room.price.toLocaleString('vi-VN')} <span className="text-sm font-semibold text-gray-500">VNĐ</span></div>
                        <div className="text-xs text-gray-505">/ {t('detail.nightUnit', 'night')}</div>
                    </div>
                    <div>
                        <div className="text-[11px] text-orange-500 text-right mb-1">
                            {room.available <= 3 ? t('detail.onlyLeft', 'Only {count} left!').replace('{count}', String(room.available)) : ''}
                        </div>
                        <button
                            onClick={onSelect}
                            className="bg-[#005CE6] text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors w-full"
                        >
                            {t('detail.chooseRoom', 'Select')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const HotelDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { t, translateRating } = useLanguage();

    const translateFacility = (facilityName: string) => {
        const text = facilityName.toLowerCase();
        if (text.includes('private pool')) return t('facility.privatePool', 'Private Pool');
        if (text.includes('pool')) return t('facility.pool', 'Pool');
        if (text.includes('wifi')) return t('facility.wifi', 'WiFi');
        if (text.includes('gym')) return t('facility.gym', 'Gym');
        if (text.includes('bar')) return t('facility.bar', 'Bar');
        if (text.includes('beach')) return t('facility.beach', 'Beach Access');
        if (text.includes('spa')) return t('facility.spa', 'Spa');
        if (text.includes('restaurant') || text.includes('dining')) return t('facility.restaurant', 'Restaurant');
        if (text.includes('kitchen')) return t('facility.kitchen', 'Kitchen');
        if (text.includes('wash')) return t('facility.washer', 'Washing Machine');
        if (text.includes('city view')) return t('facility.cityView', 'City View');
        if (text.includes('ocean view')) return t('facility.oceanView', 'Ocean View');
        if (text.includes('bbq')) return t('facility.bbq', 'BBQ Grill');
        if (text.includes('mountain view')) return t('facility.mountainView', 'Mountain View');
        if (text.includes('fireplace')) return t('facility.fireplace', 'Fireplace');
        return facilityName;
    };

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [selectedImageIdx, setSelectedImageIdx] = useState(0);
    const [showAllImages, setShowAllImages] = useState(false);
    
    const [hotelData, setHotelData] = useState<HotelDetailResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            setLoading(true);
            fetchHotelDetail(id)
                .then(res => {
                    if (res.success) {
                        setHotelData(res.data);
                    } else {
                        setError(res.message || t('detail.hotelNotFound', 'Hotel not found'));
                    }
                })
                .catch(err => {
                    console.error('Error fetching hotel detail:', err);
                    setError(t('detail.hotelNotFound', 'Hotel not found'));
                })
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005CE6]"></div>
                <p className="mt-4 text-gray-500 font-medium">{t('detail.loadingHotel', 'Loading hotel details...')}</p>
            </div>
        );
    }

    if (error || !hotelData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-gray-400">
                <span className="material-symbols-outlined text-6xl mb-4">error</span>
                <p className="font-bold text-xl">{error || t('detail.hotelNotFound', 'Hotel not found')}</p>
                <button onClick={() => navigate('/hotels')} className="mt-4 text-blue-600 hover:underline">{t('detail.backToSearch', '← Back to Hotels')}</button>
            </div>
        );
    }

    // ─── Map Backend Data to UI Structure ────────────────────────────────────
    // Use fallback values for fields not present in DB
    const hotel = {
        id: String(hotelData.hotel.id),
        name: hotelData.hotel.name,
        location: hotelData.hotel.address,
        stars: hotelData.hotel.stars || 5,
        rating: 9.2, // Fallback
        ratingText: 'Exceptional', // Fallback
        reviews: 856, // Fallback
        description: 'Experience luxury and comfort in the heart of the city. Our hotel offers premium amenities and world-class service to make your stay unforgettable.', // Fallback
        facilities: [
            { name: 'Free WiFi', icon: 'wifi' },
            { name: 'Pool', icon: 'pool' },
            { name: 'Spa', icon: 'spa' },
            { name: 'Restaurant', icon: 'restaurant' },
            { name: 'Gym', icon: 'fitness_center' },
            { name: 'Parking', icon: 'local_parking' },
        ],
        images: [
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
        ],
        rooms: hotelData.rooms.map((r, idx) => ({
            id: String(r.roomTypeId),
            name: r.name,
            size: 30 + (idx * 5),
            bedType: idx % 2 === 0 ? 'King Bed' : 'Twin Beds',
            view: idx % 2 === 0 ? 'City View' : 'Garden View',
            price: Number(r.price),
            originalPrice: Number(r.price) * 1.2,
            maxGuests: r.maxGuests,
            amenities: ['Free WiFi', 'Air Conditioning', 'Mini Bar', 'Smart TV'],
            image: `https://images.unsplash.com/photo-${1631049307264 + idx}-da0ec9d70304?auto=format&fit=crop&w=400&q=80`,
            cancellation: 'FREE CANCELLATION',
            breakfast: idx % 2 === 0,
            available: 5 - idx,
        })),
        reviewList: hotelData.reviews.length > 0 ? hotelData.reviews.map(rev => ({
            author: rev.userName,
            date: new Date(rev.date).toLocaleDateString(),
            score: rev.rating,
            text: rev.comment,
            country: 'Vietnam'
        })) : [
            { author: 'Guest', date: '2024-03-15', score: 9.0, text: 'Great stay!', country: 'Vietnam' }
        ]
    };

    const handleSelectRoom = (room?: any) => {
        if (!isAuthenticated) {
            setIsAuthModalOpen(true);
        } else {
            const selectedRoom = room || hotel!.rooms[0];
            const params = new URLSearchParams({
                type: 'hotel',
                name: hotel!.name,
                image: selectedRoom.image,
                price: String(selectedRoom.price),
                detail1: hotel!.location,
                detail2: selectedRoom.name,
            });
            navigate(`/booking?${params.toString()}`);
        }
    };

    return (
        <div className="bg-[#f5f7fa] min-h-screen font-display">

            {/* ── Image Gallery ── */}
            <div className="bg-white border-b border-gray-100 py-6">
                <div className="max-w-[1200px] mx-auto px-4">
                    {/* Back */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1 text-[#005CE6] font-semibold text-sm mb-4 hover:opacity-80 transition"
                    >
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                        {t('detail.backToResults', 'Back to results')}
                    </button>

                    {/* Grid */}
                    <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[420px] rounded-2xl overflow-hidden cursor-pointer" onClick={() => setShowAllImages(true)}>
                        {/* Main image */}
                        <div className="col-span-2 row-span-2 relative">
                            <img
                                src={hotel.images[0]}
                                alt={hotel.name}
                                className="w-full h-full object-cover hover:brightness-90 transition-all"
                            />
                        </div>
                        {/* Side images */}
                        {hotel.images.slice(1, 5).map((img, i) => (
                            <div key={i} className="relative overflow-hidden">
                                <img
                                    src={img}
                                    alt={`Room ${i + 2}`}
                                    className="w-full h-full object-cover hover:brightness-90 transition-all"
                                />
                                {i === 3 && hotel.images.length > 5 && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-lg">
                                        {t('detail.moreImages', '+{count} Photos').replace('{count}', String(hotel.images.length - 5))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Content ── */}
            <div className="max-w-[1200px] mx-auto px-4 py-8 flex gap-8">

                {/* Left Column */}
                <div className="flex-1 min-w-0">

                    {/* Hotel Header Info */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                        {/* Stars */}
                        <div className="flex gap-0.5 mb-2">
                            {Array.from({ length: hotel.stars }).map((_, i) => (
                                <span key={i} className="material-symbols-outlined text-yellow-500 text-[20px]">star</span>
                            ))}
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 mb-1">{hotel.name}</h1>
                        <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                            <span className="material-symbols-outlined text-[16px]">location_on</span>
                            {hotel.location}
                            <span className="text-[#005CE6] ml-2 font-semibold cursor-pointer hover:underline">{t('detail.viewOnMap', '— View on map')}</span>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-[#005CE6] text-white font-black px-3 py-1.5 rounded-lg text-base">{hotel.rating.toFixed(1)}</span>
                            <div>
                                <div className="font-bold text-gray-900">{translateRating(hotel.ratingText)}</div>
                                <div className="text-sm text-gray-500">
                                    {t('detail.basedOnReviews', 'Based on {count} reviews').replace('{count}', hotel.reviews.toLocaleString())}
                                </div>
                            </div>
                        </div>

                        <p className="text-gray-600 text-sm leading-relaxed">{hotel.description}</p>
                    </div>

                    {/* Facilities */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                        <h2 className="font-bold text-lg text-gray-900 mb-4">{t('detail.hotelFacilities', 'Hotel Facilities')}</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4">
                            {hotel.facilities.map(f => (
                                <div key={f.name} className="flex items-center gap-2 text-sm text-gray-700">
                                    <span className="material-symbols-outlined text-[20px] text-[#005CE6]">{f.icon}</span>
                                    {translateFacility(f.name)}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Room Selection ── */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                        <h2 className="font-bold text-xl text-gray-900 mb-4">{t('detail.optionsSanctuary', 'Select your sanctuary')}</h2>

                        {/* Auth nudge banner — hidden when logged in */}
                        {!isAuthenticated && (
                            <div className="bg-[#EBF3FF] border border-[#B3D1FF] rounded-xl p-4 mb-6 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-[#005CE6] text-2xl">lock</span>
                                    <div>
                                        <div className="font-bold text-gray-900 text-sm">{t('detail.exclusiveMemberRates', 'Sign in for private memberRates')}</div>
                                        <div className="text-xs text-gray-500">{t('detail.exclusiveMemberRatesDesc', 'Unlock prices up to 30% lower on selected rooms.')}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsAuthModalOpen(true)}
                                    className="bg-[#005CE6] text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors whitespace-nowrap"
                                >
                                    {t('detail.signInToBook', 'Sign In Now')}
                                </button>
                            </div>
                        )}

                        <div className="flex flex-col gap-4">
                            {hotel.rooms.map(room => (
                                <RoomCard key={room.id} room={room} onSelect={() => handleSelectRoom(room)} />
                            ))}
                        </div>
                    </div>

                    {/* Reviews */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold text-xl text-gray-900">{t('detail.guestExperiences', 'Guest Experiences')}</h2>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500 text-sm">{translateRating(hotel.ratingText)}</span>
                                <span className="bg-[#005CE6] text-white font-black px-3 py-1 rounded-lg">{hotel.rating.toFixed(1)}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-5">
                            {hotel.reviewList.map((review, i) => (
                                <div key={i} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#005CE6] to-blue-400 flex items-center justify-center text-white font-bold text-sm">
                                                {review.author[0]}
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm text-gray-900">{review.author}</div>
                                                <div className="text-xs text-gray-400">{review.country} · {review.date}</div>
                                            </div>
                                        </div>
                                        <span className="bg-[#005CE6] text-white font-bold text-sm px-2 py-0.5 rounded">{review.score}/10</span>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed pl-12">"{review.text}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right sticky summary card */}
                <div className="w-72 flex-shrink-0">
                    <div className="bg-white rounded-xl border border-[#005CE6] shadow-lg p-5 sticky top-24">
                        <div className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">{t('detail.startingFrom', 'Starting from')}</div>
                        <div className="text-3xl font-black text-[#005CE6] mb-1">
                            {Math.min(...hotel.rooms.map(r => Number(r.price))).toLocaleString('vi-VN')} <span className="text-lg font-bold">VNĐ</span>
                        </div>
                        <div className="text-sm text-gray-500 mb-4">/ {t('detail.nightUnit', 'night')} · {t('search.inclTaxes', 'incl. taxes')}</div>

                        <div className="bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-lg mb-4 inline-block">
                            {t('detail.bestPriceGuaranteed', '✓ Best price guaranteed')}
                        </div>

                        <div className="border-t border-gray-100 pt-4 mt-2 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">{t('detail.checkinPlaceholder', 'Check-in')}</span>
                                <span className="font-bold">Oct 12, 2024</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">{t('detail.checkoutPlaceholder', 'Check-out')}</span>
                                <span className="font-bold">Oct 15, 2024</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">{t('search.guests', 'Guests')}</span>
                                <span className="font-bold">{t('guests.2adults1room', '2 Adults')}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => handleSelectRoom()}
                            className="w-full mt-5 bg-[#005CE6] text-white py-3 rounded-xl font-bold text-base hover:bg-blue-700 transition-colors"
                        >
                            {isAuthenticated ? t('detail.chooseRoom', 'Select Room') : t('detail.signInToBook', 'Sign In to Book')}
                        </button>

                        {!isAuthenticated && (
                            <p className="text-center text-xs text-gray-400 mt-2">
                                {t('detail.signInToUnlock', 'Sign in to unlock member rates')}
                            </p>
                        )}

                        <div className="mt-4 bg-gray-50 rounded-lg p-3 text-xs text-gray-500 flex items-start gap-2">
                            <span className="material-symbols-outlined text-[16px] text-green-500 flex-shrink-0">verified</span>
                            {t('detail.trustPartnerNote', 'Verified Booking Travel Partner · Trusted by 3M+ travelers')}
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Lightbox */}
            {showAllImages && (
                <div className="fixed inset-0 z-[200] bg-black/90 flex flex-col items-center justify-center" onClick={() => setShowAllImages(false)}>
                    <button className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300" onClick={() => setShowAllImages(false)}>✕</button>
                    <div className="max-w-3xl w-full px-4" onClick={e => e.stopPropagation()}>
                        <img
                            src={hotel.images[selectedImageIdx]}
                            alt="Hotel"
                            className="w-full h-auto max-h-[70vh] object-contain rounded-xl mb-4"
                        />
                        <div className="flex gap-2 justify-center overflow-x-auto pb-2">
                            {hotel.images.map((img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    alt=""
                                    onClick={() => setSelectedImageIdx(i)}
                                    className={`w-20 h-14 object-cover rounded-lg cursor-pointer border-2 transition-all flex-shrink-0 ${i === selectedImageIdx ? 'border-[#005CE6]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Auth Modal */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialView="login"
            />
        </div>
    );
};

export default HotelDetail;
