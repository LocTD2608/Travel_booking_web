import React, { useState, useEffect, useCallback } from 'react';
import { useUrlFilters } from '../../hooks/useUrlFilters';
import { fetchHotels } from '../../services/searchApi';
import type { HotelResult } from '../../types/search';

const fmt = (price: number) =>
    price
        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
        : 'Liên hệ';

const Stars: React.FC<{ count: number }> = ({ count }) => (
    <span style={{ color: '#f59e0b', fontSize: 14 }}>
        {'⭐'.repeat(Math.min(count ?? 0, 5))}
    </span>
);

// ─── Hotel Card ───────────────────────────────────────────────────────────────
const HotelCard: React.FC<{ hotel: HotelResult }> = ({ hotel }) => (
    <div style={{
        background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12,
        padding: '20px 24px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 16,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        transition: 'box-shadow .2s',
    }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)')}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)')}
    >
        {/* Icon */}
        <div style={{
            width: 56, height: 56, background: '#dbeafe', borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
            <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#2563eb' }}>hotel</span>
        </div>

        {/* Info */}
        <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{hotel.name}</div>
            <Stars count={hotel.stars} />
            <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>📍 {hotel.address}</div>
        </div>

        {/* Price & Book */}
        <div style={{ textAlign: 'right', minWidth: 140 }}>
            <div style={{ fontSize: 11, color: '#6b7280' }}>Từ</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#dc2626' }}>{fmt(hotel.min_price)}</div>
            <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 10 }}>/ đêm</div>
            <button style={{
                background: '#2563eb', color: '#fff', border: 'none',
                borderRadius: 8, padding: '8px 20px', fontWeight: 700,
                cursor: 'pointer', fontSize: 13,
            }}>
                Xem phòng
            </button>
        </div>
    </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const Hotels: React.FC = () => {
    const { filters, setFilter, setPage, resetFilters, currentPage } = useUrlFilters();

    const [results, setResults] = useState<HotelResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searched, setSearched] = useState(false);

    const doSearch = useCallback(async () => {
        setLoading(true);
        setError(null);
        setSearched(true);
        try {
            const res = await fetchHotels({
                city: filters.destination,
                checkIn: filters.checkIn,
                checkOut: filters.checkOut,
                rating: filters.rating,
                sortBy: filters.sortBy,
            });
            setResults(res.data ?? []);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    }, [filters.destination, filters.checkIn, filters.checkOut, filters.rating, filters.sortBy]);

    useEffect(() => {
        if (searched) doSearch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.sortBy, filters.page]);

    useEffect(() => {
        if (filters.destination) doSearch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div style={{ padding: '40px 20px', maxWidth: 900, margin: '0 auto' }}>

            {/* ── Header ── */}
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <div style={{
                    width: 72, height: 72, background: '#dbeafe', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px',
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#2563eb' }}>hotel</span>
                </div>
                <h1 style={{ fontSize: 32, fontWeight: 900, margin: '0 0 8px' }}>Tìm khách sạn</h1>
                <p style={{ color: '#6b7280', margin: 0 }}>Khách sạn tốt nhất với giá phòng ưu đãi</p>
            </div>

            {/* ── Filter Form ── */}
            <div style={{
                background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16,
                padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 24,
            }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
                    {[
                        { label: 'Thành phố / địa điểm', key: 'destination', placeholder: 'VD: Hà Nội' },
                        { label: 'Ngày nhận phòng', key: 'checkIn', type: 'date' },
                        { label: 'Ngày trả phòng', key: 'checkOut', type: 'date' },
                    ].map(({ label, key, type = 'text', placeholder }) => (
                        <div key={key}>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                                {label}
                            </label>
                            <input
                                type={type}
                                placeholder={placeholder}
                                value={(filters as Record<string, string | undefined>)[key] ?? ''}
                                onChange={e => setFilter({ [key]: e.target.value })}
                                style={{
                                    width: '100%', boxSizing: 'border-box',
                                    border: '1px solid #d1d5db', borderRadius: 8,
                                    padding: '8px 12px', fontSize: 14,
                                }}
                            />
                        </div>
                    ))}

                    <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                            Sao tối thiểu
                        </label>
                        <select
                            value={filters.rating ?? ''}
                            onChange={e => setFilter({ rating: e.target.value })}
                            style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 12px', fontSize: 14 }}
                        >
                            <option value="">Tất cả</option>
                            <option value="3">3 sao ⭐⭐⭐</option>
                            <option value="4">4 sao ⭐⭐⭐⭐</option>
                            <option value="5">5 sao ⭐⭐⭐⭐⭐</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                            Sắp xếp theo
                        </label>
                        <select
                            value={filters.sortBy ?? 'price'}
                            onChange={e => setFilter({ sortBy: e.target.value })}
                            style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 12px', fontSize: 14 }}
                        >
                            <option value="price">Giá thấp nhất</option>
                            <option value="rating">Đánh giá cao nhất</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                    <button
                        onClick={doSearch}
                        style={{
                            background: '#2563eb', color: '#fff', border: 'none',
                            borderRadius: 10, padding: '10px 28px', fontWeight: 700,
                            fontSize: 15, cursor: 'pointer',
                        }}
                    >
                        🔍 Tìm khách sạn
                    </button>
                    {searched && (
                        <button
                            onClick={() => { resetFilters(); setResults([]); setSearched(false); }}
                            style={{
                                background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db',
                                borderRadius: 10, padding: '10px 20px', fontWeight: 600,
                                fontSize: 14, cursor: 'pointer',
                            }}
                        >
                            ✕ Xóa bộ lọc
                        </button>
                    )}
                </div>
            </div>

            {/* ── States ── */}
            {loading && (
                <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
                    <p>Đang tìm kiếm...</p>
                </div>
            )}

            {error && (
                <div style={{
                    background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12,
                    padding: 20, textAlign: 'center', color: '#dc2626',
                }}>
                    <p style={{ fontWeight: 700, marginBottom: 4 }}>❌ Lỗi kết nối</p>
                    <p style={{ fontSize: 13, margin: 0 }}>{error}</p>
                    <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 8 }}>
                        Kiểm tra Backend đang chạy tại {import.meta.env.VITE_API_URL}
                    </p>
                </div>
            )}

            {!loading && !error && searched && results.length === 0 && (
                <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🏨</div>
                    <p style={{ fontWeight: 700, fontSize: 17 }}>Không tìm thấy khách sạn</p>
                    <p style={{ fontSize: 13 }}>Thử thay đổi địa điểm hoặc tiêu chí lọc</p>
                </div>
            )}

            {!loading && !error && results.length > 0 && (
                <div>
                    <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 16 }}>
                        Tìm thấy <strong>{results.length}</strong> khách sạn
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {results.map(h => <HotelCard key={h.MaKS} hotel={h} />)}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
                        <button
                            disabled={currentPage <= 1}
                            onClick={() => setPage(currentPage - 1)}
                            style={{
                                padding: '8px 20px', border: '1px solid #d1d5db',
                                borderRadius: 8, cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                                opacity: currentPage <= 1 ? 0.4 : 1, background: '#fff',
                            }}
                        >← Trước</button>
                        <span style={{
                            padding: '8px 20px', background: '#2563eb', color: '#fff',
                            borderRadius: 8, fontWeight: 700,
                        }}>{currentPage}</span>
                        <button
                            onClick={() => setPage(currentPage + 1)}
                            style={{
                                padding: '8px 20px', border: '1px solid #d1d5db',
                                borderRadius: 8, cursor: 'pointer', background: '#fff',
                            }}
                        >Sau →</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Hotels;
