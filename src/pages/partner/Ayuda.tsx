import { useState } from 'react';
import {
  DownOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
  SettingOutlined,
  ShopOutlined,
  MailOutlined,
  WhatsAppOutlined,
  ClockCircleOutlined,
  BookOutlined,
} from '@ant-design/icons';
import PartnerLayout from '../../components/layout/PartnerLayout';
import styles from './Ayuda.module.css';

const FAQ = [
  {
    q: '¿Cómo agrego un nuevo servicio?',
    a: 'Desde el panel de Configuración → Perfil del negocio podés gestionar tus servicios. También podés agregarlos directamente desde el onboarding inicial en la sección "Identidad del negocio".',
  },
  {
    q: '¿Cómo configuro mis horarios disponibles?',
    a: 'En la sección Turnos de tu panel podés ver y gestionar tu agenda. Para modificar los horarios disponibles entrá a Configuración → Políticas y ajustá los parámetros de tu agenda.',
  },
  {
    q: '¿Cómo cancelo un turno?',
    a: 'Podés cancelar un turno desde la vista de Turnos haciendo click sobre el turno en cuestión. Tené en cuenta que la cancelación respeta la ventana configurada en tus políticas.',
  },
  {
    q: '¿Cómo cobro a través de MercadoPago?',
    a: 'Para activar cobros online necesitás conectar tu cuenta de MercadoPago. Entrá a Pagos y hacé click en "Conectar MP". Necesitás tener una cuenta de MercadoPago activa con acceso a la API.',
  },
  {
    q: '¿Qué pasa si un cliente no se presenta?',
    a: 'Si un cliente no se presenta a su turno, podés marcarlo como "No presentado" desde la vista de Turnos. El turno quedará registrado y el horario se liberará automáticamente.',
  },
  {
    q: '¿Cómo modifico la ventana de cancelación?',
    a: 'Entrá a Configuración → Políticas. Ahí podés ajustar cuántas horas antes del turno permitís que un cliente cancele. El valor por defecto es 2 horas y podés configurarlo entre 1 y 48 horas.',
  },
  {
    q: '¿Puedo bloquear días en mi agenda?',
    a: 'Sí. Desde la sección Turnos podés seleccionar un día en el calendario y bloquearlo. Los turnos libres de ese día quedarán inaccesibles para nuevas reservas.',
  },
];

const GUIDES = [
  {
    icon: <CheckCircleOutlined />,
    title: 'Completar el onboarding',
    desc: 'Configurá tu negocio paso a paso: datos, pagos, identidad y agenda',
  },
  {
    icon: <ShopOutlined />,
    title: 'Agregar servicios',
    desc: 'Creá los servicios que ofrecés con precio, duración y descripción',
  },
  {
    icon: <CalendarOutlined />,
    title: 'Configurar la agenda',
    desc: 'Definí tus horarios disponibles y gestioná los turnos del día',
  },
  {
    icon: <SettingOutlined />,
    title: 'Gestionar turnos',
    desc: 'Confirmá, completá o cancelá turnos desde la vista de agenda',
  },
];

export default function Ayuda() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <PartnerLayout>
      <div className={styles.page}>
        <div className={styles.pageTitle}>Ayuda</div>

        {/* FAQ */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>
            <BookOutlined style={{ marginRight: 8 }} />
            Preguntas frecuentes
          </div>
          {FAQ.map((item, i) => (
            <div key={i} className={styles.faqItem}>
              <div
                className={styles.faqQuestion}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span>{item.q}</span>
                <DownOutlined
                  className={`${styles.faqIcon} ${openFaq === i ? styles.faqIconOpen : ''}`}
                />
              </div>
              {openFaq === i && (
                <div className={styles.faqAnswer}>{item.a}</div>
              )}
            </div>
          ))}
        </div>

        {/* Guía rápida */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>
            <CheckCircleOutlined style={{ marginRight: 8 }} />
            Guía rápida
          </div>
          <div className={styles.guidesGrid}>
            {GUIDES.map((g, i) => (
              <div key={i} className={styles.guideCard}>
                <div className={styles.guideIcon}>{g.icon}</div>
                <div>
                  <div className={styles.guideTitle}>{g.title}</div>
                  <div className={styles.guideDesc}>{g.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contacto */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>
            <MailOutlined style={{ marginRight: 8 }} />
            Contacto y soporte
          </div>
          <div className={styles.contactGrid}>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}><MailOutlined /></div>
              <div className={styles.contactInfo}>
                <div className={styles.contactLabel}>Email de soporte</div>
                <div className={styles.contactValue}>soporte@axen.app</div>
              </div>
            </div>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}><WhatsAppOutlined /></div>
              <div className={styles.contactInfo}>
                <div className={styles.contactLabel}>WhatsApp</div>
                <div className={styles.contactValue}>+54 11 0000-0000</div>
              </div>
            </div>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}><ClockCircleOutlined /></div>
              <div className={styles.contactInfo}>
                <div className={styles.contactLabel}>Horario de atención</div>
                <div className={styles.contactValue}>Lun a Vie · 9 a 18hs</div>
              </div>
            </div>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}><BookOutlined /></div>
              <div className={styles.contactInfo}>
                <div className={styles.contactLabel}>Documentación</div>
                <div className={styles.contactValue}>docs.axen.app</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PartnerLayout>
  );
}