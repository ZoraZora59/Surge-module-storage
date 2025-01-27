import { useQuery } from '@tanstack/react-query';
import { Button, Descriptions, Result, Spin, Typography } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { getModule } from '../api/modules';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export const ModuleDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: module, isLoading, error } = useQuery({
    queryKey: ['module', id],
    queryFn: () => getModule(Number(id)),
    enabled: !!id,
  });

  if (error) {
    return (
      <Result
        status="error"
        title="加载失败"
        subTitle="无法获取模块信息，请检查网络连接或稍后重试"
        extra={[
          <Button type="primary" key="back" onClick={() => navigate('/modules')}>
            返回列表
          </Button>
        ]}
      />
    );
  }

  return (
    <Spin spinning={isLoading}>
      <div style={{
        padding: '24px',
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        <Button
          icon={<ArrowLeftOutlined />}
          style={{ marginBottom: '16px' }}
          onClick={() => navigate('/modules')}
        >
          返回列表
        </Button>
        {module && (
          <>
            <div style={{
              marginBottom: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Title level={2} style={{ margin: 0 }}>{module.name}</Title>
              <Button type="primary" onClick={() => navigate(`/modules/${id}/edit`)}>
                编辑
              </Button>
            </div>

            <Descriptions bordered column={1}>
              <Descriptions.Item label="分类">{module.category}</Descriptions.Item>
              <Descriptions.Item label="描述">{module.description}</Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {new Date(module.create_time * 1000).toLocaleString('zh-CN', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false,
                  timeZone: 'Asia/Shanghai'
                })}
              </Descriptions.Item>
              <Descriptions.Item label="更新时间">
                {new Date(module.update_time * 1000).toLocaleString('zh-CN', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false,
                  timeZone: 'Asia/Shanghai'
                })}
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: '24px' }}>
              <Title level={4}>模块内容</Title>
              <Paragraph>
                <pre style={{
                  backgroundColor: '#f5f5f5',
                  padding: '16px',
                  borderRadius: '4px',
                  overflow: 'auto',
                  maxHeight: '400px',
                  fontFamily: 'monospace'
                }}>
                  {module.content}
                </pre>
              </Paragraph>
            </div>
          </>
        )}
      </div>
    </Spin>
  );
};