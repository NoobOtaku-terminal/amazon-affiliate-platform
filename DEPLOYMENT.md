# 🚀 Deployment Guide

## Local Development Setup

### 1. Prerequisites
Ensure you have the following installed:
- Node.js >= 18.0.0
- PostgreSQL >= 14
- Redis (optional, but recommended)
- Git

### 2. Clone and Setup
```bash
# Clone repository
git clone https://github.com/NoobOtaku-terminal/amazon-affiliate-platform.git
cd amazon-affiliate-platform

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Database Setup
```bash
# Create PostgreSQL database
createdb affiliate_db

# Or using psql
psql -U postgres
CREATE DATABASE affiliate_db;
\q

# Configure backend/.env
DATABASE_URL="postgresql://postgres:password@localhost:5432/affiliate_db"

# Generate Prisma client
cd backend
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Seed database
npm run seed
```

### 4. Configure Environment Variables

**Backend (.env)**
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/affiliate_db

JWT_SECRET=your_super_secure_jwt_secret_minimum_32_characters_long
JWT_REFRESH_SECRET=your_refresh_secret_also_minimum_32_characters

# Email (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your.email@gmail.com
SMTP_PASS=your_gmail_app_password

# Amazon API (get from Amazon Associates)
AMAZON_ACCESS_KEY=your_amazon_access_key
AMAZON_SECRET_KEY=your_amazon_secret_key
AMAZON_PARTNER_TAG=your_affiliate_tag
```

**Frontend (.env)**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 5. Start Development Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

Access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health: http://localhost:5000/health

---

## Docker Development Setup

### Quick Start
```bash
# Copy environment files
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit backend/.env with your credentials
nano backend/.env

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Run Migrations in Docker
```bash
# Access backend container
docker exec -it affiliate_backend sh

# Run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Exit container
exit
```

---

## Production Deployment

### Option 1: AWS (Recommended)

#### Architecture
- **Frontend**: AWS S3 + CloudFront or AWS Amplify
- **Backend**: AWS ECS/Fargate or EC2
- **Database**: AWS RDS (PostgreSQL)
- **Cache**: AWS ElastiCache (Redis)
- **Storage**: AWS S3

#### Steps

1. **Setup RDS PostgreSQL**
```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier affiliate-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password <password> \
  --allocated-storage 20
```

2. **Build and Push Docker Images**
```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build and tag backend
docker build -t affiliate-backend ./backend
docker tag affiliate-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/affiliate-backend:latest

# Push to ECR
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/affiliate-backend:latest
```

3. **Deploy to ECS**
- Create ECS cluster
- Create task definition
- Create service
- Configure load balancer
- Setup auto-scaling

4. **Frontend Deployment**
```bash
# Build frontend
cd frontend
npm run build

# Deploy to S3
aws s3 sync build/ s3://your-bucket-name

# Invalidate CloudFront
aws cloudfront create-invalidation \
  --distribution-id YOUR_DIST_ID \
  --paths "/*"
```

---

### Option 2: Vercel (Frontend) + Render (Backend)

#### Backend on Render

1. **Connect GitHub Repository**
   - Go to https://render.com
   - New > Web Service
   - Connect GitHub repo
   - Select `backend` as root directory

2. **Configure Service**
```yaml
Name: affiliate-backend
Environment: Node
Build Command: npm install && npx prisma generate
Start Command: npm run start:prod
```

3. **Environment Variables**
Add all variables from `.env.example`

4. **Add PostgreSQL Database**
   - Create new PostgreSQL database on Render
   - Copy DATABASE_URL to backend environment

#### Frontend on Vercel

1. **Import Project**
   - Go to https://vercel.com
   - Import Git Repository
   - Select root directory: `frontend`

2. **Configure Build**
```
Framework Preset: Create React App
Build Command: npm run build
Output Directory: build
```

3. **Environment Variables**
```
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

---

### Option 3: DigitalOcean / VPS

#### 1. Server Setup
```bash
# SSH into server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Install Nginx
apt install -y nginx

# Install PM2
npm install -g pm2

# Install Docker (optional)
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

#### 2. Clone and Setup
```bash
# Clone repository
git clone https://github.com/NoobOtaku-terminal/amazon-affiliate-platform.git
cd amazon-affiliate-platform

