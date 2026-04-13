import React from 'react';
import type { ExperienceResult } from '../../../../types/search';

const fmt = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

export const ExperienceCard: React.FC<{ item: ExperienceResult }> = ({ item }) => (
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
            width: 52, height: 52, background: '#ede9fe', borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
            <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#7c3aed' }}>local_activity</span>
        </div>
        <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{item.attraction || item.description}</div>
            {item.pickup && <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>📍 Xuất phát: {item.pickup}</div>}
            <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{item.description}</div>
        </div>
        <div style={{ textAlign: 'right', minWidth: 140 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#7c3aed' }}>{fmt(item.price)}</div>
            <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 10 }}>/ {item.unit || 'người'}</div>
            <button style={{
                background: '#7c3aed', color: '#fff', border: 'none',
                borderRadius: 8, padding: '8px 20px', fontWeight: 700, cursor: 'pointer', fontSize: 13,
            }}>Đặt tour</button>
        </div>
    </div>
);
