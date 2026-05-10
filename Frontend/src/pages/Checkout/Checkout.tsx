import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
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

    const [paymentMethod, setPaymentMethod] = useState('momo');
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        notes: '',
    });
    const [errors, setErrors] = useState<Partial<typeof form>>({});

    if (!booking) {
        return (
            <div className={styles.noBooking}>
                <span className="material-symbols-outlined">shopping_cart_off</span>
                <p>Không có thông tin đặt phòng</p>
                <Link to="/hotels">← Quay lại tìm kiếm khách sạn</Link>
            </div>
        );
    }

    const taxAmount = Math.round(booking.totalPrice * TAX_RATE);
    const grandTotal = booking.totalPrice + taxAmount;

    const validate = () => {
        const e: Partial<typeof form> = {};
        if (!form.fullName.trim()) e.fullName = 'Vui lòng nhập họ tên';
        if (!form.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) e.email = 'Email không hợp lệ';
        if (!form.phone.match(/^(0|\+84)[0-9]{8,10}$/)) e.phone = 'Số điện thoại không hợp lệ';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className={styles.successPage}>
                <div className={styles.successCard}>
                    <div className={styles.successIcon}>
                        <span className="material-symbols-outlined">check_circle</span>
                    </div>
                    <h2>Đặt phòng thành công!</h2>
                    <p>Mã đặt phòng của bạn: <strong>VT-{Math.random().toString(36).slice(2, 8).toUpperCase()}</strong></p>
                    <p>Thông tin xác nhận sẽ được gửi đến <strong>{form.email}</strong></p>
                    <div className={styles.successActions}>
                        <button className={styles.btnPrimary} onClick={() => navigate('/')}>
                            <span className="material-symbols-outlined">home</span>
                            Về trang chủ
                        </button>
                        <button className={styles.btnOutline} onClick={() => navigate('/hotels')}>
                            <span className="material-symbols-outlined">hotel</span>
                            Đặt thêm phòng
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
                <Link to="/">Trang chủ</Link>
                <span>/</span>
                <Link to="/hotels">Khách sạn</Link>
                <span>/</span>
                <Link to={`/hotels/${booking.hotel.id}`}>{booking.hotel.name}</Link>
                <span>/</span>
                <span>Thanh toán</span>
            </div>

            <div className={styles.checkoutGrid}>
                {/* ── Left Column: Form ── */}
                <div className={styles.formCol}>
                    {/* Passenger Details */}
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>
                            <span className="material-symbols-outlined">person</span>
                            Thông tin khách hàng
                        </h2>
                        <form className={styles.form} onSubmit={handleSubmit}>
                            <div className={styles.formRow}>
                                <div className={styles.fieldGroup}>
                                    <label className={styles.label}>Họ và tên *</label>
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
                                    <label className={styles.label}>Số điện thoại *</label>
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
                                <label className={styles.label}>Email *</label>
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
                                <label className={styles.label}>Ghi chú (tuỳ chọn)</label>
                                <textarea
                                    className={styles.textarea}
                                    rows={3}
                                    placeholder="Yêu cầu đặc biệt, giờ nhận phòng dự kiến..."
                                    value={form.notes}
                                    onChange={e => setForm({ ...form, notes: e.target.value })}
                                />
                            </div>

                            {/* Payment Method */}
                            <h2 className={`${styles.cardTitle} ${styles.mt24}`}>
                                <span className="material-symbols-outlined">payment</span>
                                Phương thức thanh toán
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
                                            <p className={styles.paymentLabel}>{method.label}</p>
                                            <p className={styles.paymentDesc}>{method.desc}</p>
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
                                Xác nhận & Thanh toán {fmt(grandTotal)}
                            </button>
                            <p className={styles.secureNote}>
                                <span className="material-symbols-outlined">verified_user</span>
                                Giao dịch được bảo vệ bởi mã hóa SSL 256-bit
                            </p>
                        </form>
                    </div>
                </div>

                {/* ── Right Column: Order Summary ── */}
                <div className={styles.summaryCol}>
                    <div className={styles.summaryCard}>
                        <h2 className={styles.cardTitle}>
                            <span className="material-symbols-outlined">receipt_long</span>
                            Chi tiết đặt phòng
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
                                <span>Phòng</span>
                                <span>{booking.room.name}</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Nhận phòng</span>
                                <span>{booking.dates.checkIn
                                    ? new Date(booking.dates.checkIn).toLocaleDateString('vi-VN')
                                    : '—'
                                }</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Trả phòng</span>
                                <span>{booking.dates.checkOut
                                    ? new Date(booking.dates.checkOut).toLocaleDateString('vi-VN')
                                    : '—'
                                }</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Số đêm</span>
                                <span>{booking.nights} đêm</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Số phòng</span>
                                <span>{booking.guests.rooms} phòng</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Số khách</span>
                                <span>{booking.guests.adults} người lớn{booking.guests.children > 0 ? `, ${booking.guests.children} trẻ em` : ''}</span>
                            </div>
                        </div>

                        <hr className={styles.divider} />

                        {/* Price Breakdown */}
                        <div className={styles.summaryRows}>
                            <div className={styles.summaryRow}>
                                <span>Giá phòng</span>
                                <span>{fmt(booking.room.price)} × {booking.nights}đêm × {booking.guests.rooms}phòng</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Tạm tính</span>
                                <span>{fmt(booking.totalPrice)}</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Thuế & phí (8%)</span>
                                <span>{fmt(taxAmount)}</span>
                            </div>
                        </div>

                        <div className={styles.grandTotal}>
                            <span>Tổng thanh toán</span>
                            <span>{fmt(grandTotal)}</span>
                        </div>

                        <div className={styles.priceNote}>
                            Giá đã bao gồm thuế VAT và phí dịch vụ
                        </div>
                    </div>

                    {/* Cancellation Policy */}
                    <div className={`${styles.summaryCard} ${styles.policyCard}`}>
                        <h3 className={styles.policyTitle}>
                            <span className="material-symbols-outlined">policy</span>
                            Chính sách hủy phòng
                        </h3>
                        <p className={styles.policyText}>
                            Miễn phí hủy phòng trước <strong>24 giờ</strong> so với giờ nhận phòng. Sau thời điểm đó, phí hủy sẽ tương đương <strong>1 đêm đầu tiên</strong>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
