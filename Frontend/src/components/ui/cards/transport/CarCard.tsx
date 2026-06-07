import React from 'react';
import { useLanguage } from '../../../../context';

export interface CarCardProps {
    id: string;
    provider: string;
    carName: string;
    transmission: string;
    seats: number;
    type: string;
    price: number;
    image: string;
}

export const CarCard: React.FC<{ car: CarCardProps }> = ({ car }) => {
    const { t } = useLanguage();
    const transmissionText = car.transmission.toLowerCase() === 'automatic'
        ? t('transport.automatic', 'Automatic')
        : t('transport.manual', 'Manual');

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex shadow-sm hover:shadow-md transition-shadow">
            <div className="relative w-1/3 min-w-[240px] max-w-[280px] h-48">
                <img src={car.image} alt={car.carName} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 p-5 flex flex-col justify-between">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{car.carName}</h3>
                    <div className="text-sm text-gray-500 mb-3">{car.provider}</div>
                    <div className="flex items-center gap-4 text-sm font-medium text-gray-600">
                        <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[18px]">person</span> 
                            {t('transport.seatsCount', '{count} Seats').replace('{count}', String(car.seats))}
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[18px]">settings</span> 
                            {transmissionText}
                        </span>
                    </div>
                </div>
                <div className="flex justify-between items-end mt-4">
                    <div className="text-sm text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded">
                        {t('transport.selfDrive', 'Self-drive')}
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-black text-gray-900 mb-0">
                            {car.price.toLocaleString()} <span className="text-sm font-semibold text-gray-500">VNĐ</span>
                        </div>
                        <div className="text-xs text-gray-400 mb-3">/ {t('transport.dayUnit', 'day')}</div>
                        <button className="bg-travel-blue text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors hover-scale">
                            {t('transport.rentCar', 'Rent Car')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
