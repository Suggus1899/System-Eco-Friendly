# EcoGestión Local

EcoGestión Local es una plataforma para promover la separación y gestión responsable de residuos mediante una aplicación móvil, una API y un panel administrativo.

## Componentes

- **Backend** (`backend/`): API REST con Node.js, Express y Sequelize. Usa SQLite por defecto y expone autenticación, materiales, centros de acopio, retos, recordatorios, horarios y usuarios.
- **Panel administrativo** (`admin-panel/`): aplicación React para gestionar materiales, centros, retos, horarios y reportes.
- **Aplicación móvil** (`mobile/`): aplicación React Native con inicio de sesión, guía de materiales, mapa de centros, retos, perfil y horarios.

## Requisitos

- Node.js 18 o superior
- npm
- Para la aplicación móvil: Android Studio o Xcode, según la plataforma

## Inicio rápido

1. Clona el repositorio y entra en él:

   ```bash
   git clone https://github.com/Suggus1899/System-Eco-Friendly.git
   cd System-Eco-Friendly
   ```

2. Instala las dependencias del backend y del panel:

   ```bash
   npm install
   ```

3. Configura las variables de entorno copiando los archivos de ejemplo:

   ```bash
   cp backend/.env.example backend/.env
   cp admin-panel/.env.example admin-panel/.env
   cp mobile/.env.example mobile/.env
   ```

4. Inicia backend y panel en paralelo:

   ```bash
   npm run dev
   ```

   La API estará disponible en `http://localhost:3000` y el panel en `http://localhost:3001`.

5. Para cargar datos iniciales en SQLite:

   ```bash
   npm run seed
   ```

La base de datos se crea como `backend/database.sqlite` al iniciar el backend. No incluyas archivos `.env` ni la base de datos en commits. Antes de ejecutar `npm run seed`, define `SEED_PASSWORD` con una contraseña temporal de al menos 12 caracteres.

## Comandos principales

Desde la raíz:

```bash
npm run dev           # Backend y panel
npm run dev:backend   # Solo backend
npm run dev:admin     # Solo panel administrativo
npm run build:backend
npm run build:admin
npm test
npm run seed
```

Para la aplicación móvil:

```bash
cd mobile
npm install
npm start
npm run android      # Android
npm run ios          # iOS
```

## API

La API usa el prefijo `/api`. Entre sus recursos se encuentran:

- `/auth`: registro e inicio de sesión
- `/materials`: materiales y guía de separación
- `/centers`: centros de acopio y ubicaciones
- `/challenges`: retos y progreso
- `/schedules` y `/reminders`: horarios y recordatorios
- `/users`: perfil y progreso del usuario
- `/export`: exportación de información administrativa

Las operaciones protegidas requieren un token JWT en la cabecera `Authorization`.

## Estructura

```text
backend/       API, modelos Sequelize, SQLite y pruebas
admin-panel/   Panel web React
mobile/        Aplicación React Native
```

## Contribución

1. Crea una rama descriptiva a partir de `main`.
2. Mantén los cambios enfocados y añade pruebas cuando corresponda.
3. Verifica los comandos y builds del componente modificado.
4. Abre un pull request con una descripción clara del cambio.

## Licencia

Este proyecto se distribuye bajo la licencia MIT. Consulta [LICENSE](LICENSE) para más información.