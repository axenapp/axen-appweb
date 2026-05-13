import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import esES from 'antd/locale/es_ES';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RegisterBusiness from './pages/auth/RegisterBusiness';
import Onboarding from './pages/partner/onboarding/Onboarding';
import Dashboard from './pages/partner/Dashboard';
import Turnos from './pages/partner/Turnos';
import Pagos from './pages/partner/Pagos';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider locale={esES}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register-business" element={<RegisterBusiness />} />
            <Route path="/partner/onboarding" element={<Onboarding />} />
            <Route path="/partner/dashboard" element={<Dashboard />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
            <Route path="/partner/turnos" element={<Turnos />} />
            <Route path="/partner/pagos" element={<Pagos />} />
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;