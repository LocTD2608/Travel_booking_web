import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background-light">
            {/* Header */}
            <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
                <div className="px-4 md:px-10 lg:px-40 py-3 flex items-center justify-between border-b border-gray-100">
                    <Link to="/" className="flex items-center gap-2 cursor-pointer">
                        <span className="material-symbols-outlined text-travel-blue text-3xl">flight_takeoff</span>
                        <h2 className="text-[#141414] text-2xl font-black tracking-tight">Traveloka</h2>
                    </Link>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                            <a className="hover:text-travel-blue transition-colors" href="#">EN | USD</a>
                            <a className="hover:text-travel-blue transition-colors" href="#">Help</a>
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

                <div className="hidden md:flex justify-center border-b border-gray-100 bg-white">
                    <nav className="flex gap-8 px-4">
                        <Link to="/" className="group flex flex-col items-center py-4 border-b-[3px] border-travel-blue text-travel-blue">
                            <span className="material-symbols-outlined mb-1 group-hover:-translate-y-0.5 transition-transform">hotel</span>
                            <span className="text-sm font-bold">Accommodations</span>
                        </Link>
                        <Link to="/flights" className="group flex flex-col items-center py-4 border-b-[3px] border-transparent text-gray-500 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined mb-1 group-hover:-translate-y-0.5 transition-transform">flight</span>
                            <span className="text-sm font-bold">Flights</span>
                        </Link>
                        <Link to="/experience" className="group flex flex-col items-center py-4 border-b-[3px] border-transparent text-gray-500 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined mb-1 group-hover:-translate-y-0.5 transition-transform">local_activity</span>
                            <span className="text-sm font-bold">Xperience</span>
                        </Link>
                        <a className="group flex flex-col items-center py-4 border-b-[3px] border-transparent text-gray-500 hover:text-primary transition-colors" href="#">
                            <span className="material-symbols-outlined mb-1 group-hover:-translate-y-0.5 transition-transform">credit_card</span>
                            <span className="text-sm font-bold">Bills & Top-up</span>
                        </a>
                    </nav>
                </div>

                <div className="bg-gray-50 hidden lg:flex justify-center py-2 border-b border-gray-200">
                    <div className="flex gap-6 text-sm font-medium text-gray-600">
                        <a className="hover:text-travel-blue" href="#">Hotels</a>
                        <a className="hover:text-travel-blue" href="#">Villas</a>
                        <a className="hover:text-travel-blue" href="#">Apartments</a>
                        <a className="hover:text-travel-blue" href="#">Trains</a>
                        <a className="hover:text-travel-blue" href="#">Bus & Shuttle</a>
                        <a className="hover:text-travel-blue" href="#">Airport Transfer</a>
                        <a className="hover:text-travel-blue" href="#">Car Rental</a>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
                <div className="layout-container px-4 md:px-10 lg:px-40">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
                        <div className="col-span-2 lg:col-span-2">
                            <div className="flex items-center gap-2 mb-6">
                                <span className="material-symbols-outlined text-travel-blue text-3xl">flight_takeoff</span>
                                <h2 className="text-[#141414] text-xl font-black tracking-tight">Traveloka</h2>
                            </div>
                            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-sm">
                                Traveloka is Southeast Asia's leading travel platform, providing diverse travel needs in one platform. We are here to help you discover the world.
                            </p>
                            <div className="flex gap-4">
                                <a className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors" href="#">
                                    <span className="text-xs font-bold text-gray-600">FB</span>
                                </a>
                                <a className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors" href="#">
                                    <span className="text-xs font-bold text-gray-600">IG</span>
                                </a>
                                <a className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors" href="#">
                                    <span className="text-xs font-bold text-gray-600">TW</span>
                                </a>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">About Traveloka</h4>
                            <ul className="space-y-3 text-sm text-gray-500">
                                <li><a className="hover:text-primary" href="#">How to Book</a></li>
                                <li><a className="hover:text-primary" href="#">Contact Us</a></li>
                                <li><a className="hover:text-primary" href="#">Help Center</a></li>
                                <li><a className="hover:text-primary" href="#">Careers</a></li>
                                <li><a className="hover:text-primary" href="#">About Us</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Products</h4>
                            <ul className="space-y-3 text-sm text-gray-500">
                                <li><a className="hover:text-primary" href="#">Hotels</a></li>
                                <li><a className="hover:text-primary" href="#">Flights</a></li>
                                <li><a className="hover:text-primary" href="#">Apartments</a></li>
                                <li><a className="hover:text-primary" href="#">Trains</a></li>
                                <li><a className="hover:text-primary" href="#">Xperience</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Others</h4>
                            <ul className="space-y-3 text-sm text-gray-500">
                                <li><a className="hover:text-primary" href="#">Traveloka Affiliate</a></li>
                                <li><a className="hover:text-primary" href="#">Blog</a></li>
                                <li><a className="hover:text-primary" href="#">Privacy Policy</a></li>
                                <li><a className="hover:text-primary" href="#">Terms & Conditions</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-gray-400">© 2024 Traveloka. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
