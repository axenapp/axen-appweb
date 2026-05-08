import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import styles from './Login.module.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.token, data.user);

      if (data.user.role === 'partner') {
        navigate('/partner/dashboard');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Error al iniciar sesión. Verificá tus datos.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <img src="/logo.svg" alt="Axen Negocios" className={styles.logo} />
        <div className={styles.headerRight}>
          <UserOutlined />
          <span>Mi Perfil</span>
        </div>
      </header>

      {/* Hero con fondo */}
      <main className={styles.hero}>
        <div className={styles.card}>
          <h1 className={styles.title}>Bienvenid@</h1>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.label}>Correo electrónico</label>
              <input
                className={styles.input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Contraseña</label>
              <input
                className={styles.input}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className={styles.btnPrimary}
              disabled={loading}
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <div className={styles.divider}>o continuá con</div>

          <div className={styles.socialButtons}>
            <button className={`${styles.btnSocial} ${styles.btnFacebook}`}>
              Facebook
            </button>
            <button className={`${styles.btnSocial} ${styles.btnGoogle}`}>
              Google
            </button>
          </div>

          <div className={styles.links}>
            <Link to="/register" className={styles.linkText}>
              Crear Cuenta
            </Link>
            <Link to="/register-business" className={styles.btnOutline}>
              Quiero registrar un negocio
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <span className={styles.footerLink}>Sobre Axen</span>
          <span className={styles.footerLink}>Términos y Condiciones</span>
          <span className={styles.footerLink}>Privacidad</span>
          <span className={styles.footerLink}>Registrá tu negocio</span>
          <span className={styles.footerLink}>Atención al cliente</span>
        </div>
        <img src="/isotipo.svg" alt="Axen" className={styles.footerLogo} />
      </footer>
    </div>
  );
}