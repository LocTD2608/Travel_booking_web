import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../context';

const Footer: React.FC = () => {
    const { t } = useLanguage();

    return (
        <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
            <div className="layout-container px-4 md:px-10 lg:px-40">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
                    <div className="col-span-2 lg:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="material-symbols-outlined text-travel-blue text-3xl">flight_takeoff</span>
                            <h2 className="text-[#141414] text-xl font-black tracking-tight">Booking Travel</h2>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-sm">
                            {t('footer.desc', "Booking Travel is Southeast Asia's leading travel platform, providing diverse travel needs in one platform. We are here to help you discover the world.")}
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
                        <h4 className="font-bold mb-4">{t('footer.aboutTitle', 'About Booking Travel')}</h4>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><Link className="hover:text-primary" to="/how-to-book">{t('footer.howToBook', 'How to Book')}</Link></li>
                            <li><Link className="hover:text-primary" to="/contact">{t('footer.contactUs', 'Contact Us')}</Link></li>
                            <li><Link className="hover:text-primary" to="/help-center">{t('footer.helpCenter', 'Help Center')}</Link></li>
                            <li><Link className="hover:text-primary" to="/careers">{t('footer.careers', 'Careers')}</Link></li>
                            <li><Link className="hover:text-primary" to="/about">{t('footer.aboutUs', 'About Us')}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">{t('footer.productsTitle', 'Products')}</h4>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><Link className="hover:text-primary" to="/hotels">{t('footer.hotels', 'Hotels')}</Link></li>
                            <li><Link className="hover:text-primary" to="/flights">{t('footer.flights', 'Flights')}</Link></li>
                            <li><Link className="hover:text-primary" to="/apartments">{t('footer.apartments', 'Apartments')}</Link></li>
                            <li><Link className="hover:text-primary" to="/trains">{t('footer.trains', 'Trains')}</Link></li>
                            <li><Link className="hover:text-primary" to="/experience">{t('footer.experience', 'Experience')}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">{t('footer.othersTitle', 'Others')}</h4>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><a className="hover:text-primary" href="#">{t('footer.affiliate', 'Booking Travel Affiliate')}</a></li>
                            <li><a className="hover:text-primary" href="#">{t('footer.blog', 'Blog')}</a></li>
                            <li><a className="hover:text-primary" href="#">{t('footer.privacy', 'Privacy Policy')}</a></li>
                            <li><a className="hover:text-primary" href="#">{t('footer.terms', 'Terms & Conditions')}</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-400">{t('footer.rights', '© 2024 Booking Travel. All rights reserved.')}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
