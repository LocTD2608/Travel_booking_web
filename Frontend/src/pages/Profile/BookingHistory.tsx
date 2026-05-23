import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { bookingApi, type BookingDetails } from '../../services/bookingApi';
import { Pagination, Spin, Card, Tag, Typography, Divider } from 'antd';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const BookingHistory: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const [bookings, setBookings] = useState<BookingDetails[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);
    const pageSize = 5;

    useEffect(() => {
        if (!isAuthenticated || !user) return;
        fetchBookings(currentPage);
    }, [isAuthenticated, user, currentPage]);

    const fetchBookings = async (page: number) => {
        if (!user) return;
        setLoading(true);
        setError(null);
        try {
            const response = await bookingApi.getUserBookings(user.id, page, pageSize);
            setBookings(response.data || []);
            setTotalItems(response.totalItems || 0);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Không thể tải lịch sử đặt vé');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const formatCurrency = (amount: number | string) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(amount));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Đã thanh toán':
                return 'green';
            case 'Chưa thanh toán':
                return 'gold';
            case 'Đã hủy':
                return 'red';
            case 'Đã hoàn tiền':
                return 'blue';
            default:
                return 'blue';
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                <h2 className="text-3xl font-bold mb-4">Bạn cần đăng nhập</h2>
                <p className="text-gray-600 mb-6">Để xem lịch sử đặt vé, vui lòng đăng nhập.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <Link to="/" className="rounded-lg bg-travel-blue px-6 py-3 text-white font-semibold hover:bg-blue-700 transition">
                        Quay về Trang chủ
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Lịch sử đặt vé</h1>
                    <p className="text-gray-600 mt-2">Xem lại các chuyến đi và dịch vụ bạn đã đặt.</p>
                </div>
                <Link to="/profile" className="text-sm text-travel-blue hover:underline">Quay lại Profile</Link>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-8">
                {error && <div className="mb-4 rounded-xl bg-red-100 border border-red-200 p-4 text-red-700">{error}</div>}

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Spin size="large" />
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="text-center py-10">
                        <Text type="secondary">Bạn chưa có lịch sử đặt vé nào.</Text>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bookings.map((item, index) => (
                            <Card key={index} className="rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <Text strong className="text-lg">Mã đặt chỗ: #{item.booking.MaBooking}</Text>
                                        <br />
                                        <Text type="secondary">Ngày đặt: {new Date(item.booking.ThoiDiemDat).toLocaleString('vi-VN')}</Text>
                                    </div>
                                    <Tag color={getStatusColor(item.booking.TrangThaiBooking)} className="text-sm px-3 py-1 rounded-full">
                                        {item.booking.TrangThaiBooking}
                                    </Tag>
                                </div>
                                <Divider className="my-3" />
                                <div className="flex justify-between items-end">
                                    <div className="flex-1">
                                        {item.details && item.details.length > 0 ? (
                                            <div className="space-y-3">
                                                {item.details.map((d: any, idx: number) => {
                                                    let extraInfo: any = {};
                                                    try {
                                                        extraInfo = d.ThongTinThem ? JSON.parse(d.ThongTinThem) : {};
                                                    } catch (e) {
                                                        // ignore
                                                    }
                                                    return (
                                                        <div key={idx} className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                            {d.HinhAnh ? (
                                                                <img src={d.HinhAnh} alt={d.TenDichVu} className="w-20 h-20 object-cover rounded-md shadow-sm" />
                                                            ) : (
                                                                <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-xs shadow-sm">
                                                                    Không có ảnh
                                                                </div>
                                                            )}
                                                            <div className="flex-1">
                                                                <Text strong className="text-base text-gray-800 uppercase tracking-wide">
                                                                    {d.TenDichVu || d.LoaiDoiTuong}
                                                                </Text>
                                                                <div className="text-sm text-gray-500 mt-1 flex flex-wrap gap-x-3 gap-y-1">
                                                                    {extraInfo.detail1 && <span>• {extraInfo.detail1}</span>}
                                                                    {extraInfo.detail2 && <span>• {extraInfo.detail2}</span>}
                                                                    {extraInfo.detail3 && <span>• {extraInfo.detail3}</span>}
                                                                    {extraInfo.detail4 && <span>• {extraInfo.detail4}</span>}
                                                                </div>
                                                                <div className="text-sm text-travel-blue font-medium mt-1">
                                                                    {formatCurrency(d.DonGia)} x {d.SoLuongNguoi} {d.LoaiDoiTuong === 'hotel' ? 'đêm' : (d.LoaiDoiTuong === 'flight' ? 'vé' : 'lượng')}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <Text type="secondary">Không có chi tiết dịch vụ.</Text>
                                        )}
                                    </div>
                                    <div className="text-right min-w-[150px] ml-6 flex flex-col justify-end h-full self-stretch pb-2">
                                        <Text type="secondary" className="uppercase text-xs tracking-wider">Tổng cộng</Text>
                                        <Text strong className="text-2xl text-travel-blue">
                                            {formatCurrency(item.booking.TongTien)}
                                        </Text>
                                    </div>
                                </div>
                            </Card>
                        ))}

                        <div className="flex justify-center mt-8">
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={totalItems}
                                onChange={handlePageChange}
                                showSizeChanger={false}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingHistory;
