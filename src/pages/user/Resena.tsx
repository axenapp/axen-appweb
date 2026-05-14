import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StarFilled, StarOutlined } from '@ant-design/icons';
import api from '../../services/api';
import styles from './Resena.module.css';

const CRITERIOS = [
  { key: 'calidad', label: 'Calidad' },
  { key: 'puntualidad', label: 'Puntualidad' },
  { key: 'precio', label: 'Precio' },
];

export default function Resena() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [ratings, setRatings] = useState<Record<string, number>>({
    calidad: 0,
    puntualidad: 0,
    precio: 0,
  });
  const [hover, setHover] = useState<Record<string, number>>({});
  const [comentario, setComentario] = useState('');
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');

  const avgRating = Math.round(
    Object.values(ratings).reduce((a, b) => a + b, 0) / CRITERIOS.length
  );

  const handleEnviar = async () => {
    if (avgRating === 0) {
      setError('Por favor calificá al menos un criterio.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/reviews', {
        bookingId,
        rating: avgRating,
        comment: comentario || undefined,
      });
      setEnviado(true);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Error al enviar la reseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.negocioLogo}>🏪</div>

        {enviado ? (
          <div className={styles.gracias}>
            <div className={styles.graciasBox}>Gracias por calificar!</div>
            <button className={styles.btnVolver} onClick={() => navigate('/')}>
              Volver al inicio
            </button>
          </div>
        ) : (
          <>
            {CRITERIOS.map(({ key, label }) => (
              <div key={key} className={styles.criterio}>
                <div className={styles.criterioLabel}>{label}</div>
                <div className={styles.stars}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      className={styles.starBtn}
                      onMouseEnter={() => setHover(h => ({ ...h, [key]: n }))}
                      onMouseLeave={() => setHover(h => ({ ...h, [key]: 0 }))}
                      onClick={() => setRatings(r => ({ ...r, [key]: n }))}
                    >
                      {n <= (hover[key] || ratings[key])
                        ? <StarFilled className={styles.starOn} />
                        : <StarOutlined className={styles.starOff} />
                      }
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className={styles.comentarioSection}>
              <div className={styles.comentarioLabel}>Dejá tu opinión!</div>
              <textarea
                className={styles.comentarioInput}
                placeholder="Escribí tu opinión (opcional)"
                value={comentario}
                onChange={e => setComentario(e.target.value)}
                rows={4}
              />
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button
              className={styles.enviarBtn}
              onClick={handleEnviar}
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
