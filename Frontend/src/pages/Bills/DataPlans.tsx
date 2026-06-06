import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../../components/auth/AuthModal';
import { useLanguage } from '../../context';

const MOCK_DATA_PLANS = [
    { id: 'd1', name: 'ST120K', data: '60GB / 30 Days', price: 120000, desc: '2GB / Day. Free calls under 20 mins.' },
    { id: 'd2', name: 'ST90', data: '30GB / 30 Days', price: 90000, desc: '1GB / Day. Unlimited Tiktok.' },
    { id: 'd3', name: 'V120', data: '60GB / 30 Days', price: 120000, desc: '2GB / Day. 50 mins off-net calls.' }
];

const DataPlans: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { t, language } = useLanguage();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [selectedNetwork, setSelectedNetwork] = useState('Viettel');

    const handleRegister = (plan: typeof MOCK_DATA_PLANS[0]) => {
        if (!isAuthenticated) { setIsAuthModalOpen(true); return; }
        const params = new URLSearchParams({
            type: 'data_plan',
            name: `${selectedNetwork} - ${plan.name}`,
            price: String(plan.price),
            detail2: plan.data,
            detail3: plan.desc,
        });
        navigate(`/booking?${params.toString()}`);
    };

    const translatePlan = (plan: typeof MOCK_DATA_PLANS[0]) => {
        if (language === 'en') {
            return {
                ...plan,
                data: plan.data,
                desc: plan.desc
            };
        } else {
            // Translate description to Vietnamese
            const viDescMap: Record<string, string> = {
                'd1': '2GB / Ngày. Miễn phí cuộc gọi dưới 20 phút.',
                'd2': '1GB / Ngày. Không giới hạn Tiktok.',
                'd3': '2GB / Ngày. 50 phút gọi ngoại mạng.'
            };
            const viDataMap: Record<string, string> = {
                'd1': '60GB / 30 Ngày',
                'd2': '30GB / 30 Ngày',
                'd3': '60GB / 30 Ngày'
            };
            return {
                ...plan,
                data: viDataMap[plan.id] || plan.data,
                desc: viDescMap[plan.id] || plan.desc
            };
        }
    };

    return (
        <div className="bg-[#f5f7fa] min-h-screen pb-10 font-['Plus_Jakarta_Sans']">
            <div className="bg-white border-b border-gray-200 py-4 mb-6 sticky z-30 flex justify-center shadow-sm" style={{ top: '64px' }}>
                <div className="w-full max-w-[1200px] px-4 flex items-center justify-between">
                    <div className="flex gap-10">
                        <div>
                            <div className="text-xs text-gray-500 font-bold mb-0.5 tracking-wider">{t('bills.data', 'Gói dữ liệu di động').toUpperCase()}</div>
                            <div className="text-[15px] font-bold text-gray-900">{t('bills.3g4g', 'Gói cước 3G / 4G')}</div>
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
                            {['Viettel', 'Mobifone', 'Vinaphone'].map(net => (
                                <label key={net} className="flex justify-between items-center mb-3 cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <input 
                                            type="radio" 
                                            name="network" 
                                            className="w-4 h-4 text-travel-blue cursor-pointer" 
                                            checked={selectedNetwork === net}
                                            onChange={() => setSelectedNetwork(net)}
                                        />
                                        <span className="text-sm font-medium text-gray-700">{net}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-4">
                    {MOCK_DATA_PLANS.map(plan => {
                        const translated = translatePlan(plan);
                        return (
                            <div key={plan.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex justify-between items-center hover:border-travel-blue hover:shadow-md transition-all cursor-pointer">
                                <div>
                                    <div className="text-2xl font-black text-travel-blue mb-1">{translated.name}</div>
                                    <div className="text-sm font-bold text-gray-900 mb-1">{translated.data}</div>
                                    <div className="text-xs text-gray-500">{translated.desc}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-black text-gray-900 mb-3">{translated.price.toLocaleString()} VNĐ</div>
                                    <button 
                                        className="bg-travel-blue text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm active:scale-[0.98]"
                                        onClick={() => handleRegister(plan)}
                                    >
                                        {t('bills.register', 'Đăng ký')}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialView="login" />
        </div>
    );
};

export default DataPlans;
