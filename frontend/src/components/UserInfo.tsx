import { Card, Descriptions, Typography } from 'antd';
import { UserOutlined, SettingOutlined, KeyOutlined } from '@ant-design/icons';

const { Title } = Typography;

export const UserInfo = () => {
  
  // 获取实际的环境变量信息
  const envInfo = {
    'API Token': localStorage.getItem('auth_token') || '未读取成功',
    'API 地址': localStorage.getItem('api_base_url') || window.location.origin,
  };
  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '24px auto',
      padding: '0 16px'
    }}>
      <Title level={2}>系统信息</Title>
      
      <Card
        title={<><UserOutlined /> 登录状态</>}
        style={{ marginBottom: '24px' }}
      >
        <Descriptions bordered column={1}>
          <Descriptions.Item label="状态">已登录</Descriptions.Item>
          <Descriptions.Item label="当前时间">{new Date().toLocaleString('zh-CN')}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card
        title={<><SettingOutlined /> 环境变量</>}
        style={{ marginBottom: '24px' }}
      >
        <Descriptions bordered column={1}>
          {Object.entries(envInfo).map(([key, value]) => (
            <Descriptions.Item key={key} label={key}>{value}</Descriptions.Item>
          ))}
        </Descriptions>
      </Card>
    </div>
  );
};