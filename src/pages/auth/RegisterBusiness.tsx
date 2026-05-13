import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import styles from './RegisterBusiness.module.css';

const TIPOS_NEGOCIO = [
  'Salud y bienestar',
  'Peluquería y estética',
  'Automotriz',
  'Veterinaria',
  'Educación',
  'Deporte y fitness',
  'Gastronomía',
  'Otro',
];

const MODALIDADES = [
  'Solo con turno',
  'Con y sin turno',
];

const NOTIFICACIONES = [
  'Email',
  'WhatsApp',
  'Ambos',
];

export default function RegisterBusiness() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    businessName: '',
    ownerName: user?.name || '',
    tipoNegocio: '',
    esLocal: 'si',
    modalidad: '',
    notificaciones: '',
    email: user?.email || '',
    phone: user?.phone || '',
    phoneLocal: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/partners', {
        name: form.businessName,
        description: '',
        cancelWindowHours: 2,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Error al registrar el negocio. Intentá de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <img src="/logo.svg" alt="Axen Negocios" className={styles.logo} />
          <div className={styles.headerRight}>
            <UserOutlined />
            <span>Mi Perfil</span>
          </div>
        </header>

        <main className={styles.hero}>
          <div className={styles.successCard}>
            <h2 className={styles.successTitle}>¡Bienvenido a Axen Negocios!</h2>
            <p className={styles.successBold}>Tu negocio fue creado correctamente.</p>
            <p className={styles.successText}>
              Ahora, te guiaremos para configurarlo paso a paso.<br />
              Completá los datos iniciales para empezar a recibir turnos y administrar tu negocio.
            </p>
            <button
              className={styles.btnPrimary}
              onClick={() => navigate('/partner/onboarding')}
            >
              Comenzar configuración
            </button>
          </div>
        </main>

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

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <img src="/logo.svg" alt="Axen Negocios" className={styles.logo} />
        <div className={styles.headerRight}>
          <UserOutlined />
          <span>Mi Perfil</span>
        </div>
      </header>

      <main className={styles.hero}>
        <div className={styles.formSide}>
          <p className={styles.tagline}>Comencemos un nuevo capítulo juntos</p>
          <p className={styles.tagline}>Donde vos hacés lo que más te gusta</p>
          <p className={styles.tagline}>Y nosotros hacemos todo lo demás</p>
        </div>

        <div className={styles.card}>
          <h1 className={styles.title}>¡Registrá tu negocio!</h1>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className={styles.field}>
              <input
                className={styles.input}
                type="text"
                name="businessName"
                value={form.businessName}
                onChange={handleChange}
                placeholder="Nombre del negocio*"
                required
              />
            </div>

            <div className={styles.field}>
              <input
                className={styles.input}
                type="text"
                name="ownerName"
                value={form.ownerName}
                onChange={handleChange}
                placeholder="Nombre del propietario*"
                required
              />
            </div>

            <div className={styles.field}>
              <Select
                className={styles.select}
                placeholder="Tipo de negocio*"
                onChange={(val) => setForm({ ...form, tipoNegocio: val })}
                options={TIPOS_NEGOCIO.map((t) => ({ value: t, label: t }))}
              />
            </div>

            <div className={styles.field}>
              <span className={styles.label}>¿Es un local a la calle?</span>
              <div className={styles.radioGroup}>
                <label className={styles.radio}>
                  <input
                    type="radio"
                    name="esLocal"
                    value="si"
                    checked={form.esLocal === 'si'}
                    onChange={handleChange}
                  />
                  <span>Sí</span>
                </label>
                <label className={styles.radio}>
                  <input
                    type="radio"
                    name="esLocal"
                    value="no"
                    checked={form.esLocal === 'no'}
                    onChange={handleChange}
                  />
                  <span>No</span>
                </label>
              </div>
            </div>

            <div className={styles.field}>
              <Select
                className={styles.select}
                placeholder="Modalidad de atención*"
                onChange={(val) => setForm({ ...form, modalidad: val })}
                options={MODALIDADES.map((m) => ({ value: m, label: m }))}
              />
            </div>

            <div className={styles.field}>
              <Select
                className={styles.select}
                placeholder="Recibir notificaciones por*"
                onChange={(val) => setForm({ ...form, notificaciones: val })}
                options={NOTIFICACIONES.map((n) => ({ value: n, label: n }))}
              />
            </div>

            <div className={styles.field}>
              <input
                className={styles.input}
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Correo electrónico*"
                required
              />
            </div>

            <div className={styles.field}>
              <input
                className={styles.input}
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Teléfono*"
              />
            </div>

            <div className={styles.field}>
              <input
                className={styles.input}
                type="tel"
                name="phoneLocal"
                value={form.phoneLocal}
                onChange={handleChange}
                placeholder="Teléfono del local*"
              />
            </div>

            <button
              type="submit"
              className={styles.btnPrimary}
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Comenzar'}
            </button>
          </form>
        </div>
      </main>

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