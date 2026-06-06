import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import AuthModal from '../../auth/AuthModal';
import { notification } from 'antd';
import { cancellationApi } from '../../../services/cancellationApi';
import { useLanguage } from '../../../context';


const Header: React.FC = () => {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authInitialView, setAuthInitialView] = useState<'login' | 'register'>('login');
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

    const { user, logout, isAuthenticated } = useAuth();
    const { language, setLanguage, t } = useLanguage();
    const location = useLocation();

    useEffect(() => {
        if (!isAuthenticated) return;

        const checkNotifications = async () => {
            try {
                const notifs = await cancellationApi.getNotifications();
                for (const notif of notifs) {
                    const isApproved = notif.status === 'approved';
                    notification[isApproved ? 'success' : 'error']({
                        message: isApproved ? 'Hoàn tiền thành công!' : 'Yêu cầu hủy bị từ chối',
                        description: `Yêu cầu hủy đơn đặt chỗ #${notif.bookingId} (${notif.bookingDetail}) đã được ${isApproved ? 'phê duyệt và hoàn tiền thành công!' : 'từ chối bởi quản trị viên.'}`,
                        duration: 8,
                    });
                    // Acknowledge right away
                    await cancellationApi.acknowledgeNotification(notif.id);
                }
            } catch (err) {
                console.error('Error fetching cancellation notifications:', err);
            }
        };

        // Check on mount
        checkNotifications();

        // Poll every 10 seconds
        const timer = setInterval(checkNotifications, 10000);
        return () => clearInterval(timer);
    }, [isAuthenticated]);

    const handleOpenLogin = () => {
        setAuthInitialView('login');
        setIsAuthModalOpen(true);
    };

    const handleOpenRegister = () => {
        setAuthInitialView('register');
        setIsAuthModalOpen(true);
    };

    const isAccomActive = activeMenu === 'accommodations' || (!activeMenu && (location.pathname === '/hotels' || location.pathname === '/apartments'));
    const isTransportActive = activeMenu === 'transport' || (!activeMenu && (location.pathname === '/flights' || location.pathname === '/trains'));
    const isXperienceActive = activeMenu === 'xperience' || (!activeMenu && location.pathname === '/experience');

    const getNavClass = (isActive: boolean) =>
        `group flex flex-col items-center py-4 border-b-[3px] transition-colors duration-200 ${isActive ? 'border-travel-blue text-travel-blue' : 'border-transparent text-gray-500 hover:text-primary'}`;

    return (
        <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
            <div className="px-4 md:px-10 lg:px-40 py-3 flex items-center justify-between border-b border-gray-100">
                <Link to="/" className="flex items-center gap-2 cursor-pointer">
                    <span className="material-symbols-outlined text-travel-blue text-3xl">flight_takeoff</span>
                    <h2 className="text-[#141414] text-2xl font-black tracking-tight">Booking Travel</h2>
                </Link>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <Link className="hover:text-travel-blue transition-colors" to="/help-center">{t('header.help', 'Help')}</Link>
                        <Link className="hover:text-travel-blue transition-colors" to="/profile/booking-history">{t('header.myBooking', 'My Booking')}</Link>
                        {isAuthenticated && (
                            <Link className="hover:text-travel-blue transition-colors" to="/profile">{t('header.profile', 'Profile')}</Link>
                        )}
                    </div>

                    {/* Language Switcher */}
                    <button
                        onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-bold hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 cursor-pointer shadow-sm"
                        title={language === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
                    >
                        {language === 'vi' ? (
                            <>
                                <span className="text-sm">🇻🇳</span>
                                <span className="text-gray-700">VI</span>
                            </>
                        ) : (
                            <>
                                <span className="text-sm">🇬🇧</span>
                                <span className="text-gray-700">EN</span>
                            </>
                        )}
                    </button>

                    <div className="flex gap-3">
                        {isAuthenticated ? (
                            <Link to="/profile" className="flex items-center gap-4 animate-fade-in group">
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-bold text-gray-900 group-hover:text-travel-blue">{t('header.hi', 'Hi, ')}{user?.Ten}</span>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.preventDefault(); setIsLogoutConfirmOpen(true); }}
                                        className="text-xs text-red-500 hover:underline"
                                    >
                                        {t('header.logOut', 'Log Out')}
                                    </button>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-travel-blue flex items-center justify-center text-white font-bold hover-scale cursor-pointer">
                                    {user?.Ten?.[0]}
                                </div>
                            </Link>
                        ) : (
                            <>
                                <button
                                    onClick={handleOpenLogin}
                                    className="hidden sm:flex items-center justify-center rounded-lg h-9 px-4 border border-gray-200 text-sm font-bold hover:bg-gray-50 transition-all hover-lift active:scale-95"
                                >
                                    {t('header.logIn', 'Log In')}
                                </button>
                                <button
                                    onClick={handleOpenRegister}
                                    className="flex items-center justify-center rounded-lg h-9 px-4 bg-primary text-white text-sm font-bold hover:bg-gray-800 transition-all hover-lift active:scale-95"
                                >
                                    {t('header.register', 'Register')}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="relative" onMouseLeave={() => setActiveMenu(null)}>
                <div className="hidden md:flex justify-center border-b border-gray-100 bg-white">
                    <nav className="flex gap-8 px-4">
                        <Link to="/hotels" className={getNavClass(isAccomActive)} onMouseEnter={() => setActiveMenu('accommodations')}>
                            <span className="material-symbols-outlined mb-1 group-hover:-translate-y-0.5 transition-transform">hotel</span>
                            <span className="text-sm font-bold">{t('header.accommodations', 'Accommodations')}</span>
                        </Link>
                        <Link to="/flights" className={getNavClass(isTransportActive)} onMouseEnter={() => setActiveMenu('transport')}>
                            <span className="material-symbols-outlined mb-1 group-hover:-translate-y-0.5 transition-transform">flight</span>
                            <span className="text-sm font-bold">{t('header.transport', 'Transport')}</span>
                        </Link>
                        <Link to="/experience" className={getNavClass(isXperienceActive)} onMouseEnter={() => setActiveMenu('xperience')}>
                            <span className="material-symbols-outlined mb-1 group-hover:-translate-y-0.5 transition-transform">local_activity</span>
                            <span className="text-sm font-bold">{t('header.experience', 'Experience')}</span>
                        </Link>
                        <Link to="/mobile-credit" className={getNavClass(activeMenu === 'bills')} onMouseEnter={() => setActiveMenu('bills')}>
                            <span className="material-symbols-outlined mb-1 group-hover:-translate-y-0.5 transition-transform">credit_card</span>
                            <span className="text-sm font-bold">{t('header.bills', 'Bills & Top-up')}</span>
                        </Link>
                    </nav>
                </div>

                {/* Secondary Navigation Menu (Sub-links) */}
                <div
                    className={`absolute w-full left-0 z-40 bg-gray-50 hidden lg:flex justify-center transition-all duration-300 overflow-hidden shadow-md ${activeMenu ? 'py-2 border-b border-gray-200 opacity-100 h-9' : 'opacity-0 h-0 py-0 border-transparent'}`}
                    onMouseEnter={() => { }}
                    onMouseLeave={() => setActiveMenu(null)}
                >
                    <div className="flex gap-6 text-sm font-medium text-gray-600">
                        {activeMenu === 'accommodations' && (
                            <>
                                <Link className="hover:text-travel-blue" to="/hotels">{t('header.hotels', 'Hotels')}</Link>
                                <Link className="hover:text-travel-blue" to="/villas">{t('header.villas', 'Villas')}</Link>
                                <Link className="hover:text-travel-blue" to="/apartments">{t('header.apartments', 'Apartments')}</Link>
                            </>
                        )}
                        {activeMenu === 'transport' && (
                            <>
                                <Link className="hover:text-travel-blue" to="/flights">{t('header.flights', 'Flights')}</Link>
                                <Link className="hover:text-travel-blue" to="/trains">{t('header.trains', 'Trains')}</Link>
                                <Link className="hover:text-travel-blue" to="/bus">{t('header.bus', 'Bus & Shuttle')}</Link>
                                <Link className="hover:text-travel-blue" to="/airport-transfer">{t('header.airportTransfer', 'Airport Transfer')}</Link>
                                <Link className="hover:text-travel-blue" to="/car-rental">{t('header.carRental', 'Car Rental')}</Link>
                            </>
                        )}
                        {activeMenu === 'xperience' && (
                            <Link className="hover:text-travel-blue" to="/experience">{t('header.activities', 'Activities & Attractions')}</Link>
                        )}
                        {activeMenu === 'bills' && (
                            <>
                                <Link className="hover:text-travel-blue" to="/mobile-credit">{t('header.mobileCredit', 'Mobile Credit')}</Link>
                                <Link className="hover:text-travel-blue" to="/data-plans">{t('header.dataPlans', 'Data Plans')}</Link>
                                <Link className="hover:text-travel-blue" to="/electricity">{t('header.electricity', 'Electricity')}</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialView={authInitialView === 'login' ? 'login' : 'register'}
            />

            {/* Logout Confirmation Modal */}
            {isLogoutConfirmOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl animate-scale-in">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 font-['Plus_Jakarta_Sans']">{t('header.logoutTitle', 'Log Out Confirmation')}</h3>
                        <p className="text-gray-600 mb-6 text-sm">{t('header.logoutConfirm', 'Are you sure you want to log out of your account?')}</p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setIsLogoutConfirmOpen(false)}
                                className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors hover-scale"
                            >
                                {t('header.cancel', 'Cancel')}
                            </button>
                            <button
                                onClick={() => {
                                    logout();
                                    setIsLogoutConfirmOpen(false);
                                }}
                                className="px-4 py-2 text-sm font-bold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all hover-lift shadow-sm hover:shadow-red-200"
                            >
                                {t('header.logOut', 'Log Out')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
