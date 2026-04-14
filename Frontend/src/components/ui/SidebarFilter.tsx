import React, { useState } from 'react';

// Định nghĩa kiểu dữ liệu cho bộ lọc để dùng ở các trang khác
export interface FilterCriteria {
    minPrice: number;
    maxPrice: number;
    brands: string[];
    stars: number[];
}

const SidebarFilter = () => {
    // 1. State quản lý giá
    const [priceRange, setPriceRange] = useState({ min: 0, max: 5000000 });

    // 2. State quản lý Hãng (chọn nhiều nên dùng mảng)
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const brandsList = ['Vinpearl', 'Mường Thanh', 'FLC', 'Novotel', 'InterContinental'];

    // 3. State quản lý Số sao
    const [selectedStars, setSelectedStars] = useState<number[]>([]);
    const starsList = [5, 4, 3, 2, 1];

    // Hàm xử lý khi tick/untick checkbox
    const handleToggle = <T,>(item: T, list: T[], setList: (value: T[]) => void) => {
        if (list.includes(item)) {
            setList(list.filter(i => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    const handleApply = () => {
        const finalFilters: FilterCriteria = {
            minPrice: priceRange.min,
            maxPrice: priceRange.max,
            brands: selectedBrands,
            stars: selectedStars
        };
        console.log("Dữ liệu gửi đi lọc nè Liên:", finalFilters);
        alert("Đã áp dụng bộ lọc! Check console để xem data nhé.");
    };

    return (
        <aside style={sidebarStyle}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Bộ lọc tìm kiếm</h3>

            {/* --- PHẦN 1: KHOẢNG GIÁ --- */}
            <div style={sectionStyle}>
                <p style={labelStyle}>Khoảng giá (VND)</p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                        type="number"
                        placeholder="Từ"
                        style={inputStyle}
                        onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                    />
                    <span>-</span>
                    <input
                        type="number"
                        placeholder="Đến"
                        style={inputStyle}
                        onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                    />
                </div>
            </div>

            {/* --- PHẦN 2: HÃNG / THƯƠNG HIỆU --- */}
            <div style={sectionStyle}>
                <p style={labelStyle}>Thương hiệu</p>
                {brandsList.map(brand => (
                    <label key={brand} style={checkboxLabelStyle}>
                        <input
                            type="checkbox"
                            checked={selectedBrands.includes(brand)}
                            onChange={() => handleToggle(brand, selectedBrands, setSelectedBrands)}
                        />
                        <span style={{ marginLeft: '8px' }}>{brand}</span>
                    </label>
                ))}
            </div>

            {/* --- PHẦN 3: HẠNG SAO --- */}
            <div style={sectionStyle}>
                <p style={labelStyle}>Hạng sao</p>
                {starsList.map(star => (
                    <label key={star} style={checkboxLabelStyle}>
                        <input
                            type="checkbox"
                            checked={selectedStars.includes(star)}
                            onChange={() => handleToggle(star, selectedStars, setSelectedStars)}
                        />
                        <span style={{ marginLeft: '8px' }}>{star} Sao {'⭐'.repeat(star)}</span>
                    </label>
                ))}
            </div>

            {/* NÚT ÁP DỤNG */}
            <button onClick={handleApply} style={buttonStyle}>
                Áp dụng bộ lọc
            </button>

            <button
                onClick={() => { setSelectedBrands([]); setSelectedStars([]); }}
                style={{ ...buttonStyle, backgroundColor: 'white', color: '#007bff', marginTop: '10px', border: '1px solid #007bff' }}
            >
                Xóa tất cả
            </button>
        </aside>
    );
};

// --- CSS IN JS (Để Liên copy phát chạy luôn không cần file CSS riêng) ---
const sidebarStyle: React.CSSProperties = {
    width: '280px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    border: '1px solid #eee',
    height: 'fit-content'
};

const sectionStyle = { marginBottom: '25px' };
const labelStyle = { fontWeight: 'bold', marginBottom: '12px', fontSize: '14px', color: '#333' };
const inputStyle = { width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px' };
const checkboxLabelStyle = { display: 'flex', alignItems: 'center', marginBottom: '8px', cursor: 'pointer', fontSize: '14px' };
const buttonStyle = {
    width: '100%', padding: '12px', backgroundColor: '#007bff', color: '#fff',
    border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s'
};

export default SidebarFilter;