import React, { useState } from 'react';
import { Slider } from 'antd';
import { TransferCard } from '../../components/ui/cards/transport/TransferCard';
import { useLanguage } from '../../context';

const MOCK_TRANSFERS = [
    {
        id: 'tr1',
        provider: 'Nha Trang Private Cars',
        carName: 'Toyota Fortuner or similar',
        seats: 7,
        baggage: 4,
        from: 'Cam Ranh Airport (CXR)',
        to: 'Nha Trang City Center',
        price: 350000,
        originalPrice: 400000,
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        badge: 'BEST SELLER',
    },
    {
        id: 'tr2',
        provider: 'Premium Limo Services',
        carName: 'Ford Transit Limousine',
        seats: 9,
        baggage: 6,
        from: 'Cam Ranh Airport (CXR)',
        to: 'Nha Trang City Center',
        price: 850000,
        originalPrice: null,
        image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        badge: '',
    }
];


const AirportTransfer: React.FC = () => {
    const [priceRange, setPriceRange] = useState<[number, number]>([100000, 2000000]);
    const { t } = useLanguage();

    return (
        <div className="bg-[#f5f7fa] min-h-screen pb-10 font-display">
            <div className="bg-white border-b border-gray-200 py-4 mb-6 sticky z-30 flex justify-center shadow-sm" style={{ top: '64px' }}>
                <div className="w-full max-w-[1200px] px-4 flex items-center justify-between">
                    <div className="flex gap-10">
                        <div>
                            <div className="text-xs text-gray-500 font-bold mb-0.5 tracking-wider">{t('header.airportTransfer', 'Airport Transfer').toUpperCase()}</div>
                            <div className="text-[15px] font-bold text-gray-900">Cam Ranh Airport ➔ Nha Trang City</div>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 border border-blue-200 text-travel-blue font-bold px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                        <span className="material-symbols-outlined text-[18px]">edit</span> {t('booking.changeSearch', 'Change Search')}
                    </button>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 flex gap-6">
                <div className="w-[280px] flex-shrink-0">
                    <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg">{t('transport.filters', 'Filters')}</h3>
                        </div>
                        <div className="mb-6">
                            <h4 className="font-semibold text-[15px] mb-4">{t('transport.priceRange', 'Price Range')}</h4>
                            <Slider range min={0} max={2000000} step={50000} value={priceRange} onChange={(val: number[]) => setPriceRange(val as [number, number])} trackStyle={[{ backgroundColor: '#005CE6', height: 4 }]} handleStyle={[{ borderColor: '#005CE6' }, { borderColor: '#005CE6' }]} />
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-4">
                    <div className="flex flex-col gap-4">
                        {MOCK_TRANSFERS.map((transfer) => <TransferCard key={transfer.id} transfer={transfer} />)}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AirportTransfer;
