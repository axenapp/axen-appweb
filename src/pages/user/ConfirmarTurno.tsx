import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useState } from 'react';
import api from '../../services/api';
import styles from './ConfirmarTurno.module.css';

function formatFecha(datetime: string) {
  return new Date(datetime).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatHora(datetime: string) {
  return new Date(datetime).toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ConfirmarTurno() {
  const location = useLocation();
  const navigate = useNavigate();
  const { service, partner, slot, metodoPago, notas } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!service || !slot) {
    navigate('/');
    return null;
  }

  const handleConfirmar = async () => {
    setLoading(true);
    setError('');
    try {
      await api.post('/bookings', {
  slotId: slot.id,
  serviceId: service.id,
    });
  
      navigate('/turno-confirmado', { replace: true });
    } catch (e: any) {
      setError(e.response?.data?.message || 'Error al confirmar el turno. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeftOutlined />
        </button>
        <img src="/logo.svg" alt="Axen" className={styles.logo} onClick={() => navigate('/')} />
        <div style={{ width: 36 }} />
      </header>

      <main className={styles.main}>
        <h1 className={styles.title}>Confirmación de turno</h1>

        {/* Logo negocio */}
        <div className={styles.negocioLogoWrap}>
          <div className={styles.negocioLogo}>🏪</div>
          <div className={styles.negocioName}>{partner?.name}</div>
        </div>

        {/* Resumen */}
        <div className={styles.resumenCard}>
          <div className={styles.resumenRow}>
            <span className={styles.resumenLabel}>Servicio</span>
            <span className={styles.resumenValue}>{service.name}</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.resumenRow}>
            <span className={styles.resumenLabel}>Fecha</span>
            <span className={styles.resumenValue}>{formatFecha(slot.datetime)}</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.resumenRow}>
            <span className={styles.resumenLabel}>Horario</span>
            <span className={styles.resumenValue}>{formatHora(slot.datetime)}</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.resumenRow}>
            <span className={styles.resumenLabel}>Duración estimada</span>
            <span className={styles.resumenValue}>{service.durationMinutes} minutos</span>
          </div>
          {partner?.address && (
            <>
              <div className={styles.divider} />
              <div className={styles.resumenRow}>
                <span className={styles.resumenLabel}>Dirección</span>
                <span className={styles.resumenValue}>{partner.address}</span>
              </div>
            </>
          )}
          <div className={styles.divider} />
          <div className={styles.resumenRow}>
            <span className={styles.resumenLabel}>Monto Total</span>
            <span className={`${styles.resumenValue} ${styles.resumenMonto}`}>
              ${service.price.toLocaleString('es-AR')}
            </span>
          </div>
          <div className={styles.divider} />
          <div className={styles.resumenRow}>
            <span className={styles.resumenLabel}>Método de Pago</span>
            <span className={styles.resumenValue}>{metodoPago}</span>
          </div>
          {notas && (
            <>
              <div className={styles.divider} />
              <div className={styles.resumenRow}>
                <span className={styles.resumenLabel}>Notas para el negocio</span>
                <span className={styles.resumenValue}>{notas}</span>
              </div>
            </>
          )}
        </div>

        {/* Aviso */}
        <div className={styles.aviso}>
          <p>Recordá llegar 10 minutos antes de tu turno.</p>
          <p>Si necesitás modificar o cancelar, podés hacerlo desde <strong>Mis Turnos</strong>.</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button
          className={styles.confirmarBtn}
          onClick={handleConfirmar}
          disabled={loading}
        >
          {loading ? 'Confirmando...' : 'Confirmar Turno'}
        </button>
      </main>
    </div>
  );
}
