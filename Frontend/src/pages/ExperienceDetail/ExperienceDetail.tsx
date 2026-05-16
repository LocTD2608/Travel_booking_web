import React, { useState, useMemo } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { GuestSelection } from '../../types/search';
import GuestSelector from '../../components/ui/GuestSelector/GuestSelector';
import styles from './ExperienceDetail.module.css';

const fmt = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

/**
 * ExperienceDetail – page for DV_DU_LICH (travel service)
 * Since the backend doesn't have a dedicated experience detail API yet,
 * we read data from URL search params (passed from the list page).
 */
const ExperienceDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();

    // Read experience data from URL params (passed by list page)
    const experience = {
        MaDV: Number(id),
        description: searchParams.get('desc') || 'Tour du lịch trải nghiệm',
        price: Number(searchParams.get('price')) || 1500000,
        unit: searchParams.get('unit') || 'tour',
        pickup: searchParams.get('pickup') || 'Khách sạn',
        attraction: searchParams.get('attraction') || 'Điểm tham quan',
    };

    // Booking state
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [guests, setGuests] = useState<GuestSelection>({ adults: 1, children: 0, rooms: 1 });

    // Disable past dates
    const disabledDate = (current: Dayjs) => {
        return current && current < dayjs().startOf('day');
    };

    // Total = price × total people
    const totalPeople = guests.adults + guests.children;
    const totalPrice = useMemo(() => {
        return experience.price * totalPeople;
    }, [experience.price, totalPeople]);

    return (
        <div className={styles.detailPage}>
            {/* Breadcrumb */}
            <div className={styles.breadcrumb}>
                <Link to="/">Trang chủ</Link> / <Link to="/experience">Trải nghiệm</Link> / {experience.attraction}
            </div>

            {/* Info Card */}
            <div className={styles.infoCard}>
                <h1 className={styles.title}>{experience.attraction}</h1>
                <div className={styles.meta}>
                    <div className={styles.metaItem}>
                        <span className={`material-symbols-outlined ${styles.icon}`}>location_on</span>
                        Đón tại: {experience.pickup}
                    </div>
                    <div className={styles.metaItem}>
                        <span className={`material-symbols-outlined ${styles.icon}`}>confirmation_number</span>
                        Mã: DV-{experience.MaDV}
                    </div>
                    <div className={styles.metaItem}>
                        <span className={`material-symbols-outlined ${styles.icon}`}>payments</span>
                        {fmt(experience.price)} / {experience.unit}
                    </div>
                </div>
                <p className={styles.description}>{experience.description}</p>
            </div>

            {/* Booking Section */}
            <div className={styles.bookingSection}>
                <h3>Đặt trải nghiệm</h3>

                <div className={styles.bookingGrid}>
                    {/* Date Picker */}
                    <div>
                        <span className={styles.fieldLabel}>Ngày tham gia</span>
                        <DatePicker
                            value={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            disabledDate={disabledDate}
                            format="DD/MM/YYYY"
                            placeholder="Chọn ngày"
                            style={{ width: '100%' }}
                            size="large"
                        />
                    </div>

                    {/* Guest Selector */}
                    <div>
                        <span className={styles.fieldLabel}>Số người tham gia</span>
                        <GuestSelector value={guests} onChange={setGuests} simpleMode />
                    </div>
                </div>

                {/* Price */}
                <div className={styles.priceSection}>
                    <div>
                        <div className={styles.totalLabel}>Tổng tiền ({totalPeople} người)</div>
                        <div className={styles.totalPrice}>{fmt(totalPrice)}</div>
                    </div>
                    <button className={styles.bookBtn}>
                        <span className="material-symbols-outlined">local_activity</span>
                        Đặt ngay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExperienceDetail;
