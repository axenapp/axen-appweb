import { useEffect, useState } from 'react';
import PartnerLayout from '../../components/layout/PartnerLayout';
import api from '../../services/api';
import styles from './Turnos.module.css';

const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

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

export default function Turnos() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today);
  const [bookings, setBookings] = useState<any[]>([]);
  const [partner, setPartner] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/partners/me').then(({ data }) => setPartner(data));
  }, []);

  useEffect(() => {
    if (!partner) return;
    setLoading(true);
    const dateStr = selectedDate.toISOString().split('T')[0];
    api.get(`/slots/partner/${partner.id}?date=${dateStr}`)
      .then(({ data }) => setBookings(data))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, [selectedDate, partner]);

  // Generar días del calendario
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const startDow = (firstDay.getDay() + 6) % 7; // lunes = 0
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

  return (
    <PartnerLayout>
      <div className={styles.page}>
        <div className={styles.pageTitle}>Agenda de Turnos</div>

        <div className={styles.layout}>
          {/* Calendario */}
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
                  onClick={() => !otherMonth && setSelectedDate(date)}
                >
                  {date.getDate()}
                </div>
              ))}
            </div>
          </div>

          {/* Agenda del día */}
          <div className={styles.card}>
            <div className={styles.agendaHeader}>
              <div className={styles.agendaDate}>
                {selectedDate.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </div>
              <div className={styles.agendaStats}>
                <div className={styles.agendaStat}>
                  <span>{confirmed}</span> confirmados
                </div>
                <div className={styles.agendaStat}>
                  <span>{pending}</span> pendientes
                </div>
                <div className={styles.agendaStat}>
                  <span>{free}</span> libres
                </div>
              </div>
            </div>

            {loading && <div className={styles.emptyState}>Cargando...</div>}

            {!loading && bookings.length === 0 && (
              <div className={styles.emptyState}>
                No hay turnos para este día
              </div>
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
      </div>
    </PartnerLayout>
  );
}