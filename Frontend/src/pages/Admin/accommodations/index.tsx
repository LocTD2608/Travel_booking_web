import React, { useState } from 'react';
import {
  Card, Table, Tag, Button, Space, Input, Modal, Form,
  Select, InputNumber, Popconfirm, Typography, Row, Col,
  message, Tooltip, Rate, Upload, Image,
} from 'antd';
import {
  PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined,
  UploadOutlined, HomeOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Accommodation } from '../../../services/admin/typing';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const TEAL = '#00C2A0';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const mockAccommodations: Accommodation[] = [
  { id: 'a1', name: 'Vinpearl Resort & Spa', location: 'Nha Trang', type: 'Resort', rating: 5, pricePerNight: 3200000, totalRooms: 250, availableRooms: 45, status: 'active' },
  { id: 'a2', name: 'Mường Thanh Grand', location: 'Đà Nẵng', type: 'Hotel', rating: 4, pricePerNight: 2100000, totalRooms: 180, availableRooms: 72, status: 'active' },
  { id: 'a3', name: 'Premier Village', location: 'Phú Quốc', type: 'Villa', rating: 5, pricePerNight: 8500000, totalRooms: 30, availableRooms: 8, status: 'active' },
  { id: 'a4', name: 'Novotel Hanoi', location: 'Hà Nội', type: 'Hotel', rating: 4, pricePerNight: 2800000, totalRooms: 200, availableRooms: 0, status: 'inactive' },
  { id: 'a5', name: 'Fusion Suites', location: 'Đà Nẵng', type: 'Suites', rating: 4, pricePerNight: 1950000, totalRooms: 90, availableRooms: 34, status: 'active' },
];

// ─── Modal Component ──────────────────────────────────────────────────────────
interface AccommodationModalProps {
  open: boolean;
  editing: Accommodation | null;
  onClose: () => void;
  onSubmit: (values: Partial<Accommodation>) => void;
}

const AccommodationModal: React.FC<AccommodationModalProps> = ({ open, editing, onClose, onSubmit }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (open) editing ? form.setFieldsValue(editing) : form.resetFields();
  }, [open, editing]);

  return (
    <Modal
      title={<Text strong style={{ fontSize: 16 }}>{editing ? '✏️ Edit Accommodation' : '🏨 Add New Accommodation'}</Text>}
      open={open}
      onCancel={onClose}
      onOk={() => form.validateFields().then(onSubmit)}
      okText={editing ? 'Update' : 'Add'}
      okButtonProps={{ style: { background: TEAL, borderColor: TEAL } }}
      width={640}
      destroyOnClose
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item name="name" label="Property Name" rules={[{ required: true }]}>
          <Input placeholder="e.g. Vinpearl Resort & Spa" />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="location" label="Location" rules={[{ required: true }]}>
              <Input placeholder="e.g. Nha Trang" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="type" label="Property Type" rules={[{ required: true }]}>
              <Select>
                <Option value="Hotel">Hotel</Option>
                <Option value="Resort">Resort</Option>
                <Option value="Villa">Villa</Option>
                <Option value="Suites">Suites</Option>
                <Option value="Hostel">Hostel</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="pricePerNight" label="Price per Night (VND)" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} min={0} formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="totalRooms" label="Total Rooms" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="rating" label="Star Rating">
              <Rate />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="status" label="Status">
              <Select>
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        {/* Image Upload */}
        <Form.Item name="imageUrl" label="Property Image">
          <Upload listType="picture-card" maxCount={1} beforeUpload={() => false}>
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8, fontSize: 12 }}>Upload Image</div>
            </div>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

// ─── Accommodations Page ──────────────────────────────────────────────────────
const AccommodationsPage: React.FC = () => {
  const [data, setData] = useState<Accommodation[]>(mockAccommodations);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Accommodation | null>(null);

  const filtered = data.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.location.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((a) => a.id !== id));
    message.success('Accommodation deleted');
  };

  const handleSubmit = (values: Partial<Accommodation>) => {
    if (editing) {
      setData((prev) => prev.map((a) => (a.id === editing.id ? { ...a, ...values } : a)));
      message.success('Accommodation updated');
    } else {
      setData((prev) => [{ ...values as Accommodation, id: `a${Date.now()}` }, ...prev]);
      message.success('Accommodation added');
    }
    setModalOpen(false);
  };

  const columns: ColumnsType<Accommodation> = [
    {
      title: 'Property',
      render: (_, r) => (
        <Space>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: `linear-gradient(135deg, ${TEAL}20, ${TEAL}40)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HomeOutlined style={{ color: TEAL }} />
          </div>
          <div>
            <Text strong style={{ fontSize: 13 }}>{r.name}</Text>
            <div><Text type="secondary" style={{ fontSize: 12 }}>{r.location}</Text></div>
          </div>
        </Space>
      ),
    },
    { title: 'Type', dataIndex: 'type', render: (v) => <Tag color="blue">{v}</Tag> },
    { title: 'Rating', dataIndex: 'rating', render: (v) => <Rate disabled defaultValue={v} style={{ fontSize: 12 }} /> },
    { title: 'Price/Night', dataIndex: 'pricePerNight', render: (v) => `₫${v.toLocaleString('vi-VN')}`, sorter: (a, b) => a.pricePerNight - b.pricePerNight },
    {
      title: 'Rooms',
      render: (_, r) => (
        <Text>
          <Text strong style={{ color: r.availableRooms === 0 ? '#ef4444' : TEAL }}>{r.availableRooms}</Text>
          <Text type="secondary"> / {r.totalRooms}</Text>
        </Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (s) => <Tag color={s === 'active' ? 'green' : 'red'}>{s.toUpperCase()}</Tag>,
      filters: [{ text: 'Active', value: 'active' }, { text: 'Inactive', value: 'inactive' }],
      onFilter: (v, r) => r.status === v,
    },
    {
      title: 'Actions',
      render: (_, r) => (
        <Space>
          <Tooltip title="Edit">
            <Button icon={<EditOutlined />} size="small" onClick={() => { setEditing(r); setModalOpen(true); }} />
          </Tooltip>
          <Popconfirm title="Delete this property?" onConfirm={() => handleDelete(r.id)} okButtonProps={{ danger: true }}>
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
      <Title level={4} style={{ marginBottom: 20, color: '#1a1a2e' }}>Accommodation Management</Title>

      <Card style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
          <Input
            placeholder="Search by name or location..."
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 340, borderRadius: 8 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => { setEditing(null); setModalOpen(true); }}
            style={{ background: TEAL, borderColor: TEAL, borderRadius: 8 }}
          >
            Add Accommodation
          </Button>
        </div>

        <Table columns={columns} dataSource={filtered} rowKey="id" pagination={{ pageSize: 10 }} style={{ fontSize: 13 }} />
      </Card>

      <AccommodationModal open={modalOpen} editing={editing} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />
    </div>
  );
};

export default AccommodationsPage;
