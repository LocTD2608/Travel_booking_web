import React, { useEffect, useState } from 'react';
import {
  Card, Table, Tag, Space, Button, Typography,
  Input, Select, Statistic, Row, Col, Popconfirm, message, Spin, Alert, Modal, Descriptions
} from 'antd';
import { SearchOutlined, StopOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import request from '../../../services/admin/index';

const { Title, Text } = Typography;
const { Option } = Select;

const statusColor: Record<string, string> = {
  'Đã thanh toán': 'green',
  'Chưa thanh toán': 'gold',
  'Đã hủy': 'red',
};

const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [cancelling, setCancelling] = useState<number | null>(null);

  // Lấy tất cả bookings qua stats (admin)
  const fetchBookings = () => {
    setLoading(true);
    request.get('/booking/stats')
      .then((res: any) => {
        if (res?.success) {
          const list = res.data?.bookings ?? [];
          setBookings(list);
          setFiltered(list);
        } else {
          setError(res?.message ?? 'Không thể tải bookings');
        }
      })
      .catch(() => setError('Lỗi kết nối /api/booking/stats. Cần token ADMIN.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleFilter = (status: string) => {
    setSelectedStatus(status);
    if (status === 'all') {
      setFiltered(bookings);
    } else {
      setFiltered(bookings.filter(b => b.TrangThaiBooking === status));
    }
  };

  const handleSearch = (value: string) => {
    const list = selectedStatus === 'all' ? bookings : bookings.filter(b => b.TrangThaiBooking === selectedStatus);
    setFiltered(list.filter(b => String(b.MaBooking).includes(value) || String(b.UserID).includes(value)));
  };

  const handleCancel = async (id: number) => {
    setCancelling(id);
    try {
      await request.post(`/booking/cancel/${id}`);
      message.success(`Đã hủy booking #${id}`);
      fetchBookings();
    } catch {
      message.error('Hủy thất bại');
    } finally {
      setCancelling(null);
    }
  };

  const totalRevenue = bookings.filter(b => b.TrangThaiBooking === 'Đã thanh toán').reduce((s, b) => s + Number(b.TongTien || 0), 0);
  const paidCount = bookings.filter(b => b.TrangThaiBooking === 'Đã thanh toán').length;
  const pendingCount = bookings.filter(b => b.TrangThaiBooking === 'Chưa thanh toán').length;
  const cancelledCount = bookings.filter(b => b.TrangThaiBooking === 'Đã hủy').length;

  const columns: ColumnsType<any> = [
    {
      title: 'Booking ID',
      dataIndex: 'MaBooking',
      render: (v) => <Text strong style={{ color: '#00C2A0' }}>#{v}</Text>,
      sorter: (a, b) => a.MaBooking - b.MaBooking,
    },
    {
      title: 'User ID',
      dataIndex: 'UserID',
      render: (v) => <Text>User #{v}</Text>,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'TongTien',
      render: (v) => <Text strong>₫{Number(v).toLocaleString('vi-VN')}</Text>,
      sorter: (a, b) => a.TongTien - b.TongTien,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'TrangThaiBooking',
      render: (v) => <Tag color={statusColor[v] ?? 'default'}>{v}</Tag>,
    },
    {
      title: 'Thời điểm đặt',
      dataIndex: 'ThoiDiemDat',
      render: (v) => v ? new Date(v).toLocaleDateString('vi-VN') : '—',
      sorter: (a, b) => new Date(a.ThoiDiemDat).getTime() - new Date(b.ThoiDiemDat).getTime(),
    },
    {
      title: 'Thanh toán',
      dataIndex: 'ThoiDiemThanhToan',
      render: (v) => v ? new Date(v).toLocaleDateString('vi-VN') : '—',
    },
    {
      title: 'Hành động',
      render: (_, r) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small" onClick={() => { setSelectedBooking(r); setDetailVisible(true); }}>Chi tiết</Button>
          {r.TrangThaiBooking !== 'Đã hủy' && (
            <Popconfirm title="Xác nhận hủy booking này?" onConfirm={() => handleCancel(r.MaBooking)} okText="Hủy booking" cancelText="Thôi" okButtonProps={{ danger: true }}>
              <Button icon={<StopOutlined />} size="small" danger loading={cancelling === r.MaBooking}>Hủy</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>;
  if (error) return <Alert message="Lỗi API" description={error} type="error" showIcon />;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Title level={4} style={{ margin: 0 }}>Quản Lý Booking</Title>
        <Space>
          <Input.Search placeholder="Booking ID / User ID..." onSearch={handleSearch} style={{ width: 220 }} prefix={<SearchOutlined />} allowClear />
          <Select defaultValue="all" style={{ width: 180 }} onChange={handleFilter}>
            <Option value="all">Tất cả trạng thái</Option>
            <Option value="Đã thanh toán">Đã thanh toán</Option>
            <Option value="Chưa thanh toán">Chưa thanh toán</Option>
            <Option value="Đã hủy">Đã hủy</Option>
          </Select>
        </Space>
      </div>

      {/* Summary */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col span={6}><Card style={{ borderRadius: 10 }}><Statistic title="Tổng doanh thu" value={totalRevenue} formatter={(v) => `₫${Number(v).toLocaleString('vi-VN')}`} valueStyle={{ color: '#00C2A0', fontSize: 20 }} /></Card></Col>
        <Col span={6}><Card style={{ borderRadius: 10 }}><Statistic title="Đã thanh toán" value={paidCount} valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col span={6}><Card style={{ borderRadius: 10 }}><Statistic title="Chờ thanh toán" value={pendingCount} valueStyle={{ color: '#faad14' }} /></Card></Col>
        <Col span={6}><Card style={{ borderRadius: 10 }}><Statistic title="Đã hủy" value={cancelledCount} valueStyle={{ color: '#ff4d4f' }} /></Card></Col>
      </Row>

      <Card style={{ borderRadius: 12 }}>
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="MaBooking"
          pagination={{ pageSize: 20, showSizeChanger: true, showTotal: (t) => `Tổng ${t} booking` }}
        />
      </Card>

      <Modal
        title={`Chi tiết Booking #${selectedBooking?.MaBooking}`}
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={500}
      >
        {selectedBooking && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Booking ID">{selectedBooking.MaBooking}</Descriptions.Item>
            <Descriptions.Item label="User ID">{selectedBooking.UserID}</Descriptions.Item>
            <Descriptions.Item label="Tổng tiền">₫{Number(selectedBooking.TongTien).toLocaleString('vi-VN')}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái"><Tag color={statusColor[selectedBooking.TrangThaiBooking] ?? 'default'}>{selectedBooking.TrangThaiBooking}</Tag></Descriptions.Item>
            <Descriptions.Item label="Thời điểm đặt">{new Date(selectedBooking.ThoiDiemDat).toLocaleString('vi-VN')}</Descriptions.Item>
            <Descriptions.Item label="Thanh toán lúc">{selectedBooking.ThoiDiemThanhToan ? new Date(selectedBooking.ThoiDiemThanhToan).toLocaleString('vi-VN') : 'Chưa thanh toán'}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </>
  );
};

export default BookingsPage;
