# 🌱 EcoGestión Local - MVP

Sistema integral de gestión de reciclaje que promueve la conciencia ecológica y ambiental a través de gamificación y funcionalidades educativas.

## 📋 Descripción

**EcoGestión Local** es un MVP (Minimum Viable Product) que incluye:

- 📱 **Aplicación Móvil** (Android/iOS) desarrollada en React Native
- 🖥️ **Panel de Administración Web** desarrollado en React
- 🔧 **Backend API** desarrollado en Node.js con PostgreSQL
- 🐳 **Configuración Docker** para despliegue completo

### Características Principales

#### Aplicación Móvil
- 📦 Guía de separación de residuos (orgánico, plástico, vidrio, papel, electrónicos)
- 🔍 Buscador de materiales reciclables
- 📅 Calendario y recordatorios de recolección por zona
- 🗺️ Mapa de centros de reciclaje (integración con Leaflet/OSM)
- 🏆 Retos semanales con sistema de puntos
- 🎖️ Sistema de insignias y gamificación
- 📴 Modo offline para acceso sin conexión
- 🔔 Notificaciones push con Firebase Cloud Messaging (FCM)

#### Panel de Administración
- ✏️ CRUD completo de materiales reciclables
- 🏢 Gestión de centros de reciclaje
- ⏰ Configuración de horarios de recolección
- 🎯 Creación y gestión de retos
- ✅ Sistema de aprobaciones

#### Backend API
- 🔐 Sistema de autenticación con JWT
- 👥 Gestión de usuarios
- 📊 API REST completa
- 🗄️ Base de datos PostgreSQL
- 🌱 Seeds de datos de ejemplo

## 🏗️ Arquitectura del Proyecto

```
System-Eco-Friendly/
├── packages/
│   ├── backend/              # API Node.js + Express
│   │   ├── src/
│   │   │   ├── config/       # Configuración (DB, JWT, FCM)
│   │   │   ├── controllers/  # Controladores de rutas
│   │   │   ├── middleware/   # Middleware (auth, etc.)
│   │   │   ├── routes/       # Definición de rutas
│   │   │   ├── database/     # Migraciones
│   │   │   ├── seeds/        # Datos de ejemplo
│   │   │   └── index.js      # Punto de entrada
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── admin-panel/          # Panel Admin React
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── components/   # Componentes reutilizables
│   │   │   ├── pages/        # Páginas de la app
│   │   │   ├── services/     # Servicios API
│   │   │   ├── App.js
│   │   │   └── index.js
│   │   ├── Dockerfile
│   │   ├── nginx.conf
│   │   └── package.json
│   │
│   └── mobile/               # App React Native
│       ├── src/
│       │   ├── screens/      # Pantallas de la app
│       │   ├── components/   # Componentes UI
│       │   ├── services/     # Servicios API
│       │   ├── navigation/   # Navegación
│       │   └── utils/        # Utilidades
│       ├── App.js
│       ├── app.json
│       └── package.json
│
├── docker-compose.yml        # Orquestación de servicios
├── package.json              # Configuración monorepo
└── README.md                 # Este archivo
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Docker y Docker Compose (para despliegue con contenedores)
- PostgreSQL 15+ (si no usas Docker)
- React Native CLI (para desarrollo móvil)

### Instalación con Docker (Recomendado)

1. **Clonar el repositorio:**
```bash
git clone https://github.com/Suggus1899/System-Eco-Friendly.git
cd System-Eco-Friendly
```

2. **Iniciar servicios con Docker Compose:**
```bash
docker-compose up -d
```

Esto iniciará:
- PostgreSQL en el puerto 5432
- Backend API en http://localhost:3000
- Panel Admin en http://localhost:3001

3. **Verificar que los servicios estén funcionando:**
```bash
docker-compose ps
docker-compose logs -f
```

### Instalación Manual

#### 1. Configurar Backend

```bash
cd packages/backend
npm install

# Crear archivo .env basado en .env.example
cp .env.example .env

# Editar .env con tus credenciales de base de datos

# Crear tablas
npm run migrate

# Insertar datos de ejemplo
npm run seed

# Iniciar servidor
npm run dev
```

#### 2. Configurar Panel de Administración

```bash
cd packages/admin-panel
npm install

# Crear archivo .env con la URL del backend
echo "REACT_APP_API_URL=http://localhost:3000/api" > .env

# Iniciar servidor de desarrollo
npm start
```

#### 3. Configurar Aplicación Móvil

```bash
cd packages/mobile
npm install

# Para iOS
cd ios && pod install && cd ..
npx react-native run-ios

# Para Android
npx react-native run-android
```

## 📚 Uso

### Credenciales por Defecto

Después de ejecutar los seeds, puedes usar estas credenciales:

**Administrador:**
- Email: `admin@ecogestion.local`
- Password: `admin123`

**Usuario Regular:**
- Email: `user@ecogestion.local`
- Password: `user123`

### API Endpoints

Base URL: `http://localhost:3000/api`

#### Autenticación
- `POST /auth/register` - Registrar nuevo usuario
- `POST /auth/login` - Iniciar sesión
- `GET /auth/profile` - Obtener perfil (requiere token)

