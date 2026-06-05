import React, { useState } from 'react';
import { message } from 'antd';
import type { Flight } from '../../../services/admin/typing';
import {
  getFlights,
  createFlight,
  updateFlight,
  deleteFlight
} from '../../../services/admin/flights';

const TEAL = '#00C2A0';
const TEAL_LIGHT = '#e6faf7';

const getFlightNumber = (airline: string, id: number | string) => {
  const clean = airline ? airline.toLowerCase() : '';
  let prefix = 'VN';
  if (clean.includes('vietjet')) prefix = 'VJ';
  else if (clean.includes('bamboo')) prefix = 'QH';
  else if (clean.includes('vietravel')) prefix = 'VU';
  else if (clean.includes('pacific')) prefix = 'BL';
  return `${prefix}${id}`;
};

const formatDate = (isoString: string) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const mapBackendFlight = (f: any): Flight => {
  const idStr = String(f.MaChuyenBay);
  const idNum = parseInt(idStr) || 0;
  
  // Deterministic status based on id
  let status: 'active' | 'delayed' | 'cancelled' = 'active';
  if (idNum % 15 === 0) status = 'delayed';
  else if (idNum % 23 === 0) status = 'cancelled';

  return {
    id: idStr,
    flightNumber: getFlightNumber(f.HangBay, f.MaChuyenBay),
    airline: f.HangBay,
    origin: f.TuyenDuong?.SanBayDi?.Code || 'HAN',
    destination: f.TuyenDuong?.SanBayDen?.Code || 'SGN',
    departureTime: formatDate(f.GioKhoiHanh),
    arrivalTime: formatDate(f.GioHaCanh),
    price: parseFloat(f.GiaCoBan) || 0,
    seats: 180, // default seats count
    status: status
  };
};

const statusCfg: Record<string, { bg: string; color: string; dot: string }> = {
  active: { bg: '#f0fdf4', color: '#16a34a', dot: '#22c55e' },
  delayed: { bg: '#fefce8', color: '#ca8a04', dot: '#eab308' },
  cancelled: { bg: '#fef2f2', color: '#dc2626', dot: '#ef4444' },
};

const airlineInitials = (name: string) => name.split(' ').map(w => w[0]).slice(0, 2).join('');

// ─── Input styles ─────────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 14px',
  background: '#f3f4f5', border: '1.5px solid transparent',
  borderRadius: 12, fontSize: 13, color: '#1a1a1a',
  outline: 'none', transition: 'all 0.2s',
  fontFamily: 'Inter, sans-serif',
};
const labelStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, color: '#64748b',
  textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5, display: 'block',
};

// ─── Add/Edit Flight Modal ─────────────────────────────────────────────────────
interface FlightFormData { airline: string; flightNumber: string; origin: string; destination: string; departureTime: string; price: string; seats: string; status: string; }
const AIRLINES = ['Vietnam Airlines', 'VietJet Air', 'Bamboo Airways', 'Pacific Airlines'];
const STATUSES = [{ value: 'active', label: 'Active' }, { value: 'delayed', label: 'Delayed' }, { value: 'cancelled', label: 'Cancelled' }];

