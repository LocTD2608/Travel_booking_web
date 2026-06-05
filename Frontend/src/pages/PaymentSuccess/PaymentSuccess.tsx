import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Row, Col, Divider, Spin } from 'antd';
import styles from './PaymentSuccess.module.css';
import { bookingApi } from '../../services/bookingApi';
import { useLanguage } from '../../context';

interface PaymentSuccessState {
    transactionId: string;
    bookingInfo?: {
        type?: string;
        name?: string;
        price?: number;
        totalPrice?: number;
        nights?: number;
        detail1?: string;
        detail2?: string;
        detail3?: string;
        detail4?: string;
        hotel: {
            id: number | string;
            name: string;
            address: string;
            stars: number;
        };
        room: {
            name: string;
            price: number;
        };
        dates: {
            checkIn: string;
            checkOut: string;
        };
        nightsCount?: number;
        totalPriceAmt?: number;
    };
    customerInfo?: {
        fullName: string;
        email: string;
        phone: string;
    };
}

const translateDynamicValue = (val: string | undefined, language: string): string => {
    if (!val) return 'N/A';
    if (language === 'vi') {
        return val;
    }
    
    const lowerVal = val.toLowerCase().trim();
    
    // Room type / seat class / status
    if (lowerVal === 'tiêu chuẩn' || lowerVal === 'phòng tiêu chuẩn') return 'Standard Room';
    if (lowerVal === 'phổ thông' || lowerVal === 'hạng phổ thông' || lowerVal === 'economy') return 'Economy Class';
    if (lowerVal === 'thương gia' || lowerVal === 'hạng thương gia' || lowerVal === 'business') return 'Business Class';
    if (lowerVal === 'phòng deluxe' || lowerVal === 'deluxe') return 'Deluxe Room';
    if (lowerVal === 'phòng suite' || lowerVal === 'suite') return 'Suite Room';
    if (lowerVal === 'khách hàng') return 'Customer';
    if (lowerVal === 'dịch vụ du lịch') return 'Travel Service';
    if (lowerVal === 'dịch vụ du lịch trọn gói') return 'All-inclusive Travel Service';
    
    // Tour names
    if (lowerVal.includes('tour city')) return 'City Tour';
    if (lowerVal.includes('tour ha long 2n1d')) return 'Ha Long Bay Tour 2D1N';
    if (lowerVal.includes('tour da nang - hoi an')) return 'Da Nang - Hoi An Tour';
    if (lowerVal.includes('tour phu quoc 3n2d')) return 'Phu Quoc Island Tour 3D2N';
    if (lowerVal.includes('tour da lat san may')) return 'Da Lat Cloud Hunting Tour';
    if (lowerVal.includes('tour sapa trekking')) return 'Sapa Trekking Tour';
    if (lowerVal.includes('tour hue ancient capital')) return 'Hue Ancient Capital Tour';
    if (lowerVal.includes('tour nha trang island')) return 'Nha Trang Island Tour';
    if (lowerVal.includes('tour mekong delta')) return 'Mekong Delta Tour';
    if (lowerVal.includes('tour ba na hills')) return 'Ba Na Hills Tour';
    if (lowerVal.includes('tour mui ne resort')) return 'Mui Ne Resort Tour';
    if (lowerVal.includes('tour con dao relax')) return 'Con Dao Relax Tour';
    if (lowerVal.includes('tour ha giang loop')) return 'Ha Giang Loop Tour';
    if (lowerVal.includes('tour quy nhon beach')) return 'Quy Nhon Beach Tour';
    if (lowerVal.includes('tour ninh binh discovery')) return 'Ninh Binh Discovery Tour';
    if (lowerVal.includes('tour cat ba island')) return 'Cat Ba Island Tour';
    if (lowerVal.includes('tour resort maldives 5 sao hạng sang')) return 'Luxury 5-Star Maldives Resort Tour';
    if (lowerVal.includes('dai noi hue')) return 'Hue Imperial Citadel';
    
    let translated = val;
    
    const replacements: [RegExp, string][] = [
        [/đưa đón sân bay/gi, 'Airport Transfer'],
        [/thuê xe tự lái/gi, 'Self-drive Car Rental'],
        [/nạp tiền điện thoại/gi, 'Mobile Top-up'],
        [/gói dữ liệu/gi, 'Data Plan'],
        [/hóa đơn điện/gi, 'Electricity Bill'],
        [/hà nội/gi, 'Hanoi'],
        [/hồ chí minh/gi, 'Ho Chi Minh City'],
        [/đà nẵng/gi, 'Da Nang'],
        [/nha trang/gi, 'Nha Trang'],
        [/phú quốc/gi, 'Phu Quoc'],
        [/huế/gi, 'Hue'],
        [/đà lạt/gi, 'Da Lat'],
        [/vũng tàu/gi, 'Vung Tau'],
        [/hạ long/gi, 'Ha Long'],
        [/sapa/gi, 'Sapa'],
        [/phú sĩ/gi, 'Mt. Fuji'],
        [/nhật bản/gi, 'Japan'],
        [/chuyến/gi, 'Trip'],
        [/khứ hồi/gi, 'Round Trip'],
        [/vé/gi, 'Ticket'],
        [/cáp treo/gi, 'Cable Car'],
        [/khách sạn/gi, 'Hotel'],
        [/biệt thự/gi, 'Villa'],
        [/căn hộ/gi, 'Apartment'],
        [/đang xử lý/gi, 'Pending'],
        [/thành công/gi, 'Success'],
        [/đã thanh toán/gi, 'Paid'],
        [/chưa thanh toán/gi, 'Unpaid'],
        [/đã hủy/gi, 'Canceled'],
        [/đã hoàn tiền/gi, 'Refunded'],
        [/trải nghiệm du lịch trọn gói/gi, 'Package tour experience'],
        [/dịch vụ du lịch trọn gói/gi, 'All-inclusive Travel Service'],
        [/dịch vụ du lịch/gi, 'Travel Service'],
        [/khách du lịch/gi, 'Traveler(s)'],
        [/chọn ngày sau/gi, 'Choose date later'],
        [/phòng tiêu chuẩn/gi, 'Standard Room'],
        [/phòng deluxe/gi, 'Deluxe Room'],
        [/phòng suite/gi, 'Suite Room'],
        [/tiêu chuẩn/gi, 'Standard'],
        [/deluxe/gi, 'Deluxe'],
        [/suite/gi, 'Suite'],
        [/giường đơn/gi, 'Single Bed'],
        [/giường đôi/gi, 'Double Bed'],
        [/hướng biển/gi, 'Ocean View'],
        [/hướng thành phố/gi, 'City View'],
        [/hướng vườn/gi, 'Garden View'],
        [/ăn sáng miễn phí/gi, 'Free Breakfast'],
        [/không bao gồm ăn sáng/gi, 'Room Only'],
        [/hạng phổ thông/gi, 'Economy Class'],
        [/hạng thương gia/gi, 'Business Class'],
        [/phổ thông/gi, 'Economy'],
        [/thương gia/gi, 'Business'],
        [/người lớn/gi, 'adult(s)'],
        [/trẻ em/gi, 'child(ren)'],
        [/khách/gi, 'guest(s)']
    ];
    
    for (const [regex, replacement] of replacements) {
        translated = translated.replace(regex, replacement);
    }
    
    return translated;
};

