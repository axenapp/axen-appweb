# Axen Web

Panel web y vista de usuario de la plataforma Axen. Permite a los partners gestionar su negocio desde el navegador, y a los usuarios buscar y reservar servicios desde desktop.

## Stack

- **Framework:** React 18 + Vite + TypeScript
- **Estilos:** CSS Modules + Ant Design
- **Routing:** React Router DOM v6
- **HTTP:** Axios con interceptores JWT
- **Estado servidor:** TanStack React Query
- **Iconos:** @ant-design/icons

---

## Requisitos

- Node.js v18 o superior
- npm v9 o superior
- Backend Axen corriendo en `http://localhost:3000`

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/axenapp/axen-appweb.git
cd axen-appweb

# 2. Instalar dependencias
npm install

# 3. Levantar el servidor de desarrollo
npm run dev
```

El panel corre en `http://localhost:5174`

---

## Paleta de colores

| Variable | Color | Uso |
|---|---|---|
| `--color-primary` | `#023048` | Fondo, header, card |
| `--color-secondary` | `#659aba` | Acentos, bordes |
| `--color-accent` | `#c1111e` | Botón primario, acciones |
| `--color-cream` | `#ffeed4` | Textos sobre oscuro |

---

## Estructura del proyecto
src/
├── pages/
│   ├── auth/          # Login y registro
│   ├── user/          # Vistas del usuario final
│   └── partner/       # Panel del partner
├── components/
│   ├── common/        # Componentes reutilizables
│   └── layout/        # Header, sidebar, footer
├── services/
│   └── api.ts         # Axios con interceptores JWT
├── context/
│   └── AuthContext.tsx # Sesión y autenticación
├── hooks/             # Custom hooks
├── types/             # Interfaces TypeScript
└── styles/
└── global.css     # Variables CSS y reset

---

## Progreso del desarrollo

### ✅ Configuración inicial
- Proyecto React + Vite + TypeScript inicializado
- CSS Modules con variables de paleta de colores
- Axios configurado con interceptor de token JWT y redirección en 401
- AuthContext con login/logout y persistencia en sessionStorage
- Tipos TypeScript para todas las entidades del sistema

### ✅ Autenticación
- Pantalla de login fiel al prototipo de Figma
- Fondo con imagen, card semitransparente, header con logo
- Conexión real con el backend — POST /api/v1/auth/login
- Redirección por rol: partner → /partner/dashboard, user → /
- Manejo de errores con mensaje visible en la card
- JWT guardado en sessionStorage

### ⏳ En progreso
- Página de registro de usuario
- Página de registro de negocio

### 📋 Pendiente
- Flujo de onboarding del partner (4 pasos)
- Panel de gestión de servicios
- Vista de agenda con calendario
- Dashboard con métricas
- Vista de búsqueda y catálogo para usuarios
- Flujo de reserva y pago
- Historial de turnos
- Sección de reseñas

---

## Credenciales de prueba
Email: flor@axen.com
Contraseña: Axen1234
Rol: partner

---

## Equipo

- **Flor Gomez Pacheco** Backend — Panel web
- **Franco Chiquilito** — Backend + App móvil
