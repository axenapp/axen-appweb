import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, StarFilled, EnvironmentOutlined, ClockCircleOutlined, CreditCardOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import api from '../../services/api';
import styles from './Negocio.module.css';

export default function Negocio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [partner, setPartner] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorito, setFavorito] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get(`/partners/${id}`),
      api.get(`/services/partner/${id}`),
      api.get(`/reviews?partnerId=${id}`).catch(() => ({ data: [] })),
    ])
      .then(([partnerRes, servicesRes, reviewsRes]) => {
        setPartner(partnerRes.data);
        setServices(servicesRes.data.filter((s: any) => s.isActive));
        setReviews(reviewsRes.data);
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id]);

  const avgRating = reviews.length
    ? (reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  if (loading) {
    return (
      <div className={styles.loadingPage}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (!partner) return null;

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeftOutlined />
        </button>
        <img src="/logo.svg" alt="Axen" className={styles.logo} onClick={() => navigate('/')} />
        <button
          className={styles.favBtn}
          onClick={() => setFavorito(!favorito)}
        >
          {favorito ? <HeartFilled style={{ color: '#c1111e' }} /> : <HeartOutlined />}
        </button>
      </header>

      <main className={styles.main}>
        {/* Hero del negocio */}
        <div className={styles.heroCard}>
          <div className={styles.heroLogo}>
            <span>🏪</span>
          </div>
          <div className={styles.heroInfo}>
            <h1 className={styles.heroName}>{partner.name}</h1>
            {avgRating && (
              <div className={styles.heroRating}>
                <StarFilled className={styles.starIcon} />
                <span>{avgRating}</span>
                <span className={styles.ratingCount}>({reviews.length} opiniones)</span>
              </div>
            )}
            {partner.description && (
              <p className={styles.heroDesc}>{partner.description}</p>
            )}
          </div>
        </div>

        {/* Info rápida */}
        <div className={styles.infoBar}>
          <div className={styles.infoItem}>
            <ClockCircleOutlined className={styles.infoIcon} />
            <span>Turnos disponibles próximas 48hs</span>
          </div>
          {partner.address && (
            <div className={styles.infoItem}>
              <EnvironmentOutlined className={styles.infoIcon} />
              <span>{partner.address}</span>
            </div>
          )}
          <div className={styles.infoItem}>
            <CreditCardOutlined className={styles.infoIcon} />
            <span>Efectivo · Débito · MercadoPago</span>
          </div>
        </div>

        {/* Servicios */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Servicios Disponibles</h2>
          {services.length === 0 ? (
            <div className={styles.emptyState}>Este negocio no tiene servicios activos aún.</div>
          ) : (
            <div className={styles.servicesList}>
              {services.map((service: any) => (
                <div
                  key={service.id}
                  className={styles.serviceCard}
                  onClick={() => navigate(`/reservar/${service.id}`)}
                >
                  <div className={styles.serviceInfo}>
                    <div className={styles.serviceName}>{service.name}</div>
                    {service.description && (
                      <div className={styles.serviceDesc}>{service.description}</div>
                    )}
                    <div className={styles.serviceMeta}>
                      <span className={styles.serviceDuration}>
                        <ClockCircleOutlined /> {service.durationMinutes} min
                      </span>
                    </div>
                  </div>
                  <div className={styles.serviceRight}>
                    <div className={styles.servicePrice}>
                      ${service.price.toLocaleString('es-AR')}
                    </div>
                    <div className={styles.serviceArrow}>›</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reseñas */}
        {reviews.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Opiniones</h2>
            <div className={styles.reviewsList}>
              {reviews.slice(0, 3).map((r: any) => (
                <div key={r.id} className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.reviewStars}>
                      {[1, 2, 3, 4, 5].map(s => (
                        <StarFilled key={s} className={s <= r.rating ? styles.starOn : styles.starOff} />
                      ))}
                    </div>
                  </div>
                  {r.comment && <p className={styles.reviewComment}>{r.comment}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
