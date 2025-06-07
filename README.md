# 🚀 VibeCoder - Premium Vibecoding Marketplace

<div align="center">

![VibeCoder Logo](https://img.shields.io/badge/VibeCoder-Premium%20Marketplace-6366f1?style=for-the-badge&logo=react)

**The ultimate marketplace for vibecoding professionals to buy, sell, and showcase premium coding projects.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)

[🌟 Live Demo](https://vibecoder.com) • [📚 Documentation](./docs) • [🐛 Report Bug](https://github.com/manan0901/Vibecoder/issues) • [✨ Request Feature](https://github.com/manan0901/Vibecoder/issues)

</div>

---

## 🎯 **What is VibeCoder?**

VibeCoder is a **premium marketplace platform** designed specifically for **vibecoding professionals** - developers who create high-quality, aesthetically pleasing, and functionally superior coding projects. Our platform enables:

- 💰 **Developers** to earn ₹50K-₹2L monthly by selling premium projects
- 🛒 **Buyers** to access high-quality, tested coding solutions
- 🎨 **Vibecoding Community** to showcase and monetize their skills

A digital marketplace platform for Indian coders and vibecoders to sell and buy complete projects, scripts, and digital products.

## 🚀 Project Overview

VibeCoder Marketplace is similar to ThemeForest or CodeCanyon but specifically designed for the Indian coding community. It enables developers to monetize their projects by selling complete solutions including websites, mobile apps, scripts, and other digital products.

### Key Features

- **Seller Portal**: Upload, manage, and sell coding projects
- **Buyer Portal**: Browse, purchase, and instantly download projects
- **Admin Panel**: Moderate content, manage users, and track analytics
- **Secure Payments**: Integrated with Razorpay, Paytm, and UPI
- **Instant Downloads**: Secure file delivery system
- **Rating System**: Review and rating system for quality assurance

## 🏗️ Architecture

```
Frontend (React.js/Next.js)
├── Seller Dashboard
├── Buyer Interface
├── Admin Panel
└── Public Marketplace

Backend (Node.js/Express)
├── Authentication Service
├── Project Management
├── Payment Processing
├── File Management
└── Admin Controls

Database (PostgreSQL)
├── Users & Profiles
├── Projects & Metadata
├── Transactions
└── Reviews & Ratings

File Storage (AWS S3)
├── Project Files
├── Screenshots
├── Documentation
└── Secure Downloads
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt
- **File Upload**: Multer with AWS S3
- **Payments**: Razorpay SDK
- **Email**: Nodemailer with Gmail SMTP
- **Security**: Helmet, CORS, Rate Limiting

### DevOps & Tools
- **Version Control**: Git
- **Package Manager**: npm
- **Environment**: Docker (optional)
- **File Storage**: AWS S3
- **Deployment**: Vercel (Frontend) + Railway/Heroku (Backend)

## 📁 Project Structure

```
vibecoder/
├── frontend/                 # Next.js frontend application
│   ├── components/          # Reusable UI components
│   ├── pages/              # Next.js pages
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities and configurations
│   ├── stores/             # Zustand state stores
│   └── types/              # TypeScript type definitions
├── backend/                 # Express.js backend API
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── utils/          # Helper functions
│   ├── prisma/             # Database schema and migrations
│   └── uploads/            # Temporary file storage
├── shared/                  # Shared types and utilities
├── docs/                   # Documentation
└── scripts/                # Build and deployment scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- AWS Account (for S3 storage)
- Razorpay Account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vibecoder
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   
   Create `.env` files in both frontend and backend directories:
   
   **Backend (.env)**
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/vibecoder"
   JWT_SECRET="your-super-secret-jwt-key"
   RAZORPAY_KEY_ID="your-razorpay-key-id"
   RAZORPAY_KEY_SECRET="your-razorpay-key-secret"
   AWS_ACCESS_KEY_ID="your-aws-access-key"
   AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
   AWS_BUCKET_NAME="your-s3-bucket-name"
   AWS_REGION="ap-south-1"
   EMAIL_USER="your-gmail@gmail.com"
   EMAIL_PASS="your-app-password"
   FRONTEND_URL="http://localhost:3000"
   PORT=5000
   ```
   
   **Frontend (.env.local)**
   ```
   NEXT_PUBLIC_API_URL="http://localhost:5000/api"
   NEXT_PUBLIC_RAZORPAY_KEY_ID="your-razorpay-key-id"
   ```

4. **Database Setup**
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Start Development Servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/api/docs

## 📋 Development Approach

This project follows a **task-based development approach** for better organization and error prevention. 

### 📝 Task Management
- **Detailed Task Breakdown**: See [TASKS.md](TASKS.md) for comprehensive task management
- **Phase-by-Phase Development**: Organized into 7 phases with 25+ detailed tasks
- **Clear Acceptance Criteria**: Each task has specific requirements and deliverables
- **Progress Tracking**: Real-time status updates and milestone tracking

### Development Phases

#### Phase 1: Foundation & Setup (Week 1-2)
- [x] **Task 1.1**: Project Structure Setup ✅
- [🔄] **Task 1.2**: Environment Configuration (In Progress)
- [⏳] **Task 1.3**: Database Setup
- [⏳] **Task 1.4**: Basic API Structure

#### Phase 2: Authentication & User Management (Week 3)
- [⏳] **Task 2.1**: User Authentication System
- [⏳] **Task 2.2**: User Profile Management  
- [⏳] **Task 2.3**: Frontend Authentication UI

#### Phase 3: Project Management System (Week 4-5)
- [⏳] **Task 3.1**: Project Upload System
- [⏳] **Task 3.2**: Project Listing & Management
- [⏳] **Task 3.3**: File Management & Security

#### Phase 4: Marketplace & Purchase Flow (Week 6-7)
- [⏳] **Task 4.1**: Public Marketplace Interface
- [⏳] **Task 4.2**: Payment Integration
- [⏳] **Task 4.3**: Download System

#### Phase 5: Admin Panel & Moderation (Week 8)
- [⏳] **Task 5.1**: Admin Dashboard
- [⏳] **Task 5.2**: Content Moderation System

#### Phase 6: Reviews & Advanced Features (Week 9-10)
- [⏳] **Task 6.1**: Review & Rating System
- [⏳] **Task 6.2**: Analytics & Reporting

#### Phase 7: Optimization & Deployment (Week 11-12)
- [⏳] **Task 7.1**: Performance Optimization
- [⏳] **Task 7.2**: Security Hardening
- [⏳] **Task 7.3**: Production Deployment

### 🎯 Current Status
- **Completed**: 1/25 tasks
- **In Progress**: 1/25 tasks
- **Next Up**: Environment Configuration & Database Setup

> **📋 For detailed task descriptions, acceptance criteria, and step-by-step instructions, see [TASKS.md](TASKS.md)**

## 🔒 Security Features

- **File Scanning**: Automated malware detection on uploads
- **Secure Downloads**: Expiring download links
- **Data Protection**: GDPR compliant data handling
- **Payment Security**: PCI DSS compliant payment processing
- **Authentication**: JWT-based secure authentication
- **Input Validation**: Comprehensive input sanitization

## 💳 Payment Integration

### Supported Payment Methods
- Razorpay (Credit/Debit Cards, UPI, Netbanking)
- Paytm Wallet
- UPI Direct

### Payout System
- Minimum withdrawal: ₹500
- Processing time: 2-7 business days
- Supported: Bank transfer, UPI

## 📊 Analytics & Reporting

### Seller Analytics
- Sales performance
- Download statistics
- Revenue tracking
- Popular projects

### Admin Analytics
- Platform revenue
- User growth
- Transaction volumes
- Content moderation stats

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 API Documentation

API documentation is available at `/api/docs` when running the backend server.

### Key Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/projects` - List projects
- `POST /api/projects` - Upload project (sellers only)
- `POST /api/payments/create-order` - Create payment order
- `GET /api/admin/stats` - Admin analytics

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway/Heroku)
1. Create new project on Railway/Heroku
2. Connect your GitHub repository
3. Set environment variables
4. Deploy and configure database

## 📞 Support

For technical support or questions:
- Email: support@vibecoder.com
- Documentation: [Link to docs]
- Issues: [GitHub Issues URL]

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for the Indian coding community**
