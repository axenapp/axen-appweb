import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, CheckOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { Select, Modal, Input } from 'antd';
import api from '../../../services/api';
import styles from './Onboarding.module.css';

const TIPOS_NEGOCIO = [
  'Salud y bienestar', 'Peluquería y estética', 'Automotriz',
  'Veterinaria', 'Educación', 'Deporte y fitness', 'Gastronomía', 'Otro',
];

const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const HORARIOS = [
  '8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00',
];

const MEDIOS_PAGO = ['Efectivo', 'Tarjeta de débito', 'Tarjeta de crédito', 'Transferencia bancaria', 'MercadoPago'];

interface Servicio {
  name: string;
  durationMinutes: number;
  price: number;
}

// ── Stepper ────────────────────────────────────────────────────────────
function Stepper({ step }: { step: number }) {
  const pasos = ['Datos del negocio', 'Métodos de pago', 'Identidad', 'Agenda'];
  return (
    <div className={styles.stepperBar}>
      <div className={styles.stepperTitle}>Configuración paso a paso</div>
      <div className={styles.steps}>
        {pasos.map((label, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <div className={styles.stepItem}>
              <div className={`${styles.stepCircle} ${i + 1 < step ? styles.stepCircleDone : i + 1 === step ? styles.stepCircleActive : ''}`}>
                {i + 1 < step ? <CheckOutlined /> : i + 1}
              </div>
              <span className={`${styles.stepLabel} ${i + 1 === step ? styles.stepLabelActive : ''}`}>{label}</span>
            </div>
            {i < pasos.length - 1 && (
              <div className={`${styles.stepLine} ${i + 1 < step ? styles.stepLineDone : ''}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Paso 1: Datos del negocio ──────────────────────────────────────────
function Paso1({ onNext }: { onNext: (data: any) => void }) {
  const [form, setForm] = useState({
    name: '', description: '', address: '',
    tipo: '', apertura: '09:00', cierre: '18:00', dobleTurno: false,
  });
  const [diasSeleccionados, setDias] = useState<string[]>(['Lun', 'Mar', 'Mié', 'Jue', 'Vie']);
  const [error, setError] = useState('');

  const toggleDia = (dia: string) => {
    setDias(prev => prev.includes(dia) ? prev.filter(d => d !== dia) : [...prev, dia]);
  };

  const handleSubmit = () => {
    if (!form.name || !form.address || !form.tipo) {
      setError('Completá los campos obligatorios');
      return;
    }
    onNext({ ...form, dias: diasSeleccionados });
  };

  return (
    <>
      <h2 className={styles.title}>Datos del negocio</h2>
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.field}>
        <label className={styles.label}>Nombre del negocio*</label>
        <input className={styles.input} value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })} />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Descripción</label>
        <textarea className={styles.textarea} value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })} />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Dirección del negocio*</label>
        <input className={styles.input} value={form.address}
          onChange={e => setForm({ ...form, address: e.target.value })} />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Días de atención*</label>
        <div className={styles.diasGroup}>
          {DIAS.map(dia => (
            <button key={dia} type="button"
              className={`${styles.diaBtn} ${diasSeleccionados.includes(dia) ? styles.diaBtnActive : ''}`}
              onClick={() => toggleDia(dia)}>
              {dia}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.horarioRow}>
        <div className={styles.horarioCol}>
          <label className={styles.label}>Horario de apertura</label>
          <input className={styles.input} type="time" value={form.apertura}
            onChange={e => setForm({ ...form, apertura: e.target.value })} />
        </div>
        <div className={styles.horarioCol}>
          <label className={styles.label}>Horario de cierre</label>
          <input className={styles.input} type="time" value={form.cierre}
            onChange={e => setForm({ ...form, cierre: e.target.value })} />
        </div>
      </div>

      <div className={styles.field} style={{ marginTop: 12 }}>
        <label className={styles.checkboxItem}>
          <input type="checkbox" checked={form.dobleTurno}
            onChange={e => setForm({ ...form, dobleTurno: e.target.checked })} />
          Doble turno (mañana y tarde)
        </label>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Tipo de negocio*</label>
        <Select className={styles.select} placeholder="Seleccioná un tipo"
          value={form.tipo || undefined}
          onChange={val => setForm({ ...form, tipo: val })}
          options={TIPOS_NEGOCIO.map(t => ({ value: t, label: t }))} />
      </div>

      <div className={styles.actions}>
        <div />
        <button className={styles.btnNext} onClick={handleSubmit}>
          Guardar y continuar
        </button>
      </div>
    </>
  );
}

// ── Paso 2: Métodos de pago ────────────────────────────────────────────
function Paso2({ onNext, onBack }: { onNext: (data: any) => void; onBack: () => void }) {
  const [medios, setMedios] = useState<string[]>([]);
  const [otroMedio, setOtroMedio] = useState('');
  const [banco, setBanco] = useState({ titular: '', cuit: '', tipoCuenta: '', banco: '', cbu: '' });
  const [prefs, setPrefs] = useState({ seña: false, montoSeña: '', pagoTotal: false, pagoLocal: false });
  const [terminos, setTerminos] = useState({ titular: false, tyc: false, datos: false });

  const toggleMedio = (m: string) => {
    setMedios(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
  };

  return (
    <>
      <h2 className={styles.title}>Métodos de pago</h2>

      <div className={styles.field}>
        <label className={styles.label}>Elegí los medios de pago que vas a aceptar en tu negocio</label>
        <div className={styles.checkboxRow} style={{ marginTop: 10 }}>
          {MEDIOS_PAGO.map(m => (
            <label key={m} className={styles.checkboxItemInline}>
              <input type="checkbox" checked={medios.includes(m)} onChange={() => toggleMedio(m)} />
              {m}
            </label>
          ))}
        </div>
        <div style={{ marginTop: 10 }}>
          <label className={styles.label}>Otro medio (especificar):</label>
          <input className={styles.input} style={{ maxWidth: 260 }} value={otroMedio}
            onChange={e => setOtroMedio(e.target.value)} />
        </div>
      </div>

      <div className={styles.sectionTitle}>Datos bancarios del titular</div>
      <div className={styles.sectionSubtitle}>*Usaremos estos datos solo para transferirte cobros. No compartimos esta información con tus clientes.</div>

      {[
        { label: 'Nombre y apellido del titular:', key: 'titular' },
        { label: 'CUIT/CUIL:', key: 'cuit' },
        { label: 'Tipo de cuenta:', key: 'tipoCuenta' },
        { label: 'Banco:', key: 'banco' },
        { label: 'CBU:', key: 'cbu' },
      ].map(({ label, key }) => (
        <div key={key} className={styles.inputRow}>
          <span className={styles.inputLabel}>{label}</span>
          <input className={styles.input} value={banco[key as keyof typeof banco]}
            onChange={e => setBanco({ ...banco, [key]: e.target.value })} />
        </div>
      ))}

      <div className={styles.sectionTitle}>Preferencias de pago</div>
      <div className={styles.checkboxRow} style={{ marginTop: 12 }}>
        <label className={styles.checkboxItemInline}>
          <input type="checkbox" checked={prefs.seña}
            onChange={e => setPrefs({ ...prefs, seña: e.target.checked })} />
          Requerir seña para confirmar turno:
          <input className={styles.input} style={{ width: 80, marginLeft: 8 }}
            disabled={!prefs.seña} value={prefs.montoSeña}
            onChange={e => setPrefs({ ...prefs, montoSeña: e.target.value })} />
        </label>
        <label className={styles.checkboxItemInline}>
          <input type="checkbox" checked={prefs.pagoTotal}
            onChange={e => setPrefs({ ...prefs, pagoTotal: e.target.checked })} />
          Permitir pago total anticipado
        </label>
        <label className={styles.checkboxItemInline}>
          <input type="checkbox" checked={prefs.pagoLocal}
            onChange={e => setPrefs({ ...prefs, pagoLocal: e.target.checked })} />
          Permitir pago en el local
        </label>
      </div>

      <div className={styles.checkboxGroup} style={{ marginTop: 24 }}>
        <label className={styles.checkboxItem}>
          <input type="checkbox" checked={terminos.titular}
            onChange={e => setTerminos({ ...terminos, titular: e.target.checked })} />
          Declaro que soy titular de la cuenta informada
        </label>
        <label className={styles.checkboxItem}>
          <input type="checkbox" checked={terminos.tyc}
            onChange={e => setTerminos({ ...terminos, tyc: e.target.checked })} />
          Acepto los Términos y Condiciones y la Política de Privacidad
        </label>
        <label className={styles.checkboxItem}>
          <input type="checkbox" checked={terminos.datos}
            onChange={e => setTerminos({ ...terminos, datos: e.target.checked })} />
          Autorizo el uso de mis datos para procesar pagos y cobros de turnos
        </label>
      </div>

      <div className={styles.actions}>
        <button className={styles.btnBack} onClick={onBack}>Volver al paso anterior</button>
        <button className={styles.btnNext} onClick={() => onNext({ medios, banco, prefs })}>
          Guardar y continuar
        </button>
      </div>
    </>
  );
}

// ── Paso 3: Identidad del negocio ──────────────────────────────────────
function Paso3({ onNext, onBack }: { onNext: (data: any) => void; onBack: () => void }) {
  const [descripcion, setDescripcion] = useState('');
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [nuevoServicio, setNuevoServicio] = useState({ name: '', durationMinutes: 60, price: 0 });

  const agregarServicio = () => {
    if (!nuevoServicio.name) return;
    setServicios(prev => [...prev, nuevoServicio]);
    setNuevoServicio({ name: '', durationMinutes: 60, price: 0 });
    setModalOpen(false);
  };

  return (
    <>
      <h2 className={styles.title}>Identidad del negocio</h2>

      <div className={styles.field}>
        <label className={styles.label}>Logo de tu negocio</label>
        <div className={styles.uploadBox}>
          <PlusOutlined style={{ fontSize: 24, marginBottom: 8 }} />
          <div>Subir imagen</div>
          <div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>PNG, JPG hasta 2MB</div>
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Describí tu negocio</label>
        <textarea className={styles.textarea} value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          placeholder="Contale a tus clientes qué ofrecés..." />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Servicios</label>
        <div className={styles.serviciosGrid}>
          {servicios.map((s, i) => (
            <div key={i} className={styles.servicioChip}>
              {s.name} — {s.durationMinutes}min — ${s.price}
              <CloseOutlined style={{ fontSize: 11, cursor: 'pointer', color: '#999' }}
                onClick={() => setServicios(prev => prev.filter((_, j) => j !== i))} />
            </div>
          ))}
          <button className={styles.btnAgregarServicio} onClick={() => setModalOpen(true)}>
            + Agregar Servicio
          </button>
        </div>
      </div>

      <Modal title="Agregar servicio" open={modalOpen}
        onOk={agregarServicio} onCancel={() => setModalOpen(false)}
        okText="Guardar" cancelText="Cancelar">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
          <div>
            <label style={{ fontSize: 13, color: '#444' }}>Nombre del servicio</label>
            <Input value={nuevoServicio.name}
              onChange={e => setNuevoServicio({ ...nuevoServicio, name: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: '#444' }}>Duración (minutos)</label>
            <Input type="number" value={nuevoServicio.durationMinutes}
              onChange={e => setNuevoServicio({ ...nuevoServicio, durationMinutes: Number(e.target.value) })} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: '#444' }}>Precio ($)</label>
            <Input type="number" value={nuevoServicio.price}
              onChange={e => setNuevoServicio({ ...nuevoServicio, price: Number(e.target.value) })} />
          </div>
        </div>
      </Modal>

      <div className={styles.actions}>
        <button className={styles.btnBack} onClick={onBack}>Volver al paso anterior</button>
        <button className={styles.btnNext} onClick={() => onNext({ descripcion, servicios })}>
          Guardar y continuar
        </button>
      </div>
    </>
  );
}

// ── Paso 4: Agenda ─────────────────────────────────────────────────────
function Paso4({ onNext, onBack }: { onNext: (data: any) => void; onBack: () => void }) {
  const [horariosActivos, setHorarios] = useState<string[]>(['9:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00']);

  const toggleHorario = (h: string) => {
    setHorarios(prev => prev.includes(h) ? prev.filter(x => x !== h) : [...prev, h]);
  };

  return (
    <>
      <h2 className={styles.title}>Agenda de Turnos</h2>
      <p style={{ textAlign: 'center', color: '#666', fontSize: 13, marginBottom: 24 }}>
        Seleccioná los horarios en los que querés recibir turnos. Podés modificarlos después desde el panel.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
        {HORARIOS.map(h => (
          <button key={h} type="button"
            onClick={() => toggleHorario(h)}
            style={{
              padding: '10px 18px',
              borderRadius: 8,
              border: `2px solid ${horariosActivos.includes(h) ? '#023048' : '#ddd'}`,
              background: horariosActivos.includes(h) ? '#023048' : '#f9f9f9',
              color: horariosActivos.includes(h) ? 'white' : '#555',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}>
            {h}
          </button>
        ))}
      </div>

      <p style={{ textAlign: 'center', color: '#999', fontSize: 12, marginTop: 16 }}>
        {horariosActivos.length} horarios seleccionados
      </p>

      <div className={styles.actions}>
        <button className={styles.btnBack} onClick={onBack}>Volver atrás</button>
        <button className={styles.btnNext} onClick={() => onNext({ horarios: horariosActivos })}>
          Guardar
        </button>
      </div>
    </>
  );
}

// ── Pantalla de éxito ──────────────────────────────────────────────────
function PantallaExito() {
  const navigate = useNavigate();
  return (
    <div className={styles.successPage}>
      <div className={styles.successIcon}>
        <CheckOutlined style={{ fontSize: 48, color: 'white' }} />
      </div>
      <div className={styles.successText}>¡Tu negocio ya forma parte de Axen!</div>
      <button className={styles.btnPanel} onClick={() => navigate('/partner/dashboard')}>
        Ir al Panel de Control
      </button>
    </div>
  );
}

// ── Componente principal ───────────────────────────────────────────────
export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [datos, setDatos] = useState<any>({});

  const handleNext = async (stepData: any) => {
    const newDatos = { ...datos, ...stepData };
    setDatos(newDatos);

    if (step === 4) {
      setLoading(true);
      try {
        // Obtener el partner del usuario
        const { data: partner } = await api.get('/partners/me');

        // Actualizar datos básicos del negocio
        await api.patch(`/partners/${partner.id}`, {
          name: newDatos.name,
          description: newDatos.descripcion || newDatos.description,
          cancelWindowHours: 2,
        });

        // Actualizar ubicación
        if (newDatos.address) {
          await api.patch(`/partners/${partner.id}/location`, {
            address: newDatos.address,
          });
        }

        // Crear servicios
        for (const servicio of newDatos.servicios || []) {
          await api.post('/services', servicio);
        }

        // Activar el negocio
        await api.patch(`/partners/${partner.id}/activate`);

        setStep(5);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => setStep(step - 1);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <img src="/logo.svg" alt="Axen Negocios" className={styles.logo} />
        <div className={styles.headerRight}>
          <UserOutlined />
          <span>Mi Perfil</span>
        </div>
      </header>

      {step <= 4 && <Stepper step={step} />}

      <div className={styles.content}>
        {step === 1 && <Paso1 onNext={handleNext} />}
        {step === 2 && <Paso2 onNext={handleNext} onBack={handleBack} />}
        {step === 3 && <Paso3 onNext={handleNext} onBack={handleBack} />}
        {step === 4 && <Paso4 onNext={handleNext} onBack={handleBack} />}
        {step === 5 && <PantallaExito />}
      </div>

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