import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Slider } from 'antd';
import { useUrlFilters } from '../../hooks/useUrlFilters';
import { fetchExperiences } from '../../services/searchApi';
import type { ExperienceResult } from '../../types/search';
import { ExperienceCard } from '../../components/ui/cards/experience/ExperienceCard';
import { generateStarsFromId } from '../../utils/ratingUtils';
import { HeroSearch } from '../../components/ui/HeroSearch/HeroSearch';
import AuthModal from '../../components/auth/AuthModal';

const Experience: React.FC = () => {
    const navigate = useNavigate();
    const { filters, setFilter, setPage, resetFilters, currentPage } = useUrlFilters();
    
    const [results, setResults] = useState<ExperienceResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searched, setSearched] = useState(false);
    const [selectedStars, setSelectedStars] = useState<number[]>([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const handleSearchClick = (searchData: Record<string, string>) => {
        const params = new URLSearchParams();
        Object.entries(searchData).forEach(([key, value]) => {
            if (value && key !== 'type') {
                params.append(key, value);
            }
        });

        const typeToPath: Record<string, string> = {
            hotels: '/hotels',
            flights: '/flights',
            package: '/search',
            experience: '/experience',
        };

        const path = typeToPath[searchData.type] || '/search';
        navigate(`${path}?${params.toString()}`);
        setIsSearchOpen(false);
    };

    // Default search parameters if not present in URL
    const searchState = {
        destination: filters.destination || 'Phú Quốc, Việt Nam',
        dates: 'Xem lịch trình chi tiết',
        category: 'Tours & Trải nghiệm'
    };

    const doSearch = useCallback(async () => {
        setLoading(true);
        setError(null);
        setSearched(true);
        try {
            const res = await fetchExperiences({
                destination: filters.destination,
                priceMax: filters.priceMax,
                sortBy: filters.sortBy,
                rating: selectedStars.length > 0 ? selectedStars.join(',') : undefined
            });
            setResults(res.data ?? []);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Có lỗi xảy ra khi kết nối máy chủ');
        } finally {
            setLoading(false);
        }
    }, [filters.destination, filters.priceMax, filters.sortBy, selectedStars]);

    // Triggers search when filters update
    useEffect(() => {
        doSearch();
    }, [filters.sortBy, filters.page, filters.destination, filters.priceMax, selectedStars, doSearch]);

    // Handle Reset Filter
    const handleReset = () => {
        resetFilters();
        setFilter({ destination: 'Phú Quốc, Việt Nam' });
    };

    // Rating star filter toggling
    const handleStarToggle = (star: number) => {
        setSelectedStars(prev => prev.includes(star) ? prev.filter(s => s !== star) : [...prev, star]);
    };

    // Filter results on frontend for stars (if selected) to provide high fidelity
    const filteredResults = results.filter(item => {
        if (selectedStars.length === 0) return true;
        // Use generateStarsFromId để tính sao giống frontend logic
        const stars = generateStarsFromId(item.MaDV);
        return selectedStars.includes(stars);
    });

    return (
        <div className="bg-[#f5f7fa] min-h-screen pb-12 font-['Plus_Jakarta_Sans']">
            {/* Top Search Info Bar - Unified Sticky Bar */}
            <div className="bg-white border-b border-gray-200 py-4 mb-6 sticky z-30 flex justify-center shadow-sm" style={{ top: '64px' }}>
                <div className="w-full max-w-[1200px] px-4 flex items-center justify-between">
                    <div className="flex gap-10">
                        <div>
                            <div className="text-xs text-gray-500 font-bold mb-0.5 tracking-wider">ĐIỂM ĐẾN / TOUR</div>
                            <div className="text-[15px] font-bold text-gray-900">{searchState.destination}</div>
                        </div>
                        <div className="w-px h-10 bg-gray-200"></div>
                        <div>
                            <div className="text-xs text-gray-500 font-bold mb-0.5 tracking-wider">THỜI GIAN</div>
                            <div className="text-[15px] font-bold text-gray-900">{searchState.dates}</div>
                        </div>
                        <div className="w-px h-10 bg-gray-200"></div>
                        <div>
                            <div className="text-xs text-gray-500 font-bold mb-0.5 tracking-wider">DANH MỤC</div>
                            <div className="text-[15px] font-bold text-gray-900">{searchState.category}</div>
                        </div>
                    </div>
                    <button 
                        className="flex items-center gap-2 border border-purple-200 text-[#7c3aed] font-bold px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors"
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                    >
                        <span className="material-symbols-outlined text-[18px]">{isSearchOpen ? 'close' : 'edit'}</span>
                        {isSearchOpen ? 'Đóng' : 'Thay đổi tìm kiếm'}
                    </button>
                </div>
            </div>

            {isSearchOpen && (
                <div className="w-full bg-white border-b border-gray-200 py-6 flex justify-center animate-fade-in shadow-inner relative z-30 mb-6">
                    <div className="w-full max-w-[1200px] px-4">
                        <HeroSearch isCompact={true} initialTab="experience" onSearch={handleSearchClick} />
                    </div>
                </div>
            )}

            {/* Main Content Grid */}
            <div className="max-w-[1200px] mx-auto px-4 flex gap-6">

                {/* Left Column (Filters) */}
                <div className="w-[280px] flex-shrink-0">
                    <div className="bg-white border text-gray-800 border-gray-200 rounded-xl p-5 mb-4 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg">Bộ lọc</h3>
                            <button 
                                className="text-[#7c3aed] font-semibold text-sm hover:underline" 
                                onClick={handleReset}
                            >
                                Thiết lập lại
                            </button>
                        </div>

                        {/* Destination search filter */}
                        <div className="mb-6">
                            <h4 className="font-semibold text-[15px] mb-3">Điểm đến phổ biến</h4>
                            {['Phú Quốc, Việt Nam', 'Đà Nẵng, Việt Nam', 'Hà Nội, Việt Nam', 'Maldives'].map(city => (
                                <button
                                    key={city}
                                    onClick={() => setFilter({ destination: city })}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold mb-1.5 transition-all flex items-center justify-between ${
                                        filters.destination === city || (city === 'Phú Quốc, Việt Nam' && !filters.destination)
                                            ? 'bg-purple-50 text-[#7c3aed] border border-purple-100'
                                            : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                                    }`}
                                >
                                    <span>{city}</span>
                                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                                </button>
                            ))}
                        </div>

                        {/* Price Filter */}
                        <div className="mb-6">
                            <h4 className="font-semibold text-[15px] mb-4">Giá tối đa / Người</h4>
                            <Slider
                                range={false}
                                min={500000}
                                max={30000000}
                                step={500000}
                                value={Number(filters.priceMax) || 30000000}
                                onChange={(val: number | number[]) => setFilter({ priceMax: String(Array.isArray(val) ? val[0] : val) })}
                                tooltip={{ formatter: (val) => `${val?.toLocaleString()} VNĐ` }}
                                trackStyle={{ backgroundColor: '#7c3aed', height: 4 }}
                                handleStyle={{ borderColor: '#7c3aed', width: 16, height: 16, marginTop: -6 }}
                            />
                            <div className="flex justify-between text-xs font-semibold text-gray-400 mt-2">
                                <span>500.000đ</span>
                                <span>{(Number(filters.priceMax) || 30000000).toLocaleString()}đ</span>
                            </div>
                        </div>

                        {/* Star Rating Checklist */}
                        <div className="mb-6">
                            <h4 className="font-semibold text-[15px] mb-3">Hạng sao dịch vụ</h4>
                            {[5, 4, 3].map(star => (
                                <label key={star} className="flex items-center gap-3 mb-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-gray-300 text-[#7c3aed] focus:ring-[#7c3aed] cursor-pointer"
                                        checked={selectedStars.includes(star)}
                                        onChange={() => handleStarToggle(star)}
                                    />
                                    <span className="flex text-yellow-500">
                                        {Array.from({ length: star }).map((_, i) => <span key={i} className="material-symbols-outlined text-[18px] leading-none">star</span>)}
                                        {Array.from({ length: 5 - star }).map((_, i) => <span key={i} className="material-symbols-outlined text-[18px] text-gray-200 leading-none">star</span>)}
                                    </span>
                                </label>
                            ))}
                        </div>

                        {/* Inclusions / Amenities */}
                        <div className="mb-2">
                            <h4 className="font-semibold text-[15px] mb-3">Dịch vụ đi kèm</h4>
                            {[
                                { name: 'Xe đưa đón', icon: 'directions_bus' },
                                { name: 'Vé tham quan', icon: 'confirmation_number' },
                                { name: 'Bữa ăn', icon: 'restaurant' },
                                { name: 'Hướng dẫn viên', icon: 'hail' }
                            ].map(item => (
                                <label key={item.name} className="flex items-center gap-3 mb-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-gray-300 text-[#7c3aed] focus:ring-[#7c3aed] cursor-pointer"
                                        defaultChecked
                                    />
                                    <span className="material-symbols-outlined text-[20px] text-gray-400 group-hover:text-gray-600 transition-colors">{item.icon}</span>
                                    <span className="text-xs font-semibold text-gray-600">{item.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column (Results) */}
                <div className="flex-1 flex flex-col gap-4">

                    {/* Sort Bar */}
                    <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-gray-600 text-sm">Sắp xếp theo:</span>
                        <select
                            value={filters.sortBy ?? 'popular'}
                            onChange={(e) => setFilter({ sortBy: e.target.value })}
                            className="bg-white border border-gray-200 rounded-lg pl-3 pr-10 py-2 text-[14px] font-bold text-gray-900 outline-none cursor-pointer focus:border-[#7c3aed] shadow-sm min-w-[200px]"
                        >
                            <option value="popular">Phổ biến nhất</option>
                            <option value="price">Giá thấp đến cao</option>
                        </select>

                        {/* Display Total Results */}
                        {!loading && filteredResults.length > 0 && (
                            <span className="text-xs text-gray-500 font-semibold ml-auto bg-white border border-gray-100 px-3 py-2 rounded-lg shadow-sm">
                                Tìm thấy <strong>{filteredResults.length}</strong> kết quả
                            </span>
                        )}
                    </div>

                    {/* Results Container */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center p-10 bg-white border border-gray-200 rounded-xl text-gray-400 mt-4 h-72 shadow-sm">
                            <div className="w-8 h-8 border-4 border-[#7c3aed] border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="font-bold text-gray-500 text-sm">Đang tìm kiếm tour và trải nghiệm...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center text-red-600">
                            <span className="material-symbols-outlined text-4xl mb-2">error</span>
                            <p className="font-bold">Không thể tải dữ liệu trải nghiệm</p>
                            <p className="text-xs">{error}</p>
                        </div>
                    ) : filteredResults.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-10 bg-white border border-gray-200 border-dashed rounded-xl text-gray-400 mt-4 h-72">
                            <span className="material-symbols-outlined text-5xl mb-3 text-gray-300">explore_off</span>
                            <p className="font-bold text-gray-500 text-sm">Không tìm thấy trải nghiệm nào</p>
                            <p className="text-xs mt-1">Vui lòng thay đổi điểm đến hoặc bộ lọc giá tối đa để thử lại.</p>
                        </div>
                    ) : (
                        <div>
                            <div className="flex flex-col gap-4">
                                {filteredResults.map((item) => (
                                    <ExperienceCard key={item.MaDV} item={item} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialView="login" />
        </div>
    );
};

export default Experience;
