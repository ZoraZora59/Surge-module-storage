import { Form, Input, Button, message, Spin, Result } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { createModule, updateModule, getModule } from '../api/modules';
import { ModuleFormData } from '../types/module';

const { TextArea } = Input;

export const ModuleForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm<ModuleFormData>();

  const { data: module, isLoading: isLoadingModule, error: moduleError } = useQuery({
    queryKey: ['module', id],
    queryFn: () => getModule(Number(id)),
    enabled: !!id,
    onSuccess(data) {
      if (data) {
        form.setFieldsValue(data);
      }
    },
    staleTime: 0,
    cacheTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  const createMutation = useMutation({
    mutationFn: createModule,
    onSuccess: () => {
      message.success('模块创建成功');
      navigate('/modules');
    },
    onError: (error) => {
      message.error('创建失败：' + error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values: ModuleFormData) => updateModule(Number(id), values),
    onSuccess: () => {
      message.success('模块更新成功');
      navigate('/modules');
    },
    onError: (error) => {
      message.error('更新失败：' + error);
    },
  });

  const onFinish = (values: ModuleFormData) => {
    if (id) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  };

  if (id && moduleError) {
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
    <div style={{
      padding: '0',
      maxWidth: '800px',
      margin: 'auto',
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      flexDirection: 'column',
      '@media (max-width: 768px)': {
        padding: '0',
        maxWidth: '100%',
      }
    }}>
      <h2 style={{
        marginBottom: '24px',
        '@media (max-width: 768px)': {
          fontSize: '1.5rem',
          marginBottom: '16px',
        }
      }}>{id ? '编辑模块' : '创建模块'}</h2>
      <Spin spinning={isLoadingModule}>
        {(id ? !!module : true) && (
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={module}
            style={{
              width: '100%',
              '@media (max-width: 768px)': {
                '.ant-form-item': {
                  marginBottom: '16px',
                },
                '.ant-form-item-label': {
                  padding: '0 0 4px',
                }
              }
            }}
          >
        <Form.Item
          name="name"
          label="模块名称"
          rules={[{ required: true, message: '请输入模块名称' }]}
        >
          <Input placeholder="请输入模块名称" />
        </Form.Item>

        <Form.Item
          name="category"
          label="分类"
          rules={[{ required: true, message: '请输入分类' }]}
        >
          <Input placeholder="请输入分类" />
        </Form.Item>

        <Form.Item
          name="description"
          label="描述"
          rules={[{ required: true, message: '请输入描述' }]}
        >
          <Input.TextArea placeholder="请输入描述" rows={4} />
        </Form.Item>

        <Form.Item
          name="content"
          label="模块内容"
          rules={[{ required: true, message: '请输入模块内容' }]}
        >
          <TextArea
            placeholder="请输入模块内容"
            rows={10}
            style={{ fontFamily: 'monospace' }}
          />
        </Form.Item>

        <Form.Item>
          <div style={{
            display: 'flex',
            gap: '16px',
            '@media (max-width: 768px)': {
              flexDirection: 'column',
              '.ant-btn': {
                width: '100%',
                marginLeft: '0 !important',
              }
            }
          }}>
            <Button type="primary" htmlType="submit" size="large">
              {id ? '更新' : '创建'}
            </Button>
            <Button
              style={{ marginLeft: '16px' }}
              onClick={() => navigate('/modules')}
              size="large"
            >
              取消
            </Button>
          </div>
        </Form.Item>
      </Form>
        )}
      </Spin>
    </div>
  );
};