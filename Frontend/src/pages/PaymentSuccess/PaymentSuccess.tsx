import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Row, Col, Divider, Spin } from 'antd';
import styles from './PaymentSuccess.module.css';
import { bookingApi } from '../../services/bookingApi';

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

const PaymentSuccess: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
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
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

    if (loading) {
        return (
            <div className={styles.container}>
                <Card className={styles.loadingCard}>
                    <div className={styles.loadingContent}>
                        <Spin size="large" />
                        <p style={{ marginTop: '16px', fontWeight: 'bold', color: '#1f1f1f' }}>Đang tải chi tiết giao dịch...</p>
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
                        <h2>{error || "Không có thông tin giao dịch"}</h2>
                        <p>Vui lòng thử lại hoặc liên hệ với bộ phận hỗ trợ khách hàng của chúng tôi.</p>
                        <Button type="primary" size="large" onClick={() => navigate('/')}>
                            Quay về trang chủ
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
        if (type === 'flight') return 'Thông tin chuyến bay';
        if (type === 'train') return 'Thông tin chuyến tàu';
        if (type === 'bus') return 'Thông tin chuyến xe';
        if (type === 'tour') return 'Thông tin hoạt động / Tour';
        return 'Thông tin đặt phòng';
    };

    // Get return button label dynamically
    const getReturnButtonText = () => {
        if (type === 'flight') return 'Tìm kiếm chuyến bay khác';
        if (type === 'train') return 'Tìm kiếm chuyến tàu khác';
        if (type === 'bus') return 'Tìm kiếm xe khách khác';
        if (type === 'tour') return 'Tìm kiếm hoạt động khác';
        return 'Tìm kiếm khách sạn khác';
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
        const emailLabel = isAccommodation 
            ? 'đặt phòng' 
            : isTransport 
                ? 'đặt vé di chuyển' 
                : 'đặt tour/trải nghiệm';
        const contactLabel = isAccommodation 
            ? 'khách sạn' 
            : isTransport 
                ? 'hãng vận chuyển' 
                : 'nhà cung cấp dịch vụ';

        return (
            <ul>
                <li>✓ Email xác nhận sẽ được gửi trong vòng 5 phút</li>
                <li>✓ Vui lòng kiểm tra email để xem chi tiết {emailLabel}</li>
                <li>✓ Hãy lưu lại mã giao dịch để theo dõi đơn hàng</li>
                <li>✓ Liên hệ với {contactLabel} trước 24 giờ để hỗ trợ thay đổi hoặc hoàn hủy nếu được phép</li>
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
                    <h1>Thanh toán thành công!</h1>
                    <p>Đơn hàng của bạn đã được xác nhận. Chúng tôi sẽ gửi email xác nhận tới bạn.</p>
                </div>

                {/* Transaction Details */}
                <Card className={styles.detailCard}>
                    <div className={styles.transactionInfo}>
                        <h3>
                            <span className="material-symbols-outlined">receipt</span>
                            Chi tiết giao dịch
                        </h3>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoRow}>
                                <span>Mã giao dịch:</span>
                                <span className={styles.highlight}>{state?.transactionId}</span>
                            </div>
                            {customerInfo && (
                                <>
                                    <div className={styles.infoRow}>
                                        <span>Tên khách hàng:</span>
                                        <span>{customerInfo.fullName}</span>
                                    </div>
                                    <div className={styles.infoRow}>
                                        <span>Email:</span>
                                        <span>{customerInfo.email}</span>
                                    </div>
                                    <div className={styles.infoRow}>
                                        <span>Số điện thoại:</span>
                                        <span>{customerInfo.phone}</span>
                                    </div>
                                </>
                            )}
                            <div className={styles.infoRow}>
                                <span>Ngày thanh toán:</span>
                                <span>{new Date().toLocaleDateString('vi-VN')}</span>
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
                                                    <strong>Khách sạn / Căn hộ:</strong>
                                                    <p>{bookingInfo.name}</p>
                                                    <strong>Địa chỉ:</strong>
                                                    <p>{bookingInfo.detail1 || 'N/A'}</p>
                                                </div>
                                            </Col>
                                            <Col xs={24} sm={12}>
                                                <div className={styles.bookingDetail}>
                                                    <strong>Loại phòng:</strong>
                                                    <p>{bookingInfo.detail2 || 'Tiêu chuẩn'}</p>
                                                    <strong>Giá phòng:</strong>
                                                    <p>{fmt(bookingInfo.price)}/đêm</p>
                                                </div>
                                            </Col>
                                            <Col xs={24} sm={12}>
                                                <div className={styles.bookingDetail}>
                                                    <strong>Nhận phòng:</strong>
                                                    <p>{bookingInfo.dates?.checkIn ? new Date(bookingInfo.dates.checkIn).toLocaleDateString('vi-VN') : 'N/A'}</p>
                                                    <strong>Trả phòng:</strong>
                                                    <p>{bookingInfo.dates?.checkOut ? new Date(bookingInfo.dates.checkOut).toLocaleDateString('vi-VN') : 'N/A'}</p>
                                                </div>
                                            </Col>
                                            <Col xs={24} sm={12}>
                                                <div className={styles.bookingDetail}>
                                                    <strong>Số đêm nghỉ:</strong>
                                                    <p>{bookingInfo.nights} đêm</p>
                                                    <strong>Tổng tiền:</strong>
                                                    <p className={styles.totalPrice}>{fmt(bookingInfo.totalPrice)}</p>
                                                </div>
                                            </Col>
                                        </>
                                    )}

                                    {isTransport && (
                                        <>
                                            <Col xs={24} sm={12}>
                                                <div className={styles.bookingDetail}>
                                                    <strong>Hãng vận chuyển:</strong>
                                                    <p>{bookingInfo.name}</p>
                                                    <strong>Tuyến đường:</strong>
                                                    <p>{bookingInfo.detail3 || 'N/A'}</p>
                                                </div>
                                            </Col>
                                            <Col xs={24} sm={12}>
                                                <div className={styles.bookingDetail}>
                                                    <strong>Chi tiết chỗ ngồi:</strong>
                                                    <p>{bookingInfo.detail2 || 'Tiêu chuẩn'}</p>
                                                    <strong>Đơn giá:</strong>
                                                    <p>{fmt(bookingInfo.price)}</p>
                                                </div>
                                            </Col>
                                            <Col xs={24} sm={12}>
                                                <div className={styles.bookingDetail}>
                                                    <strong>Ngày đi:</strong>
                                                    <p>{bookingInfo.dates?.checkIn ? new Date(bookingInfo.dates.checkIn).toLocaleDateString('vi-VN') : new Date().toLocaleDateString('vi-VN')}</p>
                                                    <strong>Thời gian khởi hành:</strong>
                                                    <p>{bookingInfo.detail4 || 'N/A'}</p>
                                                </div>
                                            </Col>
                                            <Col xs={24} sm={12}>
                                                <div className={styles.bookingDetail}>
                                                    <strong>Tình trạng:</strong>
                                                    <p className="text-green-600 font-bold" style={{ fontSize: '15px' }}>✓ Đã xác nhận vé</p>
                                                    <strong>Tổng tiền thanh toán:</strong>
                                                    <p className={styles.totalPrice}>{fmt(bookingInfo.totalPrice)}</p>
                                                </div>
                                            </Col>
                                        </>
                                    )}

                                    {isTour && (
                                        <>
                                            <Col xs={24} sm={12}>
                                                <div className={styles.bookingDetail}>
                                                    <strong>Tên Tour / Trải nghiệm:</strong>
                                                    <p>{bookingInfo.name}</p>
                                                    <strong>Điểm đón / Địa điểm:</strong>
                                                    <p>{bookingInfo.detail1 || 'N/A'}</p>
                                                </div>
                                            </Col>
                                            <Col xs={24} sm={12}>
                                                <div className={styles.bookingDetail}>
                                                    <strong>Loại hình:</strong>
                                                    <p>{bookingInfo.detail2 || 'Dịch vụ du lịch trọn gói'}</p>
                                                    <strong>Giá vé / người:</strong>
                                                    <p>{fmt(bookingInfo.price)}</p>
                                                </div>
                                            </Col>
                                            <Col xs={24} sm={12}>
                                                <div className={styles.bookingDetail}>
                                                    <strong>Ngày tham gia:</strong>
                                                    <p>{bookingInfo.detail4 || (bookingInfo.dates?.checkIn ? new Date(bookingInfo.dates.checkIn).toLocaleDateString('vi-VN') : 'N/A')}</p>
                                                    <strong>Số lượng khách:</strong>
                                                    <p>{bookingInfo.detail3 || '1 khách'}</p>
                                                </div>
                                            </Col>
                                            <Col xs={24} sm={12}>
                                                <div className={styles.bookingDetail}>
                                                    <strong>Tình trạng vé:</strong>
                                                    <p className="text-green-600 font-bold" style={{ fontSize: '15px' }}>✓ Đã đăng ký giữ chỗ</p>
                                                    <strong>Tổng tiền thanh toán:</strong>
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
                            Bước tiếp theo
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
                        Về trang chủ
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
                        Cần hỗ trợ?
                    </h3>
                    <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với bộ phận chăm sóc khách hàng của chúng tôi.</p>
                    <p>
                        <strong>Hotline:</strong> 1900-1234 | <strong>Email:</strong> support@bookingtravelweb.com
                    </p>
                </Card>
            </div>
        </div>
    );
};

export default PaymentSuccess;