const PaymentSuccess: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t, language } = useLanguage();
    const state = location.state as PaymentSuccessState | null;

    const [bookingInfo, setBookingInfo] = React.useState<any>(state?.bookingInfo || null);
    const [customerInfo, setCustomerInfo] = React.useState<any>(state?.customerInfo || null);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (!state) return;
        
        // If we already have bookingInfo and customerInfo, no need to fetch
        if (bookingInfo && customerInfo) return;

        const fetchDetails = async () => {
            setLoading(true);
            try {
                const rawTxId = state.transactionId;
                const bookingId = rawTxId.startsWith('TVK-PAY-')
                    ? rawTxId.replace('TVK-PAY-', '')
                    : rawTxId;

                const response = await bookingApi.getBookingDetail(bookingId);
                if (response.success && response.data) {
                    const { booking, details, user } = response.data;
                    const mainDetail = details && details.length > 0 ? details[0] : null;

                    let extraInfo = { detail1: '', detail2: '', detail3: '', detail4: '' };
                    if (mainDetail?.ThongTinThem) {
                        try {
                            extraInfo = JSON.parse(mainDetail.ThongTinThem);
                        } catch (e) {
                            console.error("Parse ThongTinThem error:", e);
                        }
                    }

                    // Format dates safely
                    let checkInDate = booking.ThoiDiemDat;
                    let checkOutDate = booking.ThoiDiemDat;
                    if (extraInfo.detail4 && extraInfo.detail4.includes(' - ')) {
                        const parts = extraInfo.detail4.split(' - ');
                        const parsedIn = Date.parse(parts[0]);
                        const parsedOut = Date.parse(parts[1]);
                        if (!isNaN(parsedIn)) checkInDate = new Date(parsedIn).toISOString();
                        if (!isNaN(parsedOut)) checkOutDate = new Date(parsedOut).toISOString();
                    } else if (extraInfo.detail4) {
                        const parsedIn = Date.parse(extraInfo.detail4);
                        if (!isNaN(parsedIn)) {
                            checkInDate = new Date(parsedIn).toISOString();
                            checkOutDate = new Date(parsedIn + 86400000).toISOString();
                        }
                    }

                    setBookingInfo({
                        type: mainDetail?.LoaiDoiTuong || 'hotel',
                        name: mainDetail?.TenDichVu || 'Dịch vụ du lịch',
                        price: mainDetail?.DonGia || 0,
                        totalPrice: booking.TongTien,
                        nights: mainDetail?.SoLuongNguoi || 1,
                        detail1: extraInfo.detail1 || 'N/A',
                        detail2: extraInfo.detail2 || 'Tiêu chuẩn',
                        detail3: extraInfo.detail3 || '',
                        detail4: extraInfo.detail4 || '',
                        dates: {
                            checkIn: checkInDate,
                            checkOut: checkOutDate,
                        }
                    });

                    setCustomerInfo({
                        fullName: user ? `${user.Ho ?? ''} ${user.Ten ?? ''}`.trim() : 'Khách hàng',
                        email: user?.Email || 'N/A',
                        phone: user?.SDT || 'N/A',
                    });
                } else {
                    throw new Error("Không thể lấy thông tin chi tiết đơn hàng");
                }
            } catch (err: any) {
                console.error("Fetch booking error:", err);
                setError(err.message || 'Không thể lấy thông tin chi tiết giao dịch');
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [state, state?.transactionId]);

    const fmt = (n: number) =>
        new Intl.NumberFormat(language === 'vi' ? 'vi-VN' : 'en-US', { style: 'currency', currency: 'VND' }).format(n);

    if (loading) {
        return (
            <div className={styles.container}>
                <Card className={styles.loadingCard}>
                    <div className={styles.loadingContent}>
                        <Spin size="large" />
                        <p style={{ marginTop: '16px', fontWeight: 'bold', color: '#1f1f1f' }}>{t('payment.success.loadingDetails', 'Đang tải chi tiết giao dịch...')}</p>
                    </div>
                </Card>
            </div>
        );
    }

    if (error || (!state && !bookingInfo)) {
        return (
            <div className={styles.container}>
                <Card className={styles.errorCard}>
                    <div className={styles.errorContent}>
                        <span className="material-symbols-outlined" style={{ fontSize: '64px', color: '#ff4d4f' }}>
                            error_outline
                        </span>
                        <h2>{error || t('payment.success.noTxnInfo', 'Không có thông tin giao dịch')}</h2>
                        <p>{t('payment.success.errorDesc', 'Vui lòng thử lại hoặc liên hệ với bộ phận hỗ trợ khách hàng của chúng tôi.')}</p>
                        <Button type="primary" size="large" onClick={() => navigate('/')}>
                            {t('payment.success.backHome', 'Quay về trang chủ')}
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    const type = bookingInfo?.type || 'hotel';
    const isAccommodation = ['hotel', 'villa', 'apartment'].includes(type);
    const isTransport = ['flight', 'train', 'bus'].includes(type);
    const isTour = type === 'tour';

    // Get material icon dynamically
    const getIcon = () => {
        if (type === 'flight') return 'flight';
        if (type === 'train') return 'train';
        if (type === 'bus') return 'directions_bus';
        if (type === 'tour') return 'local_activity';
        return 'hotel';
    };

    // Get section title dynamically
    const getTitle = () => {
        if (type === 'flight') return t('payment.success.titleFlight', 'Thông tin chuyến bay');
        if (type === 'train') return t('payment.success.titleTrain', 'Thông tin chuyến tàu');
        if (type === 'bus') return t('payment.success.titleBus', 'Thông tin chuyến xe');
        if (type === 'tour') return t('payment.success.titleTour', 'Thông tin hoạt động / Tour');
        return t('payment.success.titleHotel', 'Thông tin đặt phòng');
    };

    // Get return button label dynamically
    const getReturnButtonText = () => {
        if (type === 'flight') return t('payment.success.btnReturnFlight', 'Tìm kiếm chuyến bay khác');
        if (type === 'train') return t('payment.success.btnReturnTrain', 'Tìm kiếm chuyến tàu khác');
        if (type === 'bus') return t('payment.success.btnReturnBus', 'Tìm kiếm xe khách khác');
        if (type === 'tour') return t('payment.success.btnReturnTour', 'Tìm kiếm hoạt động khác');
        return t('payment.success.btnReturnHotel', 'Tìm kiếm khách sạn khác');
    };

    // Get return button path dynamically
    const getReturnButtonPath = () => {
        if (type === 'flight') return '/flights';
        if (type === 'train') return '/trains';
        if (type === 'bus') return '/bus';
        if (type === 'tour') return '/experience';
        return '/hotels';
    };

    // Get next steps dynamically
    const getNextSteps = () => {
        return (
            <ul>
                <li>{t('payment.success.nextStep1', '✓ Email xác nhận sẽ được gửi trong vòng 5 phút')}</li>
                {isAccommodation && <li>{t('payment.success.nextStep2Hotel', '✓ Vui lòng kiểm tra email để xem chi tiết đặt phòng')}</li>}
                {isTransport && <li>{t('payment.success.nextStep2Transport', '✓ Vui lòng kiểm tra email để xem chi tiết đặt vé di chuyển')}</li>}
                {isTour && <li>{t('payment.success.nextStep2Tour', '✓ Vui lòng kiểm tra email để xem chi tiết đặt tour/trải nghiệm')}</li>}
                <li>{t('payment.success.nextStep3', '✓ Hãy lưu lại mã giao dịch để theo dõi đơn hàng')}</li>
                {isAccommodation && <li>{t('payment.success.nextStep4Hotel', '✓ Liên hệ với khách sạn trước 24 giờ để hỗ trợ thay đổi hoặc hoàn hủy nếu được phép')}</li>}
                {isTransport && <li>{t('payment.success.nextStep4Transport', '✓ Liên hệ với hãng vận chuyển trước 24 giờ để hỗ trợ thay đổi hoặc hoàn hủy nếu được phép')}</li>}
                {isTour && <li>{t('payment.success.nextStep4Tour', '✓ Liên hệ với nhà cung cấp dịch vụ trước 24 giờ để hỗ trợ thay đổi hoặc hoàn hủy nếu được phép')}</li>}
            </ul>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.successContainer}>
                {/* Success Header */}
                <div className={styles.successHeader}>
                    <div className={styles.checkmark}>
                        <span className="material-symbols-outlined">check_circle</span>
                    </div>
                    <h1>{t('payment.success.successHeader', 'Thanh toán thành công!')}</h1>
                    <p>{t('payment.success.successDesc', 'Đơn hàng của bạn đã được xác nhận. Chúng tôi sẽ gửi email xác nhận tới bạn.')}</p>
                </div>

                {/* Transaction Details */}
                <Card className={styles.detailCard}>
                    <div className={styles.transactionInfo}>
                        <h3>
                            <span className="material-symbols-outlined">receipt</span>
                            {t('payment.success.txnDetailsTitle', 'Chi tiết giao dịch')}
                        </h3>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoRow}>
                                <span>{t('payment.success.txnIdLabel', 'Mã giao dịch:')}</span>
                                <span className={styles.highlight}>{state?.transactionId}</span>
                            </div>
                            {customerInfo && (
                                <>
                                    <div className={styles.infoRow}>
                                        <span>{t('payment.success.customerNameLabel', 'Tên khách hàng:')}</span>
                                        <span>{translateDynamicValue(customerInfo.fullName, language)}</span>
                                    </div>
                                    <div className={styles.infoRow}>
                                        <span>{t('payment.success.emailLabel', 'Email:')}</span>
                                        <span>{customerInfo.email}</span>
                                    </div>
                                    <div className={styles.infoRow}>
                                        <span>{t('payment.success.phoneLabel', 'Số điện thoại:')}</span>
                                        <span>{customerInfo.phone}</span>
                                    </div>
                                </>
                            )}
                            <div className={styles.infoRow}>
                                <span>{t('payment.success.paymentDateLabel', 'Ngày thanh toán:')}</span>
                                <span>{new Date().toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US')}</span>
                            </div>
                        </div>
                    </div>
 
                    {bookingInfo && (
                        <>
                            <Divider />
                            <div className={styles.bookingInfo}>
                                <h3>
                                    <span className="material-symbols-outlined">{getIcon()}</span>
                                    {getTitle()}
                                </h3>
                                <Row gutter={[16, 16]}>
                                    {isAccommodation && (
                                        <>
                                            <Col xs={24} sm={12}>
                                                <div className={styles.bookingDetail}>
                                                    <strong>{t('payment.success.hotelLabel', 'Khách sạn / Căn hộ:')}</strong>
                                                    <p>{translateDynamicValue(bookingInfo.name, language)}</p>
                                                    <strong>{t('payment.success.addressLabel', 'Địa chỉ:')}</strong>
                                                    <p>{translateDynamicValue(bookingInfo.detail1 || 'N/A', language)}</p>
                                                </div>
                                            </Col>
                                            <Col xs={24} sm={12}>
                                                <div className={styles.bookingDetail}>
                                                    <strong>{t('payment.success.roomTypeLabel', 'Loại phòng:')}</strong>
                                                    <p>{translateDynamicValue(bookingInfo.detail2 || 'Tiêu chuẩn', language)}</p>
                                                    <strong>{t('payment.success.roomPriceLabel', 'Giá phòng:')}</strong>
                                                    <p>{fmt(bookingInfo.price)}{t('payment.success.perNight', '/đêm')}</p>
                                                </div>
                                            </Col>
                                            <Col xs={24} sm={12}>
                                                <div className={styles.bookingDetail}>
                                                    <strong>{t('checkout.checkin', 'Nhận phòng')}:</strong>
                                                    <p>{bookingInfo.dates?.checkIn ? new Date(bookingInfo.dates.checkIn).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US') : 'N/A'}</p>
                                                    <strong>{t('checkout.checkout', 'Trả phòng')}:</strong>
                                                    <p>{bookingInfo.dates?.checkOut ? new Date(bookingInfo.dates.checkOut).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US') : 'N/A'}</p>
                                                </div>
                                            </Col>
                                            <Col xs={24} sm={12}>
                                                <div className={styles.bookingDetail}>
                                                    <strong>{t('payment.success.roomNightsLabel', 'Số đêm nghỉ:')}</strong>
                                                    <p>{bookingInfo.nights} {t('payment.success.nights', 'đêm')}</p>
                                                    <strong>{t('payment.success.totalPriceLabel', 'Tổng tiền:')}</strong>
                                                    <p className={styles.totalPrice}>{fmt(bookingInfo.totalPrice)}</p>
                                                </div>
                                            </Col>
                                        </>
                                    )}
 
                                    {isTransport && (
                                        <>
                                            <Col xs={24} sm={12}>
                                                <div className={styles.bookingDetail}>
                                                    <strong>{t('payment.success.providerLabel', 'Hãng vận chuyển:')}</strong>
                                                    <p>{translateDynamicValue(bookingInfo.name, language)}</p>
                                                    <strong>{t('payment.success.routeLabel', 'Tuyến đường:')}</strong>
                                                    <p>{translateDynamicValue(bookingInfo.detail3 || 'N/A', language)}</p>
                                                </div>
                                            </Col>
                                            <Col xs={24} sm={12}>
                                                <div className={styles.bookingDetail}>
                                                    <strong>{t('payment.success.seatsLabel', 'Chi tiết chỗ ngồi:')}</strong>
                                                    <p>{translateDynamicValue(bookingInfo.detail2 || 'Tiêu chuẩn', language)}</p>
                                                    <strong>{t('payment.success.unitPriceLabel', 'Đơn giá:')}</strong>
                                                    <p>{fmt(bookingInfo.price)}</p>
                                                </div>
                                            </Col>
                                            <Col xs={24} sm={12}>
                                                <div className={styles.bookingDetail}>
                                                    <strong>{t('payment.success.departureDateLabel', 'Ngày đi:')}</strong>
                                                    <p>{bookingInfo.dates?.checkIn ? new Date(bookingInfo.dates.checkIn).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US') : new Date().toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US')}</p>
                                                    <strong>{t('payment.success.departureTimeLabel', 'Thời gian khởi hành:')}</strong>
                                                    <p>{translateDynamicValue(bookingInfo.detail4 || 'N/A', language)}</p>
                                                </div>
                                            </Col>
                                            <Col xs={24} sm={12}>
                                                <div className={styles.bookingDetail}>
                                                    <strong>{t('payment.success.statusLabel', 'Tình trạng:')}</strong>
                                                    <p className="text-green-600 font-bold" style={{ fontSize: '15px' }}>{t('payment.success.statusConfirmed', '✓ Đã xác nhận vé')}</p>
                                                    <strong>{t('payment.success.totalPricePaidLabel', 'Tổng tiền thanh toán:')}</strong>
                                                    <p className={styles.totalPrice}>{fmt(bookingInfo.totalPrice)}</p>
                                                </div>
                                            </Col>
                                        </>
                                    )}
 
                                    {isTour && (
                                        <>
                                            <Col xs={24} sm={12}>
                                                <div className={styles.bookingDetail}>
                                                    <strong>{t('payment.success.tourNameLabel', 'Tên Tour / Trải nghiệm:')}</strong>
                                                    <p>{translateDynamicValue(bookingInfo.name, language)}</p>
                                                    <strong>{t('payment.success.tourPickupLabel', 'Điểm đón / Địa điểm:')}</strong>
                                                    <p>{translateDynamicValue(bookingInfo.detail1 || 'N/A', language)}</p>
                                                </div>
                                            </Col>
                                            <Col xs={24} sm={12}>
                                                <div className={styles.bookingDetail}>
                                                    <strong>{t('payment.success.tourTypeLabel', 'Loại hình:')}</strong>
                                                    <p>{translateDynamicValue(bookingInfo.detail2 || 'Dịch vụ du lịch trọn gói', language)}</p>
                                                    <strong>{t('payment.success.tourPriceLabel', 'Giá vé / người:')}</strong>
                                                    <p>{fmt(bookingInfo.price)}</p>
                                                </div>
                                            </Col>
                                            <Col xs={24} sm={12}>
                                                <div className={styles.bookingDetail}>
                                                    <strong>{t('payment.success.tourDateLabel', 'Ngày tham gia:')}</strong>
                                                    <p>{translateDynamicValue(bookingInfo.detail4, language) || (bookingInfo.dates?.checkIn ? new Date(bookingInfo.dates.checkIn).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US') : 'N/A')}</p>
                                                    <strong>{t('payment.success.tourGuestsLabel', 'Số lượng khách:')}</strong>
                                                    <p>{translateDynamicValue(bookingInfo.detail3, language) || `1 ${t('payment.success.guests', 'khách')}`}</p>
                                                </div>
                                            </Col>
                                            <Col xs={24} sm={12}>
                                                <div className={styles.bookingDetail}>
                                                    <strong>{t('payment.success.tourStatusLabel', 'Tình trạng vé:')}</strong>
                                                    <p className="text-green-600 font-bold" style={{ fontSize: '15px' }}>{t('payment.success.tourStatusConfirmed', '✓ Đã đăng ký giữ chỗ')}</p>
                                                    <strong>{t('payment.success.totalPricePaidLabel', 'Tổng tiền thanh toán:')}</strong>
                                                    <p className={styles.totalPrice}>{fmt(bookingInfo.totalPrice)}</p>
                                                </div>
                                            </Col>
                                        </>
                                    )}
                                </Row>
                            </div>
                        </>
                    )}

                    <Divider />
                    <div className={styles.nextSteps}>
                        <h3>
                            <span className="material-symbols-outlined">info</span>
                            {t('payment.success.nextStepsTitle', 'Bước tiếp theo')}
                        </h3>
                        {getNextSteps()}
                    </div>
                </Card>

                {/* Action Buttons */}
                <div className={styles.actionButtons}>
                    <Button
                        type="primary"
                        size="large"
                        onClick={() => navigate('/')}
                        className={styles.button}
                    >
                        <span className="material-symbols-outlined">home</span>
                        {t('payment.success.backHome', 'Về trang chủ')}
                    </Button>
                    <Button
                        size="large"
                        onClick={() => navigate(getReturnButtonPath())}
                        className={styles.button}
                    >
                        <span className="material-symbols-outlined">{getIcon()}</span>
                        {getReturnButtonText()}
                    </Button>
                </div>

                {/* Contact Support */}
                <Card className={styles.supportCard}>
                    <h3>
                        <span className="material-symbols-outlined">support_agent</span>
                        {t('payment.success.needSupport', 'Cần hỗ trợ?')}
                    </h3>
                    <p>{t('payment.success.supportDesc', 'Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với bộ phận chăm sóc khách hàng của chúng tôi.')}</p>
                    <p>
                        <strong>{t('payment.success.hotline', 'Hotline:')}</strong> 1900-1234 | <strong>{t('payment.success.email', 'Email:')}</strong> support@bookingtravelweb.com
                    </p>
                </Card>
            </div>
        </div>
    );
};

export default PaymentSuccess;

