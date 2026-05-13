import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import styles from './Login.module.css';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (form.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });

      // Login automático tras el registro
      login(data.token, data.user);
      navigate('/register-business');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Error al crear la cuenta. Intentá de nuevo.'
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
          <h1 className={styles.title}>Registrate</h1>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.label}>Nombre(s) y Apellido(s)</label>
              <input
                className={styles.input}
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ej: María González"
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Correo electrónico</label>
              <input
                className={styles.input}
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Teléfono</label>
              <input
                className={styles.input}
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Ej: 1123456789"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Contraseña</label>
              <input
                className={styles.input}
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Mínimo 8 caracteres, una mayúscula y un número"
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Repetir contraseña</label>
              <input
                className={styles.input}
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className={styles.btnPrimary}
              disabled={loading}
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <div className={styles.links}>
            <Link to="/login" className={styles.linkText}>
              ¿Ya tenés cuenta? Ingresá
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