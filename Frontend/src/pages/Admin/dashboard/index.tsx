import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Typography, Space, Spin, Alert } from 'antd';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar
} from 'recharts';
import { getDashboardStats, getTopDestinations } from '../../../services/admin/bookings';

const { Title, Text } = Typography;
const TEAL = '#00C2A0';
const CORAL = '#FF8C6B';
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ─── Premium Stat Card ────────────────────────────────────────────────────────
interface StatCardProps {
  title: string;
  value: string | number;
  sub: string;
  gradient: string;
  iconName: string;
  changeUp?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, sub, gradient, iconName, changeUp = true }) => (
  <div style={{
    background: gradient,
    borderRadius: 16,
    padding: '20px 24px',
    color: '#fff',
    boxShadow: '0 8px 24px -4px rgba(0,0,0,0.18)',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    position: 'relative',
    overflow: 'hidden',
  }}>
    <div style={{
      position: 'absolute', right: -12, top: -12,
      width: 90, height: 90, borderRadius: '50%',
      background: 'rgba(255,255,255,0.10)',
    }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.8, marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</div>
        <div style={{ marginTop: 8, fontSize: 12, opacity: 0.85, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
            {changeUp ? 'trending_up' : 'trending_flat'}
          </span>
          {sub}
        </div>
      </div>
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: 'rgba(255,255,255,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: 22, color: '#fff' }}>{iconName}</span>
      </div>
    </div>
  </div>
);

// ─── Status Badge ─────────────────────────────────────────────────────────────
const statusStyle: Record<string, { bg: string; color: string }> = {
  'Đã thanh toán': { bg: '#dcfce7', color: '#16a34a' },
  'Chưa thanh toán': { bg: '#fef9c3', color: '#ca8a04' },
  'Đã hủy': { bg: '#fee2e2', color: '#dc2626' },
  'Đã hoàn tiền': { bg: '#dbeafe', color: '#2563eb' },
};

const StatusPill: React.FC<{ status: string }> = ({ status }) => {
  const s = statusStyle[status] ?? { bg: '#f3f4f6', color: '#6b7280' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 999,
      background: s.bg, color: s.color,
      fontSize: 11, fontWeight: 700,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
      {status}
    </span>
  );
};

// ─── Table Columns (Unused removed) ─────────────────────────────────────────────

// ─── Dashboard Page ───────────────────────────────────────────────────────────
const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [topDestinations, setTopDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([getDashboardStats(), getTopDestinations()])
      .then(([statsRes, destinationsRes]: [any, any]) => {
        if (statsRes?.success) setStats(statsRes.data);
        if (destinationsRes?.success) setTopDestinations(destinationsRes.data);
      })
      .catch(() => setError('Lỗi kết nối backend. Kiểm tra localhost:3000'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 16 }}>
      <Spin size="large" />
      <span style={{ color: '#6b7280', fontSize: 14 }}>Đang tải dữ liệu dashboard...</span>
    </div>
  );
  if (error) return <Alert message="Lỗi kết nối API" description={error} type="error" showIcon style={{ borderRadius: 12 }} />;

  const chartData = (stats?.thongKeBookingTheoThang ?? []).map((item: any) => ({
    month: MONTH_LABELS[(item.thang ?? 1) - 1],
    revenue: Number(item.doanhThu) || 0,
    bookings: Number(item.tongBooking) || 0,
  }));
  const recentBookings = stats?.recentBookings ?? [];

  return (
    <div style={{ fontFamily: "'Inter', 'Be Vietnam Pro', sans-serif" }}>
      {/* ── Page Header ── */}
      <div style={{ marginBottom: 28 }}>
        <Title level={4} style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
          Overview Analytics
        </Title>
        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
          Tổng quan hoạt động hệ thống theo thời gian thực
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tổng Người Dùng"
            value={Number(stats?.tongNguoiDung ?? 0).toLocaleString()}
            sub="Tổng tài khoản đăng ký"
            gradient="linear-gradient(135deg, #00C2A0 0%, #007a65 100%)"
            iconName="group"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tổng Booking"
            value={Number(stats?.tongBooking ?? 0).toLocaleString()}
            sub={`Hôm nay: +${stats?.bookingHomNay ?? 0} mới`}
            gradient="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
            iconName="calendar_month"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Doanh Thu"
            value={`₫${(Number(stats?.tongDoanhThu ?? 0) / 1000000).toFixed(1)}M`}
            sub="Đã xác nhận thanh toán"
            gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
            iconName="payments"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Booking Hôm Nay"
            value={stats?.bookingHomNay ?? 0}
            sub="Trong ngày hiện tại"
            gradient="linear-gradient(135deg, #f97316 0%, #ea580c 100%)"
            iconName="today"
          />
        </Col>
      </Row>

      {/* ── Revenue Chart + Status ── */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} lg={16}>
          <Card
            style={{ borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}
            bodyStyle={{ padding: '20px 20px 12px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <Text strong style={{ fontSize: 15, color: '#0f172a' }}>Doanh Thu Theo Tháng</Text>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Năm hiện tại</div>
              </div>
              <span style={{
                padding: '4px 12px', borderRadius: 999,
                background: '#f0fdf4', color: '#16a34a',
                fontSize: 11, fontWeight: 700,
              }}>↑ Tích cực</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={TEAL} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={TEAL} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', fontSize: 12 }}
                  formatter={(v: any) => [`₫${Number(v).toLocaleString('vi-VN')}`, 'Doanh thu']}
                />
                <Area type="monotone" dataKey="revenue" stroke={TEAL} strokeWidth={2.5} fill="url(#revGrad)" dot={false} activeDot={{ r: 5, fill: TEAL }} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            style={{ borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 1px 8px rgba(0,0,0,0.05)', height: '100%' }}
            bodyStyle={{ padding: 20 }}
          >
            <Text strong style={{ fontSize: 15, color: '#0f172a', display: 'block', marginBottom: 20 }}>Trạng Thái Booking</Text>
            <Space direction="vertical" style={{ width: '100%' }} size={14}>
              {(stats?.thongKeTrangThaiBooking ?? []).map((item: any) => {
                const total = stats?.tongBooking || 1;
                const pct = Math.min(100, Math.round((item.tongSoLuong / total) * 100));
                const s = statusStyle[item.TrangThaiBooking] ?? { bg: '#f3f4f6', color: '#6b7280' };
                return (
                  <div key={item.TrangThaiBooking}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <StatusPill status={item.TrangThaiBooking} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>
                        {item.tongSoLuong.toLocaleString()} <span style={{ color: '#9ca3af', fontWeight: 400 }}>({pct}%)</span>
                      </span>
                    </div>
                    <div style={{ height: 6, borderRadius: 999, background: '#f1f5f9', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, borderRadius: 999, background: s.color, transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                );
              })}
            </Space>
          </Card>
        </Col>
      </Row>

      {/* ── Top Destinations ── */}
      <Card
        style={{ borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 1px 8px rgba(0,0,0,0.05)', marginBottom: 20 }}
        bodyStyle={{ padding: 0 }}
      >
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9' }}>
          <Text strong style={{ fontSize: 15, color: '#0f172a' }}>🗺️ Địa Điểm Phổ Biến Nhất</Text>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Xếp hạng dựa trên dữ liệu đặt phòng thực tế</div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['#', 'Địa điểm', 'Xếp hạng', 'Giá khởi điểm', 'Lượt đặt'].map(h => (
                  <th key={h} style={{ padding: '10px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topDestinations.map((dest, i) => (
                <tr key={dest.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 20px' }}>
                    <span style={{
                      width: 28, height: 28, borderRadius: 8,
                      background: i < 3 ? `${TEAL}15` : '#f8fafc',
                      color: i < 3 ? TEAL : '#94a3b8',
                      fontWeight: 800, fontSize: 12,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    }}>#{i + 1}</span>
                  </td>
                  <td style={{ padding: '12px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src={dest.image} alt={dest.name} style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a' }}>{dest.name}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{dest.subtitle?.split('·')[0]?.trim()}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 20px' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#f59e0b' }}>{'★'.repeat(Math.round(dest.rating))} {dest.rating}</span>
                  </td>
                  <td style={{ padding: '12px 20px' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{dest.price}</span>
                  </td>
                  <td style={{ padding: '12px 20px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      padding: '4px 10px', borderRadius: 999,
                      background: dest.bookingsCount > 0 ? '#f0fdf4' : '#f8fafc',
                      color: dest.bookingsCount > 0 ? '#16a34a' : '#9ca3af',
                      fontSize: 12, fontWeight: 700,
                    }}>
                      {dest.bookingsCount > 0 && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a' }} />}
                      {dest.bookingsCount} lượt
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── Monthly Bookings + Recent ── */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={10}>
          <Card
            style={{ borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}
            bodyStyle={{ padding: '20px 20px 12px' }}
          >
            <Text strong style={{ fontSize: 15, color: '#0f172a', display: 'block', marginBottom: 16 }}>Booking Theo Tháng</Text>
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={chartData} margin={{ top: 0, right: 4, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', fontSize: 12 }} />
                <Bar dataKey="bookings" fill={CORAL} radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={14}>
          <Card
            style={{ borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}
            bodyStyle={{ padding: 0 }}
          >
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9' }}>
              <Text strong style={{ fontSize: 15, color: '#0f172a' }}>Booking Gần Đây</Text>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    {['Booking', 'Khách hàng', 'Tổng tiền', 'Trạng thái', 'Ngày'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.slice(0, 6).map((b: any) => (
                    <tr key={b.MaBooking} style={{ borderTop: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '11px 16px', fontWeight: 700, color: TEAL, fontSize: 13 }}>#{b.MaBooking}</td>
                      <td style={{ padding: '11px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{
                            width: 28, height: 28, borderRadius: 7,
                            background: `${TEAL}18`, color: TEAL,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 800, fontSize: 11,
                          }}>{String(b.UserID).slice(-2)}</div>
                          <span style={{ fontSize: 13 }}>User #{b.UserID}</span>
                        </div>
                      </td>
                      <td style={{ padding: '11px 16px', fontWeight: 700, fontSize: 13 }}>₫{Number(b.TongTien).toLocaleString('vi-VN')}</td>
                      <td style={{ padding: '11px 16px' }}><StatusPill status={b.TrangThaiBooking} /></td>
                      <td style={{ padding: '11px 16px', color: '#94a3b8', fontSize: 12 }}>
                        {b.ThoiDiemDat ? new Date(b.ThoiDiemDat).toLocaleDateString('vi-VN') : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
