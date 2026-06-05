import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { fetchHotelDetail } from '../../services/searchApi';
import type { HotelDetailResult, RoomTypeInfo, GuestSelection } from '../../types/search';
import GuestSelector from '../../components/ui/GuestSelector/GuestSelector';
import styles from './HotelDetail.module.css';

const { RangePicker } = DatePicker;

const PLACEHOLDER_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdIV-mcWLwmgavcRXse7Xu5pvGA6xrII2tYUSEJUDtH6r1X0EYvCzK6jaITBHixVwjwHOjepyqniZP4xajDAV4R4b-MGdCGGYYNTVZpFqorBX7m6c3YfNx1lLqR3uWFd07bTrOhHMgJxcH_hith4VAsY8laM965IrnTgm9ALmDhm7jrMUzf1iiTTVc1p2PcJdKInp8a0GKxC5AFfsIc6sM3N-DclU6C86m9b7QztHAj7PzqNrRRP13H0_LY7PhfWfus5GBLzfFlbs';

const fmt = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const HotelDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [detail, setDetail] = useState<HotelDetailResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [dates, setDates] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
    const [guests, setGuests] = useState<GuestSelection>({ adults: 2, children: 0, rooms: 1 });
    const [selectedRoom, setSelectedRoom] = useState<number | null>(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        fetchHotelDetail(id)
            .then((res) => { setDetail(res.data); setError(null); })
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [id]);

    const disabledDate = (current: Dayjs) => current && current < dayjs().startOf('day');
    const handleDateChange = (values: [Dayjs | null, Dayjs | null] | null) => setDates(values ?? [null, null]);

    const nights = useMemo(() => {
        const [checkIn, checkOut] = dates;
        return checkIn && checkOut ? checkOut.diff(checkIn, 'day') : 0;
    }, [dates]);

    const totalGuests = guests.adults + guests.children;
    const filteredRooms = useMemo(() => {
        if (!detail) return [];
        return detail.rooms.map((room) => ({ ...room, isAvailable: room.maxGuests >= totalGuests }));
    }, [detail, totalGuests]);

    const selectedRoomData = detail?.rooms.find((r) => r.roomTypeId === selectedRoom);
    const totalPrice = useMemo(() => {
        if (!selectedRoomData || nights <= 0) return 0;
        return selectedRoomData.price * nights * guests.rooms;
    }, [selectedRoomData, nights, guests.rooms]);

    const handleBook = () => {
        if (!detail || !selectedRoomData) return;
        navigate('/checkout', {
            state: {
                hotel: detail.hotel,
                room: selectedRoomData,
                dates: { checkIn: dates[0]?.format('YYYY-MM-DD'), checkOut: dates[1]?.format('YYYY-MM-DD') },
                nights,
                guests,
                totalPrice,
            },
        });
    };

    if (loading) {
        return (
            <div className={styles.loadingState}>
                <span className={`material-symbols-outlined ${styles.spinner}`}>progress_activity</span>
                <p>Đang tải thông tin khách sạn...</p>
            </div>
        );
    }

    if (error || !detail) {
        return (
            <div className={styles.errorState}>
                <span className="material-symbols-outlined" style={{ fontSize: 48 }}>error</span>
                <p style={{ fontWeight: 700 }}>Không tìm thấy khách sạn</p>
                <p style={{ fontSize: 13 }}>{error}</p>
                <Link to="/hotels" style={{ color: 'var(--vt-primary)', fontWeight: 600 }}>← Quay lại tìm kiếm</Link>
            </div>
        );
    }

    const { hotel, reviews } = detail;

    return (
        <div className={styles.detailPage}>
            <div className={styles.breadcrumb}>
                <Link to="/">Trang chủ</Link> / <Link to="/hotels">Khách sạn</Link> / {hotel.name}
            </div>

            <div className={styles.heroGallery}>
                <img src={PLACEHOLDER_IMG} alt={hotel.name} className={styles.heroImg} />
            </div>

            <div className={styles.header}>
                <div className={styles.headerInner}>
                    <div>
                        <h1 className={styles.hotelName}>{hotel.name}</h1>
                        <span className={styles.stars}>{'⭐'.repeat(Math.min(hotel.stars, 5))}</span>
                        <div className={styles.address}>
                            <span className={`material-symbols-outlined ${styles.icon}`}>location_on</span>
                            {hotel.address}
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.content}>
                {/* Left – Rooms & Reviews */}
                <div className={styles.mainCol}>
                    <h3 className={styles.sectionTitle}>Chọn loại phòng</h3>

                    {filteredRooms.length === 0 ? (
                        <div className={styles.noRooms}>Không có phòng phù hợp</div>
                    ) : (
                        filteredRooms.map((room) => (
                            <RoomCard
                                key={room.roomTypeId}
                                room={room}
                                isSelected={selectedRoom === room.roomTypeId}
                                onSelect={() => setSelectedRoom(room.roomTypeId)}
                            />
                        ))
                    )}

                    {reviews.length > 0 && (
                        <div className={styles.reviewsSection}>
                            <h3 className={styles.sectionTitle}>Đánh giá ({reviews.length})</h3>
                            {reviews.map((review, idx) => (
                                <div key={idx} className={styles.reviewCard}>
                                    <div className={styles.reviewHeader}>
                                        <span className={styles.reviewUser}>{review.userName}</span>
                                        <span className={styles.reviewDate}>
                                            {review.date ? new Date(review.date).toLocaleDateString('vi-VN') : ''}
                                        </span>
                                    </div>
                                    <div className={styles.reviewStars}>{'⭐'.repeat(Math.min(review.rating, 5))}</div>
                                    <p className={styles.reviewComment}>{review.comment || 'Không có bình luận'}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right – Booking Sidebar */}
                <div className={styles.sidebar}>
                    <div className={styles.bookingCard}>
                        <h3>Đặt phòng</h3>

                        <div className={styles.datePickerWrapper}>
                            <span className={styles.fieldLabel}>Ngày nhận / trả phòng</span>
                            <RangePicker
                                value={dates}
                                onChange={handleDateChange}
                                disabledDate={disabledDate}
                                format="DD/MM/YYYY"
                                placeholder={['Nhận phòng', 'Trả phòng']}
                                style={{ width: '100%' }}
                                size="large"
                            />
                            {nights > 0 && (
                                <div className={styles.nightsInfo}>
                                    <span className={`material-symbols-outlined ${styles.icon}`}>dark_mode</span>
                                    {nights} đêm
                                </div>
                            )}
                        </div>

                        <div className={styles.guestWrapper}>
                            <span className={styles.fieldLabel}>Số khách & phòng</span>
                            <GuestSelector value={guests} onChange={setGuests} />
                        </div>

                        {selectedRoomData && nights > 0 && (
                            <div className={styles.priceBreakdown}>
                                <div className={styles.priceRow}>
                                    <span>{selectedRoomData.name}</span>
                                    <span>{fmt(selectedRoomData.price)} / đêm</span>
                                </div>
                                <div className={styles.priceRow}>
                                    <span>{nights} đêm × {guests.rooms} phòng</span>
                                    <span>{fmt(totalPrice)}</span>
                                </div>
                                <div className={styles.priceTotalRow}>
                                    <span>Tổng cộng</span>
                                    <span>{fmt(totalPrice)}</span>
                                </div>
                            </div>
                        )}

                        <button
                            className={styles.bookButton}
                            onClick={handleBook}
                            disabled={!selectedRoomData || nights <= 0}
                        >
                            <span className="material-symbols-outlined">shopping_cart</span>
                            {selectedRoomData && nights > 0 ? 'Đặt ngay' : 'Chọn phòng & ngày'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface RoomCardProps {
    room: RoomTypeInfo & { isAvailable: boolean };
    isSelected: boolean;
    onSelect: () => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, isSelected, onSelect }) => (
    <div className={`${styles.roomCard} ${!room.isAvailable ? styles.unavailable : ''}`}>
        <div className={styles.roomInfo}>
            <h4>{room.name}</h4>
            <div className={styles.roomMeta}>
                <span>
                    <span className={`material-symbols-outlined ${styles.icon}`}>person</span>
                    Tối đa {room.maxGuests} khách
                </span>
                <span>
                    <span className={`material-symbols-outlined ${styles.icon}`}>bed</span>
                    {room.name}
                </span>
            </div>
        </div>
        <div className={styles.roomPrice}>
            <span className={styles.amount}>{fmt(room.price)}</span>
            <span className={styles.unit}>/ đêm</span>
            <button
                className={`${styles.selectRoomBtn} ${isSelected ? styles.selected : ''}`}
                onClick={onSelect}
                disabled={!room.isAvailable}
            >
                {isSelected ? '✓ Đã chọn' : 'Chọn phòng'}
            </button>
        </div>
    </div>
);

export default HotelDetail;
