import axios from 'axios';
import { Module, ModuleFormData } from '../types/module';

// 创建axios实例
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 添加请求拦截器，处理认证信息
api.interceptors.request.use((config) => {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  config.headers['X-Timestamp'] = timestamp;
  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error('未找到认证token');
  }
  config.headers['X-API-Key'] = token;
  return config;
});

// 添加响应拦截器，统一处理错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.message || error.message || '未知错误';
    if (error.response?.status === 401 && error.response?.data?.error === '时间戳已过期') {
      return Promise.reject('请求已过期，请重试');
    }
    return Promise.reject(errorMessage);
  }
);

// API函数
export const getModules = async (): Promise<Module[]> => {
  const response = await api.get('/modules');
  return response.data;
};

export const getModule = async (id: number): Promise<Module> => {
  const response = await api.get(`/modules/${id}`);
  return response.data;
};

export const createModule = async (module: ModuleFormData): Promise<Module> => {
  const response = await api.post('/modules', module);
  return response.data;
};

export const updateModule = async (id: number, module: ModuleFormData): Promise<Module> => {
  const response = await api.put(`/modules/${id}`, module);
  return response.data;
};

export const deleteModule = async (id: number): Promise<void> => {
  await api.delete(`/modules/${id}`);
};

export const getSubscribeUrl = (id: number): string => {
  // 获取当前域名
  const host = window.location.origin;
  return `${host}/subscribe/modules/${id}`;
};