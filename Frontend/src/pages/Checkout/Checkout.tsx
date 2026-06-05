import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Modal, Spin } from 'antd';
import { bookingApi } from '../../services/bookingApi';
import { createVNPayUrl, redirectToVNPay } from '../../services/paymentApi';
import { useLanguage } from '../../context';
import styles from './Checkout.module.css';

interface BookingState {
    hotel: {
        id: number | string;
        name: string;
        address: string;
        stars: number;
    };
    room: {
        roomTypeId: number;
        name: string;
        price: number;
    };
    dates: {
        checkIn: string;
        checkOut: string;
    };
    nights: number;
    guests: {
        adults: number;
        children: number;
        rooms: number;
    };
    totalPrice: number;
}

const PAYMENT_METHODS = [
    { id: 'momo', label: 'MoMo', icon: '💜', desc: 'Ví điện tử MoMo' },
    { id: 'vnpay', label: 'VNPay', icon: '🟦', desc: 'Thanh toán qua VNPay' },
    { id: 'credit', label: 'Thẻ tín dụng / ghi nợ', icon: '💳', desc: 'Visa, Mastercard, JCB' },
    { id: 'bank', label: 'Chuyển khoản ngân hàng', icon: '🏦', desc: 'ATM / Internet Banking' },
];

const fmt = (n: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const TAX_RATE = 0.08;

const Checkout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const booking = location.state as BookingState | null;
    const { t, language } = useLanguage();

    const [paymentMethod, setPaymentMethod] = useState('vnpay'); // Default to VNPay for testing
    const [submitted, setSubmitted] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        notes: '',
    });
    const [errors, setErrors] = useState<Partial<typeof form>>({});

    const getMethodLabel = (id: string, defaultLabel: string) => {
        if (id === 'credit') return t('booking.card', defaultLabel);
        return t(`booking.${id}`, defaultLabel);
    };

    const getMethodDesc = (id: string, defaultDesc: string) => {
        if (id === 'credit') return t('booking.cardDesc', defaultDesc);
        return t(`booking.${id}Desc`, defaultDesc);
    };

    if (!booking) {
        return (
            <div className={styles.noBooking}>
                <span className="material-symbols-outlined">shopping_cart_off</span>
                <p>{t('checkout.noBooking', 'Không có thông tin đặt phòng')}</p>
                <Link to="/hotels">{t('checkout.backToSearch', '← Quay lại tìm kiếm khách sạn')}</Link>
            </div>
        );
    }

    const taxAmount = Math.round(booking.totalPrice * TAX_RATE);
    const grandTotal = booking.totalPrice + taxAmount;

    const validate = () => {
        const e: Partial<typeof form> = {};
        if (!form.fullName.trim()) e.fullName = t('checkout.errorName', 'Vui lòng nhập họ tên');
        if (!form.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) e.email = t('checkout.errorEmail', 'Email không hợp lệ');
        if (!form.phone.match(/^(0|\+84)[0-9]{8,10}$/)) e.phone = t('checkout.errorPhone', 'Số điện thoại không hợp lệ');
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        
        setIsProcessing(true);
        try {
            const userStr = localStorage.getItem('user');
            const userId = userStr ? JSON.parse(userStr).MaNguoiDung || JSON.parse(userStr).id : 1;

            const createBookingData = {
                UserID: userId,
                TongTien: grandTotal,
                details: [
                    {
                        nights: booking.nights,
                        price: booking.room.price,
                        type: 'hotel',
                        name: booking.room.name,
                        image: '',
                        detail1: booking.hotel.name,
                        detail2: booking.hotel.address,
                        detail3: booking.dates.checkIn,
                        detail4: booking.dates.checkOut
                    }
                ]
            };
            
            const bookingResult = await bookingApi.createBooking(createBookingData);
            const orderId = bookingResult.MaBooking;

            if (paymentMethod === 'vnpay') {
                const vnpayResult = await createVNPayUrl(grandTotal, orderId.toString());
                if (vnpayResult.success && vnpayResult.paymentUrl) {
                    redirectToVNPay(vnpayResult.paymentUrl);
                } else {
                    throw new Error(t('checkout.errorVNPay', 'Không thể tạo URL VNPay'));
                }
            } else {
                setSubmitted(true);
                setIsProcessing(false);
            }
        } catch (error: any) {
            console.error('Checkout error:', error);
            alert(t('checkout.errorOccurred', 'Có lỗi xảy ra: ') + error.message);
            setIsProcessing(false);
        }
    };

    if (isProcessing) {
        return (
            <Modal
                title={t('checkout.processing', 'Đang xử lý đặt phòng...')}
                visible={true}
                footer={null}
                closable={false}
                centered
            >
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <Spin size="large" />
                    <p style={{ marginTop: '1rem' }}>{t('checkout.waitMessage', 'Vui lòng đợi trong khi chúng tôi chuẩn bị thanh toán...')}</p>
                </div>
            </Modal>
        );
    }

    if (submitted) {
        return (
            <div className={styles.successPage}>
                <div className={styles.successCard}>
                    <div className={styles.successIcon}>
                        <span className="material-symbols-outlined">check_circle</span>
                    </div>
                    <h2>{t('checkout.successTitle', 'Đặt phòng thành công!')}</h2>
                    <p>{t('checkout.bookingCode', 'Mã đặt phòng của bạn: ')}<strong>VT-{Math.random().toString(36).slice(2, 8).toUpperCase()}</strong></p>
                    <p>{t('checkout.confirmSent', 'Thông tin xác nhận sẽ được gửi đến ')}<strong>{form.email}</strong></p>
                    <div className={styles.successActions}>
                        <button className={styles.btnPrimary} onClick={() => navigate('/')}>
                            <span className="material-symbols-outlined">home</span>
                            {t('booking.backToHome', 'Về trang chủ')}
                        </button>
                        <button className={styles.btnOutline} onClick={() => navigate('/hotels')}>
                            <span className="material-symbols-outlined">hotel</span>
                            {t('checkout.moreHotels', 'Đặt thêm phòng')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            {/* Breadcrumb */}
            <div className={styles.breadcrumb}>
                <Link to="/">{t('checkout.breadcrumbHome', 'Trang chủ')}</Link>
                <span>/</span>
                <Link to="/hotels">{t('checkout.breadcrumbHotels', 'Khách sạn')}</Link>
                <span>/</span>
                <Link to={`/hotels/${booking.hotel.id}`}>{booking.hotel.name}</Link>
                <span>/</span>
                <span>{t('checkout.breadcrumbPayment', 'Thanh toán')}</span>
            </div>

            <div className={styles.checkoutGrid}>
                {/* ── Left Column: Form ── */}
                <div className={styles.formCol}>
                    {/* Passenger Details */}
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>
                            <span className="material-symbols-outlined">person</span>
                            {t('checkout.customerInfo', 'Thông tin khách hàng')}
                        </h2>
                        <form className={styles.form} onSubmit={handleSubmit}>
                            <div className={styles.formRow}>
                                <div className={styles.fieldGroup}>
                                    <label className={styles.label}>{t('booking.fullName', 'Họ và tên')} *</label>
                                    <input
                                        type="text"
                                        className={`${styles.input} ${errors.fullName ? styles.inputError : ''}`}
                                        placeholder="Nguyễn Văn A"
                                        value={form.fullName}
                                        onChange={e => setForm({ ...form, fullName: e.target.value })}
                                    />
                                    {errors.fullName && <span className={styles.errorMsg}>{errors.fullName}</span>}
                                </div>
                                <div className={styles.fieldGroup}>
                                    <label className={styles.label}>{t('booking.phoneNumber', 'Số điện thoại')} *</label>
                                    <input
                                        type="tel"
                                        className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                                        placeholder="0901234567"
                                        value={form.phone}
                                        onChange={e => setForm({ ...form, phone: e.target.value })}
                                    />
                                    {errors.phone && <span className={styles.errorMsg}>{errors.phone}</span>}
                                </div>
                            </div>
                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>{t('booking.emailAddress', 'Email')} *</label>
                                <input
                                    type="email"
                                    className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                                    placeholder="email@example.com"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                />
                                {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
                            </div>
                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>{t('checkout.notesLabel', 'Ghi chú (tuỳ chọn)')}</label>
                                <textarea
                                    className={styles.textarea}
                                    rows={3}
                                    placeholder={t('checkout.notesPlaceholder', 'Yêu cầu đặc biệt, giờ nhận phòng dự kiến...')}
                                    value={form.notes}
                                    onChange={e => setForm({ ...form, notes: e.target.value })}
                                />
                            </div>

                            {/* Payment Method */}
                            <h2 className={`${styles.cardTitle} ${styles.mt24}`}>
                                <span className="material-symbols-outlined">payment</span>
                                {t('booking.paymentMethod', 'Phương thức thanh toán')}
                            </h2>
                            <div className={styles.paymentGrid}>
                                {PAYMENT_METHODS.map(method => (
                                    <label
                                        key={method.id}
                                        className={`${styles.paymentOption} ${paymentMethod === method.id ? styles.paymentSelected : ''}`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment"
                                            value={method.id}
                                            checked={paymentMethod === method.id}
                                            onChange={() => setPaymentMethod(method.id)}
                                            className={styles.radioHidden}
                                        />
                                        <span className={styles.paymentIcon}>{method.icon}</span>
                                        <div>
                                            <p className={styles.paymentLabel}>{getMethodLabel(method.id, method.label)}</p>
                                            <p className={styles.paymentDesc}>{getMethodDesc(method.id, method.desc)}</p>
                                        </div>
                                        <div className={styles.paymentCheck}>
                                            {paymentMethod === method.id && (
                                                <span className="material-symbols-outlined">check_circle</span>
                                            )}
                                        </div>
                                    </label>
                                ))}
                            </div>

                            {/* Submit */}
                            <button type="submit" className={styles.submitBtn}>
                                <span className="material-symbols-outlined">lock</span>
                                {t('booking.complete', 'Xác nhận & Thanh toán')} {fmt(grandTotal)}
                            </button>
                            <p className={styles.secureNote}>
                                <span className="material-symbols-outlined">verified_user</span>
                                {t('checkout.secureNote', 'Giao dịch được bảo vệ bởi mã hóa SSL 256-bit')}
                            </p>
                        </form>
                    </div>
                </div>

                {/* ── Right Column: Order Summary ── */}
                <div className={styles.summaryCol}>
                    <div className={styles.summaryCard}>
                        <h2 className={styles.cardTitle}>
                            <span className="material-symbols-outlined">receipt_long</span>
                            {t('flight.detailTitle', 'Chi tiết đặt phòng')}
                        </h2>

                        {/* Hotel Info */}
                        <div className={styles.hotelSummary}>
                            <div className={styles.hotelSummaryStars}>{'⭐'.repeat(Math.min(booking.hotel.stars, 5))}</div>
                            <h3 className={styles.hotelSummaryName}>{booking.hotel.name}</h3>
                            <p className={styles.hotelSummaryAddr}>
                                <span className="material-symbols-outlined">location_on</span>
                                {booking.hotel.address}
                            </p>
                        </div>

                        <hr className={styles.divider} />

                        {/* Stay Details */}
                        <div className={styles.summaryRows}>
                            <div className={styles.summaryRow}>
                                <span>{t('checkout.room', 'Phòng')}</span>
                                <span>{booking.room.name}</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>{t('checkout.checkin', 'Nhận phòng')}</span>
                                <span>{booking.dates.checkIn
                                    ? new Date(booking.dates.checkIn).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US')
                                    : '—'
                                }</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>{t('checkout.checkout', 'Trả phòng')}</span>
                                <span>{booking.dates.checkOut
                                    ? new Date(booking.dates.checkOut).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US')
                                    : '—'
                                }</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>{t('checkout.nightsCount', 'Số đêm')}</span>
                                <span>{booking.nights} {booking.nights > 1 ? t('booking.nightsPlural', 'đêm') : t('booking.nights', 'đêm')}</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>{t('checkout.roomsCount', 'Số phòng')}</span>
                                <span>{booking.guests.rooms} {t('detail.roomUnit', 'phòng')}</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>{t('checkout.guestsCount', 'Số khách')}</span>
                                <span>{booking.guests.adults} {language === 'vi' ? 'người lớn' : 'adult(s)'}{booking.guests.children > 0 ? `, ${booking.guests.children} ${language === 'vi' ? 'trẻ em' : 'child(ren)'}` : ''}</span>
                            </div>
                        </div>

                        <hr className={styles.divider} />

                        {/* Price Breakdown */}
                        <div className={styles.summaryRows}>
                            <div className={styles.summaryRow}>
                                <span>{t('booking.roomRate', 'Giá phòng')}</span>
                                <span>{fmt(booking.room.price)} × {booking.nights} {booking.nights > 1 ? t('booking.nightsPlural', 'đêm') : t('booking.nights', 'đêm')} × {booking.guests.rooms} {t('detail.roomUnit', 'phòng')}</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>{t('checkout.subtotal', 'Tạm tính')}</span>
                                <span>{fmt(booking.totalPrice)}</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>{t('checkout.taxFee', 'Thuế & phí (8%)')}</span>
                                <span>{fmt(taxAmount)}</span>
                            </div>
                        </div>

                        <div className={styles.grandTotal}>
                            <span>{t('booking.totalPrice', 'Tổng thanh toán')}</span>
                            <span>{fmt(grandTotal)}</span>
                        </div>

                        <div className={styles.priceNote}>
                            {t('checkout.vatNote', 'Giá đã bao gồm thuế VAT và phí dịch vụ')}
                        </div>
                    </div>

                    {/* Cancellation Policy */}
                    <div className={`${styles.summaryCard} ${styles.policyCard}`}>
                        <h3 className={styles.policyTitle}>
                            <span className="material-symbols-outlined">policy</span>
                            {t('checkout.policyTitle', 'Chính sách hủy phòng')}
                        </h3>
                        <p className={styles.policyText}>
                            {t('checkout.policyText', 'Miễn phí hủy phòng trước 24 giờ so với giờ nhận phòng. Sau thời điểm đó, phí hủy sẽ tương đương 1 đêm đầu tiên.')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
