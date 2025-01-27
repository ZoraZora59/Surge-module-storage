import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { ModuleList } from './components/ModuleList';
import { ModuleForm } from './components/ModuleForm';
import { ModuleDetail } from './components/ModuleDetail';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import { UserInfo } from './components/UserInfo';
import TokenAuth from './components/TokenAuth';

const queryClient = new QueryClient();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 如果未认证，渲染TokenAuth组件
  if (!isAuthenticated) {
    return (
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <TokenAuth onAuthSuccess={() => setIsAuthenticated(true)} />
        </QueryClientProvider>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<ModuleList />} />
              <Route path="/modules" element={<ModuleList />} />
              <Route path="/modules/create" element={<ModuleForm />} />
              <Route path="/modules/:id" element={<ModuleDetail />} />
              <Route path="/modules/:id/edit" element={<ModuleForm />} />
              <Route path="/info" element={<UserInfo />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
