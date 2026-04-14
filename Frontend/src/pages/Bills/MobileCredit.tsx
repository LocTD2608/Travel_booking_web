import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../../components/auth/AuthModal';

const MOCK_CREDIT = [
    { id: 'c1', name: '20,000 VNĐ', price: 20000, provider: 'Viettel' },
    { id: 'c2', name: '50,000 VNĐ', price: 50000, provider: 'Viettel' },
    { id: 'c3', name: '100,000 VNĐ', price: 98000, provider: 'Viettel' },
    { id: 'c4', name: '200,000 VNĐ', price: 195000, provider: 'Viettel' },
    { id: 'c5', name: '500,000 VNĐ', price: 485000, provider: 'Viettel' }
];

const MobileCredit: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    
    const [selectedNetwork, setSelectedNetwork] = useState('Viettel');
    const [selectedCredit, setSelectedCredit] = useState<typeof MOCK_CREDIT[0] | null>(null);
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleBuyNow = () => {
        if (!selectedCredit || !phoneNumber.trim()) {
            alert('Vui lòng chọn mệnh giá và nhập số điện thoại');
            return;
        }
        if (!isAuthenticated) { setIsAuthModalOpen(true); return; }
        const params = new URLSearchParams({
            type: 'mobile_credit',
            name: `${selectedNetwork} Top-up ${selectedCredit.name}`,
            price: String(selectedCredit.price),
            detail2: selectedNetwork,
            detail3: `Phone: ${phoneNumber}`,
        });
        navigate(`/booking?${params.toString()}`);
    };

    return (
        <div className="bg-[#f5f7fa] min-h-screen pb-10 font-['Plus_Jakarta_Sans']">
            <div className="bg-white border-b border-gray-200 py-4 mb-6 sticky z-30 flex justify-center shadow-sm" style={{ top: '64px' }}>
                <div className="w-full max-w-[1200px] px-4 flex items-center justify-between">
                    <div className="flex gap-10">
                        <div>
                            <div className="text-xs text-gray-500 font-bold mb-0.5 tracking-wider">MOBILE CREDIT</div>
                            <div className="text-[15px] font-bold text-gray-900">Prepaid Top-up</div>
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
                                            checked={net === selectedNetwork}
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
                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                        <h3 className="font-bold text-lg mb-4">Select Amount</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {MOCK_CREDIT.map(item => (
                                <div 
                                    key={item.id} 
                                    onClick={() => setSelectedCredit(item)}
                                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedCredit?.id === item.id ? 'border-travel-blue bg-blue-50 ring-1 ring-travel-blue' : 'border-gray-200 hover:border-travel-blue hover:bg-blue-50'}`}
                                >
                                    <div className="text-lg font-bold text-travel-blue mb-1">{item.name}</div>
                                    <div className="text-sm text-gray-500 line-through">{item.price !== parseInt(item.name.replace(/,/g, '')) ? item.name : ''}</div>
                                    <div className="text-xl font-bold text-gray-900 mt-2">{item.price.toLocaleString()} VNĐ</div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8">
                            <h4 className="font-bold text-gray-900 mb-2">Phone Number</h4>
                            <div className="flex gap-4">
                                <input 
                                    type="text" 
                                    placeholder="Enter phone number" 
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="flex-1 border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-travel-blue" 
                                />
                                <button 
                                    onClick={handleBuyNow}
                                    className="bg-travel-blue text-white px-8 font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm active:scale-[0.98]"
                                >
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialView="login" />
        </div>
    );
};

export default MobileCredit;
