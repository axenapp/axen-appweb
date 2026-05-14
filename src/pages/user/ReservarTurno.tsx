import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, ClockCircleOutlined } from '@ant-design/icons';
import api from '../../services/api';
import styles from './ReservarTurno.module.css';

const METODOS_PAGO = ['Efectivo', 'Débito', 'MercadoPago'];

function getNextDays(n: number): string[] {
  const days = [];
  for (let i = 1; i <= n; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  return { dia: dias[d.getDay()], num: d.getDate() };
}

function formatHour(datetime: string) {
  return new Date(datetime).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
}

export default function ReservarTurno() {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState<any>(null);
  const [partner, setPartner] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const availableDates = getNextDays(7);
  const [selectedDate, setSelectedDate] = useState<string>(availableDates[0]);
  const [slots, setSlots] = useState<any[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  const [metodoPago, setMetodoPago] = useState<string>('Efectivo');
  const [notas, setNotas] = useState('');
  const [aceptoTerminos, setAceptoTerminos] = useState(false);

  // Cargar servicio y partner
  useEffect(() => {
    api.get(`/services/${serviceId}`)
      .then(({ data }) => {
        setService(data);
        return api.get(`/partners/${data.partnerId}`);
      })
      .then(({ data }) => setPartner(data))
      .catch(() => navigate(-1))
      .finally(() => setLoading(false));
  }, [serviceId]);

  // Cargar slots cuando cambia la fecha
  useEffect(() => {
    if (!serviceId || !selectedDate) return;
    setLoadingSlots(true);
    setSelectedSlot(null);
    api.get(`/slots/available?serviceId=${serviceId}&date=${selectedDate}`)
      .then(({ data }) => setSlots(data))
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [serviceId, selectedDate]);

  const canReserve = selectedSlot && aceptoTerminos;

  const handleReservar = () => {
    if (!canReserve) return;
    navigate('/confirmar-turno', {
      state: { service, partner, slot: selectedSlot, metodoPago, notas },
    });
  };

  if (loading) {
    return (
      <div className={styles.loadingPage}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (!service) return null;

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
        {/* Info del servicio */}
        <div className={styles.serviceHero}>
          <div className={styles.serviceHeroLeft}>
            <h1 className={styles.serviceName}>{service.name}</h1>
            {service.description && (
              <p className={styles.serviceDesc}>{service.description}</p>
            )}
            <div className={styles.serviceMeta}>
              <span><ClockCircleOutlined /> {service.durationMinutes} min</span>
            </div>
          </div>
          <div className={styles.serviceHeroRight}>
            <div className={styles.servicePrice}>${service.price.toLocaleString('es-AR')}</div>
            <div className={styles.negocioLogo}>🏪</div>
          </div>
        </div>

        {/* Selección de turno */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Elegí tu turno</h2>

          {/* Fechas */}
          <div className={styles.datesRow}>
            {availableDates.map(date => {
              const { dia, num } = formatDate(date);
              return (
                <button
                  key={date}
                  className={`${styles.dateChip} ${selectedDate === date ? styles.dateChipActive : ''}`}
                  onClick={() => setSelectedDate(date)}
                >
                  <span className={styles.dateDay}>{dia}</span>
                  <span className={styles.dateNum}>{num}</span>
                </button>
              );
            })}
          </div>

          {/* Horarios */}
          {loadingSlots ? (
            <div className={styles.slotsLoading}>Cargando horarios...</div>
          ) : slots.length === 0 ? (
            <div className={styles.emptySlots}>No hay turnos disponibles para este día.</div>
          ) : (
            <div className={styles.hoursRow}>
              {slots.map((slot: any) => (
                <button
                  key={slot.id}
                  className={`${styles.hourChip} ${selectedSlot?.id === slot.id ? styles.hourChipActive : ''}`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {formatHour(slot.datetime)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Método de pago */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Método de Pago</h2>
          <div className={styles.metodosRow}>
            {METODOS_PAGO.map(m => (
              <button
                key={m}
                className={`${styles.metodoChip} ${metodoPago === m ? styles.metodoChipActive : ''}`}
                onClick={() => setMetodoPago(m)}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Políticas */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Importante para este servicio</h2>
          <ul className={styles.policiesList}>
            <li>La duración estimada es de {service.durationMinutes} minutos.</li>
            <li>Se solicita llegar 10 minutos antes para garantizar la atención.</li>
            {partner?.cancelWindowHours && (
              <li>Podés reprogramar hasta {partner.cancelWindowHours} horas antes del horario reservado.</li>
            )}
            <li>En caso de retraso mayor a 15 minutos, el turno podrá cancelarse automáticamente.</li>
          </ul>
          <label className={styles.terminos}>
            <input
              type="checkbox"
              checked={aceptoTerminos}
              onChange={e => setAceptoTerminos(e.target.checked)}
            />
            <span>Acepto y me comprometo a asistir a mi turno</span>
          </label>
        </div>

        {/* Notas */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Notas para este servicio</h2>
          <p className={styles.notasHint}>El prestador lo tendrá en cuenta para tu turno.</p>
          <textarea
            className={styles.notasInput}
            placeholder="Escribí las instrucciones que necesites"
            value={notas}
            onChange={e => setNotas(e.target.value)}
            rows={3}
          />
        </div>

        {/* Botón */}
        <button
          className={`${styles.reservarBtn} ${!canReserve ? styles.reservarBtnDisabled : ''}`}
          onClick={handleReservar}
          disabled={!canReserve}
        >
          Reservar Turno
        </button>
      </main>
    </div>
  );
}
