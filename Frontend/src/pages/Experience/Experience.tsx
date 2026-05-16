import React, { useState, useEffect, useCallback } from 'react';
import { useUrlFilters } from '../../hooks/useUrlFilters';
import { fetchExperiences } from '../../services/searchApi';
import type { ExperienceResult } from '../../types/search';
import { ExperienceCard } from '../../components/ui/cards/experience/ExperienceCard';



const Experience: React.FC = () => {
    const { filters, setFilter, setPage, resetFilters, currentPage } = useUrlFilters();
    const [results, setResults] = useState<ExperienceResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searched, setSearched] = useState(false);

    const doSearch = useCallback(async () => {
        setLoading(true); setError(null); setSearched(true);
        try {
            const res = await fetchExperiences({ destination: filters.destination, priceMax: filters.priceMax, sortBy: filters.sortBy });
            setResults(res.data ?? []);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Có lỗi xảy ra');
        } finally { setLoading(false); }
    }, [filters.destination, filters.priceMax, filters.sortBy]);

    useEffect(() => { if (searched) doSearch(); }, [filters.sortBy, filters.page]); // eslint-disable-line
    useEffect(() => { if (filters.destination) doSearch(); }, []); // eslint-disable-line

    return (
        <div style={{ padding: '40px 20px', maxWidth: 900, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <div style={{
                    width: 72, height: 72, background: '#ede9fe', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#7c3aed' }}>local_activity</span>
                </div>
                <h1 style={{ fontSize: 32, fontWeight: 900, margin: '0 0 8px' }}>Trải nghiệm & Tour</h1>
                <p style={{ color: '#6b7280', margin: 0 }}>Khám phá hoạt động độc đáo tại điểm đến của bạn</p>
            </div>

            <div style={{
                background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 24,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 24
            }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
                    {[
                        { label: 'Điểm đến', key: 'destination', placeholder: 'VD: Phú Quốc' },
                        { label: 'Giá tối đa (VNĐ)', key: 'priceMax', type: 'number', placeholder: 'VD: 500000' },
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
                    <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Sắp xếp theo</label>
                        <select value={filters.sortBy ?? 'popular'} onChange={e => setFilter({ sortBy: e.target.value })}
                            style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 12px', fontSize: 14 }}>
                            <option value="popular">Phổ biến nhất</option>
                            <option value="price">Giá thấp nhất</option>
                        </select>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                    <button onClick={doSearch} style={{ background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 28px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                        🔍 Tìm trải nghiệm
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
                    <div style={{ fontSize: 48 }}>🗺️</div>
                    <p style={{ fontWeight: 700, fontSize: 17 }}>Không tìm thấy trải nghiệm</p>
                    <p style={{ fontSize: 13 }}>Thử thay đổi điểm đến hoặc giá</p>
                </div>
            )}
            {!loading && !error && results.length > 0 && (
                <div>
                    <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 16 }}>Tìm thấy <strong>{results.length}</strong> trải nghiệm</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {results.map(item => <ExperienceCard key={item.MaDV} item={item} />)}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
                        <button disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}
                            style={{ padding: '8px 20px', border: '1px solid #d1d5db', borderRadius: 8, cursor: currentPage <= 1 ? 'not-allowed' : 'pointer', opacity: currentPage <= 1 ? 0.4 : 1, background: '#fff' }}>← Trước</button>
                        <span style={{ padding: '8px 20px', background: '#7c3aed', color: '#fff', borderRadius: 8, fontWeight: 700 }}>{currentPage}</span>
                        <button onClick={() => setPage(currentPage + 1)} style={{ padding: '8px 20px', border: '1px solid #d1d5db', borderRadius: 8, cursor: 'pointer', background: '#fff' }}>Sau →</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Experience;