# Setup backend
cd backend
npm install
npx prisma generate
npx prisma migrate deploy

# Setup frontend
cd ../frontend
npm install
npm run build
```

#### 3. Configure Nginx
```nginx
# /etc/nginx/sites-available/affiliate
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/affiliate/frontend/build;
        try_files $uri /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/affiliate /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

#### 4. Start Backend with PM2
```bash
cd backend
pm2 start src/server.js --name affiliate-backend
pm2 save
pm2 startup
```

#### 5. SSL with Let's Encrypt
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```

---

## Environment-Specific Configurations

### Development
```env
NODE_ENV=development
LOG_LEVEL=debug
CORS_ORIGIN=http://localhost:3000
```

### Staging
```env
NODE_ENV=staging
LOG_LEVEL=info
CORS_ORIGIN=https://staging.your-domain.com
```

### Production
```env
NODE_ENV=production
LOG_LEVEL=warn
CORS_ORIGIN=https://your-domain.com
```

---

## Database Migrations

### Development
```bash
# Create migration
npx prisma migrate dev --name description

# Reset database
npx prisma migrate reset
```

### Production
```bash
# Apply migrations
npx prisma migrate deploy

# Never use migrate dev in production!
```

---

## Monitoring & Logging

### PM2 Monitoring
```bash
# View logs
pm2 logs affiliate-backend

# Monitor processes
pm2 monit

# View status
pm2 status
```

### Application Logs
Logs are stored in `backend/logs/`:
- `combined-YYYY-MM-DD.log` - All logs
- `error-YYYY-MM-DD.log` - Error logs only

---

## Backup Strategy

### Database Backup
```bash
# Automated daily backup
crontab -e

# Add this line (daily at 2 AM)
0 2 * * * pg_dump affiliate_db > /backups/db-$(date +\%Y\%m\%d).sql

# Restore from backup
psql affiliate_db < /backups/db-20251028.sql
```

---

## Security Checklist

- [ ] Change all default passwords
- [ ] Set strong JWT secrets (32+ characters)
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall (UFW)
- [ ] Set up fail2ban
- [ ] Regular security updates
- [ ] Environment variables secured
- [ ] Rate limiting configured
- [ ] CORS properly set
- [ ] Database backups automated

---

## Performance Optimization

### Backend
1. Enable Redis caching
2. Add database connection pooling
3. Implement response compression
4. Use CDN for static assets
5. Enable HTTP/2

### Frontend
1. Code splitting
2. Image optimization
3. Lazy loading
4. Service workers (PWA)
5. Bundle size optimization

---

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Find process
lsof -i :5000

# Kill process
kill -9 <PID>
```

**Database connection failed**
- Check DATABASE_URL format
- Verify PostgreSQL is running
- Check network connectivity
- Verify credentials

**Prisma migration errors**
```bash
# Reset Prisma
rm -rf node_modules/.prisma
npx prisma generate
```

**JWT token errors**
- Ensure secrets are 32+ characters
- Check token expiration settings
- Verify CORS configuration

---

## Support & Maintenance

### Regular Tasks
- [ ] Weekly: Check logs for errors
- [ ] Weekly: Review API performance
- [ ] Monthly: Update dependencies
- [ ] Monthly: Database optimization
- [ ] Quarterly: Security audit

---

## Scaling Considerations

### Horizontal Scaling
- Load balancer (Nginx/HAProxy)
- Multiple backend instances
- Session storage in Redis
- Database read replicas

### Vertical Scaling
- Upgrade server resources
- Optimize queries
- Add indexes
- Cache frequently accessed data

---

## Rollback Procedure

```bash
# Rollback to previous version
git checkout <previous-commit>

# Rollback database migration
npx prisma migrate resolve --rolled-back <migration-name>

# Restart services
pm2 restart affiliate-backend
```

---

For additional help, open an issue on GitHub:
https://github.com/NoobOtaku-terminal/amazon-affiliate-platform/issues
