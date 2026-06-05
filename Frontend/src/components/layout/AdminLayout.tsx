import React, { useState } from 'react';
import { Layout, Menu, Avatar, Typography, Badge, Dropdown, Space } from 'antd';
import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  BookOutlined,
  HomeOutlined,
  ApartmentOutlined,
  StopOutlined,
  LogoutOutlined,
  BellOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

// ─── Design Tokens ────────────────────────────────────────────────────────────
const TEAL = '#00C2A0';
const DARK_BG = '#0d1b2a';
const DARK_BG_LIGHT = '#1a2d40';
const SIDEBAR_WIDTH = 240;
const SIDEBAR_COLLAPSED_WIDTH = 72;

// ─── Menu Items ───────────────────────────────────────────────────────────────
const menuItems: MenuProps['items'] = [
  {
    key: '/admin/dashboard',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
  },
  {
    key: '/admin/flights',
    icon: <ApartmentOutlined />,
    label: 'Flights Management',
  },
  {
    key: '/admin/accommodations',
    icon: <HomeOutlined />,
    label: 'Accommodations',
  },
  {
    key: '/admin/bookings',
    icon: <BookOutlined />,
    label: 'Bookings',
  },
  {
    key: '/admin/cancellations',
    icon: <StopOutlined />,
    label: 'Cancellations',
  },
  {
    key: '/admin/users',
    icon: <UserOutlined />,
    label: 'Users',
  },
];

// ─── Admin Layout ─────────────────────────────────────────────────────────────
const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key);
  };

  const handleUserDropdown: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      logout();
      navigate('/login');
    }
  };

  const userDropdownItems: MenuProps['items'] = [
    { key: 'settings', icon: <SettingOutlined />, label: 'Settings' },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', danger: true },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* ── Sidebar ───────────────────────────────────────────────────────── */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={SIDEBAR_WIDTH}
        collapsedWidth={SIDEBAR_COLLAPSED_WIDTH}
        trigger={null}
        style={{
          background: DARK_BG,
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
          overflow: 'auto',
          boxShadow: '2px 0 12px rgba(0,0,0,0.25)',
        }}
      >
        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? 0 : '0 20px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            gap: 10,
            transition: 'all 0.3s',
            cursor: 'pointer'
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: `linear-gradient(135deg, ${TEAL}, #00a884)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 20 }}>flight_takeoff</span>
          </div>
          {!collapsed && (
            <Text style={{ color: '#fff', fontWeight: 700, fontSize: 17, letterSpacing: '-0.3px' }}>
              Booking Travel
            </Text>
          )}
        </div>

        {/* Navigation Menu */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{
            background: 'transparent',
            border: 'none',
            marginTop: 8,
          }}
        />

        {/* Collapse Toggle */}
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            onClick={() => setCollapsed(!collapsed)}
            style={{
              cursor: 'pointer',
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255,255,255,0.6)',
              transition: 'all 0.2s',
            }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>
        </div>
      </Sider>

      {/* ── Main Area ─────────────────────────────────────────────────────── */}
      <Layout
        style={{
          marginLeft: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
          transition: 'margin-left 0.3s',
        }}
      >
        {/* Header */}
        <Header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 99,
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 8px rgba(0,0,0,0.08)',
            height: 64,
          }}
        >
          {/* Page title area — left side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e' }}>
              {getPageTitle(location.pathname)}
            </Text>
          </div>

          {/* Right side actions */}
          <Space size={16} align="center">
            <Badge count={3} size="small">
              <BellOutlined style={{ fontSize: 18, color: '#64748b', cursor: 'pointer' }} />
            </Badge>
            <Dropdown
              menu={{ items: userDropdownItems, onClick: handleUserDropdown }}
              placement="bottomRight"
              arrow
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar
                  size={34}
                  style={{ background: `linear-gradient(135deg, ${TEAL}, #00a884)`, fontWeight: 700 }}
                >
                  {user?.Ten?.[0] || 'A'}
                </Avatar>
                {!collapsed && (
                  <div style={{ lineHeight: 1.2 }}>
                    <Text style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', display: 'block' }}>
                      {user ? `${user.Ho} ${user.Ten}` : 'Admin'}
                    </Text>
                    <Text style={{ fontSize: 11, color: '#94a3b8' }}>Administrator</Text>
                  </div>
                )}
              </Space>
            </Dropdown>
          </Space>
        </Header>

        {/* Page Content */}
        <Content
          style={{
            padding: 24,
            background: '#f5f7fa',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

function getPageTitle(pathname: string): string {
  const map: Record<string, string> = {
    '/admin/dashboard': 'Overview Analytics',
    '/admin/flights': 'Flights Management',
    '/admin/accommodations': 'Accommodation Management',
    '/admin/bookings': 'Bookings Management',
    '/admin/cancellations': 'Cancellation Requests',
    '/admin/users': 'Users Management',
  };
  return map[pathname] ?? 'Admin Panel';
}

export default AdminLayout;