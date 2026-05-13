import { useEffect, useState } from 'react';
import PartnerLayout from '../../components/layout/PartnerLayout';
import api from '../../services/api';
import styles from './Pagos.module.css';

const LEGEND_COLORS = [
  'var(--color-primary)',
  'var(--color-secondary)',
  'var(--color-accent)',
  '#ffb347',
  '#a8d8a8',
];

const FILTERS = ['Todos', 'Aprobados', 'Pendientes', 'Rechazados'];

export default function Pagos() {
  const [payments, setPayments] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Todos');

  useEffect(() => {
    api.get('/bookings/partner')
      .then(({ data }) => setBookings(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalIngresos = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + parseFloat(b.service?.price || 0), 0);

  const totalConfirmados = bookings.filter(b => b.status === 'confirmed' || b.status === 'completed').length;
  const totalPendientes = bookings.filter(b => b.status === 'pending_payment').length;

  // Agrupar ingresos por servicio para el gráfico
  const porServicio: Record<string, number> = {};
  bookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .forEach(b => {
      const nombre = b.service?.name || 'Servicio';
      porServicio[nombre] = (porServicio[nombre] || 0) + parseFloat(b.service?.price || 0);
    });
  const serviciosData = Object.entries(porServicio);

  const filteredBookings = bookings.filter(b => {
    if (filter === 'Aprobados') return b.status === 'confirmed' || b.status === 'completed';
    if (filter === 'Pendientes') return b.status === 'pending_payment';
    if (filter === 'Rechazados') return b.status === 'cancelled' || b.status === 'failed';
    return true;
  });

  const getBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed': return { cls: styles.badgeApproved, label: 'Aprobado' };
      case 'pending_payment': return { cls: styles.badgePending, label: 'Pendiente' };
      default: return { cls: styles.badgeRejected, label: 'Rechazado' };
    }
  };

  return (
    <PartnerLayout>
      <div className={styles.page}>
        <div className={styles.pageTitle}>Pagos</div>

        {/* Banner MercadoPago */}
        <div className={styles.mpBanner}>
          <div>
            <div className={styles.mpBannerText}>Conectá tu cuenta de MercadoPago</div>
            <div className={styles.mpBannerSub}>Recibí pagos online y gestioná cobros automáticamente</div>
          </div>
          <button className={styles.mpBtn}>Conectar MP</button>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Ingresos totales</div>
            <div className={styles.statValue}>${totalIngresos.toLocaleString('es-AR')}</div>
            <div className={styles.statSub}>confirmados y completados</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Reservas pagas</div>
            <div className={styles.statValue}>{totalConfirmados}</div>
            <div className={styles.statSub}>confirmadas</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Pendientes de pago</div>
            <div className={styles.statValue}>{totalPendientes}</div>
            <div className={styles.statSub}>esperando confirmación</div>
          </div>
        </div>

        <div className={styles.layout}>
          {/* Tabla de transacciones */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>Historial de reservas</div>

            <div className={styles.filters}>
              {FILTERS.map(f => (
                <button key={f}
                  className={`${styles.filterBtn} ${filter === f ? styles.filterBtnActive : ''}`}
                  onClick={() => setFilter(f)}>
                  {f}
                </button>
              ))}
            </div>

            {loading && <div className={styles.emptyState}>Cargando...</div>}
            {!loading && filteredBookings.length === 0 && (
              <div className={styles.emptyState}>No hay registros</div>
            )}
            {!loading && filteredBookings.length > 0 && (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Servicio</th>
                    <th>Fecha</th>
                    <th>Monto</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((b, i) => {
                    const badge = getBadge(b.status);
                    return (
                      <tr key={i}>
                        <td>{b.user?.name || 'Cliente'}</td>
                        <td>{b.service?.name || 'Servicio'}</td>
                        <td>{b.slot?.datetime
                          ? new Date(b.slot.datetime).toLocaleDateString('es-AR')
                          : '—'}</td>
                        <td>${parseFloat(b.service?.price || 0).toLocaleString('es-AR')}</td>
                        <td><span className={`${styles.badge} ${badge.cls}`}>{badge.label}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Gráfico por servicio */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>Ingresos por servicio</div>
            <div className={styles.donutWrapper}>
              <div className={styles.donutPlaceholder}>
                <div className={styles.donutHole}>
                  <div className={styles.donutTotal}>${totalIngresos.toLocaleString('es-AR')}</div>
                  <div className={styles.donutLabel}>total</div>
                </div>
              </div>
              {serviciosData.length === 0 && (
                <div className={styles.emptyState}>Sin datos aún</div>
              )}
              {serviciosData.map(([nombre, monto], i) => (
                <div key={i} className={styles.legendItem}>
                  <div className={styles.legendDot} style={{ background: LEGEND_COLORS[i % LEGEND_COLORS.length] }} />
                  <span>{nombre}</span>
                  <span className={styles.legendAmount}>${monto.toLocaleString('es-AR')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PartnerLayout>
  );
}