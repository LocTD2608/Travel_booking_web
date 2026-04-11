import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import AuthModal from '../../auth/AuthModal';

const Header: React.FC = () => {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authInitialView, setAuthInitialView] = useState<'login' | 'register'>('login');
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

    const { user, logout, isAuthenticated } = useAuth();
    const location = useLocation();

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
                    <h2 className="text-[#141414] text-2xl font-black tracking-tight">Traveloka</h2>
                </Link>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <Link className="hover:text-travel-blue transition-colors" to="/help-center">Help</Link>
                        <a className="hover:text-travel-blue transition-colors" href="#">My Booking</a>
                    </div>
                    <div className="flex gap-3">
                        {isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-bold text-gray-900">Hi, {user?.Ten}</span>
                                    <button
                                        onClick={() => setIsLogoutConfirmOpen(true)}
                                        className="text-xs text-red-500 hover:underline"
                                    >
                                        Đăng xuất
                                    </button>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-travel-blue flex items-center justify-center text-white font-bold">
                                    {user?.Ten?.[0]}
                                </div>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={handleOpenLogin}
                                    className="hidden sm:flex items-center justify-center rounded-lg h-9 px-4 border border-gray-200 text-sm font-bold hover:bg-gray-50 transition-colors"
                                >
                                    Log In
                                </button>
                                <button
                                    onClick={handleOpenRegister}
                                    className="flex items-center justify-center rounded-lg h-9 px-4 bg-primary text-white text-sm font-bold hover:bg-gray-800 transition-colors"
                                >
                                    Register
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <nav className="hidden md:flex justify-center bg-white border-b border-gray-100">
                <div className="flex gap-8 px-4">
                    <Link to="/" className={getNavClass(isAccomActive)} onMouseEnter={() => setActiveMenu('accommodations')}>
                        <span className="material-symbols-outlined mb-1">hotel</span>
                        <span className="text-sm font-bold">Accommodations</span>
                    </Link>
                    <Link to="/flights" className={getNavClass(isTransportActive)} onMouseEnter={() => setActiveMenu('transport')}>
                        <span className="material-symbols-outlined mb-1">flight</span>
                        <span className="text-sm font-bold">Transport</span>
                    </Link>
                    <Link to="/experience" className={getNavClass(isXperienceActive)} onMouseEnter={() => setActiveMenu('xperience')}>
                        <span className="material-symbols-outlined mb-1">local_activity</span>
                        <span className="text-sm font-bold">Experience</span>
                    </Link>
                </div>
            </nav>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialView={authInitialView === 'login' ? 'login' : 'register'}
            />

            {/* Logout Confirmation Modal */}
            {isLogoutConfirmOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 font-['Plus_Jakarta_Sans']">Xác nhận đăng xuất?</h3>
                        <p className="text-gray-600 mb-6 text-sm">Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?</p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setIsLogoutConfirmOpen(false)}
                                className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={() => {
                                    logout();
                                    setIsLogoutConfirmOpen(false);
                                }}
                                className="px-4 py-2 text-sm font-bold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
