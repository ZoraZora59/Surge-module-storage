import { useQuery } from '@tanstack/react-query';
import { Table, Space, Button, Input, Select, message, Result, Empty, Card, Row, Col } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined, UnorderedListOutlined, AppstoreOutlined, LinkOutlined } from '@ant-design/icons';
import { getModules, deleteModule, getSubscribeUrl } from '../api/modules';
import { Module } from '../types/module';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;
const { Option } = Select;

export const ModuleList = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const { data: modules = [], isLoading, error, refetch } = useQuery({
    queryKey: ['modules'],
    queryFn: getModules
  });

  const handleDelete = async (id: number) => {
    try {
      await deleteModule(id);
      message.success('模块删除成功');
      refetch();
    } catch (error) {
      message.error('删除失败：' + error);
    }
  };

  const filteredModules = modules.filter(module => {
    const matchesSearch = module.name.toLowerCase().includes(searchText.toLowerCase()) ||
      module.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = !categoryFilter || module.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(modules.map(m => m.category)));

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
      key: 'update_time',
      render: (text: number) => {
        if (!text) return '没找到时间';
        const date = new Date(text * 1000);
        return date.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: 'Asia/Shanghai'
        });
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Module) => (
        <Space size="middle">
          <Button
            icon={<EyeOutlined />}
            onClick={() => navigate(`/modules/${record.id}`)}
          >
            查看
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/modules/${record.id}/edit`)}
          >
            编辑
          </Button>
          <Button
            type="primary"
            icon={<LinkOutlined />}
            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            onClick={async () => {
              try {
                const url = await getSubscribeUrl(record.id);
                await navigator.clipboard.writeText(url);
                message.success('订阅链接已复制到剪贴板');
              } catch (error) {
                message.error('获取订阅链接失败：' + error);
              }
            }}
          >
            获取链接
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  if (error) {
    return (
      <Result
        status="error"
        title="加载失败"
        subTitle="无法获取模块列表，请检查网络连接或稍后重试"
        extra={[
          <Button type="primary" key="retry" onClick={() => refetch()}>
            重试
          </Button>
        ]}
      />
    );
  }

  return (
    <div style={{
      padding: '0',
      '@media (max-width: 768px)': {
        padding: '0'
      }
    }}>
      <div style={{
        marginBottom: '16px',
        display: 'flex',
        gap: '16px',
        '@media (max-width: 768px)': {
          flexDirection: 'column',
          gap: '12px'
        }
      }}>
        <Search
          placeholder="搜索模块名称或描述"
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            width: 300,
            '@media (max-width: 768px)': {
              width: '100%'
            }
          }}
        />
        <Select
          style={{
            width: 200,
            '@media (max-width: 768px)': {
              width: '100%'
            }
          }}
          placeholder="按分类筛选"
          allowClear
          onChange={(value) => setCategoryFilter(value)}
        >
          {categories.map(category => (
            <Option key={category} value={category}>{category}</Option>
          ))}
        </Select>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            type="text"
            icon={<UnorderedListOutlined />}
            onClick={() => setViewMode('list')}
          />
          <Button
            type="text"
            icon={<AppstoreOutlined />}
            onClick={() => setViewMode('grid')}
          />
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={filteredModules}
        rowKey="id"
        loading={isLoading}
        scroll={{ x: true }}
        pagination={{
          responsive: true,
          showSizeChanger: true,
          showQuickJumper: true
        }}
        locale={{
          emptyText: <Empty description="暂无数据" />
        }}
      />
    </div>
  );
};