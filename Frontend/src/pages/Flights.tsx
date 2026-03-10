import React, { useState, useEffect, useCallback } from 'react';
import { useUrlFilters } from '../hooks/useUrlFilters';
import { fetchFlights } from '../services/searchApi';
import type { FlightResult } from '../types/search';

// ─── Helper ──────────────────────────────────────────────────────────────────
const fmt = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const fmtTime = (dt: string) =>
    dt ? new Date(dt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '—';

// ─── Result Card ─────────────────────────────────────────────────────────────
const FlightCard: React.FC<{ flight: FlightResult }> = ({ flight }) => (
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
        {/* Left: Airline */}
        <div style={{ minWidth: 120 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#1e40af' }}>{flight.HangBay}</div>
            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>CB-{flight.MaChuyenBay}</div>
            <span style={{
                display: 'inline-block', marginTop: 6, padding: '2px 8px',
                background: flight.HangGhe === 'Business' ? '#fef3c7' : '#eff6ff',
                color: flight.HangGhe === 'Business' ? '#92400e' : '#1d4ed8',
                borderRadius: 20, fontSize: 11, fontWeight: 600,
            }}>{flight.HangGhe || 'Economy'}</span>
        </div>

        {/* Center: Route & Time */}
        <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <div>
                    <div style={{ fontSize: 22, fontWeight: 800 }}>{flight.from_code}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{flight.from_name}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{fmtTime(flight.departure_time)}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#9ca3af' }}>
                    <span style={{ fontSize: 18 }}>✈</span>
                    <div style={{ height: 1, width: 60, background: '#d1d5db', margin: '4px 0' }} />
                </div>
                <div>
                    <div style={{ fontSize: 22, fontWeight: 800 }}>{flight.to_code}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{flight.to_name}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{fmtTime(flight.arrival_time)}</div>
                </div>
            </div>
        </div>

        {/* Right: Price & Book */}
        <div style={{ textAlign: 'right', minWidth: 140 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#dc2626' }}>{fmt(flight.price)}</div>
            <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 10 }}>/ khách</div>
            <button style={{
                background: '#2563eb', color: '#fff', border: 'none',
                borderRadius: 8, padding: '8px 20px', fontWeight: 700,
                cursor: 'pointer', fontSize: 13,
            }}>
                Đặt ngay
            </button>
        </div>
    </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const Flights: React.FC = () => {
    const { filters, setFilter, setPage, resetFilters, currentPage } = useUrlFilters();

    const [results, setResults] = useState<FlightResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searched, setSearched] = useState(false);

    // Chạy tìm kiếm khi nhấn nút hoặc khi URL đã có params sẵn
    const doSearch = useCallback(async () => {
        setLoading(true);
        setError(null);
        setSearched(true);
        try {
            const res = await fetchFlights({
                from: filters.from,
                to: filters.to,
                date: filters.date,
                passengers: filters.passengers,
                priceMax: filters.priceMax,
                sortBy: filters.sortBy,
            });
            setResults(res.data ?? []);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    }, [filters.from, filters.to, filters.date, filters.passengers, filters.priceMax, filters.sortBy]);

    // Tự tìm kiếm lại khi sort thay đổi (nếu đã search rồi)
    useEffect(() => {
        if (searched) doSearch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.sortBy, filters.page]);

    // Tự tìm nếu URL đã có filter khi load trang
    useEffect(() => {
        if (filters.from || filters.to) doSearch();
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
                    <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#2563eb' }}>flight</span>
                </div>
                <h1 style={{ fontSize: 32, fontWeight: 900, margin: '0 0 8px' }}>Tìm vé máy bay</h1>
                <p style={{ color: '#6b7280', margin: 0 }}>Đặt vé nội địa & quốc tế với giá tốt nhất</p>
            </div>

            {/* ── Filter Form ── */}
            <div style={{
                background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16,
                padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 24,
            }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
                    {[
                        { label: 'Điểm đi (mã sân bay)', key: 'from', placeholder: 'VD: HAN' },
                        { label: 'Điểm đến (mã sân bay)', key: 'to', placeholder: 'VD: DAD' },
                        { label: 'Ngày đi', key: 'date', type: 'date' },
                        { label: 'Hành khách', key: 'passengers', type: 'number', placeholder: '1' },
                        { label: 'Giá tối đa (VNĐ)', key: 'priceMax', type: 'number', placeholder: 'VD: 3000000' },
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
                                    padding: '8px 12px', fontSize: 14, outline: 'none',
                                }}
                            />
                        </div>
                    ))}

                    <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                            Sắp xếp theo
                        </label>
                        <select
                            value={filters.sortBy ?? 'price'}
                            onChange={e => setFilter({ sortBy: e.target.value })}
                            style={{
                                width: '100%', border: '1px solid #d1d5db',
                                borderRadius: 8, padding: '8px 12px', fontSize: 14,
                            }}
                        >
                            <option value="price">Giá thấp nhất</option>
                            <option value="duration">Thời gian bay</option>
                            <option value="departure">Giờ khởi hành</option>
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
                        🔍 Tìm chuyến bay
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

            {/* ── Results ── */}
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
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
                    <p style={{ fontWeight: 700, fontSize: 17 }}>Không tìm thấy chuyến bay</p>
                    <p style={{ fontSize: 13 }}>Thử thay đổi điểm đi/đến hoặc ngày khởi hành</p>
                </div>
            )}

            {!loading && !error && results.length > 0 && (
                <div>
                    <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 16 }}>
                        Tìm thấy <strong>{results.length}</strong> chuyến bay
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {results.map(f => <FlightCard key={f.MaChuyenBay} flight={f} />)}
                    </div>

                    {/* Pagination */}
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

export default Flights;
