import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userApi, type UserProfile } from '../../services/userApi';
import { bookingApi, type BookingDetails } from '../../services/bookingApi';
import { cancellationApi } from '../../services/cancellationApi';
import { fetchHotels } from '../../services/searchApi';
import {
    Pagination, Spin, Card, Tag, Typography, Divider, Button, Modal, Form, Input,
    message, Switch, Radio
} from 'antd';

const { Text } = Typography;

interface ProfileProps {
    defaultTab?: string;
}

interface SavedPassenger {
    id: string;
    fullName: string;
    gender: 'Nam' | 'Nữ';
    birthDate: string;
    idNumber: string;
}

interface PriceAlert {
    id: string;
    origin: string;
    destination: string;
    ticketType: 'Một chiều' | 'Khứ hồi';
    targetPrice: number;
}

const Profile: React.FC<ProfileProps> = ({ defaultTab }) => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Determine initial tab from route or query params
    const getInitialTab = () => {
        if (defaultTab) return defaultTab;
        if (location.pathname.includes('/booking-history')) return 'bookings';
        const params = new URLSearchParams(location.search);
        const tabParam = params.get('tab');
        if (tabParam) return tabParam;
        return 'profile'; // default tab is Tài khoản (Profile edit form)
    };

    const [activeTab, setActiveTab] = useState<string>(getInitialTab());
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [form] = Form.useForm();
    const [isSaving, setIsSaving] = useState(false);

    // Bookings tab states
    const [bookings, setBookings] = useState<BookingDetails[]>([]);
    const [loadingBookings, setLoadingBookings] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);
    const pageSize = 5;

    // Cancellation modal states
    const [isCancelModalOpen, setIsCancelModalOpen] = useState<boolean>(false);
    const [selectedBookingId, setSelectedBookingId] = useState<number | string | null>(null);
    const [cancelForm] = Form.useForm();

    // Refunds tab states
    const [refunds, setRefunds] = useState<any[]>([]);
    const [loadingRefunds, setLoadingRefunds] = useState<boolean>(false);

    // Saved Passengers states
    const [passengers, setPassengers] = useState<SavedPassenger[]>([]);
    const [isPassengerModalOpen, setIsPassengerModalOpen] = useState<boolean>(false);
    const [passengerForm] = Form.useForm();

    // Price Alerts states
    const [alerts, setAlerts] = useState<PriceAlert[]>([]);
    const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
    const [alertForm] = Form.useForm();

    // Notification settings states
    const [notifPromo, setNotifPromo] = useState<boolean>(true);
    const [notifBooking, setNotifBooking] = useState<boolean>(true);
    const [notifNews, setNotifNews] = useState<boolean>(false);

    // Recommended Hotels state
    const [recoHotels, setRecoHotels] = useState<any[]>([]);
    const [loadingReco, setLoadingReco] = useState<boolean>(false);

    // Logout modal state
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

    // Sync tab when route changes
    useEffect(() => {
        if (defaultTab) {
            setActiveTab(defaultTab);
        } else if (location.pathname.includes('/booking-history')) {
            setActiveTab('bookings');
        } else {
            const params = new URLSearchParams(location.search);
            const tabParam = params.get('tab');
            if (tabParam) {
                setActiveTab(tabParam);
            } else {
                setActiveTab('profile');
            }
        }
    }, [location.pathname, location.search, defaultTab]);

    // Fetch Profile details
    useEffect(() => {
        if (!isAuthenticated || !user) return;

        const fetchProfile = async () => {
            try {
                const data = await userApi.getProfile(user.id);
                setProfile(data);
                form.setFieldsValue({
                    Ho: data.Ho || '',
                    Ten: data.Ten || '',
                    Email: data.Email || '',
                    SDT: data.SDT || '',
                    CCCD: data.CCCD || '',
                });
            } catch (err: any) {
                message.error('Không thể tải profile: ' + err.message);
            }
        };

        fetchProfile();
    }, [isAuthenticated, user, form]);

    // Fetch Bookings when active tab is bookings or transactions
    useEffect(() => {
        if (!isAuthenticated || !user) return;
        if (activeTab === 'bookings' || activeTab === 'transactions') {
            fetchBookings(currentPage);
        }
    }, [isAuthenticated, user, activeTab, currentPage]);

    // Fetch Refunds
    useEffect(() => {
        if (!isAuthenticated || !user) return;
        if (activeTab === 'refunds') {
            fetchRefunds();
        }
    }, [isAuthenticated, user, activeTab]);

    // Fetch Recommended Hotels for Bookings Tab
    useEffect(() => {
        if (activeTab === 'bookings') {
            loadRecoHotels();
        }
    }, [activeTab]);

    // Load Saved Passengers and Price Alerts from LocalStorage
    useEffect(() => {
        const storedPassengers = localStorage.getItem('saved_passengers');
        if (storedPassengers) {
            setPassengers(JSON.parse(storedPassengers));
        } else if (user) {
            // Initial default passenger from user info
            const defaultPass: SavedPassenger = {
                id: 'PASS_DEFAULT',
                fullName: `${(user as any).Ho || ''} ${(user as any).Ten || ''}`.trim() || 'Khách hàng',
                gender: 'Nam',
                birthDate: '1995-01-01',
                idNumber: (user as any).CCCD || '',
            };
            setPassengers([defaultPass]);
            localStorage.setItem('saved_passengers', JSON.stringify([defaultPass]));
        }

        const storedAlerts = localStorage.getItem('price_alerts');
        if (storedAlerts) {
            setAlerts(JSON.parse(storedAlerts));
        } else {
            const defaultAlerts: PriceAlert[] = [
                { id: 'AL001', origin: 'TP HCM (SGN)', destination: 'Hà Nội (HAN)', ticketType: 'Một chiều', targetPrice: 1500000 },
                { id: 'AL002', origin: 'TP HCM (SGN)', destination: 'Tokyo (NRT)', ticketType: 'Khứ hồi', targetPrice: 6000000 }
            ];
            setAlerts(defaultAlerts);
            localStorage.setItem('price_alerts', JSON.stringify(defaultAlerts));
        }

        const promo = localStorage.getItem('notif_promo');
        const booking = localStorage.getItem('notif_booking');
        const news = localStorage.getItem('notif_news');
        if (promo !== null) setNotifPromo(promo === 'true');
        if (booking !== null) setNotifBooking(booking === 'true');
        if (news !== null) setNotifNews(news === 'true');
    }, [user]);

    const fetchBookings = async (page: number) => {
        if (!user) return;
        setLoadingBookings(true);
        try {
            const response = await bookingApi.getUserBookings(user.id, page, pageSize);
            setBookings(response.data || []);
            setTotalItems(response.totalItems || 0);
        } catch (err: any) {
            message.error(err.message || 'Không thể tải lịch sử đặt vé');
        } finally {
            setLoadingBookings(false);
        }
    };

    const fetchRefunds = async () => {
        setLoadingRefunds(true);
        try {
            const data = await cancellationApi.getUserCancellations();
            setRefunds(data || []);
        } catch (err: any) {
            message.error(err.message || 'Không thể tải lịch sử hoàn tiền');
        } finally {
            setLoadingRefunds(false);
        }
    };

    const loadRecoHotels = async () => {
        setLoadingReco(true);
        try {
            // Load from Da Lat or general recommendations
            const res = await fetchHotels({ city: 'Da Lat' });
            if (res.success && res.data && res.data.length > 0) {
                setRecoHotels(res.data.slice(0, 2));
            } else {
                setRecoHotels([]);
            }
        } catch (err) {
            console.error('Failed to fetch recommendations:', err);
            setRecoHotels([]);
        } finally {
            setLoadingReco(false);
        }
    };

    // Save profile form submission
    const handleProfileSubmit = async (values: any) => {
        if (!user) return;
        setIsSaving(true);
        try {
            await userApi.updateProfile(user.id, values);
            message.success('Cập nhật profile thành công!');
            // Reload user details
            const data = await userApi.getProfile(user.id);
            setProfile(data);
        } catch (err: any) {
            message.error(err.message || 'Cập nhật thất bại');
        } finally {
            setIsSaving(false);
        }
    };

    // Tab Change handler with Router navigation syncing
    const handleTabChange = (tab: string) => {
        if (tab === 'logout') {
            setIsLogoutConfirmOpen(true);
            return;
        }

        setActiveTab(tab);
        if (tab === 'bookings') {
            navigate('/profile/booking-history');
        } else if (tab === 'profile') {
            navigate('/profile');
        } else {
            navigate(`/profile?tab=${tab}`);
        }
    };

    // Cancellation request helpers
    const handleOpenCancelModal = (bookingId: number | string) => {
        setSelectedBookingId(bookingId);
        setIsCancelModalOpen(true);
        cancelForm.resetFields();
    };

    const handleCancelModalClose = () => {
        setIsCancelModalOpen(false);
        setSelectedBookingId(null);
        cancelForm.resetFields();
    };

    const handleCancelSubmit = async (values: { reason: string }) => {
        if (!selectedBookingId) return;
        
        // 1. Optimistic UI update: set status to 'Yêu cầu hủy' instantly
        setBookings(prev => prev.map(item => 
            String(item.booking.MaBooking) === String(selectedBookingId) 
                ? { ...item, booking: { ...item.booking, TrangThaiBooking: 'Yêu cầu hủy' } }
                : item
        ));
        
        // Close modal and show message instantly
        handleCancelModalClose();
        message.success('Gửi yêu cầu hủy thành công! Vui lòng chờ phản hồi của quản trị viên.');

        try {
            // 2. Perform API call in background
            await cancellationApi.requestCancellation(selectedBookingId, values.reason);
            // 3. Re-fetch in background to sync with server
            fetchBookings(currentPage);
        } catch (err: any) {
            message.error(err.message || 'Không thể gửi yêu cầu hủy');
            // Rollback on error
            setBookings(prev => prev.map(item => 
                String(item.booking.MaBooking) === String(selectedBookingId) 
                    ? { ...item, booking: { ...item.booking, TrangThaiBooking: 'Đã thanh toán' } }
                    : item
            ));
            fetchBookings(currentPage);
        }
    };

    // Saved Passengers CRUD
    const handleAddPassenger = (values: any) => {
        const newPass: SavedPassenger = {
            id: 'PASS_' + Date.now(),
            fullName: values.fullName,
            gender: values.gender,
            birthDate: values.birthDate,
            idNumber: values.idNumber,
        };
        const updated = [...passengers, newPass];
        setPassengers(updated);
        localStorage.setItem('saved_passengers', JSON.stringify(updated));
        message.success('Đã thêm hành khách thành công!');
        setIsPassengerModalOpen(false);
        passengerForm.resetFields();
    };

    const handleDeletePassenger = (id: string) => {
        const updated = passengers.filter(p => p.id !== id);
        setPassengers(updated);
        localStorage.setItem('saved_passengers', JSON.stringify(updated));
        message.success('Đã xóa thông tin hành khách.');
    };

    // Price Alerts CRUD
    const handleAddAlert = (values: any) => {
        const newAlert: PriceAlert = {
            id: 'AL_' + Date.now(),
            origin: values.origin,
            destination: values.destination,
            ticketType: values.ticketType,
            targetPrice: Number(values.targetPrice),
        };
        const updated = [...alerts, newAlert];
        setAlerts(updated);
        localStorage.setItem('price_alerts', JSON.stringify(updated));
        message.success('Đã tạo thông báo giá vé thành công!');
        setIsAlertModalOpen(false);
        alertForm.resetFields();
    };

    const handleDeleteAlert = (id: string) => {
        const updated = alerts.filter(a => a.id !== id);
        setAlerts(updated);
        localStorage.setItem('price_alerts', JSON.stringify(updated));
        message.success('Đã xóa thông báo giá vé.');
    };

    // Save Notifications Preferences
    const handleSaveNotifSettings = () => {
        localStorage.setItem('notif_promo', String(notifPromo));
        localStorage.setItem('notif_booking', String(notifBooking));
        localStorage.setItem('notif_news', String(notifNews));
        message.success('Đã lưu cấu hình cài đặt thông báo!');
    };

    const handleConfirmLogout = () => {
        setIsLogoutConfirmOpen(false);
        logout();
        navigate('/');
    };

    // Formatting utilities
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
            case 'Yêu cầu hủy':
                return 'purple';
            default:
                return 'blue';
        }
    };

    const getHotelImage = (name: string, address: string) => {
        const text = (name + ' ' + address).toLowerCase();
        if (text.includes('beach') || text.includes('sea') || text.includes('marina') || text.includes('ocean')) {
            return 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80';
        }
        if (text.includes('palace') || text.includes('grand') || text.includes('hotel') || text.includes('valley')) {
            return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';
        }
        return 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80';
    };

    if (!isAuthenticated) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                <span className="material-symbols-outlined text-gray-300 text-[80px] mb-4">lock</span>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Bạn cần đăng nhập</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">Vui lòng đăng nhập tài khoản của bạn để truy cập trang quản lý thông tin và lịch sử đặt chỗ.</p>
                <Link to="/" className="rounded-2xl bg-travel-blue px-8 py-3 text-white font-bold hover:bg-blue-700 transition-all hover-lift">
                    Quay về Trang chủ
                </Link>
            </div>
        );
    }

    // Sidebar items mapping
    const sidebarMenuItems = [
        { key: 'bookings', label: 'Đặt chỗ của tôi', icon: 'receipt_long' },
        { key: 'transactions', label: 'Danh sách giao dịch', icon: 'account_balance_wallet' },
        { key: 'refunds', label: 'Refunds', icon: 'assignment_return' },
        { key: 'price-alerts', label: 'Thông báo giá vé máy bay', icon: 'campaign' },
        { key: 'saved-passengers', label: 'Thông tin hành khách đã lưu', icon: 'group' },
        { key: 'notifications', label: 'Cài đặt thông báo', icon: 'notifications_active' },
        { key: 'profile', label: 'Tài khoản', icon: 'manage_accounts' },
        { key: 'logout', label: 'Đăng xuất', icon: 'logout', className: 'text-red-500 hover:bg-red-50/50' }
    ];

    return (
        <div className="bg-[#f8fafc] min-h-screen py-12 font-['Inter',sans-serif]">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* LEFT COLUMN: SIDEBAR */}
                    <div className="w-full lg:w-80 shrink-0 flex flex-col gap-6">
                        
                        {/* User info box */}
                        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-travel-blue text-white font-bold flex items-center justify-center text-xl shadow-sm border-2 border-blue-100 uppercase">
                                    {profile?.Ten?.[0] || user?.Ten?.[0] || 'U'}
                                </div>
                                <div className="overflow-hidden">
                                    <h4 className="font-extrabold text-gray-800 text-base truncate">
                                        {profile?.Ho ? `${profile.Ho} ${profile.Ten}` : user?.Ten || 'Khách hàng'}
                                    </h4>
                                    <p className="text-xs text-gray-400 mt-0.5 truncate flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[12px]">verified</span>
                                        {profile?.Email || user?.Email || 'Email verified'}
                                    </p>
                                </div>
                            </div>

                            {/* Bronze Priority Member card */}
                            <div className="bg-gradient-to-br from-[#a07a56] to-[#c49d7c] rounded-2xl p-4 text-white shadow-sm flex items-center justify-between cursor-pointer hover:opacity-95 transition group">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-yellow-300 text-[20px]">stars</span>
                                    <div>
                                        <div className="text-[11px] font-bold uppercase tracking-wider text-amber-100">Bronze Priority</div>
                                        <div className="text-[12px] font-semibold text-white/95">Bạn là thành viên Bronze</div>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">chevron_right</span>
                            </div>

                            {/* Points display */}
                            <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-yellow-500 text-[20px]">monetization_on</span>
                                    <span className="text-xs font-semibold text-gray-600">Traveloka Points</span>
                                </div>
                                <span className="text-sm font-bold text-gray-800">0 Điểm</span>
                            </div>
                        </div>

                        {/* Navigation Menu */}
                        <div className="bg-white border border-gray-200 rounded-3xl p-4 shadow-sm flex flex-col gap-1">
                            {sidebarMenuItems.map((item) => {
                                const isActive = activeTab === item.key;
                                return (
                                    <div
                                        key={item.key}
                                        onClick={() => handleTabChange(item.key)}
                                        className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all cursor-pointer font-bold text-sm select-none ${
                                            isActive
                                                ? 'bg-[#0070c0]/10 text-travel-blue border-l-4 border-travel-blue pl-3'
                                                : item.className || 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                                            <span>{item.label}</span>
                                        </div>
                                        {!isActive && item.key !== 'logout' && (
                                            <span className="material-symbols-outlined text-gray-300 text-[16px]">chevron_right</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: MAIN CONTENT PANELS */}
                    <div className="flex-1 w-full bg-white border border-gray-200 rounded-3xl shadow-sm p-6 md:p-8 min-h-[500px]">
                        
                        {/* PANEL 1: BOOKINGS (ĐẶT CHỖ CỦA TÔI) */}
                        {activeTab === 'bookings' && (
                            <div>
                                <div className="border-b border-gray-100 pb-4 mb-6">
                                    <h2 className="text-xl font-extrabold text-gray-800">Vé điện tử & phiếu thanh toán hiện hành</h2>
                                    <p className="text-sm text-gray-500 mt-1">Danh sách các dịch vụ bạn đã thanh toán và đặt vé thành công.</p>
                                </div>

                                {loadingBookings ? (
                                    <div className="flex justify-center items-center py-24">
                                        <Spin size="large" />
                                    </div>
                                ) : bookings.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 px-6 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 mb-8 text-center">
                                        <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-travel-blue mb-4">
                                            <span className="material-symbols-outlined text-[44px]">sentiment_sleepy</span>
                                        </div>
                                        <h4 className="text-base font-extrabold text-gray-800 mb-1">Không tìm thấy đặt chỗ</h4>
                                        <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
                                            Mọi chỗ bạn đặt sẽ được hiển thị tại đây. Hiện bạn chưa có bất kỳ đặt chỗ nào, hãy đặt trên trang chủ ngay!
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-6 mb-8">
                                        {bookings.map((item, index) => (
                                            <Card key={index} className="rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <Text strong className="text-[15px]">Mã đặt chỗ: #{item.booking.MaBooking}</Text>
                                                        <br />
                                                        <Text type="secondary" className="text-xs">Ngày đặt: {new Date(item.booking.ThoiDiemDat).toLocaleString('vi-VN')}</Text>
                                                    </div>
                                                    <Tag color={getStatusColor(item.booking.TrangThaiBooking)} className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                                        {item.booking.TrangThaiBooking}
                                                    </Tag>
                                                </div>
                                                <Divider className="my-3" />
                                                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                                                    <div className="flex-1 w-full space-y-3">
                                                        {item.details?.map((d: any, idx: number) => {
                                                            let extraInfo: any = {};
                                                            try {
                                                                extraInfo = d.ThongTinThem ? JSON.parse(d.ThongTinThem) : {};
                                                            } catch (e) {}
                                                            return (
                                                                <div key={idx} className="flex gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                                    {d.HinhAnh ? (
                                                                        <img src={d.HinhAnh} alt={d.TenDichVu} className="w-16 h-16 object-cover rounded-lg shadow-sm" />
                                                                    ) : (
                                                                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs shadow-sm">
                                                                            Không có ảnh
                                                                        </div>
                                                                    )}
                                                                    <div className="flex-1 min-w-0">
                                                                        <Text strong className="text-sm text-gray-800 uppercase tracking-wide truncate block">
                                                                            {d.TenDichVu || d.LoaiDoiTuong}
                                                                        </Text>
                                                                        <div className="text-[11px] text-gray-500 mt-1 flex flex-wrap gap-x-2 gap-y-0.5">
                                                                            {extraInfo.detail1 && <span>• {extraInfo.detail1}</span>}
                                                                            {extraInfo.detail2 && <span>• {extraInfo.detail2}</span>}
                                                                            {extraInfo.detail3 && <span>• {extraInfo.detail3}</span>}
                                                                        </div>
                                                                        <div className="text-xs text-travel-blue font-bold mt-1">
                                                                            {formatCurrency(d.DonGia)} x {d.SoLuongNguoi} {d.LoaiDoiTuong === 'hotel' ? 'đêm' : 'vé'}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                    <div className="text-right min-w-[140px] flex flex-col justify-end self-stretch md:border-l md:border-gray-100 md:pl-6">
                                                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Tổng tiền</span>
                                                        <span className="text-xl font-black text-travel-blue mt-0.5">
                                                            {formatCurrency(item.booking.TongTien)}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Cancellation Trigger Button */}
                                                {item.booking.TrangThaiBooking === 'Đã thanh toán' && (
                                                    <div className="mt-4 flex justify-end border-t border-gray-100 pt-3">
                                                        <Button
                                                            type="primary"
                                                            danger
                                                            onClick={() => handleOpenCancelModal(item.booking.MaBooking)}
                                                            className="rounded-lg font-bold text-xs"
                                                        >
                                                            Yêu cầu hủy vé/phòng
                                                        </Button>
                                                    </div>
                                                )}
                                            </Card>
                                        ))}

                                        <div className="flex justify-center mt-6">
                                            <Pagination
                                                current={currentPage}
                                                pageSize={pageSize}
                                                total={totalItems}
                                                onChange={(p) => setCurrentPage(p)}
                                                showSizeChanger={false}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Comfy Stays Recommendation Section */}
                                <div className="border-t border-gray-100 pt-8 mt-8">
                                    <h3 className="text-lg font-extrabold text-gray-800 mb-4">Comfy stays for your great trip</h3>
                                    {loadingReco ? (
                                        <div className="flex justify-center py-8"><Spin /></div>
                                    ) : recoHotels.length === 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Static fallback card 1 */}
                                            <div className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition bg-white flex flex-col">
                                                <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80" alt="Bazan Hotel" className="h-44 w-full object-cover" />
                                                <div className="p-4 flex flex-col flex-1">
                                                    <span className="text-[10px] text-travel-blue bg-blue-50 px-2 py-0.5 rounded font-bold w-fit mb-2">Phường 3, Đà Lạt</span>
                                                    <h4 className="font-extrabold text-sm text-gray-800">Khách sạn Bazan Hotel</h4>
                                                    <div className="flex items-center gap-1 text-xs text-yellow-500 my-1.5">
                                                        <span className="material-symbols-outlined text-[16px]">star</span>
                                                        <span className="material-symbols-outlined text-[16px]">star</span>
                                                        <span className="material-symbols-outlined text-[16px]">star</span>
                                                        <span className="text-gray-400 font-semibold ml-1">9.0/10 (89 đánh giá)</span>
                                                    </div>
                                                    <div className="mt-auto pt-2 flex items-end justify-between">
                                                        <span className="text-[10px] text-red-500 bg-red-50 px-1.5 py-0.5 rounded font-bold">Tiết kiệm 42%</span>
                                                        <div className="text-right">
                                                            <div className="text-xs text-gray-400 line-through">457.000 VND</div>
                                                            <div className="text-sm font-extrabold text-orange-500">263.455 VND</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Static fallback card 2 */}
                                            <div className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition bg-white flex flex-col">
                                                <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80" alt="Hung Nguyen Valley" className="h-44 w-full object-cover" />
                                                <div className="p-4 flex flex-col flex-1">
                                                    <span className="text-[10px] text-travel-blue bg-blue-50 px-2 py-0.5 rounded font-bold w-fit mb-2">Phường 8, Đà Lạt</span>
                                                    <h4 className="font-extrabold text-sm text-gray-800">Hung Nguyen Valley Da Lat</h4>
                                                    <div className="flex items-center gap-1 text-xs text-yellow-500 my-1.5">
                                                        <span className="material-symbols-outlined text-[16px]">star</span>
                                                        <span className="material-symbols-outlined text-[16px]">star</span>
                                                        <span className="material-symbols-outlined text-[16px]">star</span>
                                                        <span className="text-gray-400 font-semibold ml-1">9.0/10 (935 đánh giá)</span>
                                                    </div>
                                                    <div className="mt-auto pt-2 flex items-end justify-between">
                                                        <span className="text-[10px] text-red-500 bg-red-50 px-1.5 py-0.5 rounded font-bold">Tiết kiệm 31%</span>
                                                        <div className="text-right">
                                                            <div className="text-xs text-gray-400 line-through">422.078 VND</div>
                                                            <div className="text-sm font-extrabold text-orange-500">289.410 VND</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {recoHotels.map((h: any) => (
                                                <Link key={h.MaKS} to={`/hotels/${h.MaKS}`} className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition bg-white flex flex-col group">
                                                    <img src={getHotelImage(h.name, h.address)} alt={h.name} className="h-44 w-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                                                    <div className="p-4 flex flex-col flex-1">
                                                        <span className="text-[10px] text-travel-blue bg-blue-50 px-2 py-0.5 rounded font-bold w-fit mb-2 truncate max-w-full">
                                                            {h.address || 'Đà Lạt'}
                                                        </span>
                                                        <h4 className="font-extrabold text-sm text-gray-800 group-hover:text-travel-blue transition truncate">{h.name}</h4>
                                                        <div className="flex items-center gap-1 text-xs text-yellow-500 my-1.5">
                                                            {Array.from({ length: h.stars || 3 }).map((_, i) => (
                                                                <span key={i} className="material-symbols-outlined text-[16px]">star</span>
                                                            ))}
                                                            <span className="text-gray-400 font-semibold ml-1">9.0/10 (89 reviews)</span>
                                                        </div>
                                                        <div className="mt-auto pt-2 flex items-end justify-between">
                                                            <span className="text-[10px] text-red-500 bg-red-50 px-1.5 py-0.5 rounded font-bold">Giảm 10%</span>
                                                            <div className="text-right">
                                                                <div className="text-sm font-extrabold text-orange-500">{formatCurrency(h.min_price)}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* PANEL 2: TRANSACTIONS (DANH SÁCH GIAO DỊCH) */}
                        {activeTab === 'transactions' && (
                            <div>
                                <div className="border-b border-gray-100 pb-4 mb-6">
                                    <h2 className="text-xl font-extrabold text-gray-800">Danh sách giao dịch</h2>
                                    <p className="text-sm text-gray-500 mt-1">Lịch sử thanh toán và tình trạng tài chính cho các đặt đơn dịch vụ của bạn.</p>
                                </div>

                                {loadingBookings ? (
                                    <div className="flex justify-center py-24"><Spin size="large" /></div>
                                ) : bookings.length === 0 ? (
                                    <div className="text-center py-16 text-gray-400">Bạn chưa phát sinh giao dịch nào trên hệ thống.</div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-gray-50 text-gray-400 text-[11px] font-bold uppercase tracking-wider border-b border-gray-100">
                                                    <th className="py-3 px-4">Mã giao dịch</th>
                                                    <th className="py-3 px-4">Thời điểm</th>
                                                    <th className="py-3 px-4">Số tiền</th>
                                                    <th className="py-3 px-4">Hình thức</th>
                                                    <th className="py-3 px-4 text-right">Trạng thái</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 text-sm">
                                                {bookings.map((item) => (
                                                    <tr key={item.booking.MaBooking} className="hover:bg-gray-50/50">
                                                        <td className="py-4 px-4 font-bold text-gray-800">TXN{item.booking.MaBooking}</td>
                                                        <td className="py-4 px-4 text-xs text-gray-400">{new Date(item.booking.ThoiDiemDat).toLocaleString('vi-VN')}</td>
                                                        <td className="py-4 px-4 font-bold text-gray-800">{formatCurrency(item.booking.TongTien)}</td>
                                                        <td className="py-4 px-4 text-gray-500">Ví điện tử / Thẻ quốc tế</td>
                                                        <td className="py-4 px-4 text-right">
                                                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                                                                item.booking.TrangThaiBooking === 'Đã hoàn tiền' ? 'bg-blue-50 text-blue-600' :
                                                                item.booking.TrangThaiBooking === 'Đã hủy' ? 'bg-red-50 text-red-600' :
                                                                item.booking.TrangThaiBooking === 'Yêu cầu hủy' ? 'bg-purple-50 text-purple-600' :
                                                                item.booking.TrangThaiBooking === 'Chưa thanh toán' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'
                                                            }`}>
                                                                {item.booking.TrangThaiBooking === 'Đã thanh toán' ? 'Thành công' : item.booking.TrangThaiBooking}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* PANEL 3: REFUNDS (YÊU CẦU HOÀN TIỀN) */}
                        {activeTab === 'refunds' && (
                            <div>
                                <div className="border-b border-gray-100 pb-4 mb-6">
                                    <h2 className="text-xl font-extrabold text-gray-800">Lịch sử hoàn tiền</h2>
                                    <p className="text-sm text-gray-500 mt-1">Theo dõi tiến độ duyệt và giải ngân của các yêu cầu hủy đặt vé/phòng của bạn.</p>
                                </div>

                                {loadingRefunds ? (
                                    <div className="flex justify-center py-24"><Spin size="large" /></div>
                                ) : refunds.length === 0 ? (
                                    <div className="text-center py-16 text-gray-400">Bạn chưa có yêu cầu hủy/hoàn tiền nào.</div>
                                ) : (
                                    <div className="space-y-4">
                                        {refunds.map((ref) => (
                                            <div key={ref.id} className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-extrabold text-sm text-gray-800">Yêu cầu #{ref.id}</span>
                                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                                            ref.status === 'approved' ? 'bg-green-50 text-green-600' :
                                                            ref.status === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                                                        }`}>
                                                            {ref.status === 'approved' ? 'Chấp thuận hoàn tiền' :
                                                             ref.status === 'rejected' ? 'Bị từ chối' : 'Đang xử lý'}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-500">Mã Booking: #{ref.bookingId} • Chặng/Dịch vụ: <strong>{ref.bookingDetail}</strong></p>
                                                    <p className="text-xs text-gray-400 italic">"Lý do: {ref.reason}"</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-[10px] text-gray-400 block font-semibold uppercase">Yêu cầu vào lúc</span>
                                                    <span className="text-xs text-gray-800 font-medium">{ref.requestedAt}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* PANEL 4: PRICE ALERTS (THÔNG BÁO GIÁ VÉ MÁY BAY) */}
                        {activeTab === 'price-alerts' && (
                            <div>
                                <div className="border-b border-gray-100 pb-4 mb-6 flex justify-between items-center flex-wrap gap-3">
                                    <div>
                                        <h2 className="text-xl font-extrabold text-gray-800">Thông báo giá vé máy bay</h2>
                                        <p className="text-sm text-gray-500 mt-1">Chúng tôi sẽ thông báo khi hành trình đạt mức giá mong muốn.</p>
                                    </div>
                                    <Button
                                        type="primary"
                                        className="rounded-lg font-bold bg-travel-blue text-xs flex items-center gap-1"
                                        onClick={() => setIsAlertModalOpen(true)}
                                    >
                                        <span className="material-symbols-outlined text-[16px]">campaign</span>
                                        Tạo thông báo mới
                                    </Button>
                                </div>

                                {alerts.length === 0 ? (
                                    <div className="text-center py-16 text-gray-400">Bạn chưa tạo thông báo giá vé nào.</div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {alerts.map((al) => (
                                            <div key={al.id} className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm flex justify-between items-center group hover:border-blue-200 transition">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-extrabold text-sm text-gray-800">{al.origin}</span>
                                                        <span className="material-symbols-outlined text-gray-400 text-[16px]">arrow_forward</span>
                                                        <span className="font-extrabold text-sm text-gray-800">{al.destination}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-400">{al.ticketType} • Giá mong muốn dưới:</p>
                                                    <p className="text-base font-extrabold text-orange-500">{formatCurrency(al.targetPrice)}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteAlert(al.id)}
                                                    className="w-8 h-8 rounded-full hover:bg-red-50 text-gray-300 hover:text-red-500 flex items-center justify-center transition"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* PANEL 5: SAVED PASSENGERS (THÔNG TIN HÀNH KHÁCH ĐÃ LƯU) */}
                        {activeTab === 'saved-passengers' && (
                            <div>
                                <div className="border-b border-gray-100 pb-4 mb-6 flex justify-between items-center flex-wrap gap-3">
                                    <div>
                                        <h2 className="text-xl font-extrabold text-gray-800">Thông tin hành khách đã lưu</h2>
                                        <p className="text-sm text-gray-500 mt-1">Lưu thông tin để điền nhanh hơn khi đặt vé máy bay/khách sạn lần sau.</p>
                                    </div>
                                    <Button
                                        type="primary"
                                        className="rounded-lg font-bold bg-travel-blue text-xs flex items-center gap-1"
                                        onClick={() => setIsPassengerModalOpen(true)}
                                    >
                                        <span className="material-symbols-outlined text-[16px]">person_add</span>
                                        Thêm hành khách
                                    </Button>
                                </div>

                                {passengers.length === 0 ? (
                                    <div className="text-center py-16 text-gray-400">Chưa có thông tin hành khách nào được lưu.</div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {passengers.map((p) => (
                                            <div key={p.id} className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm flex justify-between items-start hover:border-blue-200 transition">
                                                <div className="space-y-1">
                                                    <h4 className="font-extrabold text-sm text-gray-800 flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-gray-400 text-[18px]">person</span>
                                                        {p.fullName}
                                                    </h4>
                                                    <p className="text-xs text-gray-400">Giới tính: <strong>{p.gender}</strong></p>
                                                    <p className="text-xs text-gray-400">Ngày sinh: <strong>{p.birthDate}</strong></p>
                                                    <p className="text-xs text-gray-400">CCCD/CMND: <strong>{p.idNumber || 'Chưa cập nhật'}</strong></p>
                                                </div>
                                                <button
                                                    onClick={() => handleDeletePassenger(p.id)}
                                                    className="w-8 h-8 rounded-full hover:bg-red-50 text-gray-300 hover:text-red-500 flex items-center justify-center transition"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* PANEL 6: NOTIFICATIONS (CÀI ĐẶT THÔNG BÁO) */}
                        {activeTab === 'notifications' && (
                            <div>
                                <div className="border-b border-gray-100 pb-4 mb-6">
                                    <h2 className="text-xl font-extrabold text-gray-800">Cài đặt thông báo</h2>
                                    <p className="text-sm text-gray-500 mt-1">Tùy chọn cách thức và nội dung thông báo từ chúng tôi đến bạn.</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div>
                                            <h4 className="font-extrabold text-sm text-gray-800">Khuyến mãi & ưu đãi đặc biệt</h4>
                                            <p className="text-xs text-gray-400 mt-0.5">Nhận các thông tin giảm giá vé máy bay, phòng khách sạn hàng tuần.</p>
                                        </div>
                                        <Switch checked={notifPromo} onChange={(checked) => setNotifPromo(checked)} />
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div>
                                            <h4 className="font-extrabold text-sm text-gray-800">Cập nhật đơn hàng & booking</h4>
                                            <p className="text-xs text-gray-400 mt-0.5">Nhận thông báo cập nhật về vé điện tử, lịch bay, hoặc hoàn tiền.</p>
                                        </div>
                                        <Switch checked={notifBooking} onChange={(checked) => setNotifBooking(checked)} />
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div>
                                            <h4 className="font-extrabold text-sm text-gray-800">Bản tin Traveloka du lịch</h4>
                                            <p className="text-xs text-gray-400 mt-0.5">Cập nhật cẩm nang du lịch và xu hướng điểm đến nổi tiếng.</p>
                                        </div>
                                        <Switch checked={notifNews} onChange={(checked) => setNotifNews(checked)} />
                                    </div>

                                    <div className="pt-4 flex justify-end">
                                        <Button
                                            type="primary"
                                            className="rounded-lg font-bold bg-travel-blue"
                                            onClick={handleSaveNotifSettings}
                                        >
                                            Lưu cấu hình cài đặt
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* PANEL 7: PROFILE (TÀI KHOẢN) */}
                        {activeTab === 'profile' && (
                            <div>
                                <div className="border-b border-gray-100 pb-4 mb-6">
                                    <h2 className="text-xl font-extrabold text-gray-800">Tài khoản & Thông tin cá nhân</h2>
                                    <p className="text-sm text-gray-500 mt-1">Cập nhật hồ sơ thông tin cá nhân của bạn để nhận dịch vụ tốt nhất.</p>
                                </div>

                                <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={handleProfileSubmit}
                                    className="grid gap-4"
                                >
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Form.Item
                                            name="Ho"
                                            label={<span className="font-bold text-gray-700 text-xs uppercase tracking-wider">Họ</span>}
                                        >
                                            <Input className="rounded-xl px-4 py-2.5 border-gray-200" />
                                        </Form.Item>
                                        <Form.Item
                                            name="Ten"
                                            label={<span className="font-bold text-gray-700 text-xs uppercase tracking-wider">Tên</span>}
                                            rules={[{ required: true, message: 'Tên không được bỏ trống' }]}
                                        >
                                            <Input className="rounded-xl px-4 py-2.5 border-gray-200" />
                                        </Form.Item>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Form.Item
                                            name="Email"
                                            label={<span className="font-bold text-gray-700 text-xs uppercase tracking-wider">Email</span>}
                                            rules={[{ type: 'email', message: 'Định dạng email không hợp lệ' }]}
                                        >
                                            <Input className="rounded-xl px-4 py-2.5 border-gray-200" />
                                        </Form.Item>
                                        <Form.Item
                                            name="SDT"
                                            label={<span className="font-bold text-gray-700 text-xs uppercase tracking-wider">Số điện thoại</span>}
                                        >
                                            <Input className="rounded-xl px-4 py-2.5 border-gray-200" />
                                        </Form.Item>
                                    </div>

                                    <Form.Item
                                        name="CCCD"
                                        label={<span className="font-bold text-gray-700 text-xs uppercase tracking-wider">Số CCCD / CMND / Hộ chiếu</span>}
                                    >
                                        <Input className="rounded-xl px-4 py-2.5 border-gray-200" />
                                    </Form.Item>

                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={isSaving}
                                        className="rounded-xl bg-travel-blue h-11 font-bold text-sm w-full mt-2"
                                    >
                                        Lưu thay đổi hồ sơ
                                    </Button>
                                </Form>

                                {profile && (
                                    <div className="mt-8 rounded-2xl border border-gray-100 bg-gray-50/50 p-5">
                                        <h3 className="text-sm font-extrabold text-gray-700 mb-3 uppercase tracking-wider">Thông tin hệ thống</h3>
                                        <div className="grid gap-3 grid-cols-2 text-xs">
                                            <div>
                                                <p className="text-gray-400 font-semibold">Mã thành viên</p>
                                                <p className="font-bold text-gray-800 mt-0.5">#{profile.UserID}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 font-semibold">Cấp bậc</p>
                                                <p className="font-bold text-gray-800 mt-0.5">{profile.Role || 'USER'}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 font-semibold">Tình trạng</p>
                                                <p className="font-bold text-green-600 mt-0.5">{profile.TrangThai || 'ACTIVE'}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 font-semibold">Xác minh danh tính</p>
                                                <p className="font-bold text-gray-800 mt-0.5">{profile.TinhTrangXacMinh || 'Chưa xác minh'}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MODAL: CANCELLATION REQUEST REASON */}
            <Modal
                title={<span className="text-base font-extrabold text-gray-800">Yêu cầu hủy vé / phòng</span>}
                open={isCancelModalOpen}
                onCancel={handleCancelModalClose}
                footer={null}
                destroyOnClose
                className="rounded-2xl"
            >
                <Form
                    form={cancelForm}
                    layout="vertical"
                    onFinish={handleCancelSubmit}
                    className="mt-4"
                >
                    <Form.Item
                        name="reason"
                        label={<span className="font-bold text-xs text-gray-700 uppercase tracking-wider">Lý do yêu cầu hủy</span>}
                        rules={[{ required: true, message: 'Vui lòng nhập lý do hủy chi tiết' }]}
                    >
                        <Input.TextArea
                            rows={4}
                            placeholder="Vui lòng nêu rõ lý do hủy chuyến bay hoặc phòng khách sạn..."
                            className="rounded-xl border-gray-200"
                        />
                    </Form.Item>
                    <div className="flex justify-end gap-3 mt-5">
                        <Button onClick={handleCancelModalClose} className="rounded-lg font-bold text-xs">
                            Quay lại
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            danger
                            className="rounded-lg font-bold text-xs bg-red-500 border-red-500 hover:bg-red-600 hover:border-red-600"
                        >
                            Gửi yêu cầu hủy
                        </Button>
                    </div>
                </Form>
            </Modal>

            {/* MODAL: ADD SAVED PASSENGER */}
            <Modal
                title={<span className="text-base font-extrabold text-gray-800">Thêm hồ sơ hành khách mới</span>}
                open={isPassengerModalOpen}
                onCancel={() => setIsPassengerModalOpen(false)}
                footer={null}
                destroyOnClose
                className="rounded-2xl"
            >
                <Form
                    form={passengerForm}
                    layout="vertical"
                    onFinish={handleAddPassenger}
                    className="mt-4"
                >
                    <Form.Item
                        name="fullName"
                        label={<span className="font-bold text-xs text-gray-700 uppercase tracking-wider">Họ và Tên</span>}
                        rules={[{ required: true, message: 'Vui lòng nhập tên hành khách' }]}
                    >
                        <Input placeholder="Ví dụ: NGUYEN VAN AN" className="rounded-xl border-gray-200 uppercase" />
                    </Form.Item>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item
                            name="gender"
                            label={<span className="font-bold text-xs text-gray-700 uppercase tracking-wider">Giới tính</span>}
                            initialValue="Nam"
                        >
                            <Radio.Group className="w-full">
                                <Radio value="Nam">Nam</Radio>
                                <Radio value="Nữ">Nữ</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item
                            name="birthDate"
                            label={<span className="font-bold text-xs text-gray-700 uppercase tracking-wider">Ngày sinh</span>}
                            rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
                        >
                            <input type="date" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-travel-blue focus:outline-none" />
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="idNumber"
                        label={<span className="font-bold text-xs text-gray-700 uppercase tracking-wider">Số CCCD / CMND / Hộ chiếu</span>}
                        rules={[{ required: true, message: 'Vui lòng nhập số định danh cá nhân' }]}
                    >
                        <Input placeholder="Nhập số định danh" className="rounded-xl border-gray-200" />
                    </Form.Item>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button onClick={() => setIsPassengerModalOpen(false)} className="rounded-lg font-bold text-xs">
                            Hủy bỏ
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="rounded-lg font-bold text-xs bg-travel-blue"
                        >
                            Lưu thông tin
                        </Button>
                    </div>
                </Form>
            </Modal>

            {/* MODAL: CREATE FLIGHT PRICE ALERT */}
            <Modal
                title={<span className="text-base font-extrabold text-gray-800">Tạo thông báo giá vé máy bay</span>}
                open={isAlertModalOpen}
                onCancel={() => setIsAlertModalOpen(false)}
                footer={null}
                destroyOnClose
                className="rounded-2xl"
            >
                <Form
                    form={alertForm}
                    layout="vertical"
                    onFinish={handleAddAlert}
                    className="mt-4"
                >
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item
                            name="origin"
                            label={<span className="font-bold text-xs text-gray-700 uppercase tracking-wider">Khởi hành</span>}
                            rules={[{ required: true, message: 'Nhập điểm đi' }]}
                        >
                            <Input placeholder="Ví dụ: TP HCM (SGN)" className="rounded-xl border-gray-200" />
                        </Form.Item>

                        <Form.Item
                            name="destination"
                            label={<span className="font-bold text-xs text-gray-700 uppercase tracking-wider">Điểm đến</span>}
                            rules={[{ required: true, message: 'Nhập điểm đến' }]}
                        >
                            <Input placeholder="Ví dụ: Hà Nội (HAN)" className="rounded-xl border-gray-200" />
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="ticketType"
                        label={<span className="font-bold text-xs text-gray-700 uppercase tracking-wider">Loại vé</span>}
                        initialValue="Một chiều"
                    >
                        <Radio.Group>
                            <Radio value="Một chiều">Một chiều</Radio>
                            <Radio value="Khứ hồi">Khứ hồi</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        name="targetPrice"
                        label={<span className="font-bold text-xs text-gray-700 uppercase tracking-wider">Mức giá mong muốn (VND)</span>}
                        rules={[{ required: true, message: 'Vui lòng nhập mức giá tối đa' }]}
                    >
                        <Input type="number" placeholder="Ví dụ: 1500000" className="rounded-xl border-gray-200" />
                    </Form.Item>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button onClick={() => setIsAlertModalOpen(false)} className="rounded-lg font-bold text-xs">
                            Hủy bỏ
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="rounded-lg font-bold text-xs bg-travel-blue"
                        >
                            Kích hoạt theo dõi
                        </Button>
                    </div>
                </Form>
            </Modal>

            {/* MODAL: CONFIRM LOGOUT */}
            <Modal
                title={<span className="font-extrabold text-gray-800 text-base">Xác nhận đăng xuất</span>}
                open={isLogoutConfirmOpen}
                onCancel={() => setIsLogoutConfirmOpen(false)}
                onOk={handleConfirmLogout}
                okText="Đăng xuất"
                cancelText="Quay lại"
                okButtonProps={{ danger: true, className: 'rounded-lg font-bold text-xs' }}
                cancelButtonProps={{ className: 'rounded-lg font-bold text-xs' }}
                className="rounded-2xl"
            >
                <p className="text-sm text-gray-500 mt-2">Bạn có chắc chắn muốn đăng xuất khỏi hệ thống Traveloka không?</p>
            </Modal>
        </div>
    );
};

export default Profile;
