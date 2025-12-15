# Deployment Guide

## Docker Deployment (Recommended)

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+

### Steps

1. **Clone the repository:**
```bash
git clone https://github.com/Suggus1899/System-Eco-Friendly.git
cd System-Eco-Friendly
```

2. **Configure environment variables:**

Create a `.env` file in the `packages/backend` directory:
```bash
cp packages/backend/.env.example packages/backend/.env
```

Edit the `.env` file with your production credentials:
```env
PORT=3000
NODE_ENV=production

DB_HOST=postgres
DB_PORT=5432
DB_NAME=ecogestion
DB_USER=postgres
DB_PASSWORD=your-secure-password

JWT_SECRET=your-very-secure-secret-key
JWT_EXPIRES_IN=7d

FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY=your-private-key
```

3. **Start the services:**
```bash
docker-compose up -d
```

4. **Check service status:**
```bash
docker-compose ps
```

5. **View logs:**
```bash
docker-compose logs -f
```

6. **Access the applications:**
- Backend API: http://localhost:3000
- Admin Panel: http://localhost:3001

### Database Initialization

The database will be automatically initialized with tables and seed data when the backend container starts.

To manually run migrations or seeds:
```bash
# Run migrations
docker-compose exec backend npm run migrate

# Run seeds
docker-compose exec backend npm run seed
```

## Manual Deployment

### Backend Deployment

1. **Set up PostgreSQL:**
```bash
# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE DATABASE ecogestion;
CREATE USER ecogestion_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE ecogestion TO ecogestion_user;
\q
```

2. **Deploy backend:**
```bash
cd packages/backend
npm install --production
cp .env.example .env
# Edit .env with your configuration

# Run migrations
npm run migrate

# Run seeds (optional)
npm run seed

# Start with PM2
npm install -g pm2
pm2 start src/index.js --name ecogestion-backend
pm2 save
pm2 startup
```

### Admin Panel Deployment

1. **Build the React app:**
```bash
cd packages/admin-panel
npm install
REACT_APP_API_URL=https://api.yourdomain.com npm run build
```

2. **Deploy with Nginx:**
```bash
# Install Nginx
sudo apt-get install nginx

# Copy build files
sudo cp -r build/* /var/www/ecogestion-admin/

# Configure Nginx
sudo nano /etc/nginx/sites-available/ecogestion-admin
```

Nginx configuration:
```nginx
server {
    listen 80;
    server_name admin.yourdomain.com;
    root /var/www/ecogestion-admin;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/ecogestion-admin /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

3. **Set up SSL with Let's Encrypt:**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d admin.yourdomain.com
```

### Mobile App Deployment

#### Android

1. **Generate signing key:**
```bash
cd packages/mobile/android/app
keytool -genkeypair -v -storetype PKCS12 -keystore ecogestion.keystore -alias ecogestion -keyalg RSA -keysize 2048 -validity 10000
```

2. **Configure gradle:**

Edit `android/gradle.properties`:
```properties
ECOGESTION_UPLOAD_STORE_FILE=ecogestion.keystore
ECOGESTION_UPLOAD_KEY_ALIAS=ecogestion
ECOGESTION_UPLOAD_STORE_PASSWORD=your-password
ECOGESTION_UPLOAD_KEY_PASSWORD=your-password
```

Edit `android/app/build.gradle`:
```gradle
android {
    ...
    signingConfigs {
        release {
            if (project.hasProperty('ECOGESTION_UPLOAD_STORE_FILE')) {
                storeFile file(ECOGESTION_UPLOAD_STORE_FILE)
                storePassword ECOGESTION_UPLOAD_STORE_PASSWORD
                keyAlias ECOGESTION_UPLOAD_KEY_ALIAS
                keyPassword ECOGESTION_UPLOAD_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

3. **Build APK:**
```bash
cd packages/mobile
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle
cd android
./gradlew assembleRelease
```

The APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

#### iOS

1. **Open Xcode:**
```bash
cd packages/mobile/ios
open EcoGestionLocal.xcworkspace
```

2. **Configure signing:**
- Select your team in Signing & Capabilities
- Set bundle identifier

3. **Archive and upload:**
- Product > Archive
- Distribute App > App Store Connect

## Environment Variables

### Backend

```env
PORT=3000
NODE_ENV=production

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecogestion
DB_USER=postgres
DB_PASSWORD=secure_password

# JWT
JWT_SECRET=very-secure-secret-key-min-32-characters
JWT_EXPIRES_IN=7d

# Firebase Cloud Messaging
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Admin Panel

```env
REACT_APP_API_URL=https://api.yourdomain.com/api
```

### Mobile App

Edit `src/config/api.js`:
```javascript
export const API_URL = 'https://api.yourdomain.com/api';
```

## Security Considerations

1. **Change default passwords** in production
2. **Use strong JWT secrets** (minimum 32 characters)
3. **Enable HTTPS** with SSL certificates
4. **Configure CORS** properly in backend
5. **Use environment variables** for all secrets
6. **Keep dependencies updated**
7. **Enable database backups**
8. **Set up monitoring** and logging
9. **Use a reverse proxy** (Nginx/Apache)
10. **Implement rate limiting**

## Monitoring

### Using PM2

```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs ecogestion-backend

# Restart on crashes
pm2 resurrect
```

### Database Backups

```bash
# Create backup script
cat > backup-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/ecogestion"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
pg_dump -U postgres ecogestion > "$BACKUP_DIR/ecogestion_$DATE.sql"
# Keep only last 7 days
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
EOF

chmod +x backup-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
0 2 * * * /path/to/backup-db.sh
```

## Troubleshooting

### Backend won't start
```bash
# Check logs
docker-compose logs backend

# Check database connection
docker-compose exec postgres psql -U postgres -d ecogestion -c "SELECT 1;"
```

### Database migrations fail
```bash
# Manually run migrations
docker-compose exec backend npm run migrate
```

### Admin panel shows blank page
- Check browser console for errors
- Verify REACT_APP_API_URL is correct
- Check backend is accessible

### Mobile app can't connect to API
- Check API_URL in config
- Verify backend is accessible from device/emulator
- Check CORS settings in backend

## Scaling

### Load Balancing

Use Nginx as a load balancer:
```nginx
upstream backend_servers {
    server backend1:3000;
    server backend2:3000;
    server backend3:3000;
}

server {
    location /api {
        proxy_pass http://backend_servers;
    }
}
```

### Database Replication

Set up PostgreSQL read replicas for better performance.

### Caching

Implement Redis for caching frequently accessed data.

## Support

For deployment issues:
- Check logs: `docker-compose logs -f`
- Open an issue: https://github.com/Suggus1899/System-Eco-Friendly/issues
- Email: soporte@ecogestion.local
