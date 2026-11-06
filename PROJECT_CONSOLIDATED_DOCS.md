# Documentación técnica

## Arquitectura

El repositorio es un monorepo con una implementación canónica en la raíz:

- `backend/`: API REST con Node.js, Express, Sequelize y SQLite.
- `admin-panel/`: panel web React para administración.
- `mobile/`: aplicación React Native para usuarios.

La carpeta `packages/` fue retirada porque contenía una implementación anterior y divergente.

## Desarrollo

```bash
npm install
cp backend/.env.example backend/.env
cp admin-panel/.env.example admin-panel/.env
cp mobile/.env.example mobile/.env
npm run dev
```

La API escucha en `http://localhost:3000` y el panel en `http://localhost:3001`.

## Variables obligatorias

`backend/.env` debe definir `JWT_SECRET` con al menos 32 caracteres. Para cargar datos de desarrollo:

```bash
SEED_PASSWORD='una-clave-temporal-de-12-caracteres' npm run seed
```

No se deben guardar archivos `.env`, bases de datos SQLite ni credenciales en Git.

## Validación

```bash
npm run build:backend
npm run build:admin
npm test
```

La aplicación móvil requiere un entorno React Native nativo y se valida con `npm test`, `npm run android` o `npm run ios`.

## API

Los recursos principales están bajo `/api`: `auth`, `materials`, `centers`, `schedules`, `challenges`, `users`, `reminders` y `export`. Las rutas protegidas requieren un token JWT en `Authorization`.
