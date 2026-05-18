import React, { useState } from 'react';
import {
  Card, Table, Tag, Button, Space, Input, Modal, Form,
  Select, DatePicker, InputNumber, Popconfirm, Typography, Row, Col, Statistic, message, Tooltip,
} from 'antd';
import {
  PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined,
  ExportOutlined, FilterOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Flight } from '../../../services/admin/typing';

const { Title, Text } = Typography;
const { Option } = Select;

const TEAL = '#00C2A0';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const mockFlights: Flight[] = [
  { id: 'f1', flightNumber: 'VN204', airline: 'Vietnam Airlines', origin: 'HAN', destination: 'SGN', departureTime: '2024-07-15 06:00', arrivalTime: '2024-07-15 08:10', price: 1850000, seats: 120, status: 'active' },
  { id: 'f2', flightNumber: 'VJ345', airline: 'VietJet Air', origin: 'SGN', destination: 'DAD', departureTime: '2024-07-15 09:30', arrivalTime: '2024-07-15 11:00', price: 950000, seats: 180, status: 'active' },
  { id: 'f3', flightNumber: 'QH701', airline: 'Bamboo Airways', origin: 'HAN', destination: 'PQC', departureTime: '2024-07-16 07:15', arrivalTime: '2024-07-16 09:20', price: 2750000, seats: 150, status: 'delayed' },
  { id: 'f4', flightNumber: 'VN502', airline: 'Vietnam Airlines', origin: 'SGN', destination: 'HAN', departureTime: '2024-07-16 14:00', arrivalTime: '2024-07-16 16:10', price: 2100000, seats: 120, status: 'active' },
  { id: 'f5', flightNumber: 'VJ890', airline: 'VietJet Air', origin: 'DAD', destination: 'SGN', departureTime: '2024-07-17 18:00', arrivalTime: '2024-07-17 19:20', price: 880000, seats: 180, status: 'cancelled' },
];

const statusColor: Record<string, string> = {
  active: 'green',
  delayed: 'gold',
  cancelled: 'red',
};

// ─── Add/Edit Modal ───────────────────────────────────────────────────────────
interface FlightModalProps {
  open: boolean;
  editingFlight: Flight | null;
  onClose: () => void;
  onSubmit: (values: Partial<Flight>) => void;
}

