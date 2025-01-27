import { ReactNode } from 'react';
import { Layout as AntLayout, Menu, Input, Avatar, Button } from 'antd';
import { FileOutlined, StarOutlined, InboxOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = AntLayout;
const { Search } = Input;

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: 'files',
      icon: <FileOutlined />,
      label: '文件',
      onClick: () => navigate('/modules'),
    },
    {
      key: 'info',
      icon: <UserOutlined />,
      label: '信息',
      onClick: () => navigate('/info'),
    },
  ];

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider
        theme="light"
        style={{
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 1,
        }}
      >
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>Surge</h1>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname.split('/')[1] || 'files']}
          items={menuItems}
          style={{ border: 'none' }}
        />
      </Sider>
      <AntLayout>
        <Header
          style={{
            padding: '0 24px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Button type="primary" onClick={() => navigate('/modules/create')}>
              添加新模块
            </Button>
            <Avatar icon={<UserOutlined />} />
          </div>
        </Header>
        <Content
          style={{
            margin: '24px',
            padding: '24px',
            background: '#fff',
            borderRadius: '8px',
            minHeight: 280,
          }}
        >
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
};