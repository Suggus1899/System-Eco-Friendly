# EcoGestión Local - MVP

Sistema integral de gestión de residuos y conciencia ecológica que incluye aplicación móvil (Android/iOS), backend y panel administrativo web.

## 📋 Descripción

EcoGestión Local es una aplicación diseñada para generar conciencia ecológica y ambiental mediante:
- Guías de separación de residuos
- Gamificación con retos semanales
- Sistema de puntos e insignias
- Calendario de recolección por zona
- Mapa de centros de reciclaje
- Modo offline

## 🏗️ Arquitectura

Monorepo con tres componentes principales:

### 1. **Mobile App** (`/mobile`)
- **Framework**: React Native
- **Características**:
  - Guía de separación (orgánico, plástico, vidrio, papel, electrónicos)
  - Buscador de materiales
  - Calendario con recordatorios por zona
  - Mapa de centros de reciclaje (Leaflet/OSM)
  - Retos semanales
  - Sistema de puntos e insignias
  - Soporte offline
  - Notificaciones push (FCM)

### 2. **Backend** (`/backend`)
- **Stack**: Node.js + Express + PostgreSQL
- **Funcionalidades**:
  - Autenticación JWT
  - CRUD de usuarios
  - Gestión de materiales reciclables
  - Gestión de centros de reciclaje
  - Calendario y horarios por zona
  - Sistema de retos y gamificación
  - API RESTful documentada

### 3. **Admin Panel** (`/admin-panel`)
- **Framework**: React
- **Funcionalidades**:
  - Dashboard administrativo
  - CRUD completo de materiales
  - CRUD de centros de reciclaje
  - Gestión de horarios
  - Gestión de retos
  - Sistema de aprobaciones
  - Visualización de estadísticas

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ y npm
- Docker y Docker Compose
- PostgreSQL 15+ (si no usas Docker)

### Instalación con Docker (Recomendado)

```bash
# Clonar el repositorio
git clone https://github.com/Suggus1899/System-Eco-Friendly.git
cd System-Eco-Friendly

# Levantar todos los servicios
docker-compose up -d

# Ejecutar seeds (datos de ejemplo)
npm run seed
```

Los servicios estarán disponibles en:
- Backend API: http://localhost:3000
- Admin Panel: http://localhost:3001
- PostgreSQL: localhost:5432

### Instalación Manual

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp backend/.env.example backend/.env
cp admin-panel/.env.example admin-panel/.env
cp mobile/.env.example mobile/.env

# Iniciar PostgreSQL localmente
# Crear base de datos 'ecogestion_db'

# Iniciar backend
npm run dev:backend

# En otra terminal, iniciar admin panel
npm run dev:admin

# Para mobile app (requiere configuración adicional)
npm run dev:mobile
```

## 📱 Configuración de Mobile App

### Android
```bash
cd mobile
npx react-native run-android
```

### iOS
```bash
cd mobile
cd ios && pod install && cd ..
npx react-native run-ios
```

## 🗄️ Base de Datos

### Esquema Principal

- **users**: Usuarios del sistema
- **materials**: Tipos de materiales reciclables
- **centers**: Centros de reciclaje
- **schedules**: Horarios de recolección por zona
- **challenges**: Retos semanales
- **user_progress**: Puntos e insignias de usuarios

### Seeds

Los datos de ejemplo incluyen:
- Materiales comunes (plástico, vidrio, papel, orgánico, electrónicos)
- Centros de reciclaje (ejemplo: La Recuperadora Guárico 2016 C.A.)
- Retos semanales de ejemplo
- Usuarios de prueba

```bash
npm run seed
```

## 🔑 Variables de Entorno

### Backend (.env)
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/ecogestion_db
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
FCM_SERVER_KEY=your-fcm-server-key
```

### Admin Panel (.env)
```env
REACT_APP_API_URL=http://localhost:3000/api
```

### Mobile (.env)
```env
API_URL=http://localhost:3000/api
FCM_SENDER_ID=your-fcm-sender-id
```

## 📚 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión

### Materiales
- `GET /api/materials` - Listar materiales
- `GET /api/materials/:id` - Obtener material
- `POST /api/materials` - Crear material (admin)
- `PUT /api/materials/:id` - Actualizar material (admin)
- `DELETE /api/materials/:id` - Eliminar material (admin)

### Centros de Reciclaje
- `GET /api/centers` - Listar centros
- `GET /api/centers/:id` - Obtener centro
- `GET /api/centers/nearby` - Centros cercanos
- `POST /api/centers` - Crear centro (admin)
- `PUT /api/centers/:id` - Actualizar centro (admin)
- `DELETE /api/centers/:id` - Eliminar centro (admin)

### Horarios
- `GET /api/schedules` - Listar horarios
- `GET /api/schedules/zone/:zone` - Horarios por zona
- `POST /api/schedules` - Crear horario (admin)
- `PUT /api/schedules/:id` - Actualizar horario (admin)

### Retos
- `GET /api/challenges` - Listar retos activos
- `GET /api/challenges/weekly` - Retos de la semana
- `POST /api/challenges/:id/complete` - Completar reto
- `POST /api/challenges` - Crear reto (admin)

### Usuario y Progreso
- `GET /api/users/profile` - Perfil del usuario
- `GET /api/users/progress` - Progreso y puntos
- `GET /api/users/badges` - Insignias obtenidas

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Admin panel tests
cd admin-panel
npm test
```

## 📦 Build para Producción

```bash
# Backend
npm run build:backend

# Admin Panel
npm run build:admin

# Mobile (Android)
cd mobile
cd android && ./gradlew assembleRelease

# Mobile (iOS)
cd mobile
cd ios && xcodebuild -workspace EcoGestion.xcworkspace -scheme EcoGestion -configuration Release
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Equipo

System Eco-Friendly Team

## 🌟 Características Destacadas

- ✅ Modo offline completo en mobile
- ✅ Notificaciones push personalizadas
- ✅ Gamificación con retos y recompensas
- ✅ Mapa interactivo de centros de reciclaje
- ✅ Recordatorios automáticos por zona
- ✅ Panel admin con aprobaciones
- ✅ Base de datos con seeds
- ✅ Documentación completa
- ✅ Docker para desarrollo rápido
- ✅ API RESTful documentada
