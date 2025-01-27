import { useEffect, useState } from 'react';
import { Modal, Input, message } from 'antd';
import axios from 'axios';

interface TokenAuthProps {
  onAuthSuccess: () => void;
}

const TokenAuth: React.FC<TokenAuthProps> = ({ onAuthSuccess }) => {
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 检查是否已有存储的token
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      validateToken(storedToken);
    }
  }, []);

  const validateToken = async (tokenToValidate: string) => {
    setLoading(true);
    try {
      // 使用token调用模块列表接口进行验证
      await axios.get('/api/modules', {
        headers: {
          'X-API-Key': tokenToValidate,
          'X-Timestamp': Math.floor(Date.now() / 1000).toString()
        }
      });
      
      // 验证成功，保存token并关闭弹窗
      localStorage.setItem('auth_token', tokenToValidate);
      setIsModalVisible(false);
      onAuthSuccess();
      message.success('验证成功');
    } catch (error) {
      message.error('Token验证失败，请重试');
      localStorage.removeItem('auth_token');
    } finally {
      setLoading(false);
    }
  };

  const handleOk = () => {
    if (!token.trim()) {
      message.error('请输入Token');
      return;
    }
    validateToken(token);
  };

  return (
    <Modal
      title="请输入访问Token"
      open={isModalVisible}
      onOk={handleOk}
      onCancel={() => {}}
      closable={false}
      maskClosable={false}
      keyboard={false}
      confirmLoading={loading}
      cancelButtonProps={{ style: { display: 'none' } }}
    >
      <Input
        placeholder="请输入Token以访问系统"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        onPressEnter={handleOk}
      />
    </Modal>
  );
};

export default TokenAuth;