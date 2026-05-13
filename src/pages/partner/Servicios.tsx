import { useEffect, useState } from 'react';
import { Modal, Input, InputNumber, Switch, message } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import PartnerLayout from '../../components/layout/PartnerLayout';
import api from '../../services/api';
import styles from './Dashboard.module.css'; // reutilizamos los estilos del panel

interface Servicio {
  id: string;
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
  isActive: boolean;
}

// Estado vacío para el formulario
const FORM_VACIO = { name: '', description: '', durationMinutes: 60, price: 0 };


export default function Servicios() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<Servicio | null>(null); // null = crear, objeto = editar
  const [form, setForm] = useState(FORM_VACIO);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  // Carga los servicios del partner al montar
  const cargarServicios = () => {
    setLoading(true);
    api.get('/services/my')
      .then(({ data }) => setServicios(data))
      .catch(() => message.error('No se pudieron cargar los servicios'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { cargarServicios(); }, []);


    // Abre el modal para crear
  const abrirCrear = () => {
    setEditando(null);
    setForm(FORM_VACIO);
    setError('');
    setModalOpen(true);
  };

  // Abre el modal precargado para editar
  const abrirEditar = (s: Servicio) => {
    setEditando(s);
    setForm({ name: s.name, description: s.description || '', durationMinutes: s.durationMinutes, price: s.price });
    setError('');
    setModalOpen(true);
  };

  // Valida y guarda (crea o edita según si hay editando)
  const guardar = async () => {
    if (!form.name.trim()) { setError('El nombre es obligatorio'); return; }
    if (form.price <= 0) { setError('El precio debe ser mayor a 0'); return; }
    if (form.durationMinutes <= 0) { setError('La duración debe ser mayor a 0'); return; }

    setGuardando(true);
    setError('');
    try {
      if (editando) {
        await api.patch(`/services/${editando.id}`, form);
        message.success('Servicio actualizado');
      } else {
        await api.post('/services', form);
        message.success('Servicio creado');
      }
      setModalOpen(false);
      cargarServicios(); // recarga la lista
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar');
    } finally {
      setGuardando(false);
    }
  };

  // Activa o desactiva el servicio
  const toggleActivo = async (s: Servicio) => {
    try {
      await api.patch(`/services/${s.id}`, { isActive: !s.isActive });
      cargarServicios();
    } catch {
      message.error('No se pudo actualizar el estado');
    }
  };


    const modalFormulario = (
    <Modal
      title={editando ? 'Editar servicio' : 'Nuevo servicio'}
      open={modalOpen}
      onOk={guardar}
      onCancel={() => setModalOpen(false)}
      okText={guardando ? 'Guardando...' : 'Guardar'}
      cancelText="Cancelar"
      confirmLoading={guardando}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
        {error && <div style={{ color: '#c1111e', fontSize: 13 }}>{error}</div>}

        <div>
          <label style={{ fontSize: 13 }}>Nombre*</label>
          <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label style={{ fontSize: 13 }}>Descripción</label>
          <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        </div>
        <div>
          <label style={{ fontSize: 13 }}>Duración (minutos)*</label>
          <InputNumber min={1} value={form.durationMinutes} onChange={v => setForm({ ...form, durationMinutes: v || 0 })} style={{ width: '100%' }} />
        </div>
        <div>
          <label style={{ fontSize: 13 }}>Precio ($)*</label>
          <InputNumber min={0} value={form.price} onChange={v => setForm({ ...form, price: v || 0 })} style={{ width: '100%' }} />
        </div>
      </div>
    </Modal>
  );


    return (
    <PartnerLayout>
      <div className={styles.page}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className={styles.pageTitle}>Servicios</div>
          <button className={styles.btnPrimary} onClick={abrirCrear}>
            <PlusOutlined /> Nuevo servicio
          </button>
        </div>

        {loading && <div className={styles.loading}>Cargando...</div>}

        {!loading && servicios.length === 0 && (
          <div className={styles.emptyState}>Todavía no tenés servicios. ¡Creá el primero!</div>
        )}

        {/* Lista de servicios */}
        {servicios.map(s => (
          <div key={s.id} className={styles.turnoItem}>
            <div className={styles.turnoInfo}>
              <div className={styles.turnoNombre}>{s.name}</div>
              <div className={styles.turnoServicio}>{s.durationMinutes} min — ${s.price.toLocaleString('es-AR')}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Toggle activo/inactivo */}
              <Switch checked={s.isActive} onChange={() => toggleActivo(s)} />
              {/* Botón editar */}
              <EditOutlined style={{ cursor: 'pointer', fontSize: 16 }} onClick={() => abrirEditar(s)} />
            </div>
          </div>
        ))}

        {modalFormulario}
      </div>
    </PartnerLayout>
  );
}
