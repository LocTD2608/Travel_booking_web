import React, { useState } from 'react';
import { message } from 'antd';
import type { CancellationRequest } from '../../../services/admin/typing';
import { getCancellations, updateCancellationStatus } from '../../../services/admin/cancellations';

const TEAL = '#00C2A0';

// ─── Mock Data (mở rộng theo Stitch design) ───────────────────────────────────
const mockData: CancellationRequest[] = [
  { id: 'CR001', bookingId: 'BK003', customerName: 'Lê Minh Châu', customerEmail: 'le.minh.chau@email.com', bookingType: 'flight', bookingDetail: 'VN-402 (SGN-NRT)', bookingClass: 'Business Class', reason: 'Thay đổi lịch trình công tác đột xuất. Có tài liệu xác nhận từ công ty.', requestedAt: '2024-10-24 14:20', status: 'pending' },
  { id: 'CR002', bookingId: 'BK007', customerName: 'Đặng Văn Quân', customerEmail: 'dang.van.quan@travel.vn', bookingType: 'hotel', bookingDetail: 'Marina Bay Sands', bookingClass: 'Singapore', reason: 'Hội nghị bị hủy do vấn đề visa. Yêu cầu hoàn tiền toàn bộ.', requestedAt: '2024-10-23 09:45', status: 'approved' },
  { id: 'CR003', bookingId: 'BK001', customerName: 'Nguyễn Văn An', customerEmail: 'nguyen.an@gmail.com', bookingType: 'flight', bookingDetail: 'AF-188 (CDG-JFK)', bookingClass: 'Economy Plus', reason: 'Thay đổi ngày bay. Tìm được chặng bay tốt hơn ở nơi khác. Hủy trong 24h.', requestedAt: '2024-10-22 18:12', status: 'rejected' },
  { id: 'CR004', bookingId: 'BK004', customerName: 'Phạm Thị Dung', customerEmail: 'pham.dung@outlook.com', bookingType: 'tour', bookingDetail: 'Tour Phú Quốc 5N4Đ', bookingClass: 'Premium Package', reason: 'Sức khỏe không cho phép. Có giấy tờ y tế xác nhận.', requestedAt: '2024-10-21 10:30', status: 'pending' },
  { id: 'CR005', bookingId: 'BK002', customerName: 'Trần Thị Bình', customerEmail: 'tran.binh@company.co', bookingType: 'hotel', bookingDetail: 'Vinpearl Resort & Spa', bookingClass: 'Nha Trang', reason: 'Không hài lòng với phòng được phân. Yêu cầu chuyển loại phòng hoặc hoàn tiền.', requestedAt: '2024-10-20 16:00', status: 'pending' },
  { id: 'CR006', bookingId: 'BK009', customerName: 'Hoàng Minh Tuấn', customerEmail: 'hoang.tuan@tech.vn', bookingType: 'flight', bookingDetail: 'VJ-345 (HAN-BKK)', bookingClass: 'Economy', reason: 'Đặt nhầm ngày bay. Yêu cầu hoàn tiền hoặc đổi ngày.', requestedAt: '2024-10-19 08:45', status: 'approved' },
  { id: 'CR007', bookingId: 'BK011', customerName: 'Ngô Thanh Tú', customerEmail: 'ngo.tu@startup.io', bookingType: 'hotel', bookingDetail: 'Mường Thanh Grand', bookingClass: 'Đà Nẵng', reason: 'Thay đổi kế hoạch du lịch gia đình do thiên tai.', requestedAt: '2024-10-18 20:15', status: 'pending' },
];

const statusStyle: Record<string, { bg: string; color: string }> = {
  pending: { bg: '#fef9c3', color: '#ca8a04' },
  approved: { bg: '#f0fdf4', color: '#16a34a' },
  rejected: { bg: '#fef2f2', color: '#dc2626' },
};

const bookingTypeIcon: Record<string, string> = {
  flight: 'flight_takeoff',
  hotel: 'hotel',
  tour: 'tour',
};
const bookingTypeColor: Record<string, string> = {
  flight: '#3b82f6',
  hotel: '#f97316',
  tour: '#8b5cf6',
};

