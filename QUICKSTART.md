# 🚀 Quick Start Guide

Get EcoGestión Local up and running in 5 minutes!

## Option 1: Docker (Easiest - Recommended)

### Requirements
- Docker
- Docker Compose

### Steps

1. **Clone and start:**
```bash
git clone https://github.com/Suggus1899/System-Eco-Friendly.git
cd System-Eco-Friendly
docker-compose up -d
```

2. **Wait for services to start (about 30 seconds)**

3. **Access the applications:**
- 🌐 Backend API: http://localhost:3000
- 👨‍💼 Admin Panel: http://localhost:3001
- 📊 API Documentation: See `API_DOCUMENTATION.md`

4. **Login to Admin Panel:**
- Email: `admin@ecogestion.local`
- Password: `admin123`

That's it! 🎉

## Option 2: Manual Setup

### Requirements
- Node.js 18+
- PostgreSQL 15+
- npm

### Backend Setup

```bash
# 1. Install PostgreSQL and create database
createdb ecogestion

# 2. Setup backend
cd packages/backend
npm install
cp .env.example .env
# Edit .env with your database credentials

# 3. Initialize database
npm run migrate
npm run seed

# 4. Start backend
npm run dev
```

Backend will run on http://localhost:3000

### Admin Panel Setup

```bash
# 1. Install and configure
cd packages/admin-panel
npm install
echo "REACT_APP_API_URL=http://localhost:3000/api" > .env

# 2. Start development server
npm start
```

Admin Panel will run on http://localhost:3000 (or 3001 if 3000 is taken)

### Mobile App Setup

```bash
# 1. Install dependencies
cd packages/mobile
npm install

# 2. Run on iOS
npx react-native run-ios

# 3. Or run on Android
npx react-native run-android
```

## Testing the API

### Using curl

```bash
# Register a new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "name": "Test User",
    "zone": "Norte"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ecogestion.local",
    "password": "admin123"
  }'

# Get materials (no auth required)
curl http://localhost:3000/api/materials

# Search materials
curl http://localhost:3000/api/materials/search?q=plastico
```

### Using the Admin Panel

1. Open http://localhost:3001
2. Login with admin credentials
3. Navigate to "Materiales" to manage materials
4. Click "Nuevo Material" to add new recyclable materials
5. Approve/reject materials submitted by users

## Common Issues

### Port already in use
```bash
# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or change the port in .env
PORT=3001
```

### Database connection error
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Or with Docker
docker-compose ps postgres
docker-compose logs postgres
```

### Docker container won't start
```bash
# Check logs
docker-compose logs -f

# Restart services
docker-compose down
docker-compose up -d

# Rebuild if needed
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Admin Panel shows blank page
- Open browser console (F12)
- Check if API URL is correct in `.env`
- Verify backend is running: `curl http://localhost:3000/`

## Next Steps

1. 📖 Read the [README.md](README.md) for detailed documentation
2. 🔌 Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API reference
3. 🚀 Read [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
4. 🔧 Customize materials, centers, and challenges in the admin panel
5. 📱 Build the mobile app for your device

## Default Accounts

**Administrator:**
- Email: `admin@ecogestion.local`
- Password: `admin123`
- Role: admin
- Can create, edit, delete, and approve all content

**Regular User:**
- Email: `user@ecogestion.local`
- Password: `user123`
- Role: user
- Can create content (requires admin approval)

## Pre-loaded Data

The database includes sample data:
- ✅ 8 recyclable materials
- ✅ 3 recycling centers (including "La Recuperadora Guárico 2016 C.A.")
- ✅ 9 collection schedules
- ✅ 4 active challenges
- ✅ 5 badges

## Key Features to Try

1. **Material Search**: Use the search bar to find how to recycle specific items
2. **Collection Schedule**: Check when recycling is collected in your zone
3. **Challenges**: Complete weekly challenges to earn points
4. **Map**: Find nearby recycling centers
5. **Badges**: Earn badges by accumulating points

## Getting Help

- 📝 Check the [README.md](README.md)
- 🐛 Report issues: https://github.com/Suggus1899/System-Eco-Friendly/issues
- 📧 Email: soporte@ecogestion.local

---

**Happy Recycling! ♻️🌍**
