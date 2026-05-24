import React, { useState, useRef } from 'react';
import { message } from 'antd';
import type { Accommodation, Room } from '../../../services/admin/typing';

const TEAL = '#00C2A0';
const TEAL_LIGHT = '#e6faf7';

// ─── Style helpers ────────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 14px',
  background: '#f3f4f5', border: '1.5px solid transparent',
  borderRadius: 12, fontSize: 13, color: '#1a1a1a',
  outline: 'none', boxSizing: 'border-box',
};
const labelStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, color: '#64748b',
  textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5, display: 'block',
};

const roomStatusCfg: Record<string, { bg: string; color: string }> = {
  available: { bg: '#f0fdf4', color: '#16a34a' },
  occupied: { bg: '#fef9c3', color: '#ca8a04' },
  maintenance: { bg: '#fef2f2', color: '#dc2626' },
};
const accomStatusCfg = {
  active: { bg: '#f0fdf4', color: '#16a34a' },
  inactive: { bg: '#fef2f2', color: '#dc2626' },
};

// ─── Add/Edit Accommodation Modal ─────────────────────────────────────────────
interface AccFormData { name: string; location: string; type: string; pricePerNight: string; totalRooms: string; rating: string; status: string; description: string; }
const PROPERTY_TYPES = ['Hotel', 'Resort', 'Villa', 'Suites', 'Hostel'];

