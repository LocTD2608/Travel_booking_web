import React, { useState } from 'react';
import { Card, Table, Tag, Button, Space, Typography, Popconfirm, message, Avatar, Modal, Row, Col, Statistic } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { CancellationRequest } from '../../../services/admin/typing';

const { Title, Text } = Typography;
const TEAL = '#00C2A0';

const mockData: CancellationRequest[] = [
  { id: 'CR001', bookingId: 'BK003', customerName: 'Lê Minh Châu', reason: 'Thay đổi lịch trình công tác', requestedAt: '2024-07-12 08:20', status: 'pending' },
  { id: 'CR002', bookingId: 'BK007', customerName: 'Đặng Văn Quân', reason: 'Gia đình có việc đột xuất', requestedAt: '2024-07-13 16:05', status: 'pending' },
  { id: 'CR003', bookingId: 'BK001', customerName: 'Nguyễn Văn An', reason: 'Đặt nhầm chuyến bay', requestedAt: '2024-07-10 09:45', status: 'approved' },
  { id: 'CR004', bookingId: 'BK004', customerName: 'Phạm Thị Dung', reason: 'Sức khỏe không cho phép', requestedAt: '2024-07-11 15:00', status: 'rejected' },
  { id: 'CR005', bookingId: 'BK002', customerName: 'Trần Thị Bình', reason: 'Không hài lòng với phòng đã chọn', requestedAt: '2024-07-14 11:30', status: 'pending' },
];

const statusColor: Record<string, string> = { pending: 'gold', approved: 'green', rejected: 'red' };

const CancellationsPage: React.FC = () => {
  const [data, setData] = useState<CancellationRequest[]>(mockData);
  const [reasonModal, setReasonModal] = useState<{ name: string; reason: string } | null>(null);

  const handleApprove = (id: string) => {
    setData((prev) => prev.map((r) => r.id === id ? { ...r, status: 'approved' as const } : r));
    message.success('Request approved');
  };

  const handleReject = (id: string) => {
    setData((prev) => prev.map((r) => r.id === id ? { ...r, status: 'rejected' as const } : r));
    message.error('Request rejected');
  };

  const columns: ColumnsType<CancellationRequest> = [
    { title: 'ID', dataIndex: 'id', render: (v) => <Text strong style={{ color: TEAL }}>{v}</Text> },
    { title: 'Booking', dataIndex: 'bookingId', render: (v) => <Tag>{v}</Tag> },
    {
      title: 'Customer', dataIndex: 'customerName',
      render: (name) => (
        <Space>
          <Avatar size={28} style={{ background: TEAL, fontSize: 12, fontWeight: 700 }}>{name.charAt(0)}</Avatar>
          <Text style={{ fontWeight: 500 }}>{name}</Text>
        </Space>
      ),
    },
    {
      title: 'Reason', dataIndex: 'reason',
      render: (v, r) => (
        <Text style={{ cursor: 'pointer', color: '#4A90D9' }} onClick={() => setReasonModal({ name: r.customerName, reason: v })}>
          {v.length > 40 ? `${v.substring(0, 40)}...` : v}
        </Text>
      ),
    },
    { title: 'Requested At', dataIndex: 'requestedAt' },
    { title: 'Status', dataIndex: 'status', render: (s) => <Tag color={statusColor[s]}>{s.toUpperCase()}</Tag> },
    {
      title: 'Actions',
      render: (_, r) => r.status === 'pending' ? (
        <Space>
          <Popconfirm title="Approve this request?" onConfirm={() => handleApprove(r.id)} okButtonProps={{ style: { background: TEAL, borderColor: TEAL } }}>
            <Button size="small" icon={<CheckOutlined />} style={{ color: TEAL, borderColor: TEAL }}>Approve</Button>
          </Popconfirm>
          <Popconfirm title="Reject this request?" onConfirm={() => handleReject(r.id)} okButtonProps={{ danger: true }}>
            <Button size="small" icon={<CloseOutlined />} danger>Reject</Button>
          </Popconfirm>
        </Space>
      ) : <Text type="secondary" style={{ fontSize: 12 }}>Processed</Text>,
    },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 20 }}>Cancellation Requests</Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {[
          { title: 'Total', value: data.length },
          { title: 'Pending', value: data.filter(d => d.status === 'pending').length },
          { title: 'Approved', value: data.filter(d => d.status === 'approved').length },
          { title: 'Rejected', value: data.filter(d => d.status === 'rejected').length },
        ].map(s => (
          <Col xs={12} lg={6} key={s.title}>
            <Card style={{ borderRadius: 10 }}><Statistic title={s.title} value={s.value} valueStyle={{ fontSize: 22, fontWeight: 700 }} /></Card>
          </Col>
        ))}
      </Row>
      <Card style={{ borderRadius: 12 }}>
        <Table columns={columns} dataSource={data} rowKey="id" pagination={{ pageSize: 10 }} style={{ fontSize: 13 }} />
      </Card>
      <Modal title={`Reason — ${reasonModal?.name}`} open={!!reasonModal} onCancel={() => setReasonModal(null)} footer={null}>
        <Text>{reasonModal?.reason}</Text>
      </Modal>
    </div>
  );
};

export default CancellationsPage;
