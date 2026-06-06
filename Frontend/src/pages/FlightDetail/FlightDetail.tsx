import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { fetchFlightDetail } from '../../services/searchApi';
import type { FlightDetailResult, GuestSelection } from '../../types/search';
import GuestSelector from '../../components/ui/GuestSelector/GuestSelector';
import { useLanguage } from '../../context';
import styles from './FlightDetail.module.css';

const fmt = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const fmtTime = (dt: string) =>
    dt ? new Date(dt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '—';

const FlightDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { t } = useLanguage();

    const [flight, setFlight] = useState<FlightDetailResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Booking state
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [guests, setGuests] = useState<GuestSelection>({ adults: 1, children: 0, rooms: 1 });

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        fetchFlightDetail(id)
            .then((data) => {
                setFlight(data);
                // Pre-fill date from flight departure
                if (data.GioKhoiHanh) {
                    setSelectedDate(dayjs(data.GioKhoiHanh));
                }
                setError(null);
            })
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [id]);

    // Disable past dates
    const disabledDate = (current: Dayjs) => {
        return current && current < dayjs().startOf('day');
    };

    // Total price = GiaCoBan × passengers
    const totalPrice = useMemo(() => {
        if (!flight) return 0;
        return flight.GiaCoBan * guests.adults;
    }, [flight, guests.adults]);

    if (loading) {
        return (
            <div className={styles.loadingState}>
                <span className={`material-symbols-outlined ${styles.spinner}`}>progress_activity</span>
                <p>{t('detail.loadingFlight', 'Đang tải thông tin chuyến bay...')}</p>
            </div>
        );
    }

    if (error || !flight) {
        return (
            <div className={styles.errorState}>
                <span className="material-symbols-outlined" style={{ fontSize: 48 }}>error</span>
                <p style={{ fontWeight: 700 }}>{t('detail.flightNotFound', 'Không tìm thấy chuyến bay')}</p>
                <p style={{ fontSize: 13 }}>{error}</p>
                <Link to="/flights" style={{ color: '#1BA0E2', fontWeight: 600 }}>{t('detail.backToFlights', '← Quay lại tìm kiếm chuyến bay')}</Link>
            </div>
        );
    }

    const route = flight.TuyenDuong;
    const seatClass = (flight.HangGhe || 'Economy').toLowerCase();

    return (
        <div className={styles.detailPage}>
            {/* Breadcrumb */}
            <div className={styles.breadcrumb}>
                <Link to="/">{t('checkout.breadcrumbHome', 'Trang chủ')}</Link> / <Link to="/flights">{t('header.flights', 'Chuyến bay')}</Link> / CB-{flight.MaChuyenBay}
            </div>

            {/* Flight Info Card */}
            <div className={styles.flightCard}>
                <div className={styles.airline}>
                    <span className={styles.airlineName}>{flight.HangBay}</span>
                    <span className={`${styles.seatBadge} ${styles[seatClass]}`}>
                        {flight.HangGhe || 'Economy'}
                    </span>
                    <span style={{ color: '#9ca3af', fontSize: 13, marginLeft: 'auto' }}>
                        {t('detail.flightCode', 'Mã: CB-{code}').replace('{code}', String(flight.MaChuyenBay))}
                    </span>
                </div>

                <div className={styles.routeDisplay}>
                    <div className={styles.routePoint}>
                        <div className={styles.routeCode}>{route?.SanBayDi?.Code || '—'}</div>
                        <div className={styles.routeName}>{route?.SanBayDi?.Ten || '—'}</div>
                        <div className={styles.routeTime}>{fmtTime(flight.GioKhoiHanh)}</div>
                    </div>
                    <div className={styles.routeArrow}>
                        <span style={{ fontSize: 24 }}>✈</span>
                        <div className={styles.line} />
                    </div>
                    <div className={styles.routePoint}>
                        <div className={styles.routeCode}>{route?.SanBayDen?.Code || '—'}</div>
                        <div className={styles.routeName}>{route?.SanBayDen?.Ten || '—'}</div>
                        <div className={styles.routeTime}>{fmtTime(flight.GioHaCanh)}</div>
                    </div>
                </div>
            </div>

            {/* Booking Section */}
            <div className={styles.bookingSection}>
                <h3>{t('detail.bookTitle', 'Đặt vé')}</h3>

                <div className={styles.bookingGrid}>
                    {/* Date Picker */}
                    <div>
                        <span className={styles.fieldLabel}>{t('detail.departureDate', 'Ngày khởi hành')}</span>
                        <DatePicker
                            value={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            disabledDate={disabledDate}
                            format="DD/MM/YYYY"
                            placeholder={t('detail.selectDatePlaceholder', 'Chọn ngày bay')}
                            style={{ width: '100%' }}
                            size="large"
                        />
                    </div>

                    {/* Guest Selector (simple mode – passengers only) */}
                    <div>
                        <span className={styles.fieldLabel}>{t('detail.passengersCount', 'Số hành khách')}</span>
                        <GuestSelector value={guests} onChange={setGuests} simpleMode />
                    </div>
                </div>

                {/* Price */}
                <div className={styles.priceSection}>
                    <div>
                        <div className={styles.totalLabel}>{t('detail.totalPassengers', 'Tổng tiền ({count} hành khách)').replace('{count}', String(guests.adults))}</div>
                        <div className={styles.totalPrice}>{fmt(totalPrice)}</div>
                    </div>
                    <button className={styles.bookBtn}>
                        <span className="material-symbols-outlined">confirmation_number</span>
                        {t('detail.bookFlight', 'Đặt vé ngay')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FlightDetail;