const AddAccommodationModal: React.FC<{ open: boolean; editing: Accommodation | null; onClose: () => void; onSubmit: (data: Partial<Accommodation>) => void; }> = ({ open, editing, onClose, onSubmit }) => {
  const [form, setForm] = useState<AccFormData>({ name: '', location: '', type: 'Hotel', pricePerNight: '', totalRooms: '', rating: '4', status: 'active', description: '' });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open) {
      if (editing) {
        setForm({ name: editing.name, location: editing.location, type: editing.type, pricePerNight: String(editing.pricePerNight), totalRooms: String(editing.totalRooms), rating: String(editing.rating), status: editing.status, description: editing.description ?? '' });
        setImagePreview(editing.imageUrl ?? null);
      } else {
        setForm({ name: '', location: '', type: 'Hotel', pricePerNight: '', totalRooms: '', rating: '4', status: 'active', description: '' });
        setImagePreview(null);
      }
    }
  }, [open, editing]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.location) { message.error('Vui lòng điền tên và địa điểm!'); return; }
    onSubmit({ ...form, pricePerNight: parseFloat(form.pricePerNight) || 0, totalRooms: parseInt(form.totalRooms) || 0, availableRooms: parseInt(form.totalRooms) || 0, rating: parseFloat(form.rating) || 4, imageUrl: imagePreview ?? undefined } as any);
  };

  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }} onClick={onClose} />
      <div style={{ position: 'relative', background: '#fff', width: '100%', maxWidth: 520, borderRadius: 20, boxShadow: '0 20px 60px -8px rgba(0,0,0,0.25)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>{editing ? 'Chỉnh Sửa Chỗ Lưu Trú' : 'Thêm Chỗ Lưu Trú Mới'}</span>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#64748b' }}>close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto', maxHeight: '72vh' }}>
          <div>
            <label style={labelStyle}>Tên Khách Sạn / Cơ Sở</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="VD: Vinpearl Resort & Spa" style={inputStyle} required />
          </div>
          <div>
            <label style={labelStyle}>Địa Điểm</label>
            <div style={{ position: 'relative' }}>
              <span className="material-symbols-outlined" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: '#94a3b8' }}>location_on</span>
              <input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="Thành phố, Quốc gia" style={{ ...inputStyle, paddingLeft: 40 }} required />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={labelStyle}>Giá / Đêm (VND)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>₫</span>
                <input type="number" value={form.pricePerNight} onChange={e => setForm(p => ({ ...p, pricePerNight: e.target.value }))} placeholder="0" style={{ ...inputStyle, paddingLeft: 28 }} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Loại Cơ Sở</label>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Tổng Số Phòng</label>
              <input type="number" value={form.totalRooms} onChange={e => setForm(p => ({ ...p, totalRooms: e.target.value }))} placeholder="0" min={1} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Trạng Thái</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[{ v: 'active', l: 'Active' }, { v: 'inactive', l: 'Inactive' }].map(s => (
                  <button key={s.v} type="button" onClick={() => setForm(p => ({ ...p, status: s.v }))} style={{
                    flex: 1, padding: '8px 0', borderRadius: 10,
                    border: form.status === s.v ? `2px solid ${s.v === 'active' ? '#22c55e' : '#ef4444'}` : '2px solid #f1f5f9',
                    background: form.status === s.v ? (s.v === 'active' ? '#f0fdf4' : '#fef2f2') : '#fff',
                    color: form.status === s.v ? (s.v === 'active' ? '#16a34a' : '#dc2626') : '#94a3b8',
                    fontWeight: 700, fontSize: 12, cursor: 'pointer',
                  }}>{s.l}</button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Mô Tả</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Mô tả chi tiết, tiện ích, điểm nổi bật..." rows={3} style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }} />
          </div>

          {/* Image Upload - Drag & Drop Area */}
          <div>
            <label style={labelStyle}>Ảnh Khách Sạn</label>
            {imagePreview ? (
              <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', height: 140 }}>
                <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button type="button" onClick={() => setImagePreview(null)} style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: 999, border: 'none', background: 'rgba(0,0,0,0.5)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileRef.current?.click()}
                style={{ border: '2px dashed #e2e8f0', borderRadius: 14, padding: '30px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', cursor: 'pointer', transition: 'all 0.2s', gap: 8 }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f0fdf4', e.currentTarget.style.borderColor = TEAL)}
                onMouseLeave={e => (e.currentTarget.style.background = '#f8fafc', e.currentTarget.style.borderColor = '#e2e8f0')}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 32, color: '#94a3b8' }}>cloud_upload</span>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#374151' }}>Upload property photos (JPG, PNG)</p>
                <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>Recommended size: 1200×800px</p>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
          </div>
        </form>

        {/* Footer */}
        <div style={{ padding: '14px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 10, background: '#f8fafc' }}>
          <button type="button" onClick={onClose} style={{ flex: 1, padding: '10px 0', borderRadius: 12, border: 'none', background: '#fff', color: '#64748b', fontWeight: 600, fontSize: 13, cursor: 'pointer', boxShadow: '0 0 0 1.5px #e2e8f0' }}>Hủy</button>
          <button onClick={handleSubmit as any} style={{ flex: 2, padding: '10px 0', borderRadius: 12, border: 'none', background: TEAL, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: `0 4px 12px ${TEAL}40` }}>
            {editing ? 'Cập Nhật' : 'Lưu Chỗ Lưu Trú'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Manage Room Modal ────────────────────────────────────────────────────────
const ManageRoomModal: React.FC<{ accommodation: Accommodation | null; onClose: () => void; onUpdate: (id: string, rooms: Room[]) => void; }> = ({ accommodation, onClose, onUpdate }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [addingRoom, setAddingRoom] = useState(false);
  const [newRoom, setNewRoom] = useState({ roomNumber: '', type: 'Standard' as Room['type'], pricePerNight: '', capacity: '2' });

  React.useEffect(() => {
    if (accommodation) setRooms(accommodation.rooms ?? []);
  }, [accommodation]);

  if (!accommodation) return null;

  const handleAddRoom = () => {
    if (!newRoom.roomNumber) { message.error('Vui lòng nhập số phòng'); return; }
    const room: Room = { id: `r${Date.now()}`, roomNumber: newRoom.roomNumber, type: newRoom.type, status: 'available', pricePerNight: parseFloat(newRoom.pricePerNight) || 0, capacity: parseInt(newRoom.capacity) || 2 };
    const updated = [...rooms, room];
    setRooms(updated);
    onUpdate(accommodation.id, updated);
    setAddingRoom(false);
    setNewRoom({ roomNumber: '', type: 'Standard', pricePerNight: '', capacity: '2' });
    message.success('Đã thêm phòng mới');
  };

  const handleDeleteRoom = (roomId: string) => {
    const updated = rooms.filter(r => r.id !== roomId);
    setRooms(updated);
    onUpdate(accommodation.id, updated);
    message.success('Đã xóa phòng');
  };

  const handleToggleStatus = (roomId: string) => {
    const updated = rooms.map(r => r.id === roomId ? { ...r, status: r.status === 'available' ? 'occupied' : 'available' } as Room : r);
    setRooms(updated);
    onUpdate(accommodation.id, updated);
  };

  const ROOM_TYPES: Room['type'][] = ['Standard', 'Deluxe', 'Suite', 'Executive Suite', 'Presidential'];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }} onClick={onClose} />
      <div style={{ position: 'relative', background: '#fff', width: '100%', maxWidth: 620, borderRadius: 20, boxShadow: '0 20px 60px -8px rgba(0,0,0,0.25)', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '88vh' }}>
        {/* Header */}
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>Quản Lý Phòng — {accommodation.name}</div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{accommodation.location} · {rooms.length} phòng</div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#64748b' }}>close</span>
          </button>
        </div>

        {/* Stat Row */}
        <div style={{ padding: '14px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: 16, flexShrink: 0 }}>
          {[
            { label: 'Tổng phòng', value: rooms.length, color: '#3b82f6' },
            { label: 'Sẵn sàng', value: rooms.filter(r => r.status === 'available').length, color: '#16a34a' },
            { label: 'Đang dùng', value: rooms.filter(r => r.status === 'occupied').length, color: '#ca8a04' },
            { label: 'Bảo dưỡng', value: rooms.filter(r => r.status === 'maintenance').length, color: '#dc2626' },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, textAlign: 'center', padding: '8px', borderRadius: 10, background: '#f8fafc' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Room List */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                {['Số Phòng', 'Loại Phòng', 'Trạng Thái', 'Giá/Đêm', 'Sức Chứa', 'Thao Tác'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rooms.map(r => {
                const s = roomStatusCfg[r.status];
                return (
                  <tr key={r.id} style={{ borderTop: '1px solid #f8fafc' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontWeight: 800, fontSize: 13, color: '#0f172a' }}>#{r.roomNumber}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 12, padding: '3px 8px', borderRadius: 6, background: TEAL_LIGHT, color: TEAL, fontWeight: 600 }}>{r.type}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button onClick={() => handleToggleStatus(r.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 999, background: s.bg, color: s.color, fontSize: 11, fontWeight: 700, border: 'none', cursor: r.status !== 'maintenance' ? 'pointer' : 'default' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color }} />
                        {r.status === 'available' ? 'Sẵn sàng' : r.status === 'occupied' ? 'Đang dùng' : 'Bảo dưỡng'}
                      </button>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, fontSize: 13, color: '#0f172a' }}>₫{r.pricePerNight.toLocaleString('vi-VN')}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>{r.capacity} người</td>
                    <td style={{ padding: '12px 16px' }}>
                      <button onClick={() => handleDeleteRoom(r.id)} style={{ padding: '5px 8px', borderRadius: 8, border: '1px solid #fee2e2', background: '#fff', color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Add Room Form */}
          {addingRoom && (
            <div style={{ padding: 16, borderTop: '2px dashed #f1f5f9', background: '#f8fafc', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ flex: '1 1 100px' }}>
                <label style={{ ...labelStyle, fontSize: 10 }}>Số Phòng</label>
                <input value={newRoom.roomNumber} onChange={e => setNewRoom(p => ({ ...p, roomNumber: e.target.value }))} placeholder="VD: 501" style={{ ...inputStyle, fontSize: 12, padding: '7px 12px' }} />
              </div>
              <div style={{ flex: '2 1 140px' }}>
                <label style={{ ...labelStyle, fontSize: 10 }}>Loại Phòng</label>
                <select value={newRoom.type} onChange={e => setNewRoom(p => ({ ...p, type: e.target.value as Room['type'] }))} style={{ ...inputStyle, fontSize: 12, padding: '7px 12px', appearance: 'none' }}>
                  {ROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ flex: '1 1 120px' }}>
                <label style={{ ...labelStyle, fontSize: 10 }}>Giá/Đêm</label>
                <input type="number" value={newRoom.pricePerNight} onChange={e => setNewRoom(p => ({ ...p, pricePerNight: e.target.value }))} placeholder="0" style={{ ...inputStyle, fontSize: 12, padding: '7px 12px' }} />
              </div>
              <div style={{ flex: '0 0 80px' }}>
                <label style={{ ...labelStyle, fontSize: 10 }}>Sức Chứa</label>
                <input type="number" value={newRoom.capacity} onChange={e => setNewRoom(p => ({ ...p, capacity: e.target.value }))} min={1} max={10} style={{ ...inputStyle, fontSize: 12, padding: '7px 12px' }} />
              </div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 1 }}>
                <button onClick={handleAddRoom} style={{ padding: '7px 14px', borderRadius: 10, border: 'none', background: TEAL, color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>Lưu</button>
                <button onClick={() => setAddingRoom(false)} style={{ padding: '7px 14px', borderRadius: 10, border: '1.5px solid #f1f5f9', background: '#fff', color: '#64748b', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>Hủy</button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', flexShrink: 0 }}>
          <button onClick={() => setAddingRoom(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 12, border: 'none', background: TEAL, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
            Thêm Phòng Mới
          </button>
          <button onClick={onClose} style={{ padding: '9px 20px', borderRadius: 12, border: 'none', background: '#fff', color: '#64748b', fontWeight: 600, fontSize: 13, cursor: 'pointer', boxShadow: '0 0 0 1.5px #e2e8f0' }}>Đóng</button>
        </div>
      </div>
    </div>
  );
};

// ─── Accommodations Page ──────────────────────────────────────────────────────
import {
  getAccommodations,
  createAccommodation,
  updateAccommodation,
  deleteAccommodation
} from '../../../services/admin/accommodations';

const AccommodationsPage: React.FC = () => {
  const [data, setData] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editing, setEditing] = useState<Accommodation | null>(null);
  const [roomModalAccommodation, setRoomModalAccommodation] = useState<Accommodation | null>(null);

  const fetchAccommodations = async () => {
    try {
      setLoading(true);
      const res = await getAccommodations();
      // Handle axios response structure
      const accommodationsData = res.data || res;
      setData(Array.isArray(accommodationsData) ? accommodationsData : []);
    } catch (error: any) {
      console.error('Error fetching accommodations:', error);
      message.error('Không thể nạp danh sách cơ sở lưu trú');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAccommodations();
  }, []);

  const filtered = data.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.location.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = async (id: string) => {
    try {
      await deleteAccommodation(id);
      setData(prev => prev.filter(a => a.id !== id));
      message.success('Đã xóa cơ sở lưu trú');
    } catch (error: any) {
      console.error('Error deleting accommodation:', error);
      message.error('Không thể xóa cơ sở lưu trú');
    }
  };

  const handleSubmit = async (values: Partial<Accommodation>) => {
    try {
      if (editing) {
        const res = await updateAccommodation(editing.id, values);
        const updated = res.data || res;
        setData(prev => prev.map(a => a.id === editing.id ? { ...a, ...updated } : a));
        message.success('Đã cập nhật thành công');
      } else {
        const res = await createAccommodation(values);
        const created = res.data || res;
        setData(prev => [created, ...prev]);
        message.success('Đã thêm chỗ lưu trú mới');
      }
      setAddModalOpen(false);
    } catch (error: any) {
      console.error('Error saving accommodation:', error);
      message.error('Không thể lưu thông tin cơ sở lưu trú');
    }
  };

  const handleUpdateRooms = async (accommodationId: string, rooms: Room[]) => {
    try {
      // Sync rooms array back to backend using partial update
      const res = await updateAccommodation(accommodationId, { rooms });
      const updated = res.data || res;
      
      setData(prev => prev.map(a => a.id === accommodationId ? { ...a, ...updated } : a));
      setRoomModalAccommodation(prev => prev?.id === accommodationId ? { ...prev!, ...updated } : prev);
      message.success('Đã đồng bộ thông tin phòng về hệ thống');
    } catch (error: any) {
      console.error('Error updating rooms:', error);
      message.error('Không thể cập nhật thông tin phòng');
    }
  };

  const totalRevenue = data.reduce((s, a) => s + (a.pricePerNight || 0) * (a.availableRooms || 0), 0);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>Accommodation Management</h2>
        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>Quản lý khách sạn, resort, villa và phòng ở</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
        {[
          { label: 'Total Active Bookings', value: '1,284', icon: 'hotel', sub: '+12%', color: TEAL },
          { label: 'Pending Checkouts', value: data.filter(a => a.availableRooms === 0).length, icon: 'pending_actions', sub: '8 Urgent', color: '#f97316' },
          { label: 'Est. Daily Revenue', value: `₫${(totalRevenue / 1000000).toFixed(1)}M`, icon: 'payments', sub: '$4.2k today', color: '#10b981' },
          { label: 'Occupancy Rate', value: data.length > 0 ? `${Math.round((data.filter(a => a.status === 'active').length / data.length) * 100)}%` : '0%', icon: 'room_service', sub: '98.2% efficiency', color: '#6366f1' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span className="material-symbols-outlined" style={{ padding: 8, borderRadius: 10, background: `${s.color}15`, color: s.color, fontSize: 20 }}>{s.icon}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#16a34a' }}>{s.sub}</span>
            </div>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 380 }}>
            <span className="material-symbols-outlined" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: '#94a3b8' }}>search</span>
            <input
              placeholder="Tìm theo tên hoặc địa điểm..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', paddingLeft: 42, paddingRight: 14, paddingTop: 9, paddingBottom: 9, borderRadius: 12, border: '1.5px solid #f1f5f9', background: '#f8fafc', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 12, border: '1.5px solid #f1f5f9', background: '#fff', color: '#64748b', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>filter_list</span>
              Filter
            </button>
            <button onClick={() => { setEditing(null); setAddModalOpen(true); }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 12, border: 'none', background: TEAL, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: `0 4px 12px ${TEAL}40` }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
              Thêm Cơ Sở Mới
            </button>
          </div>
        </div>

        {/* Table / Loading State */}
        {loading ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 32, color: TEAL, animation: 'spin 1.5s linear infinite' }}>sync</span>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Đang tải danh sách cơ sở lưu trú...</div>
            <style>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                  {['Property', 'Type', 'Location', 'Rating', 'Price/Night', 'Rooms', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '11px 18px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: '40px 18px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                      Không tìm thấy cơ sở lưu trú nào phù hợp
                    </td>
                  </tr>
                ) : (
                  filtered.map(acc => {
                    const s = accomStatusCfg[acc.status] || { bg: '#f1f5f9', color: '#64748b' };
                    return (
                      <tr key={acc.id} style={{ borderTop: '1px solid #f8fafc' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                        onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
                        <td style={{ padding: '13px 18px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            {acc.imageUrl ? (
                              <img src={acc.imageUrl} alt={acc.name} style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover' }} />
                            ) : (
                              <div style={{ width: 36, height: 36, borderRadius: 8, background: TEAL_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span className="material-symbols-outlined" style={{ color: TEAL, fontSize: 18 }}>hotel</span>
                              </div>
                            )}
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{acc.name}</div>
                              <div style={{ fontSize: 11, color: '#94a3b8' }}>{(acc.rooms || []).length} phòng</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '13px 18px' }}>
                          <span style={{ fontSize: 12, padding: '3px 9px', borderRadius: 6, background: '#eff6ff', color: '#3b82f6', fontWeight: 600 }}>{acc.type}</span>
                        </td>
                        <td style={{ padding: '13px 18px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#374151', fontSize: 13 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 14, color: TEAL }}>location_on</span>
                            {acc.location}
                          </div>
                        </td>
                        <td style={{ padding: '13px 18px' }}>
                          <span style={{ color: '#f59e0b', fontWeight: 600, fontSize: 13 }}>{'★'.repeat(acc.rating)} {acc.rating}</span>
                        </td>
                        <td style={{ padding: '13px 18px', fontWeight: 700, fontSize: 13, color: '#0f172a' }}>₫{(acc.pricePerNight || 0).toLocaleString('vi-VN')}</td>
                        <td style={{ padding: '13px 18px' }}>
                          <span style={{ fontWeight: 700, color: acc.availableRooms === 0 ? '#dc2626' : TEAL, fontSize: 13 }}>{acc.availableRooms}</span>
                          <span style={{ color: '#94a3b8', fontSize: 12 }}> / {acc.totalRooms}</span>
                        </td>
                        <td style={{ padding: '13px 18px' }}>
                          <span style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: 999, background: s.bg, color: s.color, fontSize: 11, fontWeight: 700 }}>
                            {acc.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td style={{ padding: '13px 18px' }}>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => setRoomModalAccommodation(acc)} style={{ padding: '6px 10px', borderRadius: 8, border: '1.5px solid #f1f5f9', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#374151', fontWeight: 600, fontSize: 11 }}>
                              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>bed</span>
                              Rooms
                            </button>
                            <button onClick={() => { setEditing(acc); setAddModalOpen(true); }} style={{ padding: '6px 8px', borderRadius: 8, border: '1.5px solid #f1f5f9', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                              <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#64748b' }}>edit</span>
                            </button>
                            <button onClick={() => handleDelete(acc.id)} style={{ padding: '6px 8px', borderRadius: 8, border: '1.5px solid #fee2e2', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                              <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#dc2626' }}>delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid #f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fafafa' }}>
          <span style={{ fontSize: 12, color: '#64748b' }}>Hiển thị 1–{filtered.length} / {data.length} cơ sở</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {[1, 2].map(p => (
              <button key={p} style={{ width: 30, height: 30, borderRadius: 8, border: 'none', background: p === 1 ? TEAL : '#f1f5f9', color: p === 1 ? '#fff' : '#64748b', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddAccommodationModal open={addModalOpen} editing={editing} onClose={() => setAddModalOpen(false)} onSubmit={handleSubmit} />
      <ManageRoomModal accommodation={roomModalAccommodation} onClose={() => setRoomModalAccommodation(null)} onUpdate={handleUpdateRooms} />
    </div>
  );
};

export default AccommodationsPage;
