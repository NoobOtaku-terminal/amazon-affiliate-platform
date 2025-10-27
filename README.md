# 🚀 Amazon Affiliate Marketing Platform

Enterprise-grade, production-ready Amazon affiliate marketing web application built with React.js, Express.js, and PostgreSQL.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.x-blue.svg)

## ✨ Features

### 🎯 Core Functionality
- **Product Display & Filtering**: Advanced search, filter, and sort capabilities
- **Real-time Deal Updates**: Auto-refresh system for latest deals and price changes
- **Product Comparison**: Side-by-side comparison of up to 4 products
- **Auto-sync System**: Scheduled jobs for Amazon product data synchronization
- **User Authentication**: JWT-based secure authentication with role-based access
- **Admin Dashboard**: Complete CRUD operations for products, deals, and categories
- **SEO Optimized**: Dynamic meta tags, JSON-LD schema, sitemap generation
- **Responsive Design**: Mobile-first approach with TailwindCSS

### 🔒 Security Features
- JWT authentication with refresh tokens
- bcrypt password hashing (12 rounds)
- Rate limiting & IP throttling
- CORS protection
- Helmet security headers
- Input sanitization
- CSRF protection
- SQL injection prevention

### ⚡ Performance
- Redis caching layer
- Image lazy loading
- PWA support
- Code splitting
- Database indexing
- Query optimization
- CDN integration ready

## 🏗️ Architecture

```
amazon-affiliate-platform/
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Database models (Prisma)
│   │   ├── routes/         # API routes
│   │   ├── middlewares/    # Custom middleware
│   │   ├── services/       # Business logic
│   │   ├── jobs/           # Cron jobs
│   │   ├── utils/          # Utility functions
│   │   ├── app.js          # Express app setup
│   │   └── server.js       # Server entry point
│   ├── prisma/             # Database schema
│   ├── tests/              # Test suites
│   └── Dockerfile
├── frontend/               # React.js application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Redux store
│   │   ├── services/       # API services
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Utility functions
│   │   ├── styles/         # Global styles
│   │   └── App.jsx         # Root component
│   ├── public/             # Static assets
│   └── Dockerfile
├── nginx/                  # Nginx configuration
├── docker-compose.yml      # Docker orchestration
└── .github/                # CI/CD workflows
```

## 🛠️ Tech Stack

### Frontend
- **React 18+**: UI library
- **Redux Toolkit**: State management
- **React Router 6**: Routing
- **TailwindCSS**: Styling
- **React Query**: Data fetching & caching
- **Axios**: HTTP client
- **React Helmet Async**: SEO management
- **Framer Motion**: Animations
- **React Hook Form + Yup**: Form validation

### Backend
- **Node.js 18+**: Runtime
- **Express.js 5**: Web framework
- **PostgreSQL**: Database
- **Prisma**: ORM
- **JWT**: Authentication
- **bcrypt**: Password hashing
- **node-cron**: Scheduled jobs
- **Winston**: Logging
- **Nodemailer**: Email service
- **Redis**: Caching (optional)

### DevOps
- **Docker**: Containerization
- **Nginx**: Reverse proxy
- **GitHub Actions**: CI/CD
- **PM2**: Process management

## 📋 Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 14
- Docker & Docker Compose (for containerized setup)
- Amazon Product Advertising API credentials
- SMTP credentials (for email)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/NoobOtaku-terminal/amazon-affiliate-platform.git
cd amazon-affiliate-platform
```

### 2. Environment Setup

```bash
# Copy environment example files
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit .env files with your credentials
nano .env
```

### 3. Docker Setup (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Nginx: http://localhost:80

### 4. Manual Setup (Without Docker)

#### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database (optional)
npm run seed

# Start development server
npm run dev

# Start production server
npm run start
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 📊 Database Schema

### Main Tables
- **users**: User accounts with authentication
- **products**: Amazon product catalog
- **deals**: Time-limited deals and discounts
- **categories**: Product categorization
- **reviews**: User product reviews
- **sync_logs**: Amazon API sync audit trail
- **comparisons**: Product comparison history

### Key Features
- Full-text search indexes
- Composite indexes for performance
- Foreign key constraints
- Automatic timestamps

## 🔄 Auto-Sync System

The platform includes an automated synchronization system that:

- Runs every 6 hours (configurable)
- Fetches latest deals from Amazon
- Updates product prices
- Detects new product launches
- Marks expired deals as inactive
- Logs all sync activities

Configure sync interval in `backend/src/jobs/amazonSync.job.js`

## 🔐 API Authentication

### Register
```bash
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### Login
```bash
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### Protected Routes
Include JWT token in Authorization header:
```bash
Authorization: Bearer <your_jwt_token>
```

## 📡 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register new user | ❌ |
| POST | /api/auth/login | User login | ❌ |
| POST | /api/auth/refresh | Refresh token | ✅ |
| GET | /api/products | List all products | ❌ |
| GET | /api/products/:id | Get product details | ❌ |
| POST | /api/products | Create product | ✅ Admin |
| PUT | /api/products/:id | Update product | ✅ Admin |
| DELETE | /api/products/:id | Delete product | ✅ Admin |
| GET | /api/deals | Get active deals | ❌ |
| GET | /api/categories | List categories | ❌ |
| POST | /api/reviews | Add review | ✅ |
| GET | /api/reviews/:productId | Get product reviews | ❌ |
| GET | /api/compare | Compare products | ❌ |
| POST | /api/sync/amazon | Trigger manual sync | ✅ Admin |

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

## 📈 SEO Optimization

- ✅ Dynamic meta tags (React Helmet)
- ✅ JSON-LD structured data
- ✅ Sitemap generation
- ✅ Canonical URLs
- ✅ Open Graph tags
- ✅ Twitter Cards
- ✅ Breadcrumb navigation
- ✅ Image alt attributes
- ✅ Lazy loading
- ✅ PWA support

Target: **Lighthouse SEO Score ≥ 90**

## 🚢 Deployment

### AWS Deployment
```bash
# Build Docker images
docker-compose build

# Push to AWS ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Deploy with ECS/EKS
```

### Vercel (Frontend) + Render (Backend)
```bash
# Frontend: Connect GitHub to Vercel
# Backend: Connect GitHub to Render
# Database: Use managed PostgreSQL
```

## 📝 Environment Variables

See `.env.example` for complete list of required environment variables.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Dheeraj Dhakar**
- GitHub: [@NoobOtaku-terminal](https://github.com/NoobOtaku-terminal)
- LinkedIn: [Dheeraj Dhakar](https://linkedin.com/in/dheeraj-dhakar)

## 🙏 Acknowledgments

- Amazon Product Advertising API
- React.js community
- Express.js team
- PostgreSQL contributors

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Email: support@affiliate.com

---

⭐ **Star this repository if you find it helpful!**
