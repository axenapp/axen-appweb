import { useEffect, useState } from 'react';
import PartnerLayout from '../../components/layout/PartnerLayout';
import api from '../../services/api';
import styles from './Turnos.module.css';

const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

type Vista = 'dia' | 'semana' | 'mes';

function getStatusClass(status: string) {
  switch (status) {
    case 'confirmed': return styles.slotCardConfirmed;
    case 'pending_payment': return styles.slotCardPending;
    case 'completed': return styles.slotCardCompleted;
    case 'cancelled': return styles.slotCardCancelled;
    default: return styles.slotCardFree;
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'confirmed': return { cls: styles.badgeConfirmed, label: 'Confirmado' };
    case 'pending_payment': return { cls: styles.badgePending, label: 'Pendiente pago' };
    case 'completed': return { cls: styles.badgeCompleted, label: 'Completado' };
    case 'cancelled': return { cls: styles.badgeCancelled, label: 'Cancelado' };
    default: return { cls: styles.badgeFree, label: 'Libre' };
  }
}

// Devuelve los 7 días de la semana que contiene la fecha (lunes a domingo)
function getWeekDays(date: Date): Date[] {
  const dow = (date.getDay() + 6) % 7;
  const monday = new Date(date);
  monday.setDate(date.getDate() - dow);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export default function Turnos() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today);
  const [vista, setVista] = useState<Vista>('dia');
  const [bookings, setBookings] = useState<any[]>([]);
  const [weekBookings, setWeekBookings] = useState<Record<string, any[]>>({});
  const [partner, setPartner] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [weekLoading, setWeekLoading] = useState(false);

  useEffect(() => {
    api.get('/partners/me').then(({ data }) => setPartner(data));
  }, []);

  // Carga slots del día seleccionado (vista diaria)
  useEffect(() => {
    if (!partner || vista !== 'dia') return;
    setLoading(true);
    const dateStr = selectedDate.toISOString().split('T')[0];
    api.get(`/slots/partner/${partner.id}?date=${dateStr}`)
      .then(({ data }) => setBookings(data))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, [selectedDate, partner, vista]);

  // Carga slots de los 7 días (vista semanal)
  useEffect(() => {
    if (!partner || vista !== 'semana') return;
    setWeekLoading(true);
    const weekDays = getWeekDays(selectedDate);
    Promise.all(
      weekDays.map(d => {
        const dateStr = d.toISOString().split('T')[0];
        return api.get(`/slots/partner/${partner.id}?date=${dateStr}`)
          .then(({ data }) => ({ dateStr, data }))
          .catch(() => ({ dateStr, data: [] }));
      })
    ).then(results => {
      const map: Record<string, any[]> = {};
      results.forEach(({ dateStr, data }) => { map[dateStr] = data; });
      setWeekBookings(map);
    }).finally(() => setWeekLoading(false));
  }, [selectedDate, partner, vista]);

  // Generar días del calendario mensual
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const startDow = (firstDay.getDay() + 6) % 7;
  const days = [];

  for (let i = 0; i < startDow; i++) {
    const d = new Date(currentYear, currentMonth, -startDow + i + 1);
    days.push({ date: d, otherMonth: true });
  }
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push({ date: new Date(currentYear, currentMonth, i), otherMonth: false });
  }
  while (days.length % 7 !== 0) {
    const last = days[days.length - 1].date;
    days.push({ date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1), otherMonth: true });
  }

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const isToday = (d: Date) =>
    d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();

  const isSelected = (d: Date) =>
    d.getDate() === selectedDate.getDate() && d.getMonth() === selectedDate.getMonth() && d.getFullYear() === selectedDate.getFullYear();

  const confirmed = bookings.filter(b => b.booking_status === 'confirmed').length;
  const pending = bookings.filter(b => b.booking_status === 'pending_payment').length;
  const free = bookings.filter(b => !b.booking_status || b.booking_status === 'free').length;

  // Calendario reutilizable (usado en vistas día y mes)
  const calendarioMensual = (
    <div className={styles.card}>
      <div className={styles.calendarHeader}>
        <button className={styles.navBtn} onClick={prevMonth}>‹</button>
        <div className={styles.calendarTitle}>
          {MESES[currentMonth]} {currentYear}
        </div>
        <button className={styles.navBtn} onClick={nextMonth}>›</button>
      </div>
      <div className={styles.calendarGrid}>
        {DIAS_SEMANA.map(d => (
          <div key={d} className={styles.dayLabel}>{d}</div>
        ))}
        {days.map(({ date, otherMonth }, i) => (
          <div
            key={i}
            className={`
              ${styles.dayCell}
              ${otherMonth ? styles.dayCellOtherMonth : ''}
              ${isToday(date) ? styles.dayCellToday : ''}
              ${isSelected(date) ? styles.dayCellSelected : ''}
            `}
            onClick={() => {
              if (!otherMonth) {
                setSelectedDate(date);
                if (vista === 'mes') setVista('dia');
              }
            }}
          >
            {date.getDate()}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <PartnerLayout>
      <div className={styles.page}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div className={styles.pageTitle}>Agenda de Turnos</div>

          {/* Toggle Día / Semana / Mes */}
          <div style={{ display: 'flex', gap: 8 }}>
            {(['dia', 'semana', 'mes'] as Vista[]).map(v => (
              <button key={v} onClick={() => setVista(v)} style={{
                padding: '6px 18px', borderRadius: 6,
                border: '1px solid #023048',
                background: vista === v ? '#023048' : 'transparent',
                color: vista === v ? 'white' : '#023048',
                fontWeight: 600, cursor: 'pointer',
              }}>
                {v === 'dia' ? 'Día' : v === 'semana' ? 'Semana' : 'Mes'}
              </button>
            ))}
          </div>
        </div>

        {/* Vista mensual — solo el calendario a pantalla completa */}
        {vista === 'mes' && (
          <div style={{ maxWidth: 480 }}>
            <p style={{ fontSize: 13, color: '#666', marginBottom: 12 }}>
              Tocá un día para ver su agenda detallada.
            </p>
            {calendarioMensual}
          </div>
        )}

        {/* Vista semanal — 7 columnas */}
        {vista === 'semana' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <button className={styles.navBtn} onClick={() => {
                const d = new Date(selectedDate);
                d.setDate(d.getDate() - 7);
                setSelectedDate(d);
              }}>‹</button>
              <span style={{ fontWeight: 600 }}>
                Semana del {getWeekDays(selectedDate)[0].toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })}
              </span>
              <button className={styles.navBtn} onClick={() => {
                const d = new Date(selectedDate);
                d.setDate(d.getDate() + 7);
                setSelectedDate(d);
              }}>›</button>
            </div>

            {weekLoading && <div className={styles.emptyState}>Cargando semana...</div>}

            {!weekLoading && (
              <div style={{ overflowX: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(130px, 1fr))', gap: 8 }}>
                  {getWeekDays(selectedDate).map((d, i) => {
                    const dateStr = d.toISOString().split('T')[0];
                    const slots = weekBookings[dateStr] || [];
                    const esHoy = isToday(d);
                    const confirmados = slots.filter(s => s.booking_status === 'confirmed').length;
                    return (
                      <div key={i} style={{
                        background: esHoy ? '#023048' : '#f5f5f5',
                        borderRadius: 8, padding: 10,
                        color: esHoy ? 'white' : '#333',
                      }}>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>{DIAS_SEMANA[i]}</div>
                        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>{d.getDate()}</div>
                        <div style={{ fontSize: 11, marginBottom: 8, opacity: 0.75 }}>
                          {slots.length} slots · {confirmados} confirmados
                        </div>
                        {slots.slice(0, 4).map((slot: any, j: number) => {
                          const hora = new Date(slot.datetime).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
                          const status = slot.booking_status || slot.status;
                          const badge = getStatusBadge(status);
                          return (
                            <div key={j} style={{
                              background: 'rgba(255,255,255,0.15)',
                              borderRadius: 4, padding: '4px 6px',
                              marginBottom: 4, fontSize: 11,
                            }}>
                              <div style={{ fontWeight: 600 }}>{hora}</div>
                              {status !== 'free' && slot.booking_status && (
                                <div style={{ opacity: 0.85 }}>{slot.u_name || 'Cliente'}</div>
                              )}
                              <span className={`${styles.slotBadge} ${badge.cls}`}>{badge.label}</span>
                            </div>
                          );
                        })}
                        {slots.length > 4 && (
                          <div style={{ fontSize: 11, opacity: 0.7 }}>+{slots.length - 4} más</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* Vista diaria — calendario + agenda */}
        {vista === 'dia' && (
          <div className={styles.layout}>
            {calendarioMensual}

            <div className={styles.card}>
              <div className={styles.agendaHeader}>
                <div className={styles.agendaDate}>
                  {selectedDate.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
                <div className={styles.agendaStats}>
                  <div className={styles.agendaStat}><span>{confirmed}</span> confirmados</div>
                  <div className={styles.agendaStat}><span>{pending}</span> pendientes</div>
                  <div className={styles.agendaStat}><span>{free}</span> libres</div>
                </div>
              </div>

              {loading && <div className={styles.emptyState}>Cargando...</div>}

              {!loading && bookings.length === 0 && (
                <div className={styles.emptyState}>No hay turnos para este día</div>
              )}

              {!loading && bookings.map((slot: any, i: number) => {
                const hora = new Date(slot.datetime).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
                const status = slot.booking_status || slot.status;
                const badge = getStatusBadge(status);
                return (
                  <div key={i} className={styles.slotRow}>
                    <div className={styles.slotHora}>{hora}</div>
                    {status === 'free' || !slot.booking_status ? (
                      <div className={styles.slotLibre}>Horario libre</div>
                    ) : (
                      <div className={`${styles.slotCard} ${getStatusClass(status)}`}>
                        <div className={styles.slotInfo}>
                          <div className={styles.slotCliente}>{slot.u_name || 'Cliente'}</div>
                          <div className={styles.slotServicio}>{slot.sv_name || slot.service_name || 'Servicio'}</div>
                        </div>
                        <span className={`${styles.slotBadge} ${badge.cls}`}>{badge.label}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </PartnerLayout>
  );
}
