import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../../components/auth/AuthModal';

const MOCK_DATA_PLANS = [
    { id: 'd1', name: 'ST120K', data: '60GB / 30 Days', price: 120000, desc: '2GB / Day. Free calls under 20 mins.' },
    { id: 'd2', name: 'ST90', data: '30GB / 30 Days', price: 90000, desc: '1GB / Day. Unlimited Tiktok.' },
    { id: 'd3', name: 'V120', data: '60GB / 30 Days', price: 120000, desc: '2GB / Day. 50 mins off-net calls.' }
];

const DataPlans: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
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

    return (
        <div className="bg-[#f5f7fa] min-h-screen pb-10 font-['Plus_Jakarta_Sans']">
            <div className="bg-white border-b border-gray-200 py-4 mb-6 sticky z-30 flex justify-center shadow-sm" style={{ top: '64px' }}>
                <div className="w-full max-w-[1200px] px-4 flex items-center justify-between">
                    <div className="flex gap-10">
                        <div>
                            <div className="text-xs text-gray-500 font-bold mb-0.5 tracking-wider">DATA PLANS</div>
                            <div className="text-[15px] font-bold text-gray-900">3G / 4G Packages</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 flex gap-6">
                <div className="w-[280px] flex-shrink-0">
                    <div className="bg-white border text-gray-800 border-gray-200 rounded-xl p-5 mb-4 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg">Provider</h3>
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
                    {MOCK_DATA_PLANS.map(plan => (
                        <div key={plan.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex justify-between items-center hover:border-travel-blue hover:shadow-md transition-all cursor-pointer">
                            <div>
                                <div className="text-2xl font-black text-travel-blue mb-1">{plan.name}</div>
                                <div className="text-sm font-bold text-gray-900 mb-1">{plan.data}</div>
                                <div className="text-xs text-gray-500">{plan.desc}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-black text-gray-900 mb-3">{plan.price.toLocaleString()} VNĐ</div>
                                <button 
                                    className="bg-travel-blue text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm active:scale-[0.98]"
                                    onClick={() => handleRegister(plan)}
                                >
                                    Register
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialView="login" />
        </div>
    );
};

export default DataPlans;
