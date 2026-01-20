import React, { ReactNode, useState } from 'react';
import {
  Layout,
  Menu,
  Breadcrumb,
  theme,
  Avatar,
  Dropdown,
  Typography,
  Space,
  Card,
} from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  BookOutlined,
  CalendarOutlined,
  FileTextOutlined,
  BarChartOutlined,
  TeamOutlined,
  ScheduleOutlined,
  ProfileOutlined,
  LockOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const { Header, Sider, Content, Footer } = Layout;
const { Title } = Typography;

interface AdminLayoutProps {
  children: ReactNode;
}

type MenuItem = {
  key: string;
  icon: React.ReactNode;
  label: string;
  path?: string;
  children?: MenuItem[];
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Extract path segments for breadcrumb
  const pathSnippets = location.pathname.split('/').filter((i) => i);
  
  // Menu items configuration
  const menuItems: MenuItem[] = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      path: '/admin',
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      path: '/admin/profile',
    },
    {
      key: 'users',
      icon: <TeamOutlined />,
      label: 'User Management',
      path: '/admin/users',
    },
    {
      key: 'students',
      icon: <ProfileOutlined />,
      label: 'Student Records',
      path: '/admin/students',
    },
    {
      key: 'academic',
      icon: <BookOutlined />,
      label: 'Academic Management',
      children: [
        {
          key: 'academic-years',
          icon: <CalendarOutlined />,
          label: 'Academic Years',
          path: '/admin/academic-years',
        },
        {
          key: 'terms',
          icon: <ScheduleOutlined />,
          label: 'Terms',
          path: '/admin/terms',
        },
        {
          key: 'lessons',
          icon: <BookOutlined />,
          label: 'Lessons',
          path: '/admin/lessons',
        },
        {
          key: 'grades',
          icon: <FileTextOutlined />,
          label: 'Grades',
          path: '/admin/grades',
        },
      ],
    },
    {
      key: 'analytics',
      icon: <BarChartOutlined />,
      label: 'Analytics',
      path: '/admin/analytics',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'System Settings',
      path: '/admin/settings',
    },
  ];

  // Flatten menu items for breadcrumb generation
  const flattenMenuItems = (items: MenuItem[]): MenuItem[] => {
    return items.reduce<MenuItem[]>((acc, item) => {
      acc.push(item);
      if (item.children) {
        acc.push(...flattenMenuItems(item.children));
      }
      return acc;
    }, []);
  };

  const allMenuItems = flattenMenuItems(menuItems);

  // Find current menu item based on path
  const currentMenuItem = allMenuItems.find(
    (item) => item.path === location.pathname
  );

  // Generate breadcrumb items
  const breadcrumbItems = [
    { title: 'Admin' },
    ...(currentMenuItem
      ? [{ title: currentMenuItem.label }]
      : pathSnippets.map((snippet) => ({ title: snippet }))),
  ];

  // Handle menu click
  const handleMenuClick = (item: MenuItem) => {
    if (item.path) {
      navigate(item.path);
    }
  };

  // Recursive function to render menu items
  const renderMenuItems = (items: MenuItem[]): React.ReactNode => {
    return items.map((item) => {
      if (item.children) {
        return (
          <Menu.SubMenu
            key={item.key}
            icon={item.icon}
            title={item.label}
          >
            {renderMenuItems(item.children)}
          </Menu.SubMenu>
        );
      }
      return (
        <Menu.Item
          key={item.key}
          icon={item.icon}
          onClick={() => handleMenuClick(item)}
        >
          {item.label}
        </Menu.Item>
      );
    });
  };
  // User dropdown menu
  const userMenuItems = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <UserOutlined />,
      onClick: () => navigate('/admin/profile'),
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: <SettingOutlined />,
      onClick: () => navigate('/admin/settings'),
    },
    { type: 'divider' },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LockOutlined />,
      onClick: () => {
        // Handle logout logic here
        navigate('/login');
      },
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={250}
        style={{
          background: colorBgContainer,
          borderRight: '1px solid #f0f0f0',
        }}
      >
        <div style={{ padding: collapsed ? '16px 8px' : '16px 24px', textAlign: 'center' }}>
          <Title level={collapsed ? 5 : 4} style={{ margin: 0 }}>
            {collapsed ? 'AS' : 'Admin System'}
          </Title>
        </div>
        
        <Menu
          mode="inline"
          defaultSelectedKeys={[currentMenuItem?.key || 'dashboard']}
          defaultOpenKeys={['academic']}
          style={{ borderRight: 0 }}
        >
          {renderMenuItems(menuItems)}
        </Menu>
      </Sider>
      
      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Space>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
              style: { fontSize: '18px' },
            })}
            <Breadcrumb items={breadcrumbItems} />
          </Space>
          
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space style={{ cursor: 'pointer', padding: '8px 12px' }}>
              <Avatar icon={<UserOutlined />} />
              <span>Administrator</span>
            </Space>
          </Dropdown>
        </Header>
        
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
        
        <Footer style={{ textAlign: 'center' }}>
          Admin System ©{new Date().getFullYear()} - All rights reserved
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;