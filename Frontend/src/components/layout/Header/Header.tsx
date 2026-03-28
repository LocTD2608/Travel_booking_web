import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const location = useLocation();

    const isAccomActive = activeMenu === 'accommodations' || (!activeMenu && (location.pathname === '/hotels' || location.pathname === '/apartments'));
    const isTransportActive = activeMenu === 'transport' || (!activeMenu && (location.pathname === '/flights' || location.pathname === '/trains'));
    const isXperienceActive = activeMenu === 'xperience' || (!activeMenu && location.pathname === '/experience');
    const isBillsActive = activeMenu === 'bills';

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
                        <a className="hover:text-travel-blue transition-colors" href="#">EN | USD</a>
                        <Link className="hover:text-travel-blue transition-colors" to="/help-center">Help</Link>
                        <a className="hover:text-travel-blue transition-colors" href="#">My Booking</a>
                    </div>
                    <div className="flex gap-3">
                        <button className="hidden sm:flex items-center justify-center rounded-lg h-9 px-4 border border-gray-200 text-sm font-bold hover:bg-gray-50 transition-colors">
                            Log In
                        </button>
                        <button className="flex items-center justify-center rounded-lg h-9 px-4 bg-primary text-white text-sm font-bold hover:bg-gray-800 transition-colors">
                            Register
                        </button>
                    </div>
                </div>
            </div>

            <div className="relative" onMouseLeave={() => setActiveMenu(null)}>
                <div className="hidden md:flex justify-center border-b border-gray-100 bg-white">
                    <nav className="flex gap-8 px-4">
                        <Link to="/" className={getNavClass(isAccomActive)} onMouseEnter={() => setActiveMenu('accommodations')}>
                            <span className="material-symbols-outlined mb-1 group-hover:-translate-y-0.5 transition-transform">hotel</span>
                            <span className="text-sm font-bold">Accommodations</span>
                        </Link>
                        <Link to="/flights" className={getNavClass(isTransportActive)} onMouseEnter={() => setActiveMenu('transport')}>
                            <span className="material-symbols-outlined mb-1 group-hover:-translate-y-0.5 transition-transform">flight</span>
                            <span className="text-sm font-bold">Transport</span>
                        </Link>
                        <Link to="/experience" className={getNavClass(isXperienceActive)} onMouseEnter={() => setActiveMenu('xperience')}>
                            <span className="material-symbols-outlined mb-1 group-hover:-translate-y-0.5 transition-transform">local_activity</span>
                            <span className="text-sm font-bold">Experience</span>
                        </Link>
                        <a className={getNavClass(isBillsActive)} href="#" onMouseEnter={() => setActiveMenu('bills')}>
                            <span className="material-symbols-outlined mb-1 group-hover:-translate-y-0.5 transition-transform">credit_card</span>
                            <span className="text-sm font-bold">Bills & Top-up</span>
                        </a>
                    </nav>
                </div>

                <div
                    className={`absolute w-full left-0 z-40 bg-gray-50 hidden lg:flex justify-center transition-all duration-300 overflow-hidden shadow-md ${activeMenu ? 'py-2 border-b border-gray-200 opacity-100 h-9' : 'opacity-0 h-0 py-0 border-transparent'}`}
                    onMouseEnter={() => { }}
                    onMouseLeave={() => setActiveMenu(null)}
                >
                    <div className="flex gap-6 text-sm font-medium text-gray-600">
                        {activeMenu === 'accommodations' && (
                            <>
                                <Link className="hover:text-travel-blue" to="/hotels">Hotels</Link>
                                <a className="hover:text-travel-blue" href="#">Villas</a>
                                <Link className="hover:text-travel-blue" to="/apartments">Apartments</Link>
                            </>
                        )}
                        {activeMenu === 'transport' && (
                            <>
                                <Link className="hover:text-travel-blue" to="/flights">Flights</Link>
                                <Link className="hover:text-travel-blue" to="/trains">Trains</Link>
                                <a className="hover:text-travel-blue" href="#">Bus &amp; Shuttle</a>
                                <a className="hover:text-travel-blue" href="#">Airport Transfer</a>
                                <a className="hover:text-travel-blue" href="#">Car Rental</a>
                            </>
                        )}
                        {activeMenu === 'xperience' && (
                            <Link className="hover:text-travel-blue" to="/experience">Activities &amp; Attractions</Link>
                        )}
                        {activeMenu === 'bills' && (
                            <>
                                <a className="hover:text-travel-blue" href="#">Mobile Credit</a>
                                <a className="hover:text-travel-blue" href="#">Data Plans</a>
                                <a className="hover:text-travel-blue" href="#">Electricity</a>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
