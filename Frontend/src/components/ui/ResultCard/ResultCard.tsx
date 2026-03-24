import React from 'react';

export interface ResultCardProps {
    id: string | number;
    name: string;
    rating: number;
    distance: string;
    amenities: string[];
    price: number;
    reviewScore: string;
    reviews: number;
    imageUrl: string;
}

export const ResultCard: React.FC<{ data: ResultCardProps }> = ({ data }) => {
    return (
        <div className="relative flex w-full border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow h-[220px] mb-4">
            
            {/* Left Image Section with Fade */}
            <div className="relative w-[45%] h-full flex-shrink-0 z-0">
                <img src={data.imageUrl} alt={data.name} className="w-full h-full object-cover" />
                {/* The Gradient Fade overlay that fades image to white on the right */}
                <div className="absolute inset-y-0 right-0 w-[50%] bg-gradient-to-r from-transparent to-white pointer-events-none"></div>
            </div>

            {/* Right Description Section (overlapped by fade) */}
            <div className="flex-1 flex flex-col justify-between py-4 pr-5 relative z-10 -ml-12">
                {/* Top Description */}
                <div className="flex justify-between items-start">
                    <div className="pl-4">
                        <h2 className="text-xl font-bold text-gray-900 mb-1">{data.name}</h2>
                        <div className="flex items-center gap-1 mb-2">
                            <span className="flex text-yellow-400">
                                {Array.from({length: Math.floor(data.rating)}).map((_, i) => <span key={i} className="material-symbols-outlined text-[16px]">star</span>)}
                            </span>
                            <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-travel-blue rounded font-bold ml-2">Hotel</span>
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                            <span className="material-symbols-outlined text-[16px] mr-1">location_on</span>
                            {data.distance}
                        </div>
                    </div>
                    
                    {/* Review Badge */}
                    <div className="flex flex-col items-end">
                        <div className="bg-travel-blue text-white font-bold px-2 py-1 rounded text-lg">
                            {data.reviewScore}
                        </div>
                        <span className="text-xs text-gray-500 mt-1">{data.reviews} reviews</span>
                    </div>
                </div>
                
                {/* Bottom Action */}
                <div className="flex justify-between items-end mt-4 pl-4">
                    {/* Amenities */}
                    <div className="flex flex-col gap-1 text-xs text-gray-600 font-medium">
                        {data.amenities.map((amenity, idx) => (
                            <div key={idx} className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px] text-green-600">check_circle</span>
                                {amenity}
                            </div>
                        ))}
                    </div>

                    {/* Pricing & Button */}
                    <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-500 mb-1">Per room, per night</span>
                        <span className="text-2xl font-black text-orange-500 mb-2">
                            VND {data.price?.toLocaleString()}
                        </span>
                        <button className="bg-orange-500 text-white px-6 py-2 rounded font-bold hover:bg-orange-600 shadow-sm transition-colors">
                            Choose Room
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
