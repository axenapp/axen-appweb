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
import Configuracion from './pages/partner/Configuracion';
import Ayuda from './pages/partner/Ayuda';
import Servicios from './pages/partner/Servicios';
import Home from './pages/user/Home';
import Negocio from './pages/user/Negocio';
import ReservarTurno from './pages/user/ReservarTurno';
import ConfirmarTurno from './pages/user/ConfirmarTurno';
import TurnoConfirmado from './pages/user/TurnoConfirmado';
import Resena from './pages/user/Resena';

import PrivateRoute from './components/common/PrivateRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider locale={esES}>
        <BrowserRouter>
          <Routes>
            {/* Públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register-business" element={<RegisterBusiness />} />

            {/* Vista usuario */}
            <Route path="/negocio/:id" element={<Negocio />} />
            <Route path="/reservar/:serviceId" element={<ReservarTurno />} />
            <Route path="/confirmar-turno" element={<ConfirmarTurno />} />
            <Route path="/turno-confirmado" element={<TurnoConfirmado />} />
            <Route path="/resena/:bookingId" element={<Resena />} />

            {/* Solo partners autenticados */}
            <Route path="/partner/onboarding" element={<PrivateRoute requirePartner><Onboarding /></PrivateRoute>} />
            <Route path="/partner/dashboard" element={<PrivateRoute requirePartner><Dashboard /></PrivateRoute>} />
            <Route path="/partner/turnos" element={<PrivateRoute requirePartner><Turnos /></PrivateRoute>} />
            <Route path="/partner/pagos" element={<PrivateRoute requirePartner><Pagos /></PrivateRoute>} />
            <Route path="/partner/configuracion" element={<PrivateRoute requirePartner><Configuracion /></PrivateRoute>} />
            <Route path="/partner/ayuda" element={<PrivateRoute requirePartner><Ayuda /></PrivateRoute>} />
            <Route path="/partner/servicios" element={<PrivateRoute requirePartner><Servicios /></PrivateRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
