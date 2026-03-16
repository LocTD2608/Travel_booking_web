import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
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
                            <li><Link className="hover:text-primary" to="/how-to-book">How to Book</Link></li>
                            <li><Link className="hover:text-primary" to="/contact">Contact Us</Link></li>
                            <li><Link className="hover:text-primary" to="/help-center">Help Center</Link></li>
                            <li><Link className="hover:text-primary" to="/careers">Careers</Link></li>
                            <li><Link className="hover:text-primary" to="/about">About Us</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Products</h4>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><Link className="hover:text-primary" to="/hotels">Hotels</Link></li>
                            <li><Link className="hover:text-primary" to="/flights">Flights</Link></li>
                            <li><Link className="hover:text-primary" to="/apartments">Apartments</Link></li>
                            <li><Link className="hover:text-primary" to="/trains">Trains</Link></li>
                            <li><Link className="hover:text-primary" to="/experience">Experience</Link></li>
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
    );
};

export default Footer;
