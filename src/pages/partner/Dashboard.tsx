import { useEffect, useState } from 'react';
import {
  CalendarOutlined,
  RiseOutlined,
  StarOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { Rate } from 'antd';
import PartnerLayout from '../../components/layout/PartnerLayout';
import api from '../../services/api';
import styles from './Dashboard.module.css';

interface DashboardData {
  today: { bookings: number };
  month: { bookings: number; revenue: number };
  rating: { average: number; total: number };
  recentBookings: any[];
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/partners/dashboard')
      .then(({ data }) => setData(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    {
      label: 'Turnos hoy',
      value: data?.today.bookings ?? 0,
      icon: <CalendarOutlined />,
      sub: 'confirmados',
    },
    {
      label: 'Turnos este mes',
      value: data?.month.bookings ?? 0,
      icon: <RiseOutlined />,
      sub: 'confirmados y completados',
    },
    {
      label: 'Ingresos del mes',
      value: `$${(data?.month.revenue ?? 0).toLocaleString('es-AR')}`,
      icon: <DollarOutlined />,
      sub: 'facturado',
    },
    {
      label: 'Calificación',
      value: (data?.rating.average ?? 0).toFixed(1),
      icon: <StarOutlined />,
      sub: `${data?.rating.total ?? 0} reseñas`,
    },
  ];

  return (
    <PartnerLayout>
      <div className={styles.page}>
        <div>
          <div className={styles.pageTitle}>Panel de control</div>
          <div className={styles.pageSubtitle}>
            {new Date().toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Tarjetas de métricas */}
        <div className={styles.statsGrid}>
          {stats.map((s, i) => (
            <div key={i} className={styles.statCard}>
              <div className={styles.statIcon}>{s.icon}</div>
              <div className={styles.statLabel}>{s.label}</div>
              <div className={styles.statValue}>{s.value}</div>
              <div className={styles.statSub}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div className={styles.row}>
          {/* Próximos turnos */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              Próximos turnos
              <span style={{ fontSize: 12, color: '#aaa', fontWeight: 400 }}>hoy</span>
            </div>
            {loading && <div className={styles.loading}>Cargando...</div>}
            {!loading && (!data?.recentBookings?.length) && (
              <div className={styles.emptyState}>No hay turnos próximos</div>
            )}
            {data?.recentBookings?.map((b: any, i: number) => (
              <div key={i} className={styles.turnoItem}>
                <div className={styles.turnoInfo}>
                  <div className={styles.turnoNombre}>{b.u_name || 'Cliente'}</div>
                  <div className={styles.turnoServicio}>{b.sv_name || 'Servicio'}</div>
                </div>
                <div className={styles.turnoHora}>
                  {b.s_datetime
                    ? new Date(b.s_datetime).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
                    : '--:--'}
                </div>
              </div>
            ))}
          </div>

          {/* Calificación */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>Calificación del negocio</div>
            <div className={styles.ratingRow}>
              <div className={styles.ratingValue}>
                {(data?.rating.average ?? 0).toFixed(1)}
              </div>
              <div>
                <Rate disabled allowHalf value={data?.rating.average ?? 0} />
                <div className={styles.ratingTotal}>{data?.rating.total ?? 0} reseñas recibidas</div>
              </div>
            </div>

            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className={styles.barRow}>
                <span style={{ minWidth: 16 }}>{star}★</span>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${data?.rating.total ? Math.random() * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PartnerLayout>
  );
}