#### Materiales
- `GET /materials` - Listar todos los materiales
- `GET /materials/search?q=texto` - Buscar materiales
- `GET /materials/:id` - Obtener material por ID
- `POST /materials` - Crear material (requiere auth)
- `PUT /materials/:id` - Actualizar material (requiere admin)
- `DELETE /materials/:id` - Eliminar material (requiere admin)

#### Centros de Reciclaje
- `GET /centers` - Listar centros
- `GET /centers/:id` - Obtener centro por ID
- `POST /centers` - Crear centro (requiere auth)
- `PUT /centers/:id` - Actualizar centro (requiere admin)
- `DELETE /centers/:id` - Eliminar centro (requiere admin)

#### Horarios de Recolección
- `GET /schedules` - Listar todos los horarios
- `GET /schedules/zone/:zone` - Horarios por zona
- `POST /schedules` - Crear horario (requiere admin)
- `PUT /schedules/:id` - Actualizar horario (requiere admin)
- `DELETE /schedules/:id` - Eliminar horario (requiere admin)

#### Retos
- `GET /challenges` - Listar retos
- `GET /challenges/user/me` - Retos del usuario (requiere auth)
- `GET /challenges/:id` - Obtener reto por ID
- `POST /challenges/:challengeId/complete` - Completar reto (requiere auth)
- `POST /challenges` - Crear reto (requiere admin)
- `PUT /challenges/:id` - Actualizar reto (requiere admin)
- `DELETE /challenges/:id` - Eliminar reto (requiere admin)

## 🗄️ Base de Datos

### Esquema de Tablas

- **users** - Usuarios del sistema
- **materials** - Materiales reciclables
- **recycling_centers** - Centros de reciclaje
- **collection_schedules** - Horarios de recolección
- **challenges** - Retos semanales
- **user_challenges** - Relación usuarios-retos
- **badges** - Insignias
- **user_badges** - Insignias ganadas por usuarios
- **reminders** - Recordatorios de recolección

### Datos de Ejemplo

Los seeds incluyen:
- 2 usuarios (admin y user)
- 8 materiales reciclables
- 3 centros de reciclaje (incluyendo "La Recuperadora Guárico 2016 C.A.")
- 9 horarios de recolección por zona
- 4 retos activos
- 5 insignias

## 🔧 Tecnologías Utilizadas

### Backend
- Node.js 18+
- Express.js
- PostgreSQL 15
- JWT para autenticación
- bcryptjs para encriptación
- Firebase Admin SDK (FCM)

### Frontend (Admin Panel)
- React 18
- React Router
- Axios
- Leaflet / OpenStreetMap

### Mobile
- React Native
- React Navigation
- React Native Maps
- Async Storage
- Firebase Cloud Messaging

### DevOps
- Docker
- Docker Compose
- Nginx

## 📱 Características de la App Móvil

### Guía de Separación
La app incluye una guía completa para separar residuos en las siguientes categorías:
- 🔵 **Plástico**: Botellas PET, bolsas, envases
- 🟢 **Vidrio**: Botellas y frascos de vidrio
- 🟡 **Papel**: Periódicos, revistas, cartón
- 🟤 **Orgánico**: Restos de comida, cáscaras
- ⚡ **Electrónicos**: Baterías, celulares, computadoras

### Sistema de Puntos
- Completa retos para ganar puntos
- Desbloquea insignias según tus logros
- Compite con otros usuarios en tu zona

### Recordatorios Inteligentes
- Notificaciones antes de la recolección
- Personalizables por tipo de material
- Configurables según tu zona

## 🌍 Centros de Reciclaje

El sistema incluye un mapa interactivo con centros como:
- **La Recuperadora Guárico 2016 C.A.** (Zona Industrial Guárico)
- Centro de Reciclaje Norte
- Punto Verde Sur

Cada centro incluye:
- 📍 Ubicación en mapa
- 📞 Teléfono de contacto
- 📧 Email
- 🕐 Horarios de atención
- 📦 Materiales aceptados

## 🔐 Seguridad

- Autenticación JWT con tokens seguros
- Contraseñas encriptadas con bcryptjs
- Middleware de autorización por roles
- Variables de entorno para secrets
- Validación de entrada en endpoints

## 🧪 Testing

Para ejecutar tests (cuando estén implementados):

```bash
# Backend
cd packages/backend
npm test

# Admin Panel
cd packages/admin-panel
npm test

# Mobile
cd packages/mobile
npm test
```

## 📈 Roadmap Futuro

- [ ] Tests unitarios y de integración
- [ ] Integración completa de mapas en móvil
- [ ] Sistema de notificaciones push completo
- [ ] Sincronización offline avanzada
- [ ] Estadísticas y analytics
- [ ] Sistema de recompensas físicas
- [ ] Integración con redes sociales
- [ ] Modo oscuro
- [ ] Soporte multiidioma

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia Apache 2.0. Ver el archivo `LICENSE` para más detalles.

## 👥 Autores

- Equipo EcoGestión Local

## 📞 Soporte

Para soporte y consultas:
- 📧 Email: soporte@ecogestion.local
- 🐛 Issues: [GitHub Issues](https://github.com/Suggus1899/System-Eco-Friendly/issues)

## 🙏 Agradecimientos

- A todos los contribuidores del proyecto
- Comunidad de código abierto
- Usuarios que hacen posible un mundo más verde

---

**¡Gracias por usar EcoGestión Local! Juntos por un planeta más verde. 🌍♻️**
