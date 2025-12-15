# Guía de Despliegue - EcoGestión Local MVP

## 🚀 Inicio Rápido (5 minutos)

### Requisitos Previos
- Docker y Docker Compose instalados
- Node.js 18+ (opcional, solo si no usas Docker)
- PostgreSQL 15+ (opcional, solo si no usas Docker)

### Despliegue con Docker (Recomendado)

```bash
# 1. Clonar el repositorio
git clone https://github.com/Suggus1899/System-Eco-Friendly.git
cd System-Eco-Friendly

# 2. Configurar variables de entorno
cp backend/.env.example backend/.env
cp admin-panel/.env.example admin-panel/.env

# 3. Levantar todos los servicios
docker-compose up -d

# 4. Esperar a que la base de datos esté lista (30 segundos)
sleep 30

# 5. Ejecutar seeds (datos de ejemplo)
docker-compose exec backend npm run seed

# ¡Listo! Los servicios están corriendo:
# - API Backend: http://localhost:3000
# - Admin Panel: http://localhost:3001
# - PostgreSQL: localhost:5432
```

### Credenciales de Prueba

**Admin Panel:**
- Email: `admin@ecogestion.com`
- Password: `password123`

**Usuario Regular (Mobile App):**
- Email: `usuario1@example.com`
- Password: `password123`

## 📱 Configuración de Mobile App

La aplicación móvil requiere configuración adicional para React Native.

### Android

```bash
cd mobile

# Instalar dependencias
npm install

# Instalar React Native CLI globalmente (si no lo tienes)
npm install -g react-native-cli

# Configurar variables de entorno
cp .env.example .env

# Editar mobile/.env y cambiar la URL de la API
# Para emulador Android: API_URL=http://10.0.2.2:3000/api
# Para dispositivo físico: API_URL=http://TU_IP_LOCAL:3000/api

# Ejecutar en Android
npx react-native run-android
```

### iOS

```bash
cd mobile

# Instalar dependencias
npm install

# Instalar pods
cd ios && pod install && cd ..

# Configurar variables de entorno
cp .env.example .env

# Editar mobile/.env
# Para simulador iOS: API_URL=http://localhost:3000/api
# Para dispositivo físico: API_URL=http://TU_IP_LOCAL:3000/api

# Ejecutar en iOS
npx react-native run-ios
```

## 🔧 Instalación Manual (Sin Docker)

### 1. Backend

```bash
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Editar .env con tus credenciales de PostgreSQL
nano .env

# Crear base de datos en PostgreSQL
psql -U postgres
CREATE DATABASE ecogestion_db;
\q

# Ejecutar schema SQL
psql -U postgres -d ecogestion_db -f db/init.sql

# Ejecutar seeds
npm run seed

# Iniciar servidor
npm run dev

# El backend estará en http://localhost:3000
```

### 2. Admin Panel

```bash
cd admin-panel

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# El .env por defecto apunta a http://localhost:3000/api
# Si tu backend está en otra dirección, edítalo

# Iniciar en desarrollo
npm start

# El panel admin estará en http://localhost:3001
```

### 3. Mobile App

Ver sección "Configuración de Mobile App" arriba.

## 🌐 Configuración de Producción

### Backend

```bash
# 1. Configurar variables de entorno de producción
nano backend/.env
```

Actualizar:
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgres://usuario:password@host:5432/ecogestion_db
JWT_SECRET=un-secret-muy-seguro-cambiar-esto
JWT_EXPIRES_IN=7d
FCM_SERVER_KEY=tu-fcm-server-key-real
```

```bash
# 2. Construir para producción
cd backend
npm run build

# 3. Iniciar en producción
npm start
```

### Admin Panel

```bash
# 1. Configurar URL de producción
nano admin-panel/.env
```

Actualizar:
```env
REACT_APP_API_URL=https://tu-dominio.com/api
```

```bash
# 2. Construir para producción
cd admin-panel
npm run build

