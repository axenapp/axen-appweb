import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import esES from 'antd/locale/es_ES';
import Login from './pages/auth/Login';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider locale={esES}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/partner/dashboard" element={<div style={{color:'white', padding:'40px', background:'#023048', minHeight:'100vh'}}>Dashboard — próximamente</div>} />
            <Route path="/" element={<div style={{color:'white', padding:'40px', background:'#023048', minHeight:'100vh'}}>Inicio — próximamente</div>} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;