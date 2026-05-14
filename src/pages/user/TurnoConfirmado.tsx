import { useNavigate } from 'react-router-dom';
import styles from './TurnoConfirmado.module.css';

export default function TurnoConfirmado() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.checkWrap}>
          <div className={styles.checkCircle}>
            <svg viewBox="0 0 52 52" className={styles.checkSvg}>
              <circle cx="26" cy="26" r="25" fill="none" className={styles.checkCircleSvg} />
              <path d="M14 27l8 8 16-16" fill="none" className={styles.checkMark} />
            </svg>
          </div>
        </div>
        <h1 className={styles.title}>¡Turno Confirmado!</h1>
        <p className={styles.subtitle}>Gracias por usar nuestros servicios 😊</p>

        <div className={styles.actions}>
          <button
            className={styles.btnPrimary}
            onClick={() => navigate('/mis-turnos')}
          >
            Ver Mis Turnos
          </button>
          <button
            className={styles.btnSecondary}
            onClick={() => navigate('/')}
          >
            Volver a Inicio
          </button>
        </div>
      </div>
    </div>
  );
}
