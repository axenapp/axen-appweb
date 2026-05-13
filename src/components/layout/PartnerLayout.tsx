import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  DashboardOutlined,
  CalendarOutlined,
  WalletOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Dropdown } from 'antd';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import styles from './PartnerLayout.module.css';

const navItems = [
  { path: '/partner/dashboard', label: 'Resumen', icon: <DashboardOutlined /> },
  { path: '/partner/turnos', label: 'Turnos', icon: <CalendarOutlined /> },
  { path: '/partner/pagos', label: 'Pagos', icon: <WalletOutlined /> },
  { path: '/partner/configuracion', label: 'Configuración', icon: <SettingOutlined /> },
];

export default function PartnerLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [businessName, setBusinessName] = useState('Mi negocio');

  useEffect(() => {
    api.get('/partners/me')
      .then(({ data }) => setBusinessName(data.name))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenu = {
    items: [
      { key: 'profile', label: 'Mi perfil', icon: <UserOutlined /> },
      { key: 'divider', type: 'divider' as const },
      { key: 'logout', label: 'Cerrar sesión', icon: <LogoutOutlined />, danger: true },
    ],
    onClick: ({ key }: { key: string }) => {
      if (key === 'logout') handleLogout();
    },
  };

  return (
    <div className={styles.layout}>
      {/* Header */}
      <header className={styles.header}>
        <img src="/logo.svg" alt="Axen Negocios" className={styles.logo} />
        <Dropdown menu={userMenu} placement="bottomRight">
          <div className={styles.headerRight}>
            <UserOutlined />
            <span>{user?.name || 'Mi Perfil'}</span>
          </div>
        </Dropdown>
      </header>

      <div className={styles.body}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <nav className={styles.sidebarNav}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.navItem} ${location.pathname === item.path ? styles.navItemActive : ''}`}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}

            <div className={styles.navDivider} />

            <Link
              to="/partner/ayuda"
              className={`${styles.navItem} ${location.pathname === '/partner/ayuda' ? styles.navItemActive : ''}`}
            >
              <span className={styles.navIcon}><QuestionCircleOutlined /></span>
              <span>Ayuda</span>
            </Link>
          </nav>

          <div className={styles.sidebarFooter}>
            <div className={styles.businessName}>
              {businessName}
              <div className={styles.businessStatus}>● Activo</div>
            </div>
          </div>
        </aside>

        {/* Contenido */}
        <main className={styles.main}>
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <span className={styles.footerLink}>Sobre Axen</span>
          <span className={styles.footerLink}>Términos y Condiciones</span>
          <span className={styles.footerLink}>Privacidad</span>
          <span className={styles.footerLink}>Atención al cliente</span>
        </div>
        <img src="/isotipo.svg" alt="Axen" className={styles.footerLogo} />
      </footer>
    </div>
  );
}