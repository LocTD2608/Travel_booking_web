import React, { useState, useEffect, useCallback } from 'react';
import { useUrlFilters } from '../hooks/useUrlFilters';
import { fetchTrains } from '../services/searchApi';
import type { TrainResult } from '../types/search';

const fmt = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const TrainCard: React.FC<{ train: TrainResult }> = ({ train }) => (
    <div style={{
        background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12,
        padding: '20px 24px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 16,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)')}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)')}
    >
        <div style={{
            width: 52, height: 52, background: '#dbeafe', borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
            <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#2563eb' }}>train</span>
        </div>
        <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{train.from} → {train.to}</div>
            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{train.description}</div>
            {train.seat_type && (
                <span style={{
                    display: 'inline-block', marginTop: 6, padding: '2px 8px',
                    background: '#eff6ff', color: '#1d4ed8', borderRadius: 20, fontSize: 11, fontWeight: 600,
                }}>{train.seat_type}</span>
            )}
        </div>
        <div style={{ textAlign: 'right', minWidth: 140 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#dc2626' }}>{fmt(train.price)}</div>
            <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 10 }}>/ {train.unit || 'vé'}</div>
            <button style={{
                background: '#2563eb', color: '#fff', border: 'none',
                borderRadius: 8, padding: '8px 20px', fontWeight: 700, cursor: 'pointer', fontSize: 13,
            }}>Đặt vé</button>
        </div>
    </div>
);

const Trains: React.FC = () => {
    const { filters, setFilter, setPage, resetFilters, currentPage } = useUrlFilters();
    const [results, setResults] = useState<TrainResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searched, setSearched] = useState(false);

    const doSearch = useCallback(async () => {
        setLoading(true); setError(null); setSearched(true);
        try {
            const res = await fetchTrains({ from: filters.from, to: filters.to, date: filters.date, priceMax: filters.priceMax, sortBy: filters.sortBy });
            setResults(res.data ?? []);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Có lỗi xảy ra');
        } finally { setLoading(false); }
    }, [filters.from, filters.to, filters.date, filters.priceMax, filters.sortBy]);

    useEffect(() => { if (searched) doSearch(); }, [filters.sortBy, filters.page]); // eslint-disable-line
    useEffect(() => { if (filters.from || filters.to) doSearch(); }, []); // eslint-disable-line

    return (
        <div style={{ padding: '40px 20px', maxWidth: 900, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <div style={{
                    width: 72, height: 72, background: '#dbeafe', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#2563eb' }}>train</span>
                </div>
                <h1 style={{ fontSize: 32, fontWeight: 900, margin: '0 0 8px' }}>Tìm vé tàu hỏa</h1>
                <p style={{ color: '#6b7280', margin: 0 }}>Đặt vé tàu dễ dàng, di chuyển thoải mái</p>
            </div>

            <div style={{
                background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 24,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 24
            }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
                    {[
                        { label: 'Ga đi', key: 'from', placeholder: 'VD: Hà Nội' },
                        { label: 'Ga đến', key: 'to', placeholder: 'VD: TP. Hồ Chí Minh' },
                        { label: 'Ngày đi', key: 'date', type: 'date' },
                        { label: 'Giá tối đa (VNĐ)', key: 'priceMax', type: 'number', placeholder: 'VD: 1000000' },
                    ].map(({ label, key, type = 'text', placeholder }) => (
                        <div key={key}>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{label}</label>
                            <input type={type} placeholder={placeholder}
                                value={(filters as Record<string, string | undefined>)[key] ?? ''}
                                onChange={e => setFilter({ [key]: e.target.value })}
                                style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 12px', fontSize: 14 }}
                            />
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                    <button onClick={doSearch} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 28px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                        🔍 Tìm vé tàu
                    </button>
                    {searched && <button onClick={() => { resetFilters(); setResults([]); setSearched(false); }}
                        style={{ background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: 10, padding: '10px 20px', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                        ✕ Xóa bộ lọc
                    </button>}
                </div>
            </div>

            {loading && <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}><div style={{ fontSize: 40 }}>⏳</div><p>Đang tìm kiếm...</p></div>}
            {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: 20, textAlign: 'center', color: '#dc2626' }}>
                <p style={{ fontWeight: 700 }}>❌ Lỗi kết nối</p><p style={{ fontSize: 13 }}>{error}</p></div>}
            {!loading && !error && searched && results.length === 0 && (
                <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>
                    <div style={{ fontSize: 48 }}>🚂</div>
                    <p style={{ fontWeight: 700, fontSize: 17 }}>Không tìm thấy vé tàu</p>
                    <p style={{ fontSize: 13 }}>Thử thay đổi điểm đi/đến</p>
                </div>
            )}
            {!loading && !error && results.length > 0 && (
                <div>
                    <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 16 }}>Tìm thấy <strong>{results.length}</strong> kết quả</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {results.map(t => <TrainCard key={t.MaDV} train={t} />)}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
                        <button disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}
                            style={{ padding: '8px 20px', border: '1px solid #d1d5db', borderRadius: 8, cursor: currentPage <= 1 ? 'not-allowed' : 'pointer', opacity: currentPage <= 1 ? 0.4 : 1, background: '#fff' }}>← Trước</button>
                        <span style={{ padding: '8px 20px', background: '#2563eb', color: '#fff', borderRadius: 8, fontWeight: 700 }}>{currentPage}</span>
                        <button onClick={() => setPage(currentPage + 1)} style={{ padding: '8px 20px', border: '1px solid #d1d5db', borderRadius: 8, cursor: 'pointer', background: '#fff' }}>Sau →</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Trains;
