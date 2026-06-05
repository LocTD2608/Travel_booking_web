import React, { useState } from 'react';
import { Slider, DatePicker } from 'antd';
const { RangePicker } = DatePicker;
import { useSearchParams } from 'react-router-dom';
import { ALL_DESTINATIONS } from '../../utils/destinations';

const SearchResults: React.FC = () => {
    const [searchParams] = useSearchParams();
    
    // State for Search Bar
    const [searchState, setSearchState] = useState({
        destination: searchParams.get('destination') || '',
        dates: searchParams.get('checkIn') || '',
        guests: searchParams.get('guests') || ''
    });

    // Filters & Sorting state
    const [priceRange, setPriceRange] = useState<[number, number]>([2000000, 5000000]);
    const [sortBy, setSortBy] = useState('popularity');

    return (
        <div className="bg-white min-h-screen pb-10">
            {/* Top Search Bar (Indented 1/4) */}
            <div className="border-b border-gray-200 py-4 mb-6">
                <div className="w-full flex items-center pr-10" style={{ paddingLeft: '25%' }}>
                    <div className="flex-1 max-w-4xl border border-gray-300 rounded-lg p-3 flex shadow-sm bg-white gap-3 items-center">
                        <input type="text" list="destination-options" placeholder="Destination" className="flex-1 h-11 px-4 outline-none rounded-md bg-gray-50 border border-transparent focus:border-travel-blue focus:bg-white transition-all shadow-inner text-[15px] placeholder:text-gray-400 placeholder:font-medium" value={searchState.destination} onChange={(e) => setSearchState({...searchState, destination: e.target.value})} />
                        <datalist id="destination-options">
                            {ALL_DESTINATIONS.map(dest => (
                                <option key={dest.detail} value={dest.detail} />
                            ))}
                        </datalist>

                        <RangePicker 
                            className="flex-[1.5] min-w-[280px] h-11 px-4 rounded-md bg-gray-50 border border-transparent hover:border-gray-300 focus-within:border-travel-blue focus-within:bg-white transition-all shadow-inner [&_input::placeholder]:text-gray-400 [&_input::placeholder]:font-medium [&_input]:text-[15px]"
                            onChange={(_, dateStrings) => setSearchState({...searchState, dates: dateStrings.join(' - ')})}
                            format="DD/MM/YYYY"
                            placeholder={['Check-in', 'Check-out']}
                        />
                        
                        <input type="text" list="guests-options" placeholder="Guests" className="flex-1 h-11 px-4 outline-none rounded-md bg-gray-50 border border-transparent focus:border-travel-blue focus:bg-white transition-all shadow-inner text-[15px] placeholder:text-gray-400 placeholder:font-medium" value={searchState.guests} onChange={(e) => setSearchState({...searchState, guests: e.target.value})} />
                        <datalist id="guests-options">
                            <option value="1 adult, 1 room" />
                            <option value="2 adults, 1 room" />
                            <option value="2 adults, 1 child, 1 room" />
                            <option value="3 adults, 2 rooms" />
                            <option value="4 adults, 2 rooms" />
                            <option value="Family, 2 rooms" />
                            <option value="Group, 3 rooms" />
                        </datalist>
                        
                        <button className="bg-travel-blue text-white px-8 h-11 rounded-md font-bold hover:bg-blue-700 transition-colors shadow-sm">Search</button>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="px-4 md:px-10 lg:px-40 flex gap-6">
                
                {/* Left Column (Filters) - 1/3 Width */}
                <div className="w-1/3 border border-gray-200 rounded-lg p-5 h-fit sticky top-24">
                    <h3 className="font-bold text-lg mb-4">Filters</h3>
                    
                    {/* Price Filter */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold">Price Range</h4>
                        </div>
                        <span className="text-sm font-bold text-travel-blue mb-2 block">
                            {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()} VNĐ
                        </span>
                        
                        <Slider 
                            range 
                            min={0} 
                            max={10000000} 
                            step={100000}
                            value={priceRange} 
                            onChange={(val: number[]) => setPriceRange(val as [number, number])} 
                            tooltip={{ formatter: (val) => `${val?.toLocaleString()} VNĐ` }}
                            trackStyle={[{ backgroundColor: '#005CE6' }]}
                            handleStyle={[{ borderColor: '#005CE6' }, { borderColor: '#005CE6' }]}
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>0 VNĐ</span>
                            <span>10,000,000+ VNĐ</span>
                        </div>
                    </div>

                    <hr className="my-4 border-gray-200" />

                    {/* Star Rating */}
                    <div className="mb-6">
                        <h4 className="font-semibold mb-2">Star Rating</h4>
                        {[5, 4, 3, 2, 1].map(star => (
                            <label key={star} className="flex items-center gap-2 mb-2 cursor-pointer">
                                <input type="checkbox" className="rounded" />
                                <span className="flex text-yellow-500 text-sm">
                                    {Array.from({length: star}).map((_, i) => <span key={i} className="material-symbols-outlined text-[16px]">star</span>)}
                                </span>
                            </label>
                        ))}
                    </div>
                    
                    <hr className="my-4 border-gray-200" />

                    {/* Amenities */}
                    <div className="mb-6">
                        <h4 className="font-semibold mb-2">Amenities</h4>
                        {['WiFi', 'Pool', 'Parking', 'Restaurant', 'Gym'].map(amenity => (
                            <label key={amenity} className="flex items-center gap-2 mb-2 cursor-pointer">
                                <input type="checkbox" className="rounded" />
                                <span className="text-sm">{amenity}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Right Column (Results) - 2/3 Width */}
                <div className="w-2/3 flex flex-col gap-4">
                    
                    {/* Sort Bar */}
                    <div className="w-full flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200 mb-4">
                        <span className="font-semibold text-gray-700 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[20px]">sort</span>
                            Sort results by:
                        </span>
                        <div className="flex gap-4">
                            <select 
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="border border-gray-300 rounded-md px-4 py-2 text-sm bg-white outline-none cursor-pointer focus:border-travel-blue font-medium min-w-[200px]"
                            >
                                <option value="popularity">Popularity</option>
                                <option value="price_asc">Price: Lowest First</option>
                                <option value="price_desc">Price: Highest First</option>
                                <option value="rating_desc">Rating: Highest First</option>
                                <option value="rating_asc">Rating: Lowest First</option>
                            </select>
                        </div>
                    </div>

                    {/* Placeholder for future backend results */}
                    <div className="flex flex-col items-center justify-center p-10 bg-white border border-gray-200 border-dashed rounded-lg text-gray-400 mt-4 h-64">
                        <span className="material-symbols-outlined text-5xl mb-3 text-gray-300">travel_explore</span>
                        <p className="font-medium text-gray-500">No results to display</p>
                        <p className="text-sm">Data will be populated here once backend is connected.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchResults;