const FlightFormModal: React.FC<{ open: boolean; editing: Flight | null; onClose: () => void; onSubmit: (data: Partial<Flight>) => void; }> = ({ open, editing, onClose, onSubmit }) => {
  const [form, setForm] = useState<FlightFormData>({ airline: '', flightNumber: '', origin: '', destination: '', departureTime: '', price: '', seats: '', status: 'active' });

  React.useEffect(() => {
    if (open) {
      if (editing) {
        setForm({ airline: editing.airline, flightNumber: editing.flightNumber, origin: editing.origin, destination: editing.destination, departureTime: editing.departureTime, price: String(editing.price), seats: String(editing.seats), status: editing.status });
      } else {
        setForm({ airline: '', flightNumber: '', origin: '', destination: '', departureTime: '', price: '', seats: '', status: 'active' });
      }
    }
  }, [open, editing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.airline) {
      message.error('Vui lòng chọn hãng bay!');
      return;
    }
    
    const flightNumberClean = form.flightNumber.trim().toUpperCase();
    if (!flightNumberClean) {
      message.error('Vui lòng nhập số hiệu chuyến bay!');
      return;
    }
    if (!/^[A-Z0-9]{3,6}$/.test(flightNumberClean)) {
      message.error('Số hiệu chuyến bay không hợp lệ (phải gồm 3-6 ký tự chữ in hoa và số, ví dụ: VN204)!');
      return;
    }
    
    const originClean = form.origin.trim().toUpperCase();
    if (!originClean) {
      message.error('Vui lòng nhập điểm khởi hành!');
      return;
    }
    if (!/^[A-Z]{3}$/.test(originClean)) {
      message.error('Điểm khởi hành phải là mã IATA 3 ký tự chữ cái (ví dụ: HAN)!');
      return;
    }
    
    const destinationClean = form.destination.trim().toUpperCase();
    if (!destinationClean) {
      message.error('Vui lòng nhập điểm đến!');
      return;
    }
    if (!/^[A-Z]{3}$/.test(destinationClean)) {
      message.error('Điểm đến phải là mã IATA 3 ký tự chữ cái (ví dụ: SGN)!');
      return;
    }
    
    if (originClean === destinationClean) {
      message.error('Điểm khởi hành và điểm đến không được trùng nhau!');
      return;
    }
    
    if (!form.departureTime) {
      message.error('Vui lòng chọn giờ khởi hành!');
      return;
    }
    
    const priceVal = parseFloat(form.price);
    if (isNaN(priceVal) || priceVal <= 0) {
      message.error('Giá vé phải là số lớn hơn 0 VND!');
      return;
    }
    
    const seatsVal = parseInt(form.seats, 10);
    if (isNaN(seatsVal) || seatsVal < 1 || seatsVal > 400) {
      message.error('Số ghế phải là số nguyên từ 1 đến 400!');
      return;
    }

    let formattedDeparture = form.departureTime;
    let formattedArrival = '';
    if (form.departureTime) {
      const depDate = new Date(form.departureTime);
      if (!isNaN(depDate.getTime())) {
        const pad = (n: number) => n.toString().padStart(2, '0');
        formattedDeparture = `${depDate.getFullYear()}-${pad(depDate.getMonth() + 1)}-${pad(depDate.getDate())} ${pad(depDate.getHours())}:${pad(depDate.getMinutes())}`;
        
        const arrDate = new Date(depDate.getTime() + 2 * 60 * 60 * 1000); // mặc định bay 2 tiếng
        formattedArrival = `${arrDate.getFullYear()}-${pad(arrDate.getMonth() + 1)}-${pad(arrDate.getDate())} ${pad(arrDate.getHours())}:${pad(arrDate.getMinutes())}`;
      }
    }
    
    onSubmit({
      ...form,
      flightNumber: flightNumberClean,
      origin: originClean,
      destination: destinationClean,
      departureTime: formattedDeparture,
      arrivalTime: formattedArrival,
      price: priceVal,
      seats: seatsVal,
    } as any);
  };

  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <div style={{ position: 'relative', background: '#fff', width: '100%', maxWidth: 560, borderRadius: 20, boxShadow: '0 20px 60px -8px rgba(0,0,0,0.25)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: TEAL_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ color: TEAL, fontSize: 18 }}>flight_takeoff</span>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>{editing ? 'Chỉnh Sửa Chuyến Bay' : 'Thêm Chuyến Bay Mới'}</div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>Điền đầy đủ thông tin bên dưới</div>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#64748b' }}>close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto', maxHeight: '70vh' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={labelStyle}>Hãng Bay</label>
              <select value={form.airline} onChange={e => setForm(p => ({ ...p, airline: e.target.value }))} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                <option value="">Chọn hãng bay</option>
                {AIRLINES.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Số Hiệu Chuyến</label>
              <input value={form.flightNumber} onChange={e => setForm(p => ({ ...p, flightNumber: e.target.value.toUpperCase() }))} placeholder="VD: VN204" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Điểm Khởi Hành</label>
              <input value={form.origin} onChange={e => setForm(p => ({ ...p, origin: e.target.value.toUpperCase() }))} placeholder="Mã sân bay (VD: HAN)" maxLength={3} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Điểm Đến</label>
              <input value={form.destination} onChange={e => setForm(p => ({ ...p, destination: e.target.value.toUpperCase() }))} placeholder="Mã sân bay (VD: SGN)" maxLength={3} style={inputStyle} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Giờ Khởi Hành</label>
              <input type="datetime-local" value={form.departureTime} onChange={e => setForm(p => ({ ...p, departureTime: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Giá Vé (VND)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>₫</span>
                <input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="0" style={{ ...inputStyle, paddingLeft: 28 }} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Số Ghế</label>
              <input type="number" value={form.seats} onChange={e => setForm(p => ({ ...p, seats: e.target.value }))} placeholder="0" min={1} max={400} style={inputStyle} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Trạng Thái</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {STATUSES.map(s => (
                  <button key={s.value} type="button" onClick={() => setForm(p => ({ ...p, status: s.value }))} style={{
                    flex: 1, padding: '8px 0', borderRadius: 10,
                    border: form.status === s.value ? `2px solid ${statusCfg[s.value].dot}` : '2px solid #f1f5f9',
                    background: form.status === s.value ? statusCfg[s.value].bg : '#fff',
                    color: form.status === s.value ? statusCfg[s.value].color : '#94a3b8',
                    fontWeight: 700, fontSize: 12, cursor: 'pointer', transition: 'all 0.2s',
                  }}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div style={{ padding: '14px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: 10, background: '#f8fafc' }}>
          <button type="button" onClick={onClose} style={{ padding: '9px 20px', borderRadius: 10, border: 'none', background: '#fff', color: '#64748b', fontWeight: 600, fontSize: 13, cursor: 'pointer', boxShadow: '0 0 0 1.5px #e2e8f0' }}>Hủy</button>
          <button onClick={e => { e.preventDefault(); document.querySelector('form')?.dispatchEvent(new Event('submit', { bubbles: true })); }} style={{ padding: '9px 24px', borderRadius: 10, border: 'none', background: TEAL, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: `0 4px 12px ${TEAL}40` }}>
            {editing ? 'Cập Nhật' : 'Tạo Chuyến Bay'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Action Dropdown Modal ─────────────────────────────────────────────────────
const ActionModal: React.FC<{ flight: Flight | null; onClose: () => void; onEdit: (f: Flight) => void; onDelete: (id: string) => void; }> = ({ flight, onClose, onEdit, onDelete }) => {
  if (!flight) return null;
  const s = statusCfg[flight.status];
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.3)', backdropFilter: 'blur(3px)' }} onClick={onClose} />
      <div style={{ position: 'relative', background: '#fff', width: '100%', maxWidth: 380, borderRadius: 20, boxShadow: '0 20px 60px -8px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
        {/* Flight summary */}
        <div style={{ background: `linear-gradient(135deg, ${TEAL} 0%, #007a65 100%)`, padding: '20px 24px', color: '#fff', position: 'relative' }}>
          <div style={{ position: 'absolute', right: -20, top: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', opacity: 0.8, marginBottom: 6 }}>CHUYẾN BAY</div>
          <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.02em' }}>{flight.flightNumber}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <span style={{ fontWeight: 700, fontSize: 16 }}>{flight.origin}</span>
            <span className="material-symbols-outlined" style={{ fontSize: 18, opacity: 0.8 }}>flight_takeoff</span>
            <span style={{ fontWeight: 700, fontSize: 16 }}>{flight.destination}</span>
          </div>
          <div style={{ marginTop: 6, fontSize: 12, opacity: 0.8 }}>{flight.airline} · {flight.departureTime}</div>
        </div>
        {/* Info grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderBottom: '1px solid #f1f5f9' }}>
          {[
            { label: 'Giá vé', value: `₫${flight.price.toLocaleString('vi-VN')}` },
            { label: 'Ghế còn', value: `${flight.seats} ghế` },
          ].map(item => (
            <div key={item.label} style={{ padding: '14px 20px', borderRight: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{item.value}</div>
            </div>
          ))}
        </div>
        {/* Status */}
        <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #f1f5f9' }}>
          <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>TRẠNG THÁI:</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 999, background: s.bg, color: s.color, fontSize: 12, fontWeight: 700 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot }} />
            {flight.status.toUpperCase()}
          </span>
        </div>
        {/* Actions */}
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={() => { onEdit(flight); onClose(); }} style={{ width: '100%', padding: '11px 0', borderRadius: 12, border: 'none', background: TEAL, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span>
            Chỉnh Sửa Chuyến Bay
          </button>
          <button onClick={() => { onDelete(flight.id); onClose(); }} style={{ width: '100%', padding: '11px 0', borderRadius: 12, border: '1.5px solid #fee2e2', background: '#fff', color: '#dc2626', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
            Xóa Chuyến Bay
          </button>
          <button onClick={onClose} style={{ width: '100%', padding: '11px 0', borderRadius: 12, border: 'none', background: '#f8fafc', color: '#64748b', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Đóng</button>
        </div>
      </div>
    </div>
  );
};

// ─── Flights Page ─────────────────────────────────────────────────────────────
const FlightsPage: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);
  const [actionFlight, setActionFlight] = useState<Flight | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const fetchAllFlights = async () => {
    try {
      setLoading(true);
      const res = await getFlights();
      const rawFlights = res.data || res;
      if (Array.isArray(rawFlights)) {
        setFlights(rawFlights.map(mapBackendFlight));
      } else {
        setFlights([]);
      }
    } catch (err) {
      console.error('Error fetching flights:', err);
      message.error('Không thể tải danh sách chuyến bay từ server');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAllFlights();
  }, []);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filtered = flights.filter(f =>
    f.flightNumber.toLowerCase().includes(search.toLowerCase()) ||
    (f.airline && f.airline.toLowerCase().includes(search.toLowerCase())) ||
    (f.origin && f.origin.toLowerCase().includes(search.toLowerCase())) ||
    (f.destination && f.destination.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginatedFlights = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleAdd = () => { setEditingFlight(null); setAddModalOpen(true); };
  const handleEdit = (f: Flight) => { setEditingFlight(f); setAddModalOpen(true); };

  const handleDelete = async (id: string) => {
    try {
      const cleanId = id.replace('f', '');
      await deleteFlight(cleanId);
      setFlights(prev => prev.filter(f => f.id !== id));
      message.success('Đã xóa chuyến bay thành công');
    } catch (err: any) {
      console.error('Error deleting flight:', err);
      message.error('Không thể xóa chuyến bay: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSubmit = async (values: Partial<Flight>) => {
    try {
      const payload = {
        origin: values.origin,
        destination: values.destination,
        HangBay: values.airline,
        GiaCoBan: values.price,
        GioKhoiHanh: values.departureTime,
        GioHaCanh: values.arrivalTime,
      };

      if (editingFlight) {
        const cleanId = editingFlight.id.replace('f', '');
        const res = await updateFlight(cleanId, payload);
        const updated = res.data || res;
        const mapped = mapBackendFlight(updated);
        setFlights(prev => prev.map(f => f.id === editingFlight.id ? mapped : f));
        message.success('Đã cập nhật chuyến bay thành công');
      } else {
        const res = await createFlight(payload);
        const created = res.data || res;
        const mapped = mapBackendFlight(created);
        setFlights(prev => [mapped, ...prev]);
        message.success('Đã thêm chuyến bay mới thành công');
      }
      setAddModalOpen(false);
    } catch (err: any) {
      console.error('Error saving flight:', err);
      message.error('Lỗi khi lưu thông tin chuyến bay: ' + (err.response?.data?.error || err.message));
    }
  };

  const activeCount = flights.filter(f => f.status === 'active').length;
  const totalRevApprox = flights.reduce((s, f) => s + f.price, 0);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>Flights Management</h2>
        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>Quản lý danh sách chuyến bay và thông tin đặt vé</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
        {[
          { label: 'Total Bookings', value: '1,284', icon: 'airplane_ticket', sub: '↑ 12% từ tháng trước', color: TEAL },
          { label: 'Active Flights', value: activeCount, icon: 'flight_takeoff', sub: 'Đang hoạt động', color: '#3b82f6' },
          { label: 'Revenue (VND)', value: `₫${(totalRevApprox / 1000000).toFixed(1)}M`, icon: 'payments', sub: '↑ 8% tuần này', color: '#10b981' },
          { label: 'Pending Issues', value: flights.filter(f => f.status !== 'active').length, icon: 'hourglass_empty', sub: 'Cần xử lý', color: '#f97316' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</span>
              <span className="material-symbols-outlined" style={{ color: s.color, fontSize: 20 }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#22c55e', fontWeight: 600, marginTop: 5 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 380 }}>
            <span className="material-symbols-outlined" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: '#94a3b8' }}>search</span>
            <input
              placeholder="Tìm theo số hiệu, hãng bay, chặng bay..."
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
            <button onClick={handleAdd} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 12, border: 'none', background: TEAL, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: `0 4px 12px ${TEAL}40` }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
              Add Flight
            </button>
          </div>
        </div>

        {/* Table / Loading State */}
        {loading ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 32, color: TEAL, animation: 'spin 1.5s linear infinite' }}>sync</span>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Đang tải danh sách chuyến bay...</div>
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
                <tr style={{ background: '#f8fafc' }}>
                  {['Customer Name', 'Airline', 'Flight Number', 'Route', 'Price', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '11px 18px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '40px 18px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                      Không tìm thấy chuyến bay nào phù hợp
                    </td>
                  </tr>
                ) : (
                  paginatedFlights.map(f => {
                    const s = statusCfg[f.status];
                    const initials = airlineInitials(f.airline || '');
                    const colors = ['#3b82f6', '#f97316', '#8b5cf6', '#10b981'];
                    const colorIdx = f.airline ? f.airline.length % 4 : 0;
                    return (
                      <tr key={f.id} style={{ borderTop: '1px solid #f8fafc', transition: 'background 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                        onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
                        {/* Customer */}
                        <td style={{ padding: '13px 18px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                              width: 32, height: 32, borderRadius: 9,
                              background: `${colors[colorIdx]}18`,
                              color: colors[colorIdx],
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontWeight: 800, fontSize: 11,
                            }}>{initials}</div>
                            <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>Passenger #{f.id.replace('f', '')}</span>
                          </div>
                        </td>
                        <td style={{ padding: '13px 18px', fontSize: 13, color: '#374151' }}>{f.airline}</td>
                        <td style={{ padding: '13px 18px' }}>
                          <span style={{ padding: '3px 8px', background: '#f1f5f9', borderRadius: 6, fontSize: 12, fontWeight: 700, color: '#374151', letterSpacing: '0.04em' }}>{f.flightNumber}</span>
                        </td>
                        <td style={{ padding: '13px 18px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{f.origin}</span>
                            <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#94a3b8' }}>arrow_forward</span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{f.destination}</span>
                          </div>
                        </td>
                        <td style={{ padding: '13px 18px', fontWeight: 700, fontSize: 13, color: '#0f172a' }}>₫{f.price.toLocaleString('vi-VN')}</td>
                        <td style={{ padding: '13px 18px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 999, background: s.bg, color: s.color, fontSize: 11, fontWeight: 700 }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot }} />
                            {f.status === 'active' ? 'Active' : f.status === 'delayed' ? 'Delayed' : 'Cancelled'}
                          </span>
                        </td>
                        <td style={{ padding: '13px 18px' }}>
                          <button onClick={() => setActionFlight(f)} style={{ padding: '6px 10px', borderRadius: 8, border: 'none', background: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#64748b' }}>more_horiz</span>
                          </button>
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
        <div style={{ padding: '12px 20px', borderTop: '1px solid #f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>
            Hiển thị {filtered.length > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0} - {Math.min(currentPage * PAGE_SIZE, filtered.length)} trong tổng số {filtered.length} chuyến bay
          </span>
          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {/* Prev Button */}
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  border: 'none',
                  background: '#f1f5f9',
                  color: currentPage === 1 ? '#cbd5e1' : '#64748b',
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_left</span>
              </button>

              {/* Page numbers */}
              {(() => {
                const pages: (number | string)[] = [];
                if (totalPages <= 7) {
                  for (let i = 1; i <= totalPages; i++) pages.push(i);
                } else {
                  pages.push(1);
                  if (currentPage > 4) {
                    pages.push('...');
                  }
                  const start = Math.max(2, currentPage - 2);
                  const end = Math.min(totalPages - 1, currentPage + 2);
                  let adjustedStart = start;
                  let adjustedEnd = end;
                  if (currentPage <= 4) {
                    adjustedEnd = 5;
                  } else if (currentPage >= totalPages - 3) {
                    adjustedStart = totalPages - 4;
                  }
                  for (let i = adjustedStart; i <= adjustedEnd; i++) {
                    pages.push(i);
                  }
                  if (currentPage < totalPages - 3) {
                    pages.push('...');
                  }
                  pages.push(totalPages);
                }

                return pages.map((p, idx) => {
                  if (p === '...') {
                    return (
                      <span key={`ellipsis-${idx}`} style={{ padding: '0 4px', color: '#94a3b8', fontWeight: 600, fontSize: 13, userSelect: 'none' }}>
                        ...
                      </span>
                    );
                  }
                  return (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p as number)}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 8,
                        border: 'none',
                        background: p === currentPage ? TEAL : '#f1f5f9',
                        color: p === currentPage ? '#fff' : '#64748b',
                        fontWeight: 700,
                        fontSize: 12,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      {p}
                    </button>
                  );
                });
              })()}

              {/* Next Button */}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  border: 'none',
                  background: '#f1f5f9',
                  color: currentPage === totalPages ? '#cbd5e1' : '#64748b',
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_right</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <FlightFormModal open={addModalOpen} editing={editingFlight} onClose={() => setAddModalOpen(false)} onSubmit={handleSubmit} />
      <ActionModal flight={actionFlight} onClose={() => setActionFlight(null)} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default FlightsPage;
