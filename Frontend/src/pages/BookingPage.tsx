import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context';

import { createVNPayUrl, redirectToVNPay } from '../services/paymentApi';

// ─── Types ──────────────────────────────────────────────────────────────────
type PaymentMethod = 'card' | 'momo' | 'bank' | 'vnpay';

// ─── BookingPage ─────────────────────────────────────────────────────────────
const BookingPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { isAuthenticated, user, isAdmin } = useAuth();
    const { t } = useLanguage();

    // Redirect if not logged in or if admin
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
        } else if (isAdmin) {
            navigate('/admin');
        }
    }, [isAuthenticated, isAdmin, navigate]);

    // Order details from query params
    const type = searchParams.get('type') || 'hotel'; // hotel | villa | apartment | flight | train | bus
    const name = searchParams.get('name') || 'N/A';
    const image = searchParams.get('image') || '';
    const price = parseInt(searchParams.get('price') || '0');
    const nights = parseInt(searchParams.get('nights') || '1');
    const quantity = parseInt(searchParams.get('quantity') || '1');
    const detail1 = searchParams.get('detail1') || '';
    const detail2 = searchParams.get('detail2') || '';
    const detail3 = searchParams.get('detail3') || '';
    const detail4 = searchParams.get('detail4') || '';

    // Form state
    const [form, setForm] = useState({
        fullName: user ? `${user.Ho ?? ''} ${user.Ten ?? ''}`.trim() : '',
        email: user?.Email ?? '',
        phone: '',
        title: 'Mr.',
        passengerName: '',
        nationality: '',
        voucherCode: '',
        voucherApplied: false,
        voucherDiscount: 0,
    });
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    const isTransport = ['flight', 'train', 'bus'].includes(type);
    const isTour = type === 'tour';

    // ── Price helpers ─────────────────────────────────────────────────────────
    const subtotal = price * (isTour ? quantity : (isTransport ? 1 : nights));
    const serviceFee = Math.round(subtotal * 0.10);
    const voucherAmt = form.voucherApplied ? form.voucherDiscount : 0;
    const total = subtotal + serviceFee - voucherAmt;

    const typeBg: Record<string, string> = {
        hotel: 'bg-[#005CE6]', villa: 'bg-green-600', apartment: 'bg-purple-600',
        flight: 'bg-sky-500', train: 'bg-blue-800', bus: 'bg-amber-600',
        tour: 'bg-[#FF5E1F]',
    };
    const accentColor: Record<string, string> = {
        hotel: 'text-[#005CE6]', villa: 'text-green-600', apartment: 'text-purple-600',
        flight: 'text-sky-500', train: 'text-blue-800', bus: 'text-amber-600',
        tour: 'text-[#FF5E1F]',
    };
    const borderColor: Record<string, string> = {
        hotel: 'border-[#005CE6]', villa: 'border-green-500', apartment: 'border-purple-500',
        flight: 'border-sky-400', train: 'border-blue-700', bus: 'border-amber-500',
        tour: 'border-[#FF5E1F]',
    };
    // Fallback colors for unknown types (e.g. bills/top-up)
    const bgClass = typeBg[type] ?? 'bg-[#005CE6]';
    const accentClass = accentColor[type] ?? 'text-[#005CE6]';
    const borderClass = borderColor[type] ?? 'border-[#005CE6]';

    const applyVoucher = () => {
        if (form.voucherCode.toUpperCase() === 'TRAVEL30') {
            setForm(f => ({ ...f, voucherApplied: true, voucherDiscount: Math.round(subtotal * 0.30) }));
        } else if (form.voucherCode.toUpperCase() === 'SAVE500') {
            setForm(f => ({ ...f, voucherApplied: true, voucherDiscount: 500000 }));
        } else {
            alert(t('booking.invalidVoucher', 'Invalid voucher code. Try TRAVEL30 or SAVE500'));
        }
    };

    const handleSubmit = async () => {
        if (!form.fullName || !form.email) { alert(t('booking.fillRequiredFields', 'Please fill in all required fields.')); return; }
        if (!user) { alert(t('booking.loginRequired', 'You need to log in to make a booking.')); return; }
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';
            const response = await fetch(`${baseUrl}/booking/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify({
                    UserID: user.id,
                    TongTien: total,
                    details: [{
                        type,
                        name,
                        price,
                        nights,
                        image,
                        detail1,
                        detail2,
                        detail3,
                        detail4
                    }]
                }),
            });
            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.error || err.message || 'Không thể tạo đơn đặt vé');
            }
            const bookingResult = await response.json();
            
            if (paymentMethod === 'vnpay') {
                const vnpayResult = await createVNPayUrl(total, bookingResult.data.MaBooking.toString());
                if (vnpayResult.success && vnpayResult.paymentUrl) {
                    redirectToVNPay(vnpayResult.paymentUrl);
                } else {
                    throw new Error('Không thể tạo URL VNPay');
                }
            } else {
                if (paymentMethod === 'momo' || paymentMethod === 'bank' || paymentMethod === 'card') {
                    try {
                        const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';
                        await fetch(`${baseUrl}/booking/pay/${bookingResult.data.MaBooking}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                    } catch (payErr) {
                        console.error('Lỗi khi cập nhật trạng thái thanh toán:', payErr);
                    }
                }

                // Phân tích ngày nhận/trả phòng an toàn từ detail4
                let checkInDate = new Date().toISOString();
                let checkOutDate = new Date(Date.now() + 86400000 * (nights || 1)).toISOString();
                if (detail4 && detail4.includes(' - ')) {
                    const parts = detail4.split(' - ');
                    const parsedIn = Date.parse(parts[0]);
                    const parsedOut = Date.parse(parts[1]);
                    if (!isNaN(parsedIn)) checkInDate = new Date(parsedIn).toISOString();
                    if (!isNaN(parsedOut)) checkOutDate = new Date(parsedOut).toISOString();
                } else if (detail4) {
                    const parsedIn = Date.parse(detail4);
                    if (!isNaN(parsedIn)) {
                        checkInDate = new Date(parsedIn).toISOString();
                        checkOutDate = new Date(parsedIn + 86400000 * (nights || 1)).toISOString();
                    }
                }

                // Chuyển hướng sang trang /payment-success cho momo, bank, card
                navigate('/payment-success', {
                    state: {
                        transactionId: `TVK-PAY-${bookingResult.data.MaBooking}`,
                        bookingInfo: {
                            type,
                            name,
                            price,
                            totalPrice: total,
                            nights: nights || 1,
                            detail1,
                            detail2,
                            detail3,
                            detail4,
                            hotel: {
                                id: type === 'hotel' ? bookingResult.data.MaBooking : 'Service',
                                name: name,
                                address: detail1 || 'N/A',
                                stars: 5,
                            },
                            room: {
                                name: detail2 || t('booking.standardRoom', 'Standard Room'),
                                price: price,
                            },
                            dates: {
                                checkIn: checkInDate,
                                checkOut: checkOutDate,
                            },
                        },
                        customerInfo: {
                            fullName: form.fullName,
                            email: form.email,
                            phone: form.phone || 'N/A',
                        }
                    }
                });
            }
        } catch (err) {
            alert(err instanceof Error ? err.message : t('booking.failedTryAgain', 'Booking failed. Please try again.'));
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── Success Screen ────────────────────────────────────────────────────────
    if (bookingSuccess) {
        const bookingRef = `TVK-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
        return (
            <div className="min-h-screen bg-[#f5f7fa] flex items-center justify-center font-['Plus_Jakarta_Sans'] px-4">
                <div className="bg-white rounded-2xl shadow-xl p-10 max-w-lg w-full text-center">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                        <span className="material-symbols-outlined text-5xl text-green-500">check_circle</span>
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 mb-2">{t('booking.confirmed', 'Booking Confirmed!')}</h1>
                    <p className="text-gray-500 text-sm mb-6">{t('booking.confirmationEmailSent', 'Your booking has been successfully confirmed. A confirmation email has been sent to ')}<strong>{form.email}</strong>.</p>
                    <div className="bg-gray-50 rounded-xl p-5 mb-6 text-left border border-gray-100">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{t('booking.reference', 'Booking Reference')}</div>
                        <div className="text-2xl font-black text-[#005CE6] font-mono">{bookingRef}</div>
                        <div className="mt-3 border-t border-gray-200 pt-3 text-sm text-gray-600 space-y-1">
                            <div className="flex justify-between"><span>{t('booking.propertyService', 'Property/Service')}</span><span className="font-bold">{name}</span></div>
                            <div className="flex justify-between"><span>{t('booking.totalPaid', 'Total Paid')}</span><span className="font-bold">{total.toLocaleString()} VNĐ</span></div>
                        </div>
                    </div>
                    <button onClick={() => navigate('/')} className="w-full bg-[#005CE6] text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
                        {t('booking.backToHome', 'Back to Home')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f5f7fa] font-['Plus_Jakarta_Sans']">
            {/* ── Top Bar ── */}
            <div className="bg-white border-b border-gray-200 py-3 px-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#005CE6] text-2xl">flight_takeoff</span>
                    <span className="font-black text-xl text-gray-900">Booking Travel</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="material-symbols-outlined text-green-500 text-[18px]">lock</span>
                    {t('booking.secureCheckout', 'Secure Checkout')}
                </div>
                <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">close</span>
                    {t('booking.cancel', 'Cancel')}
                </button>
            </div>

            {/* ── Main Content ── */}
            <div className="max-w-[1100px] mx-auto px-4 py-8 flex gap-8">

                {/* ── Left Column (Forms) ── */}
                <div className="flex-1 min-w-0 flex flex-col gap-6">

                    {/* Step 1: Contact Details */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full ${bgClass} flex items-center justify-center`}>
                                <span className="material-symbols-outlined text-white text-[16px]">contact_page</span>
                            </div>
                            <h2 className="font-bold text-gray-900 text-lg">{t('booking.contactDetails', 'Contact Details')}</h2>
                        </div>
                        <div className="px-6 py-5 grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">{t('booking.fullName', 'Full Name')} <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    placeholder={t('booking.namePlaceholder', 'e.g. Nguyen Van A')}
                                    value={form.fullName}
                                    onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#005CE6] transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">{t('booking.emailAddress', 'Email Address')} <span className="text-red-500">*</span></label>
                                <input
                                    type="email"
                                    placeholder="email@example.com"
                                    value={form.email}
                                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#005CE6] transition-colors"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-semibold text-gray-500 mb-1">{t('booking.phoneNumber', 'Phone Number')}</label>
                                <div className="flex gap-2">
                                    <span className="border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-600 bg-gray-50 whitespace-nowrap">+84</span>
                                    <input
                                        type="tel"
                                        placeholder="090 123 4567"
                                        value={form.phone}
                                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                        className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#005CE6] transition-colors"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 2: Guest / Passenger Details */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full ${bgClass} flex items-center justify-center`}>
                                <span className="material-symbols-outlined text-white text-[16px]">person</span>
                            </div>
                            <h2 className="font-bold text-gray-900 text-lg">{isTransport ? t('booking.passengerDetails', 'Passenger Details') : t('booking.guestDetails', 'Guest Details')}</h2>
                        </div>
                        <div className="px-6 py-5">
                            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-start gap-3 mb-5 text-sm text-blue-700">
                                <span className="material-symbols-outlined text-[18px] flex-shrink-0 mt-0.5">info</span>
                                <span>{t('booking.nameMatchAlert', 'Please ensure names match passport or ID documents exactly.')}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">{t('booking.title', 'Title')}</label>
                                    <select
                                        value={form.title}
                                        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#005CE6] bg-white"
                                    >
                                        <option>Mr.</option>
                                        <option>Ms.</option>
                                        <option>Mrs.</option>
                                        <option>Dr.</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">{t('booking.fullName', 'Full Name')} <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        placeholder={t('booking.asAppearsOnPassport', 'AS APPEARS ON PASSPORT')}
                                        value={form.passengerName}
                                        onChange={e => setForm(f => ({ ...f, passengerName: e.target.value }))}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm uppercase placeholder:normal-case focus:outline-none focus:border-[#005CE6] transition-colors"
                                    />
                                </div>
                                <div className="col-span-3">
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">{t('booking.nationality', 'Nationality')}</label>
                                    <select
                                        value={form.nationality}
                                        onChange={e => setForm(f => ({ ...f, nationality: e.target.value }))}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#005CE6] bg-white"
                                    >
                                        <option value="">{t('booking.selectNationality', 'Select Nationality')}</option>
                                        <option value="VN">{t('booking.nationality.vn', '🇻🇳 Vietnamese')}</option>
                                        <option value="US">{t('booking.nationality.us', '🇺🇸 American')}</option>
                                        <option value="GB">{t('booking.nationality.gb', '🇬🇧 British')}</option>
                                        <option value="JP">{t('booking.nationality.jp', '🇯🇵 Japanese')}</option>
                                        <option value="KR">{t('booking.nationality.kr', '🇰🇷 Korean')}</option>
                                        <option value="SG">{t('booking.nationality.sg', '🇸🇬 Singaporean')}</option>
                                        <option value="AU">{t('booking.nationality.au', '🇦🇺 Australian')}</option>
                                        <option value="DE">{t('booking.nationality.de', '🇩🇪 German')}</option>
                                        <option value="FR">{t('booking.nationality.fr', '🇫🇷 French')}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 3: Payment Method */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full ${bgClass} flex items-center justify-center`}>
                                <span className="material-symbols-outlined text-white text-[16px]">credit_card</span>
                            </div>
                            <h2 className="font-bold text-gray-900 text-lg">{t('booking.paymentMethod', 'Payment Method')}</h2>
                        </div>
                        <div className="px-6 py-5 flex flex-col gap-3">
                            {([
                                { id: 'card', icon: 'credit_card', label: t('booking.card', 'Credit or Debit Card'), desc: t('booking.cardDesc', 'Visa, Mastercard, JCB, American Express'), color: 'text-[#005CE6]' },
                                { id: 'momo', icon: 'account_balance_wallet', label: t('booking.momo', 'MoMo E-Wallet'), desc: t('booking.momoDesc', 'Fast and secure local payment'), color: 'text-pink-600' },
                                { id: 'vnpay', icon: 'account_balance', label: t('booking.vnpay', 'VNPay'), desc: t('booking.vnpayDesc', 'Thanh toán an toàn qua VNPay Sandbox'), color: 'text-blue-600' },
                                { id: 'bank', icon: 'account_balance', label: t('booking.bank', 'Bank Transfer'), desc: t('booking.bankDesc', 'Direct transfer from local banks'), color: 'text-gray-600' },
                            ] as { id: PaymentMethod; icon: string; label: string; desc: string; color: string }[]).map(pm => (
                                <label
                                    key={pm.id}
                                    className={`flex items-center gap-4 border-2 rounded-xl px-5 py-4 cursor-pointer transition-all ${paymentMethod === pm.id ? `${borderClass} bg-blue-50/40` : 'border-gray-200 hover:border-gray-300'}`}
                                >
                                    <span className={`material-symbols-outlined text-2xl ${pm.color}`}>{pm.icon}</span>
                                    <div className="flex-1">
                                        <div className="font-bold text-sm text-gray-900">{pm.label}</div>
                                        <div className="text-xs text-gray-500">{pm.desc}</div>
                                    </div>
                                    <input
                                        type="radio"
                                        name="payment"
                                        checked={paymentMethod === pm.id}
                                        onChange={() => setPaymentMethod(pm.id)}
                                        className="w-4 h-4 accent-[#005CE6]"
                                    />
                                </label>
                            ))}

                            {/* Card input fields */}
                            {paymentMethod === 'card' && (
                                <div className="mt-3 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                                    <div className="col-span-2">
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">{t('booking.cardNumber', 'Card Number')}</label>
                                        <input type="text" placeholder="1234 5678 9012 3456" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#005CE6]" maxLength={19} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">{t('booking.expiryDate', 'Expiry Date')}</label>
                                        <input type="text" placeholder="MM / YY" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#005CE6]" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">{t('booking.cvv', 'CVV')}</label>
                                        <input type="text" placeholder="•••" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#005CE6]" maxLength={4} />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">{t('booking.cardholderName', 'Cardholder Name')}</label>
                                        <input type="text" placeholder={t('booking.cardholderPlaceholder', 'Name as on card')} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#005CE6]" />
                                    </div>
                                </div>
                            )}

                            {/* MoMo QR code */}
                            {paymentMethod === 'momo' && (
                                <div className="mt-3 border-t border-gray-100 pt-4 flex flex-col md:flex-row gap-5 items-center bg-pink-50/30 p-4 rounded-xl border border-pink-100">
                                    <div className="flex-shrink-0 bg-white p-2 rounded-xl shadow-md border border-pink-100 flex items-center justify-center max-w-[200px]">
                                        <img 
                                            src={`https://img.vietqr.io/image/VIB-966454800-print.png?amount=${total}&addInfo=BOOKING%20TRAVEL%20MOMO%20PAYMENT&accountName=TRINH%20DUC%20LOC`} 
                                            alt="MoMo QR" 
                                            className="w-44 h-44 object-contain rounded-lg"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-2 text-sm text-gray-700">
                                        <div className="font-bold text-pink-600 flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
                                            {t('booking.momoPayInstruction', 'Pay via MoMo Wallet / Banking App')}
                                        </div>
                                        <div className="text-xs text-gray-500 leading-relaxed">
                                            {t('booking.momoScanDesc', 'Please scan the QR code using your MoMo app or any Banking app to complete the automated transfer.')}
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-1.5 border-t border-pink-100/50 text-xs">
                                            <div>{t('booking.accHolder', 'Account Holder')}:</div>
                                            <div className="font-bold text-gray-900">TRỊNH ĐỨC LỘC</div>
                                            <div>{t('booking.accNumPhone', 'Phone/Account Number')}:</div>
                                            <div className="font-bold text-gray-900 font-mono">966454800</div>
                                            <div>{t('booking.receiveBank', 'Receiving Bank')}:</div>
                                            <div className="font-bold text-gray-900">VIB (Ngân hàng Quốc Tế)</div>
                                            <div>{t('booking.transferAmount', 'Transfer Amount')}:</div>
                                            <div className="font-bold text-pink-600 text-sm">{total.toLocaleString()} VNĐ</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Bank Transfer QR code */}
                            {paymentMethod === 'bank' && (
                                <div className="mt-3 border-t border-gray-100 pt-4 flex flex-col md:flex-row gap-5 items-center bg-blue-50/30 p-4 rounded-xl border border-blue-100">
                                    <div className="flex-shrink-0 bg-white p-2 rounded-xl shadow-md border border-blue-100 flex items-center justify-center max-w-[200px]">
                                        <img 
                                            src={`https://img.vietqr.io/image/VIB-966454800-print.png?amount=${total}&addInfo=BOOKING%20TRAVEL%20BANK%20PAYMENT&accountName=TRINH%20DUC%20LOC`} 
                                            alt="VietQR" 
                                            className="w-44 h-44 object-contain rounded-lg"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-2 text-sm text-gray-700">
                                        <div className="font-bold text-[#005CE6] flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
                                            {t('booking.vietqrPayInstruction', 'Pay via VietQR Transfer')}
                                        </div>
                                        <div className="text-xs text-gray-500 leading-relaxed">
                                            {t('booking.vietqrScanDesc', 'Scan the code with your banking app. Amount and transfer info are auto-generated for the fastest confirmation.')}
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-1.5 border-t border-blue-100/50 text-xs">
                                            <div>{t('booking.receiveBank', 'Receiving Bank')}:</div>
                                            <div className="font-bold text-gray-900">VIB (Ngân hàng Quốc Tế)</div>
                                            <div>{t('booking.accNumber', 'Account Number')}:</div>
                                            <div className="font-bold text-gray-900 font-mono">966454800</div>
                                            <div>{t('booking.accHolder', 'Account Holder')}:</div>
                                            <div className="font-bold text-gray-900">TRỊNH ĐỨC LỘC</div>
                                            <div>{t('booking.transferAmountVietqr', 'Amount')}:</div>
                                            <div className="font-bold text-[#005CE6] text-sm">{total.toLocaleString()} VNĐ</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Terms & Submit */}
                    <div className="text-center">
                        <p className="text-xs text-gray-400 mb-4">
                            {t('booking.termsNote', "By clicking \"Complete Booking\", you agree to Booking Travel's Terms of Service and Privacy Policy.")}
                        </p>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className={`w-full py-4 rounded-xl font-black text-white text-lg transition-all ${bgClass} hover:opacity-90 disabled:opacity-60 shadow-lg relative overflow-hidden`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    {t('booking.processing', 'Processing…')}
                                </span>
                            ) : t('booking.complete', 'Complete Booking')}
                        </button>
                    </div>
                </div>

                {/* ── Right Column (Order Summary) ── */}
                <div className="w-[320px] flex-shrink-0">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm sticky top-6 overflow-hidden">
                        {/* Image */}
                        {image && (
                            <div className="relative h-36 overflow-hidden">
                                <img src={image} alt={name} className="w-full h-full object-cover" />
                                <div className="absolute top-2 left-2">
                                    <span className={`${bgClass} text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1`}>
                                        <span className="material-symbols-outlined text-[14px]">verified</span>
                                        {isTour ? t('booking.verifiedTour', 'VERIFIED TOUR') : isTransport ? t('booking.verifiedTransport', 'VERIFIED TRANSPORT') : t('booking.verifiedStay', 'VERIFIED STAY')}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="p-5">
                            <h3 className="font-bold text-gray-900 text-base leading-tight mb-1">{name}</h3>
                            {detail1 && (
                                <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                                    {detail1}
                                </div>
                            )}

                            {/* Booking details */}
                            <div className="border-t border-gray-100 pt-3 space-y-2">
                                {detail2 && <div className="flex justify-between text-sm"><span className="text-gray-500">{isTransport ? t('booking.class', 'Class') : isTour ? t('booking.tourType', 'Tour Type') : t('booking.roomType', 'Room Type')}</span><span className="font-semibold text-gray-800">{detail2}</span></div>}
                                {!isTransport && !isTour && <div className="flex justify-between text-sm"><span className="text-gray-500">{t('booking.duration', 'Duration')}</span><span className="font-semibold text-gray-800">{nights} {nights === 1 ? t('booking.nights', 'Night') : t('booking.nightsPlural', 'Nights')}</span></div>}
                                {detail3 && <div className="flex justify-between text-sm"><span className="text-gray-500">{isTransport ? t('booking.route', 'Route') : t('booking.guests', 'Guests')}</span><span className="font-semibold text-gray-800">{detail3}</span></div>}
                                {detail4 && <div className="flex justify-between text-sm"><span className="text-gray-500">{isTransport ? t('booking.departure', 'Departure') : t('booking.dates', 'Dates')}</span><span className="font-semibold text-gray-800">{detail4}</span></div>}
                            </div>

                            {/* Voucher */}
                            <div className="mt-4 border-t border-gray-100 pt-4">
                                <div className="text-xs font-bold text-gray-500 mb-2">{t('booking.voucher', 'Voucher')}</div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder={t('booking.enterVoucherCode', 'Enter code')}
                                        value={form.voucherCode}
                                        onChange={e => setForm(f => ({ ...f, voucherCode: e.target.value, voucherApplied: false }))}
                                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#005CE6]"
                                        disabled={form.voucherApplied}
                                    />
                                    <button
                                        onClick={applyVoucher}
                                        disabled={form.voucherApplied}
                                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${form.voucherApplied ? 'bg-green-100 text-green-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                                    >
                                        {form.voucherApplied ? `✓ ${t('booking.applied', 'Applied')}` : t('booking.apply', 'Apply')}
                                    </button>
                                </div>
                            </div>

                            {/* Price breakdown */}
                            <div className="mt-4 border-t border-gray-100 pt-4 space-y-2">
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>
                                        {isTour 
                                            ? `${t('booking.tourPrice', 'Tour price')} (${quantity} ${t('booking.guests', 'guests').toLowerCase()})` 
                                            : isTransport 
                                                ? t('booking.ticketPrice', 'Ticket price')
                                                : `${t('booking.roomRate', 'Room rate')} (${nights} ${nights === 1 ? t('booking.nights', 'Night') : t('booking.nightsPlural', 'Nights')})`
                                        }
                                    </span>
                                    <span>{subtotal.toLocaleString()} VNĐ</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>{t('booking.serviceFeeTax', 'Service fee & Tax')}</span>
                                    <span>{serviceFee.toLocaleString()} VNĐ</span>
                                </div>
                                {form.voucherApplied && (
                                    <div className="flex justify-between text-sm text-green-600 font-semibold">
                                        <span>{t('booking.voucherDiscount', 'Voucher Discount')}</span>
                                        <span>- {voucherAmt.toLocaleString()} VNĐ</span>
                                    </div>
                                )}
                            </div>

                            {/* Total */}
                            <div className="mt-4 border-t border-gray-200 pt-4">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">{t('booking.totalPrice', 'TOTAL PRICE')}</div>
                                        <div className={`text-2xl font-black ${accentClass}`}>{total.toLocaleString()}</div>
                                        <div className="text-xs text-gray-400">VNĐ · {t('booking.taxInclNote', 'incl. all taxes and fees')}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Trust badge */}
                            <div className="mt-4 bg-gray-50 rounded-xl p-3 flex items-start gap-2 text-xs text-gray-500">
                                <span className="material-symbols-outlined text-[16px] text-green-500 flex-shrink-0">verified_user</span>
                                <span>{t('booking.trustNote', 'Trust Protection: Your payment is encrypted and handled through secure global standards.')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
