import React, { useState } from 'react';
import { Slider } from 'antd';

const MOCK_CARS = [
    {
        id: 'c1',
        provider: 'Hertz',
        carName: 'Honda City',
        transmission: 'Automatic',
        seats: 5,
        type: 'Sedan',
        price: 800000,
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'c2',
        provider: 'Avis',
        carName: 'Mitsubishi Xpander',
        transmission: 'Automatic',
        seats: 7,
        type: 'SUV',
        price: 1200000,
        image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    }
];

const CarCard: React.FC<{ car: typeof MOCK_CARS[0] }> = ({ car }) => (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex shadow-sm hover:shadow-md transition-shadow">
        <div className="relative w-1/3 min-w-[240px] max-w-[280px] h-48">
            <img src={car.image} alt={car.carName} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 p-5 flex flex-col justify-between">
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{car.carName}</h3>
                <div className="text-sm text-gray-500 mb-3">{car.provider}</div>
                <div className="flex items-center gap-4 text-sm font-medium text-gray-600">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">person</span> {car.seats} Seats</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">settings</span> {car.transmission}</span>
                </div>
            </div>
            <div className="flex justify-between items-end mt-4">
                <div className="text-sm text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded">
                    Self-drive
                </div>
                <div className="text-right">
                    <div className="text-2xl font-black text-gray-900 mb-0">
                        {car.price.toLocaleString()} <span className="text-sm font-semibold text-gray-500">VNĐ</span>
                    </div>
                    <div className="text-xs text-gray-400 mb-3">/ day</div>
                    <button className="bg-travel-blue text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors hover-scale">
                        Rent Car
                    </button>
                </div>
            </div>
        </div>
    </div>
);

const CarRental: React.FC = () => {
    const [priceRange, setPriceRange] = useState<[number, number]>([500000, 3000000]);

    return (
        <div className="bg-[#f5f7fa] min-h-screen pb-10 font-['Plus_Jakarta_Sans']">
            <div className="bg-white border-b border-gray-200 py-4 mb-6 sticky z-30 flex justify-center shadow-sm" style={{ top: '64px' }}>
                <div className="w-full max-w-[1200px] px-4 flex items-center justify-between">
                    <div className="flex gap-10">
                        <div>
                            <div className="text-xs text-gray-500 font-bold mb-0.5 tracking-wider">CAR RENTAL</div>
                            <div className="text-[15px] font-bold text-gray-900">Ho Chi Minh City</div>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 border border-blue-200 text-travel-blue font-bold px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                        <span className="material-symbols-outlined text-[18px]">edit</span> Change Search
                    </button>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 flex gap-6">
                <div className="w-[280px] flex-shrink-0">
                    <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg">Filters</h3>
                        </div>
                        <div className="mb-6">
                            <h4 className="font-semibold text-[15px] mb-4">Price / Day</h4>
                            <Slider range min={0} max={3000000} step={100000} value={priceRange} onChange={(val: number[]) => setPriceRange(val as [number, number])} trackStyle={[{ backgroundColor: '#005CE6', height: 4 }]} handleStyle={[{ borderColor: '#005CE6' }, { borderColor: '#005CE6' }]} />
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-4">
                    <div className="flex flex-col gap-4">
                        {MOCK_CARS.map((car) => <CarCard key={car.id} car={car} />)}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default CarRental;
