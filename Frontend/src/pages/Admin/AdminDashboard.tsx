import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

type TabKey = 'dashboard' | 'users' | 'bookings' | 'hotels' | 'flights' | 'settings';

const AdminDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const menuItems: { key: TabKey; icon: string; label: string }[] = [
        { key: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
        { key: 'users', icon: 'group', label: 'Quản lý Users' },
        { key: 'bookings', icon: 'book_online', label: 'Quản lý Booking' },
        { key: 'hotels', icon: 'hotel', label: 'Quản lý Hotels' },
        { key: 'flights', icon: 'flight', label: 'Quản lý Flights' },
        { key: 'settings', icon: 'settings', label: 'Cài đặt' },
    ];

    const statsCards = [
        { title: 'Tổng Users', value: '1,248', icon: 'group', color: 'from-blue-500 to-blue-600', change: '+12%' },
        { title: 'Bookings hôm nay', value: '56', icon: 'book_online', color: 'from-emerald-500 to-emerald-600', change: '+8%' },
        { title: 'Doanh thu tháng', value: '₫ 2.4B', icon: 'payments', color: 'from-purple-500 to-purple-600', change: '+23%' },
        { title: 'Đánh giá TB', value: '4.8', icon: 'star', color: 'from-amber-500 to-amber-600', change: '+0.2' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
            {/* Sidebar */}
            <aside
                className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white flex flex-col transition-all duration-300 fixed h-full z-40`}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
                    <span className="material-symbols-outlined text-travel-blue text-3xl">flight_takeoff</span>
                    {!sidebarCollapsed && <span className="text-xl font-black tracking-tight">Traveloka</span>}
                </div>

                {/* Menu */}
                <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => (
                        <button
                            key={item.key}
                            onClick={() => setActiveTab(item.key)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                                ${activeTab === item.key
                                    ? 'bg-travel-blue text-white shadow-lg shadow-blue-500/30'
                                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            <span className="material-symbols-outlined text-xl">{item.icon}</span>
                            {!sidebarCollapsed && <span>{item.label}</span>}
                        </button>
                    ))}
                </nav>

                {/* Collapse Toggle */}
                <div className="px-3 py-3 border-t border-white/10">
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors text-sm"
                    >
                        <span className="material-symbols-outlined text-xl">
                            {sidebarCollapsed ? 'chevron_right' : 'chevron_left'}
                        </span>
                        {!sidebarCollapsed && <span>Thu gọn</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className={`flex-1 ${sidebarCollapsed ? 'ml-20' : 'ml-64'} transition-all duration-300`}>
                {/* Top Bar */}
                <header className="bg-white sticky top-0 z-30 border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
                    <div>
                        <h1 className="text-lg font-bold text-gray-900">
                            {menuItems.find(i => i.key === activeTab)?.label || 'Dashboard'}
                        </h1>
                        <p className="text-xs text-gray-500">Admin Panel — Traveloka</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            to="/"
                            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-travel-blue transition-colors"
                        >
                            <span className="material-symbols-outlined text-lg">home</span>
                            Về trang chủ
                        </Link>
                        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                            <div className="text-right">
                                <p className="text-sm font-bold text-gray-900">{user?.Ho} {user?.Ten}</p>
                                <p className="text-xs text-gray-500">Administrator</p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-travel-blue to-blue-700 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                A
                            </div>
                            <button
                                onClick={logout}
                                className="ml-2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Đăng xuất"
                            >
                                <span className="material-symbols-outlined text-xl">logout</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    {activeTab === 'dashboard' && (
                        <div className="space-y-6">
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                {statsCards.map((card, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                                                <span className="material-symbols-outlined text-white text-xl">{card.icon}</span>
                                            </div>
                                            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{card.change}</span>
                                        </div>
                                        <p className="text-2xl font-black text-gray-900">{card.value}</p>
                                        <p className="text-xs text-gray-500 mt-1">{card.title}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                    <h3 className="font-bold text-gray-900">Hoạt động gần đây</h3>
                                    <button className="text-sm text-travel-blue hover:underline">Xem tất cả</button>
                                </div>
                                <div className="divide-y divide-gray-50">
                                    {[
                                        { user: 'Nguyễn Văn A', action: 'đã đặt phòng khách sạn', time: '5 phút trước', icon: 'hotel', color: 'text-blue-500 bg-blue-50' },
                                        { user: 'Trần Thị B', action: 'đã mua vé máy bay', time: '12 phút trước', icon: 'flight', color: 'text-purple-500 bg-purple-50' },
                                        { user: 'Lê Văn C', action: 'đã đăng ký tài khoản', time: '30 phút trước', icon: 'person_add', color: 'text-emerald-500 bg-emerald-50' },
                                        { user: 'Phạm Thị D', action: 'đã thanh toán booking #1234', time: '1 giờ trước', icon: 'payments', color: 'text-amber-500 bg-amber-50' },
                                        { user: 'Hoàng Văn E', action: 'đã hủy đặt phòng', time: '2 giờ trước', icon: 'cancel', color: 'text-red-500 bg-red-50' },
                                    ].map((item, idx) => (
                                        <div key={idx} className="px-6 py-3.5 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
                                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${item.color}`}>
                                                <span className="material-symbols-outlined text-lg">{item.icon}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-900">
                                                    <span className="font-semibold">{item.user}</span> {item.action}
                                                </p>
                                            </div>
                                            <span className="text-xs text-gray-400 whitespace-nowrap">{item.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab !== 'dashboard' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mx-auto mb-5">
                                <span className="material-symbols-outlined text-travel-blue text-4xl">
                                    {menuItems.find(i => i.key === activeTab)?.icon || 'construction'}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {menuItems.find(i => i.key === activeTab)?.label}
                            </h3>
                            <p className="text-gray-500 text-sm max-w-md mx-auto">
                                Tính năng này đang được phát triển. Vui lòng quay lại sau.
                            </p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