const avatarColors = ['#3b82f6', '#f97316', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

// ─── View Detail Modal ────────────────────────────────────────────────────────
const DetailModal: React.FC<{ req: CancellationRequest | null; onClose: () => void; }> = ({ req, onClose }) => {
  if (!req) return null;
  const s = statusStyle[req.status] || { bg: '#f1f5f9', color: '#64748b' };
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <div style={{ position: 'relative', background: '#fff', width: '100%', maxWidth: 440, borderRadius: 20, boxShadow: '0 20px 60px -8px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>Chi Tiết Yêu Cầu #{req.id}</span>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#64748b' }}>close</span>
          </button>
        </div>
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { label: 'Khách hàng', value: `${req.customerName} · ${req.customerEmail}` },
            { label: 'Booking', value: req.bookingId },
            { label: 'Loại dịch vụ', value: req.bookingDetail + (req.bookingClass ? ` (${req.bookingClass})` : '') },
            { label: 'Ngày yêu cầu', value: req.requestedAt },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{item.value}</span>
            </div>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Lý do hủy</span>
            <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: 10, fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{req.reason}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Trạng thái</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 999, background: s.bg, color: s.color, fontSize: 12, fontWeight: 700, width: 'fit-content' }}>
              {req.status.toUpperCase()}
            </span>
          </div>
        </div>
        <div style={{ padding: '14px 24px', borderTop: '1px solid #f1f5f9', background: '#f8fafc' }}>
          <button onClick={onClose} style={{ width: '100%', padding: '10px 0', borderRadius: 12, border: 'none', background: TEAL, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Đóng</button>
        </div>
      </div>
    </div>
  );
};

