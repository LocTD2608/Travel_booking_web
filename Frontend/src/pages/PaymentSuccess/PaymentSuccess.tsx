import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Row, Col, Divider } from 'antd';
import styles from './PaymentSuccess.module.css';

interface PaymentSuccessState {
    transactionId: string;
    bookingInfo?: {
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
        nights: number;
        totalPrice: number;
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

    const fmt = (n: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

    if (!state) {
        return (
            <div className={styles.container}>
                <Card className={styles.errorCard}>
                    <div className={styles.errorContent}>
                        <span className="material-symbols-outlined" style={{ fontSize: '64px', color: '#ff4d4f' }}>
                            error_outline
                        </span>
                        <h2>Không có thông tin giao dịch</h2>
                        <p>Vui lòng thử lại hoặc liên hệ với bộ phận hỗ trợ khách hàng.</p>
                        <Button type="primary" size="large" onClick={() => navigate('/hotels')}>
                            Quay về tìm kiếm khách sạn
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

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
                                <span className={styles.highlight}>{state.transactionId}</span>
                            </div>
                            {state.customerInfo && (
                                <>
                                    <div className={styles.infoRow}>
                                        <span>Tên khách hàng:</span>
                                        <span>{state.customerInfo.fullName}</span>
                                    </div>
                                    <div className={styles.infoRow}>
                                        <span>Email:</span>
                                        <span>{state.customerInfo.email}</span>
                                    </div>
                                    <div className={styles.infoRow}>
                                        <span>Số điện thoại:</span>
                                        <span>{state.customerInfo.phone}</span>
                                    </div>
                                </>
                            )}
                            <div className={styles.infoRow}>
                                <span>Ngày thanh toán:</span>
                                <span>{new Date().toLocaleDateString('vi-VN')}</span>
                            </div>
                        </div>
                    </div>

                    {state.bookingInfo && (
                        <>
                            <Divider />
                            <div className={styles.bookingInfo}>
                                <h3>
                                    <span className="material-symbols-outlined">hotel</span>
                                    Thông tin đặt phòng
                                </h3>
                                <Row gutter={[16, 16]}>
                                    <Col xs={24} sm={12}>
                                        <div className={styles.bookingDetail}>
                                            <strong>Khách sạn:</strong>
                                            <p>{state.bookingInfo.hotel.name}</p>
                                            <strong>Địa chỉ:</strong>
                                            <p>{state.bookingInfo.hotel.address}</p>
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <div className={styles.bookingDetail}>
                                            <strong>Phòng:</strong>
                                            <p>{state.bookingInfo.room.name}</p>
                                            <strong>Giá phòng:</strong>
                                            <p>{fmt(state.bookingInfo.room.price)}/đêm</p>
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <div className={styles.bookingDetail}>
                                            <strong>Nhận phòng:</strong>
                                            <p>{new Date(state.bookingInfo.dates.checkIn).toLocaleDateString('vi-VN')}</p>
                                            <strong>Trả phòng:</strong>
                                            <p>{new Date(state.bookingInfo.dates.checkOut).toLocaleDateString('vi-VN')}</p>
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <div className={styles.bookingDetail}>
                                            <strong>Số đêm:</strong>
                                            <p>{state.bookingInfo.nights} đêm</p>
                                            <strong>Tổng tiền:</strong>
                                            <p className={styles.totalPrice}>{fmt(state.bookingInfo.totalPrice)}</p>
                                        </div>
                                    </Col>
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
                        <ul>
                            <li>✓ Email xác nhận sẽ được gửi trong vòng 5 phút</li>
                            <li>✓ Vui lòng kiểm tra email để xem chi tiết đặt phòng</li>
                            <li>✓ Hãy lưu lại mã giao dịch để theo dõi đơn hàng</li>
                            <li>✓ Liên hệ với khách sạn trước 24 giờ để thay đổi hoặc hủy phòng</li>
                        </ul>
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
                        onClick={() => navigate('/hotels')}
                        className={styles.button}
                    >
                        <span className="material-symbols-outlined">hotel</span>
                        Tìm kiếm khách sạn khác
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