const FlightModal: React.FC<FlightModalProps> = ({ open, editingFlight, onClose, onSubmit }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (open) editingFlight ? form.setFieldsValue(editingFlight) : form.resetFields();
  }, [open, editingFlight]);

  return (
    <Modal
      title={
        <Text strong style={{ fontSize: 16 }}>
          {editingFlight ? '✏️ Edit Flight' : '✈️ Add New Flight'}
        </Text>
      }
      open={open}
      onCancel={onClose}
      onOk={() => form.validateFields().then(onSubmit)}
      okText={editingFlight ? 'Update' : 'Add Flight'}
      okButtonProps={{ style: { background: TEAL, borderColor: TEAL } }}
      width={600}
      destroyOnClose
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="flightNumber" label="Flight Number" rules={[{ required: true }]}>
              <Input placeholder="e.g. VN204" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="airline" label="Airline" rules={[{ required: true }]}>
              <Select placeholder="Select airline">
                <Option value="Vietnam Airlines">Vietnam Airlines</Option>
                <Option value="VietJet Air">VietJet Air</Option>
                <Option value="Bamboo Airways">Bamboo Airways</Option>
                <Option value="Pacific Airlines">Pacific Airlines</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="origin" label="Origin (IATA)" rules={[{ required: true }]}>
              <Input placeholder="e.g. HAN" maxLength={3} style={{ textTransform: 'uppercase' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="destination" label="Destination (IATA)" rules={[{ required: true }]}>
              <Input placeholder="e.g. SGN" maxLength={3} style={{ textTransform: 'uppercase' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="price" label="Price (VND)" rules={[{ required: true }]}>
              <InputNumber
                style={{ width: '100%' }}
                formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                placeholder="0"
                min={0}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="seats" label="Available Seats" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} min={1} max={400} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="status" label="Status" rules={[{ required: true }]}>
          <Select>
            <Option value="active">Active</Option>
            <Option value="delayed">Delayed</Option>
            <Option value="cancelled">Cancelled</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

// ─── Flights Page ─────────────────────────────────────────────────────────────
const FlightsPage: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>(mockFlights);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);

  const filtered = flights.filter(
    (f) =>
      f.flightNumber.toLowerCase().includes(search.toLowerCase()) ||
      f.airline.toLowerCase().includes(search.toLowerCase()) ||
      f.origin.toLowerCase().includes(search.toLowerCase()) ||
      f.destination.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAdd = () => { setEditingFlight(null); setModalOpen(true); };
  const handleEdit = (f: Flight) => { setEditingFlight(f); setModalOpen(true); };

  const handleDelete = (id: string) => {
    setFlights((prev) => prev.filter((f) => f.id !== id));
    message.success('Flight deleted successfully');
  };

  const handleSubmit = (values: Partial<Flight>) => {
    if (editingFlight) {
      setFlights((prev) => prev.map((f) => (f.id === editingFlight.id ? { ...f, ...values } : f)));
      message.success('Flight updated successfully');
    } else {
      const newFlight: Flight = { ...values as Flight, id: `f${Date.now()}` };
      setFlights((prev) => [newFlight, ...prev]);
      message.success('Flight added successfully');
    }
    setModalOpen(false);
  };

  const columns: ColumnsType<Flight> = [
    {
      title: 'Flight No.',
      dataIndex: 'flightNumber',
      render: (v) => <Text strong style={{ color: TEAL }}>{v}</Text>,
      sorter: (a, b) => a.flightNumber.localeCompare(b.flightNumber),
    },
    { title: 'Airline', dataIndex: 'airline' },
    {
      title: 'Route',
      render: (_, r) => (
        <Space>
          <Tag>{r.origin}</Tag>
          <span style={{ color: '#94a3b8' }}>→</span>
          <Tag>{r.destination}</Tag>
        </Space>
      ),
    },
    { title: 'Departure', dataIndex: 'departureTime', sorter: (a, b) => a.departureTime.localeCompare(b.departureTime) },
    {
      title: 'Price',
      dataIndex: 'price',
      render: (v) => `₫${v.toLocaleString('vi-VN')}`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Seats',
      dataIndex: 'seats',
      render: (v) => <Text type={v < 20 ? 'danger' : 'secondary'}>{v}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (s) => <Tag color={statusColor[s]}>{s.toUpperCase()}</Tag>,
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Delayed', value: 'delayed' },
        { text: 'Cancelled', value: 'cancelled' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} />
          </Tooltip>
          <Popconfirm
            title="Delete this flight?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record.id)}
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete">
              <Button icon={<DeleteOutlined />} size="small" danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 20, color: '#1a1a2e' }}>Flights Management</Title>

      {/* Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {[
          { title: 'Total Bookings', value: 1284, suffix: 'bookings' },
          { title: 'Active Flights', value: flights.filter(f => f.status === 'active').length, suffix: 'flights' },
          { title: 'Total Revenue', value: '₫142,500', suffix: '' },
          { title: 'Pending Issues', value: flights.filter(f => f.status !== 'active').length, suffix: 'flights' },
        ].map((s) => (
          <Col xs={12} lg={6} key={s.title}>
            <Card style={{ borderRadius: 10, border: '1px solid #f0f0f0' }}>
              <Statistic title={s.title} value={s.value} suffix={s.suffix} valueStyle={{ fontSize: 22, fontWeight: 700 }} />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Table Card */}
      <Card style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
          <Input
            placeholder="Search by flight no., airline, route..."
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 340, borderRadius: 8 }}
          />
          <Space>
            <Button icon={<FilterOutlined />}>Filter</Button>
            <Button icon={<ExportOutlined />}>Export</Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              style={{ background: TEAL, borderColor: TEAL, borderRadius: 8 }}
            >
              Add Booking
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (t) => `Showing ${filtered.length} of ${t} bookings` }}
          style={{ fontSize: 13 }}
        />
      </Card>

      <FlightModal
        open={modalOpen}
        editingFlight={editingFlight}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default FlightsPage;