// ─── Cancellations Page ───────────────────────────────────────────────────────
const CancellationsPage: React.FC = () => {
  const [data, setData] = useState<CancellationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewReq, setViewReq] = useState<CancellationRequest | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchCancellations = async () => {
    try {
      setLoading(true);
      const res = await getCancellations();
      const cancellationsData = res.data || res;
      setData(Array.isArray(cancellationsData) ? cancellationsData : mockData);
    } catch (error) {
      console.error('Error fetching cancellations:', error);
      message.warning('Kết nối API thất bại, hiển thị dữ liệu dự phòng');
      setData(mockData);
    } finally {
      setLoading(false);
    }
  };

  const fetchCancellationsSilent = async () => {
    try {
      const res = await getCancellations();
      const cancellationsData = res.data || res;
      if (Array.isArray(cancellationsData)) {
        setData(cancellationsData);
      }
    } catch (error) {
      console.error('Error fetching cancellations silently:', error);
    }
  };

  React.useEffect(() => {
    fetchCancellations();
  }, []);

  const handleApprove = async (id: string) => {
    // 1. Optimistic UI update
    setData(prev => prev.map(r => String(r.id).trim() === String(id).trim() ? { ...r, status: 'approved' as const } : r));
    message.success('Đang thực hiện phê duyệt...');

    try {
      // 2. Call API in background
      await updateCancellationStatus(id, 'approved');
      message.success('Đã xác nhận yêu cầu hủy thành công!');
      await fetchCancellationsSilent();
    } catch (error) {
      console.error('Error approving cancellation:', error);
      message.error('Không thể phê duyệt yêu cầu hủy');
      // Rollback on error by re-fetching
      await fetchCancellationsSilent();
    }
  };

  const handleReject = async (id: string) => {
    // 1. Optimistic UI update
    setData(prev => prev.map(r => String(r.id).trim() === String(id).trim() ? { ...r, status: 'rejected' as const } : r));
    message.warning('Đang thực hiện từ chối...');

    try {
      // 2. Call API in background
      await updateCancellationStatus(id, 'rejected');
      message.warning('Đã từ chối yêu cầu hủy thành công!');
      await fetchCancellationsSilent();
    } catch (error) {
      console.error('Error rejecting cancellation:', error);
      message.error('Không thể từ chối yêu cầu hủy');
      // Rollback on error by re-fetching
      await fetchCancellationsSilent();
    }
  };

  const pendingCount = data.filter(d => d.status === 'pending').length;
  const approvedCount = data.filter(d => d.status === 'approved').length;
  const rejectedCount = data.filter(d => d.status === 'rejected').length;

  const filtered = data.filter(r => {
    const matchSearch = r.customerName.toLowerCase().includes(search.toLowerCase()) ||
      r.bookingId.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });


  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>Cancellation Requests</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>Xem xét và xử lý yêu cầu hủy/hoàn tiền từ khách hàng.</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <span className="material-symbols-outlined" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: '#94a3b8' }}>search</span>
            <input
              placeholder="Tìm yêu cầu..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 36, paddingRight: 14, paddingTop: 9, paddingBottom: 9, width: 220, borderRadius: 12, border: '1.5px solid #f1f5f9', background: '#fff', fontSize: 13, outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 4, background: '#f8fafc', borderRadius: 10, padding: 3 }}>
            {[{ label: 'Tất cả', value: 'all' }, { label: 'Chờ xử lý', value: 'pending' }, { label: 'Đã duyệt', value: 'approved' }, { label: 'Từ chối', value: 'rejected' }].map(opt => (
              <button key={opt.value} onClick={() => setStatusFilter(opt.value)} style={{
                padding: '6px 12px', borderRadius: 8, border: 'none',
                background: statusFilter === opt.value ? '#fff' : 'transparent',
                color: statusFilter === opt.value ? '#0f172a' : '#64748b',
                fontWeight: statusFilter === opt.value ? 700 : 500,
                fontSize: 12, cursor: 'pointer',
                boxShadow: statusFilter === opt.value ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              }}>{opt.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
        <div style={{ background: '#fff', borderRadius: 14, padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', borderBottom: '4px solid #3b82f6', border: '1px solid #f1f5f9', borderBottomColor: '#3b82f6' }}>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Total Pending</p>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>{pendingCount}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 14, padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Approved Today</p>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>{approvedCount}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 14, padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Avg. Response Time</p>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>2.4h</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', borderRadius: 14, padding: '20px', boxShadow: '0 4px 16px rgba(59,130,246,0.3)' }}>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Resolved (MTD)</p>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>1,{(200 + approvedCount + rejectedCount).toString().padStart(3, '0')}</div>
        </div>
      </div>

      {/* ── Table ── */}
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['Customer Info', 'Booking Type', 'Item Details', 'Cancellation Reason', 'Request Date', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: '60px 0', textAlign: 'center', color: '#64748b' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 32, color: TEAL, animation: 'spin 1.5s linear infinite' }}>sync</span>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>Đang tải danh sách yêu cầu hủy...</div>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                    Không có yêu cầu nào phù hợp
                  </td>
                </tr>
              ) : (
                filtered.map((r, idx) => {
                  const s = statusStyle[r.status] || { bg: '#f1f5f9', color: '#64748b' };
                  const aColor = avatarColors[idx % avatarColors.length];
                  return (
                    <tr key={r.id} style={{ borderTop: '1px solid #f8fafc', transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
                      {/* Customer Info */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 38, height: 38, borderRadius: 999, background: aColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
                            {r.customerName ? r.customerName.charAt(0) : '?'}
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{r.customerName}</div>
                            <div style={{ fontSize: 11, color: '#94a3b8' }}>{r.customerEmail}</div>
                          </div>
                        </div>
                      </td>
                      {/* Booking Type */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: bookingTypeColor[r.bookingType] || '#64748b', fontWeight: 600 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{bookingTypeIcon[r.bookingType] || 'help'}</span>
                          <span style={{ fontSize: 13, textTransform: 'capitalize' }}>{r.bookingType}</span>
                        </div>
                      </td>
                      {/* Item Details */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{r.bookingDetail}</div>
                        {r.bookingClass && <div style={{ fontSize: 11, color: '#94a3b8' }}>{r.bookingClass}</div>}
                      </td>
                      {/* Reason */}
                      <td style={{ padding: '14px 20px', maxWidth: 220 }}>
                        <p style={{ margin: 0, fontSize: 12, color: '#64748b', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {r.reason}
                        </p>
                      </td>
                      {/* Date */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ fontSize: 13, color: '#374151' }}>{r.requestedAt ? r.requestedAt.split(' ')[0] : ''}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>{r.requestedAt ? r.requestedAt.split(' ')[1] : ''}</div>
                      </td>
                      {/* Status */}
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: 999, background: s.bg, color: s.color, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          {r.status === 'pending' ? 'Chờ xử lý' : r.status === 'approved' ? 'Đã duyệt' : 'Từ chối'}
                        </span>
                      </td>
                      {/* Actions */}
                      <td style={{ padding: '14px 20px' }}>
                        {r.status === 'pending' ? (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => handleApprove(r.id)} style={{ padding: '6px 12px', borderRadius: 8, border: 'none', background: '#3b82f6', color: '#fff', fontWeight: 700, fontSize: 11, cursor: 'pointer' }}>
                              Approve
                            </button>
                            <button onClick={() => handleReject(r.id)} style={{ padding: '6px 12px', borderRadius: 8, border: '1.5px solid #f1f5f9', background: '#fff', color: '#374151', fontWeight: 700, fontSize: 11, cursor: 'pointer' }}>
                              Reject
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setViewReq(r)} style={{ padding: '6px 8px', borderRadius: 8, border: 'none', background: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#64748b' }}>visibility</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid #f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fafafa' }}>
          <span style={{ fontSize: 12, color: '#64748b' }}>
            Hiển thị <strong style={{ color: '#0f172a' }}>1–{filtered.length}</strong> / <strong style={{ color: '#0f172a' }}>{data.length}</strong> yêu cầu
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            <button style={{ width: 30, height: 30, borderRadius: 8, border: '1.5px solid #f1f5f9', background: '#fff', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_left</span>
            </button>
            {[1, 2, 3].map(p => (
              <button key={p} style={{ width: 30, height: 30, borderRadius: 8, border: 'none', background: p === 1 ? '#3b82f6' : '#fff', color: p === 1 ? '#fff' : '#64748b', fontWeight: 700, fontSize: 12, cursor: 'pointer', boxShadow: p === 1 ? '0 2px 8px rgba(59,130,246,0.3)' : 'none' }}>{p}</button>
            ))}
            <button style={{ width: 30, height: 30, borderRadius: 8, border: '1.5px solid #f1f5f9', background: '#fff', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      <DetailModal req={viewReq} onClose={() => setViewReq(null)} />
    </div>
  );
};

export default CancellationsPage;