# 3. Servir con nginx o cualquier servidor web
# Los archivos están en admin-panel/build/
```

### Mobile App

```bash
# 1. Configurar URL de producción
nano mobile/.env
```

Actualizar:
```env
API_URL=https://tu-dominio.com/api
FCM_SENDER_ID=tu-fcm-sender-id-real
```

**Android:**
```bash
cd mobile/android
./gradlew assembleRelease
# APK en: android/app/build/outputs/apk/release/app-release.apk
```

**iOS:**
```bash
cd mobile/ios
xcodebuild -workspace EcoGestion.xcworkspace -scheme EcoGestion -configuration Release
```

## 🔐 Configuración de Firebase Cloud Messaging (FCM)

Para habilitar las notificaciones push:

1. Crear proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Agregar aplicaciones Android e iOS
3. Descargar `google-services.json` (Android) y `GoogleService-Info.plist` (iOS)
4. Colocar archivos en:
   - Android: `mobile/android/app/google-services.json`
   - iOS: `mobile/ios/GoogleService-Info.plist`
5. Obtener Server Key de Firebase Console > Project Settings > Cloud Messaging
6. Actualizar `FCM_SERVER_KEY` en `backend/.env`

## 🗺️ Configuración de Mapas (Leaflet/OpenStreetMap)

Los mapas están listos para funcionar con Leaflet/OpenStreetMap. No requiere API keys.

Para la mobile app con React Native Maps:

**Android (`mobile/android/app/src/main/AndroidManifest.xml`):**
```xml
<application>
  ...
  <meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="TU_GOOGLE_MAPS_API_KEY"/>
</application>
```

**iOS (`mobile/ios/Podfile`):**
```ruby
# Ya configurado, solo necesitas ejecutar:
cd mobile/ios && pod install
```

## 📊 Verificación del Despliegue

### Health Check del Backend
```bash
curl http://localhost:3000/health
# Respuesta esperada: {"status":"ok","timestamp":"..."}
```

### Prueba de Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ecogestion.com","password":"password123"}'
```

### Verificar Base de Datos
```bash
# Con Docker
docker-compose exec postgres psql -U postgres -d ecogestion_db -c "SELECT COUNT(*) FROM users;"

# Sin Docker
psql -U postgres -d ecogestion_db -c "SELECT COUNT(*) FROM users;"
# Debería mostrar 4 usuarios
```

## 🐛 Solución de Problemas

### Backend no inicia
```bash
# Verificar logs
docker-compose logs backend

# Verificar conexión a base de datos
docker-compose exec backend npm run seed
```

### Admin panel no conecta con backend
1. Verificar que backend esté corriendo: `curl http://localhost:3000/health`
2. Verificar CORS en `backend/src/app.js`
3. Verificar `REACT_APP_API_URL` en `admin-panel/.env`

### Mobile app no conecta con backend
1. En emulador Android, usar `http://10.0.2.2:3000/api` en vez de `localhost`
2. En dispositivo físico, usar tu IP local (ejemplo: `http://192.168.1.100:3000/api`)
3. Asegurar que el backend esté accesible desde la red local

### Errores de base de datos
```bash
# Reiniciar base de datos
docker-compose down
docker-compose up -d postgres
sleep 10
docker-compose exec postgres psql -U postgres -d ecogestion_db -f /docker-entrypoint-initdb.d/init.sql
docker-compose up -d backend
```

## 📈 Monitoreo y Logs

### Ver logs en tiempo real
```bash
# Todos los servicios
docker-compose logs -f

# Solo backend
docker-compose logs -f backend

# Solo base de datos
docker-compose logs -f postgres
```

### Acceder a la base de datos
```bash
docker-compose exec postgres psql -U postgres -d ecogestion_db
```

## 🔒 Recomendaciones de Seguridad para Producción

1. **Cambiar JWT_SECRET** a un valor aleatorio y seguro
2. **Usar HTTPS** en producción (Let's Encrypt, Cloudflare)
3. **Agregar rate limiting** (ver SECURITY_SUMMARY.md)
4. **Configurar firewall** para limitar acceso a PostgreSQL
5. **Backup regular** de la base de datos
6. **Actualizar dependencias** regularmente
7. **Usar secrets manager** para variables sensibles (AWS Secrets Manager, etc.)

## 📚 Recursos Adicionales

- [README.md](README.md) - Documentación completa del proyecto
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - Documentación de la API
- [SECURITY_SUMMARY.md](SECURITY_SUMMARY.md) - Resumen de seguridad

## 🆘 Soporte

Para problemas o preguntas:
1. Revisar esta guía de despliegue
2. Verificar logs de Docker: `docker-compose logs`
3. Crear un issue en el repositorio de GitHub

---

**¡Feliz despliegue!** 🎉
