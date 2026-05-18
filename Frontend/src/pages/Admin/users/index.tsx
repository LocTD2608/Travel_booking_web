import React, { useEffect, useState } from 'react';
import {
  Card, Table, Tag, Space, Button, Typography, Input,
  Select, Popconfirm, message, Spin, Alert, Modal, Form, Row, Col
} from 'antd';
import { SearchOutlined, UserDeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { getAllUsers, updateUser, deleteUser } from '../../../services/admin/users';

const { Title, Text } = Typography;
const { Option } = Select;

const roleColor: Record<string, string> = { ADMIN: 'red', USER: 'blue' };
const statusColor: Record<string, string> = { ACTIVE: 'green', INACTIVE: 'orange', BANNED: 'red' };

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editVisible, setEditVisible] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);
  const [form] = Form.useForm();

  const fetchUsers = () => {
    setLoading(true);
    getAllUsers()
      .then((res: any) => {
        const list = Array.isArray(res) ? res : res?.data ?? [];
        setUsers(list);
        setFiltered(list);
      })
      .catch(() => setError('Lỗi kết nối API /api/users. Cần token ADMIN.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (value: string) => {
    const keyword = value.toLowerCase();
    setFiltered(users.filter(u =>
      (u.Ho + ' ' + u.Ten).toLowerCase().includes(keyword) ||
      u.Email?.toLowerCase().includes(keyword)
    ));
  };

  const handleDeleteUser = async (id: string | number) => {
    try {
      await deleteUser(id);
      message.success('Đã xóa người dùng');
      fetchUsers();
    } catch {
      message.error('Xóa thất bại. Kiểm tra quyền ADMIN.');
    }
  };

  const openEdit = (user: any) => {
    setEditUser(user);
    form.setFieldsValue({
      Role: user.Role,
      TrangThai: user.TrangThai,
      TinhTrangXacMinh: user.TinhTrangXacMinh,
    });
    setEditVisible(true);
  };

  const handleSaveEdit = async () => {
    const values = await form.validateFields();
    try {
      await updateUser(editUser.UserID, values);
      message.success('Cập nhật thành công');
      setEditVisible(false);
      fetchUsers();
    } catch {
      message.error('Cập nhật thất bại');
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: 'ID',
      dataIndex: 'UserID',
      width: 60,
      render: (id) => <Text type="secondary">#{id}</Text>,
    },
    {
      title: 'Họ tên',
      render: (_, r) => <Text strong>{r.Ho} {r.Ten}</Text>,
    },
    {
      title: 'Email',
      dataIndex: 'Email',
      render: (e) => <Text>{e}</Text>,
    },
    {
      title: 'SĐT',
      dataIndex: 'SDT',
      render: (v) => v ?? '—',
    },
    {
      title: 'Role',
      dataIndex: 'Role',
      render: (v) => <Tag color={roleColor[v] ?? 'default'}>{v}</Tag>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'TrangThai',
      render: (v) => <Tag color={statusColor[v] ?? 'default'}>{v}</Tag>,
    },
    {
      title: 'Xác minh',
      dataIndex: 'TinhTrangXacMinh',
      render: (v) => <Tag color={v === 'VERIFIED' ? 'green' : 'orange'}>{v}</Tag>,
    },
    {
      title: 'Hành động',
      render: (_, r) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(r)}>Sửa</Button>
          <Popconfirm title="Xóa người dùng này?" onConfirm={() => handleDeleteUser(r.UserID)} okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}>
            <Button icon={<UserDeleteOutlined />} size="small" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>;
  if (error) return <Alert message="Lỗi API" description={error} type="error" showIcon />;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Title level={4} style={{ margin: 0 }}>Quản Lý Người Dùng ({users.length})</Title>
        <Space>
          <Input.Search placeholder="Tìm kiếm tên / email..." allowClear onSearch={handleSearch} style={{ width: 260 }} prefix={<SearchOutlined />} />
        </Space>
      </div>

      <Card style={{ borderRadius: 12 }}>
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="UserID"
          pagination={{ pageSize: 15, showSizeChanger: true, showTotal: (t) => `Tổng ${t} người dùng` }}
        />
      </Card>

      <Modal title="Chỉnh sửa người dùng" open={editVisible} onOk={handleSaveEdit} onCancel={() => setEditVisible(false)} okText="Lưu">
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Role" name="Role">
                <Select>
                  <Option value="USER">USER</Option>
                  <Option value="ADMIN">ADMIN</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Trạng thái" name="TrangThai">
                <Select>
                  <Option value="ACTIVE">ACTIVE</Option>
                  <Option value="INACTIVE">INACTIVE</Option>
                  <Option value="BANNED">BANNED</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Xác minh" name="TinhTrangXacMinh">
                <Select>
                  <Option value="VERIFIED">VERIFIED</Option>
                  <Option value="UNVERIFIED">UNVERIFIED</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default UsersPage;
