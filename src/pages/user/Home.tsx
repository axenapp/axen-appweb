import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchOutlined, UserOutlined, StarFilled, HeartFilled } from '@ant-design/icons';
import { Dropdown } from 'antd';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import styles from './Home.module.css';

const CATEGORIAS = [
  { label: 'Peluquería', icon: '✂️', color: '#fff0f6', border: '#ffadd2' },
  { label: 'Salud', icon: '🏥', color: '#f0fff4', border: '#b7eb8f' },
  { label: 'Estética', icon: '💆', color: '#f9f0ff', border: '#d3adf7' },
  { label: 'Mascotas', icon: '🐾', color: '#fff7e6', border: '#ffd591' },
  { label: 'Automotor', icon: '🔧', color: '#e6f7ff', border: '#91d5ff' },
  { label: 'Clases', icon: '📚', color: '#f6ffed', border: '#95de64' },
  { label: 'Deporte', icon: '💪', color: '#fff2e8', border: '#ffbb96' },
  { label: 'Gastronomía', icon: '🍽️', color: '#fff1f0', border: '#ffa39e' },
  { label: 'Veterinaria', icon: '🐕', color: '#feffe6', border: '#eaff8f' },
  { label: 'Otros', icon: '⭐', color: '#f5f5f5', border: '#d9d9d9' },
];

export default function Home() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [search, setSearch] = useState('');
  const [partners, setPartners] = useState<any[]>([]);
  const [favoritos, setFavoritos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriaActiva, setCategoriaActiva] = useState<string | null>(null);

  useEffect(() => {
    api.get('/services')
      .then(({ data }) => {
        // Agrupar por partner
        const partnersMap: Record<string, any> = {};
        data.forEach((s: any) => {
          if (s.partner && !partnersMap[s.partner.id]) {
            partnersMap[s.partner.id] = s.partner;
          }
        });
        setPartners(Object.values(partnersMap));
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // Cargar favoritos si está logueado
    if (user) {
      api.get('/favorites').catch(() => {});
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenu = {
    items: [
      { key: 'turnos', label: 'Mis turnos' },
      { key: 'favoritos', label: 'Mis favoritos' },
      { key: 'divider', type: 'divider' as const },
      { key: 'logout', label: 'Cerrar sesión', danger: true },
    ],
    onClick: ({ key }: { key: string }) => {
      if (key === 'logout') handleLogout();
    },
  };

  const filteredPartners = partners.filter(p =>
    p.status === 'active' &&
    (!search || p.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <img src="/logo.svg" alt="Axen" className={styles.logo} />
          <div className={styles.searchBar}>
            <SearchOutlined className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              placeholder="Buscá un servicio o negocio..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.headerLink} onClick={() => navigate('/register-business')}>
            Registrá tu negocio
          </span>
          {user ? (
            <Dropdown menu={userMenu} placement="bottomRight">
              <div className={styles.headerProfile}>
                <UserOutlined />
                <span>{user.name.split(' ')[0]}</span>
              </div>
            </Dropdown>
          ) : (
            <div className={styles.headerProfile} onClick={() => navigate('/login')}>
              <UserOutlined />
              <span>Ingresar</span>
            </div>
          )}
        </div>
      </header>

      <main className={styles.main}>
        {/* Hero */}
        <div className={styles.hero}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Reservá turnos<br />
              <span>donde vos querés</span>
            </h1>
            <p className={styles.heroSub}>
              Encontrá los mejores negocios cerca tuyo y reservá en segundos. Sin llamadas, sin esperas.
            </p>
            <div className={styles.heroSearch}>
              <input
                className={styles.heroSearchInput}
                placeholder="¿Qué servicio estás buscando?"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button className={styles.heroSearchBtn}>
                <SearchOutlined /> Buscar
              </button>
            </div>
          </div>
          <div className={styles.heroImage}>📅</div>
        </div>

        {/* Categorías */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Categorías</div>
          <div className={styles.categoriesScroll}>
            {CATEGORIAS.map((cat) => (
              <div
                key={cat.label}
                className={styles.categoryItem}
                onClick={() => setCategoriaActiva(
                  categoriaActiva === cat.label ? null : cat.label
                )}
              >
                <div
                  className={styles.categoryIcon}
                  style={{
                    background: categoriaActiva === cat.label ? '#023048' : cat.color,
                    border: `2px solid ${categoriaActiva === cat.label ? '#023048' : cat.border}`,
                  }}
                >
                  {cat.icon}
                </div>
                <span
                  className={styles.categoryLabel}
                  style={{ color: categoriaActiva === cat.label ? '#023048' : '#555', fontWeight: categoriaActiva === cat.label ? 700 : 500 }}
                >
                  {cat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Favoritos */}
        {favoritos.length > 0 && (
          <div className={styles.favoritosSection}>
            <div className={styles.favoritosSectionInner}>
              <div className={styles.favoritosTitle}>
                <HeartFilled /> Nuestros Favoritos
              </div>
              <div className={styles.favoritosScroll}>
                {favoritos.map((f: any, i: number) => (
                  <div key={i} className={styles.favoritoCard}>
                    <div className={styles.favoritoLogo}>🏪</div>
                    <div className={styles.favoritoName}>{f.name}</div>
                    <div className={styles.favoritoCategory}>{f.category}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Negocios */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            {search ? `Resultados para "${search}"` : 'Cerca de vos'}
          </div>
          <div className={styles.businessGrid}>
            {loading && (
              <div className={styles.emptyState}>Cargando negocios...</div>
            )}
            {!loading && filteredPartners.length === 0 && (
              <div className={styles.emptyState}>
                {search ? 'No encontramos resultados para tu búsqueda' : 'No hay negocios disponibles aún'}
              </div>
            )}
            {filteredPartners.map((p: any, i: number) => (
              <div
                key={i}
                className={styles.businessCard}
                onClick={() => navigate(`/negocio/${p.id}`)}
              >
                <div className={styles.businessLogo}>🏪</div>
                <div className={styles.businessInfo}>
                  <div className={styles.businessName}>{p.name}</div>
                  <div className={styles.businessMeta}>{p.address || 'Sin dirección'}</div>
                  <div className={styles.businessFooter}>
                    <div className={styles.businessRating}>
                      <StarFilled />
                      <span>Nuevo</span>
                    </div>
                    <span className={`${styles.businessStatus} ${styles.statusActive}`}>
                      Disponible
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
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