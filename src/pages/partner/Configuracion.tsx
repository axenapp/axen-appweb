import { useEffect, useState } from 'react';
import {
  UserOutlined,
  SafetyOutlined,
  BellOutlined,
  ApiOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { Switch } from 'antd';
import PartnerLayout from '../../components/layout/PartnerLayout';
import api from '../../services/api';
import styles from './Configuracion.module.css';

type Section = null | 'perfil' | 'politicas' | 'notificaciones' | 'integraciones';

const CONFIG_ITEMS = [
  {
    key: 'perfil' as Section,
    icon: <UserOutlined />,
    title: 'Perfil del negocio',
    desc: 'Editá el nombre, descripción y datos de contacto de tu negocio',
  },
  {
    key: 'politicas' as Section,
    icon: <SafetyOutlined />,
    title: 'Políticas',
    desc: 'Configurá la ventana de cancelación, señas y modalidad de atención',
  },
  {
    key: 'notificaciones' as Section,
    icon: <BellOutlined />,
    title: 'Notificaciones',
    desc: 'Elegí cómo y cuándo recibir avisos de nuevas reservas y cancelaciones',
  },
  {
    key: 'integraciones' as Section,
    icon: <ApiOutlined />,
    title: 'Integraciones',
    desc: 'Conectá Google Maps, MercadoPago y otras herramientas',
  },
];

export default function Configuracion() {
  const [section, setSection] = useState<Section>(null);
  const [partner, setPartner] = useState<any>(null);
  const [form, setForm] = useState({ name: '', description: '', address: '', phone: '' });
  const [cancelWindow, setCancelWindow] = useState(2);
  const [notifs, setNotifs] = useState({ nuevaReserva: true, cancelacion: true, recordatorio: true, pago: true });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get('/partners/me').then(({ data }) => {
      setPartner(data);
      setForm({
        name: data.name || '',
        description: data.description || '',
        address: data.address || '',
        phone: '',
      });
      setCancelWindow(data.cancelWindowHours || 2);
    });
  }, []);

  const handleSavePerfil = async () => {
    setLoading(true);
    try {
      await api.patch(`/partners/${partner.id}`, {
        name: form.name,
        description: form.description,
      });
      if (form.address) {
        await api.patch(`/partners/${partner.id}/location`, { address: form.address });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePoliticas = async () => {
    setLoading(true);
    try {
      await api.patch(`/partners/${partner.id}`, { cancelWindowHours: cancelWindow });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (section === 'perfil') {
    return (
      <PartnerLayout>
        <div className={styles.page}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setSection(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: 14 }}>
              ← Volver
            </button>
            <div className={styles.pageTitle}>Perfil del negocio</div>
          </div>
          <div className={styles.card}>
            {saved && <div className={styles.successMsg}>✓ Cambios guardados correctamente</div>}
            <div className={styles.section}>
              <div className={styles.field}>
                <label className={styles.label}>Nombre del negocio</label>
                <input className={styles.input} value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Descripción</label>
                <textarea className={styles.textarea} value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Dirección</label>
                <input className={styles.input} value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })} />
              </div>
              <div className={styles.saveRow}>
                <button className={styles.btnSave} onClick={handleSavePerfil} disabled={loading}>
                  {loading ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </PartnerLayout>
    );
  }

  if (section === 'politicas') {
    return (
      <PartnerLayout>
        <div className={styles.page}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setSection(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: 14 }}>
              ← Volver
            </button>
            <div className={styles.pageTitle}>Políticas</div>
          </div>
          <div className={styles.card}>
            {saved && <div className={styles.successMsg}>✓ Cambios guardados correctamente</div>}
            <div className={styles.cardTitle}>Cancelación de turnos</div>
            <div className={styles.field}>
              <label className={styles.label}>Ventana de cancelación (horas)</label>
              <input className={styles.input} type="number" min={1} max={48}
                value={cancelWindow}
                onChange={e => setCancelWindow(Number(e.target.value))}
                style={{ maxWidth: 120 }} />
              <div style={{ fontSize: 12, color: '#aaa', marginTop: 6 }}>
                Los clientes podrán cancelar hasta {cancelWindow}hs antes del turno
              </div>
            </div>
            <div className={styles.saveRow}>
              <button className={styles.btnSave} onClick={handleSavePoliticas} disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </div>
      </PartnerLayout>
    );
  }

  if (section === 'notificaciones') {
    return (
      <PartnerLayout>
        <div className={styles.page}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setSection(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: 14 }}>
              ← Volver
            </button>
            <div className={styles.pageTitle}>Notificaciones</div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardTitle}>Configurá tus notificaciones</div>
            {[
              { key: 'nuevaReserva', label: 'Nueva reserva', sub: 'Recibí un aviso cuando alguien reserve un turno' },
              { key: 'cancelacion', label: 'Cancelación', sub: 'Recibí un aviso cuando un cliente cancele un turno' },
              { key: 'recordatorio', label: 'Recordatorio de turno', sub: 'Recibí un recordatorio 24hs antes de cada turno' },
              { key: 'pago', label: 'Confirmación de pago', sub: 'Recibí un aviso cuando se confirme un pago' },
            ].map(({ key, label, sub }) => (
              <div key={key} className={styles.switchRow}>
                <div>
                  <div className={styles.switchLabel}>{label}</div>
                  <div className={styles.switchSub}>{sub}</div>
                </div>
                <Switch
                  checked={notifs[key as keyof typeof notifs]}
                  onChange={val => setNotifs({ ...notifs, [key]: val })}
                />
              </div>
            ))}
          </div>
        </div>
      </PartnerLayout>
    );
  }

  if (section === 'integraciones') {
    return (
      <PartnerLayout>
        <div className={styles.page}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setSection(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: 14 }}>
              ← Volver
            </button>
            <div className={styles.pageTitle}>Integraciones</div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardTitle}>Herramientas conectadas</div>
            {[
              { nombre: 'Google Maps', desc: 'Geocodificación de dirección', estado: 'Pendiente clave API' },
              { nombre: 'MercadoPago', desc: 'Pagos online y cobros', estado: 'Pendiente access token' },
              { nombre: 'Resend', desc: 'Envío de emails transaccionales', estado: 'Pendiente API key' },
            ].map(({ nombre, desc, estado }) => (
              <div key={nombre} className={styles.switchRow}>
                <div>
                  <div className={styles.switchLabel}>{nombre}</div>
                  <div className={styles.switchSub}>{desc}</div>
                </div>
                <span style={{ fontSize: 12, color: '#ff9800', background: '#fff3e0', padding: '4px 10px', borderRadius: 20 }}>
                  {estado}
                </span>
              </div>
            ))}
          </div>
        </div>
      </PartnerLayout>
    );
  }

  return (
    <PartnerLayout>
      <div className={styles.page}>
        <div className={styles.pageTitle}>Configuración</div>
        <div className={styles.grid}>
          {CONFIG_ITEMS.map(({ key, icon, title, desc }) => (
            <div key={key} className={styles.configCard} onClick={() => setSection(key)}>
              <div className={styles.configIcon}>{icon}</div>
              <div className={styles.configInfo}>
                <div className={styles.configTitle}>{title}</div>
                <div className={styles.configDesc}>{desc}</div>
              </div>
              <div className={styles.configArrow}><RightOutlined /></div>
            </div>
          ))}
        </div>
      </div>
    </PartnerLayout>
  );
}