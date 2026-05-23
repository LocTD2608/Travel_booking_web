import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Avatar, Typography, Space, Progress, Spin, Alert } from 'antd';
import { ArrowUpOutlined, DollarOutlined, TeamOutlined, CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import type { ColumnsType } from 'antd/es/table';
import { getDashboardStats } from '../../../services/admin/bookings';

const { Title, Text } = Typography;
const TEAL = '#00C2A0';
const CORAL = '#FF8C6B';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  changePositive?: boolean;
  gradient: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, gradient, icon, changePositive = true }) => (
  <Card style={{ borderRadius: 12, border: 'none', overflow: 'hidden' }} bodyStyle={{ padding: 0 }}>
    <div style={{ background: gradient, padding: '20px 24px', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: 500 }}>{title}</Text>
          <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4 }}>{value}</div>
          <div style={{ marginTop: 8, fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>
            <ArrowUpOutlined style={{ transform: changePositive ? 'none' : 'rotate(180deg)' }} /> {change}
          </div>
        </div>
        <div style={{ fontSize: 28, opacity: 0.85 }}>{icon}</div>
      </div>
    </div>
  </Card>
);

const statusColor: Record<string, string> = { 'Đã thanh toán': 'green', 'Chưa thanh toán': 'gold', 'Đã hủy': 'red', 'Đã hoàn tiền': 'blue' };

const columns: ColumnsType<any> = [
  {
    title: 'Booking ID',
    dataIndex: 'MaBooking',
    render: (v) => <Text strong style={{ color: TEAL }}>#{v}</Text>,
  },
  {
    title: 'User ID',
    dataIndex: 'UserID',
    render: (id) => (
      <Space>
        <Avatar size={28} style={{ background: TEAL, fontSize: 12, fontWeight: 700 }}>{id}</Avatar>
        <Text>User #{id}</Text>
      </Space>
    ),
  },
  {
    title: 'Amount',
    dataIndex: 'TongTien',
    render: (v) => `₫${Number(v).toLocaleString('vi-VN')}`,
    sorter: (a: any, b: any) => a.TongTien - b.TongTien,
  },
  {
    title: 'Status',
    dataIndex: 'TrangThaiBooking',
    render: (s: string) => <Tag color={statusColor[s] ?? 'default'}>{s}</Tag>,
  },
  {
    title: 'Date',
    dataIndex: 'ThoiDiemThanhToan',
    render: (v) => v ? new Date(v).toLocaleDateString('vi-VN') : '—',
  },
];

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardStats()
      .then((res: any) => {
        if (res?.success) setStats(res.data);
        else setError('Không thể tải dữ liệu dashboard');
      })
      .catch(() => setError('Lỗi kết nối backend. Kiểm tra localhost:3000'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" tip="Đang tải dữ liệu..." /></div>;
  if (error) return <Alert message="Lỗi kết nối API" description={error} type="error" showIcon style={{ borderRadius: 12 }} />;

  const chartData = (stats?.thongKeBookingTheoThang ?? []).map((item: any) => ({
    month: MONTH_LABELS[(item.thang ?? 1) - 1],
    revenue: Number(item.doanhThu) || 0,
    bookings: Number(item.tongBooking) || 0,
  }));

  const recentBookings = stats?.recentBookings ?? [];

  return (
    <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      <Title level={4} style={{ marginBottom: 20, color: '#1a1a2e' }}>Overview Analytics</Title>

      {/* Stat Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Tổng Người Dùng" value={Number(stats?.tongNguoiDung ?? 0).toLocaleString()} change="Tổng cộng" gradient="linear-gradient(135deg, #00C2A0, #00a884)" icon={<TeamOutlined />} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Tổng Booking" value={Number(stats?.tongBooking ?? 0).toLocaleString()} change={`Hôm nay: ${stats?.bookingHomNay ?? 0}`} gradient="linear-gradient(135deg, #4A90D9, #2563eb)" icon={<CalendarOutlined />} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Doanh Thu" value={`₫${(Number(stats?.tongDoanhThu ?? 0) / 1000000).toFixed(1)}M`} change="Đã thanh toán" gradient="linear-gradient(135deg, #10B981, #059669)" icon={<DollarOutlined />} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Booking Hôm Nay" value={stats?.bookingHomNay ?? 0} change="Ngày hiện tại" gradient="linear-gradient(135deg, #FF8C6B, #ef4444)" icon={<ClockCircleOutlined />} />
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card title={<Text strong style={{ fontSize: 15 }}>Doanh Thu Theo Tháng</Text>} style={{ borderRadius: 12 }}>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={TEAL} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={TEAL} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(v) => `₫${(v / 1000000).toFixed(0)}M`} />
                <Tooltip formatter={(v: any) => [`₫${Number(v).toLocaleString('vi-VN')}`, 'Doanh thu']} />
                <Area type="monotone" dataKey="revenue" stroke={TEAL} strokeWidth={2.5} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Trạng thái booking */}
        <Col xs={24} lg={8}>
          <Card title={<Text strong style={{ fontSize: 15 }}>Trạng Thái Booking</Text>} style={{ borderRadius: 12, height: '100%' }}>
            <Space direction="vertical" style={{ width: '100%' }} size={16}>
              {(stats?.thongKeTrangThaiBooking ?? []).map((item: any) => {
                const total = stats?.tongBooking || 1;
                const pct = Math.round((item.tongSoLuong / total) * 100);
                return (
                  <div key={item.TrangThaiBooking}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <Tag color={statusColor[item.TrangThaiBooking] ?? 'default'}>{item.TrangThaiBooking}</Tag>
                      <Text type="secondary" style={{ fontSize: 12 }}>{item.tongSoLuong}</Text>
                    </div>
                    <Progress percent={pct} showInfo={false} strokeColor={TEAL} strokeWidth={6} />
                  </div>
                );
              })}
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Monthly Bookings + Recent */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={10}>
          <Card title={<Text strong style={{ fontSize: 15 }}>Booking Theo Tháng</Text>} style={{ borderRadius: 12 }}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip />
                <Bar dataKey="bookings" fill={CORAL} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={14}>
          <Card title={<Text strong style={{ fontSize: 15 }}>Booking Gần Đây</Text>} style={{ borderRadius: 12 }}>
            <Table dataSource={recentBookings.slice(0, 5)} columns={columns} rowKey="MaBooking" size="small" pagination={false} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
