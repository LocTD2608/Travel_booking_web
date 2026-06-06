import React from 'react';
import { useLanguage } from '../../context';

const Electricity: React.FC = () => {
    const { t, language } = useLanguage();

    const evnProviders = language === 'en'
        ? ['EVN Hanoi', 'EVN Ho Chi Minh', 'EVN Central', 'EVN South', 'EVN North']
        : ['EVN Hà Nội', 'EVN TP. Hồ Chí Minh', 'EVN Miền Trung', 'EVN Miền Nam', 'EVN Miền Bắc'];

    return (
        <div className="bg-[#f5f7fa] min-h-screen pb-10 font-['Plus_Jakarta_Sans']">
            <div className="bg-white border-b border-gray-200 py-4 mb-6 sticky z-30 flex justify-center shadow-sm" style={{ top: '64px' }}>
                <div className="w-full max-w-[1200px] px-4 flex items-center justify-between">
                    <div className="flex gap-10">
                        <div>
                            <div className="text-xs text-gray-500 font-bold mb-0.5 tracking-wider">{t('bills.electricity', 'Hóa đơn điện').toUpperCase()}</div>
                            <div className="text-[15px] font-bold text-gray-900">{t('bills.evn', 'Thanh toán EVN')}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 flex gap-6">
                <div className="w-[280px] flex-shrink-0">
                    <div className="bg-white border text-gray-800 border-gray-200 rounded-xl p-5 mb-4 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg">{t('bills.provider', 'Nhà cung cấp')}</h3>
                        </div>
                        <div className="mb-6">
                            {evnProviders.map(net => (
                                <label key={net} className="flex justify-between items-center mb-3 cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <input type="radio" name="evn" className="w-4 h-4 text-travel-blue" defaultChecked={net.includes('Ho Chi Minh') || net.includes('Hồ Chí Minh')} />
                                        <span className="text-sm font-medium text-gray-700">{net}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-4">
                    <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm text-center">
                        <span className="material-symbols-outlined text-6xl text-yellow-500 mb-4 block">bolt</span>
                        <h3 className="font-bold text-2xl mb-2">{t('bills.payTitle', 'Thanh toán hóa đơn điện')}</h3>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">{t('bills.payDesc', 'Nhập Mã khách hàng để kiểm tra và thanh toán hóa đơn EVN an toàn và nhanh chóng.')}</p>

                        <div className="max-w-md mx-auto text-left">
                            <label className="block text-sm font-bold text-gray-700 mb-2">{t('bills.customerCode', 'Mã khách hàng (VD: PE000000000)')}</label>
                            <input type="text" placeholder={t('bills.enterCode', 'Nhập mã khách hàng tại đây')} className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-travel-blue mb-4" />
                            <button className="w-full bg-travel-blue text-white px-8 py-3 font-bold rounded-lg hover:bg-blue-700 transition-colors">{t('bills.checkBill', 'Kiểm tra hóa đơn')}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Electricity;
