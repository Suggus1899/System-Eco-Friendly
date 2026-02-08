# EcoGestión Local - Documentación Consolidada del Proyecto

## Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Estado del Proyecto](#estado-del-proyecto)
3. [Inicio Rápido](#inicio-rápido)
4. [Arquitectura](#arquitectura)
5. [Despliegue](#despliegue)
6. [Documentación API](#documentación-api)
7. [Seguridad](#seguridad)
8. [Guía de Contribución](#guía-de-contribución)
9. [Historial de Cambios](#historial-de-cambios)

---

## Visión General

_(Extraído de README.md)_

**EcoGestión Local** es un sistema integral de gestión de residuos y conciencia ecológica que incluye aplicación móvil (Android/iOS), backend y panel administrativo web.

### Características Principales

- **Mobile Component**: React Native app para usuarios finales con guía de separación, mapa de centros, y gamificación.
- **Backend**: Node.js + Express + PostgreSQL para la lógica de negocio y persistencia de datos.
- **Admin Panel**: React app para administradores gestionar materiales, centros, y usuarios.

---

## Estado del Proyecto

_(Extraído de PROJECT_STATUS.md)_

**Estado Actual:** ✅ COMPLETE - Ready for Production (v1.0.0)
**Fecha:** 15 de Diciembre, 2025

El proyecto ha alcanzado el hito de MVP con todas las funcionalidades core implementadas:

- Sistema completo de Backend con 20+ endpoints.
- Panel administrativo funcional.
- Aplicación móvil con navegación y funcionalidades offline.
- Configuración de DevOps con Docker completa.

---

## Inicio Rápido

_(Extraído de QUICKSTART.md)_

¡Levanta el proyecto en 5 minutos!

### Requisitos con Docker (Recomendado)

- Docker
- Docker Compose

### Pasos

1. **Clonar y arrancar:**
   ```bash
   git clone https://github.com/Suggus1899/System-Eco-Friendly.git
   cd System-Eco-Friendly
   docker-compose up -d
   ```
2. **Esperar 30 segundos** para que los servicios inicien.
3. **Acceder:**
   - Backend API: http://localhost:3000
   - Admin Panel: http://localhost:3001
4. **Credenciales Admin:**
   - Email: `admin@ecogestion.local`
   - Password: `admin123`

---

## Arquitectura

_(Extraído de README.md e IMPLEMENTATION_SUMMARY.md)_

El proyecto es un monorepo dividido en:

### 1. Mobile App (`/packages/mobile`)

- **Tech**: React Native, React Navigation, React Native Maps.
- **Features**: Guía de reciclaje, mapa de centros, perfil de usuario, retos.

### 2. Backend (`/packages/backend`)

- **Tech**: Node.js, Express, PostgreSQL, JWT.
- **Features**: API RESTful, Auth, gestión de base de datos.
- **Base de Datos**: 9 tablas incluyendo users, materials, centers, challenges.

### 3. Admin Panel (`/packages/admin-panel`)

- **Tech**: React, Axios, CSS Modules.
- **Features**: Dashboard, CRUD de materiales y centros, validación de contenidos.

### 4. Infraestructura

- Docker Compose para orquestar Backend, Frontend (Nginx), y Database.

---

## Despliegue

_(Extraído de DEPLOYMENT.md y DEPLOYMENT_GUIDE.md)_

### Despliegue con Docker (Producción)

1. Configurar variables de entorno en `.env` (usar `.env.example` como base).
2. Ejecutar: `docker-compose up -d`.
3. Para persistencia, asegurarse de que los volúmenes de Docker estén correctamente mapeados.

### Despliegue Manual

**Backend:**

1. Instalar PostgreSQL.
2. `npm install` en `packages/backend`.
3. `npm run migrate` y `npm run seed`.
4. `npm start`.

**Admin Panel:**

1. `npm install` en `packages/admin-panel`.
2. `npm run build`.
3. Servir el contenido de `build/` con Nginx o Apache.

**Mobile:**

- Android: `./gradlew assembleRelease` en `packages/mobile/android`.
- iOS: Archive en Xcode.

### Configuración de Mapas

El proyecto usa Leaflet/OpenStreetMap por defecto, no requiere API Keys para web. Para mobile, se puede configurar Google Maps API Key en `AndroidManifest.xml` si se desea usar Google Maps.

---

## Documentación API

_(Resumen de API_DOCUMENTATION.md)_

**Base URL**: `http://localhost:3000/api`

### Auth

- `POST /auth/register`: Registro.
- `POST /auth/login`: Login (retorna JWT).

### Endpoints Principales

- **Materiales**: `GET /materials` (lista), `POST /materials` (admin crear).
- **Centros**: `GET /centers` (lista), `GET /centers/nearby` (geolocalización).
- **Retos**: `GET /challenges/weekly`, `POST /challenges/:id/complete`.
- **Usuarios**: `GET /users/profile`, `GET /users/progress`.

_Nota: Todos los endpoints de escritura requieren Auth Header: `Authorization: Bearer <token>`._

---

## Seguridad

_(Extraído de SECURITY_SUMMARY.md)_

El sistema cumple con estándares de seguridad para MVP:

- **Autenticación**: JWT seguro.
- **Passwords**: Hashing con bcryptjs.
- **Inyección SQL**: Prevenida mediante consultas parametrizadas.
- **CORS & Helmet**: Configurados para protección de cabeceras y orígenes.

**Recomendaciones para Producción:**

- Implementar Rate Limiting.
- Usar HTTPS estrictamente.
- Rotar secretos de JWT regularmente.

---

## Guía de Contribución

_(Extraído de CONTRIBUTING.md)_

1. Fork el repositorio.
2. Crear rama `feature/mi-feature`.
3. Commits siguiendo convención (e.g., `feat: nueva funcionalidad`).
4. Tests: Ejecutar `npm test` en los paquetes modificados.
5. Pull Request con descripción detallada.

---

## Historial de Cambios

_(Resumen de CHANGELOG.md)_

**v1.0.0 - 2025-12-15**

- Lanzamiento inicial MVP.
- Completado Backend, Admin Panel y estructura Mobile.
- Implementación de Docker y CI/CD básico.
- Documentación completa.

---

_Documento generado automáticamente consolidando la documentación del proyecto EcoGestión Local._
